/* Atlas reader-facing copy, independent from the original historical evidence.
 * Only remove cartographic/editorial boilerplate; keep dates, named actions,
 * Indigenous/local agency, states, military outcomes and original source links.
 * Original JSON/source notes are NEVER overwritten.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.AtlasReaderCopy=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const authoringOnly=[
  /(?:边界|外缘|边线|疆界).*(?:实测|配准|绘制|测绘|地籍|精确|近似|示意|统计|不确定)/,
  /(?:实测|配准|测绘|地籍|经纬度|像素|面积统计|平方公里|几何|包络|范围示意|轮廓示意|非历史边界|非实测边界)/,
  /(?:矩形|示意框|参考框|地区框|地图框|范围框|图层|色块).*(?:参考|示意|背景|边界|位置|历史|代表|不|控制|画|可视|叠加|合计)/,
  /(?:示意|参考|编辑).*(?:覆盖|地理|范围|历史地图|地区|位置|边界|矩形|轮廓|方向|含义|面积|像素)/,
  /(?:地理|区域|范围|地点|驻军|港口).*(?:示意|未核|未验|未测|无法由此推定|不能据此推断)/,
  /(?:不(?:等于|代表|意味着|可以|得)|不能|不应|不作|不算|无法|尚未).*(?:实际|实占|实控|占地|占领面积|面积|边界|土地|驻军|推定|测量|统计|合计|控制程度|坐标|领土)/,
  /(?:不累计|不计|不用于|不能把|不得按|不对).*(?:面积|平方公里|控制|边界|疆域|统计|占据)/,
  /(?:地图定位|现代定位|位置提示|地图范围|读者|地图.*研究|编辑制作|编辑绘制|参考坐标|非事件精确发生地)/,
  /(?:不证明|不代表|不确认|无法确认).*(?:各村|每座|每一|每个|每处|周边|驻军|实际控制|军事控制|范围)/,
  /(?:仅供|只用于|仅用于).*(?:定位|阅读|参考|说明|展示|地理|概览|示意)/,
  /(?:区域.*重叠|重叠.*区块|各有独立史料|分开判读|不能累加|不相加|按性质分类)/,
  /(?:原史料|来源文件|读者视图|测试|试阅|研究预览|未正式发表).*(?:参考|说明|结果|显示|不|读者|面积|地图)/
 ];
 // Replace generic boilerplate at comma boundaries, retaining factual clauses.
 const leading=/^(?:地图|本图|图中|此图|这里|该区|本区|区域|边界|范围|位置|边缘|参考|虚线|填色|色块|矩形|外缘|框|地点符号|核心圆形|示意|现代|编辑|当代|此记录|殖民行政涉及的地区示意|殖民省行政外缘)/;
 const factual=/\b(?:\d{4}|条约|围城|攻占|驱逐|流放|屠杀|没收|税|奴役|贸易|法令|征服|战役|反抗|独立|投降|撤军|英军|法军|国王|王室|共和国|政府|社群|军队|失守|归还|迁移|占领|主权|权利|赎买|自治)\b/;
 const academic=(part)=>{
  const t=String(part||'').trim();
  if(!t)return true;
  if(authoringOnly.some(rx=>rx.test(t)))return true;
  if(leading.test(t)&&/(?:概略|大致|不代表|参考|示意|测绘|定位|没有|虚线|历史地图|非历史)/.test(t))return true;
  return false;
 };
 function clean(value){
  let original=String(value??'').replace(/[\t\r]+/g,' ').trim();
  if(!original)return'';
  // Early 18C notes are often one generic warning. Omit them instead of
  // inventing facts. Mixed statements retain their cited historical clauses.
  const parts=original.split(/([。；！？\n]+)/);
  const kept=[];
  for(let i=0;i<parts.length;i+=2){
   const sentence=parts[i]?.trim();
   if(!sentence)continue;
   if(!academic(sentence)){kept.push(sentence);continue}
   // A sentence may contain a dated event followed by a drafting disclaimer.
   // Keep only explicitly historical clauses; discard ambiguous map commentary.
   const clauses=sentence.split(/[，,]/).map(x=>x.trim()).filter(Boolean);
   if(clauses.length>1){
    const factualClauses=clauses.filter(x=>!academic(x)&&
     (/\d{4}|英军|法军|英国|法国|社群|条约|奴役|掠夺|抵抗|主权|公司|王室|原住民|占领|驱逐|自治|殖民|战争|驻军|行政|法令|税务/.test(x)));
    if(factualClauses.length)kept.push(factualClauses.join('，'));
   }
  }
  return kept.join('。').replace(/[。；，,\s]+$/g,'').trim();
 }
 function label(value){
  let s=String(value??'').trim();
  s=s.replace(/\s*[（(](?:非实测|未经测绘|非历史边界|未配准|不计面积|非实际占领|非实占|不等于)[^）)]*[）)]/g,'');
  s=s.replace(/\s*·\s*(?:非实测(?:历史)?边界|地理参考|不计(?:算)?面积|未(?:经)?(?:实测|配准|测绘)|地图定位参考|非实际占领)(?=\s*·|$)/g,'');
  s=s.replace(/(?:局部参考|概略参考|历史参考)(?=$)/,'');
  return s.trim().replace(/[·／、，\s]+$/g,'');
 }
 function caption(value){
  return label(clean(value)||'');
 }
 return Object.freeze({clean,label,caption,academic});
});
