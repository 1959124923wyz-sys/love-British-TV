#!/usr/bin/env node
'use strict';
// Regression checks for vector click focus, provenance and persistent year state.
// These operate offline with no network or browser dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root,p),'utf8');
const app = read('app.js'), css = read('css/dark-atlas-v2.css');
const snippet = (begin,end) => app.split(begin)[1]?.split(end)[0] || '';
const focus = css.match(/#map path\.leaflet-interactive:focus\s*\{[^}]*\}/)?.[0] || '';
const keyboard = css.match(/#map path\.leaflet-interactive:focus-visible\s*\{[^}]*\}/)?.[0] || '';
assert.match(focus,/outline\s*:\s*none\s*!important/i,'SVG path click must not draw a square focus outline');
assert.match(keyboard,/drop-shadow\(/,'Keyboard navigation needs a nonrectangular visual focus cue');
const hypothesis = snippet('function openHypothesis(feature){','function openCollection(');
assert.ok(hypothesis.includes('p.source_path'), 'The clicked geometry must determine its own evidence link');
assert.ok(!hypothesis.includes("year>=1510?'research/periods/1510-1519/"),
  'Pale and Calais clicks must not redirect to unrelated Tournaisis research');
for(const file of ['data/geography-1500-hypotheses.geojson','data/geography-1510-1519-hypotheses.geojson']){
  const geo=JSON.parse(read(file));
  for(const feature of geo.features){
    const p=feature.properties;
    assert.ok(p.source_path && /^(research|editorial)\//.test(p.source_path),
      file+' missing feature-linked source path');
    assert.ok(fs.existsSync(path.join(root,p.source_path)), p.source_path+' not present');
    assert.equal(p.fill_authorized,false,'Unverified boundaries must not be published as verified control');
  }
}
const control = snippet('function renderControlAreas(){','function renderHypotheses(){');
assert.ok(!control.includes('footprintEnabledFor('),
  'An approximate Pale polygon must not suppress the documented Calais urban core');
assert.ok(control.includes('observed_through_year'),
  'Urban occupation must expire by historically supported year');
const setYear = snippet('function setYear(v){','function stopPlay(){');
assert.ok(!setYear.includes("workspace.classList.add('dossier-collapsed')"),
  'Scrubbing across chapters must not close the dossier drawer');
assert.ok(setYear.includes('selectedItemYear>next'),
  'Rewinding must not keep a dossier for an event that has not happened yet');
assert.ok(setYear.includes('renderEventList();renderTerritories();'),
  'Year change must update event and historic territory layers together');
const html=read('index.html');
assert.ok(html.includes('app.js?v=timeline-v162'),'Browser must load current JavaScript, not cached chronology');
assert.ok(html.includes('css/dark-atlas-v2.css?v=timeline-v161'),'Browser must load fixed click style');
console.log('OK: vector focus, geographic provenance, urban core, dossier persistence and cache');
