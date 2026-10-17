# 蛇E分身01：专题38／39史料与地图交接（2026-10-17）

## 正式库查重基础

以主分支 `659f68aab39f378673e640479e7ba1929595867c` 核查：原版1580年代39事件、82来源、6线路；1590年代38事件、74来源、0线路；专题22篇。第38、39项尚未列入专题索引。原有 38 的五个事件ID与 39 的五个事件ID均原样保留。本包新增1580年代10事件和8来源、1590年代1事件和1来源；既有3航线增设停靠点但总线路数不增加。

## 38 德雷克主要核证事项

**出发日期**：Bigges/Croftes 1589年刊本记9月12日集结登舰、9月14日离岸；Boazio版画标题强调1585年9月出发、1586年7月返至朴次茅斯，精确航行日不应混用成单一日期。文本用“1585年9月”。舰队25艘大小舰与约2300人来自Bigges；美国国会图书馆概述使用另外的大小船编制数字，不混同为同一统计口径。

**行动次序**：普利茅斯→加利西亚海岸（Vigo/Bayona；现代Baiona仅当作港镇参考）→葡属圣地亚哥（1585年11月）→圣多明各（1586年1月）→卡塔赫纳（2月至3月下旬）→古巴Cabo San Antonio（4月27日及其后返航补水）→圣奥古斯丁（5月末—6月）→罗阿诺克殖民撤出（6月）→英格兰朴次茅斯（7月）。时间依据Bigges与LOC汇编；并非实测GPS逐日线路。

**原始来源**：
- Bigges、Croftes等，*A Summarie and true discourse of Sir Frances Drakes West Indian Voyage*（1589年印本，Thomas Gates献辞），美国国会图书馆馆藏目录 https://www.loc.gov/item/81458651/ ；全文数字化 https://www.gutenberg.org/files/19589/19589-h/19589-h.htm 。
- Boazio *Map and views illustrating Sir Francis Drake's West Indian voyage 1585–6* 1589年绘版，https://www.loc.gov/item/2007626708/ 。版画有总航程与四座城鸟瞰，**史料地图并未提供可直接套用在当代GIS的实测破坏区**。
- Hans P. Kraus/US Library of Congress *The Caribbean Raid* https://www.loc.gov/collections/sir-francis-drake/articles-and-essays/drake-biography/the-caribbean-raid/ ：圣多明各25000杜卡特与卡塔赫纳110000杜卡特，属历史报告的赎金，不是英国国库净利润。
- 美国国家公园管理局 https://www.nps.gov/people/sirfrancisdrake.htm ，注意1586年圣奥古斯丁木质防御不能用1672年以后建成的Castillo de San Marcos石堡替代。
- Smithsonian关于被强制押运人群与去向争议 https://www.smithsonianmag.com/history/did-francis-drake-bring-enslaved-africans-north-america-decades-jamestown-180970075/ 。不累加不同证词中的150、200、250等互斥或重复统计。

**需进一步调查但绝不填造**：圣多明各与卡塔赫纳哪些街区实际被焚、葡属圣地亚哥建筑损毁边界、舰队确切锚地、英国王室净得金额，均缺可作为地图面或确定财务值的数据。航线已通过增补既有三条线路的中途节点表达，不新增一条大幅重叠跨洋线路。

## 39 宾厄姆责任拆分核证

### Richard（理查德）

- 1585年康诺特财政协议，主导省级军政（皇家爱尔兰学院传记）。
- 1586年1月戈尔韦省议会审判，《四大师编年史》M1586.1记70名男女被处决，人数由编年史报告，不等于全部康诺特镇压死亡人数。
- 1586年3月围攻Cluain-Dubhain、在梅奥镇压伯克及苏格兰援兵，Cloonoon旧名地理归属待核，莫伊河边战场未能精确地理化。
- 1588年监督西班牙沉船处理/对幸存者镇压的省级责任，**不得把风暴中溺亡的船员计成英军杀害**。
- 1590年春宾厄姆指挥军队两路进入布雷夫尼；AFM M1590.4记一部往Sliabh Cairbre、一部从斯莱戈桥西侧进军，沿途毁掠并迫使奥罗克流亡。
- 1591年英方指控奥罗克的部分证词记录由Richard提供，但苏格兰捕送和伦敦审判不是他个人在爱尔兰战场实施。

