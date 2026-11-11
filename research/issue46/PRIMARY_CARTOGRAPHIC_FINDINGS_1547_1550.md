# Issue #46｜1547—1550 英苏战争地理：首次确认可复核的原时代堡垒图纸与测量来源
研究日期：2026-10-13。**研究分支，不改 main / data / app.js。Issue #46 尚未满足“至少1片完整地理配准实控Polygon上线”验收。**

## 本轮核心突破（之前的任意缓冲区不能替代）
**1. 史料原图集合定位到具体档号：NRS RHP 6075（Belvoir Castle 同期英军平面图的摄影复制品）**。爱丁堡大学博士论文《Guns in Scotland: the manufacture and use of guns and their influence on warfare from the fourteenth century to c.1625》第490页脚注105明确说，1540年代英军堡垒 **Broughty、Dunglass、Eyemouth、Lauder、Roxburgh、Fast Castle及一处未识别堡垒** 的同时代原图保存于 Belvoir Castle，摄影复制件在 Scottish Record Office/National Records of Scotland **RHP 6075**。这是最有希望集中攻破多处真实几何的档案，而不是单一城堡二手图片。
- 博士论文原文定位：https://era.ed.ac.uk/bitstream/1842/6848/2/253253_vol2.pdf （约第490页；博士论文的来源作者、页码及原图来源需单独登记；原档图像本轮未获得）。
- 爱丁堡大学论文元数据：https://era.ed.ac.uk/items/baa888ae-d8ec-40ec-bff1-f375cfd527bb/full
- HES/Trove另行确认该档号为 “RHP 6075 Mid-16th Century, Belvoir MS - photostat copies of plans”：https://www.trove.scot/place/58412?page=2&tab=related-archives
- NRS持有RHP并说明访问原图需要预先请求/版权核对：https://www.nrscotland.gov.uk/learning-and-events/research-guides/maps-and-plans/?section=access-to-maps-and-plans

**2. Roxburgh 真正能用于逐年英军占地的原时代堡垒轮廓具有双重校验基础。** 1547年10月15日英国 Lord Grey of Wilton 致信附 William Ridgeway 的要塞工程图（Belvoir、RCAHMS 1956 Fig.517）；苏格兰皇家历史古迹机构 2006—2009 年以 **差分GPS测量+地形扫描+GIS叠合原图** 区分中世纪旧城堡与1547炮兵堡。机构文字明确给出**1547炮堡围界约110米×65米**，位于整个中古旧堡内侧，旧城堡的主体山脊范围约320米×140米。这是**真实考古结构/边界对应**，不能把整座古堡保护区/OSM草坪替成1547英国统治Polygon。
- HES/Canmore原始地点叙述和2006–2009 GIS现场报告：https://canmore.org.uk/site/58412/roxburgh-castle
- 官方考古摘要 https://i.rcahms.gov.uk/canmore-pdf/WP00005062.pdf
- HES法定保护区 SM1718：https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,SM1718 。**保护区GIS边界≠1547炮堡范围**。
- NRS RHP6075 取得扫描件及 2006–09 GPS/GIS画好的炮堡独立围界后，优先配准实测Polygon。现在尚未获取可直接公开重绘的外围顶点/坐标/原图许可，故**不能填充，也不能据110×65米人工画矩形**。

**3. 1547—1550年“军控网络”地图数据及各年状态已有学术依据，但没有实际连续战线。** McNeill/MacQueen《Atlas of Scottish History to 1707》英苏 Rough Wooing 地图集，p.127–128：英军1547年的东岸与西南入侵、1548年扩展到Haddington/Saltoun/Ormiston/Yester并修筑Lauder等、1548年9月Dunglass、新建Fast Castle 1549，以及法国/苏格兰反攻与1550年3月英军残余据点。文内明确把互援要塞网络称为英军构想的**pale**，它不等于经丈量的行政连续“边疆线”。
- 地图集可阅读：https://books.socantscot.org/digital-books/catalog/book/25 （CC BY-NC 4.0，正式网站的实际绘图许可须另审，不直接复刻图板）
- 旧ScotlandsPlaces索引（网站已经下线，不作为当前可访问图像URL）：https://scotlandsplaces.gov.uk/digital-volumes/published-gazetteers-and-atlases/atlas-scottish-history-1707/atlas-scottish-history-1707
- 出版物 p127–128 的“堡垒点+攻击方向”**不能做面插值、凸包或任意buffer**。数据可用于证明据点拓扑以及是否仍英军持有。

