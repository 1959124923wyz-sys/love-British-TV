#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const copy=require('../js/atlas-reader-copy.js');
const modern=read('js/eighteenth-overlap-right-dossier.js');
const historical=read('js/historic-overlap-dossier-1497-1699.js');
const app=read('app.js'),story=read('js/history-stories.js'),html=read('index.html');
assert(modern.includes("if(matched.length)openAt(ev.latlng,false,matched.length>1?'map-background-overlap':'map-background-single')"));
assert(historical.includes("if(matches.length)openAt(ev.latlng,matches.length>1?'transparent-overlap':'transparent-single')"));
assert(modern.includes('hitCountAt:(lat,lng)'));
assert(historical.includes('hitCountAt:(lat,lng)'));
assert(modern.includes("map.on('click',ev=>")&&historical.includes("map.on('click',ev=>"));
assert(modern.includes("const found=locate(coordinate,false)") && modern.includes(".leaflet-marker-icon,.leaflet-popup,.leaflet-tooltip"));
assert(historical.includes("'.leaflet-marker-icon,.leaflet-popup'"));
assert(modern.includes("const found=locate(latlng,targetIsPoint)"));
assert(historical.includes("return host.visibleAreaFeatures().filter"));
assert(modern.includes("sourceRecords:activeRecords.map"));
assert(historical.includes("sourceRecordIds:activeRecords.map"));
assert(!html.includes('reader18c=1'));
assert(!modern.includes('重叠的示意区块各有独立史料'));
assert(!historical.includes('重叠的示意区块各有独立史料'));
assert(!story.includes('空白年份不代表没有历史活动'));
assert(!story.includes('地图疆域始终只显示所选当年'));
assert(!app.includes(' · ◎地区参考点（非事件现场）'));
assert(!app.includes('边缘依据史料地名概略描绘'));
assert(!app.includes('· 非整个地区的疆界'));
assert(!app.includes('现代考古遗址地理参考 · '));
for(const [x,y] of [
 ['重叠的示意区块各有独立史料，不能将多层颜色叠加计算历史占地。',''],
 ['殖民省行政外缘不等于各地持续驻军',''],
 ['虚线为概略历史地理参考，边界未经历史地图实测配准。',''],
 ['整岛外廓展示英方最大声索而非英格兰在1610—1699年连续实控全岛。',''],
 ['1762英军围攻并夺取哈瓦那港口','1762英军围攻并夺取哈瓦那港口'],
 ['1662年法国在普莱桑斯建立殖民据点','1662年法国在普莱桑斯建立殖民据点'],
 ['贝奥图克人持续拥有自己的土地和行动空间','贝奥图克人持续拥有自己的土地和行动空间'],
 ['英军短期占据城市','英军短期占据城市']
 ])assert.equal(copy.clean(x),y,JSON.stringify({source:x,output:copy.clean(x),expected:y}));
assert.equal(copy.label('整岛殖民文书声索 · 非整岛持续统治'),'整岛殖民文书声索');
const claim=JSON.parse(read('data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson'))
 .features.find(f=>f.id==='claim-newfoundland-island-1610');
assert(claim,'Newfoundland standalone polygon is missing');
assert.equal(claim.properties.start_year,1610);
assert.equal(claim.properties.end_year,1699);
assert.equal(claim.properties.historical_boundary_confirmed,false);
assert.equal(claim.properties.area_sqkm,null);
assert(claim.properties.source_urls.length>=2);
const display=copy.clean(claim.properties.summary_zh);
assert(display.includes('1610')&&display.includes('1662')&&display.includes('贝奥图克'));
assert(!display.includes('外廓')&&!display.includes('非英格兰在'));
assert(claim.properties.summary_zh.includes('外廓'),'original archive research must remain unchanged');
const old34=JSON.parse(read('data/eighteenth-century-dynamic-spatial-1700-1799.json'));
assert.equal(old34.area_references.length,24);
const old39=JSON.parse(read('data/eighteenth-century-b39-caribbean-1759-1763.json'));
assert.equal(old39.zones.length,45);
assert.equal(old39.sites.length,28);
for(const f of ['app.js','js/atlas-reader-copy.js','js/historic-overlap-dossier-1497-1699.js',
 'js/eighteenth-overlap-right-dossier.js','js/history-stories.js']){
 assert(html.includes(f+'?v='),f+' must be loaded');
 assert(html.includes('fix44-single-region'),f+' cache buster missing');
}
console.log('PASS: transparent SINGLE and MULTIPLE area click support in both centuries; Newfoundland chronology, original sources, historical nuance and all academic UI note removals.');
