#!/usr/bin/env node
'use strict';
// NPS says 1579 landfall is probable near Point Reyes/Drakes Bay, not an
// unambiguous ancient GPS site. Keep geographic reference without false precision.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/atlas-1570-1579.json'), 'utf8'));
const item = data.events.find(e => e.id === '1570S-E019');
assert.ok(item, 'Drake Nova Albion event missing');
assert.equal(item.England_actual_territorial_occupation, false);
assert.equal(item.claim_not_state_takeover, true);
assert.match(item.geo_precision, /not_verified_precise_drake_landfall/);
assert.match(item.geography_label, /有争议/);
assert.ok(item.source_ids.includes('C9-S13'), 'NPS site archaeology source missing');
const segments = data.routes.filter(r => /ch9-Drake-1579-(Callao-California|California-Ternate)/.test(r.id));
assert.equal(segments.length, 2);
assert.ok(segments.every(r => /推定/.test(r.name) && /登陆/.test(r.note) && r.certainty === 'schematic-only-not-historical-track'));
const pacific = segments.find(r => r.id === 'ch9-Drake-1579-California-Ternate');
assert.ok(pacific.segments?.length === 2, 'Pacific route must split at the antimeridian');
assert.equal(pacific.segments[0].at(-1)[1], -180);
assert.equal(pacific.segments[1][0][1], 180);
assert.equal(pacific.segments[0].at(-1)[0], pacific.segments[1][0][0]);
console.log('PASS: 1579 Drake landfall is labelled probable; dateline route stays continuous');
