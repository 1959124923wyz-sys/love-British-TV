# 主编18第十三批｜T26 英国西非奴役贸易：议会立法、沿海堡垒与被迫远渡

**2026-11-10｜基于第十二批PR #303头部之独立历史研究分支 `map/18c-west-africa-enslavement-forts-1750-1795-20261110`，只有 `?review18c=1` 才可预览。不自动发布正式main。**

## 01. 优先英国殖民奴役制度与确证暴力

本批采用用户明确的主线：**英国殖民者与国家如何用船只、堡垒、军队和法律贩运、关押及强制利用非洲人**，谁是具体当事人、英国议会怎样为种植园的人口需求服务、英国船东获得什么制度保障、如何确定英国真实占领的城堡。叙事重点是受害者而非英法国旗轮换，但战争胜负与法律条款有详细可追溯时间线。

*1727年Agaja王对Hueda的入侵与杀戮是达荷美军队所为*，必须同英国购买奴役人口的交易系统、商堡军事设施及英国船只的责任分开。独立王国和欧洲贸易者都需要具体证据，不能将非洲土地涂成英国占领区，也不能虚构每次屠杀与运输的死者数量。

## 02. 原始研究完整继承

主编15 `research/18c/consolidated/series/T26.json` **7组合并、13个原候审ID、20个真实助手B来源注册键**。真实原ID按日期和组号分配至12个原组核实事件，其余9件是新权威材料补证事件（`research_merge_group_id:null`／`research_original_record_ids:[]`），绝不篡改先前的315条入选映射。

| 原合并组 | 原始候审ID、对应年代 |
| --- | --- |
| `E18-MRG-T26-01` | `AB-R6-066-01` 1727，达荷美侵入Hueda（非英军战争） |
| `E18-MRG-T26-02` | `AB-E10-002`与`AB-R7-POL-005` 1750；`AB-F5-GH-005` 1752 |
| `E18-MRG-T26-03` | `AB-E07-001` 1758 英军取得Saint-Louis |
| `E18-MRG-T26-04` | `AB-E07-003` 1763 法国Gorée与英国Senegal河堡垒法律交换 |
| `E18-MRG-T26-05` | `AB-E07-005` 1779 法军实际夺回Saint-Louis |
| `E18-MRG-T26-06` | `AB-E07-007`与`AB-E10-008` 1783 英法和约的Senegal河与Gambia Fort James |
| `E18-MRG-T26-07` | `AB-R7-POL-025` 1788、`AB-R7-POL-027` 1789、`AB-R7-POL-028` 1791、`AB-R7-POL-029` 1792 |

原B名称键：`BS122,BS123,BS125,BS127,BS128,BS129,BS131,BS179,BS224,BS225,BS240,BS243,BS244,BS245,BS246,BS247,BS248,BS47,BS62,BS63`。每个键随旧候审材料的原始URL保留。必须由`scripts/audit_18c_west_africa_source_registry.py`读取原ZIP的`SOURCES_B.json`逐一检验。**原集中研究ZIP、162研究组、315映射、1126去向等文件均未修改。**

## 03. 新GitHub文件、内容与验收

| 文件 | 新增及核验 |
| --- | --- |
| `data/stories/serial/chronology-preview-west-africa-enslavement-1700-1799.json` | **21个具年事件，40登记来源（20原B＋20新权威材料）**；4处只按现代UNESCO岛屿遗产参考点定位；其余17条空GPS；0虚构历史英国殖民地Polygon |
| `data/stories/serial/e18-t26-west-africa-slaving-forts-laws-1727-1795.json` | **19章57段连续中文专题，21处一对一真实`[[E18C-WAF-...|行动]]`正文—地图链接** |
| `data/stories/serial/preview-18c-index.json` | 完整保留前12篇，新增第13篇；正式16/17世纪EIC前篇`E6-T12`可在研究试阅下看到连接 |
| `research/continuity/1727-1795-west-africa/BRITISH_SLAVING_FORTS_AND_LAW_ACTOR_TRANSITIONS.json` | 21条行为主体/财产制度/英法军防/奴役运输规则转换，另3处据点真实占用期和废墟状态；0殖民控制面积 |
| `scripts/test_18c_west_africa_slaving_map.js` | 7真实合并组、13真实候审ID、20旧来源、40总来源、21事件/21唯一地图链接/19章57段/4现代地名点和无虚构国土 |
| `scripts/audit_18c_west_africa_source_registry.py` | 打开主编15完好ZIP检验所有20个原B资料键 |
| `scripts/browser_18c_west_africa_slaving.py` | 1780×1020真实Chrome：1758英军Saint-Louis专题→Gorée历史军事点→Saint-Louis→1779法国毁Fort James→1788运奴法案→1791国会废贩运失败双击档案→返回原1758年；真桌面截图 |
| `.github/workflows/18c-west-africa-slaving-forts-map.yml` | 新T26＋前12篇全部静态GIS/原始ZIP/严空间语义、13篇真Chrome回归、第三方代理实际HTTP载入完整HTML/CSS/JS/历史与长篇JSON的独立门禁 |
| `app.js`、`js/history-stories.js`、`index.html` | 只对`review18c=1`接入第13篇；全部正式main版16/17世纪原状态、已删除浮动章节目录的清爽读者均不回退 |

## 04. 三个核心暴力与制度证据层次

