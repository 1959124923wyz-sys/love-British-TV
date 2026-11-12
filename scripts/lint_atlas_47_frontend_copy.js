#!/usr/bin/env node
'use strict';
/* Prevent new UI literals from hardcoding editorial cartography disclaimers.
 * Source JSON research precision remains untouched. The browser guard covers
 * data-driven strings that static literal search cannot see.
 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const rules=[
 /虚线.{0,48}(?:概略|仅供|参考|配准|实测|不代表)/,
 /边界.{0,48}(?:未经|没有|未曾).{0,25}(?:地图|测绘|实测|配准)/,
 /(?:历史地图|地图原件).{0,35}(?:未经|实测|配准|尚未核实)/,
 /(?:示意区块|示意色块|叠加色块).{0,65}(?:面积|计算|叠加|主权|控制)/,
 /殖民省行政外缘.{0,35}(?:不等于|不代表|驻军)/,
 /(?:河两岸|海河贸易通道).{0,35}(?:非英国|主权|不代表|不能)/,
 /(?:虚线|矩形|图层|区块).{0,45}(?:不能|不可|不得|不应).{0,45}(?:面积|占地|疆域|领土)/,
 /(?:未经历史地图实测配准|非英国河两岸主权|不能将多层颜色叠加计算历史占地)/,
 /(?:区域外廓|示意边界).{0,35}(?:只供|仅作|参考|非真实|不代表|未核)/,
 /(?:专题研究试阅|候审历史节点|研究试阅.{0,15}版图未发布)/
];
const forbidden=text=>rules.some(rx=>rx.test(String(text)));
const fixtures=[
 '虚线为概略历史地理参考，边界未经历史地图实测配准',
 '区域海河贸易通道，非英国河两岸主权',
 '殖民省行政外缘不等于各地持续驻军',
 '重叠的示意区块各有独立史料，不能将多层颜色叠加计算历史占地'
];
for(const s of fixtures)assert(forbidden(s),'static forbidden-string matcher missed: '+s);
for(const s of ['1762年英军攻占哈瓦那','法国与英国对该地区的主权存在争议',
 '1665年王室特许将疆域声索范围延伸至太平洋'])
 assert(!forbidden(s),'static matcher classified a historical fact');
const files=['index.html','app.js',
 ...fs.readdirSync(path.join(root,'js')).filter(n=>n.endsWith('.js')).map(n=>'js/'+n)];
const violations=[];
for(const file of files){
 const src=fs.readFileSync(path.join(root,file),'utf8');
 // Inspect actual HTML text as well as JS string/token literals. Do not scan
 // comments or documentation, and NEVER forbid research-only source JSON.
 const literal=/(?:'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\`(?:\\.|[^\`\\])*\`)/gs;
 let m;
 while((m=literal.exec(src))){
  const raw=m[0];
  if(!forbidden(raw))continue;
  const line=src.slice(0,m.index).split('\n').length;
  violations.push({file,line,excerpt:raw.slice(0,180)});
 }
 if(file==='index.html'){
  const body=src.replace(/<!--[\s\S]*?-->/g,'')
   .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
  for(const [i,line] of body.split('\n').entries()){
   const visible=line.replace(/<[^>]*>/g,' ');
   if(forbidden(visible))violations.push({file,line:i+1,excerpt:visible.slice(0,180)});
  }
 }
}
if(violations.length){
 console.error('READER_COPY_POLICY_VIOLATIONS='+JSON.stringify(violations,null,2));
 process.exitCode=1;
}else console.log('PASS reader UI static literal ban: '+files.length+' frontend files, no hardcoded cartographic disclaimers; original historical JSON unaffected.');
