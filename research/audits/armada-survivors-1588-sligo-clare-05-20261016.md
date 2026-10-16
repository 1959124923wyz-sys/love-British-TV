# 05｜1588年无敌舰队在爱尔兰海岸遇难：风暴、英王军杀害、当地庇护与没收财物

**研究交付：2026-10-16；爱英TV已出版第十章1580—1589地理补丁候审。**

## 首要史料与数量边界

1. **爱尔兰政府/国家古迹局与西班牙文化部联合发布（2025-12-03）**：[The Letter from Captain Cuéllar – Shipwrecks of the Spanish Armada in Ireland](https://www.gov.ie/en/department-of-housing-local-government-and-heritage/press-releases/new-irishspanish-joint-publication-reveals-the-fascinating-story-of-captain-cu%C3%A9llar-1588-spanish-armada-shipwreck-survivor/)。1588年9月21日Streedagh三舰 La Lavia、La Juliana、Santa Maria de Visón 遭风暴沉没；德·奎利亚尔幸存并遭王室士兵与部分当地居民威胁；在其后多日发生杀害。**约1,100死亡是沉船与随后数日的合计，不是1,100人被英军处决。**国家古迹局公布水下遗址考古数据，佐证确有海难，但海底遗址保护区不等于杀害/占区边界。
2. **爱尔兰皇家学院《乔治·宾厄姆传》**：[Sir George Bingham](https://www.dib.ie/biography/bingham-byngham-sir-george-a0664)：王室军官1588年9—10月监督处决至少700名西班牙沉船幸存者；另因沉船财物、金银问题拘捕并拷打北斯莱戈O'Hart家族成员。**700是康诺特多个地点的史学合计，不能计为Streedagh一处，不能叠加前述1,100。**
3. **皇家学院《理查德·宾厄姆传》**：[Sir Richard Bingham](https://www.dib.ie/biography/bingham-byngham-sir-richard-a0665) 亦称其监督沉船后续杀害。George和Richard系不同英国王室官员。
4. **皇家学院 Brian na Múrtha O’Rourke 记录**：[O'Rourke (Ó Ruairc), Brian Ballach](https://www.dib.ie/biography/orourke-o-ruairc-brian-ballach-a7029)：1588年庇护西班牙幸存者的是**Brian Ballach（卒1562）的儿子Brian na Múrtha**；不能误归于已故父亲。联合出版物另证明Rosclogher/MacClancy castle of Lough Melvin提供避难与抵抗。
5. **克莱尔郡图书馆1979年地区研究**：[The Spanish Armada and the fate of some of its ships off the West Clare coast](https://clarelibraries.ie/localstudies/history/battles-and-fortifications-in-clare/the-spanish-armada/)：西属San Esteban/San Marcos海难者被克莱尔高级治安官Boetius Clancy等地方官员押往Spanish Point附近绞死；地方人有参与杀害记录。清晰区分溺亡、附近民众的攻击及郡治安官奉王室意旨的绞刑。人数、埋葬地点与具体绞刑山有不确定。
6. **克莱尔郡图书馆人物史**：[1588 Boethius McClancy](https://clarelibraries.ie/localstudies/genealogy-and-family-history/notes-on-the-sheriffs-of-county-clare-1570-1700/1588-boethius-mcclancy/)；**郡遗产办公室**：[Cnoc na Crocaire准确位置存疑](https://heritage.clareheritage.org/places/reading-your-local-landscape/scariff-our-local-landscape/a-clare-mystery-brutally-executed-but-where-are-they-buried)。不虚绘精确绞刑墓地。
7. 国家图书馆与早期往来档案：[1588-05-28 理查德·宾厄姆关于斯莱戈城堡继承的信件目录](https://catalogue.nli.ie/Record/MS_UR_010752) ，仅供之后扩展地方殖民统治，不将该五月文书错作九月沉船证据。

## 实际添加

第十章新增5项，原 `GAP1588-SLIGO-ARMADA-EXECUTIONS` 修正为乔治·宾厄姆监督的康诺特多处处决总览：

| 史事 | 性质 | 地图表达 |
|---|---|---|
| 9月21日Streedagh三舰遭风暴毁损 | 气象沉船、非军事杀害 | 海湾现代地点Point，DOC |
| 9月21日后部分Streedagh登岸者被杀 | 王室士兵与部分当地人所为，区别溺亡 | 海滩Point，REP |
| Rosclogher/Lough Melvin避难 | Brian na Múrtha O'Rourke、MacClancy等盖尔领主援助 | 梅尔文湖地区Point，RES |
| Clare Spanish Point沿岸绞刑 | 高级治安官Boetius Clancy等地方当局对幸存者处决 | 地区Point，REP |
| O'Hart家族遭拘捕/酷刑 | 乔治·宾厄姆为夺沉船财物实施殖民强制 | **无具体坐标事件（null）**，另有宽泛北斯莱戈地区研究面 |

第十章事件32→37，来源71→78；所有新增均对应1588年，前1587年事件原封未变。

## 地图图层调整（不新增图层开关）

新增4片不同性质的**半透明红色虚线阅读示意**：
- `ir-armada-1588-streedagh-coastal`：Streedagh沿岸沉船及杀害地点局部示意，海难不能等同谋杀；
- `ir-armada-1588-rosclogher-refuge`：Rosclogher湖区及救援史事，清楚写盖尔领主庇护而不是“英王管治”；
- `ir-armada-1588-clare-spanish-point`：克莱尔郡Spanish Point，不能宣称复原绞刑山精确遗址；
- `ir-armada-1588-north-sligo-ohart`：O'Hart北斯莱戈被拷打财物搜查研究区，不可指认具体受刑设施。

既存 `connacht-armada-survivors-killings-1588-research-region` 原 `source_ids:[]`、`related_event_ids:[]` 是无效来源/孤儿资料，现补入与正式事件一致的Royal Irish Academy和爱尔兰政府来源并标记已挂接。该大区域维持为康诺特沿海**总览**，不能当各海滩均发生屠杀。

**所有Polygon** 均 `historical_boundary_confirmed:false`, `fill_authorized:false`, `territorial_claim:false`, `area_sqkm:null`, `exclude_from_area_aggregation:true`。不因风暴遇难/处决人数推算地理面面积。不修改主图深色格式、图标、黄点已经移除的时间轴与双开关。

## 品质复核

- `scripts/test_armada_survivors_1588.js`：检验风暴DOC≠王室屠杀REP、地方营救RES、Clare绞刑、O'Hart具体地点不可定位、旧大面来源挂接、新增4片地区禁统计面积。
- `scripts/browser_smoke.py`：1549、1569、1588等跨章节不回归，1588展示5条新增历史记录和三处独立地区、截图。
- GitHub Pages发布前与世纪军控地理质量门禁一并执行。
- 第05的Garrystown与1588年的O'Hart旧址均不能因为用户说“具体位置不重要”而填入随意现代同名坐标。

**候审状态**：等待所有GitHub Actions通过、主编合并、Pages发布检查，不把PR生成视为线上可见。