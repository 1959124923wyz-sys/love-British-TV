/* Presentation-only editorial headlines for 17th-century history.
 * Keep event.name, article.title, prose, evidence and dates untouched.
 * Keyed overrides are reviewed by stable event/story ID; never infer a new fact.
 * A missing override keeps the original wording after removing only a redundant leading year.
 */
(function(){
 'use strict';
 const eventTitles={
 '1600S-E091':'安纳波利斯湾建立早期皇家港',
 '1600S-E018':'弗吉尼亚公司获王室特许',
 '1600S-E005':'米克马克首领守护皇家港居所',
 '1610S-E004':'Appamattuck人击退英军',
 '1610S-E025':'东印度公司抵马苏利帕特南',
 '1610S-E090':'米克马克首领与法国外交',
 '1610S-E097':'非洲裔与原住民劳工抵百慕大',
 '1610S-E022':'爱尔兰巴利尼格庄园人口调查',
 '1620S-E027':'马萨诸塞湾公司获王室特许',
 '1620S-E032':'被贩卖儿童勒热纳抵魁北克',
 '1630S-E025':'蒙特塞拉特英人殖民聚落建立',
 '1640S-E093':'法国在查尔斯堡旧址建要塞',
 '1650S-E009':'皮阔特人取得重居许可',
 '1650S-E092':'拉图尔授予普布尼科殖民男爵领',
 '1650S-E038':'克伦威尔启动加勒比西方计划',
 '1650S-E093':'英共和国夺取圣约翰河口堡垒',
 '1650S-E090':'英军击退西班牙收复牙买加',
 '1660S-E008':'瓦姆苏塔继任波卡诺基特首领',
 '1660S-E090':'牙买加限制劳工离开种植园',
 '1660S-E016':'梅塔科姆继任波卡诺基特首领',
 '1660S-E047':'非洲王室冒险公司获贩奴特许',
 '1660S-E120':'《鼓励贸易法》限制殖民进口',
 '1660S-E091':'Mayken取得自由释放文书',
 '1660S-E124':'英军夺取海岸角城堡',
 '1660S-E125':'荷兰夺取苏里南威洛比堡',
 '1660S-E095':'Nonsuch号抵詹姆斯湾',
 '1660S-E042':'卡罗来纳《基本宪制》确立奴役权',
 '1670S-E124':'背风群岛遭掳人口索赔争议',
 '1670S-E006':'巴巴多斯将被奴役者列为财产',
 '1670S-E008':'约克公爵要求预付奴隶购买款',
 '1670S-E096':'博巴森地区出现法国农庄',
 '1670S-E043':'弗吉尼亚与马里兰民兵误攻',
 '1670S-E024':'巴巴多斯禁止被奴役者参加贵格会',
 '1670S-E049':'帕蒙基首领率众避入沼泽',
 '1670S-E056':'莫希干部落庇护原住民投降者',
 '1670S-E093':'库索代表签署沿岸土地契据',
 '1670S-E027':'《中部种植地条约》签订',
 '1670S-E030':'Butts诉Penny案涉及奴役买卖',
 '1680S-E036':'卡罗来纳支持袭击Westo',
 '1680S-E094':'新法兰西设内陆毛皮商站',
 '1680S-E123':'冈比亚詹姆斯堡被囚者集体反抗',
 '1680S-E129':'佩恩获宾夕法尼亚王室特许',
 '1680S-E096':'阿卡迪亚Grand-Pré农庄建立',
 '1680S-E131':'莱纳佩人德拉瓦河土地契据',
 '1680S-E090':'牙买加《奴役者治理法》',
 '1680S-E092':'苏格兰移民建立Stuart’s Town',
 '1680S-E134':'百慕大转为王室殖民地',
 '1680S-E012':'王室准许西班牙船采购被奴役者',
 '1680S-E017':'东印度公司调拨10名被奴役者至明古连',
 '1680S-E018':'Grantham案维持奴役人身追索',
 '1680S-E021':'王室海军对非洲公司护航转向',
 '1680S-E121':'两艘商船因违贩奴垄断被扣',
 '1680S-E126':'詹姆斯二世抵爱尔兰谋求复辟',
 '1690S-E095':'新英格兰军队劫掠皇家港',
 '1690S-E096':'维尔邦重组圣约翰河防御联盟',
 '1690S-E139':'《利默里克条约》准许军民离境',
 '1690S-E130':'Hannibal号航次大量死亡',
 '1690S-E061':'贸易与种植园委员会成立',
 '1690S-E097':'米克马克盟军击退英军进攻',
 '1690S-E134':'Adventure号航次发生船上反抗',
 '1690S-E036':'法军夺回约克堡并改名',
 '1690S-E121':'1695年贸易法部分条款开始适用',
 '1690S-E131':'Beginning号赴牙买加贩奴',
 '1690S-E091':'牙买加法令组建追捕马龙队伍',
 '1690S-E132':'Albion Frigate号船上反抗'
 };
 const storyTitles={
 'E6-T01':'阿尔斯特殖民与土地没收',
 'E6-T02':'爱尔兰征服与财产转移',
 'E6-T03-LAND-1642-1698':'爱尔兰土地剥夺与再分配',
 'E6-T03-WILLIAMITE-WAR':'威廉派战争与爱尔兰征服',
 'E6-T04-CONQUEST':'英格兰征服苏格兰',
 'E6-T04-GLENCOE':'格伦科屠杀与王室问责',
 'E6-T04-DARIEN':'苏格兰达连殖民失败',
 'E6-T05':'弗吉尼亚：战争、夺地与奴役',
 'E6-T06':'新英格兰原住民战争与奴役',
 'E6-T07-BARBADOS':'巴巴多斯糖业与奴役制度',
 'E6-T07-LEEWARD':'圣基茨屠杀与东加勒比战争',
 'E6-T08':'牙买加征服与马龙抵抗',
 'E6-T09-NE-DOMINION':'新英格兰自治领与波士顿起义',
 'E6-T09-PENNSYLVANIA':'宾夕法尼亚殖民与莱纳佩地契',
 'E6-T09-CAR':'卡罗来纳领主殖民与奴役',
 'E6-T09-NY':'新尼德兰与纽约的英荷争夺',
 'E6-T10-QUEBEC-KIRKE':'英军短暂占领魁北克',
 'E6-T10-ACADIA':'阿卡迪亚多方殖民争夺',
 'E6-T10-HBC':'哈德孙湾毛皮贸易与堡垒战争',
 'E6-T10-NEWFOUNDLAND':'纽芬兰渔业殖民与战争',
 'E6-T11-VOYAGES':'跨大西洋奴隶贸易：死亡与反抗',
 'E6-T12':'东印度公司在亚洲扩张',
 'E6-T13':'皇家非洲公司与奴隶贸易',
 'E6-T14-NAV':'《航海法》与英荷战争',
 'E6-T15':'海上贸易与财政国家形成',
 'E6-T16-SURINAME':'苏里南糖业殖民与英荷争夺',
 'E6-T16-PROVIDENCE':'普罗维登斯岛殖民与沦陷',
 'E6-T16-ATLANTIC-ISLANDS':'百慕大与巴哈马殖民',
 'E6-T17-AFRICAN-FORTS':'海岸角争夺与丹吉尔撤离'
 };
 function semanticTitle(item){
  if(!item)return '';
  const full=String(item.name||'').trim();
  if(!full)return '';
  if(!Number.isFinite(Number(item.year))||Number(item.year)<1600)return full;
  if(eventTitles[item.id])return eventTitles[item.id];
  // Year is already shown separately on each card. Only remove redundant prefix.
  const stripped=full.replace(/^(?:1[6][0-9]{2})年(?:[0-9]{1,2}月(?:[0-9]{1,2}日)?)?(?:[：:、\s]*)/,'').trim();
  return stripped||full;
 }
 function storyTitle(item){
  if(!item)return '';
  return storyTitles[item.id]||String(item.title||'');
 }
 function sectionTitle(original){
  const full=String(original||'');
  const n=full.replace(/^[一二三四五六七八九十]+、/,'');
  const ix=n.indexOf('：');
  // Keep the entire heading unless an informative first clause can stand alone.
  return ix>=0&&ix>=8&&ix<=25?n.slice(0,ix):n;
 }
 window.HistoryHeadlines={eventTitle:semanticTitle,storyTitle,sectionTitle,
  counts:{reviewedEvents:Object.keys(eventTitles).length,reviewedStories:Object.keys(storyTitles).length}};
})();
