# 第5AB批｜复用实测堡墙与真实岛岸、沿岸和河道

2026-11-21，主编37，承接5AA，基线 main `27c971ddd70c91a3757819266ac79700f2cbc8ae`。本批替换**26条旧矩形**，其中1799年仍活动22条。十八世纪剩余矩形 **110→84**；1799年旧框 **44→22**；总计1497—1799全部旧矩形（含原17世纪26条） **136→110**。原始记录的bbox、年代、史料、政治与经济说明不删；每一条写入 superseded_by 后退出读者显示。

## 制图对象与真实几何

- **7组Polygon/MultiPolygon**：瓜德罗普双岛、1762年多巴哥本岛、1763年和约法国获还的瓜德罗普／马提尼克／圣卢西亚分岛集合；阿诺马布、迪克斯科夫、科尔曼廷和贝因的十八世纪堡墙。岛国取仓库已发布19世纪第七批的 **Natural Earth 1:10m岛廓**，堡体取已用十八世纪测图和现代遗迹交叉定点的同一原形。科尔曼廷是荷兰堡，克里斯蒂安堡为丹麦堡，不能涂成英方领土。贝因1766年只是地方授许筹备，以点显示；1768年始建，主堡轮廓自1773年后显示。
- **4组MultiLineString真实自然线**：黄金海岸、北萨卡尔沿岸共两组，源自 Natural Earth **1:50m** `ne_50m_coastline` 完整相邻原节点；北萨卡尔哥达瓦里河和克里希纳河源自同尺度 `ne_50m_rivers_lake_centerlines` 真河曲线，遇自然数据间断不作臆造直线连接。分别存原几何来源链接、类型、年份和虚线。
- **15个具名Point**：西非9处，北萨卡尔5处，马提尼克马兰港1处。这些是现代可识别历史所在地锚点。沿岸商贸、原住地社群、荷丹英堡垒与名义财政安排分层。

