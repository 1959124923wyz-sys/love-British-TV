# Editor18｜17世纪五地殖民征服、土地没收与据点易手：四项历史长篇与地图研究交接

调查日期：2026年10月26日。研究范围限定1600—1699年；英格兰、苏格兰、爱尔兰、加纳Oguaa（Cape Coast）、摩洛哥丹吉尔、苏里南及哥伦比亚Providencia的历史身份不得使用当代政治国界倒替。

## 一、研究成果与一览

这次研究填补5个17世纪重大殖民空白，其中**四篇重大专题**（阿尔斯特、苏里南、普罗维登斯岛、非洲海岸角—丹吉尔对比）合计 **42章**、36项各篇来源条目（其中乌尔斯特7、苏里南7、普罗维登斯岛9、非洲两据点13；不同篇来源可能重合，非36个不同的原始档案），年度Atlas新增 **11条经来源与现代地名核实的参考事件**。不修改已发表的E6-T13皇家非洲公司、E6-T02爱尔兰征服等原篇核心叙事，亦不建立任何无测绘数据的历史“英国实控”Polygon。

| 专题ID | 有据时段 | 文章 | 主要实证史料 | GIS原则 |
|---|---|---|---|---|
| E6-T01 | 1603—1641 | `data/stories/serial/e6-t01-ulster-plantation-1603-1641.json` | Oxford University Press Nicholas Canny; Cambridge《Irish Historical Studies》David Heffernan（2025）；Fermanagh地方博物馆1609年Bodley原图编目；爱尔兰城市考古档案 | 1609六郡殖民政策与1610五郡英格兰承领人统计不相加；现代德里点非六郡没产疆域 |
| E6-T16-SURINAME | 1650—1667 | `data/stories/serial/e6-t16-suriname-1650-1667.json` | 荷兰国家档案馆约1650英殖民、约50个糖园发展期、1667泽兰舰队夺取；2024学术迁入研究 | Fort Willoughby/Zeelandia现址为地区参考；约50不是1650年精确种植园数量 |
| E6-T16-PROVIDENCE | 1630—1641 | `data/stories/serial/e6-t16-providence-island-1630-1641.json` | Karen Ordahl Kupperman Cambridge 1993重要专著；USC考古大学项目；企业认股史 £3,800最初承诺 | 今哥伦比亚Providencia非美国罗德岛Providence；岛中心非1630工事坐标 |
| E6-T17-AFRICAN-FORTS | 1653—1684 | `data/stories/serial/e6-t17-cape-coast-tangier-1653-1684.json` | 加纳地方政府、Andrew Apter《American Historical Review》2017、National Army Museum、Folger、Cambridge及2026年Hannah Kaemmer筑防研究 | 英方1664/1665海岸角夺堡年份矛盾明确显示；1662—1684丹吉尔驻点实际情况与整个摩洛哥疆域分开 |

## 二、阿尔斯特：什么土地、谁被授予、为什么存在界线不确定

