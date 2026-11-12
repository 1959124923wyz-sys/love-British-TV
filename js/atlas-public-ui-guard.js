/* Public-surface last-line guard. Historic research and original source fields stay untouched.
 * Only remove editorial cartography/methodology warnings from visible HTML and tooltips.
 * Always use AtlasReaderCopy.clean() at the point of rendering as the first defense.
 */
(function(root,factory){
 const reader=root.AtlasReaderCopy||(typeof module==='object'&&module.exports?require('./atlas-reader-copy.js'):null);
 const api=factory(reader,root.document||null);
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.AtlasPublicCopyGuard=api;
})(typeof window!=='undefined'?window:globalThis,function(reader,doc){
 'use strict';
 if(!reader)throw new Error('AtlasReaderCopy must load before AtlasPublicCopyGuard');

 // Require an editorial/map-precision context. Ordinary historical facts about
 // legitimate competing sovereignty and dated military control must survive.
 const warnings=[
  /(?:虚线|虚框|色块|填色|图层|示意区块|叠加).{0,48}(?:示意|概略|参考|配准|实测|面积|边界|面积统计|不能|不代表|不等于|历史地理)/,
  /(?:殖民(?:省|地)?(?:行政)?外缘|行政外缘).{0,35}(?:不等于|不代表|持续驻军|实际驻军)/,
  /(?:商业通信|商信|航运网络|海河贸易|贸易路线|商业路线).{0,28}(?:概略|仅供|不代表|不等于|不能声称|非英国)/,
  /(?:概略|示意).{0,25}(?:不能声称|不属|归公司所有|之间沙漠)/,
  /(?:边界|疆界|外缘|轮廓|包络|矩形|参考框|示意框).{0,45}(?:未经|未|配准|实测|测绘|参考|近似|示意|虚线|地籍|像素|统计|面积)/,
  /(?:未经|未曾|尚未|没有).{0,15}(?:地图|历史地图|地籍|原件).{0,15}(?:配准|实测|测绘|核实)/,
  /(?:非|并非|不等于|不代表|不能推定|无法推断|不可推断|不构成).{0,35}(?:实际控制面积|历史边界|实测|河两岸主权|英国河两岸主权|地图占地|全面驻军|全境控制)/,
  /(?:地图|示意|区块|外廓|边线).{0,34}(?:不是|不代表|不等于|不能|不得|不可).{0,36}(?:主权|疆域|领土|占地|面积|驻军|控制|测绘)/,
  /(?:多层|多块|多区|区块|颜色|地图面积|叠合|重叠).{0,40}(?:叠加|累计|相加|计算|统计|面积|领土|占地)/,
  /(?:非英国|非英方|不属英国|非英格兰|英国非).{0,35}(?:主权|统治|疆域|领土|控制|拥有)/,
  /(?:海河|河两岸|沿河|河口|水道|贸易通道|商业通道|航运通道).{0,42}(?:主权|示意|参考|实控|测绘|不代表|非英国)/,
  /(?:示意|概略|参考|粗略|近似|现代).{0,22}(?:边界|历史地理|地理范围|位置|外廓|地图轮廓|矩形包络|地图范围)/,
  /(?:非|仅为|仅作|只是|只供|仅供).{0,20}(?:地理参考|位置参考|地图参考|绘制参考|行政外缘|示意图|代表性位置)/,
  /(?:不能|不得|不可|不应|不宜|无法据此).{0,30}(?:计算|推算|叠加|合计|估算|统计|证明).{0,25}(?:面积|疆域|实际|控制|占地|主权)/,
  /(?:仅供|仅用于|只用于|仅作).{0,18}(?:定位|地图|阅读|参考|示意)/,
  /(?:研究预览|研究试阅|未经完整审核|版图未发布|未审版图|研究候审|候审历史节点|专题编审中)/,
  /(?:学术|编审|制图|绘图|地图制作|地图几何).{0,20}(?:备注|注释|提示|注意|说明|原件|参考|限制)/,
  /(?:地图定位|现代定位|示意区块|现代矩形|矩形包络|纸面声索外廓|参考坐标|非事件现场)/,
  /(?:不计|不用于|不累计|不得按).{0,25}(?:占领|控制|领土|面积|平方公里|统计)/
 ];
 const isWarning=value=>{
  const v=String(value||'');
  return v.length>0&&warnings.some(rx=>rx.test(v));
 };
 // The reader-copy parser retains documented historical clauses while removing
 // cartographic notes. Fail closed only for the remaining editorial clauses.
 function strip(value){
  const input=String(value??'');
  if(!isWarning(input))return input;
  let output=reader.clean(input);
  if(!output)return '';
  if(isWarning(output)){
   const paragraphs=output.split(/([。；！？\n]+)/);
   const keep=[];
   for(let i=0;i<paragraphs.length;i+=2){
    const p=paragraphs[i].trim();
    if(!p)continue;
    const clauses=p.split(/[，,]/).map(v=>v.trim()).filter(Boolean);
    const good=clauses.filter(x=>!isWarning(x)&&!reader.academic(x));
    if(good.length)keep.push(good.join('，'));
   }
   output=keep.join('。');
  }
  return isWarning(output)?'':output;
 }
 const counters={text:0,attributes:0,removedEmpty:0,scans:0};
 const skipTags='script,style,noscript,template,textarea,pre,code,input,select,option,svg,canvas';
 function ignored(node){
  const el=node?.nodeType===1?node:node?.parentElement;
  return !el||Boolean(el.closest(skipTags));
 }
 function sanitizeText(node){
  if(!node||node.nodeType!==3||ignored(node))return;
  const old=node.nodeValue||'';
  if(!isWarning(old))return;
  const next=strip(old);
  if(old!==next){node.nodeValue=next;counters.text++;}
  const parent=node.parentElement;
  if(next===''&&parent&&/^(?:P|SMALL|LI|SPAN)$/.test(parent.tagName)&&
     parent.childNodes.length===1&&!parent.attributes.getNamedItem('id')&&
     !parent.querySelector('a,button,input')){
   parent.remove();counters.removedEmpty++;
  }
 }
 function sanitizeAttributes(el){
  if(!el||el.nodeType!==1||ignored(el))return;
  for(const name of ['title','aria-label','placeholder']){
   if(!el.hasAttribute(name))continue;
   const original=el.getAttribute(name)||'';
   if(!isWarning(original))continue;
   const next=strip(original);
   if(original!==next){
    if(next)el.setAttribute(name,next);
    else el.removeAttribute(name);
    counters.attributes++;
   }
  }
 }
 function scan(node){
  if(!node||ignored(node))return;
  counters.scans++;
  if(node.nodeType===3){sanitizeText(node);return;}
  if(node.nodeType!==1&&node.nodeType!==9&&node.nodeType!==11)return;
  if(node.nodeType===1)sanitizeAttributes(node);
  const walker=doc.createTreeWalker(node,4|1);
  while(walker.nextNode()){
   const part=walker.currentNode;
   if(ignored(part))continue;
   if(part.nodeType===3)sanitizeText(part);
   else sanitizeAttributes(part);
  }
 }
 function visibleWarnings(){
  if(!doc?.body)return[];
  const problems=[];
  const walker=doc.createTreeWalker(doc.body,4);
  while(walker.nextNode()){
   const n=walker.currentNode;
   if(!ignored(n)&&isWarning(n.nodeValue))problems.push({
    tag:n.parentElement?.tagName||'',text:(n.nodeValue||'').slice(0,180)
   });
  }
  return problems;
 }
 if(doc?.body){
  scan(doc.body);
  const observer=new MutationObserver(records=>{
   const nodes=new Set();
   for(const change of records){
    if(change.type==='childList')for(const added of change.addedNodes)nodes.add(added);
    else if(change.type==='characterData')nodes.add(change.target);
    else if(change.type==='attributes')nodes.add(change.target);
   }
   for(const n of nodes)if(n.isConnected)scan(n);
  });
  observer.observe(doc.body,{subtree:true,childList:true,characterData:true,
   attributes:true,attributeFilter:['title','aria-label','placeholder']});
 }
 return Object.freeze({strip,isWarning,scan,visibleWarnings,
  getAudit:()=>({...counters,remaining:visibleWarnings().length})});
});
