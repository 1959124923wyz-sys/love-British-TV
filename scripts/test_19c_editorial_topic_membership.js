#!/usr/bin/env node
'use strict';

// Research-only catalogue integrity test. Does not approve map geometries or publish any story.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = path.resolve(__dirname, '../data/research/19c');
const doc = JSON.parse(fs.readFileSync(path.join(base, 'editorial-topic-membership-v1.json'), 'utf8'));
const dedup = JSON.parse(fs.readFileSync(path.join(base, 'cross-region-lead-dedup-v1.json'), 'utf8'));
const seen = new Map();
for (const story of doc.editorial_stories) {
  assert.match(story.id, /^19c-/);
  assert.ok(story.topic_ids.length);
  for (const topicId of story.topic_ids) {
    assert.match(topicId, /^[ABC]-\d{2,3}$/);
    assert.ok(!seen.has(topicId), topicId + ' assigned twice');
    seen.set(topicId, story.id);
  }
}
const expected = Object.entries({ A: 101, B: 125, C: 182 })
  .flatMap(([prefix, max]) =>
    Array.from({ length: max }, (_, i) => prefix + '-' + String(i + 1).padStart(2, '0')));
for (const topicId of expected) assert.ok(seen.has(topicId), topicId + ' missing');
assert.equal(seen.size, 408);
assert.equal(doc.editorial_stories.length, 210);
assert.equal(doc.editorial_stories.filter(x => x.topic_ids.length > 1).length, 95);
assert.equal(Object.keys(dedup.cross_links).length, 36);
for (let i = 1; i <= 36; ++i) {
  const key = 'G-' + String(i).padStart(2, '0');
  assert.ok(seen.has(dedup.cross_links[key]), key + ' unresolved');
}
assert.equal(doc.stage, 'research_only_not_for_publishing');
console.log('PASS: 408 primary topics, 210 stories, 95 merges, 36 cross-region leads');
