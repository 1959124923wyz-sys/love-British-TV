# 🐍 第二阶段专题：英国侵入、军事占领与殖民暴力的地区说明缺口

**2026-10-15｜蛇B独立风险审查｜1497—1599**

## 核心发现（影响观众阅读，而非坐标误差）

用户截图：爱尔兰科克附近淡红色虚线圈内一个数字“3”。实为既有`data/tenth-invasion-impact-areas-1580-1583.geojson`对应的芒斯特德斯蒙德战争入侵/破坏地理示意；相关数据原本有`summary_zh`、有可复核的学术及官方史料来源、按1580与1581—83分年。**错误不是完全没有研究内容，而是轮廓与历史资料之间缺乏高可见性的链接。**数字“3”是事件聚合数量，不能代表3处占领或3次屠杀。

基础地图此前支持点选线面打开详情，但大范围低缩放、事件数字主标记、现代底图和多层地图点击顺序容易使用户看见“面”却不理解意义。原代码点击背景的`openMapTerritoryAt()`优先只查1540年代军区和政治参考面，没有遍历1580芒斯特、1586港市、1590九年战争和其他部分独立影响面；当浏览器点击落到SVG容器/重叠层时，可能改开政治底图或不打开该面对应资料。**本轮修复了该缺口**，同时避免把地图坐标或轮廓改成伪精确历史边界。

## 改造一：侧栏“地区与军事影响”（所有年代自动联动）

`index.html`新增隐藏条件驱动的可展开地区列表；`app.js`仅列**当前所选年份已生效且相应图层开启**的空间对象，按源数据动态生成。
包含：
- 1540年代英军具名驻堡、英苏交战区与军队行动关联线；
- 1560年代霍金斯非洲奴隶掠卖沿岸活动带（归“事件”，并非英方疆域）；
- 1580—1583芒斯特英军入侵/战争毁坏面；
- 1584—1589芒斯特没收土地政策区、德雷克攻击港市区域；
- 1590年代Pale研究地理参考、九年战争冲突与爱尔兰反抗范围、特立尼达1595短时武装行动区；
- 本轮新增加的苏格兰、爱尔兰、巴拿马六处研究性战争与殖民地区。

列表每个条目都有标题与简短原因文字，点开后显示参与主体、事件及可点击出处。现存来源对应条目直接复用资料，无需再写一套脱节的信息文案。

**交互契约**：列表不改变地图年份、不新增第三个图层开关；关闭“版图”后相应军事地区从列表退出，打开后恢复；未来事件不得提前出现。带年份的土地政策仍不是实际没收地块面积，放射圆也非军队行政边界。

## 改造二：新增六处*有文献证实的地区性叙事*（并非六片精确占领区）

