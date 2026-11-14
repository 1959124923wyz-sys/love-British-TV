/* Major-history-story pilot: optional second-level reading inside existing dossier.
   Plain-text content + escaped event tokens, no HTML supplied by the JSON. */
(function(){
 'use strict';
 const manifestUrl='data/stories/index.json';
 const storyByEvent=new Map();
 const storyMeta=new Map();
 const storyCache=new Map();
 let sourceEventId=null, lastStoryId=null, readingScroll=0, returnStoryId=null;
 let chronologyExpanded=false;
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
   '<h3>'+esc(eventHeadline(item))+'</h3>'+
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
 function eventHeadline(item){return window.HistoryHeadlines?.eventTitle?.(item)||item?.name||'';}
 function storyHeadline(item){return window.HistoryHeadlines?.storyTitle?.(item)||item?.title||'';}
 function sectionHeadline(s){return window.HistoryHeadlines?.sectionTitle?.(s)||s;}
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
   '<span>'+esc(storyHeadline(meta))+'</span><span aria-hidden="true">›</span></button>').join('');
  return '<section class="major-story-entry" aria-label="相关重大历史专题">'+
   '<span class="major-story-eyebrow">相关重大历史专题</span>'+choices+
   (metas.length===1?'<small>'+esc(metas[0].period)+' · 了解战争的前因、经过及后果</small>':'')+'</section>';
 }
 function onEventOpened(item,typ){
  // Cancel in-flight article fetches when a different dossier opens.
  ++requestSerial;
  closePreview();
  document.getElementById('workspace').classList.remove('story-reading');
  if(typ!=='event')returnStoryId=null;
  if(!returnStoryId||!storyMeta.has(returnStoryId))return;
  const body=activeBody();
  if(!body)return;
  body.insertAdjacentHTML('afterbegin','<button type="button" class="story-back" data-story-back="1">← 返回重大历史专题</button>');
 }
 function onReset(){
  // Closing the dossier invalidates outstanding article fetches.
  ++requestSerial;
  closePreview();
  document.getElementById('workspace').classList.remove('story-reading');
  returnStoryId=null;
  sourceEventId=null;
  lastStoryId=null;
  chronologyExpanded=false;
 }
 function renderInline(text){
  const regex=/\[\[([A-Za-z0-9-]+)\|([^\]\n]{1,90})\]\]/g;
  let last=0,out='',match;
  while((match=regex.exec(text))){
   out+=esc(text.slice(last,match.index));
   const id=match[1],label=match[2];
   // Preserve literal quantities/measurements embedded in the author's source-linked
   // prose: shortening a 10-person transfer label must never erase the 10 people.
   const hasCriticalNumber=/\d[\d,.]*\s*(?:名|人|艘|吨|镑|英镑|英里|亩|英亩|%|％)/.test(label);
   const linked=eventInMemory(id),short=linked&&label.length>22&&!hasCriticalNumber?eventHeadline(linked):label;
   out+='<button type="button" class="story-event-link" data-story-event="'+esc(id)+
    '" title="'+esc(label)+' · 单击定位或查看简介，双击阅读详情">'+esc(short)+'</button>';
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
    '<tr><th scope="row">'+esc(String(v.year))+'</th><td>'+esc(v.ship)+'</td><td>'+num(v.id)+'</td><td>'+esc(v.code===1?'船上起义':v.code===2?'沿岸袭船':'其他（核实编码）')+'</td><td>'+num(v.embarked_imputed)+'</td><td>'+num(v.disembarked_imputed)+'</td></tr>'
  ).join(''):'';
  const censusHtml=census?
    '<h4>2019版航次数据库：留有记录的反抗</h4>'+
    '<p class="story-stat-cohort"><strong>'+esc(census.dataset_label)+'</strong>：全部船旗有记录航次'+num(census.recorded_all_carriers_voyages)+'条，其中英国推定船旗'+num(census.recorded_british_flag_voyages)+'条；英旗非空反抗编码'+num(census.british_coded_resistance)+'条（船上起义'+num(census.british_coded_ship_insurrections)+'条；岸上袭船'+num(census.british_coded_shore_vessel_attacks)+'条）。</p>'+
    '<details class="story-stat-census"><summary>查看'+num(census.british_coded_resistance)+'条有记录的英国旗反抗航次（非全量估计）</summary>'+
    '<table class="story-stat-table"><caption>2019版航次库编码记录 · 年份和船旗可能经推定</caption><thead><tr><th scope="col">抵岸年份</th><th scope="col">登记船名</th><th scope="col">航次编号</th><th scope="col">抵抗类型</th><th scope="col">登船人数 IMP</th><th scope="col">抵岸人数 IMP</th></tr></thead><tbody>'+censusRows+'</tbody></table></details>'+
    '<p class="story-stat-note">'+esc(census.warning)+' <a href="'+esc(census.source_url)+'" target="_blank" rel="noopener noreferrer">官方2019版航次数据</a> · <a href="'+esc(census.codebook_url)+'" target="_blank" rel="noopener noreferrer">编码手册</a></p>':'';
  const sameSource=q.resistance_census_2019?.crossedition_2020;
  const sameSourceHtml=sameSource?
    '<p class="story-stat-note"><strong>官方2020版复核：</strong>2019版具抵抗编码船次在2020版相同口径中没有增删；' +
    '但两版属同一编辑数据库，不构成两套独立原始目击文献。2020版有'+num(sameSource.sourceA_2020_prefix_truncations_in_17c_nonresistance_records)+'条17世纪船次SOURCEA索引前缀截短，应保留完整2019字段参考。' +
    '<a href="'+esc(sameSource.source_url)+'" target="_blank" rel="noopener noreferrer">官方2020版SPSS数据</a></p>':'';
  const law=q.colonial_counter_resistance_law_1699;
  const lawHtml=law?
    '<h4>1699年牙买加：镇压逃亡与反抗被编入财政激励</h4><p class="story-stat-cohort">'+
    '殖民法规定追捕队指挥官每月'+num(law.monthly_commander_gbp)+'英镑、军士'+num(law.monthly_sergeant_gbp)+
    '英镑、其他人员各'+num(law.monthly_ordinary_shillings)+'先令，并允许依已有奴役法规取得掠获物。'+
    '<a href="'+esc(law.source_url)+'" target="_blank" rel="noopener noreferrer">1699年法令转录</a></p>'+
    '<p class="story-stat-note">'+esc(law.warning)+'</p>':'';
  return '<section class="story-statistics" aria-label="历史人口强制运输数据与史料口径">'+
    '<h3>'+esc(q.title)+'</h3><p class="story-stat-measure">'+esc(q.measure)+'；'+esc(q.carrier)+'</p>'+
    '<table class="story-stat-table"><caption>同一来源的25年期人数估算 · 不能作为逐年记录</caption><thead><tr><th scope="col">时期</th><th scope="col">英船旗登船</th><th scope="col">全部船旗登船</th></tr></thead><tbody>'+carrierRows+
    '<tr class="story-stat-total"><th scope="row">'+esc(q.total.period)+'合计</th><td>'+num(q.total.embarked)+'</td><td>'+num(q.total.all_carriers_embarked)+'</td></tr></tbody></table>'+
    '<p class="story-stat-note">'+esc(q.period_note)+' <a href="'+esc(q.source_url)+'" target="_blank" rel="noopener noreferrer">'+esc(q.source_label)+'</a></p>'+
    '<h4>另一个统计口径：皇家非洲公司具体航次</h4>'+cohort+second+costs+namedHtml+siteHtml+smaller+specificHtml+censusHtml+sameSourceHtml+lawHtml+'</section>';
 }
 // Optional 17C topic index: every entry is a real published atlas event.
 // This is a navigation aid, not a continuous occupation chronology.
 function storyChronologyHtml(article){
  const meta=storyMeta.get(article.id);
  if(!meta?.is_serial_topic)return '';
  const found=[],seen=new Set();
  for(const id of meta.event_ids||[]){
   const item=eventInMemory(id),y=Number(item?.year);
   if(!item||seen.has(id)||!Number.isInteger(y)||y<1600)continue;
   seen.add(id);found.push(item);
  }
  if(found.length<2)return '';
  found.sort((a,b)=>a.year-b.year||String(a.id).localeCompare(String(b.id)));
  const decades=new Map(),years=new Set();
  for(const item of found){
   const y=Number(item.year),d=Math.floor(y/10)*10;
   years.add(y);
   if(!decades.has(d))decades.set(d,new Map());
   const byYear=decades.get(d);
   if(!byYear.has(y))byYear.set(y,[]);
   byYear.get(y).push(item);
  }
  const markup=[...decades].map(([decade,byYear])=>
   '<section class="story-chronology-decade"><h4>'+decade+'年代</h4>'+
   [...byYear].map(([y,items])=>
    '<div class="story-chronology-year"><h5>'+y+'年 <small>'+items.length+'项</small></h5>'+
    '<div class="story-chronology-events">'+items.map(item=>
     '<button type="button" class="story-chronology-event" data-story-index-event="'+esc(item.id)+'" title="'+esc(item.name)+' · 单击对照地图，双击打开事件档案">'+
     esc(eventHeadline(item))+'</button>').join('')+'</div></div>').join('')+
   '</section>').join('');
  return '<details class="story-chronology">'+
   '<summary>专题史事年表 · '+years.size+'个有据年份 / '+found.length+'项关联事件</summary>'+
   '<p class="story-chronology-note">单击事件定位年份；双击打开事件档案。</p>'+
   '<div class="story-chronology-scroll">'+markup+'</div></details>';
 }
 function storyHtml(article){
  // 17C predecessor links forward to the 18C successor ONLY in an explicit research preview.
  const oldStoryContinuation=article.id==='E6-T10-ACADIA'&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-C07-ACADIA-DEPORTATION')?['E18-C07-ACADIA-DEPORTATION']:[];
  const eicStoryContinuation=article.id==='E6-T12'&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T14-T15-BENGAL-1756-1773')?['E18-T14-T15-BENGAL-1756-1773']:[];
  const mysoreEicContinuation=article.id==='E6-T12'&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T17-MYSORE-WARS-PARTITION-1767-1799')?['E18-T17-MYSORE-WARS-PARTITION-1767-1799']:[];
  const marathaEicContinuation=article.id==='E6-T12'&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T18-MARATHA-ROHILLA-AWADH-1773-1782')?['E18-T18-MARATHA-ROHILLA-AWADH-1773-1782']:[];
  const carnaticEicContinuation=article.id==='E6-T12'&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T19-CARNATIC-HYDERABAD-PALAYAKKARAR-1746-1799')?['E18-T19-CARNATIC-HYDERABAD-PALAYAKKARAR-1746-1799']:[];
  const manilaEicContinuation=article.id==='E6-T12'&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T22-MANILA-INVASION-SACK-RANSOM-1762-1764')?['E18-T22-MANILA-INVASION-SACK-RANSOM-1762-1764']:[];
  const capeIndigenousContinuation=article.id==='E6-T12'&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T25-CAPE-INVASION-KHOEKHOE-XHOSA-1795-1799')?['E18-T25-CAPE-INVASION-KHOEKHOE-XHOSA-1795-1799']:[];
  const westAfricanSlaveryContinuation=['E6-T13','E6-T17-AFRICAN-FORTS','E6-T11-VOYAGES'].includes(article.id)&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T26-WEST-AFRICA-SLAVE-FORTS-1727-1792')?['E18-T26-WEST-AFRICA-SLAVE-FORTS-1727-1792']:[];
  const sierraLeoneContinuation=['E6-T13','E6-T17-AFRICAN-FORTS','E6-T11-VOYAGES'].includes(article.id)&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T27-SIERRA-LEONE-BUNCE-BLACK-SETTLERS-1728-1799')?['E18-T27-SIERRA-LEONE-BUNCE-BLACK-SETTLERS-1728-1799']:[];
  const indianFiscalContinuation=article.id==='E6-T12'&&
    new URLSearchParams(window.location.search).get('review18c')==='1'&&
    storyMeta.has('E18-T21-EIC-OPIUM-SALT-FAMINE-1761-1799')?['E18-T21-EIC-OPIUM-SALT-FAMINE-1761-1799']:[];
  const ceylonColonialContinuation=article.id==='E6-T12'&&
    new URLSearchParams(window.location.search).get('review18c')==='1'&&
    storyMeta.has('E18-T24-CEYLON-COASTAL-INVASION-KANDY-RESISTANCE-1791-1797')?['E18-T24-CEYLON-COASTAL-INVASION-KANDY-RESISTANCE-1791-1797']:[];
  const frontierArchiveContinuation=article.id==='E18-T34-T35-AUSTRALIA-FIRST-FLEET-1717-1799'&&
    new URLSearchParams(window.location.search).get('review18c')==='1'&&
    storyMeta.has('E18-T35-ABORIGINAL-FRONTIER-MASSACRE-1788-1799')?['E18-T35-ABORIGINAL-FRONTIER-MASSACRE-1788-1799']:[];
  const garifunaContinuation=article.id==='E6-T08'&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T05-GARIFUNA-STVINCENT-WAR-DEPORTATION-1763-1797')?['E18-T05-GARIFUNA-STVINCENT-WAR-DEPORTATION-1763-1797']:[];
  const fedonRebellionContinuation=article.id==='E18-T05-GARIFUNA-STVINCENT-WAR-DEPORTATION-1763-1797'&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T06-FEDON-GRENADA-HAITI-BRITISH-REPRESSION-1789-1798')?['E18-T06-FEDON-GRENADA-HAITI-BRITISH-REPRESSION-1789-1798']:[];
  const jamaicaStoryContinuation=article.id==='E6-T08'&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T03-T04-JAMAICA-MAROONS-1718-1799')?['E18-T03-T04-JAMAICA-MAROONS-1718-1799']:[];
  const atlanticContinuation=article.id==='E6-T11-VOYAGES'&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T01-T02-ATLANTIC-ZONG-1711-1799')?['E18-T01-T02-ATLANTIC-ZONG-1711-1799']:[];
  const irelandContinuation=['E6-T03-LAND-1642-1698','E6-T03-WILLIAMITE-WAR'].includes(article.id)&&
    new URLSearchParams(window.location.search).get('review18c')==='1'&&
    storyMeta.has('E18-T29-T30-IRELAND-PENAL-REBELLION-1704-1799')?['E18-T29-T30-IRELAND-PENAL-REBELLION-1704-1799']:[];
  const scotlandContinuation=['E6-T04-DARIEN','E6-T04-CONQUEST','E6-T04-GLENCOE'].includes(article.id)&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T31-T32-SCOTLAND-UNION-CULLODEN-1700-1799')?['E18-T31-T32-SCOTLAND-UNION-CULLODEN-1700-1799']:[];
  const virginiaNewYorkSlaveContinuation=['E6-T05','E6-T09-NY','E6-T09-CAR'].includes(article.id)&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T11-VIRGINIA-NEWYORK-STONO-SLAVERY-1702-1741')?['E18-T11-VIRGINIA-NEWYORK-STONO-SLAVERY-1702-1741']:[];
  const carolinaTuscaroraContinuation=['E6-T09-CAR','E18-T11-VIRGINIA-NEWYORK-STONO-SLAVERY-1702-1741'].includes(article.id)&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T09-TUSCARORA-YAMASEE-INDIGENOUS-CAPTIVITY-1702-1732')?['E18-T09-TUSCARORA-YAMASEE-INDIGENOUS-CAPTIVITY-1702-1732']:[];
  const sevenYearsContinuation=['E6-T10-ACADIA','E18-C07-ACADIA-DEPORTATION','E18-T09-TUSCARORA-YAMASEE-INDIGENOUS-CAPTIVITY-1702-1732'].includes(article.id)&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T08-SEVEN-YEARS-CHEROKEE-PONTIAC-PAXTON-1740-1775')?['E18-T08-SEVEN-YEARS-CHEROKEE-PONTIAC-PAXTON-1740-1775']:[];
  const lenapePurchaseContinuation=['E18-T08-SEVEN-YEARS-CHEROKEE-PONTIAC-PAXTON-1740-1775'].includes(article.id)&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T10-WALKING-PURCHASE-LENAPE-LANCASTER-EASTON-1734-1762')?['E18-T10-WALKING-PURCHASE-LENAPE-LANCASTER-EASTON-1734-1762']:[];
  const revolution24Continuation=['E18-T08-SEVEN-YEARS-CHEROKEE-PONTIAC-PAXTON-1740-1775','E18-T11-VIRGINIA-NEWYORK-STONO-SLAVERY-1702-1741'].includes(article.id)&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T12-REVOLUTION-PRISON-SHIPS-BLACK-FREEDOM-1764-1796')?['E18-T12-REVOLUTION-PRISON-SHIPS-BLACK-FREEDOM-1764-1796']:[];
  const hudsonBay25Continuation=['E18-T12-REVOLUTION-PRISON-SHIPS-BLACK-FREEDOM-1764-1796'].includes(article.id)&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T13-HBC-NEWFOUNDLAND-BEOTHUK-DENE-CREE-1700-1792')?['E18-T13-HBC-NEWFOUNDLAND-BEOTHUK-DENE-CREE-1700-1792']:[];
  const bengalFamine26Continuation=['E18-T14-T15-BENGAL-1756-1773'].includes(article.id)&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T15-BENGAL-FAMINE-TAX-PEASANT-PETITIONS-1770-1772')?['E18-T15-BENGAL-FAMINE-TAX-PEASANT-PETITIONS-1770-1772']:[];
  const bengalLand27Continuation=['E18-T15-BENGAL-FAMINE-TAX-PEASANT-PETITIONS-1770-1772'].includes(article.id)&&
    new URLSearchParams(window.location.search).get('review18c')==='1'&&
    storyMeta.has('E18-T16-BENGAL-PERMANENT-SETTLEMENT-ADIVASI-PAIK-1760-1799')?['E18-T16-BENGAL-PERMANENT-SETTLEMENT-ADIVASI-PAIK-1760-1799']:[];
  const eicParliament28Continuation=['E18-T16-BENGAL-PERMANENT-SETTLEMENT-ADIVASI-PAIK-1760-1799'].includes(article.id)&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T20-EIC-PARLIAMENT-LOAN-MONOPOLY-1702-1793')?['E18-T20-EIC-PARLIAMENT-LOAN-MONOPOLY-1702-1793']:[];
  const penangT23Continuation=['E18-T20-EIC-PARLIAMENT-LOAN-MONOPOLY-1702-1793'].includes(article.id)&&
    new URLSearchParams(window.location.search).get('review18c')==='1'&&
    storyMeta.has('E18-T23-EIC-PENANG-KEDAH-ANDAMAN-AMBON-BANDA-1768-1796')?['E18-T23-EIC-PENANG-KEDAH-ANDAMAN-AMBON-BANDA-1768-1796']:[];
  const t28HavanaMaltaContinuation=['E18-T23-EIC-PENANG-KEDAH-ANDAMAN-AMBON-BANDA-1768-1796'].includes(article.id)&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T28-HAVANA-EGMONT-MALTA-1762-1799')?['E18-T28-HAVANA-EGMONT-MALTA-1762-1799']:[];
  const t33ScottishFreedomContinuation=['E18-T28-HAVANA-EGMONT-MALTA-1762-1799'].includes(article.id)&&
   new URLSearchParams(window.location.search).get('review18c')==='1'&&
   storyMeta.has('E18-T33-SCOTLAND-ENSLAVEMENT-CAPITAL-FREEDOM-1707-1792')?['E18-T33-SCOTLAND-ENSLAVEMENT-CAPITAL-FREEDOM-1707-1792']:[];
  const r33Dossiers=['E18-T33-SCOTLAND-ENSLAVEMENT-CAPITAL-FREEDOM-1707-1792'].includes(article.id)&&
   new URLSearchParams(window.location.search).get('review18c')==='1'?
   ["E18-R33-AWADH-BAHU-BEGAM-1765-1783","E18-R33-OLD-CALABAR-ROBIN-JOHNS-1766-1790","E18-R33-MIKMAQ-PEACE-TREATIES-1761"].filter(id=>storyMeta.has(id)):[];
  const relatedStories=[...(article.related_story_ids||[]),...oldStoryContinuation,
    ...eicStoryContinuation,...mysoreEicContinuation,...marathaEicContinuation,...carnaticEicContinuation,...manilaEicContinuation,...capeIndigenousContinuation,...westAfricanSlaveryContinuation,...sierraLeoneContinuation,...indianFiscalContinuation,...ceylonColonialContinuation,...frontierArchiveContinuation,...garifunaContinuation,...fedonRebellionContinuation,...virginiaNewYorkSlaveContinuation,...carolinaTuscaroraContinuation,...sevenYearsContinuation,...lenapePurchaseContinuation,...revolution24Continuation,...hudsonBay25Continuation,...bengalFamine26Continuation,...bengalLand27Continuation,...eicParliament28Continuation,...penangT23Continuation,...t28HavanaMaltaContinuation,...t33ScottishFreedomContinuation,...r33Dossiers,...jamaicaStoryContinuation,...atlanticContinuation,...irelandContinuation,...scotlandContinuation].map(id=>storyMeta.get(id)).filter(Boolean)
   .map(meta=>'<button type="button" class="major-story-enter" data-story-open="'+esc(meta.id)+'" data-story-source="'+esc(sourceEventId||'')+'"><span>'+esc(storyHeadline(meta))+'</span><span aria-hidden="true">›</span></button>')
   .join('');
  const relatedMarkup=relatedStories?'<section class="major-story-entry" aria-label="延伸阅读"><span class="major-story-eyebrow">相关重大历史专题</span>'+relatedStories+'</section>':'';
  return '<article class="major-story-article" data-story-id="'+esc(article.id)+'">'+
    '<header class="major-story-header"><button type="button" class="story-back" data-story-return="1">← 返回原事件</button>'+ 
    '<div class="dossier-kicker">重大历史专题 · '+esc(article.region)+'</div>'+
    '<h2>'+esc(storyHeadline(article))+'</h2>'+
    (storyHeadline(article)!==article.title?'<details class="atlas-complete-title"><summary>完整专题题名</summary><p>'+esc(article.title)+'</p></details>':'')+
    '<p class="story-subtitle">'+esc(article.subtitle)+'</p>'+
    '<p class="story-lead">'+esc(article.lead)+'</p></header>'+
    relatedMarkup+storyChronologyHtml(article)+quantitativeHistoryHtml(article)+
    '<div class="story-body">'+article.sections.map(sec=>
     '<section class="story-section" id="story-section-'+esc(sec.id)+'"><h3 title="'+esc(sec.heading)+'">'+esc(sectionHeadline(sec.heading))+'</h3>'+
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
   chronologyExpanded=false;
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
   if(restore){
    const chronology=container.querySelector('.major-story-article .story-chronology');
    if(chronology)chronology.open=chronologyExpanded;
   }
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
  chronologyExpanded=Boolean(activeBody().querySelector('.major-story-article .story-chronology')?.open);
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
  const el=e.target.closest('[data-story-open],[data-story-event],[data-story-index-event],[data-story-back],[data-story-return],[data-story-preview-close]');
  if(!el){
   if(preview&&!e.target.closest('.story-event-preview'))closePreview();
   return;
  }
  if(el.hasAttribute('data-story-preview-close')){closePreview();return;}
  if(el.hasAttribute('data-story-open')){openStory(el.dataset.storyOpen,false,el.dataset.storySource);return;}
  if(el.hasAttribute('data-story-back')){openStory(returnStoryId||lastStoryId,true);return;}
  if(el.hasAttribute('data-story-return')){returnToOrigin();return;}
  if(el.hasAttribute('data-story-event')||el.hasAttribute('data-story-index-event')){
   if(clickTimer!==null)clearTimeout(clickTimer);
   const id=el.dataset.storyEvent||el.dataset.storyIndexEvent,anchor=el;
   clickTimer=setTimeout(function(){clickTimer=null;focusStoryEvent(eventInMemory(id),anchor);},285);
  }
 });
 document.addEventListener('keydown',function(e){if(e.key==='Escape')closePreview();});
 activeBody().addEventListener('scroll',closePreview,{passive:true});
 document.addEventListener('dblclick',function(e){
  const el=e.target.closest('[data-story-event],[data-story-index-event]');
  if(!el)return;
  e.preventDefault();
  if(clickTimer!==null){clearTimeout(clickTimer);clickTimer=null;}
  doubleOpen(eventInMemory(el.dataset.storyEvent||el.dataset.storyIndexEvent));
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
   // The two predecessor stories remain reachable from the public opening chapters.
   const review=new URLSearchParams(window.location.search);
   const review18c=review.get('review18c')==='1'||review.get('review19c')==='1';
   try{
     const response=await fetch('data/stories/serial/preview-18c-index.json',{cache:'no-store'});
     if(response.ok){
      const draft=await response.json();
      if(draft.schema==='atlas-18c-story-review-index-v1'&&
         draft.editorial_status==='research_preview_not_published'&&
         draft.stories?.length===34&&draft.stories[0].status==='research_preview'&&
         draft.stories[0].publication_review==='not_submitted'&&
         draft.stories.every(t=>t.status==='research_preview'&&t.publication_review==='not_submitted'&&
          /^E18-[A-Z0-9-]+$/.test(t.id)&&/^data\/stories\/serial\/[a-z0-9-]+\.json$/.test(t.file)&&
          Array.isArray(t.event_ids)&&t.event_ids.length))
       for(const item of draft.stories){
        if(review18c||/^E18-T(?:24|25)-/.test(item.id))registerStory({...item,is_serial_topic:true});
       }
     }
   }catch(_previewError){ /* The 19C articles still load if predecessor data is unavailable. */ }
   // An event may already be open while the optional manifest is loading.
   const current=window.atlasStoryBridge?.selectedEventId?.();
   if(current&&storyByEvent.has(current)&&Number(eventInMemory(current)?.year)<1800)activeBody()?.querySelector('.source-details')?.remove();
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
