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
  /(?:重叠|叠加|多层|两层|区块|色块).*(?:面积|计算|占地|独立史料|绘图|分辨)/,
  /(?:整岛外廓|岛屿外廓|历史外廓|图上外廓|虚线|现代轮廓|现代岛屿轮廓|地图轮廓).*(?:展示|示意|仅|持续|实际|控制|统治|配准|地理|数据|非)/,
  /(?:不能将|不应把|不要把|不可将).*(?:区块|面积|颜色|领土|疆界|区域|外廓)/,
  /(?:原地图|本地图|图中区域|此区域|地图填色|轮廓填色|虚线圆).*(?:不能|不代表|不可|示意|估算|测绘|实际|已知|地图)/,
  /(?:现代)?(?:矩形|外廓|示意区块).{0,30}(?:声索|占据|主权|领土|实际|位置|图示)/,
  /(?:不(?:等于|代表|构成|证明)|不可据此|并非).{0,25}(?:主权|领土|疆域|全部控制|沙漠归|殖民所有)/,
  /(?:商业通信|商信|航运|沿河|跨港|航线|路线|贸易网络|贸易联系).{0,32}(?:概略|非|不能声称|仅用于|定位)/,
  /(?:不能声称|不能推定|无法据此).{0,30}(?:土地|沙漠|所有|主权|控制)/,
  /(?:区域|海河|河流|水道|航线|河段|河口|贸易).{0,12}(?:通道|走廊).{0,24}(?:主权|领土|控制|示意|参考|边界)?/,
  /(?:非|并非|不属于|未取得|未能|不是).{0,16}(?:英国|英方|英格兰|殖民国).{0,20}(?:主权|领土|控制|统治|占领)/,
  /(?:非|并非|不等于|不构成).{0,16}(?:河两岸|整条河|全域|实际主权|领土控制)/,
  /(?:虚线|外廓|边缘|参考区域|区块|轮廓|示意).{0,32}(?:历史地理|地理参考|未经|实测|地图|非|主权|统治)/,
  /(?:历史地理|地图绘制|制图).{0,12}(?:参考|提醒|注释|说明|边界|技术)/,
  /(?:地理|河流|通道).{0,14}(?:关联|联系).{0,20}(?:主权|控制|不等于|非)/,
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
  s=s.replace(/\s*·\s*非(?:整岛|全岛|全部区域)(?:持续|实际)(?:英方)?(?:统治|控制|占领)(?=\s*·|$)/g,'');
  return s.trim().replace(/[·／、，\s]+$/g,'');
 }
 function caption(value){
  return label(clean(value)||'');
 }
 return Object.freeze({clean,label,caption,academic});
});