关键真形数据：[本仓库十九世纪第七批旧址和真实岛岸](../../data/nineteenth-century-territorial-areas-batch7.geojson)、[NE 50m Coastline](https://github.com/martynafford/natural-earth-geojson/blob/master/50m/physical/ne_50m_coastline.json)、[NE 50m Rivers](https://github.com/martynafford/natural-earth-geojson/blob/master/50m/physical/ne_50m_rivers_lake_centerlines.json)。从数据提取，未从矩形各角画假多边形。

## 历史证据与重要分期

- 西非堡垒及跨洋奴役贸易：[加纳博物馆与古迹委员会](https://gmmb.gov.gh/forts-and-castles/)。不同堡的施工、荷丹英交换与地方范特、阿汉塔、恩泽马和加人政治分开；1970年出版的古迹目录及项目既有[5E堡体配准](18C_GOLD_COAST_FORTS_HANDOFF.md)、[5V沃森原图和港堡](18C_WEST_AFRICAN_FORTS_AND_GAMBIA_HANDOFF.md)为几何证据。多堡联络旧框仅由真实曲折海岸线作为地理底图承接，不冒充船只精确航迹。
- 1763年和约：[耶鲁原文](https://avalon.law.yale.edu/18th_century/paris763.asp)把瓜德罗普、马提尼克、圣卢西亚归法国，**多巴哥归英国**。多岛分离描绘，尊重原来的1762年战时与1763年外交期。瓜德罗普糖岛奴役与贸易背景有UNB档案链接保留于原纪录。
- 北萨卡尔：[印度政府维沙卡帕特南地区志](https://censusindia.gov.in/nada/index.php/catalog/27687/download/30856/DH_28_2001_VIS.pdf)说明1765年莫卧儿诏授、1766年尼扎姆条约及地方权力交接，[南印扩张研究图](https://escholarship.org/content/qt0h23p0rv/qt0h23p0rv.pdf)列出贡土尔1788年。**五条旧财政矩形**改为有据城镇点与真实河海底图；古代税区行政界仍缺配准，继续不画现代行政省界假轮廓，纳瓦卜／尼扎姆与地方扎明达里政治不归并为英方城堡。
- 马兰港只作1762年港湾地点，不凭一条战争总述编造该港驻军或战役。

## 退役旧框及替代稳定ID

| 原始记录 | 新稳定图元 |
|---|---|
| `B37-A-Z002` | `EDITOR37_5AB_CAPE_COAST` |
| `B37-A-Z007` | `EDITOR37_5AB_ANOMABU` |
| `B37-A-Z010` | `EDITOR37_5AB_DIXCOVE` |
| `B37-A-Z013` | `EDITOR37_5AB_BEYIN` |
| `B37-A-Z015` | `EDITOR37_5AB_ACCRA_JAMES` |
| `B37-A-Z017` | `EDITOR37_5AB_KOMENDA` |
| `B39-A-Z002` | `EDITOR37_5AB_TANTUMQUERY` |
| `B39-A-Z003` | `EDITOR37_5AB_TANTUMQUERY` |
| `B39-A-Z005` | `EDITOR37_5AB_PRAMPRAM` |
| `B39-A-Z006` | `EDITOR37_5AB_PRAMPRAM` |
| `B39-A-Z008` | `EDITOR37_5AB_WINNEBA` |
| `B39-A-Z015` | `EDITOR37_5AB_APAM` |
| `B39-A-Z017` | `EDITOR37_5AB_KORMANTIN` |
| `B39-A-Z019` | `EDITOR37_5AB_CHRISTIANSBORG` |
| `B39-A-Z024` | `EDITOR37_5AB_KOMENDA` |
| `B39-A-Z035` | `EDITOR37_5AB_GOLD_COAST_SHORE` |
| `B39-A-Z036` | `EDITOR37_5AB_GOLD_COAST_SHORE` |
| `B36-Z075` | `EDITOR37_5AB_VIZAGAPATAM` |
| `B36-Z076` | `EDITOR37_5AB_SRIKAKULAM` |
| `B36-Z077` | `EDITOR37_5AB_RAJAHMUNDRY` |
| `B36-Z078` | `EDITOR37_5AB_ELURU` |
| `B36-Z079` | `EDITOR37_5AB_GUNTUR` |
| `B39-C-Z006` | `EDITOR37_5AB_GUADELOUPE_SUGAR_SHORE` |
| `B39-C-Z016` | `EDITOR37_5AB_MARTINIQUE_LE_MARIN` |
| `B39-C-Z030` | `EDITOR37_5AB_TOBAGO_1762_SHORE` |
| `B39-C-Z038` | `EDITOR37_5AB_1763_FRENCH_RESTORED_ISLANDS` |

每条被退役原bbox和原史料仍在对应JSON，全部 linked proxy sites 如存在一并写入 `superseded_by`。新数据文件 `data/eighteenth-century-editor37-5ab-physical-areas.geojson`；脚本 `js/eighteenth-editor37-5ab-physical-areas.js`；专项核查 `scripts/test_editor37_5ab_source_geography.js`。

## 后续待办

优先剩余 **84条十八世纪旧框**：南卡／弗吉尼亚实际战场和军事驻站若有美国国家公园署（NPS）ABPP的边界GIS，转为真实战场虚线Polygon；革命战争后勤交通/战争影响广域不能冒充实测主权。接着查1755阿卡迪亚驱逐地区真实河谷、堤田和海岸地形，以及北萨卡尔1766—1799地方旧税区配准图。保留1799→1800世纪交接记录的原稳定ID和统计，不篡改已经有据的十九世纪控区。

## 专项桌面浏览器验收

新增 `scripts/browser_editor37_5ab_physical_areas.cjs` 使用真实 Chromium 于1780×1020屏幕逐项查看1762、1763、1772、1773、1787、1788、1799、1800、1801、1699年。点验1763法国获还三岛的边线与1762英方战争区不跨年，贝因堡围墙在1773年后出现，贡土尔1788年开始，1799年剩余旧框退出，黄金海岸城堡点击后右侧展示原始档案，1799→1800四组自然线接续，公共文案无GIS编审说明。GitHub Actions保留桌面截图。

## 第5AB批地理位置纠偏与浏览器环境
- 早期贝因/阿波罗尼亚堡的地点锚点原设为 `[-2.621,5.025]`，与已经配准的堡址 `[-2.5901,4.9871]` 相差数公里。现从同库十八世纪堡体主墙外缘 20 个独立折点计算中心坐标 `[-2.5900733,4.9871428]`，并明确早期许可阶段无已建堡墙，1773年之后才绘主堡实体。专项测试比较两期坐标。
- 北萨卡尔五处具名城镇及马提尼克马兰港补核具名地理位置：维沙卡帕特南采用美国地名委员会 NGA 地理锚点，其他优先使用 GeoNames 城市地名；辅助证据只定位现代城镇而非1766年古税区边界。
- GitHub Actions 托管 `ubuntu-latest` 于2026年11月已迁移到Ubuntu 26.04，Playwright 1.58.2 的 `install --with-deps chromium` 不支持该发行版。专项浏览器工作流固定到 `ubuntu-24.04`，其余测试仍保留严格原逻辑；这属于测试运行环境修复，不对历史内容作删减。
