'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const quantitative=read('data/research/e6-t11-transatlantic-slavery-1601-1700-estimates.json');
const registry=read('data/stories/serial/index.json'),topic=registry.topics.find(t=>t.id==='E6-T11-VOYAGES');
assert(topic?.parent_topic_id==='E6-T11'&&topic.status==='published'&&topic.publication_review==='approved');
assert(registry.topics.find(t=>t.id==='E6-T11').status==='research_only','individual undocumented shipboard revolt cases not automatically published');
const article=read(topic.article_file);
assert(article.id===topic.id&&article.schema==='atlas-major-story-v1'&&article.sections.length===18);
assert(article.sources.length===18&&article.topic_source_claims.length===18);
assert(article.sections.flatMap(s=>s.paragraphs).join('').length>5800,'historical narrative must be substantive');
const srcKeys=new Set(article.sources.map(s=>s.id));assert(srcKeys.size===18);
assert(article.sources.every(s=>s.url.startsWith('https://')&&s.access));
const stats=article.quantitative_summary,a=quantitative.primary_estimate;
assert.equal(stats.rows.length,4);
assert.deepEqual(stats.rows.map(x=>x.embarked),a.source_data_table.period_rows.map(x=>x.estimated_embarked));
assert.deepEqual(stats.rows.map(x=>x.all_carriers_embarked),a.source_data_table.period_rows.map(x=>x.estimated_all_carriers_embarked));
assert.equal(stats.rows.reduce((s,r)=>s+r.embarked,0),428262);
assert.equal(stats.rows.reduce((s,r)=>s+r.all_carriers_embarked,0),1875634);
assert.equal(stats.total.embarked,428262);assert.equal(stats.total.all_carriers_embarked,1875634);
assert.equal(a.published_subtotals.precise_1600_1699_value,null);
assert(stats.period_note.includes('1700年')&&stats.period_note.includes('1600—1699年'),'periods must not be falsified');
assert.equal(stats.cohort.documented_voyages,279);
assert.equal(stats.cohort.recorded_embarked,84498);
assert.equal(stats.cohort.recorded_disembarked,65157);
assert.equal(stats.cohort.embarked_minus_disembarked,19341);
assert.equal(stats.cohort.recorded_embarked-stats.cohort.recorded_disembarked,stats.cohort.embarked_minus_disembarked);
assert.equal(stats.second_cohort.people_transported_low,90000);
assert.equal(stats.second_cohort.people_transported_high,100000);
assert.equal(stats.second_cohort.avg_voyages_per_year,23);
const human=quantitative.human_cost_cohort_1680_1692,front=stats.cohort_human_cost;
assert.equal(human.male_pct_approx,58);assert.equal(human.children_pct_approx,14);
assert.equal(human.children_age_threshold_years,10);assert.equal(human.historical_jamaica_prime_male_sale_price_gbp_average,18.73);
assert.deepEqual([front.male_pct_approx,front.children_pct_approx,front.historical_jamaica_prime_male_sale_price_gbp_average],[58,14,18.73]);
assert(front.warning.includes('不能据此算出精确人数')&&front.warning.includes('不是皇家非洲公司的纯利润')===false);
assert(front.warning.includes('公司净利润'));assert(front.warning.includes('所有人的均价'));
assert(article.sections.find(x=>x.id==='cohort-1680').paragraphs.join('').includes('十岁及以下儿童约占14%'));
assert(article.sections.find(x=>x.id==='cohort-1680').paragraphs.join('').includes('18.73英镑'));

