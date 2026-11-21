# 第5AE批｜1763公告线、真实岛廓、哈德孙湾海岸与历史点转面（2026-11-21）

前置：第5AD批 [PR #488](https://github.com/1959124923wyz-sys/love-British-TV/pull/488)，基线 `bfe1cbf7cadc90665a2113fe25aa737fbb46efc0`。

## 本批已修改的数据

- 十八世纪旧矩形按源档 `bbox`、`!geometry`、`!superseded_by` 全部筛查：**26→3 条**；其中1799年仍有 **12→1 条**；1497—1799前期合计 **52→29 条**。新增 `superseded_by` 23 处，旧记录所有年份、原始笔记、经纬度参考框与网页来源全部保留；旧框逐条ID和对应的正式几何见下面。
- 新增 **15组真实来源GIS**：5组自然岛岸／历史堡址多边形、9组官方历史界线或 Natural Earth 地形折线、1个有登记纪念碑出处的地理点。真实GIS折点均直接从原文献/数据抽取，绝不沿人工矩形或凭两点连线构造航线。
- 按新的追加任务，把 **5个已经存在历史城堡多边形的点位显示升级为面**，全是使用仓库原有、已审过的多边形。面积统计禁用，靠来源可靠程度标虚线。旧点及来源数据保留不删除。
- 原始全仓筛查 `docs/research/18C_5AE_OLD_RECTANGLE_INVENTORY.json`，GIS源资料候选 `docs/research/18C_5AE_EXISTING_GEOMETRY_INVENTORY.json`，筛查全部可用面图 `docs/research/18C_5AE_ALL_PUBLISHED_SHAPES.json` 与 `18C_5AE_HISTORIC_SHAPE_SHORTLIST.json`。

## 实测历史地理

| 图组 | 实际图形 | 史料／底图 | 解释 |
|---|---|---|---|
| 1763年皇家公告线南段、北段 | 2组曲折 MultiLineString，原始矢量219节点 | [NPS历史地图与Natural Earth配准GIS](https://services1.arcgis.com/VAI453sU9tG9rSmh/ArcGIS/rest/services/UsHist_13Colonies_features/FeatureServer/1)；[乔治·华盛顿故居解释](https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/proclamation-line-of-1763) | 画公告的殖民者定居限制政策线，绝不涂成整个阿巴拉契亚山区的英军控制区 |
| 1773年圣文森特加里富纳土地条约 | 原版配准界线61节点 | [美国国会图书馆1773年海图](https://www.loc.gov/item/74691610/)、[斯坦福配准图](https://purl.stanford.edu/vc907zx4948) | 1773—1778界线虚线显示，与岛上卡利纳戈、加里富纳的政治主体分开 |
| 圣文森特及巴利索岛 | 22节点本岛外廓、427节点巴利索真实小岛 | [联合国关于强迫流放记录](https://digitallibrary.un.org/record/755522?ln=en)；本仓18C史图 | 1796—1797拘留流放必须沿巴利索小岛自然岸绘图，不拿大片海洋包围框 |
| 哈德孙湾、伯利兹与卡罗来纳 | 4组自然海岸线：803折点、含海湾小岛多段 | [Natural Earth 1:50m coast](https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/50m/physical/ne_50m_coastline.json) | 物理海岸作背景；海上贸易航路、王室特许及实际控制独立档案，无人造GPS航迹 |
| 桑蒂河与铜矿河 | 2组自然曲折河线：303折点、按源GIS中断 | [Natural Earth 1:10m named rivers](https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/10m/physical/ne_10m_rivers_lake_centerlines.json) | 仅展示实有水系，马托纳比与赫恩1771年行程并非沿整条河线航行 |
| 南卡莱努德渡口 | 1处1780年历史纪念碑经纬度 | [南卡250周年机构历史遗址](https://southcarolina250.com/historical-site/battle-of-lenuds-ferry/) | 战场范围暂无可核历史GIS，保留点、并以桑蒂河自然线展示战区环境 |
| 库格马迪凯里王堡 | 78节点已审历史王堡 | `MYSORE_COORG_MADIKERI_FORT` 登记源及库格战争史 | 库格王公独立地位与东印度公司的军事联盟不混成英国直辖领土 |
| 科西嘉、马尔维纳斯／福克兰群岛 | 原始Natural Earth 1:50m实岛边线，分别61和149折点 | [Natural Earth 1:50m land](https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/50m/physical/ne_50m_land.json) | 科西嘉1794—1796英科联盟，群岛1774年英方撤军后持续声索；争议政治权利不从自然岛形自动推断 |

**伯利兹Faden 1787年许可区**：第5AD批原始条约地图在[美国国会图书馆](https://www.loc.gov/item/86692594/)。本批只增加伯利兹真实海岸及1783、1786年原有具名河口，尚未取得历史图所需的可靠地理配准控制点。1783和1786许可范围不画人工多边形，不误称英国当年占领今伯利兹整个国土。

## 历史点位转面：5处

本批使用 `data/eighteenth-century-editor39-5ae-point-area-promotions.json` 保存原始点到已有历史GIS多边形的**有年代限制**转换表。由 `window.AtlasPointToArea5AE` 核查登记源GIS已加载且在该年有效后，才隐藏对应点；没有面时点自动回退。面图层继续提供同一处堡垒的历史档案点击。

| 原点 | 已证真实区域面 | 可替代年份 | 核实结果 |
|---|---|---:|---|
| `EDITOR38_5AD_TELLICHERRY_FORT` | `MYSORE_TELLICHERRY_FORT` | 1708—1799 | 英东印度公司旧堡15节点区域，早于1708仍保留原地点 |
| `EDITOR38_5AD_MADRAS_TREATY_1769` | `MADRAS_ST_GEORGE_SIEGE` | 1769 | 圣乔治堡历史堡墙；1769海德尔·阿里和公司和约在此签订 |
| `EDITOR38_5AD_ARCOT_1780` | `ARCOT_FORT_CORE` | 1780—1781 | 1780迈索尔夺取阿尔果德，堡墙现有历史图与档案来源 |
| `EDITOR37_5AC_ANNAPOLIS_FORT_ANNE` | `FORT_ANNE_ROYAL_PORT` | 1755—1763 | 1755年阿卡迪亚强制驱逐的重要驻堡，当地17、18世纪堡墙经原图核实 |
| `EDITOR37_5AB_BEYIN` | `EDITOR37_5AB_BEYIN_FORT_AFTER_1773` | 1773—1799 | 贝因阿波罗尼亚堡已存在的堡体轮廓，1766—1772年尚未建成正式堡，仍保留地点 |

**不予转面的例子**：1763年匹特堡不能用建于1764年的布凯碉楼形状冒充；孟买港贸易与加尔各答税制也不能用一座城堡的墙线代表整个港湾或财政区。已记录在 `18C_5AE_POINT_AREA_CANDIDATES.json` 和正式跨表。

## 23条旧框转接目录

| 旧ID | 已有或本批新地理 |
|---|---|
| `B36-Z023`、`B36-Z024`、`OHIO_PROCLAMATION` | 1763公告线 `EDITOR39_5AE_PROCLAMATION_NORTH`／`SOUTH` |
| `B36-Z088` | `EDITOR39_5AE_COORG_MADIKERI_FORT` |
| `B36-Z093` | `MYSORE_SOUTHERN_CESSION_1799`，广义南部划拨，不宣称尼尔吉里精确条约县界 |
| `B36-Z110` | `JAMAICA_MAIN_ISLAND`，仅牙买加地理背景，1791—1792反抗具体地点仍待调查 |
| `B36-Z121`、`B36-Z122` | `EDITOR39_5AE_ST_VINCENT_ISLAND_CONTEXT`、`EDITOR39_5AE_BALICEAUX_GARIFUNA_ISLAND` |
| `B38-H-Z007`、`B38-H-Z016`、`B38-H-Z025` | 约克厂自然海岸、铜矿河、哈德孙湾北岸，均不代表王室主权实控 |
| `B38-S-Z022`、`B38-S-Z033`、`B38-S-Z048` | 莱努德历史碑址、卡罗来纳真实海岸，史料与供给网络仍按原记录待核 |
| `BELIZE_LOGGING` | 伯利兹真实海岸（不画无证许可区） |
| `NORTHERN_CIRCARS`、`CARNATIC_RELATIONS` | `EDITOR37_5AB_CIRCARS_BAY_SHORE`、`EDITOR37_5AC_COROMANDEL_COAST`（自然海岸+原税务档案） |
| `SURAT_FACTORY`、`BENARES_ESTATES`、`SENEGAL_FORTS` | 原有源证具名商馆、税收中心、圣路易斯堡节点 |
| `GOLD_COAST_TRADE` | `EDITOR37_5AB_GOLD_COAST_SHORE`（真实海岸和各堡独立档案） |
| `FALKLAND_PAPER`、`CORSICA_1794` | 本批对应自然群岛岸线与科西嘉本岛外廓 |

每个原 `periods`、`bbox`、`source_urls`、`note` 原样保留，新增 `superseded_by` 指向已有几何。原百余点历史研究与正式图层之间采用ID交叉追溯，代码 `scripts/apply_editor39_5ae_replacements.py` 能从上批主线重现变更。静态核查 `scripts/test_editor39_5ae_source_areas.js`、`scripts/test_editor39_5ae_point_area_promotions.js`；桌面验收 `scripts/browser_editor39_5ae_source_areas.cjs` 和原5AB、5AC、5AD回归。网页史料点击与年代相邻切换经 GitHub Actions 全站CI确认后才合并。

## 5AF的剩余3条旧框及新增点转面任务

- `CAROLINA_PROPRIETORS`（1700—1711）：1776年后的现代南北卡海岸图不能代替1700年领主殖民省政治形状，先找同期原行政/土地文书与历史比例尺。
- `GREAT_LAKES_POSTS`（1783—1795）：可按尼亚加拉、底特律等各有记载的实际英军堡地逐处画独立小多边形，不能把五大湖地区画成英军总控。
- `NSW_CROWN_CLAIM`（1788—1799）：明确王室纸面授地范围与悉尼湾、帕拉马塔、霍克斯伯里实际驻地，原住民族土地不涂为英国实控。寻找1790年代授地地籍图，可分多个真正的小片面积。
- **新增持续任务**：按 `18C_5AE_POINT_AREA_CANDIDATES.json` 的源证要求逐批把能证明轮廓的地点转换成面；每次分别登记当期历史边界的原始地图、配准精度、文化政治主体、权力性质、原始点ID与图面ID；可证面为主，其他维持点，不做无证半径圈或现代行政界套用。

参考总台账 `docs/research/PRE_1800_CARTOGRAPHY_HANDOFF_20261119.md`。
