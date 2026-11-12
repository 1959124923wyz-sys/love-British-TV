# 主编21｜第36批：扩充北美边疆、印度财税领地与加勒比反抗的动态GIS（2026-11-12）

## 定位
承接主编20第34批 PR #329、第35批 PR #330。用户要求“量大管饱”，**本批不增加历史文章**，直接补齐全球历史地图。所有图层仅在 `?review18c=1` 预览显示；不碰 main、1126条旧档案和34篇历史专题。

### 可见增长统计
| 地图对象 | PR #329 | PR #330增量 | 本批增量 | 截止第36批 |
|---|---:|---:|---:|---:|
| 概略、可逐年切换的Polygon |24|81|**130**|**235**|
| 具年份的城市、要塞、事件核心 |15|42|**83**|**140**|
| 历史有效阶段（分段计数） |46|149|**221**|**416**|

本批130区域分类：23殖民行政、20局部军事、21公司税务、11商贸影响、7法律声索、17战场、23原住民／马龙／奴役抵抗、5强制迁移、1条约外交、1公司财产强制、1他国占领（英军失去控制）。83个核心从**明确指定的局部区域**自动生成矩形中心，永远标成近似地点，绝非实测城墙中心或实际控制面积。

## 时间断点重点
- **1713、1749、1755**：阿卡迪亚割让、哈利法克斯驻军建设、英方征服和大驱逐；当地Mi'kmaq人民政治地位保持独立，强制迁移画成橙色虚线而非“新英国地块”。
- **1759—1766**：五大湖英军占堡与Pontiac战争、米希利麦基诺克原住民夺堡，原住民抵抗以青绿虚线标出。
- **1763、1768、1796**：皇家公告原住民保留地与禁垦政策、斯坦威克斯堡争议土地边界、美国独立后英军才撤离部分大湖堡垒；法定领土、军事堡垒和原住民权利分层。
- **1757、1764、1765**：普拉西、布克萨尔与Diwani税务权扩张，逐个拆分孟加拉/比哈尔的财政影响；1765奥里萨名义Diwani以金色空心纸面声索而非英军实占显示。
- **1780—1782、1792、1799**：迈索尔英军失败、围城与地税扩张；1792割让马拉巴尔和巴拉马哈尔，1799战后哥印拜陀、卡纳拉等变化。库格地方王公的附属关系以贸易外交影响表达；**库格1834年才并入英辖，不得提前涂作1792年英领**。
- **1739、1760、1795—1796**：阿康蓬、Nanny Town和Moore Town的马龙自治与起义；Tacky's War；格林纳达Fédon革命。英国殖民行政、军事镇压区和反抗社群分色。
- **1793—1797**：英军在圣多明各沿海部分据点占领，本批按1797年底仍驻守的保守年度跨度；1798撤退过程不作全岛英占声索。
- **1781、1782、1797**：圣尤斯特歇斯商产被没收、巴哈马拿骚西班牙军短占（英方丧失控制）以及圣文森特Garifuna强迁。

## 可信来源索引（每个GIS对象具源URL）
首选英国/加拿大议会、美国国家公园局、印度国家陆军博物馆、英国图书馆India Office档案、牙买加国家遗产信托、格林纳达专题学术论文。全部29个共享来源组注册于完整JSON。重要依据：
1. [皇家公告1763年原件及原住民保护规定（加拿大联邦政府）](https://rcaanc.gc.ca/eng/1370355181092/1607905122267)
2. [英国议会：加拿大殖民省1763/1774/1784/1791变化](https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/parliament-and-empire/parliament-and-the-american-colonies-before-1765/british-north-america-1763-91/)
3. [美国国家公园局：1768 Fort Stanwix边界条约与原住民族土地争议](https://home.nps.gov/articles/000/1768-boundary-line-treaty-of-fort-stanwix.htm)
4. [美国国家公园局：马基诺岛Fort Mackinac与1796英军撤军](https://npgallery.nps.gov/GetAsset/99c4e6c6-d262-44b5-a1d6-0e3550d23109/)
5. [美国国家公园局：大阴郁沼泽原住民及逃奴生活](https://www.nps.gov/articles/000/tom-copper-and-great-dismal.htm)
6. [英国国家陆军博物馆：东印度公司1765税务权及马拉塔/迈索尔战争](https://www.nam.ac.uk/explore/armies-east-india-company)
7. [英国国家陆军博物馆：1799年斯里兰加帕特南的军事掠夺](https://www.nam.ac.uk/explore/tipu-sultans-war-turban)
8. [英国图书馆India Office Records：1792年迈索尔割让条约及税务记录](https://searcharchives.bl.uk/catalog/040-000564194)
9. [印度农业/历史档案所存印度殖民时期地权变动报告](https://bsi.gov.in/uploads/userfiles/file/Rare%20Books/Report%20On%20The%20Old%20Records%20Of%20The%20India%20Office.pdf)
10. [牙买加国家遗产信托：1739年阿康蓬马龙条约与土地](https://www.jnht.gov.jm/site_accompong.php)
11. [牙买加国家图书馆：英属西印度群岛18世纪奴役反抗年表](https://nlj.gov.jm/history-notes/Chronology%20of%20Resistance%20in%20the%20British%20West%20Indies.pdf)
12. [剑桥期刊：1795年格林纳达Fédon起义](https://www.cambridge.org/core/journals/americas/article/abs/island-of-grenada-in-1795/8A57445A2A9AFEDC7E95EC4A6D65FFEC)
13. [学术期刊Outre-Mers：1793英国介入圣多明各](https://www.persee.fr/doc/outre_0300-9513_1962_num_49_176_1358)

## 史料与地图精度底线
- **所有130多边形都是人工示意包络框**，每条JSON保留 `precise_historic_border=false`, `uncertain_line_dashed=true`, `area_sqkm=null`、`exclude_from_territorial_area_totals=true`。不是可比较的殖民行政实测面积。
- `resistance`、`displacement`、`battle`、`paper_claim`、`foreign_occupation`、`diplomacy`、`trade_influence`一律仅轮廓、不填色。税收、行政、局部驻军区用低透明度填色和虚线边。
- 83个核心由**事先筛选的局部已据史实**生成，点位坐标取示意矩形中心，因此仍为“概略位置”，圆圈是屏幕大小标志，不是城镇占领占地范围。
- 各地人民政治自主权、流放、掠夺、奴隶制和战争实际控制权不混同。不得叠加计算面积，也不按几何框面大小生成任何英属疆域km²数字。

## 工程结构和可重复审计
- 数据：`data/eighteenth-century-expansion-batch36-1700-1799.json`（29来源组、130区域、83核心）
- 真地图渲染：`js/eighteenth-batch36-spatial.js`。独立图层与点击史料，时间轴、版图总开关跟随旧代码。
- `app.js` 现有4处年度重绘和点击防误拦截已并入新模块。原第34/35批原文件完整保留。
- `index.html`新增脚本及总量图例；默认未开放18世纪发布时不会显示。
- 静态验收：`scripts/test_18c_batch36_130_83.js`，含旧三批数据、年代断点、史料URL、GIS双向指向、禁面积检查。
- 浏览器验收：`scripts/browser_18c_batch36_130_83.py`，真实1780×1020桌面，14个年份抽样、点击史料、三批一起关闭、1572旧版回归及非预览隔离。
- GitHub Actions `.github/workflows/18c36-frontiers-mysore-caribbean-map.yml`，三项：静态+GIS+旧文档、真实桌面、独立SHA公开页面。
- 保持Draft PR，绝对不合并main。
