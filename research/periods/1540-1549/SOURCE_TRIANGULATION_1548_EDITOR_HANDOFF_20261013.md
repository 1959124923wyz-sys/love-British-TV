# 1540—1550年苏格兰战争历史地图：调查员交叉印证与制图准入报告

> 研究日期：2026-10-13。独立分支 `research/1540-1550-atlas-source-triangulation-20261013`。  
> 目的：核对其他智能体提出的具体书籍、地图、GIS数据能否成为可靠历史证据，**并标出正式第六章遗漏的英军据堡**。本支线没有编辑 `main/data` 和前端，不对任何史学候选做经纬度猜测或绘制英国占领多边形。

## 最关键的结论

**找到了真实、可在线阅读、比之前基于驻点画圆/凸包更有学术价值的两套军事驻防地图**：

1. **[Peter G. B. McNeill、Hector L. MacQueen主编《An Atlas of Scottish History to 1707》，1996年，第127—128页](https://books.socantscot.org/digital-books/catalog/book/25)**。原书由苏格兰中古史研究者编制；2026年苏格兰古物学会（Society of Antiquaries of Scotland）提供正式电子版，其「Events from 1460 to 1707」章节是访问入口。127页有1547年英军入侵图及总结，**128页是1547—1550年英军据点与1550年苏法据点的学术图**；并非准确年度英王领土边界图。旧ScotlandsPlaces转录已被搜索收录，**该网站自2025年6月24日起关闭**，不能拿它当可持续访问的在线地图地址，正式新下载入口为SocAntScot。
2. **[Penry Williams《The Later Tudors: England, 1547–1603》，Oxford University Press，地图6第40页](https://books.google.com/books?id=Njep2dFM6k0C)**。Google Books收录含40页预览，其他可检索书籍文本有地图题名及正文，描述苏格兰主要驻军。此书**强调驻军不是强制建立英格兰行政统治的同义词**；作者的政策价值判断需要与军事突袭、焚毁记录分开。不能将地图插图轮廓数字化为占地Polygon。

**[Siege of Haddington Research Group, *The Letham Gun Platform – The Preliminary Site Visit*，2022年35页](https://haddingtonshistory.org.uk/files/2022/11/HHS-2008-The-Letham-Gun-Position-Prem-Survey-Report-v3.pdf)**确实公开存在，原PDF已直接阅读：
- 印刷 **p.4，Figure 1**：现代英国OS道路底图+计划要塞星号+**可能的哈丁顿驻军影响半径大圆**。作者使用的措辞是军事上“expected to control”，不是已按1548年税册、驻军警戒体系测量的统治圈，更不等于地主土地契约或已知当地民政英占边界。
- 印刷 **p.32，附录2**：各型16世纪火炮**理论射程**圆与苏法营地位置示意，**绝不是英国实际占领区圆**。原报告没有16世纪该地域连续领土Polygon。
- 印刷 **p.26，结论**：2022年初步现场踏查**没有找到确证该候选地点受16世纪军队占用的证据**，要求未来地球物理探测或试掘。它既不能确认 Letham 拟炮台就是英国堡垒，也不能批量采集为真实军营GIS坐标。
- 印刷 **p.4—5**还引用CSP Scotland 228、229、230、253、295等政府公文作为具体1548筑堡和苏法围城史实的入口；报告说1548年围困中补给曾被敌军阻断。**这组原始文书是下一阶段最值得读的证据**。

## 三种书图之间，哪些事实已交叉印证？

| 主题 | Atlas 1996 | Williams 1995 | Letham 2022 | 评估 |
| --- | --- | --- | --- | --- |
| 英军不是占下整个苏格兰，而是驻堡推进 | p127—128地图+正文明确互相保护的英军堡垒构成拟议Pale | p40地图6标主要据点、正文把驻军与英国民政统治分开 | p4描述供给链、强迫盟友及围困 | **政策和据点网络高度一致**；不能推导完整紫色实控面 |
| 哈丁顿英军控制、苏法围城阻断 | p127—128 | p40主驻军之一 | p4—6引1548 CSP实录、围城、补给受阻 | **可作为有据控制城市与交战区**；不能把道路整段都涂稳固紫色 |
| 1547年英军据点分布不止东海岸 | p127明确英军同时入侵西南、年底Dumfries、Cockpool、Castlemilk、Lochwood有驻军 | p40主军堡地图须逐点核原图 | p4重点东洛锡安，没有全苏范围 | **原第六章主站遗漏巨大西南区域**，直接打开新的考据路径 |
| 1548 East Lothian 是否Saltoun、Ormiston、Yester、Dalkeith英占 | p127称1548英军夺取前3处 | p40需对照图符号位置 | p4称1548英军强化Yester、Dalkeith、Lauder，且当地苏格兰抵抗激烈 | **有战时英军控制事件线索**，但多次易手、年末仍属英军不成立的可能非常大 |
| Balgillo和Broughty | p127说英军筑新Balgillo堡，p128图标旁OCR出现“Feb 1549” | p40另核 | HES官方先夺Balgillo北翼再迫Broughty在**1550年2月**投降 | **可能是OCR将图注错位，也可能地图自有矛盾**。不把“1549”录入数据库，须检查第128页原图的括号究竟属于哪方驻点，优先用HES/1549—1550当代信函 |
| Fast Castle | p127称1549另修新堡 | p40未核此据点 | 19世纪苏格兰地名志另说1548已被苏格兰收复 | **时序高风险冲突**，或存在英方不同阶段重新驻军；没有1549年末原档不可上色 |
| 爱丁堡 / 利斯 | p127提1544年袭击 | 旧p40驻军图非爱丁堡实际占领图 | 1544英军袭击与1548东洛锡安威胁叙述明确不同 | **1544焚掠、1547追击靠近城门、1548英国军事Pale**需按事件、军事驻堡、城镇实际统治分层 |

**结论**：这些书有同一个史实骨架，但相互引用某些经典文献（如Merriman、Bush、CSP Scotland），**“三本书都这么说”不等于三个独立原始证明**。逐处真正坐标与年末控制仍须查英、苏双方当年军政信件。

## 新增关键地理缺漏与时序审查

现行第六章 `main/data/military-control-points-1540-1549.geojson` 经GitHub远端读取有**15个年末驻点**，其中英驻苏格兰点未包含多数下列地点；已另存结构化研究清单 [ATLAS_1547_1550_GARRISON_CROSSCHECK_20261013.json](ATLAS_1547_1550_GARRISON_CROSSCHECK_20261013.json)。

**第一组（P0）：1547西南苏格兰英军驻点**
- **Dumfries、Cockpool、Castlemilk、Lochwood**：Atlas p127直接声称1547年底有英军据驻；另有RCAHMS 1920年邓弗里斯历史调查独立明确述Castlemilk于1547年9月归顺英军、Lochwood驻英军，并强调**郡界“纸面臣服”不等于各城堡全部落入英国**。千万不要把整个Dumfriesshire整片涂紫。
- Castlemilk是邓弗里斯郡当年的城堡，**绝不能将同名现代格拉斯哥 Castlemilk 社区当英军营**。Cockpool、Lochwood历史实体需要后续查地名和古迹保护编号，缺真实堡址不擅自给经纬度。
- 另注意原Atlas说1544—46英军“暂时占”Caerlaverock、Threave、Langholm，而RCAHMS记**1547年Caerlaverock和Lochmaben仍为苏方**。不同年份、多轮易手完全可能同时成立，不能误判二书矛盾，也不能推延到1547年末英国占领。

**第二组（P0）：1548年东洛锡安英军驻堡、降服与恢复**
- **Saltoun、Ormiston、Yester、Dalkeith**：Atlas与Letham报告都有驻守／强制关系的书证，1548早些时候苏格兰摄政政府攻回 Ormiston/Saltoun 的编年材料使**1548年末真实英军控制状态未获证明**。
- **Balgillo**：与Broughty分开记录英军外围工事、苏法占外堡次日主堡降服。HES官方发生于1550年2月，与Atlas图 OCR 的“1549”不一致，下一步阅读原印刷图并比对HES史料方能确定具体日期。
- **Fast Castle**：1996 Atlas与19世纪地名志出现1548／1549阶段不一致，优先回到当年军报，否则不上1549英军紫色。

**第三组（P1）：1544—47短期控制但非今后永久据堡**
- **Caerlaverock、Threave、Langholm**：仅提供历史控制候选，不保证哪一年底仍英占。
- **Letham候选炮台**：SHRG的实地结论为尚无16世纪军事占用的确证；只保留“可能炮台”历史调查条目，不创建“1548已证实炮台”Point。

## 三种必须避免的制图假象

1. **圆半径 ≠ 实际统治范围**：Letham的Figure 1大圆是预期影响尺度，不是从16世纪城堡警戒台账绘出的英军控制边线。p32炮火射程更不是占领线。
2. **城堡相互联系 ≠ 稳定控制中间村落**：东海岸交通在遭苏法骑兵截断的月份不畅通，不能凭交通轴无限紫色实心涂到爱丁堡。
3. **1547围场地图 ≠ 1548、1549的同一刻地图**：书图是跨数年事件的合集，1550法苏复得要塞应通过每座堡垒退出日期实现年末动画，而不是全图复制一个现代行政区形状。

## 版权与现成地图技术

- [苏格兰古物学会正式电子版](https://books.socantscot.org/digital-books/catalog/book/25)页面标 **CC BY-NC 4.0**，而[原出版社Scottish Medievalists使用说明](https://scottishmedievalists.com/atlas-of-scottish-history-to-1707/)仍要求重印/改编地图向版权受托人申请许可。**两方公开说明目前不一致**；主编若要在公开地图直接复制/描绘原图线条，应先厘清授权。研究人员目前只抽取可引用的历史事实与地点，不直接上传1996年带版权的地图扫描图。
- `Cliopatria`：Seshat正式GeoJSON，`FromYear`/`ToYear`时序，官方GitHub `LICENSE.md`确认**CC BY 4.0**。适合1500—2024年的**粗粒度政治主权底图**，但不等于每一年的16世纪军事活动精准边界。
- `CShapes 2.0`：美国国会图书馆清楚标明1886—2019年国家及属地GIS。另有R包GPL许可，但**R软件许可≠所有相关地图库分发许可自动可视为同一许可**；外用时要按选定文件核对。它不覆盖1500—1885。
- `OpenHistoricalMap`：官方宣称通常CC0，但部分历史地物带特定公开许可证标注。可选定小型古堡和已有明确历史日期的地点，不能拿完整数据库当全时段数据无遗漏的世界图。
- `History Atlas`：有公开GitHub软件仓库 [Laurence White / history-atlas](https://github.com/laurencefwhite/history-atlas)，它自述来自Cliopatria；另有[daiyip/atlas](https://github.com/daiyip/atlas)的MIT代码。**可公开访问代码，不自动意味着可不看许可复制所有软件、配图和第三方地理数据**。与另一位同事“没有开放代码”的绝对表述有出入，应先确认具体项目授权。

## 已证实的访问入口

| 资源 | 原始有效入口 | 本轮核查级别 |
| --- | --- | --- |
| 1996苏格兰历史地图集 | https://books.socantscot.org/digital-books/catalog/book/25 | **原出版社/正式数字馆上线、p127及128搜索版文字/图例确认**；图像轮廓未逐点配准 |
| OUP Williams | https://books.google.com/books?id=Njep2dFM6k0C | 原书书目/页码与可搜索正文相互核对；原地图未做GIS测绘 |
| Haddington研究报告 | https://haddingtonshistory.org.uk/files/2022/11/HHS-2008-The-Letham-Gun-Position-Prem-Survey-Report-v3.pdf | **原35页PDF直接读过、图1及p26结论检查** |
| NLS军事地图项目 | https://blog.nls.uk/scotland-defending-the-nation/ | 国家图书馆自述查核，确认1540年代军事地图原件类别 |
| 大英图书馆手稿 | https://searcharchives.bl.uk/catalog/040-001101921 | 原件官方**目录**已核，手绘稿正页尚未亲阅 |
| 旧ScotlandsPlaces | https://scotlandsplaces.gov.uk | 自2025-06-24关闭；不作为正式后续可持续地图入口 |

## 下一步优先查什么

- **P0**：读取官方版Atlas第127、128页*原印刷地图图例、比例尺、符号*，逐点核对城堡名称、是否“1547—1550 English strongpoint”或“1550 Franco-Scottish strongpoint”。疑似1549 Balgillo/Broughty标识先做图例消歧，不允许将搜索OCR直接用作程序日期。
- **P0**：按SHRG p4–6给出的`Calendar of State Papers Scotland`文献页码228/229/230/253等直接追溯英国驻军1548—49实际控制；尤其Saltoun/Ormiston/Yester两次以上易手、Castlemilk/Lochwood 1547年末驻军，Fast Castle 1548或1549。
- **P0**：用国家档案和苏格兰历史环境局古迹记录锁定西南Cockpool、Castlemilk、Lochwood、Yester、Saltoun等**正确的历史堡址**；此时才可提交新的Point及战役年末进退，不能将现代同名镇中心当军堡。
- **P0**：先修补跨苏格兰东岸与西南部的实际英军驻防清单，再做军事路线关系图。**不增任何未获认证的1548英王Polygon。**
- **P1**：Cliopatria按`FromYear`/`ToYear`抽出英格兰/苏格兰/法国/爱尔兰的1500、1547、1548、1550、1558、1707等年份，检验其是否误判领土/遗漏属地；CShapes只用于1886年以后，现有前端不能不经审核整库导入。

**研究员工作边界**：只把新来源、交叉校验结论和候选据堡保存在独立支线供主编择证。暂无手稿直接全面阅读、无GIS古代真实外缘实测、无网页/主站功能改动、无GitHub Actions手动派发。