1. **1750年真实国家法规**：Smithsonian NMAAHC藏22页1750《An Act for Extending and Improving the Trade to Africa》原印本，序言明确以殖民种植园购买足量被奴役人口为目标；第III／V条提及`castle slaves`、城堡、军备及canoe men等拟交接的财产和人。**英国国家借法律把被奴役人视作经营资源**。
2. **公司和军队制度**：同一法第IV条明确Company of Merchants本身不得以公司共同资本直接交易，仍可管理堡垒，私人英国贸易商继续强行跨洋贩奴。因此不把新公司称作独家船商。1751年《Gold Coast Records》会议记载RAC与新公司官员交接，1752新法接续堡垒等资产。TNA/T70档与Cambridge 2026研究证实奴役堡垒劳工的实际存在；**任何单堡受迫劳动人数目前空值**。
3. **英国奴隶船仍持续合法经营**：1788 Dolben（28 Geo III c54）限制船舱人口密度，1789（29 Geo III c66）、1790（30 Geo III c33）、1791（31 Geo III c54）、1792（32 Geo III c52）、1793（33 Geo III c73）、1795（35 Geo III c90）继续相关制度。1791 Wilberforce废止动议遭否决、1792的渐进废止辩论未实际停运，直到1807才立法全面禁止英国奴隶贸易。**规制运输不等于解放被拘押者。**

## 05. 真实西非政治与海岸贸易据点地理

- **1758 Saint-Louis与Gorée**：BCEAO西非历史资料明确**Saint-Louis英国实际驻军1758—1779、Gorée英国实际驻军1758—1763**；1779法军Lauzun夺回前者，1763巴黎和约法方恢复后者。
- **1763《巴黎和约》第十条**：欧洲国家承认英国在Senegal河的Saint-Louis、Podor、Galam贸易堡垒及法国Gorée权利，**没有取得周边非洲王国土地同意**。
- **1779 Fort James遭法国毁坏；1783《凡尔赛和约》第十条仍保证英方权利**：UNESCO明确英方旧堡遗址从1779年起主要保持废墟，故1783年`lat:null`，不会展示一座凭欧洲条约自动重建的英国堡垒。
- **1727 Hueda/Ouidah**：Cambridge Robin Law与Neal Polhemus研究确认达荷美Agaja军事征服、Savi沦陷及人口沦为奴役；与英国商人市场需求在经济上的关系需要分别核查，**英国不被标为此次当地军事屠杀直接指挥者**。
- **UNESCO现代地名点，仅用于读者导航**：Saint-Louis **[16.02778,-16.50444]**，Gorée **[14.66722,-17.40083]**，Kunta Kinteh旧Fort James岛 **[13.31764,-16.36135]**。4具年事件（1758 St Louis/Gorée、1779 St Louis/Fort James）对应3个现代岛屿参考点；其他17件无可信古GPS。0新英国殖民地多边形，0虚构奴役船海上路线。

## 06. 可直接打开的原典与权威材料

- [Smithsonian NMAAHC：1750年英国法律原印本](https://nmaahc.si.edu/object/nmaahc_2019.28.2?form=FUNKKCZRWSJ&s_src=H0000PWBUTTON)
- [1750年英国原始法律第II—V、XXVIII—XXIX条全文](https://en.wikisource.org/wiki/An_act_for_extending_and_improving_the_trade_to_Africa_%281750%29)
- [The National Archives UK：皇家非洲公司及T70原档查找指南](https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/british-transatlantic-slave-trade-records/)
- [English Heritage：英国奴役经济、皇家非洲公司和武装堡垒](https://www.english-heritage.org.uk/learn/histories/transatlantic-slavery-abolition/traces-transatlantic-slave-economy/)
- [Cambridge 2026：Company of Merchants堡垒内被奴役者／Fante社群](https://doi.org/10.1017/abd.2025.10025)
- [Cambridge：Robin Law的1727年达荷美征服Hueda分析](https://www.cambridge.org/core/books/abs/ouidah/dahomian-conquest-of-ouidah/56386651A8A853276C32FFDE9920427B)
- [UNESCO Saint-Louis岛遗产地](https://whc.unesco.org/en/list/956/)
- [UNESCO Gorée奴役贸易岛](https://whc.unesco.org/en/list/26/)
- [UNESCO Kunta Kinteh岛／Fort James 1779毁坏](https://whc.unesco.org/en/list/761/)
- [西非国家中央银行BCEAO历史（第1卷）](https://www.bceao.int/sites/default/files/inline-files/Vol.-I_History_of_WAMU.pdf)
- [1763巴黎和约第十条](https://www.uottawa.ca/about-us/official-languages-bilingualism-institute/clmc/linguistic-history/historic-documents/treaty-paris-1763)
- [1783凡尔赛条约IX—XI原文](https://documentsdedroitinternational.fr/ressources/TdP/1783-09-03-TraitedeVersailles%28France%29.pdf)
- [UK Parliament：1788 Dolben法规史](https://www.parliament.uk/about/living-heritage/transformingsociety/tradeindustry/slavetrade/overview/the-first-parliamentary-debates/)
- [各次1788—1795奴隶船规制法案清单](https://pdavis.nl/Legislation.htm)
- [1806议会Hansard回顾1791否决、1792仍未执行废止](https://hansard.parliament.uk/Commons/1806-06-10/debates/3d3925ca-e291-4df9-a30c-7a7b5245ae26/AbolitionOfTheSlaveTrade)

## 07. 网页与后续任务

**第13批独立研究网页（Actions最新SHA全HTTP检查成功后再告知用户）：**

`https://raw.githack.com/1959124923wyz-sys/love-British-TV/map/18c-west-africa-enslavement-forts-1750-1795-20261110/index.html?review18c=1&year=1750`

正式主站：<https://1959124923wyz-sys.github.io/love-British-TV/>，**不包含任何未经正式审核的新18世纪史实**。

下一批T27应集中塞拉利昂Bunce岛与1792黑人定居者、1799土地权争议；随后1800年黑人社群叛乱与公司军事镇压属于十九世纪，需要独立年度，不把1800偷写进1799。继续优先受害者名册、土地契约、公司账簿和原稿，不编造损失数量。
