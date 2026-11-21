# 第5AG批｜五大湖分堡与新南威尔士局部实证图形、556点核查（2026-11-21）

继承第5AE批 [23条旧参考框、5处点转面交接](18C_5AE_REAL_GEOMETRY_AND_POINT_AREA_HANDOFF.md)，第5AF批 [历史测绘来源](18C_5AF_PRIMARY_MAP_EVIDENCE_AND_AREA_RULES.md)。本批从最新版 main 重新审查原始80余条参考、280组现有历史多边形、479个区域地点及5AE额外77个点，**不伪造新年代的地图顶点**。

## 已真正实施的两条地图修改

**1. `GREAT_LAKES_POSTS`（1783—1795）退出跨湖大矩形。**

- 原 `bbox=[-88.5,41.1,-79.1,46.6]` 的描述对象是分散英军驻堡，所画大框没有历史军事实际控制的土地界。
- 同期已有三个独立测绘围堡：`FORT_NIAGARA_MAIN`（尼亚加拉堡）、`DETROIT_FORT_LERNOULT`（底特律勒努尔堡）、`MACKINAC_ISLAND_FORT`（麦基诺岛堡），1783—1795各年均有正式多边形和单独文献。原档案 `periods`、`bbox`、`note` 与 `source_urls` 全部保留，`superseded_by=FORT_NIAGARA_MAIN` 用于标识**已退役的总框**，另两处独立堡墙在 [5AG跨表](../../data/eighteenth-century-editor41-5ag-localized-replacements.json) 中登记。该单值是数据库技术指针，并非宣称尼亚加拉堡代表整个五大湖。
- 1783年《巴黎和约》与英国实际驻军到1796年分别存史；美国原有土地权利、各原住民族政治自主与英国驻堡不合并成“英国占领全湖区”。
- 还有Fort Miamis（1794起）、Fort Ontario/Oswego和Oswegatchie等驻堡未取得可核的同期独立墙线，逐个继续调查。来源：[纽约州公园管理局旧尼亚加拉堡](https://parks.ny.gov/visit/historic-sites/old-fort-niagara-state-historic-site)、[底特律历史学会勒努尔堡](https://www.detroithistorical.org/learn/online-research/encyclopedia-of-detroit/fort-lernoult)、[麦基诺州历史公园](https://www.mackinacparks.com/explore/history/fort-mackinac-history/)、[美国国家公园署Fort Miamis](https://www.nps.gov/articles/000/historical-overview-of-fallen-timbers-battlefield-and-fort-miamis.htm)、[美国国家公园署边地驻堡史料](https://www.govinfo.gov/content/pkg/GOVPUB-I29-PURL-gpo124132/pdf/GOVPUB-I29-PURL-gpo124132.pdf)。

**2. `NSW_CROWN_CLAIM`（1788—1799）退出覆盖澳洲东部的大矩形。**

- 原 `bbox=[135,-39,153.9,-16]` 是英国王室名义声索的现代表框，不能作为同期对原住民族土地的实际占领界。
- 以 `WARRANE_SYDNEY_COVE` 保留1788—1799具名驻点；1788年有 `SYDNEY_MARINE_CAMP_1788`、`SYDNEY_CONVICT_CAMPS_1788`、`SYDNEY_GOVERNOR_GARDEN_1788` 三组当年营地围线；1790—1799有 `PARRAMATTA_CONVICT_HUT_ROWS`；1792—1799有 `PARRAMATTA_GOVERNMENT_FARM_1792`；1794年另有霍克斯伯里39、50、68号授地三片，仅展示有文书证据的原图年代。
- `superseded_by=WARRANE_SYDNEY_COVE` 是退役原总框的记录指针。1789年及其他没有配准小片的时期继续保留具名点位和原书档，绝不填入推测农地。诺福克本岛的自然岛岸不以整岛人口定居或英国真正治理面积计算。
- 核验来源：[SLNSW 1788年布拉德利营地图](https://collection.sl.nsw.gov.au/digital/rxrGjbJ3ZNR08)、[1792年帕拉马塔镇图与考古研究](https://www.cambridge.org/core/journals/antiquaries-journal/article/commemoration-and-improvement-parramatta-st-johns-cemetery-new-south-wales-in-its-context-1788c-1840/0620D3DABFF886C60D0A976898CF3292)、[NSW Land Grants官方档案](https://mhnsw.au/guides/land-grants-guide-1788-1856/)、[SLNSW殖民测绘与土地利用](https://www.sl.nsw.gov.au/stories/charting-land)。

**地理覆盖的边界：**本批只证明“相应历史营地、堡墙或地籍小片可以显示”，不声称完成两组原始历史专题的全部地理范围。原法律纸面声索仍可从数据、档案阅读，浏览层不继续涂无证面积。所有几何面积数值继续为 `null`，不累计历史领土 km²。

## 数量与来源交接

| 核对项 | 上批 | 本批 |
| --- | ---: | ---: |
| 1700—1799仍显示的无历史轮廓大矩形 | 3 | **1** |
| 1799年可见无历史轮廓大矩形 | 1 | **0** |
| 1497—1799全段旧矩形（1600—1699仍沿用旧盘点26） | 29 | **27** |
| 5AE原有77地点/9候选/5已完成 | 77/9/5 | **保持不变** |
| 大尺寸Atlas新审 | — | **479地点、165近邻候选** |
| 全部两清单不重复地点记录 | 77 | **556** |
| 自动将近邻当历史区域 | 0 | **0** |

**补充严格区分**：479历史点对应165个“与现存小面相距不到1公里且有部分年份交集”的待审候选，是空间与年代的线索，不能直接作为“点变面”的结论。例：圣玛丽教堂不能由整个圣乔治堡替代；1763年的皮特堡不能套1764年布凯碉楼；马尼拉城堡破口不能以马尼拉全城面当成破口轮廓。165个逐条ID、经纬度、近邻、年代和原始来源在 [完整候选JSON](18C_5AG_479_MASS_POINT_AREA_CANDIDATES.json)。另一份77点清单仍在 [5AE候选](18C_5AE_POINT_AREA_CANDIDATES.json)。

**发现并修复的台账陷阱**：`scripts/research_editor39_5ae_point_to_area_candidates.py` 以前运行会把 `confirmed_upgrades` 清零。本批改成从已发布五处 `point-area-promotions.json` 正式跨表读取，并为9个候选赋值 `promoted_existing_surveyed_polygon` 或 `requires_further_historical_scope_review`。5AE历史批次23条退休纪录仍冻结，5AG新增2条独立记录，不改写历史批次成果。

## 仍未完成，按优先级推进

1. **1700—1711卡罗来纳领主殖民地 `CAROLINA_PROPRIETORS`（唯一剩余18世纪旧框）**：必须找到同年代沿海聚落、土地丈量及特许法理两种不同边界。现存1712年起的 `NC_COLONIAL_ADMIN_1712` 不得提前用于1700年；也不能用1665的领主声索线代替移民实际定居。《北卡州档案》地图目录：[原件入口](https://archives.ncdcr.gov/researchers/collections/maps)。
2. **五大湖其余驻堡**：Fort Miamis、Ontario/Oswego、Oswegatchie分堡同期图、考古控制点、美国接防年份。必须把堡墙与周边湖区政治关系分开，所需已列结构化 `additional_historically_attested_posts_needing_individual_footprints`。
3. **1788—1799 NSW连年采地**：正式配准Hunter 1796绿区农场原图以及1799 Grimes–Flinders地形图，逐片地籍按历史具体受领人核日期；已入 [5AF原图档](18C_5AF_PRIMARY_MAP_EVIDENCE_AND_AREA_RULES.md)。
4. **165新增候选逐个辨同一对象与场所包含关系**：堡墙、有壁城镇与独立建筑要分开；战争、条约会议、税制和奴役网络不能以附近堡墙冒充影响范围；保留出错风险列表。
5. **1600—1699的26条历史旧参考**：现总账数字沿用早先第5D批，需制作逐条Id的新库存；不可把古代商站位置变成广域王权统治，也不按数字“好看”强行清零。

## 测试和生成方法

- 两条真实替换以 `scripts/apply_editor41_5ag_replacements.py` 对4 MB主数据**只插入两条 `superseded_by`**，新GitHub Actions流水线负责重复执行可复现；任何原始 `bbox`、`periods`、`source_urls` 和所有280原历史几何无变。
- 5AE历史静态测试仍保证当时23项原退役，5AG独立测试核验新增2项、逐年堡墙与小面、原先5处点转面以及余1。
- Chromium桌面在1783、1788、1789、1790、1794、1795、1796、1799、1705年检查区域显示与点位，不影响前后世纪；强制空间语义审核与Pages发布门槛保持不变。

后续人员应从[主制图台账](PRE_1800_CARTOGRAPHY_HANDOFF_20261119.md)、[1条剩余旧矩形](18C_5AG_OLD_RECTANGLE_INVENTORY.json)、[2处替换跨表](../../data/eighteenth-century-editor41-5ag-localized-replacements.json)和[165点候选](18C_5AG_479_MASS_POINT_AREA_CANDIDATES.json)开始，不必重新搜集已经存在的283组城堡图形。
