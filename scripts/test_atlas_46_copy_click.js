#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const cleaner=require('../js/atlas-reader-copy.js');
const samples=[
 '区域海河贸易通道，非英国河两岸主权',
 '虚线为概略历史地理参考，边界未经历史地图实测配准。',
 '殖民省行政外缘不等于各地持续驻军',
 '重叠的示意区块各有独立史料，不能将多层颜色叠加计算历史占地。',
 '现代矩形仅提示殖民文件巨大声索，绝无内陆实际占据之意',
 '广泛港口供应与当地商人合作关系，不代表国家主权',
 '跨两港的商业通信路线概略，不能声称之间沙漠归公司所有'
];
for(const source of samples){
 const output=cleaner.clean(source);
 assert.equal(output,'',JSON.stringify({source,output}));
}
for(const s of [
 '1762年英国军队攻占哈瓦那城堡',
 '1710年军队攻取皇家港',
 '1662年法国在普莱桑斯建立殖民据点',
 '贝奥图克人持续拥有自己的土地和行动空间',
 '1799年提普苏丹战死'
]) assert.equal(cleaner.clean(s),s,'historical events must survive: '+s);
const b38=JSON.parse(read('data/eighteenth-century-b38-hudson-company.json'));
const item=[...(b38.zones||[]),...(b38.sites||[])].find(x=>x.id==='B38-H-Z006');
assert(item,'the exact user-reported waterway item must exist');
assert.equal(item.note,'区域海河贸易通道，非英国河两岸主权');
assert.equal(cleaner.clean(item.note),'');
const mass=read('js/eighteenth-mass-spatial.js');
assert(mass.includes('reader.clean(x.note'),'batch35 no longer renders raw unfiltered notes');
assert(!mass.includes("escapeHTML(x.note||'')"));
const overlap=read('js/eighteenth-overlap-right-dossier.js');
assert(overlap.includes("map.getContainer().addEventListener('click',captureMapClick,true)"));
assert(overlap.includes("const found=locate(coordinate,false)"),'transparent interiors must be captured at container');
assert(overlap.includes("capture-transparent-overlap"));
assert(overlap.includes("capture-transparent-single"));
const html=read('index.html');
for(const file of ['app.js','js/atlas-reader-copy.js','js/eighteenth-mass-spatial.js','js/eighteenth-overlap-right-dossier.js'])
 assert(html.includes(file+'?v=atlas46-click-notes-20261112'),'cache mismatch: '+file);
console.log('PASS atlas46: exact user waterway text removed, all seven notes filtered, history preserved, complete capture-phase hit-test and cache-busting.');
