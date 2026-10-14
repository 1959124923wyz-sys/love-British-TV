# 爱英TV 第十章1580—1589｜主编直接导入包
研究分支 `research/ch10-1580-1589-violence-enslavement-plunder-20261014`，PR #59。更新于2026-10-14。

**当前研究交付可直接读取 JSON / GeoJSON；仍需主编审核后发布。** 严禁自动合并本研究文件覆盖已上线页面。main在本次读档时仅发布至1569年；PR #56是独立第九章研究包，主编应先审核并把已发布第九章的正式状态与本包1580交接作比对。

## 一、导入入口一览（已在GitHub真实提交）
| 模块 | 文件 | 内容及接入用途 |
|---|---|---|
| Atlas候选 | [ATLAS_EVENT_REVIEW_CANDIDATE.json](ATLAS_EVENT_REVIEW_CANDIDATE.json) | 与`data/atlas-1560-1569.json` / PR#56模式兼容的 `events, places, sources, routes, colonial_polygons, presentation`。**28事件、16地点、68来源**。字段包含 `year,start_year,end_year,visible_from,date_label,name,icon_code,lat,lng,source_ids,description,significance`。 |
| 事件地理变化 | [VIOLENCE_AND_CONTROL_DELTA_1580_1589.geojson](VIOLENCE_AND_CONTROL_DELTA_1580_1589.geojson) | 28条年份变化；有可考现代地点的16条Point，12条地理尚不明确的 `geometry:null`。单次抢劫、镇压及战地不自动触发英王实占面积。 |
| 现代地理点 | [CONTROL_AND_VIOLENCE_PLACES_1580_1589.geojson](CONTROL_AND_VIOLENCE_PLACES_1580_1589.geojson) | 16处正式史迹或现代城市、历史州标牌坐标，每处 `source_geography_url`、事件关联与 `geo_precision`。 |
| 经济账本 | [PLUNDER_VIOLENCE_ECONOMICS_LEDGER.json](PLUNDER_VIOLENCE_ECONOMICS_LEDGER.json) | **18类**真实史料引述及待核数据：1580 Carrigafoyle守军50+16非死者总数、Smerwick约600、1582饥荒死亡3万上限、1586 25k/110k杜卡特城镇赎金报告、1586船载人员证词不能加总。 |
| 示意方向 | [VIOLENT_EXTRACTION_ROUTE_REFERENCES_1580_1589.geojson](VIOLENT_EXTRACTION_ROUTE_REFERENCES_1580_1589.geojson) | 6条已知航次／军行动港顺序，以**虚线**展示。中间历史GPS未知，不计英军控制区或真实船迹。不得用线所穿过海岸推断奴隶贩运装卸站。 |
| 可展开史料 | [HISTORICAL_DETAIL_NOTES_1580_1589.json](HISTORICAL_DETAIL_NOTES_1580_1589.json) | 28个与Atlas事件ID一致的 `records`，每条有`context,impact,geography,accounting,source_ids,source_links`，可选复制至 `data/historical-detail-notes.json`相应records。 |
| 逐年控制 | [../CONTROL_TRANSITION_1579_1589.json](../CONTROL_TRANSITION_1579_1589.json) | **10个年末控制快照、10条土地/驻军变化**。尤其1576—79洛赫雷英军驻堡在1580年结束；罗阿诺克1585/1586/1587为不同驻留阶段，1588/89是否有人存活未知。 |
| 旧图及待核 | [../PRIMARY_MAP_SOURCE_CATALOG.json](../PRIMARY_MAP_SOURCE_CATALOG.json) | 1586 TNA `MPF 1/273` 芒斯特规划图、1589 TCD `MS 1209 (36)` Jobson殖民庄园图、1588–89 Boazio加勒比军事图；原始高精度图下载/版权、地理配准尚未完成，候审16世纪Polygon=0。 |
| 原档任务 | [../ARCHIVAL_ACTION_QUEUE.json](../ARCHIVAL_ACTION_QUEUE.json) | 18条具体史料追查任务，优先殖民授地实占界和1586舰队人口交易去向。 |