| 年份 | 区域 | 历史事件及空间语义 | 主证据 |
| --- | --- | --- | --- |
| 1544 | 苏格兰利斯—爱丁堡 | 英军登陆、袭城、焚掠（单年度区域参考，不是英军长期占有的爱丁堡） | [Scottish History Society, 1544 Burning of Edinburgh](https://www.scottishhistory.org/on-this-day/the-burning-of-edinburgh-1544/); [Historic Environment Scotland, Rough Wooing](https://blog.historicenvironment.scot/2022/07/the-story-of-scotlands-longest-siege/) |
| 1556—1569（展示时段） | 莱伊什—奥法利 | 土地夺取与殖民安置政策地区，O’More/O’Connor反抗；**图层下架不表示历史政策结束** | [Laois County Council, Fort Protector Conservation Plan](https://laois.ie/sites/default/files/2024-10/Fort-Protector-Conservation-Plan-FINAL-ONLINE-1_2.pdf); [Dictionary of Irish Biography, Rory O'More](https://www.dib.ie/biography/omore-o-mordha-rory-ruaidhri-og-a6909) |
| 1572—1575 | 阿兹半岛 | 托马斯·史密斯王室特许殖民队伍登陆、与当地势力交战、定居计划失败；不是半岛英军稳定统治 | [DIB, Sir Thomas Smith](https://www.dib.ie/biography/smith-sir-thomas-a8152); [CELT / UCC, 1572殖民招股宣传原文](https://celt.ucc.ie/published/E570001-001/text001.html) |
| 1572 | 巴拿马诺姆布雷德迪奥斯 | 德雷克**未成功夺取**港市财库的袭击，只示意遭袭港市位置，1573驮骡商队劫掠另有记录 | [Library of Congress, Drake's First Success](https://www.loc.gov/collections/sir-francis-drake/articles-and-essays/drake-biography/drakes-first-success/) |
| 1573—1575 | 阿尔斯特东北部克兰德博伊—卡里克弗格斯 | 埃塞克斯殖民武装企图入侵、地方抵抗、诱捕奥尼尔及杀害随从；计划未形成稳定全域控制 | [DIB, Walter Devereux](https://www.dib.ie/biography/devereux-walter-a2554) |
| 1575 | 拉斯林岛 | 英军在守军投降后杀害守军和避难平民，突出岛屿的袭杀事件而非英国永久殖民界线 | [DIB, John Norreys](https://www.dib.ie/biography/norris-norreys-sir-john-a6234); [DIB, Walter Devereux](https://www.dib.ie/biography/devereux-walter-a2554) |

这些数据均在`data/early-war-colonial-impact-1544-1575.geojson`，有`source_urls`及能回到既有正式章节的相关事件ID。所有多边形明确`historical_boundary_confirmed:false`、`territorial_claim:false`、`area_sqkm:null`，禁止自动计算殖民占领面积。线面仅服务城市/地区级读者理解，不是恢复16世纪军事战略图。

## 改造三：三条西非霍金斯沿岸区不再共用套话

既有`data/eighth-enslavement-coastal-activity-1560-1569.geojson`三个Feature原来有具体史料编号，但**没有各自的`summary_zh`**。右侧所有沿岸层入口都固定写“霍金斯船队在相关西非沿岸进行人口掳取、贩卖和强制装运活动”，使1562—63首次航次、1564—65 Cap Vert贸易与掳人企图、1567—68村社袭击被错误感觉为同一性质和范围。本轮给三条分别补综述，保留其历史来源及重要不确定性：不根据英方自述人数复原逐村损失，不把整个海岸划作英王占地。

## 自动验收与防回退

- `scripts/test_historical_region_guide.js`：检查六处新Feature年份进退、有合法坐标、**但不代表历史精确边线**、有可核验证据和禁止算面积标识。
- `scripts/browser_regional_stories.py`：用真实Chrome按1544、1556、1572、1573、1575、1580、1582、1586、1598年逐年核查地区条目；抽样点选地区、核查资料正文和外部来源链接；关闭“版图”后观察相应入口是否退出。
- `.github/workflows/snake-regional-stories.yml`：独立部署式测试，截图及工作流产物便于主编视觉核验。
- 必须等待主项目原有`Approved map UI contract`与桌面浏览器回归也通过，方可合并正式生产网站。

## 第三批候选：已调查但**本次故意未凭空涂面**

1. **1573年巴拿马地峡掠金银队**：LoC证明德雷克与法方/脱奴非洲人社群等参与行动，但史料不能支持“一整条巴拿马运河走廊被英国长期占领”。应优先现有点与路线，在原始地名链明确后再加军事行动连线。
2. **1562—63勒阿弗尔英军短占**：已有正式驻军点和1563撤离；值得检查是否还缺港市的独立可读地区资料卡，但**不能当作整个诺曼底归英王**。
3. **1596加的斯袭击**：已入第十一章事件与路线研究方向。候选增加可点击港市级影响符号，但需先确证城市袭击、后果与短时英军在城内活动的来源细节，不能简单把整个加的斯湾涂英占。
4. **西非贸易港与大西洋奴役网络**：避免把英国人与当地非洲政治经济主体的接触等同于英格兰主权；真实贸易货币与人员运输节点更适合点线图。

## 后续独立审查原则

**“真正占领区”要有实际驻军/行政证据；“入侵影响区”可以是概略的有据区域，但不可用一条虚线暗示圈内每一个村落都受灾。**

不因内容批判殖民而推高伤亡或扩大领土。要先让已有历史资料在地图上读得见，再扩充新的示意面。与主编/维护智能体协调后才正式合并。


---

## 第二批扩展：1562—1596（2026-10-15续查）

对上一批发现的地区介绍失联问题做了新的史实扩展。本批新增六个**现有事件有明确文献而地图尚缺地区化说明**的视觉参考面，存放在 \`data/followup-regional-stories-1562-1596.geojson\`。不重复修改原Atlas已发布的事实与历史统计，不宣称这些多边形是英军真实控制边界。

| 时间 | 位置 | 类型与必须保留的警示 | 已有史料 |
| --- | --- | --- | --- |
| 1562年末 | 法国勒阿弗尔 | 英军进入并治理港市的短期**真实驻城记录**。概略紫面不是英军所控制的具体地块、城墙或诺曼底全部疆域。 | 勒阿弗尔市政档案官方年表1562条、MacCaffrey 1997期刊研究 |
| 1563年末 | 勒阿弗尔 | 法军经过围城，于7月29日收复港市；用**蓝色收复状态**避免英军短占延续到1563年末。市档同时记载英军破坏当地教堂。 | [Archives du Havre](https://archives.lehavre.fr/vie-militaire-et-conflits-depuis-1548), [当年围城图档案](https://archives.lehavre.fr/document-archives/plans/plan-dit-warwick-pendant-le-siege-du-havre-15-juillet-1563) |
| 1573 | 巴拿马地峡 | 德雷克与法国Le Testu、当地反奴役Cimarron相关行动参与者截获西属殖民地金银骡队；地区示意**不是连续英国占领走廊**。 | [美国国会图书馆1572—1573研究](https://www.loc.gov/collections/sir-francis-drake/articles-and-essays/drake-biography/drakes-first-success/) |
| 1587 | 加的斯港湾 | 德雷克对舰船的袭击，考古确认热那亚商船Delta II当年沉没。**不是夺取整个加的斯城市；不能和1596行动合并**。 | [安达卢西亚政府2026年水下考古公告](https://www.juntadeandalucia.es/organismos/culturapatrimoniohistoricoydeporte/servicios/actualidad/noticias/detalle/657958.html) |
| 1589 | 西班牙维戈 | 英军对城镇民居、仓储、船舶及宗教建筑发动袭击与纵火；存世当地神职人员记录涉及的毁坏数量应以原作者自述为限，不是独立核准的所有居民伤亡统计。 | [维戈市政府历史栏目](https://hoxe.vigo.org/movemonos/phistorico_sen_defensas.php?lang=en), [市政古堡历史展示](https://fortalezadeocastro.vigo.org/panel-10/) |
| 1596 | 加的斯 | 英荷联合军队短暂攻城与洗劫，英格兰不是唯一主体；英军撤离后无持续殖民治理，不应让1596面延续至1597。 | [牛津博德利图书馆研究](https://blogs.bodleian.ox.ac.uk/theconveyor/the-cadiz-pirates/), [荷兰国立博物馆当年海战图](https://www.rijksmuseum.nl/en/collection/object/Zeeslag-voor-Cadiz-1596--41712acecec44b19094c6a2d35f142b9), [Royal Museums Greenwich 1596手稿登记](https://www.rmg.co.uk/collections/objects/rmgc-object-504863) |

### 完成对Codex P1/P2同行审查意见的针对修复

- **P1**：莱伊什—奥法利的1556年殖民制度与地方抵抗不会因切换到1570年无故失去空间参照。修改\`end_year:null\`＋\`display_through_year:1599\`＋\`ongoing_at_atlas_end:true\`：仅表示在本项目末年保留已发生制度后果的读图参考，**不代表1556—1599间每个年份均持续在同一地区发生军事事件，也不代表政策恰好于1599年结束**。依据为Laois县议会《Fort Protector Conservation Plan》记载1570年代仍抵抗与殖民压力。
- **P2**：地图及侧栏对殖民政策范围统一使用\`land-dispossession\`类型，不再把阿兹与莱伊什误标为“英军入侵影响区”；1563年勒阿弗尔复归法国另外使用\`restoration\`类型。
- **P2**：1544年利斯—爱丁堡城市袭击示意与原正式事件\`1540S-008\`建立\`related_event_ids\`联系。该正式事件原本概括整个苏格兰多处战争与焚掠，刻意保留\`lat:null/lng:null\`和既有35处定位总数，避免把一场广域战争不当地强塞到爱丁堡现代市中心；用户可通过地区导览进入城市史料。

### 新一轮红队检查

- 新增\`scripts/test_followup_regions.js\`，对六个资料卡逐条验证年份、独立来源号、关联正式历史事件、可点击机构文献URL、虚线闭环、拒绝把示意面计算为真实占地。特别断言：1562英军勒阿弗尔驻城→1563法军收复；1587加的斯港湾舰船袭击≠1596加的斯城市攻掠；1589维戈当年显示而1590退出。
- \`scripts/browser_regional_stories.py\`的Chrome真实交互验收扩展为1544、1556、1562、1563、1564、1567、1572、1573、1575、1580、1582、1586、1587、1589、1596、1598等年份的地区入口和中文资料卡核查，并验证1570/1599殖民参考持续、1597加的斯袭击退场。
- 每次PR运行须同时满足原有\`Approved map UI contract\`和\`Desktop atlas browser smoke\`；CI证据留存在Actions，尚未合并到主站不构成用户网站已更新。

### 第三批后续优先候选

暂不绘制：1573巴拿马金银运输与中立第三方的全部地峡行动精确道路；1589维戈每一间被毁房屋；1596加的斯每一栋建筑损失。这些与直接城市/区域级叙事的观众收益不成比例，又缺可靠可复核的实测数据。未来优先寻找具备独立地点、年份、后果、权威来源的1650年代以后的地区性殖民 violence（当前1497—1599段后续计划）及已有早期遗漏事件；不靠“数字较少就多涂红色”推动。
