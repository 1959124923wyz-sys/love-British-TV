/* Major-history-story pilot: optional second-level reading inside existing dossier.
   Plain-text content + escaped event tokens, no HTML supplied by the JSON. */
(function(){
 'use strict';
 const manifestUrl='data/stories/index.json';
 const storyByEvent=new Map();
 const storyMeta=new Map();
 const storyCache=new Map();
 let sourceEventId=null, lastStoryId=null, readingScroll=0, returnStoryId=null;
 let clickTimer=null, requestSerial=0, preview=null;
 function closePreview(){if(preview){preview.remove();preview=null;}}
 // Inline map records without coordinates get a small non-modal summary.
 function showUnlocatedPreview(item,anchor){
  closePreview();
  const card=document.createElement('section');
  card.className='story-event-preview';
  card.setAttribute('role','dialog');
  card.setAttribute('aria-modal','false');
  card.setAttribute('aria-label','事件简介：'+item.name);
  card.innerHTML='<button type="button" class="story-preview-close" aria-label="关闭事件简介" data-story-preview-close="1">×</button>'+
   '<small>'+esc(item.year)+'年 · 历史事件</small>'+
   '<h3>'+esc(item.name)+'</h3>'+
   '<p>'+esc(item.description||item.short_description||'已有史料记录这一事件。')+'</p>';
  document.body.appendChild(card);
  preview=card;
  const rect=anchor?.getBoundingClientRect?.()||activeBody().getBoundingClientRect();
  const w=card.offsetWidth,h=card.offsetHeight,margin=12;
  const x=Math.max(margin,Math.min(window.innerWidth-w-margin,rect.right+12+w<window.innerWidth-margin?rect.right+12:rect.left-w-12));
  const y=Math.max(margin,Math.min(window.innerHeight-h-margin,rect.bottom+12+h<window.innerHeight-margin?rect.bottom+12:rect.top-h-12));
  card.style.left=Math.round(x)+'px';
  card.style.top=Math.round(y)+'px';
 }
 function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});}
 function activeBody(){return document.getElementById('dossierBody');}
 function eventInMemory(id){return window.atlasStoryBridge?.eventById?.(id)||null;}
 function isLinkedEvent(item,typ){return typ==='event'&&Boolean(item&&storyByEvent.has(item.id));}
 function linkMarkupForEvent(item,typ){
  if(typ!=='event')return '';
  const id=storyByEvent.get(item.id),meta=storyMeta.get(id);
  if(!meta)return '';
  return '<section class="major-story-entry" aria-label="相关重大历史专题">'+
   '<span class="major-story-eyebrow">相关重大历史专题</span>'+
   '<button type="button" class="major-story-enter" data-story-open="'+esc(id)+'" data-story-source="'+esc(item.id)+'">'+
   '<span>'+esc(meta.title)+'</span><span aria-hidden="true">›</span></button>'+
   '<small>'+esc(meta.period)+' · 了解战争的前因、经过及后果</small></section>';
 }
 function onEventOpened(item,typ){
  closePreview();
  document.getElementById('workspace').classList.remove('story-reading');
  if(typ!=='event')returnStoryId=null;
  if(!returnStoryId||!storyMeta.has(returnStoryId))return;
  const body=activeBody();
  if(!body)return;
  body.insertAdjacentHTML('afterbegin','<button type="button" class="story-back" data-story-back="1">← 返回重大历史专题</button>');
 }
 function onReset(){
  closePreview();
  document.getElementById('workspace').classList.remove('story-reading');
  returnStoryId=null;
  sourceEventId=null;
  lastStoryId=null;
 }
 function renderInline(text){
  const regex=/\[\[([A-Za-z0-9-]+)\|([^\]\n]{1,90})\]\]/g;
  let last=0,out='',match;
  while((match=regex.exec(text))){
   out+=esc(text.slice(last,match.index));
   const id=match[1],label=match[2];
   out+='<button type="button" class="story-event-link" data-story-event="'+esc(id)+'" title="单击定位或查看简介，双击阅读详情">'+esc(label)+'</button>';
   last=regex.lastIndex;
  }
  return out+esc(text.slice(last));
 }
 function storyHtml(article){
  return '<article class="major-story-article" data-story-id="'+esc(article.id)+'">'+
    '<header class="major-story-header"><button type="button" class="story-back" data-story-return="1">← 返回原事件</button>'+
    '<div class="dossier-kicker">重大历史专题 · '+esc(article.region)+'</div>'+
    '<h2>'+esc(article.title)+'</h2>'+
    '<p class="story-subtitle">'+esc(article.subtitle)+'</p>'+
    '<p class="story-lead">'+esc(article.lead)+'</p></header>'+
    '<details class="story-toc"><summary>阅读目录 · '+article.sections.length+'节 <span aria-hidden="true">▾</span></summary>'+
    '<nav aria-label="专题文章目录">'+article.sections.map((sec,i)=>'<button type="button" data-story-section="'+esc(sec.id)+'">'+(i+1)+'. '+esc(sec.heading.replace(/^[一二三四五六七八九十]+、/,''))+'</button>').join('')+'</nav></details>'+
    '<div class="story-body">'+article.sections.map(sec=>
     '<section class="story-section" id="story-section-'+esc(sec.id)+'"><h3>'+esc(sec.heading)+'</h3>'+
      sec.paragraphs.map(p=>'<p>'+renderInline(p)+'</p>').join('')+
     '</section>').join('')+'</div>'+
    '<details class="story-sources"><summary>历史资料与考证 · '+article.sources.length+'项 <span aria-hidden="true">▾</span></summary>'+
    '<p>'+esc(article.reading_note)+'</p>'+
    '<div class="source-list">'+article.sources.map(s=>'<a class="source-link" href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.label)+' ↗</a>'+
      '<small>'+esc(s.access)+'</small>').join('')+'</div>'+
    '<p>'+esc(article.map_note)+'</p></details>'+
    '<footer class="story-footer"><button type="button" class="story-back" data-story-return="1">← 返回原事件</button></footer>'+
   '</article>';
 }
 async function openStory(id,restore,originId){
  const meta=storyMeta.get(id);if(!meta)return;
  if(!restore){
   // Anchor the return path to the exact child from which this article opened.
   // The selected map event can change as the reader explores links and years.
   const current=originId||window.atlasStoryBridge?.selectedEventId?.()||null;
   const metaEventIds=meta.event_ids||[];
   sourceEventId=current&&storyByEvent.get(current)===id?current:
     metaEventIds.find(eventId=>eventInMemory(eventId))||null;
   readingScroll=0;
  }
  closePreview();
  returnStoryId=null;lastStoryId=id;
  document.getElementById('workspace').classList.add('story-reading');
  window.atlasStoryBridge?.clearSelectedEventYear?.();
  const container=activeBody();
  container.innerHTML='<p class="loading">正在打开历史专题……</p>';
  window.atlasStoryBridge?.showDossier?.();
  const serial=++requestSerial;
  try{
   let story=storyCache.get(id);
   if(!story){const res=await fetch(meta.file,{cache:'no-store'});if(!res.ok)throw new Error('article not available');story=await res.json();if(story.id!==id)throw new Error('article identifier mismatch');storyCache.set(id,story);}
   if(serial!==requestSerial)return;
   container.innerHTML=storyHtml(story);
   container.scrollTop=restore?readingScroll:0;
   if(restore){requestAnimationFrame(()=>{container.scrollTop=readingScroll});}
  }catch(err){
   if(serial!==requestSerial)return;
   container.innerHTML='<p>历史专题暂时无法读取，请稍后再试。</p><button class="story-back" type="button" data-story-return="1">← 返回原事件</button>';
  }
 }
 // Inline article links are deliberate navigation requests; a future event
 // advances the timeline to its own year without disclosing unsourced geography.
 function navigateToEventYear(item){
  const bridge=window.atlasStoryBridge;
  if(!bridge)return false;
  const desired=Number(item.year);
  if(!Number.isFinite(desired))return false;
  if(desired>bridge.currentYear()||!bridge.activeHasEvent(item.id)){
   bridge.clearSelectedEventYear();
   bridge.setYear(desired);
  }
  return bridge.activeHasEvent(item.id)&&bridge.currentYear()>=desired;
 }
 function focusStoryEvent(item,anchor){
  if(!item||!navigateToEventYear(item))return;
  readingScroll=activeBody().scrollTop;
  if(!Number.isFinite(item.lat)||!Number.isFinite(item.lng)){
   showUnlocatedPreview(item,anchor);
   return;
  }
  closePreview();
  window.atlasStoryBridge.focusEvent(item,{keepDossier:true});
 }
 function doubleOpen(item){
  if(!item||!navigateToEventYear(item))return;
  closePreview();
  readingScroll=activeBody().scrollTop;
  returnStoryId=lastStoryId;
  window.atlasStoryBridge.openEvent(item);
 }
 async function returnToOrigin(){
  const meta=storyMeta.get(lastStoryId);
  const fallbackId=(meta?.event_ids||[]).find(id=>eventInMemory(id));
  const item=eventInMemory(sourceEventId)||eventInMemory(fallbackId);
  if(item){
   const bridge=window.atlasStoryBridge;
   // "Return to original event" restores its own year, not the last year
   // visited while reading later or earlier events in the article.
   bridge.clearSelectedEventYear();
   if(bridge.currentYear()!==Number(item.year))bridge.setYear(item.year);
   if(bridge.activeHasEvent(item.id)){
    returnStoryId=null;
    bridge.openEvent(item);
    return;
   }
  }
  // Never exit the article into a blank sidebar when its source is unavailable.
  // This can occur if story data and atlas data are temporarily out of sync.
  if(lastStoryId)await openStory(lastStoryId,true);
 }
 document.addEventListener('click',function(e){
  const el=e.target.closest('[data-story-open],[data-story-event],[data-story-back],[data-story-return],[data-story-section],[data-story-preview-close]');
  if(!el){
   if(preview&&!e.target.closest('.story-event-preview'))closePreview();
   return;
  }
  if(el.hasAttribute('data-story-preview-close')){closePreview();return;}
  if(el.hasAttribute('data-story-open')){openStory(el.dataset.storyOpen,false,el.dataset.storySource);return;}
  if(el.hasAttribute('data-story-back')){openStory(returnStoryId||lastStoryId,true);return;}
  if(el.hasAttribute('data-story-return')){returnToOrigin();return;}
  if(el.hasAttribute('data-story-section')){
   closePreview();
   const anchor=document.getElementById('story-section-'+el.dataset.storySection);
   if(anchor)anchor.scrollIntoView({block:'start',behavior:'smooth'});
   return;
  }
  if(el.hasAttribute('data-story-event')){
   if(clickTimer!==null)clearTimeout(clickTimer);
   const id=el.dataset.storyEvent,anchor=el;
   clickTimer=setTimeout(function(){clickTimer=null;focusStoryEvent(eventInMemory(id),anchor);},285);
  }
 });
 document.addEventListener('keydown',function(e){if(e.key==='Escape')closePreview();});
 activeBody().addEventListener('scroll',closePreview,{passive:true});
 document.addEventListener('dblclick',function(e){
  const el=e.target.closest('[data-story-event]');
  if(!el)return;
  e.preventDefault();
  if(clickTimer!==null){clearTimeout(clickTimer);clickTimer=null;}
  doubleOpen(eventInMemory(el.dataset.storyEvent));
 });
 async function init(){
  try{
   const res=await fetch(manifestUrl,{cache:'no-store'});if(!res.ok)throw new Error('missing story manifest');
   const index=await res.json();
   for(const story of index.stories||[]){
    storyMeta.set(story.id,story);
    for(const id of story.event_ids||[])storyByEvent.set(id,story.id);
   }
   // An event may already be open while the optional manifest is loading.
   const current=window.atlasStoryBridge?.selectedEventId?.();
   if(current&&storyByEvent.has(current))activeBody()?.querySelector('.source-details')?.remove();
   // An archive may already be open while the optional manifest is loading.
   if(window.atlasStoryBridge?.selectedEventId?.()){
    const record=eventInMemory(window.atlasStoryBridge.selectedEventId()),body=activeBody();
    if(record&&body&&!body.querySelector('.major-story-entry')){
     const markup=linkMarkupForEvent(record,'event');
     const p=body.querySelector('h2+p');
     if(markup&&p)p.insertAdjacentHTML('afterend',markup);
    }
   }
  }catch(err){ /* Reading library is optional; the entire original atlas keeps working. */ }
 }
 window.HistoryStories={eventLinkMarkup:linkMarkupForEvent,isLinkedEvent:isLinkedEvent,onEventOpened:onEventOpened,onReset:onReset,openStory:openStory};
 init();
})();