assert(stats.cohort.period==='1680—1692'&&stats.second_cohort.period==='1673—1688');
assert(quantitative.data_governance.ship_count_not_inferred_from_population===true);
const atlas=new Map(),evs=new Map();
for(let y=1600;y<=1690;y+=10){const a=read('data/atlas-'+y+'-'+(y+9)+'.json');atlas.set(y,a);assert.deepEqual(a.colonial_polygons,[],'no Atlantic English ocean polygon');for(const e of a.events){assert(!evs.has(e.id));evs.set(e.id,e)}}
const ids=['1660S-E122','1670S-E123','1680S-E121','1690S-E130','1690S-E131'];
for(const id of ids){const e=evs.get(id),d=atlas.get(Number(id.slice(0,4)));assert(e&&e.research_event_id==='EDITOR12-E6T11:'+id);
assert(e.source_ids.every(s=>d.sources.some(x=>x.id===s&&x.url.startsWith('https://'))));
assert(e.exclude_point_buffer_from_area_statistics===true&&e.historical_control_boundary_verified===false&&e.actual_English_territory_created===false);
assert(Number.isFinite(e.lat)&&Number.isFinite(e.lng)&&e.geolocation_limit_zh.includes('非事件精确现场')); }
assert.equal(evs.get('1660S-E122').year,1668);
assert.equal(evs.get('1670S-E123').year,1675);
assert.equal(evs.get('1680S-E121').year,1688);
assert.equal(evs.get('1690S-E130').year,1694);
assert.equal(evs.get('1690S-E131').year,1698);
assert(evs.get('1690S-E024').description.includes('700'),'preexisting 1694 Whydah entry retained');
const markup=[];
for(const section of article.sections){assert(/^[一二三四五六七八九十]+、/.test(section.heading));assert(section.paragraphs.length===3&&section.source_keys.length>=2);
assert(section.source_keys.every(key=>srcKeys.has(key)));
for(const p of section.paragraphs){
assert.equal((p.match(/\[\[/g)||[]).length,(p.match(/\]\]/g)||[]).length);
for(const m of p.matchAll(/\[\[([A-Za-z0-9-]+)\|([^\]\n]{4,90})\]\]/g)){assert(evs.has(m[1]),'missing historical atlas target '+m[1]);markup.push(m[1]);}
}}
assert.equal(markup.length,18);
assert.deepEqual(new Set(markup),new Set(topic.event_ids));
assert(article.sections.find(x=>x.id==='rac-count').paragraphs.join('').includes('每年约二十三次'));
assert(article.sections.find(x=>x.id==='cohort-1680').paragraphs.join('').includes('279'));
assert(article.sections.find(x=>x.id==='expansion-1676').paragraphs.join('').includes('1700年'));
const site=read('data/seventeenth-century-spatial-evidence-1600-1699.geojson'),study=read('data/seventeenth-century-regional-studies-1600-1699.geojson');
assert.equal(site.features.length,186);assert.equal(site.metadata.feature_count,186);
assert.equal(study.features.length,32);assert.equal(study.metadata.feature_count,32);
const points=site.features.filter(x=>x.properties.related_story_ids?.includes(article.id));assert.equal(points.length,5);
for(const f of points){const e=evs.get(f.properties.related_event_ids[0]);assert(e);
assert.deepEqual(f.geometry.coordinates,[e.lng,e.lat]);assert.equal(f.properties.start_year,e.year);assert.equal(f.properties.display_through_year,e.year);
for(const key of ['historical_boundary_confirmed','territorial_claim','fill_authorized'])assert.equal(f.properties[key],false);
assert(f.properties.area_sqkm===null&&f.properties.exclude_from_area_aggregation===true);}
const route=study.features.filter(x=>x.properties.related_story_ids?.includes(article.id));assert.equal(route.length,1);
assert(route[0].geometry.type==='LineString');
assert.deepEqual(route[0].geometry.coordinates,[[2.086,6.357],[-59.614,13.096]]);
assert(route[0].properties.start_year===1694&&route[0].properties.end_year===1694);
assert(route[0].properties.area_sqkm===null&&route[0].properties.historical_boundary_confirmed===false&&route[0].properties.exclude_from_area_aggregation===true);
assert(route[0].properties.geometry_precision.includes('not_measured'));
const html=fs.readFileSync(path.join(root,'js/history-stories.js'),'utf8'),
css=fs.readFileSync(path.join(root,'css/history-stories.css'),'utf8');
assert(html.includes('quantitativeHistoryHtml(article)')&&html.includes('story-stat-table'));
assert(html.includes('toLocaleString')&&css.includes('.story-statistics'));
assert(html.includes('cohort_human_cost')&&html.includes('cost.children_pct_approx')&&html.includes('costs+'));
assert(!html.includes('estimated_embarked/25'),'historical cohort statistics cannot become invented per-year measured events');
console.log('PASS E6-T11: 18 chapters, 18 source files, 18 links, 5 new sourced events, 5 cues and 1 real-endpoints-only reference; exact original estimate table + 279 distinct RAC cohort voyages / 19341 difference; no annual false precision.');
