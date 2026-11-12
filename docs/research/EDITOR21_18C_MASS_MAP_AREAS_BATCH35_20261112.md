# 主编21接班｜第35批：18世纪海量动态版图（2026-11-12）

## 任务转向
承接主编20第34批 PR #329，用户要求“**不追求多么精确，要量大管饱**”。本次只新建空间数据与绘制、验收，不重复写历史专题，也不动1,126条原始档案及既有34篇专题。保留 main 不变，新 Draft PR 面向第34批研究分支。

## 可见地图增量
| 指标 | 第34批旧值 | 第35批新增 | 总计 |
|---|---:|---:|---:|
| 有日期的区域参考面 | 24 | **81** | **105** |
| 有日期的城市、堡垒、港口核心 | 15 | **42** | **57** |
| 年度有效阶段 | 46 | **149** | **195** |

区域组按性质分为 **37 行政涉及面、22 战时局部占领参考面、6 公司税收权范围、9 商贸与间接影响面、6 法律纸面声索、1 驻军周边参考**。全部是 **当代编辑用地理包围框定位的示意图形**，没有任何一块声称为经过配准的18世纪真实边境，**实际占领面积 km² 一律 null，禁止累加**。

用户可用既有时间轴和“版图”开关操控两个18世纪图层。数据中有过渡断点、占领中止、撤退后仅存纸面声索的对象：
- **1762/1763** 哈瓦那、马尼拉、马提尼克短占与归还；1763魁北克、佛罗里达和加勒比海殖民行政重排。
- **1765** 东印度公司孟加拉、比哈尔、奥里萨 Diwani 税收权扩大，分别绘为财政层，区别于直辖控制。
- **1774/1791** 魁北克法令造成的宽大法律声索与上、下加拿大成立后的分区。大陆原住民族与当地自治权不以这类区域面代表英军控制。
- **1776–1783** 英军在波士顿、纽波特、费城、萨凡纳、查尔斯顿、纽约的城市驻军按年进入/退出，与原殖民省淡面在1776后退出相配合。
- **1765–1774** Port Egmont真实英军驻守断开，1774后只剩法律声索虚线。
- **1788/1796/1799** 悉尼及诺福克岛殖民定居，锡兰沿海荷兰旧辖区由英东印度公司接管，迈索尔首府被攻占及瓜分关系，分别显示，不将澳洲大陆、康提内陆或迈索尔土邦误绘为已被英军逐地占领。

## 来源组（每个地图对象独立引用URL）
- [英国国家档案馆：殖民档案指南](https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/american-and-west-indian-colonies-before-1782)
- [英国议会：1763–1791英国北美殖民政策](https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/parliament-and-empire/parliament-and-the-american-colonies-before-1765/british-north-america-1763-91/)
- [1763巴黎和约全文（耶鲁Avalon）](https://avalon.law.yale.edu/18th_century/paris763.asp)
- [1783年和约（法国国家图书馆）](https://heritage.bnf.fr/france-ameriques/en/1783-peace-treaties)
- [美国国家公园局：独立战争事件时间线](https://www.nps.gov/waro/learn/historyculture/timeline-of-the-war-for-independence.htm)
- [英国议会：东印度公司成为税收与政治权力主体](https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/parliament-and-empire/parliament-and-the-american-colonies-before-1765/parliament-and-the-east-india-company/)
- [斯里兰卡国家档案馆：1796年荷兰沿海殖民地交接](https://archives.gov.lk/English/about-us)
- [英国国家陆军博物馆：1799年迈索尔首府攻陷](https://www.nam.ac.uk/explore/tipu-sultans-war-turban)
- [澳大利亚议会：1788年流放殖民定居](https://www.aph.gov.au/Parliamentary_Business/Committees/Joint/Migration/MigrationPathway/Report/Chapter_2_-_Migration_and_the_Formation_of_Modern_Australia)
- [诺福克岛澳联邦政府历史](https://www.infrastructure.gov.au/territories-regions-cities/territories/norfolk-island/history)
- [UNESCO冈比亚昆塔金特岛](https://whc.unesco.org/en/list/761/)
- [加纳国家博物馆与古迹委员会：海岸角城堡](https://gmmb.gov.gh/cape-coast-castle-cape-coast-1653/)
- [加拿大纽布伦瑞克大学图书馆：塞拉利昂公司及黑人定居者议会文书](https://loyalist.lib.unb.ca/record/sessional-papers-sierra-leone-co-270-1792-1801)
- [福克兰群岛官方档案馆：1774年英军撤离](https://nationalarchives.gov.fk/jdownloads/Mail%20Stamps%20and%20Telecommunications/Mail/MAI-STA-10-1.%20Early%20settlements%20issue%20late%201980.pdf)
- [马耳他大学：1794–1815年地中海英军驻岛](https://www.um.edu.mt/library/oar/handle/123456789/25181)

## 技术继承与地图表达
- 原第34批两个文件 **完全保留**：`data/eighteenth-century-dynamic-spatial-1700-1799.json` 和 `js/eighteenth-dynamic-spatial.js`。
- 新增 `data/eighteenth-century-mass-schematic-zones-1700-1799.json`（81区域+42核心）和 `js/eighteenth-mass-spatial.js`。都只在 `?review18c=1` 时绘制。
- 不修改主站默认最后已发布年份；18世纪试阅依旧隔离。
- `app.js` 已有四条18世纪动态重绘路径全部加入第二图层调用，并扩展地图点击拦截名单，确保点击区域展示历史依据而非底图查找。
- 不增加面积计算，不把英国海上船舶活动、商业势力、殖民制度立法或原住民土地统一涂成一种“英国领土”。
- 依据明确的起止年份动画；若一年内占领又失去，采用年末稳定状态，相关说明保留具体日期差异。

## 代码质量验收
- `scripts/test_18c_mass_spatial_81_42.js`：强制81/42/149及105/57/195，检查所有几何坐标、source_key、无面积、类别、历史断点、入口脚本与旧图层完好。
- `scripts/browser_18c_mass_schematic_81_42.py`：真实1780×1020桌面Chromium，13个抽样年份、点击史料、关闭开启版图、退回1572、在未开放预览模式确认隐藏。
- `.github/workflows/18c35-mass-dynamic-areas.yml`：Node语法/数据/来源/严格GIS、真实桌面浏览器、SHA稳定网页三道独立任务。
- 绝不合并 main。后续可用这些示意区域逐组替换经过独立验证的历史边界，**不以GIS精度拖延可视覆盖**。

## 额外审计规则
1. 每个Polygon名字都要含“参考”、“示意”或说明文案，具体文案在数据 note 和屏幕详情。
2. 独立区域数量是“地图可见对象数”，**不是统计意义上的英国实控行政区数量**。
3. 不足以支持英军长期驻扎的地点不要进入实芯；出现问题可将其降为贸易影响虚线。
4. 地图上呈现原住民或当地政治行为者时保留权属的单独数据，不使用英国图层覆盖并消除原住民视角。
