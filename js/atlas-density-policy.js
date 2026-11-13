/* Pure presentation policy. No chronology, GIS coordinate or source records are altered.
 * One event source item becomes one marker or one member of a clickable cluster.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 root.AtlasDensityPolicy=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 function normalZoom(zoom){
  const x=Number(zoom);
  return Number.isFinite(x)?Math.max(0,x):3;
 }
 function modeForZoom(zoom){
  const z=normalZoom(zoom);
  return z<=4?'wide':z<=6?'regional':'local';
 }
 function radiusForZoom(zoom){
  const z=normalZoom(zoom);
  if(z<=3)return 76;
  if(z<=4)return 62;
  if(z<=5)return 48;
  if(z<=6)return 38;
  if(z<=7)return 32;
  return 28;
 }
 const zoomTable=Object.freeze([
  Object.freeze({through:3,mode:'wide',radius:76}),
  Object.freeze({through:4,mode:'wide',radius:62}),
  Object.freeze({through:5,mode:'regional',radius:48}),
  Object.freeze({through:6,mode:'regional',radius:38}),
  Object.freeze({through:7,mode:'local',radius:32}),
  Object.freeze({through:Infinity,mode:'local',radius:28})
 ]);
 return Object.freeze({modeForZoom,radiusForZoom,zoomTable});
});
