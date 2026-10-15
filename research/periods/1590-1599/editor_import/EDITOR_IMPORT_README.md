# 第十一章（1590—1599）｜主编直接导入地图数据说明

研究分支：`research/ch11-1590-1599-violence-colonial-control-20261015`，**独立研究，未合并主站**。
更新时间：2026-10-15。与第10章PR #59同样的`events, places, sources, routes, colonial_polygons, presentation`数据格式。

## 导入入口
| 组件 | 导入文件 | 用法 |
|---|---|---|
| 第11章事件和资料 | `ATLAS_EVENT_REVIEW_CANDIDATE.json` | 编辑审核并转换为`data/atlas-1590-1599.json`，含逐年事件、图标、详细说明、来源ID及坐标；**不是已经发布**。 |
| 年份地理事件 | `VIOLENCE_AND_CONTROL_DELTA_1590_1599.geojson` | 用`year`展示增量点／未定位事件，无可审历史占领多边形。 |
| 地点锚点 | `CONTROL_AND_VIOLENCE_PLACES_1590_1599.geojson` | NPS、UNT、Irish state archaeology、主站第9章等现代遗产及城市坐标。不是1590年代具体城墙／屠杀范围。 |
| 经济／奴役／损失 | `PLUNDER_VIOLENCE_ECONOMICS_LEDGER.json` | 对应事件ID，区分葡萄牙亚洲商船被掠、巴西糖/木材被掠、人员被挟、爱尔兰死伤（英军/爱军分别归责）、财产、英国净收益`null`。 |
| 历史展开栏 | `HISTORICAL_DETAIL_NOTES_1590_1599.json` | 逐事件ID直接供二级“历史文献与详细考证”引用，有时空、损失、史料链接及限制。 |
| 线路图 | `VIOLENT_EXTRACTION_ROUTE_REFERENCES_1590_1599.geojson` | 当前无可认证航海线路，`features:[]`；不得因为英军先后抵达多港而虚构真实航线。 |
| 建包验证 | `EDITOR_QA.json` / 上级`build_editor_import.py` | 纯Python可重新生成Atlas/GeoJSON/笔记和QA，GitHub Actions独立分支校验并留档。 |
| 逐年控制状态 | `../CONTROL_TRANSITION_1589_1599.json` | 十个1590—1599年末状态、13项夺堡或撤军变化；与第10章1599衔接前须确认PR59是否已发布。 |
| 原时期绘图档案 | `../PRIMARY_MAP_SOURCE_CATALOG.json` | 9套1595 San Juan Antonelli fort旧图／1598英国来信／1596 Cádiz攻城图与战利品报告／1592货物清单／爱尔兰测量线索。 |
| 原始档追查 | `../ARCHIVAL_ACTION_QUEUE.json` | 16个未完成文献原件/数据请求，严格状态 pending。 |
| 原始源链接 | `../SOURCE_REGISTRY.json` | 含官方爱尔兰编年史、美国国家公园、巴西国家图书馆、剑桥奴役研究、英西档案经济研究；区分原件读过与目录记录。 |

## 主编事件优先级与准确归责
- **1590 爱尔兰英军焦土**：Bingham王室军进入Breifne沿途烧毁、杀戮与掠夺，逼迫Brian O'Rourke流亡。具体受害村和总死亡仍未复原，不以今Leitrim县界涂成全部英国统治。
- **1591—92 英格兰司法镇压**：1591 Brian O'Rourke在伦敦被绞杀斩首分尸，1592罗斯康芒年迈失明O'Conor Roe被处死。需在历史主权条目中维持苏格兰独立（1591尚无英苏共主，更非英国统一国家）。
- **1591-12-25 桑托斯Santos**：Cavendish英军趁居民礼拜突袭葡萄牙巴西港镇，短暂驻约两月；**1592年初São Vicente另一次掠焚**分开。日期必须以巴西国家图书馆及当时John Jane/Anthony Knivet材料为准，不能错填1592圣诞。
- **1592 载奴葡船被英军截获**：同行评议Latin American Research Review明确Cavendish远征英格兰私掠人截获**伯南布哥到布宜诺斯艾利斯**葡萄牙航线上载着已遭奴役非洲人的货船。**船上受害人具体数量、最终去向、英国贩卖及英王利润都未知**。这是被奴役者在海上遭暴力截获的证据，**不是新的1592年英国自行赴非洲买奴贩奴航次或销售账册**；`SLV`图标可展示，折线航路不得虚构。
- **1592 葡萄牙Madre de Deus被掠**：大量来自亚洲的商货被英军海盗/privateers劫取，具体分配与王室实得数未审原货物账，国库净收益不得从大众传播的数额推算。
- **1595-03-24 累西腓Recife**：Lancaster英国私掠12舰队夺城，驻约30日，从葡萄牙贸易港夺走亚洲商船货、糖、巴西木、棉花。原编哈克卢特1600年题记主张另掠29艘船只——是有年代的历史主张，**不是已逐船核实29条登记**；当地之后恢复葡萄牙统治，不能涂成1595年末英国殖民地。
- **1595 英军加勒比受挫；1598圣胡安短暂攻占**：这两起年份、结果不同；1595 Drake失败，1598 Cumberland迫西班牙投降后因疫病撤走；当年年底仍属西班牙。现代El Morro扩建至后世，不可复原成古城墙。
- **1596 加的斯Cádiz**：英荷舰队袭城劫掠；Simancas西班牙损失清单与英国委员会战利品调查是后续经济入图原档。不做尚缺审计的王室实际利润。
- **1594—1599爱尔兰九年战争**：有英军夺堡、爱尔兰地方联军抵抗和英军遭歼事件（Clontibret、Yellow Ford、Curlew等），两方都可能造成伤害；**爱尔兰军所杀英军不能列为英国施暴死者**。并区分州的法律主权、局部堡垒、1598实际英军撤走的Portmore、1599 Essex迁移军堡及失败。

## 制图和验收
1. **先核主站已公布的第10章**：本次2026-10-15检查main已发布第九章、**PR#59第10章尚研究候审**，不可在1590年让第10章年份状态凭空断开。旧爱尔兰地区不是连续固定英属省的GIS Polygon。
2. 从本目录的Atlas数据导入图标、`start_year,end_year,visible_from`、`lat,lng`和`source_ids`，合并历史文献记录；`lat:null`事件可放事件时间轴但不能造地图点。
3. 现代真实城镇地点定位只是**参考点**，不能把现代San Juan、Santos、Recife、Monaghan县界、Irish county boundary或整个海域当年的实际英国占领面。
4. 利用`CONTROL_TRANSITION`按年末转移，**1595 Blackwater英堡遭当地军夺回、1598 Portmore英军撤堡、1590 Roanoke无人、1598 San Juan攻陷但撤离**；尚不确定的旧堡驻军不能猜测常年有效。
5. 科学配准后如取得真实旧城墙/庄园，才可生成带来源、年代、误差、版权的Polygon；未知边界必须用**虚线**。
6. GitHub Actions只表明机器质量审计通过，不能代替历史原稿逐页阅读或主站浏览器渲染验收。真实历史占领Polygon当前=0。需由主编审核后选择合并，不触发自动发布。