## 二、主要时期年份视觉应表现什么
- **1580**：英军自Rathkeale攻入凯里、Carrigafoyle炮轰攻破及残存守军被杀、Dún an Óir投降大屠杀、爱尔兰伯克军在Loughrea收复驻堡，持续战争/反抗和人口破坏表现为点与行动区域文字；没有实测的英王整块Munster郡实控面。
- **1581–83**：持续焚粮征粮与饥荒、1582圣莱杰死亡报告，1583Desmond战争军事结局。报告3万人属于学术论文引用的**六个月上限估计**，不作为真实逐村人口流失面积。
- **1584–89**：掠地和殖民授予的年序：1586规划与授地、1589实测庄园。目标是从DRI/TCD测量地图配准还原**法律地块**；既不能把现代县界直接染为英国占领，也不能把1567 Goghe地图 TNA MPF 1/68 冒用为1589 Jobson。
- **1585–87**：Roanoke小驻地、Aquascogoc村庄焚毁、Wingina首领遭杀、Croatoan社群误袭。北卡州史料明确Aquascogoc在**1585年7月18日**于今Belhaven附近遭焚；地图可用州历史标牌现代坐标，历史村址则只是附近。
- **1585–86加勒比**：Cape Verde Santiago→Santo Domingo→Cartagena→St Augustine，现代港镇点与虚线表示航次顺序，赎金/城市破坏进入独立经济面板。1586被强制携带的非洲人、摩尔人、原住民证词数字相互重叠，市场出售数量未知，不能描成已证“加勒比→罗阿诺克奴隶船销售路线”。
- **1587**：Cádiz英军袭船，Cabo San Lucas的Santa Ana被英军劫夺；精确捕获海域点不明，现代海角只作为地名锚点。
- **1589**：A Coruña、Vigo英军袭城和纵火，西班牙地方军民反抗。维戈**1650s才开始修建后来的城墙**，绝对不可拿后世市墙当1589城防。

## 三、主编执行顺序
1. 核对main最新 `data/chapters.json`和现有正式九章状况，**以实际main代码为准**。如九章还未发布，勿把第十章叠在1569年直接启用。
2. 先将本包source ID按唯一`C10-S..`合并Atlas第十章数据，再读`ATLAS_EVENT_REVIEW_CANDIDATE.json`事件。逐项review `category` 映射主站16种正式图标；禁止另建未批准图例。
3. 使用16地点地理参照。Atlas 12项 `lat/lng:null` 仍可呈现左栏史事，但不能编造坐标强行标图；如编辑另取得可信地点，先更新真实 `geo_precision`及来源。
4. 控制区从第九章年末状态继承；事件的战斗、掠夺、殖民法定授地不能自动制造英国实控Polygon。1580年末删除Loughrea英国驻堡色，1585/1587 Roanoke点和芒斯特法律分配阶段按同章台账独立处理。
5. 将`HISTORICAL_DETAIL_NOTES_1580_1589.json`的records合入主站历史文献折叠内容；左栏文案使用Atlas简短叙述，来源方法与金额口径仅放二层。
6. 虚线地图路线文件只属于**不确定航迹和进攻顺序**，折线连接现代地名锚点，不是史实导航GPS，不代表军队通行/占地。
7. 增加时间轴第十章后在关键年**1580、1582、1585、1586、1587、1589**分别检验图层、累计事件、当地政治关系和多事件弹窗；桌面/手机实测通过后再部署。

## 四、禁止错误与重要原档核对
- **Carrigafoyle：**50爱尔兰人与16西班牙人来自战前守军构成，攻破后幸存者遭杀；**不是66人的核定遇害登记**。另有1580 Smerwick约600位死难者，为不同地点，不能因相近战争而合并或重复。
- **1582饥荒：**约30,000在论文中明示为孤证估计上限；不要作为确切人口数据库。
- **1586证词：**150、200、300以及所谓250移往弗吉尼亚均属于不同、重叠的报告与去向构想，绝不合并当奴隶“成交人数”。
- **1586经济：**圣多明各赎金25,000历史杜卡特、卡塔赫纳110,000历史杜卡特为记载毛额（来源口径不同），既非英王当年净收益、也不能自动换算现代英镑。
- **财政类别：**所有利润、账目没有审计证据时记`null`。王室军费、个人掠夺、赎金、被夺牲畜、土地授予、人身强迫迁移和法庭判定分开。
- **1589 Vigo：**西班牙地方公共档案确证4天劫掠与损房、教堂焚毁，但各自统计版本有分歧，不捏造确定遭毁建筑数或死亡数。

本包所有文件均为研究候审。**自动QA只验证结构、时间、ID与错误防护**；真正文学史、原稿可读性和地图发布由主编审定。详细逐档来源在`../SOURCE_REGISTRY.json`，进度在`../PROGRESS.md`。
