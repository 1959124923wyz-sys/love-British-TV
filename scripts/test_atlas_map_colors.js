#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const palette=require(path.join(root,'js/atlas-map-colors.js'));
const {resolve,colors,aliases,legend}=palette;
for(const [alias,key] of Object.entries(aliases))assert.equal(resolve(alias),colors[key],alias);
assert.equal(resolve('administrative'),resolve('administration'));
assert.equal(resolve('military'),resolve('wartime_occupation'));
assert.equal(resolve('local_governance'),resolve('resistance'));
assert.equal(resolve('economic_network'),resolve('trade_influence'));
assert.equal(resolve('conflict'),resolve('battle'));
assert.equal(resolve('coercive_policy'),resolve('displacement'));
assert.equal(resolve('charter'),resolve('paper_claim'));
assert.equal(resolve('foreign_occupation'),resolve('french_crown'));
assert.notEqual(resolve('administration'),resolve('charter'));
assert.notEqual(resolve('land_dispossession'),resolve('charter'));
assert.notEqual(resolve('military_impact'),resolve('coercive_policy'));
assert.notEqual(resolve('local_governance'),resolve('foreign_occupation'));
assert.equal(new Set(legend.map(([k])=>resolve(k))).size,legend.length);
assert.ok(legend.every(([k,label])=>colors[k]&&label));
const html=read('index.html'),app=read('app.js');
assert.ok(html.indexOf('src="js/atlas-map-colors.js?')>=0);
assert.ok(html.indexOf('src="js/atlas-map-colors.js?')<html.indexOf('src="app.js?'));
assert.match(html,/AtlasMapColors\.legend\.map/);
assert.match(app,/const color=mapTint\(p\.display_kind\)/);
assert.match(app,/const color=mapTint\(display\)/);
assert.match(app,/claimTint\(f\.properties\)/);
assert.match(app,/mapTint\(land\?'land_dispossession':'military_impact'\)/);
assert.match(app,/mapTint\(isResistance\?'resistance':isBattle\?'battle':'diplomacy'\)/);
const files=['app.js',...Array.from(html.matchAll(/src="(js\/eighteenth-[^"?]+\.js)\?/g),m=>m[1]).filter(p=>!/overlap-right-dossier|niagara-survey/.test(p))];
for(const p of files){
 const source=read(p);new vm.Script(source,{filename:p});
 assert.ok(source.includes(p==='app.js'?'mapTint':'AtlasMapColors'),p+' must consume shared colors');
}
console.log('PASS: shared semantic palette, distinct legend colors, 16C/17C/19C/20C render paths and '+(files.length-1)+' eighteenth-century modules.');
