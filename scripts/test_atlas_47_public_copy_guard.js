#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const reader=require('../js/atlas-reader-copy.js');
const guard=require('../js/atlas-public-ui-guard.js');

const examples=[
 '虚线为概略历史地理参考，边界未经历史地图实测配准。',
 '区域海河贸易通道，非英国河两岸主权',
 '殖民省行政外缘不等于各地持续驻军',
 '重叠的示意区块各有独立史料，不能将多层颜色叠加计算历史占地。',
 '此处矩形参考框只是现代地图定位，不能据此计算实际占领面积。',
 '图层面积不能直接叠加来推算历史疆域',
 '边界未经实测地籍核对，仅供地图示意',
 '图中边界为近似轮廓，不代表每个村庄的英军控制',
 '地图颜色不代表持续驻军，也不能推算历史占地',
 '现代矩形仅提示殖民文件巨大声索，绝无内陆实际占据之意',
 '跨两港的商业通信路线概略，不能声称之间沙漠归公司所有',
 '区域示意为英商航线，不可据此统计历史占地',
 '研究预览，未审版图暂不展示',
 '图中区域仅作地理参考，非实际边界'
];
for(const s of examples){
 assert(guard.isWarning(s),'warning classifier missed: '+s);
 const cleaned=guard.strip(s);
 assert(!guard.isWarning(cleaned),'warning leaked: '+JSON.stringify({s,cleaned}));
 assert(!/未(?:经)?(?:实测|配准)|不代表.{0,18}控制|非英国河两岸主权/.test(cleaned),
  'unedited disclaimer leaked: '+JSON.stringify({s,cleaned}));
}
for(const [s,expected] of [
 ['1755年大普雷阿卡迪亚人遭英国殖民当局强制驱逐','1755年大普雷阿卡迪亚人遭英国殖民当局强制驱逐'],
 ['1762年英军攻占哈瓦那，1763年根据和约归还西班牙','1762年英军攻占哈瓦那，1763年根据和约归还西班牙'],
 ['1662年法国在普莱桑斯建立殖民据点','1662年法国在普莱桑斯建立殖民据点'],
 ['苏格兰的国家主权并未中断','苏格兰的国家主权并未中断'],
 ['1783年该土地仍由当地原住民社群独立治理','1783年该土地仍由当地原住民社群独立治理'],
 ['法国与英国围绕北美领土发生战争','法国与英国围绕北美领土发生战争'],
 ['英国在1770年对马萨诸塞的管辖权遭到挑战','英国在1770年对马萨诸塞的管辖权遭到挑战']
]){
 assert(!guard.isWarning(s),'historical fact misclassified: '+s);
 assert.equal(guard.strip(s),expected,'historical fact changed');
}
const chapter35=require('../js/century-chapter-narratives.js').forDecade(1840).intro;
assert.match(chapter35,/焚毁沿河聚落。夏威夷王国在英舰逼签临时割让书后恢复主权/);
assert.equal(guard.strip(chapter35),chapter35,'historical chapter copy must survive across sentence boundaries');
const withFact='1762年英军攻占哈瓦那。虚线为概略历史地理参考，边界未经历史地图实测配准。';
assert.equal(guard.strip(withFact),'1762年英军攻占哈瓦那');
const waterway=JSON.parse(read('data/eighteenth-century-b38-hudson-company.json'))
 .zones.find(x=>x.id==='B38-H-Z006');
assert(waterway&&waterway.note==='区域海河贸易通道，非英国河两岸主权');
assert.equal(guard.strip(waterway.note),'');
const html=read('index.html');
const hook='js/atlas-public-ui-guard.js?v=';
assert(html.includes(hook),'public guard must be loaded in reader HTML');
assert(html.indexOf('js/atlas-reader-copy.js?v=')<html.indexOf(hook),'copy parser must load first');
assert(html.indexOf('js/historic-overlap-dossier-1497-1699.js?v=')<html.indexOf(hook),
 'public guard must load AFTER all renderers');
