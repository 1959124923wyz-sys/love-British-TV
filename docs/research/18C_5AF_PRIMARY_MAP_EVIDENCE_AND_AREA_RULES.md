# 第5AF批｜剩余三类旧框与点转面：权威历史测绘取证单（2026-11-21）

前置：5AE [PR #489](https://github.com/1959124923wyz-sys/love-British-TV/pull/489)，5AE 仍剩 `CAROLINA_PROPRIETORS`、`GREAT_LAKES_POSTS`、`NSW_CROWN_CLAIM` 三条法律／地理参考框。此文件是**可复核的史图索引与矢量化工作单**，不宣称已生成三块精确历史疆域。历史源图未配准、未证实际占领时，不把地图点放大成圆形或矩形政治领土。

## 1. 卡罗来纳领主殖民地 `CAROLINA_PROPRIETORS`（地图时期 1700—1711）

**可核资料：**
- [北卡罗来纳州档案馆：历史地图馆藏与地界调查](https://archives.ncdcr.gov/researchers/collections/maps)：州界、郡界、殖民时期与战事史图原件索引。
- [北卡罗来纳州图书馆：1663—1775土地授予指南](https://libraryofnc.libguides.com/nclandrecords1800/1663-1775)：领主时期土地授予要从申请／丈量文书／地籍图（plat）／土地专利状逐项建立；1700年不能把1665年特许状所声索的“东海岸至太平洋”涂为已经占领的省。
- [NCpedia 1663/1665两版特许范围](https://www.ncpedia.org/media/map/original-boundaries)及[特许状释读](https://www.ncpedia.org/reading-guide-carolina-charter)：只供**虚线法律声索边界**比对，具体地图应另分海岸聚落、属地边界与原住民族治理范围。
- [北卡州档案馆：英国殖民部原始档案目录](https://archives.ncdcr.gov/british-records-colonial-office)：地界、殖民行政及土地产权案。

**拟制图层：**优先将原丈量地籍图可配准的实际定居／授地宗地图斑做小面；原特许纬线只能标“名义声索”，应保留虚线、不填大片陆地。不得使用现代南北卡州界充当1700年行政边界。

**发布门槛：**每片面都需年份、原图馆藏号、控制点、配准误差／尺度、所属政治主体、法理与实控区分。无法满足时保留记录和点位。

## 2. 五大湖英军驻堡 `GREAT_LAKES_POSTS`（1783—1795）

**可核资料：**
- [美国国家公园署：Fort Miamis／Fallen Timbers史料](https://www.nps.gov/articles/000/historical-overview-of-fallen-timbers-battlefield-and-fort-miamis.htm)：列示1796年因《杰伊条约》英军从迈阿密斯堡等西北领土驻堡撤离。
- [加拿大公园局：尼亚加拉河对岸Fort George历史](https://parks.canada.ca/lhn-nhs/on/fortgeorge/culture/fort-george)：英军1796年撤出尼亚加拉美岸旧堡后新建加拿大岸Fort George，1802年完成。**不能把1802年成形轮廓追溯到1783年的尼亚加拉旧堡。**
- [加拿大尼亚加拉公园局：旧Fort Erie考古](https://www.niagaraparks.com/foundation/what-we-do/old-fort-erie-archaeology)：1764年原始要塞的考古位置约在今日复建Fort Erie东南150米；现代景点外墙不能替代原堡。
- [美国国会图书馆：1759年Crown Point堡垒测绘图](https://www.loc.gov/item/gm71002321/)：提供同期堡墙制图方法和可配准基准，不自动意味着1783—95该址属英军。
- [美国国家公园署／文化资源国家登记：Fort Niagara](https://npgallery.nps.gov/GetAsset/a177b303-6c93-45ef-9412-2bb19b34ec6d)：用以交叉核对1783—1796英军留驻期及旧堡布局；需要核对文献内原始图的确切年份。

**拟制图层：**先将尼亚加拉、迈阿密斯、底特律等有独立同年代堡址测绘的驻堡分别建立小面，再按年份绘制各堡所属控制者。**一座堡的面不得替代“五大湖英方控制区”。**在1783年条约和1796年实撤军之间保留法理／实控差别。

**发布门槛：**原堡墙图与当前卫星／考古控制点配准；精确到堡址而非水系包围框；每个驻堡独立时段，不混用法国时期或19世纪重建墙体。


### 2026-11-21 新增：布洛克大学1790年原图配准GIS，可优先直接复用

**两张已配准且年份一致的馆藏原图**（不是GIS绘成的英国实控疆域，原图仍需逐堡数字化）：

| 原图与正式编号 | 史图细节 | ArcGIS ImageServer 与GIS元数据 |
|---|---|---|
| 加拿大图书档案馆 NMC **17879**，1790年尼亚加拉河口军事设施图，标称比例尺约1:2,400 | 美岸尼亚加拉堡及建筑、英岸Navy Hall和Rangers' Barracks、Mississauga Point工事方案、800码政府预留带、乔治堡未来预定地点 | [Brock University配准影像原件](https://terra.library.brocku.ca/arcgis/rest/services/EarlyNiagara/NiagaraontheLake1790NMC17879/ImageServer)；地图坐标 EPSG:26917；原始范围 `[655208.7034025617,4789731.817320335,658636.5762775617,4792623.343160335]`（米） |
| 安大略省档案馆 **C295-1-102-0-1**，约1790年尼亚加拉河口城镇及军事保留地规划图；研究目录 *Mapping Upper Canada* 编号1668 | 军堡、海军厅、河口、政府保留地／殖民聚落分界，含计划中的乔治堡位置 | [Brock University配准影像原件](https://terra.library.brocku.ca/arcgis/rest/services/EarlyNiagara/NiagaraontheLake1790/ImageServer)；坐标 EPSG:26917；原始范围 `[650675.2388695217,4788157.560972746,658850.1279029312,4792482.148716513]`（米） |

GIS提取方法：在原始 `ImageServer/exportImage` 请求中给出与源服务一致的 `bboxSR=26917`；如需映入网页WGS84图层，先明确 `imageSR=4326` 并记录实际返回范围，再对堡墙逐点矢量化。史图中的预留带可单独描绘为**规划／法律限制范围虚线**，不得当作直接控制；1790年乔治堡尚未按后来成堡形态建成。原图存在地理配准，并不自动提供可直接使用的堡墙矢量边界。将经配准图中的堡墙、兵营、道路、规划地块分别做图层，不沿整张矩形影像的外接框填色。

补充年代来源：[美国国家公园署关于1794年Fort Miamis及1796年撤军的说明](https://www.nps.gov/articles/000/historical-overview-of-fallen-timbers-battlefield-and-fort-miamis.htm)；[加拿大公园局乔治堡历史](https://parks.canada.ca/lhn-nhs/on/fortgeorge/culture/fort-george)。1790年规划、1794年新筑与1796年撤军分别对应不同的事件／控制图层。

## 3. 新南威尔士纸面王室声索 `NSW_CROWN_CLAIM`（1788—1799）

**已定位同期原图：**
- [新南威尔士州立图书馆：约翰·亨特1796年8月20日聚落草图](https://www.sl.nsw.gov.au/collection-items/new-south-wales-sketch-settlements-20th-august-1796-cartographic-material-governor)，馆藏号 `Cb 79/7`。馆藏说明区分**红色：殖民者步测过的地区**与**绿色：主要耕作农场**；两者必须建成**不同图层**。红线不得被解释为英国取得实控的边界。
- [新南威尔士州立图书馆：1799年Grimes和Flinders的悉尼聚落地形图](https://www.sl.nsw.gov.au/collection-items/topographical-plan-settlements-new-south-wales-including-port-jackson-botany-bay)，1800年前重要对照资料。
- [新南威尔士州立档案：1788—1856土地授予指南](https://mhnsw.au/guides/land-grants-guide-1788-1856/)及[土地档案](https://mhnsw.au/guides/land-records-available/)；[州立图书馆历史地籍记录浏览器](https://guides.sl.nsw.gov.au/maps/hlrv_fundamentals)：由原授地登记和当期测绘逐宗确定位置和时间。1790年代资料须与1813年后汇编图分开。
- [州立图书馆：1796原图馆藏页](https://www.sl.nsw.gov.au/collection-items/sketch-new-south-wales-settlements)：同一图件的文字解说。

**拟制图层：**优先绘制悉尼湾、帕拉马塔及霍克斯伯里地区1790年代**有原图边界的农田／授地小片**。殖民探查边线独立虚线呈现，王室名义声索独立史料标注；保留原住民族土地与政治主体，不将探索、授地、军事驻留混为整个新南威尔士州的实控填色。

**发布门槛：**馆藏原图高清扫描、至少多个稳定海岸／河口控制点、配准残差、图上各色符号原始图例、土地授予日期；尚无这些成果时不增加区域多边形。

## 4. 5AE遗留四个“未直接升级”点

对照 [5AE点转面候选清单](18C_5AE_POINT_AREA_CANDIDATES.json) 与 [5AE已确认转换表](../../data/eighteenth-century-editor39-5ae-point-area-promotions.json)：

- `EDITOR38_5AD_FORT_PITT_1763`：1764年布凯碉楼不应替代1763年匹特堡实际堡墙；需同期全堡平面图。
- `EDITOR36_5Y_BOMBAY`：城市港口与贸易军事事件范围远大于单个孟买城堡，最多**另立堡体面**，不抹掉海港主题点。
- `EDITOR36_5Y_CALCUTTA`：税政、河网和旧威廉堡是不同空间对象，旧堡可独立成面，税制档案保留点与相关河线。
- `EDITOR36_5Y_ARCOT`：阿尔科特政治关系不应由单座堡墙代表；可另立同年“堡垒占领”多边形而保留政治专题地点。

## 5. 下一批执行和质量门槛

1. 先取得原图**正式馆藏号、高清原件、完整图例与年份**，记录史图本身与现代GIS底图的差别；未拿到的暂不生成面。
2. 优先 NSW 1796实际农田小片；其次 Niagara／Fort Miamis同期驻堡；再按 Carolina 土地丈量和实际聚落小片。优先级依据同年代资料的具体性与可配准性。
3. 每项记录 `source_url`、图名、绘制年份、使用时段、坐标控制点、误差、边界置信度、政治主体、行为类型和原点位ID；不写虚构数值，不用简单点缓冲。
4. 新数据通过 `scripts/audit_spatial_semantics.py --strict`、相邻年份和1699→1700／1799→1800检查以及真实浏览器面积／点击／隐藏重复点测试后，方可纳入公开地图。
5. **本批研究索引不计作“完成几处点转面／退役几处旧框”**；只有真实写入并验收的GIS才更新统计。

关联主进度：[1497—1799制图总台账](PRE_1800_CARTOGRAPHY_HANDOFF_20261119.md)。
