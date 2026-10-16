/* Major-history-story pilot: optional second-level reading inside existing dossier.
   Plain-text content + escaped event tokens, no HTML supplied by the JSON. */
(function(){
 'use strict';
 const manifestUrl='data/stories/index.json';
 const storyByEvent=new Map();
 const storyMeta=new Map();
 const storyCache=new Map();
 let sourceEventId=null, lastStoryId=null, readingScroll=0, returnStoryId=null;
 let clickTimer=null, requestSerial=0;
 function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});}
 function activeBody(){return document.getElementById('dossierBody');}
 function eventInMemory(id){return window.atlasStoryBridge?.eventById?.(id)||null;}
 function linkMarkupForEvent(item,typ){
  if(typ!=='event')return '';
  const id=storyByEvent.get(item.id),meta=storyMeta.get(id);
  if(!meta)return '';
  return '<section class="major-story-entry" aria-label="相关重大历史专题">'+
   '<span class="major-story-eyebrow">相关重大历史专题</span>'+
   '<button type="button" class="major-story-enter" data-story-open="'+esc(id)+'">'+
   '<span>'+esc(meta.title)+'</span><span aria-hidden="true">›</span></button>'+
   '<small>'+esc(meta.period)+' · 了解战争的前因、经过及后果</small></section>';
 }
 function onEventOpened(item,typ){
  document.getElementById('workspace').classList.remove('story-reading');
  if(typ!=='event')returnStoryId=null;
  if(!returnStoryId||!storyMeta.has(returnStoryId))return;
  const body=activeBody();
  if(!body)return;
  body.insertAdjacentHTML('afterbegin','<button type="button" class="story-back" data-story-back="1">← 返回重大历史专题</button>');
 }
 function onReset(){
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
   out+='<button type="button" class="story-event-link" data-story-event="'+esc(id)+'" title="单击定位，双击查看详情">'+esc(label)+'</button>';
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
    '<div class="story-status" id="storyStatus" role="status" aria-live="polite" hidden></div>'+
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
 async function openStory(id,restore){
  const meta=storyMeta.get(id);if(!meta)return;
  if(!restore){
   const current=window.atlasStoryBridge?.selectedEventId?.()||null;
   if(current&&storyByEvent.get(current)===id)sourceEventId=current;
   readingScroll=0;
  }
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
 function showStatus(message,targetEvent){
  const status=document.getElementById('storyStatus');if(!status)return;
  status.hidden=false;
  status.innerHTML='<span>'+esc(message)+'</span>'+
   (targetEvent?'<button type="button" data-story-year="'+esc(targetEvent.id)+'">切换到'+esc(targetEvent.year)+'年查看 →</button>':'');
  // Preserve the paragraph position when reporting a map action.
 }
 function focusStoryEvent(item){
  if(!item)return;
  const inChapter=window.atlasStoryBridge?.activeHasEvent?.(item.id);
  if(!inChapter||item.year>window.atlasStoryBridge.currentYear()){
   showStatus('该事件属于'+item.year+'年；切换年份后才能在地图上定位。',item);return;
  }
  if(!Number.isFinite(item.lat)||!Number.isFinite(item.lng)){
   showStatus('这一事件没有经过确认的参考坐标，仍可双击阅读史料。');return;
  }
  readingScroll=activeBody().scrollTop;
  window.atlasStoryBridge.focusEvent(item,{keepDossier:true});
  showStatus('已定位：'+item.name+'。双击文中事件可阅读独立史料。');
 }
 function doubleOpen(item){
  if(!item)return;
  if(!window.atlasStoryBridge?.activeHasEvent?.(item.id)||item.year>window.atlasStoryBridge.currentYear()){showStatus('请先切换到'+item.year+'年，再查看该事件。',item);return;}
  readingScroll=activeBody().scrollTop;
  returnStoryId=lastStoryId;
  window.atlasStoryBridge.openEvent(item);
 }
 async function returnToOrigin(){
  const item=eventInMemory(sourceEventId);
  returnStoryId=null;
  if(item && window.atlasStoryBridge?.activeHasEvent?.(item.id)&&item.year<=window.atlasStoryBridge.currentYear()){window.atlasStoryBridge.openEvent(item);return;}
  document.getElementById('workspace').classList.remove('story-reading');
  window.atlasStoryBridge?.resetDossier?.();
  window.atlasStoryBridge?.showDossier?.();
 }
 document.addEventListener('click',function(e){
  const el=e.target.closest('[data-story-open],[data-story-event],[data-story-year],[data-story-back],[data-story-return],[data-story-section]');
  if(!el)return;
  if(el.hasAttribute('data-story-open')){openStory(el.dataset.storyOpen,false);return;}
  if(el.hasAttribute('data-story-back')){openStory(returnStoryId||lastStoryId,true);return;}
  if(el.hasAttribute('data-story-return')){returnToOrigin();return;}
  if(el.hasAttribute('data-story-section')){
   const anchor=document.getElementById('story-section-'+el.dataset.storySection);
   if(anchor)anchor.scrollIntoView({block:'start',behavior:'smooth'});return;
  }
  if(el.hasAttribute('data-story-year')){
   const item=eventInMemory(el.dataset.storyYear);
   if(!item)return;
   window.atlasStoryBridge?.clearSelection?.();
   window.atlasStoryBridge?.setYear?.(item.year);
   if(Number.isFinite(item.lat)&&Number.isFinite(item.lng))window.atlasStoryBridge.focusEvent(item,{keepDossier:true});
   else showStatus('已切换到'+item.year+'年。此记录没有可靠地点坐标，可双击查看文字详情。');
   return;
  }
  if(el.hasAttribute('data-story-event')){
   if(clickTimer!==null)clearTimeout(clickTimer);
   const id=el.dataset.storyEvent;
   clickTimer=setTimeout(function(){clickTimer=null;focusStoryEvent(eventInMemory(id));},285);
  }
 });
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
 window.HistoryStories={eventLinkMarkup:linkMarkupForEvent,onEventOpened:onEventOpened,onReset:onReset,openStory:openStory};
 init();
})();
