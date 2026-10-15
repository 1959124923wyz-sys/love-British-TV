# 第十一章（1590—1599）调查3｜主编交接报告

**调查状态：研究已进入主编可直接调用阶段，仍需历史审稿和部署验收。**
- 研究分支：`research/ch11-1590-1599-violence-colonial-control-20261015`
- 编辑导入唯一入口：`editor_import/EDITOR_IMPORT_README.md`
- 机器数据：`editor_import/ATLAS_EVENT_REVIEW_CANDIDATE.json` 与联动GeoJSON/经济帐/历史详情
- 当前（2026-10-15）正式主站到第九章1570—1579，第十章待PR#59批准；第十一章必须从真正已发布第十章1590前年末数据衔接。
- GitHub Actions 38666535009 **success**；已校验**51来源、35事件、32账本、9个现代地点、10个有位置事件、25个尚无可靠精确地点事件、10年度、13控制变更、35历史详情、0历史实占Polygon**。
- 仅GitHub独立研究分支，尚无生产 `atlas-1590-1599.json` 合并或主站浏览器测试。

## 建议主编重点展示的战争暴力和经济掠夺
1. **1590年西布雷夫尼焚城杀戮**：英王Richard Bingham率部、爱尔兰当地盟友推进，对Breifne居民和盖尔领主土地采取焚毁、劫掠和驱逐。采用盖尔《四大师编年史》M1590和英文SP63独立原档待比照，**没有总伤亡可靠数字**。
2. **1591年Brian O'Rourke政治处决和1592年失明老年领主O'Conor Roe吊刑**：UCC CELT原编年明确年份、名字、英王主管；详细案由与判决卷尚未取得。受害人分别1，不能自创屠杀总数。
3. **1591年12月25日卡文迪什袭占桑托斯**、1592年初洗劫并烧毁圣维森特：巴西国家图书馆查核16世纪航海者Knivet、John Jane及Cavendish通信，保留原时代圣诞礼拜时遇袭这一具体背景。
4. **1592年英私掠军截获载有被奴役非洲人的葡萄牙船**：一艘运送奴役人口从Pernambuco到Buenos Aires的葡萄牙船被Cavendish远征相关英船截获。学术源Borucki, *LARR*（2017）证实此事，原文直接说**人的去向不详**。无人数、船名、截船坐标或英国二次出售获利记录，全部留空。这是**强制掳获奴役人口事件**，但不把旧葡萄牙贩奴船货商业收益算成已证明的英国贸易净利。
5. **1592年劫取葡萄牙亚洲商货**：英格兰舰队夺取Madre de Deus商船；高质量货物研究在圣安德鲁斯大学已发现、原库存和王室审计尚未全部获取，必须分清gross seized / distributed cargo / actual royal net。
6. **1595年3月24日起英私掠军兰开斯特在累西腓驻约30日**：掠夺糖、巴西木、棉花、来自亚洲的东印度商船货物；哈克卢特1600年英方原文提到29船为历史报告，不是经逐船重算的数据库。**英国真正从巴西获得的钱**未知，已存货种而利润仍`null`。
7. **1596年加的斯及葡萄牙法鲁被劫掠**：西班牙锡曼卡斯档案的军事仓储损失、英方1596年王室战利品调查已定位，逐项损失和净利需原始文本。
8. **1595 vs 1598 San Juan**：1595德雷克进攻失败，1598坎伯兰英军短期占领后因疫病撤走，不能在1598年末展示英国持有整个波多黎各。NPS有1595 Antonelli工事图及1598 Cecil来信，原件待取。
9. **1594—1599九年战争**：1594英军夺Enniskillen、随后被爱军围困；1595马圭尔夺回恩尼斯基林、Clontibret爱军胜、1598 Yellow Ford英军失败后Portmore英军撤堡、1599 Essex攻爱尔兰Cahir堡并退兵。本地爱军杀死英军属于当地反抗，**不是反向误归为英国屠杀本地人**。英王境外主权和据点实力须分别显示。

## 主编能直接使用的文件
`editor_import/ATLAS_EVENT_REVIEW_CANDIDATE.json`：事件图标、日期、来源和场景；`editor_import/CONTROL_AND_VIOLENCE_PLACES_1590_1599.geojson`：现代地理点；`editor_import/VIOLENCE_AND_CONTROL_DELTA_1590_1599.geojson`：时间变化；`editor_import/PLUNDER_VIOLENCE_ECONOMICS_LEDGER.json`：分口径受害与经济账本；`editor_import/HISTORICAL_DETAIL_NOTES_1590_1599.json`：故事展开栏；`CONTROL_TRANSITION_1589_1599.json`：十个年末状态；`PRIMARY_MAP_SOURCE_CATALOG.json`：9个原时代图与重要官方档案；`ARCHIVAL_ACTION_QUEUE.json`：16个未来待办；`editor_import/EDITOR_QA.json`：实际GitHub验证通过。

## 后续下一优先研究
P0原始Knivet 1592载奴船全文（书稿p33及原文）以追查英国掳带的人数及命运；P0原始Hakluyt 1600 Recife库存与葡方损失记录；P0 1596 Cádiz英国掠夺王室审计和西班牙Simancas库存；P0 1590爱尔兰英军焚村SP63军令和现场残存据点；P0 1598 San Juan 1595原工事图与1598英国占据围界。所有缺失法定地界用空值／虚线，坚决不用现代县界或海岸任意缓冲区。

**研究CSV尚未生成，直接数据交付的是JSON/GeoJSON。** 所有文件均保存于PR独立分支，可由另一名主编从本目录继续，不需要用户写任何程序。
