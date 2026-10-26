'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),base=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(base,p),'utf8'));
const data=read('data/research/e6t15-e6t02-person-network-and-1654-lottery-evidence-20261026.json');
const bank=read('data/stories/serial/e6-t15-bank-war-colonial-capital.json');
const ireland=read('data/stories/serial/e6-t02-ireland-conquest-land-finance.json');
const topics=read('data/stories/serial/index.json').topics;
assert.equal(bank.sections.length,13);assert.equal(ireland.sections.length,15);
assert.equal(bank.sources.length,17);assert.equal(ireland.sources.length,17);
assert.equal(ireland.end_year,1670);assert.equal(topics.find(x=>x.id==='E6-T02').research_window.end_year,1670);
const roy=data.finance.people.find(x=>x.id==='william-iii-mary-ii');
assert(roy&&roy.bank_subscription_joint_gbp===10000&&roy.rac_share_amount_gbp===null&&roy.royal_african_company_to_bank_capital_trace===null);
const j=data.finance.people.find(x=>x.id==='john-houblon');
const h=data.finance.people.find(x=>x.id==='samuel-hankey');
assert(j&&h&&j.roles.some(x=>x.from_year===1674)&&j.roles.some(x=>x.year===1694));
assert.equal(h.bank_of_england_1694_director_confirmed,false);
assert.equal(j.verified_flow_of_slavery_profits_to_bank_shares,null);
assert.equal(j.verified_particular_slave_voyage,null);
assert(data.finance.verified_edges.some(e=>e.from==='john-houblon'&&e.to==='samuel-hankey'&&e.year===1674));
const research=data.finance.study_2026;
assert.equal(research.total_bank_directors_ever_identified_slave_trade_investors,24);
assert.equal(research.bank_founding_directors_1694_subset,4);
assert.equal(research.founding_subscribers_1694_involved_min,30);
assert.equal(research.unnamed_founding_director_names_not_verified,true);
assert.deepEqual(research.individual_director_ids,[]);
assert.equal(research.bank_sharecapital_in_slave_profit_pounds,null);
const smith=data.ireland.erasmus_smith;
assert.equal(smith.initial_rights_gbp,300);
assert.equal(smith.nominal_investment_after_discounted_acquisitions_gbp,2995);
assert.equal(smith.land_awarded_irish_acres,10404);
assert.equal(smith.land_lots_year,1653);
assert.deepEqual(smith.awarded_counties,['Armagh','Down','Tipperary']);
assert.equal(smith.cash_profit_verified,null);
assert.equal(smith.parcel_geometry_verified,null);
const lottery=data.ireland.barony_lottery_study;
assert.equal(lottery.date_of_lottery,'1654-01-24');
assert.equal(lottery.split_counties,10);
assert.equal(lottery.analysis_baronies,90);
assert.equal(lottery.analysis_parishes,794);
assert.equal(lottery.excluded_ineligible_parishes,49);
assert.equal(lottery.protestant_land_ownership_1670_sample_adventurers_percent,79);
assert.equal(lottery.protestant_land_ownership_1670_sample_army_percent,84);
assert.equal(lottery.army_minus_adventurers_percentage_points,5);
assert.equal(lottery.under_quarter_orig_claimants_personally_took_up_land_by_1670,true);
assert(lottery.source.includes('cambridge.org'));
assert(!JSON.stringify(data).includes('"estimated_year_1700"'));
const para = story=>story.sections.flatMap(s=>s.paragraphs).join('\n');
assert(para(bank).includes('30名')&&para(bank).includes('4名创办董事'));
assert(para(bank).includes('Hankey')&&para(bank).includes('1674年'));
assert(para(ireland).includes('2,995英镑')&&para(ireland).includes('10,404爱尔兰英亩'));
assert(para(ireland).includes('794个教区')&&para(ireland).includes('84%')&&para(ireland).includes('79%'));
for(const doc of [bank,ireland]){
 const src=new Set(doc.sources.map(x=>x.id));
 const sect=new Set(doc.sections.map(x=>x.id));
 for(const section of doc.sections){
  assert(section.source_keys.every(id=>src.has(id)));
  for(const p of section.paragraphs)for(const l of p.matchAll(/\[\[([^|\]]+)\|([^\]]+)\]\]/g)){
    assert(l[2].length>=4,'semantic clickable labels, no bare years');
    assert(doc.related_event_ids.includes(l[1]),'existing mapped event linked in story needs registered event '+l[1]);
  }
 }
 for(const claim of doc.topic_source_claims)assert(sect.has(claim.section_id)&&claim.source_keys.every(k=>src.has(k)));
 assert.equal(doc.sources.length,new Set(doc.sources.map(x=>x.id)).size);
 assert.equal(doc.sections.length,new Set(doc.sections.map(x=>x.id)).size);
}
assert(ireland.related_story_ids.includes('E6-T03-LAND-1642-1698'));
console.log('PASS Editor17: 3+4 additional chapters; 2026 4 founding Bank directors and >=30 subscribers are scholarly aggregates not invented names; 1674 named Houblon-Hankey merchant partnership; 1643/1653 named Smith land shares and 1654/1670 barony sample bounded.');
