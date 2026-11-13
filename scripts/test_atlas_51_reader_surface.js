#!/usr/bin/env node
'use strict';
// User-facing copy must stay compact; original source notes, citations and
// disputed geometry remain intact. Tests focus on actual display renderers.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const publicFiles=['index.html','app.js','js/historic-overlap-dossier-1497-1699.js','js/eighteenth-overlap-right-dossier.js'];
const disallowed=['未核证地理参考','研究参考区','驻军周边参考','完整档案预览','请选择已核证的历史记录',
 '此事件位置尚未核实，无法地图定位。','悬停高亮区域 · 点击展开详情',
 '地图默认展示所选年份及此前三年事件；疆域始终按当前年份'];
for(const file of publicFiles)for(const text of disallowed)
 assert(!read(file).includes(text),'Legacy editorial reader phrase in '+file+': '+text);
const ui=read('app.js'),html=read('index.html');
assert(ui.includes('请选择一条历史记录。'));
assert(ui.includes('暂无地图位置。'));
assert(ui.includes('完整档案'));
assert(html.includes('显示本年及此前三年的事件'));
assert(html.includes('atlas51-copy-polish'),'reader assets must invalidate desktop cache');
for(const file of ['js/historic-overlap-dossier-1497-1699.js','js/eighteenth-overlap-right-dossier.js']){
 assert(read(file).includes('atlas-18c-overlap-sources'),'Source links in territory records must remain');
 assert(!read(file).includes('悬停高亮区域 · 点击展开详情'),'Duplicate handholding note must be absent');
}
assert(read('js/historic-overlap-dossier-1497-1699.js').includes("hypotheses:'历史地点资料'"));
console.log('PASS atlas51: four reader surfaces concise, original historical notes and links left intact.');
