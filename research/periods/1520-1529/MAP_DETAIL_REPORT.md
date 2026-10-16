# 1520—1529年地图细节专项：城堡、桥闸、修道院与边境攻防

研究员1号｜2026-10-12｜本文件为史料地图研究稿，不代表已通过主编审稿。

## 主要地图成果
本批新增并核实地图化路线 **10处点位**（[MAP_SITES_DEEP_GEO.geojson](MAP_SITES_DEEP_GEO.geojson)）；每项用现代遗产保护机构/考古/地名系统的参考坐标，不捏造16世纪军队包围线及领土多边形。

| 历史事件/地点 | 现代参考经纬度（纬、经） | 历史史实 | 空间/证据风险 |
|---|---|---|---|
| 莫纳斯特罗里斯方济各修道院 Monasteroris，爱尔兰 | 53.346353, −7.085437 | 1521年英王代理军围攻当地爱尔兰人据守的修道院；建筑严重受损 | 方济各会官方史迹支持；1550年调查另记录当地**两座城堡**，不能直接把修道院点位当作“英军驻守城堡”的精确位置 |
| 莫纳斯特罗里斯中世纪废村考古点 | 53.345777, −7.087840 | 2010考古位于修道院邻近独立遗址 SMR OF011-009006 | **非**确认的1521战事地点，只作考古环境研究点，默认前端无需同时显示 |
| 塞斯福德 Cessford，苏格兰 | 55.507735, −2.417025 | 1523年5月遭英军围城；HES认为当今遗址部分土工作业可能和围城有关 | HES SM1710，1523年5月19日炮轰具体日只是大学博士PDF检索摘录，待原始通函复核 |
| 费尼赫斯特 Ferniehirst，苏格兰 | 55.454333, −2.551239 | 1523年9月英军攻取和拆毁边境Ker家族堡垒 | HES LB13369；现存建筑有后期改建，不应画当年堡垒壁线 |
| 杰德堡 Jedburgh，苏格兰 | 55.479972, −2.552004 | 1523年9月城区及塔楼遭英军烧毁；萨里当年战报称**修道院遭攻击但未攻下** | 历史英军将领立场需批判；当时攻取修道院说法不能当已确认事实；点坐标为今城中心 |
| 沃克 Wark-on-Tweed，英格兰边境 | 55.641753, −2.281265 | 1523年11月奥尔巴尼统领苏法联军攻英城堡，外墙一度被突破但守军成功拒敌 | Historic England 1013100 + BL Cotton Caligula B VI 1523-11-03信件；仍英王持有而非苏格兰新领土；**不是沃克沃思 Warkworth** |
| 莫尔莱 Morlaix，法国布列塔尼 | 48.577840, −3.827920 | 1522年7月英军劫掠城镇，后撤离 | 官方市政历史报道，具体日有争议；不绘占领地区，不能估当地死伤与战利品 |
| 加来纽纳姆桥 Newenhambridge ≈ 今 Fort Nieulay | 50.946075, 1.816194 | 1521年开始加固旧式水闸桥头防线，到1525—1526构筑较完整堡垒 | Susan Rose专著地图列为同一地点；今尼厄莱堡经17世纪沃邦重建，坐标为现存遗址区域，不能画成1525英军堡墙 |
| 吉讷 Guînes，英属加来边区 | 50.867081, 1.870254 | 1525年王室委员会与1529年排斥法/佛兰德租户的英人定居法律 | 属英国已占边区政策，不代表1529新征服；1513实际边界不能由法国文化部1530—45棱堡反推 |
| 阿德尔 Ardres，法属前沿 | 50.857863, 1.981678 | 与英属Guînes邻近，1520金缕衣会在两地间中立地带 | 法王据点，不能因距离英属要塞很近而涂英方橙色 |

## 这次纠正的三种高风险误读

**1. 战时城堡毁坏不等于多年司法管辖。** 1523年攻塞斯福德、费尼赫斯特、杰德堡与沃克的具体战事，现在已可在地图上各自为点。其中沃克由**苏法联军攻英守军失败**；其余多数为英军进苏格兰袭击。该年双方主权界线并未随战线自动平移。

**2. 不同年代的城防工程不能混合。** 法国文化部吉讷考古报告中显著棱堡主要形成于**1530—1545年**；我们1520年代地图只加1525委员会、1529法令及纽纳姆桥已据证发生的1521—1526防御强化。不因看到后代城墙就提前十几年涂色。

**3. 修道院并非必然是城堡。** 莫纳斯特罗里斯方济各会修道院在1521围城中受损，有可定位遗迹；1550年调查又出现两处各自被称为castle的遗址。两者目前不应强行配对。点位 `IR-1521-MONASTERORIS-FRIARY` 是防御修道院的已知历史位置，`IR-1521-MONASTERORIS-EXCAVATION` 是附近考古参考，其他城堡地点继续为unknown。

## 关键可审核来源
- [英格兰国家遗产署 Historic England：沃克城堡 SM1013100](https://historicengland.org.uk/listing/the-list/list-entry/1013100)
- [大英图书馆 Cotton Caligula B II（萨里战报）](https://searcharchives.bl.uk/catalog/040-001102369)、[萨里原信印本](https://electricscotland.com/hiStory/other/minstrelsy_apdx1.htm)
- [苏格兰环境署 HES 塞斯福德 SM1710](https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,SM1710)、[费尼赫斯特 LB13369](https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,LB13369)
- [爱尔兰方济各会 Monasteroris 原史迹](https://www.franciscans.ie/our-friaries/former-friaries/leinster/monasteroris-co-offaly/)、[2010考古地点](https://excavations.ie/report/2010/Offaly/0021762/)
- [法国文化部吉讷考古报告](https://www.culture.gouv.fr/mc/content/download/337416/pdf_file/SRA_GUINES-WEB.pdf?inLanguage=fre-FR&version=48)、[加来市尼厄莱堡历史](https://www.calaisxxl.com/en/offers/have-to-do/Fort-Nieulay/)、[法国文化遗产编号PA62000181](https://www.plan-du-patrimoine.fr/monument-historique/62/calais/fort-nieulay/PA62000181/)
- Susan Rose, *Calais: An English Town in France, 1347—1558*, preview figures Fort Nieulay at Newenham Bridge. 1525/29兵营详情以Grummitt及Murphy专家论著为准。

上述每个地点均保留source_ids和`precision`、`site_identity_notes`，详细索引 [MAP_DETAIL_SOURCES_1520S.json](MAP_DETAIL_SOURCES_1520S.json) 和更宽泛的 [SOURCE_REGISTRY.json](SOURCE_REGISTRY.json)；**没有已批准的1520年代新增英国领土多边形**。

## 供主编直接调用
主编候审包 `editorial/intake-1520-1529-20261012/editorial/1520-1529/MAP_DETAIL_POINTS.geojson` 已对应十个地点，`ATLAS_REVIEW_CANDIDATE.json` 只把值得读者直接点击的事件加入主地图；邻近村落考古点仅供进一步史料研究，避免相同地点多层图标遮挡。用户批准的同坐标事件聚合和地图视角保持，由维护者在主地图合入后做UI验收。