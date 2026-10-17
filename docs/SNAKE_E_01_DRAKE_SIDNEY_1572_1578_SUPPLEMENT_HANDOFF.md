# 爱英TV｜蛇E分身01｜专题31、32补图与正文更正交接

交付日期：2026-10-17  
分支：`feature/snake-e-01-drake-sidney-supplement-20261017`  
上游基线：`feature/drake-sidney-frobisher-1572-1578-20261016@bb199d2fdc4c1669fb0f3beba8a1073af81c2091`（对应待审PR #120）  
交付方式：**依赖PR #120的增量补丁；由蛇E审查合并到上游专题分支，再由主编审核正式站点上线。** 不可直接把此分支整体对main发PR合并，否则会连带包含上游尚未正式通过的专题28、30、33。

## 一、为什么需要再次补强

PR #120已编写31、32两篇长文及首批地图点/线。对照初期航海记述和锡德尼传记，发现可补强的关键事实：

1. 1573年德雷克**2月未成功的运银伏击、2月Venta de Cruces进攻、3月31日Rio Francisco登陆、4月1日与法方合作成功夺银**为先后不同的史事。上游初稿将Venta de Cruces写成4月成功劫掠的后续，错误；本补丁按文献时间顺序重新编排长文。
2. 原正式事件 `1570S-E006` 使用巴拿马地峡南部约9.100,-79.530的位置；早期报告记述4月1日伏击在加勒比侧Nombre de Dios附近，本补丁以已有Nombre de Dios现代地名参考 `9.565,-79.472` 重新锚定，`exact_attack_site_unlocated:true` 原字段不删除，**不冒称伏击发生于港镇坐标本身**。
3. 1576锡德尼巡行戈尔韦、阿森赖、阿斯隆的先后地名，阿森赖遭毁后征款修复，9月对伯克反攻以及莫伊河和苏克河作战，可以建立完整的军事财政时序。1577年7月26日锡德尼在Castledermot的军需现款化信件有爱尔兰国家图书馆馆藏目录可查。

## 二、正式数据改动

`data/atlas-1570-1579.json`：新增8个独立来源史事（原68条→76条），新添7条来源（83→90），增一条有据地名先后的示意线（26→27）；不增加新的英国占领地块、推定统治面积或无源几何多边形。原有事件ID和地图UI不删除不重制。

### 31｜德雷克新增3件

- `DRA1573-FEB-CIMARRON-TWO-SEAS-RIDGE`：1573年2月11日Cimarron向导引德雷克登山眺望两洋；山岭树址未考定，`lat/lng:null`。
- `DRA1573-FEB-MULE-TRAIN-FAILED`：1573年2月中旬，派克暴露，运金商队改道，首次伏击失败；精确埋伏地未考定，`lat/lng:null`。
- `DRA1573-MAR-RIO-FRANCISCO-LANDING`：1573年3月31日，德雷克、法国勒特斯图与Cimarron盟友在Rio Francisco登陆，再次攻击运银道；历史登陆地点未考定，`lat/lng:null`。

**原有事件修正**：
- `DRA1573-VENTA-DE-CRUCES-RAID`：日期明确改为**2月**，采用早期记录描述交战与入镇过程，不再当成4月成功劫银后的事情。
- `DRA1573-CIMARRON-LE-TESTU-ALLIANCE`：日期写为3月下旬，补入早期叙事来源。
- `1570S-E006`：4月1日劫银事件的现代港镇参考点改用Nombre de Dios；事件的真实道路伏击坐标**仍未确定**。

### 32｜锡德尼新增5件

- `SID1576-GALWAY-CIRCUIT`：1576年春锡德尼到戈尔韦处理当地伯克家族带来的破坏，现代参考点53.27245,-9.05095（GeoNames）。
- `SID1576-ATHENRY-LEVY`：经过遭毁的阿森赖并命邻近地区征款重建，现代参考点53.2964,-8.7431（Getty TGN）。
- `SID1576-ATHLONE-CIRCUIT`：途经阿斯隆、于4月13日返回都柏林，现代参考点53.422778,-7.937222（GeoNames）。
- `SID1576-MOY-SUCK-ROYAL-OPERATIONS`：1576年9—10月王军与伯克家族在莫伊河与苏克河的行动、筑桥；未识别16世纪桥位，不定位。
- `SID1577-CASTLEDERMOT-CESS-LETTER`：1577年7月26日锡德尼在卡斯尔德莫特致沃特豪斯信件讨论cess改为现款，现代参考点52.908889,-6.842222（GeoNames）；NLI为**馆藏目录层证据**，未核原稿，不引用想象中的信件措辞。

**原有事件补充**：`1570S-E023` 增入锡德尼传记所见驻洛赫雷50骑／100步兵的具体当次编制，不把它假定为1576—1579每年的恒定驻军人数。

### 仅新增一条有据“线”

