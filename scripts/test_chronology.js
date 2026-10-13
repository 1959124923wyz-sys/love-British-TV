#!/usr/bin/env node
'use strict';
// Regression: all event surfaces use the SAME occurrence-year rule; ongoing
// political control is tested separately from one-off events.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const fn = js.match(/function occurredByYear\(item,selectedYear\)\{[^}]*\}/);
assert.ok(fn, 'Missing central event time gate');
const occurredByYear = vm.runInNewContext(fn[0] + '\noccurredByYear');
const load = (f) => JSON.parse(fs.readFileSync(path.join(root, 'data', f), 'utf8'));
const early = load('atlas-1497-1500.json');
const second = load('atlas-1500-1509.json');
const third = load('atlas-1510-1519.json');
const city = load('french-urban-control-1500-1519.geojson');
const footprints = load('territorial-footprints-1497-1519.geojson');

function chapterEvents(year) {
  const chapter = year >= 1510 ? third : year >= 1500 ? second : early;
  return chapter.events.filter(e => (year >= 1500 || e.year <= 1499) && occurredByYear(e, year));
}
// Verify each year against source data, rather than freezing historical discovery counts.
for (let year=1497;year<=1519;year++) {
  const chapter = year>=1510 ? third : year>=1500 ? second : early;
  const independentlyExpected=chapter.events.filter(e => (year>=1500 || e.year<=1499) && e.year<=year).length;
  const shown=chapterEvents(year);
  assert.equal(shown.length,independentlyExpected,year+': incorrect year-filtered event count');
  assert.ok(shown.every(e=>e.year<=year),year+': future event became visible');
  if(year!==1497&&year!==1500&&year!==1510){
    assert.ok(shown.length>=chapterEvents(year-1).length,year+': cumulative chapter lost earlier events');
  }
}
assert.ok(chapterEvents(1500).length>=3 && chapterEvents(1510).length>=1,
  'Previously reviewed chapters must preserve their minimum baseline event coverage');
assert.deepEqual(
  early.routes.filter(r => occurredByYear(r,1497)).map(r => r.id),
  ['route1497'], '1498 voyage route must be hidden during 1497'
);
assert.equal(early.routes.filter(r => occurredByYear(r,1498)).length,2);
for (const [year, expected] of [[1512,['calais-crown']],[1513,['calais-crown','tournai-occupied-city-1513']],[1518,['calais-crown','tournai-occupied-city-1513']],[1519,['calais-crown']]]) {
  const active = city.features.filter(f => f.properties.start_year <= year && year <= f.properties.observed_through_year).map(f => f.properties.source_place_id);
  assert.deepEqual(active, expected, year + ': historic city governance state changed incorrectly');
}
for (let year=1497; year<=1519; year++) {
  const persist = footprints.features.filter(f => f.properties.start_year<=year && year<=f.properties.observed_through_year);
  assert.ok(persist.some(f=>f.id.startsWith('calais-pale-')), 'Calais carried state lost at '+year);
}
const segment = (start,end) => js.split(start)[1]?.split(end)[0] || '';
const list = segment('function renderEventList(){','function expandCluster(');
const points = segment('function renderPoints(){','function ensureTerritorialPatterns(){');
const milestones = segment('function renderMilestones(){','function setYear(');
assert.ok(list.includes('fullArchive||occurredByYear(e,year)'), 'sidebar fails to gate future events');
assert.ok(list.includes('a.year-b.year'), 'sidebar not chronological');
assert.ok(points.includes('!occurredByYear(e,year)'), 'map markers bypass year gate');
assert.ok(points.includes("if(!occurredByYear(r,year)||!$('toggleRoutes').checked)continue;"), 'map routes bypass year gate');
assert.ok(milestones.includes('y>=1497&&y<=year'), 'timeline shows future milestones');
assert.ok(js.includes("$('showFullChapterArchive').checked=false;"), 'archive unexpectedly defaults to future preview');
console.log('OK: 1497-1519 chronology, voyage routes, timeline markers and sustained cities');
