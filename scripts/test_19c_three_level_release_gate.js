#!/usr/bin/env node
'use strict';
/* 19c research data / publishing gate.
 * When the three local data files are imported in a later batch, this script
 * enforces coverage and prevents unreviewed GIS / post-1899 early publication.
 * Until then it only checks contract + previously committed 408→210 index. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const data = (...parts) => path.join(root,'data','research','19c',...parts);
const contract = JSON.parse(fs.readFileSync(data('three-level-contract-v1.json'),'utf8'));
assert.equal(contract.schema,'19c-three-level-contract-v1');
const previous = JSON.parse(fs.readFileSync(data('editorial-topic-membership-v1.json'),'utf8'));
assert.equal(previous.editorial_stories.length,210);
const original = new Set();
for (const story of previous.editorial_stories) for (const id of story.topic_ids) {
  assert.ok(!original.has(id),'duplicate primary topic '+id);original.add(id);
}
assert.equal(original.size,408);
const candidates = ['macro_topics.json','aggregated_events_candidates.json','historical_evidence_nodes.json'];
const found=candidates.filter(n=>fs.existsSync(data(n)));
if(found.length===0) {
  console.log('STAGING ONLY: 408→210 research index + three-tier contract OK. Full 83/532/1339 local ZIP not imported yet.');
  process.exit(0);
}
assert.equal(found.length,3,'Partial import: the complete three-tier data set must be imported together');
const read = n => JSON.parse(fs.readFileSync(data(n),'utf8'));
const themes = read(candidates[0]).topics;
const blocks = read(candidates[1]).events;
const nodes = read(candidates[2]).nodes;
const themeIDs=new Set(), storyCoverage=new Set(), blockIDs=new Set(), nodeCoverage=new Set();
for(const t of themes) {
  assert.ok(t.topic_id && !themeIDs.has(t.topic_id),'duplicate theme ID');
  themeIDs.add(t.topic_id);
  for(const id of t.child_story_ids) {
    assert.ok(!storyCoverage.has(id),'story appears in multiple themes: '+id);
    storyCoverage.add(id);
  }
}
const storyIDs=new Set(previous.editorial_stories.map(s=>s.id));
assert.equal(storyCoverage.size,storyIDs.size);
for(const id of storyCoverage) assert.ok(storyIDs.has(id),'unknown story '+id);
const supporting=new Map();
for(const b of blocks) {
  assert.ok(themeIDs.has(b.topic_id),'unknown theme on block '+b.event_id);
  assert.ok(!blockIDs.has(b.event_id),'duplicate block ID '+b.event_id);
  blockIDs.add(b.event_id);
  assert.ok(original.has(b.origin_topic_id),'unknown original topic '+b.origin_topic_id);
  assert.ok(Array.isArray(b.original_event_ids) && Array.isArray(b.supporting_record_ids));
  assert.ok(Array.isArray(b.source_registry_keys));
  const nodeIDs=[...b.original_event_ids,...b.supporting_record_ids];
  assert.ok(nodeIDs.length>0,'empty block '+b.event_id);
  for(const id of nodeIDs) {
    assert.ok(!nodeCoverage.has(id),'evidence node in two blocks '+id);
    nodeCoverage.add(id);supporting.set(id,b);
  }
  if(b.publication_status==='research_only') {
    assert.equal(b.geometry,null,'unreviewed event must not have generated geometry '+b.event_id);
    assert.equal(b.historical_control_area_sqkm,null);
    assert.equal(b.exclude_from_colonial_area_statistics,true);
  } else {
    assert.ok(['source_verified','geo_verified','editorial_approved','published'].includes(b.publication_status));
    assert.ok(b.review_checklist?.references_verified,'unreviewed claim '+b.event_id);
    if(b.publication_status==='published') {
      assert.ok(b.review_checklist?.headline_verified && b.review_checklist?.responsibility_verified);
      assert.ok(b.review_checklist?.geometry_reviewed,'cannot publish unreviewed geometry '+b.event_id);
      assert.ok(b.start_year_candidate<1900,'a 1900+ episode cannot enter 19c Atlas');
      assert.ok(b.source_registry_keys.length,'published event requires sources');
    }
  }
  if(b.geometry?.type==='Polygon' || b.geometry?.type==='MultiPolygon') {
    assert.equal(b.historical_boundary_confirmed,false);
    assert.equal(b.territorial_claim,false);
    assert.equal(b.area_sqkm,null);
    assert.equal(b.exclude_from_area_aggregation,true);
    assert.ok(b.mapping_method && b.named_anchors?.length && b.source_ids?.length);
  }
}
assert.equal(nodes.length,nodeCoverage.size);
const nodeIDs=new Set();
for(const n of nodes) {
  assert.ok(!nodeIDs.has(n.original_event_id),'duplicate original evidence '+n.original_event_id);
  nodeIDs.add(n.original_event_id);
  assert.ok(nodeCoverage.has(n.original_event_id),'orphan evidence '+n.original_event_id);
  assert.equal(n.aggregated_event_id,supporting.get(n.original_event_id).event_id);
  if(n.year_candidate>=1900) {
    assert.equal(n.node_role_candidate,'outside_19c_date_review');
    assert.ok(!supporting.get(n.original_event_id).original_event_ids.includes(n.original_event_id),'post-1899 item cannot serve as 19c historical action');
  }
}
const used=new Set(blocks.map(b=>b.origin_topic_id));
assert.equal(used.size,original.size);
console.log('PASS: '+themes.length+' themes, '+blocks.length+' review blocks, '+nodes.length+' evidence records; no missing original topics, false post-1899 actions, or unapproved research polygons.');