**4. Eyemouth 必须纠正错用遗址：**
- 1997 Caldwell/Ewart 考古论文在 Eyemouth NT943649 分别发掘第一阶段**1547英军防线**及**1557法国新防线**：https://doi.org/10.1179/pma.1997.002 ；1980年初期英军土垒、壕沟和外壕考古摘要：https://www.archaeologyscotland.org.uk/wp-content/uploads/2022/05/1980.pdf
- NLS指出当时存在带比例尺的早期要塞平面图：https://blog.nls.uk/scotland-defending-the-nation/
- 但英国图书馆 **Cotton MS Augustus I i 60 是1557年法国驻堡时期的图**，不能倒当1547英军城墙：https://searcharchives.bl.uk/catalog/040-001101839 ；SCAPE同指这张图日期1557：https://scapetrust.org/the-next-generation-of-eyemouth-explorers/
- 主站英军Eyemouth图层引用 **HES SM4577 Corn Fort**需核对：HES官方称该遗址在 NT94002 64985，系**ESE约250米以外炮兵堡旁边另一处可能中世纪的海角工事**，并非1547英军埃茅斯主堡测绘范围：https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,SM4577 。**严禁将SM4577保护地形状冒充1547英军炮台**。

**5. Haddington 实控城区有确证但失传的同期外墙图未取得：**
- 已有考古专题研究显示1548—1549英军驻城及法苏围攻，有现代航拍推定墙线，但不能声称古壁复原已考核。
- 学术论文：https://doi.org/10.1163/157407709X12634580640416
- 博士论文同上p490明确说当时Haddington堡完整原图“不存/未找到”，现代也无明确痕迹，城防四角堡仅文献重建。
- Haddington独立研究小组2021公开征求失传要塞平面图：https://www.tudorsociety.com/the-search-for-the-lost-haddington-plans/
- 另可查看当地研究者论文附录C–F推断图，**不能直接升格为考古确界**：https://haddingtonshistory.org.uk/files/2022/12/HHS-204-Whitecoats-Rascals-Complete-compressed.pdf

## 1547→1550真正年份逻辑（需编辑通过后纳入）
- **1547 年末**：英国短期驻军据点分布于东部 Eyemouth、Hume、Roxburgh、Broughty/Inchcolm 以及苏格兰西南 Dumfries/Castlemilk/Lochwood 等。Roxburgh须补入主站当年的有效军事地点记录（不能认定旧城堡全境为1547新英占）。**Pinkie取胜≠英国占领Edinburgh。**
- **1548 年末**：Haddington、Lauder、Dunglass、Broughty、Eyemouth 等要塞体系是持续英军军控结构；Hume/Hailes 当年先被英军取得后又被苏军收回的军控时序必须分别核证；主站现有例子不可据一点扩展至所有East Lothian。
- **1549 年末**：Haddington 1549 已撤；英方要塞网络大为收缩；Roxburgh具体拆除生效与1550法约逐日查证，不能简单靠出版地图的图例推出12月31日精准日。
- **1550**：布洛涅条约后的苏格兰驻军撤离。Roxburgh、Eyemouth先前英占终止；1557的Eyemouth新堡是苏法军队，不是英国旧堡复活。
- **“前线”性质**：一系列有日期的离散要塞和敌对周边地区构成**军控网络/变动战区**，目前**没有经验证、可画满整个英苏边界的连续线**。在取得史图、逐地实占分界前，不能把英军所称pale涂成全部法定英属领土。

## 最紧迫下一道门槛及已有归档索引
1. NRS RHP6075：逐幅索取Broughty/Dunglass/Eyemouth/Lauder/Roxburgh/Fast Castle的数字影像、比例尺与许可（英国图书馆另查Cotton藏图）。
2. HES 2006—2009 Roxburgh GPS/GIS 1547炮堡实际轮廓数据或测绘图：**优先打开第1片真实Polygon的唯一可审计方案**。获取后需地理控制点清单、配准残差、已知误差、许可、1547–1550有效时间和影像版本。
3. Eyemouth Caldwell/Ewart 1997图纸核第一期1547英军土垒及第二期1557法国扩线；不能直接画同一轮廓跨1547–1559。
4. Haddington 1548推定城防可作 **contested/reconstruction** 独立虚线，不许实色围墙；修正其已被2021研究证实失传的“原图已取得”错误。
5. 更详细堡垒状态参见本目录 `CONTROL_EVIDENCE_1547_1550.json`。P0保持开放：***找到原图及GIS测量的档案线索≠拿到了可发布的实控GeoJSON***。

## 交给主编的不可误读结论
本轮已摆脱“只有地名、战役点和任意圆圈”的困境，真实锁定**Belvoir原图→NRS RHP6075影印→Roxburgh实测GIS叠合**可复现研究路径。***但是尚未完成实际古堡边线数字化审核，因此Issue #46仍不得关闭。*** 这份独立研究资料不变更官网地图；建议直接优先处理Roxburgh而非胡乱拉大英军连续紫色占领面积。