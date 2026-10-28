'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const registry=read('data/stories/serial/index.json');
const stories=[
{id:'E6-T15',file:'data/stories/serial/e6-t15-bank-war-colonial-capital.json',sections:13,sources:17,events:10},
{id:'E6-T02',file:'data/stories/serial/e6-t02-ireland-conquest-land-finance.json',sections:15,sources:17,events:17}
];
const atl=new Map();
for(let y=1600;y<=1690;y+=10)for(const e of read('data/atlas-'+y+'-'+(y+9)+'.json').events)atl.set(e.id,e);
for(const t of stories){
 const topic=registry.topics.find(x=>x.id===t.id),a=read(t.file);
 assert.equal(topic.status,'published');assert.equal(topic.publication_review,'approved');
 assert.equal(topic.article_file,t.file);
 assert.equal(a.id,t.id);assert.equal(a.sections.length,t.sections);assert.equal(a.sources.length,t.sources);
 assert.equal(topic.event_ids.length,t.events);
 assert.deepEqual(new Set(topic.event_ids),new Set(a.related_event_ids));
 assert.equal(new Set(topic.event_ids).size,t.events);
 assert.equal(new Set(a.sources.map(x=>x.id)).size,t.sources);
 assert.equal(a.publication_approval,true);
 assert(a.lead.length>100,'story must have substantial evidence-based introduction');
 const refs=new Set(a.sources.map(x=>x.id)),ids=new Set();
 for(const sec of a.sections){
  assert(sec.period_start_year>=a.start_year && sec.period_end_year<=a.end_year);
  assert(sec.paragraphs.length>=3,'3 narrative paragraphs minimum each chapter');
  assert(sec.paragraphs.join('').length>250,'chapter must be substantive');
  for(const k of sec.source_keys)assert(refs.has(k),'every reference must exist: '+k);
  for(const p of sec.paragraphs)for(const m of p.matchAll(/\[\[([A-Z0-9-]+)\|([^\]\n]+)\]\]/g)){
   const id=m[1];assert(atl.has(id),'all in-story event navigation must be real atlas event '+id);
   ids.add(id);
  }
 }
 for(const id of topic.event_ids)assert(ids.has(id),'every indexed story event must be reachable by natural language link '+t.id+':'+id);
 assert(a.topic_source_claims.filter(x=>x.publication_approval===true).length>=a.sections.length);
 assert(a.sources.every(x=>x.url.startsWith('https://')&&!x.access?.includes('original_whole_file_read_unverified')));
}
const led=read('data/research/e6t15-e6t02-war-finance-land-forfeiture-evidence-20261026.json');
assert(led.cases.length>=10);
const pick=id=>led.cases.find(x=>x.id===id);
assert.equal(pick('BANK1694_LOAN').amount,1200000);
assert.equal(pick('BANK1694_RATE').amount,8);
assert.equal(pick('BANK1694_FISCAL').amount,140000);
assert.equal(pick('BANK1694_FISCAL').statutory_components.subscriber_fund_gbp,100000);
assert.equal(pick('BANK1694_FISCAL').statutory_components.life_annuities_fund_gbp,40000);
assert.equal(pick('BANK1694_SUBSCRIBERS').archive_indexed_separate_names,1520);
assert.equal(pick('BANK1694_SUBSCRIBERS').distinct_people_independently_verified,null);
assert.equal(pick('IRL1649_DROGHEDA').actual_civilian_fatalities,null);
assert.equal(pick('IRL1649_WEXFORD').verified_civilian_split,null);
assert.equal(pick('BANK_FUTURE_1780S').in_17c_scope,false);
const bank=read(stories[0].file),ireland=read(stories[1].file);
assert(bank.sections.flatMap(x=>x.paragraphs).join('').includes('不等于') && ireland.sections.flatMap(x=>x.paragraphs).join('').includes('不是'));
assert(bank.related_event_ids.includes('1690S-E023') && ireland.related_event_ids.includes('1640S-E016'));
assert(ireland.related_event_ids.includes('1640S-E017')&&ireland.related_event_ids.includes('1650S-E021'));
assert(ireland.related_story_ids.includes('E6-T03-LAND-1642-1698'),'cannot discard or duplicate existing land rights story');
assert(registry.topics.find(t=>t.id==='E6-T03-LAND-1642-1698')?.status==='published');
assert.equal(registry.topics.filter(t=>t.status==='published').length,29);
console.log('PASS editor16: 2 public historical capital stories, 28 chapters, 34 sources, 27 existing audited Atlas links; original £1.2m/8%, £140k split, unverified death/colonial investor accounting remain explicit.');
