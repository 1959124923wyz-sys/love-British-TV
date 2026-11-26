/* One semantic map palette for all centuries. Geometry certainty is encoded separately. */
(function(root){
 'use strict';
 const colors=Object.freeze({
  administration:'#ad8be8', military:'#ad8be8', wartime_occupation:'#ad8be8',
  charter:'#e5ba74', revenue:'#e5ba74', land_dispossession:'#c68d47',
  resistance:'#55c69f', local_governance:'#55c69f', trade_influence:'#78b6ad',
  diplomacy:'#79bacb', foreign_occupation:'#879eac', battle:'#a5a2e8',
  military_impact:'#c56873', coercive_policy:'#d5937d',
  physical:'#68b8cd', neutral:'#b5b3b7', scottish:'#70afcf'
 });
 const aliases=Object.freeze({
  administrative:'administration', conquest:'wartime_occupation', occupied:'wartime_occupation',
  island:'administration', company:'trade_influence', company_post:'trade_influence',
  paper_claim:'charter', treaty_fishing:'charter', economic_network:'trade_influence',
  political:'diplomacy', conflict:'battle', displacement:'coercive_policy',
  coercion:'coercive_policy', conflict_damage:'military_impact', military_vicinity:'military_impact',
  historic_ruins:'neutral', settlement:'neutral', physical_shore:'physical', physical_coastline:'physical',
  physical_river:'physical', physical_trade_waterways:'physical', lake_shore:'physical',
  english:'administration', british:'administration', english_crown:'administration',
  french:'foreign_occupation', french_crown:'foreign_occupation', french_allied_scotland:'scottish'
 });
 const resolve=kind=>colors[aliases[kind]||kind]||colors.neutral;
 const map=kinds=>Object.freeze(Object.fromEntries(kinds.map(k=>[k,resolve(k)])));
 const legend=Object.freeze([
  ['administration','殖民行政、驻军与已证占领'],
  ['charter','特许、纸面声索与财税权'],
  ['land_dispossession','土地剥夺及历史地权申诉'],
  ['coercive_policy','强制迁移、拘禁与强制政策'],
  ['military_impact','军事镇压、袭击与战时毁损'],
  ['battle','战斗与争夺'],
  ['resistance','当地自主政权、自治领与抵抗'],
  ['trade_influence','贸易与经济联系'],
  ['diplomacy','保护、条约与政治关系'],
  ['foreign_occupation','其他国家控制、英国失去据点'],
  ['scottish','独立苏格兰王权'],
  ['physical','地理参考线及海岸'],
  ['neutral','历史地点与其他背景']
 ]);
 const api=Object.freeze({colors,aliases,resolve,map,legend});
 root.AtlasMapColors=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