const code=read('js/atlas-public-ui-guard.js');
assert(code.includes('MutationObserver'),'public guard must observe future rendered content');
assert(code.includes('characterData:true')&&code.includes('subtree:true'));
assert(code.includes("'title','aria-label','placeholder'"));
assert(!code.includes('source_urls=')&&!code.includes('geo_precision='),
 'UI guard must not edit original archive source/precision');
for(const p of ['AGENTS.md','docs/READER_PUBLIC_COPY_POLICY.md','.github/pull_request_template.md']){
 assert(read(p).includes('读者'),p+' missing reader-facing restrictions');
}
console.log('PASS atlas47: '+examples.length+' forbidden variants filtered, seven historical facts preserved; live DOM guard, future-agent policy and source evidence intact.');

for(const s of [
 '1894年保护地制度不能直接用现代国界显示为当时全部实控领土。',
 '不能把议员要求的统计量误认为政府已经报告的实绩。',
 '同一时期不同被告受到的指控、判决及处理方式有所区别，不能把所有当地抵抗者归入一份统一判决统计。',
 '不能编造当年已剥夺的全部寺庙土地面积。'
])assert.equal(reader.narrative(s),'',s);
assert.equal(reader.narrative('英国于1894年建立保护地。不能把现代国界画成历史边界。'),'英国于1894年建立保护地。');
assert.equal(reader.narrative('[[E19-TEST|英军攻占城镇]]。地图不代表全部实控领土。'),'[[E19-TEST|英军攻占城镇]]。');
assert.equal(reader.narrative('苏格兰王国始终保持独立。英国未取得该地的主权。'),'苏格兰王国始终保持独立。英国未取得该地的主权。');
const storyCode=read('js/history-stories.js');
assert(!storyCode.includes("return clean||String(text||'')"));
assert(!/esc\([^)]*\.warning\)/.test(storyCode));
assert(storyCode.includes('map(p=>readerFriendly(p)).filter(Boolean)'));

for(const s of ['本专题仅说明历史地理和权力结构。','本研究参考了现代资料。','地图只显示英军据点。','这一事件在地图上标为当地历史地点。','GIS绘图保留原有参考区。'])assert.equal(reader.narrative(s),'',s);
for(const s of ['原案判决后，殖民法院宣布没收土地。','本批货物从印度运往英国。','法令规定被奴役者不能自由迁徙。','史学家对实际人数有不同看法。'])assert.equal(reader.narrative(s),s,s);
assert.match(reader.narrative('英国于1894年建立保护地，[[E19-TEST|英军攻占城镇]]，地图不代表实控领土。'),/\[\[E19-TEST\|英军攻占城镇\]\]/);


// Reader-flow regressions: detached asynchronous loads and delayed clicks must
// not replace a more recent view. Keep the navigation and history-data contracts.
{
 const appCode=read('app.js'),storyCode=read('js/history-stories.js');
 assert(appCode.includes('function cancelEventListClick()'));
 assert(appCode.includes('node.isConnected&&!workspace.classList.contains'));
 assert(appCode.includes('setYear:v=>{stopPlay();setYear(v)}'));
 assert(appCode.includes('pause:()=>stopPlay()'));
 assert(storyCode.includes('loading?.isConnected&&container.firstElementChild===loading'));
 assert.equal((storyCode.match(/if\(!stillCurrent\(\)\)return;/g)||[]).length,2);
 assert(storyCode.includes('anchor.isConnected&&activeBody().contains(anchor)'));
 assert(storyCode.includes("if(e.key==='Escape'){cancelPendingClick();closePreview();}"));
 assert(storyCode.includes('bridge.pause?.()'));
 assert(appCode.includes('if(ev.detail===0)'));
 assert(storyCode.includes('if(e.detail===0)'));
}
