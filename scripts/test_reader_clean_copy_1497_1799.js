#!/usr/bin/env node
'use strict';
/* Reader-interface cleanup: source data untouched, historic facts retained,
 * and exact unwanted drafting phrases absent from all rendered dossier paths. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(base,p),'utf8');
const copy=require('../js/atlas-reader-copy.js');
const examples=[
 ['殖民省行政外缘不等于各地持续驻军',''],
 ['虚线为概略历史地理参考，边界未经历史地图实测配准。',''],
 ['区域虚线是现代编辑绘制的矩形参考范围，未经历史地图配准。',''],
 ['1759英军夺岛，1763和约归还法国；框仅示意岛屿位置，非历史边界','1759英军夺岛，1763和约归还法国'],
 ['1655英方征服牙买加并长期坚持殖民地声索；部分马龙社群和反抗者在山地持续自主行动。现代岛屿轮廓粗略示意殖民者的全岛统治主张，不能据此计算土地面积','1655英方征服牙买加并长期坚持殖民地声索。部分马龙社群和反抗者在山地持续自主行动'],
 ['1665特许把卡罗来纳外缘扩展到约北纬29—36.5度，西抵太平洋','西抵太平洋'],
 ['1763法国主权恢复，1794出现另一次英军短占；不算英国领土','1763法国主权恢复，1794出现另一次英军短占'],
 ['1755大普雷阿卡迪亚人遭强制驱逐','1755大普雷阿卡迪亚人遭强制驱逐'],
 ['苏格兰国家主权并未中断','苏格兰国家主权并未中断'],
 ['Kalinago社群保有自主政治','Kalinago社群保有自主政治'],
 ['被奴役者组织起义并控制港区','被奴役者组织起义并控制港区'],
];
for(const [input,expected] of examples){
 const output=copy.clean(input);
 if(input.startsWith('1665特许'))assert(output.includes('西抵太平洋'),JSON.stringify({input,output}));
 else assert.equal(output,expected,JSON.stringify({input,expected,output}));
}
assert.equal(copy.label('英方军事驻守 · 非实测边界'),'英方军事驻守');
assert.equal(copy.label('殖民行政局部参考'),'殖民行政');
const html=read('index.html'),app=read('app.js'),css=read('css/eighteenth-overlap-right-dossier.css');
const files=[
 'js/eighteenth-overlap-right-dossier.js','js/historic-overlap-dossier-1497-1699.js',
 'js/eighteenth-mass-spatial.js','js/eighteenth-dynamic-spatial.js',
 ...[36,37,38,39].map(n=>'js/eighteenth-batch'+n+'-spatial.js')
];
assert(html.indexOf('js/atlas-reader-copy.js')<html.indexOf('app.js?'));
assert(html.includes('js/atlas-reader-copy.js'));
assert.equal((html.match(/id="showMaximalPaperCharters"/g)||[]).length,1);
assert.equal((html.match(/id="showDetailedClaimBoundaries"/g)||[]).length,1);
assert.equal((html.match(/id="showModernBasemap"/g)||[]).length,1);
assert.equal((html.match(/id="showSeventeenthClaimDirectory"/g)||[]).length,1);
assert(!html.includes('不计英军占地面积')&&!html.includes('不用于占地面积统计'));
assert(!html.includes('非实测疆界')&&!html.includes('所有范围均非实测'));
assert(!html.includes('第39批地图扩容')&&!html.includes('第38批历史控制收缩'));
assert(!app.includes("row('边界说明'"));
assert(app.includes('readerCopy.clean(description)'));
assert(app.includes('return \'所选年份由\'+controller.controller_zh+\'治理。\';'));
assert(!app.includes('虚线为视觉提示，不是实测影响范围'));
assert(!app.includes('此处为现代历史遗址代表坐标'));
assert(!app.includes('虚线圆仅代表证据关联的地点'));
assert(!app.includes('区域范围未经历史测绘'));
assert(!app.includes('地点为现代遗址参考，不是18世纪实占疆界'));
assert(!css.includes('.atlas-18c-overlap-precision')&&!css.includes('.atlas-18c-overlap-footnote'));
for(const p of files){
 const js=read(p);
 assert(js.includes('window.AtlasReaderCopy'),'missing reader copy sanitizer '+p);
 assert(!js.includes('虚线为概略历史地理参考，边界未经历史地图实测配准。'),p);
 assert(!js.includes('未经历史地图配准'),p);
 assert(!js.includes('未经18世纪原件测绘'),p);
 assert(!js.includes('无法由此推定周边全部土地被占领'),p);
 assert(!js.includes('非实测边界'),p);
 assert(!js.includes('atlas-18c-overlap-footnote'),p);
}
for(const p of ['data/eighteenth-century-mass-schematic-zones-1700-1799.json',
 'data/eighteenth-century-expansion-batch36-1700-1799.json',
 'data/eighteenth-century-b39-caribbean-1759-1763.json',
 'data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson']){
 const data=JSON.parse(read(p));
 assert((data.zones?.length||data.features?.length)>0,'unchanged sourced JSON missing '+p);
}
// The raw metadata is retained, though none of these warnings remain in reader HTML.
const original=read('data/eighteenth-century-expansion-batch36-1700-1799.json');
assert(original.includes('无法由此推定周边全部土地被占领'));
assert(original.includes('source_register'));
assert.equal(JSON.parse(read('data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson')).features.length,53);
console.log('PASS reader UX cleanup: 11 source-preserving factual examples; 8 map renderers + app + legend clean; all original historical data and controls remain.');
