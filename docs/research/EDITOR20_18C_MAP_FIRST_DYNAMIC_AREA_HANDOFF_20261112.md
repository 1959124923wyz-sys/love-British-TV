# 主编20｜地图优先：18世纪动态空间图层第一批（2026-11-12）

## 立即贯彻项目地图优先原则

此前31篇专题+3篇新增文章、732条研究Atlas事件大多只有年份事件点，难以直观看出英国殖民据点的扩大、丧失、重新占领及贸易影响。**本批优先改变地图视觉层而非增加新文章。**

本批GitHub分支`map/18c-34-dynamic-territory-occupation-influence-1700-1799-20261112`继承第33批地图研究Draft PR #328，正式main不修改。

### 新增可视化空间单位

- **24组逐年动态区域面参考**、**28个有效时期**，直接复用原项目`data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson`中24个既有独立Polygon，未重画、未改原几何，按1700—1799年的殖民政府文书、公司贸易/要塞资料和独立战争阶段重新指定日期。
- **15处有据的英国驻军／公司港口城市核心**、**18个控制时期**，在真实桌面地图用带外环的紫/蓝/橙色屏幕圆形绘制，标注精确日期证据类型，点击展示史料。
- 合计**39个可分别点击的地理对象、46个时间阶段**。在地区视图上，大面积行政研究参考以淡紫色+虚线呈现；**远大于实占范围的公司纸面声索（鲁珀特地等）只画金色无填色虚线**；跨岛贸易/土地剥夺影响用青色/橙色无填充虚线；具史料证实的城市军事控制实芯标志单独叠加。
- 每次年份滑块或播放更新，刷新本年度有效区、消失区和复夺城市；项目原有“版图”开关会统一控制这些图层，不依赖“事件”是否开启。
- 原旧地图、全部34篇18世纪文章、1126原始候审交叉表和全部原研究ZIP均未改动。

## 必须直观看到的时间变化

| 年份与转换 | 地图变化 | 权威来源 |
|---|---|---|
| 1704英国夺直布罗陀；1713法律割让 | 英军城堡实芯出现并继续；1713前后不同法律身份在点击文本注明 | [英国下议院外交委员会](https://publications.parliament.uk/pa/cm199899/cmselect/cmfaff/366/36604.htm) |
| 1708英军据米诺卡、1756丧失、1763夺回、1782西班牙夺回、1798英国再占 | Mahón点在对应年份出现、消失、再出现 | [西班牙米诺卡官方资料](https://www.menorca.es/documents/documents/10047doc4.pdf)；[英国陆军博物馆](https://www.nam.ac.uk/explore/american-war-independence-key-battles) |
| 1745–1747英国第一次占路易堡，1758再次夺城，1760后毁堡 | 仅两个有据短期驻军时期显示 | [加拿大公园局](https://parks.canada.ca/lhn-nhs/ns/louisbourg/decouvrir-discover/histoire-history) |
| 1746法军夺马德拉斯；1756孟加拉纳瓦卜夺加尔各答堡；1749与1757英方分别恢复 | 公司贸易据点参考区相应年份消失，不连续填色 | [英国议会东印度公司研究](https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/parliament-and-empire/parliament-and-the-american-colonies-before-1765/parliament-and-the-east-india-company/)及本项目孟加拉连续专题 |
| 1759/1760魁北克、蒙特利尔英军夺城 | 仅城市核心持续出现，**没有**扩画整个加拿大和Mi’kma’ki | [加拿大公园局](https://parks.canada.ca/lhn-nhs/qc/saintlouisforts/culture/histoire-history/natcul1) |
| **1762哈瓦那英军夺城→1763归还**；**1762马尼拉英军夺城→1764撤离** | 两个实色港口占驻标志精确出现和撤退 | [National Army Museum 哈瓦那](https://collection.nam.ac.uk/detail.php?acc=1952-07-30-1)；[美国国会图书馆1762原件地图](https://www.loc.gov/item/75692515/) |
| 1776美国独立战争时期 | 弗吉尼亚等殖民省广域行政参考外缘在1775后停止沿用，独立显示1776–1782英军在纽约市的驻军核心 | [英国国家档案馆殖民地研究指南](https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/american-and-west-indian-colonies-before-1782) |
| **1781圣尤斯特歇斯英国侵占、没收与法军同年反攻** | 独立金色虚线和浅色核心仅显示**1781年内短暂占领**，标明年末已被法军收复 | [圣尤斯特歇斯地方政府](https://www.statiagovernment.com/residents-visitors/culture-events/history) |
| 1786英国公司占槟城港口、1795英军夺开普敦 | 港市实色核心按事件年出现，**不**扩大至吉打或整个Cape Khoekhoe/Xhosa地区 | [槟城港口管理局](https://penangport.gov.my/en/contact-us/public/port-history)；[英国陆军博物馆](https://www.nam.ac.uk/explore/78th-highlanders-regiment-foot-ross-shire-buffs) |

## 历史地理严谨性

**明确三层精度**：

1. **有据实控**：英国已据某港市或堡垒的史实，显示**实芯固定像素半径的符号**，可以不懂GIS也看见占领及撤离。圆形宽度不是占领陆地平方公里。今城市中心点不能充当18世纪城墙测量。
2. **殖民行政参考面**：原17世纪郭形或殖民地参考范围按18世纪相应证据段接续，显示**淡色虚线参考区域**，直观呈现殖民管制广度但没有原时代实测地籍、不能看作任何局部都曾由英军驻守。
3. **声索/影响**：哈德孙湾公司流域特许、纽芬兰殖民渔业权、北美纸面授地等范围只能**虚线、无填充、不计算面积**，原住民及当地政治主体未被英国声索文件消灭。

**39个新图层对象无一获准申报精确英国占领多边形、0平方公里面积总量、0假定航线和0推断赔款。** 在找到具日期的政府土地测绘原件并完成配准前，不把这些参考外缘升级成「实控领土面积」。

## 本批代码和继续生产路线

- 数据：`data/eighteenth-century-dynamic-spatial-1700-1799.json`（24 Polygon metadata引用、15 Point、46时期，来源URL逐件）。
- 图层程序：`js/eighteenth-dynamic-spatial.js`（原Leaflet API、历史年度开关、地图点击打开史料，版本不依赖手机端）。
- 入口：`index.html`地图图例与JS加载；`app.js`既有区域地图刷新回调和防止地图通用点击盖掉新地理弹出。
- 严格静态：`scripts/test_18c_spatial_paint_24_15.js`，逐来源、年份断点、经纬度与禁止面积审计。
- 真浏览器：`scripts/browser_18c_map_first_dynamic_areas.py`，**1780×1020**真实Chromium，跨1704/1749/1756/1762/1763/1776/1781/1782/1798，检查面和点实际消失/重现、点击出处、切版图开关、已发表16世纪回归，以及关闭研究试阅时不泄漏。
- CI：`.github/workflows/18c34-map-first-dynamic-area-paint.yml`三作业，每次提交独立通过才称最终验收，Draft PR不合并。
- 下一批真正升级**具史料测绘支持的土地面**：优先1763 Royal Proclamation四个殖民政府边界（美国/加拿大政府原件）、曼尼拉1762城墙内十八世纪原图（美国国会图书馆）、加拿大全国公园局要塞考古GIS、米诺卡历史海岛外形及牙买加马龙条约保留地实测源。只有取得合法可复用的GeoJSON或完成历史地图配准，才开始统计按年实控平方公里。

项目地图优先，以后每批优先增加**可显示、可按年切换且能说明控制主体的面和实际占领核心**，历史文章只作图层出处与背景。
