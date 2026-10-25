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
   '<p>'+esc(readerFriendly(item.description||item.short_description||'事件发生于这一时期。'))+'</p>';
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
  const metas=(storyByEvent.get(item.id)||[]).map(id=>storyMeta.get(id)).filter(Boolean);
  if(!metas.length)return '';
  const choices=metas.map(meta=>
   '<button type="button" class="major-story-enter" data-story-open="'+esc(meta.id)+'" data-story-source="'+esc(item.id)+'">'+
   '<span>'+esc(meta.title)+'</span><span aria-hidden="true">›</span></button>').join('');
  return '<section class="major-story-entry" aria-label="相关重大历史专题">'+
   '<span class="major-story-eyebrow">相关重大历史专题</span>'+choices+
   (metas.length===1?'<small>'+esc(metas[0].period)+' · 了解战争的前因、经过及后果</small>':'')+'</section>';
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
 function readerFriendly(text){
  // Narrative layer only: leave factual/source precision fields in JSON and Git history.
  // Remove purely editorial map/software and historiography footnotes from prose.
  const editorial=/(?:在地图|地图上|地图中|地图的|地图只|地图标|地图绘|现有地图|现已将|经纬度|坐标|GIS|GPS|现存地图|该图层|现代参考|实测|地理配准|不能画|不应画|绘图|绘制|本研究|本资料库|本专题|史料.*(?:争议|差异|核证)|学者.*(?:争论|不同|认为)|现代研究.*(?:认为|发现)|后世作者|证据边界|暂不|不能由.*地图|无法根据.*地图|部分现代学者|学术上|史学家|研究者.*(?:争议|认为)|文献之间|研究意见)/;
  const clauses=String(text||'').match(/[^。！？]+[。！？]?/g)||[];
  const clean=clauses.filter(clause=>clause.includes('[[')||!editorial.test(clause)).join('').trim();
  return clean||String(text||'');
 }
 function quantitativeHistoryHtml(article){
  // Optional story-only historical table. The data declares its own population,
  // time window, national carrier, metric and source; never synthesize annual dots.
  const q=article.quantitative_summary;
  if(!q||!Array.isArray(q.rows)||!q.total||q.rows.length===0)return '';
  const num=value=>Number.isFinite(value)?Number(value).toLocaleString('en-US'):'未核实';
  const carrierRows=q.rows.map(row=>'<tr><th scope="row">'+esc(row.period)+'</th><td>'+num(row.embarked)+'</td><td>'+num(row.all_carriers_embarked)+'</td></tr>').join('');
  const ra=q.cohort,rb=q.second_cohort;
  const cohort=ra?'<p class="story-stat-cohort"><strong>'+esc(ra.operator)+'（'+esc(ra.period)+'）</strong>：'+num(ra.documented_voyages)+'次有记录航次；登船'+num(ra.recorded_embarked)+'人，抵岸'+num(ra.recorded_disembarked)+'人，差额'+num(ra.embarked_minus_disembarked)+'人。<a href="'+esc(ra.source_url)+'" target="_blank" rel="noopener noreferrer">航次统计来源</a></p><p class="story-stat-note">'+esc(ra.warning)+'</p>':'';
  const second=rb?'<p class="story-stat-cohort"><strong>'+esc(rb.operator)+'（'+esc(rb.period)+'）</strong>：估计运送约'+num(rb.people_transported_low)+'—'+num(rb.people_transported_high)+'人，年均约'+num(rb.avg_voyages_per_year)+'次航运。<a href="'+esc(rb.source_url)+'" target="_blank" rel="noopener noreferrer">史密森尼馆藏说明</a></p><p class="story-stat-note">'+esc(rb.warning)+'</p>':'';
  const cost=q.cohort_human_cost;
  const costs=cost?'<p class="story-stat-cohort"><strong>'+esc(cost.operator)+'</strong>：男性约'+num(cost.male_pct_approx)+'%；'+num(cost.children_age_at_most)+'岁及以下儿童约'+num(cost.children_pct_approx)+'%；历史牙买加特定类别平均售价约£'+num(cost.historical_jamaica_prime_male_sale_price_gbp_average)+'。<a href="'+esc(cost.source_url)+'" target="_blank" rel="noopener noreferrer">人口与价格研究</a></p><p class="story-stat-note">'+esc(cost.warning)+'</p>':'';
  const named=q.verified_voyage_example;
  const namedHtml=named?'<h4>另一个已证船次：'+esc(String(named.year))+'年'+esc(named.vessel)+'号</h4><p class="story-stat-cohort"><strong>SlaveVoyages 单航次'+num(named.official_voyage_id)+'</strong>：被迫登船'+num(named.embarked)+'人；抵岸（数据库推算）'+num(named.disembarked_imputed)+'人；途中死亡（数据库推算）'+num(named.dead_imputed)+'人；航次记载'+esc(named.resistance)+'。<a href="'+esc(named.source_url)+'" target="_blank" rel="noopener noreferrer">官方具体航次记录</a></p><p class="story-stat-note">'+esc(named.warning)+'</p>':'';
  const rs=q.resistance_case_reference;
  const site=rs?.site;
  const siteHtml=site?'<h4>1681年·非洲沿岸拘禁场所的反抗</h4><p class="story-stat-cohort"><strong>'+esc(site.location)+'</strong>：殖民方报告被囚'+num(site.held)+'人，镇压致死'+num(site.colonial_claim_killed)+'人、受伤'+num(site.colonial_claim_wounded)+'人。<a href="'+esc(site.source_url)+'" target="_blank" rel="noopener noreferrer">原信学术引录</a></p><p class="story-stat-note">'+esc(site.warning)+'</p>':'';
  const smaller=Array.isArray(rs?.voyages)?rs.voyages.map(v=>'<p class="story-stat-cohort"><strong>'+esc(String(v.year))+'年'+esc(v.vessel)+'号（航次'+num(v.voyage_id)+'）</strong>：被迫登船'+num(v.embarked)+'人，抵岸'+num(v.landed)+'人；登记船上起义。<a href="'+esc(v.source_url)+'" target="_blank" rel="noopener noreferrer">'+esc(v.evidence)+'</a></p><p class="story-stat-note">'+esc(v.warning)+'</p>').join(''):'';
  const specific=rs?.albion_revolt_killed_secondary;
  const specificHtml=specific?'<p class="story-stat-cohort"><strong>同船反抗特定伤亡的二次史学记录</strong>：被奴役者'+num(specific.enslaved_people)+'人、船员'+num(specific.crew)+'人。<a href="'+esc(specific.source_url)+'" target="_blank" rel="noopener noreferrer">学术出版书目</a></p><p class="story-stat-note">'+esc(specific.source_level)+'。'+esc(specific.warning)+'</p>':'';
  const census=q.resistance_census_2019;
  const censusRows=Array.isArray(census?.documented_examples)?census.documented_examples.map(v=>
    '<tr><th scope="row">'+esc(String(v.year))+'</th><td>'+esc(v.ship)+'</td><td>'+num(v.id)+'</td><td>'+esc(v.code===1?'船上起义':v.code===2?'沿岸袭船':'其他（核实编码）')+'</td></tr>'
  ).join(''):'';
  const censusHtml=census?
    '<h4>2019版航次数据库：留有记录的反抗</h4>'+
    '<p class="story-stat-cohort"><strong>'+esc(census.dataset_label)+'</strong>：全部船旗有记录航次'+num(census.recorded_all_carriers_voyages)+'条，其中英国推定船旗'+num(census.recorded_british_flag_voyages)+'条；英旗非空反抗编码'+num(census.british_coded_resistance)+'条（船上起义'+num(census.british_coded_ship_insurrections)+'条；岸上袭船'+num(census.british_coded_shore_vessel_attacks)+'条）。</p>'+
    '<details class="story-stat-census"><summary>查看'+num(census.british_coded_resistance)+'条有记录的英国旗反抗航次（非全量估计）</summary>'+
    '<table class="story-stat-table"><caption>2019版航次库编码记录 · 年份和船旗可能经推定</caption><thead><tr><th scope="col">抵岸年份</th><th scope="col">登记船名</th><th scope="col">航次编号</th><th scope="col">抵抗类型</th></tr></thead><tbody>'+censusRows+'</tbody></table></details>'+
    '<p class="story-stat-note">'+esc(census.warning)+' <a href="'+esc(census.source_url)+'" target="_blank" rel="noopener noreferrer">官方2019版航次数据</a> · <a href="'+esc(census.codebook_url)+'" target="_blank" rel="noopener noreferrer">编码手册</a></p>':'';
  return '<section class="story-statistics" aria-label="历史人口强制运输数据与史料口径">'+
    '<h3>'+esc(q.title)+'</h3><p class="story-stat-measure">'+esc(q.measure)+'；'+esc(q.carrier)+'</p>'+
    '<table class="story-stat-table"><caption>同一来源的25年期人数估算 · 不能作为逐年记录</caption><thead><tr><th scope="col">时期</th><th scope="col">英船旗登船</th><th scope="col">全部船旗登船</th></tr></thead><tbody>'+carrierRows+
    '<tr class="story-stat-total"><th scope="row">'+esc(q.total.period)+'合计</th><td>'+num(q.total.embarked)+'</td><td>'+num(q.total.all_carriers_embarked)+'</td></tr></tbody></table>'+
    '<p class="story-stat-note">'+esc(q.period_note)+' <a href="'+esc(q.source_url)+'" target="_blank" rel="noopener noreferrer">'+esc(q.source_label)+'</a></p>'+
    '<h4>另一个统计口径：皇家非洲公司具体航次</h4>'+cohort+second+costs+namedHtml+siteHtml+smaller+specificHtml+censusHtml+'</section>';
 }
 function storyHtml(article){
  const relatedStories=(article.related_story_ids||[]).map(id=>storyMeta.get(id)).filter(Boolean)
   .map(meta=>'<button type="button" class="major-story-enter" data-story-open="'+esc(meta.id)+'" data-story-source="'+esc(sourceEventId||'')+'"><span>'+esc(meta.title)+'</span><span aria-hidden="true">›</span></button>')
   .join('');
  const relatedMarkup=relatedStories?'<section class="major-story-entry" aria-label="延伸阅读"><span class="major-story-eyebrow">相关重大历史专题</span>'+relatedStories+'</section>':'';
  return '<article class="major-story-article" data-story-id="'+esc(article.id)+'">'+
    '<header class="major-story-header"><button type="button" class="story-back" data-story-return="1">← 返回原事件</button>'+ 
    '<div class="dossier-kicker">重大历史专题 · '+esc(article.region)+'</div>'+
    '<h2>'+esc(article.title)+'</h2>'+
    '<p class="story-subtitle">'+esc(article.subtitle)+'</p>'+
    '<p class="story-lead">'+esc(article.lead)+'</p></header>'+relatedMarkup+quantitativeHistoryHtml(article)+
    '<details class="story-toc"><summary>阅读目录 · '+article.sections.length+'节 <span aria-hidden="true">▾</span></summary>'+
    '<nav aria-label="专题文章目录">'+article.sections.map((sec,i)=>'<button type="button" data-story-section="'+esc(sec.id)+'">'+(i+1)+'. '+esc(sec.heading.replace(/^[一二三四五六七八九十]+、/,''))+'</button>').join('')+'</nav></details>'+
    '<div class="story-body">'+article.sections.map(sec=>
     '<section class="story-section" id="story-section-'+esc(sec.id)+'"><h3>'+esc(sec.heading)+'</h3>'+
      sec.paragraphs.map(p=>'<p>'+renderInline(readerFriendly(p))+'</p>').join('')+
     '</section>').join('')+'</div>'+
    '<details class="story-sources"><summary>参考资料 · '+article.sources.length+'项 <span aria-hidden="true">▾</span></summary>'+


    '<div class="source-list">'+article.sources.map(s=>'<a class="source-link" href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.label)+' ↗</a>'+
      '').join('')+'</div>'+
    '</details>'+
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
   sourceEventId=current&&eventInMemory(current)?current:
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
  if(desired!==bridge.currentYear()||!bridge.activeHasEvent(item.id)){
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
   function registerStory(story){
    if(!story||typeof story.id!=='string'||typeof story.file!=='string'||storyMeta.has(story.id))return;
    storyMeta.set(story.id,story);
    for(const id of story.event_ids||[]){
     if(typeof id!=='string')continue;
     const choices=storyByEvent.get(id)||[];
     if(!choices.includes(story.id))choices.push(story.id);
     storyByEvent.set(id,choices);
    }
   }
   for(const story of index.stories||[])registerStory(story);
   // Long-running histories are keyed by one stable parent ID rather than one
   // new article every ten years. The existing decade/year atlas stays intact.
   // The independent serial manifest is OPTIONAL; research records never render.
   try{
    const serialRes=await fetch('data/stories/serial/index.json',{cache:'no-store'});
    if(serialRes.ok){
     const serial=await serialRes.json();
     if(serial.schema==='atlas-serial-stories-v1'){
      for(const topic of serial.topics||[]){
       if(topic.status!=='published'||topic.publication_review!=='approved')continue;
       if(typeof topic.id!=='string'||!/^[A-Za-z0-9-]+$/.test(topic.id))continue;
       if(typeof topic.article_file!=='string'||!topic.article_file.startsWith('data/stories/serial/')||
          !/^[a-z0-9-]+[.]json$/.test(topic.article_file.slice('data/stories/serial/'.length)))continue;
       if(!Array.isArray(topic.event_ids))continue;
       registerStory({
        id:topic.id,title:topic.title,file:topic.article_file,
        origin_year:topic.origin_year,region:topic.region||'',event_ids:topic.event_ids,
        period:topic.period||String(topic.origin_year||'')+'年起',
        is_serial_topic:true
       });
      }
     }
    }
   }catch(_serialError){ /* No published long story yet; old articles remain available. */ }
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