重要来源：
- [Oxford University Press, Nicholas Canny, Plantation in Ireland 1603–1622: Theory and Practice](https://academic.oup.com/book/9765/chapter-abstract/156955500)：1608—1609没收土地的汇总与有色地籍图，为不同类型承领者划区。
- [Cambridge/Irish Historical Studies, Heffernan, Selection of English Undertakers in the Ulster Plantation 1609–10](https://www.cambridge.org/core/journals/irish-historical-studies/article/abs/selection-of-the-english-undertakers-in-the-ulster-plantation-160910/DCB0FE0EE57B05FE51AE1D023FE6C836)：**超过五十名英格兰承领者**于1610年获得Armagh、Cavan、Donegal、Fermanagh和Tyrone **五郡**若干庄园，来自**超过百名申请者**。这一人数不是六郡殖民地主总数、并非新移民户籍、也不代表全员立即抵达庄园。
- [Fermanagh & Omagh Collection 1609 Bodley Barony Map](https://collectionsonline.fermanaghomagh.com/object-fcm-1979-066)：真实古图，官方编目指出传统阿尔斯特地域土地度量各地不同，原王室勘察不能视作现代公里面积。英国国家档案馆亦有1609地图图像及馆藏。
- [爱尔兰德里考古报告](https://excavations.ie/report/1999/Derry/0004013/)：1613年城市壕沟/城墙规划，1614—1619年建筑，有真实考古GPS。没有合法旧地块逐一配准，不能沿现代六郡边界涂实色或计算受害者土地总面积。

原已发表地图 `1600S-E003, 1600S-E010, 1600S-E017, 1610S-E022, 1640S-E003`复用，新增`1610S-E093` 1610授地、`1610S-E094` 1613城防，均用德里现代**行政参考点**（从爱尔兰考古报告取得两处不同有据位置）；1610的授地远非发生在这一个坐标。

## 三、1650—1667苏里南：短命英属糖园和荷兰征服

[荷兰国家档案馆殖民史与种植园地图介绍](https://www.nationaalarchief.nl/beleven/onderwijs/bronnenbox/plantagekaart-suriname-1737)证实1650左右英殖民开始沿苏里南河建设蔗糖庄园，早期形成**约五十处**糖业种植园，大量使用被奴役的西非人。2024[专业历史论文](https://www.tandfonline.com/doi/full/10.1080/14788810.2024.2393037)将初始巴巴多斯移民年份置于1650—1651并追踪Willoughby1657年殖民权利许可，说明一个权利许可不能被误当成最早定居。

**约五十**为阶段性概括，不是1650年单年统计，不推算所有糖园面积、遇难人口、总获利。1667年荷兰泽兰舰队夺取殖民地；[荷兰国家档案馆苏里南公司编目](https://www.nationaalarchief.nl/onderzoeken/zoekhulpen/societeit-van-suriname-1683-1795)记《布雷达和约》确认苏里南保留在荷兰。原居民Lokono、Kari’na及其他社群的土地权力仍不能直接视为欧洲国家间交换的财产。Atlas 新`1650S-E121`与`1660S-E125`。现代Fort Zeelandia GPS`5.825194,-55.14975`为遗址位置，**非全部英属种植园实控面**。更晚1737殖民地地图不能当1650年的精准历史测绘。

## 四、普罗维登斯岛：公司承诺资本与实际奴役暴力

[剑桥大学出版社Karen Ordahl Kupperman《Providence Island, 1630–1641》](https://www.cambridge.org/core/books/providence-island-16301641/2D80A7915966CD48D2401A45EB2C0EDD)及同书[公司财务史第10章](https://www.cambridge.org/core/books/abs/providence-island-16301641/business-history-of-the-providence-island-company/A3F07B32FA8AE78B156BE1A407536543)提供**20位冒险投资人最初承诺£3,800**、一份股权初期£200、1632年6月£520、1633年5月£1,025。**最初承诺不是开办即到账现金；连续股票份额面额不能相加成一人一股全部同时缴额**。该殖民企业在今哥伦比亚Providencia岛于1630年设点，另见[南加州大学考古研究](https://dornsife.usc.edu/arclab/archaeology-projects/in-the-field/providence-island-colombia/)；以被奴役非洲人及部分原住民与皮阔特人强制人口流动支持农事/防务、又经营对西班牙商船的私掠活动，1641年西班牙军队夺岛，英方殖民终结。

1633年公司准许自荷兰商贩买被奴役非洲人是**法律/管理指令**，不是已核购买人数。1634年Warwick伯爵写被奴役者Sander孩子被卖的信是**百慕大**劳动制度的实例，不能移作普罗维登斯岛事件。现代岛屿中心GPS `13.348889,-81.374722`的来源为地理参考网页，**不可当作1610年代驻军港口、海上航迹、奴隶市场或城墙测量坐标**。新增Atlas `1630S-E023, 1630S-E024, 1640S-E094`。

## 五、西非海岸角：1664／1665不能假定某一个精确日

加纳[地区政府](https://crcc.gov.gh/cape-coast-castle/)与[Slavery and Remembrance](https://slaveryandremembrance.org/articles/article/?id=A0103)均记海岸角堡原为瑞典1653年Carlousborg，后来有丹麦、荷兰、当地Fetu权力与英格兰交替控制。2017年《[American Historical Review Andrew Apter](https://history.ucla.edu/wp-content/uploads/2023/09/Apter_Dungeon_ahr_1.pdf)》**第40页**（本轮已以PDF截图核对）明记英方于**1665年**取得，部分历史机构记**1664年**，因此Atlas `1660S-E124`取1665作为年份定位，但标题写1664—1665争议，保留`source_disagreement`语义。原堡垒是据点，不代表整个今加纳地区或Fetu的实控土地。现代实物堡址GPS `5.103917,-1.241083`来自遗产图录。1663皇家冒险家贸易公司与1672重新组织皇家非洲公司分别记述，**1665夺堡时不应声称已经是1672年之后的RAC机构治理**。

## 六、丹吉尔：从葡萄牙婚约到1684年撤离

[英国国家陆军博物馆](https://www.nam.ac.uk/explore/kings-own-royal-regiment-lancaster)证实1661年查理二世与葡萄牙王室婚约给予丹吉尔及孟买，1662英军进驻丹吉尔；[剑桥同行评审文章](https://www.repository.cam.ac.uk/items/66c8425c-42b4-4d08-aa07-ccb7499c5150)与[Folger图书馆](https://www.folger.edu/blogs/collation/north-africa-england/)揭示摩洛哥长期抵抗，以及王室兴筑防御港堤与自由港的商业军事设想。2026年[Hannah Kaemmer, Journal of the Society of Architectural Historians](https://online.ucpress.edu/jsah/article-abstract/85/2/190/218131/Administering-Architecture-Administering-Empire?redirectedFrom=fulltext)解释英政府最初缺乏中央筑防管理，后来军械局主导筑城（这项制度组织成果不等于帝国获利）。

1680年摩洛哥军队围城，英政府增援。**1684年英军实际撤离并损毁部分港防，摩洛哥恢复控制**。当地摩洛哥军队反抗不因葡萄牙王室的外交转让而失去政治合法性。Atlas `1660S-E123`、`1680S-E124`、`1680S-E125`均为现代丹吉尔城区地名参考点，Getty `35.7806,-5.8136`，不描摹历史占领线和舰船GPS。

## 七、可恢复资产与继续调查

- 4篇文章：`data/stories/serial/e6-t01-ulster-plantation-1603-1641.json`、`data/stories/serial/e6-t16-suriname-1650-1667.json`、`data/stories/serial/e6-t16-providence-island-1630-1641.json`、`data/stories/serial/e6-t17-cape-coast-tangier-1653-1684.json`。
- 证据账：`data/research/editor18-seventeenth-century-ulster-suriname-providence-african-forts-evidence-20261026.json`。
- 全局专题索引：`data/stories/serial/index.json`；17世纪地图文件 `data/atlas-1610-1619.json`、`data/atlas-1630-1639.json`、`data/atlas-1640-1649.json`、`data/atlas-1650-1659.json`、`data/atlas-1660-1669.json`、`data/atlas-1680-1689.json`。新增11项来源关联事件。
- 自动检查：`scripts/test_editor18_overlooked_17c_conquests.js`，`scripts/browser_editor18_overlooked_conquests.py`，`.github/workflows/editor18-overlooked-17c-colonial-events.yml`；原16世纪/17世纪所有旧专题回归必须通过。
- 最值得接下来的重型考古GIS任务：阿尔斯特1609每男爵领地古图配准与受封契据交叉；苏里南1650—1667糖园旧地籍及房主逐地块定位；普罗维登斯岛New Westminster军事遗址与1633公司账；1664—1665Cape Coast夺堡原始航海与Fetu编年；丹吉尔1662—1684港堤修筑、军械局工程账与撤军毁弃图。**当前没有任何一处能够有把握给出全域被征服面积**。

引文说明：开放获取机构史和学术摘要属于可出版的权威二次资料，但未拿到单条原始交易名册时不能称已直接校阅；所有未核具体死亡人数、船货额、土地面积、年度种植园统计和真实守军战线保持空缺。18世纪只在史料目录提及与17世纪相连的后续，不落任何1700年以后的新地图事件。

交接以已合并的GitHub PR／主分支SHA为准，上传分支或ZIP工作流生成候选包不等于正式上线。
