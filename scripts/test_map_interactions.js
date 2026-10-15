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
assert.ok(html.includes('app.js?v=timeline-v1800-merged-ch1ch2'),'Browser must load current JavaScript, not cached chronology');
assert.ok(html.includes('css/dark-atlas-v2.css?v=timeline-v1800-merged-ch1ch2'),'Browser must load fixed click style');
// Guard against a duplicate Guernsey "pie" marker over its mapped island footprint.
const political = snippet('function renderPoliticalRelationAreas(){','function renderControlAreas(){');
const territory = snippet('function renderTerritories(){','function renderPoliticalRelationAreas(){');
const footprints = JSON.parse(read('data/territorial-footprints-1497-1539.geojson'));
const relations = JSON.parse(read('data/political-relations-1500-1539.geojson'));
const guernsey = footprints.features.find(f=>f.id==='guernsey-crown-island-outline');
assert.equal(guernsey.properties.source_place_id,'channel-guernsey',
  'Guernsey footprint must suppress its duplicate, oversized political fallback disk');
assert.equal(guernsey.properties.fill_authorized,false,'Modern coastline cannot become a verified Tudor border');
assert.ok(relations.features.some(f=>f.properties.source_place_id==='channel-guernsey'));
assert.ok(political.includes('footprintEnabledFor(p.source_place_id)'),
  'Relation fallback must disappear when the equivalent historic coastline is visible');
assert.ok(political.includes('iconSize:[26,26],iconAnchor:[13,13]'),
  'Fallback symbolic disk must remain a small map location marker');
assert.ok(political.includes('data-polity-id='),
  'Browser test needs an explicit identity for the Guernsey fallback');
assert.ok(political.includes('findPlaceAcrossChapters(p.source_place_id)'),
  'Earlier chapters must be able to open the Guernsey political history');
assert.ok(territory.includes("openTerritoryDossier(feature,'historic')"),
  'Mapped Guernsey must open the political dossier at any year');
const firstWithGuernsey=JSON.parse(read('data/atlas-1530-1539.json'));
assert.ok(firstWithGuernsey.places.some(p=>p.id==='channel-guernsey'));
assert.ok(!JSON.parse(read('data/atlas-1520-1529.json')).places.some(p=>p.id==='channel-guernsey'),
  'This regression requires cross-chapter lookup, not accidental duplication of records');
console.log('OK: vector focus, geographic provenance, urban core, dossier persistence and cache');