### George（乔治）

- 1585年12月驻守Ballymote并出任斯莱戈地方治安官，征收王室税、修道院地产租、民间奥康纳地产租，要求居民供士兵食宿并扣押牲畜（DIB）。原事件 `GAP1586-SLIGO-EXACTIONS` 已涵盖，**不另建重复点**。
- 1588年奥康纳·斯莱戈继承认定和地产代管，新增司法财产事件，现代斯莱戈城市参考坐标不表示被接管地界。
- 1588年秋监管处决至少700名西班牙沉船幸存者，数字来自DIB George；原事件 `GAP1588-SLIGO-ARMADA-EXECUTIONS` 已有，不重复创建或把各海滩数字加总。
- 1588年末亲自拘捕并酷刑逼问北斯莱戈奥哈特家族藏金，原事件 `ARM1588-SLIGO-OHART-TORTURE` 正确保留无坐标。
- 1589年春一部分斯莱戈家族因征敛、搜财联合梅奥伯克抵抗，新增未定位事件。
- 1590年3月，奥罗克一方袭击并烧毁Ballymote城镇（DIB George）；**这一事件的纵火主体是奥罗克部队，不能算作George所部焚毁。**

### 文献层级

1. Royal Irish Academy, Dictionary of Irish Biography: Richard https://www.dib.ie/biography/bingham-byngham-sir-richard-a0665 ，George https://www.dib.ie/biography/bingham-byngham-sir-george-a0664 ，Brian na Múrtha Ó Ruairc https://www.dib.ie/biography/orourke-o-ruairc-brian-ballach-a7029 。传记直接归责主线人物。
2. University College Cork CELT《四大师编年史》M1586（https://celt.ucc.ie/published/T100005E/text009.html）、M1590（https://celt.ucc.ie/published/T100005F/text002.html）、M1591（https://celt.ucc.ie/published/T100005F/text003.html）。编年史存在编纂立场，行军和死亡人数优先保留文本本身等级。
3. NLI 1588年5月28日Richard议及斯莱戈土地与城堡的原函**馆藏目录** https://sources.nli.ie/Record/MS_UR_010752 ，未看手稿正文；不据目录推断法律条款全文。
4. 1591年奥罗克控罪的Egerton原件编辑本 https://archive.org/details/egertonpaperscol00elle ，属于王室检控材料，指控内容不能自动视为刑事事实。

### 不绘制的新“面”

- Sligo征租涉及多种租权和地方家族田地，未得到1585–1591时期逐田界、逐城堡司法权限数据；不得将现代Co. Sligo或Connacht整体涂为恒定英军占领/税区。
- 1586 Galway审判具体绞刑场、Cloonoon堡址及Moy交战区域均缺可靠现代精确定位，不以城镇周围椭圆替代。
- 1590 Breifne南北两路军事进军只知道大致方向，缺古路逐点史实；研究记录保存于 `patch/unlocated_route_research_only.json`，不直接入前端Routes。

## 验收与依赖

离线 `tools/validate_package.py` 和 `tools/test_installer_fixture.py` 验证通过；使用 GitHub 正式字段对新增事件做数据准入与历史分类。正式合并后应通过： `scripts/validate_atlas.py`、`scripts/test_chapter10_published.js`、`scripts/test_chapter11_published.js`、`scripts/validate_published_data_references.js`、专题长文加载与跨年跳转真实浏览器测试。**无网页、地图、史料边界或净利润数据被编造。**