`snakee01-sidney-1576-galway-athenry-athlone-circuit`：戈尔韦→阿森赖→阿斯隆，1576年有效，`route_kind:'documented-endpoints-connection'`，`certainty:'schematic-only-not-historical-track'`。只显示传记记载的城市巡行次序，**不是史料实测道路**。

### “面”审查结论

- 31：2月山岭、未成伏击、Rio Francisco登陆、4月银队遭袭均缺可信战场边界；不画半径椭圆、现代驿道包络或英国占领巴拿马区域。
- 32：阿森赖征款范围及Pale各地产的cess法律适用地块均缺审定的1570年代行政边界；不把现代戈尔韦、米斯、劳斯、基尔代尔等行政面染成16世纪统一征赋区。洛赫雷驻城不等于整个康诺特归英国军事控制。
- 无界限证据时以事件点、可信地名连线和已有层为主。本文**不增加任何Polygon**。

## 三、对应读者专题

- `data/stories/drake-panama-mule-train-raid-1572-1573.json`：增至12节；按1572袭港→1573年2月山岭/失败伏击/驿站战斗→3月31登陆→4月1日成功夺银→撤离英国的顺序叙事。
- `data/stories/sidney-pale-cess-connacht-military-campaign-1575-1578.json`：11节，补入1576军政巡行、阿森赖重建征款、苏克河行动和1577年7月信件；分清军事驻堡、法理征赋和局部地方反抗。
- `data/stories/index.json`：增8个已记录地图事件ID的关联，未改其他专题索引。

公开文章语言只陈述历史事件；史料版本、历史地址、GIS限制和证据深度仍由本交接文件及后台原始字段保留。

## 四、核实的来源（可直接复核）

1. Philip Nichols编《Sir Francis Drake Revived》，早期远征参与者叙事的后期刊本转录。2月11日两洋山岭、2月Venta Cruz未成伏击及袭驿、3月31日Rio Francisco登陆、4月1日运银队遇袭与法方首领受伤：
   https://www.gutenberg.org/files/2854/2854-h/2854-h.htm
2. 美国国会图书馆Hans P. Kraus馆藏德雷克1572—1573年简史及历史利润估计：
   https://www.loc.gov/collections/sir-francis-drake/articles-and-essays/drake-biography/drakes-first-success/
3. 《英国国家人物传记辞典》亨利·锡德尼传，载1576年Galway—Athenry—Athlone行程、驻Loughrea部队、Moy与Suck的军事行动。属于后世编辑的传记史料，需持续与原始Carew文件对照：
   https://en.wikisource.org/wiki/Dictionary_of_National_Biography,_1885-1900/Sidney,_Henry_(1529-1586)
4. 皇家爱尔兰学院《亨利·锡德尼传》，解释1575年9月8日重返、cess与composition之区别，以及1578年召回：
   https://www.dib.ie/biography/sidney-sir-henry-a8069
5. 爱尔兰国家图书馆：MS 15,434，1577年7月26日Castledermot之信，**仅已核目录标题**：
   https://catalogue.nli.ie/Record/MS_UR_089508
6. Getty TGN Athenry地名及现代城镇坐标：
   https://www.getty.edu/vow/TGNFullDisplay?english=Y&subjectid=1042584
7. GeoNames Galway、Athlone、Castledermot现代坐标：
   https://www.geonames.org/2964180/galway.html
   https://www.geonames.org/advanced-search.html?continentCode=&country=&featureClass=&fuzzy=0.6&q=atlone
   https://www.geonames.org/search.html?country=IE&q=Kildare

## 五、验证与主编待办

已通过直接读取本分支GitHub文件的结构检查：总专题21（PR120上游基线21）、1570年代事件76、来源90、线路27；10年逐年累计事件及路线与更新后的测试数组完全一致。两篇正文的所有 `[[事件ID|文字]]` 均指向真实Atlas事件，`sources`与`source_keys`均有效，正式索引关联无遗漏；新事件引用的Atlas来源ID均存在。

同步修订 `scripts/test_chapter9_published.js`、`scripts/test_chapter10_published.js`、`scripts/test_drake_chile_1578.js`、`scripts/test_drake_sidney_frobisher_major_stories.js` 的增量计数；后者增加8个事件及新线路的禁虚构约束。

**尚未完成/不可声称**：本对话无法直接运行完整仓库的Node、Python及Chromium桌面测试，也未获得新分支最新GitHub Actions通过结果；没有修改 `main`，没有完成Pages部署。蛇E审查时应在合入上游PR#120后运行原有专项、地理、年份闸门与真实浏览器CI，并最后单独确认Pages SUCCESS。

操作建议：先将本补丁对PR#120的源分支合入；源分支再按主编既定合并程序进入main。两个并行专题分支如果同时改 `data/atlas-1570-1579.json`，应以事件ID增量合并而不是用一份旧完整JSON覆盖较新的正式数据。
