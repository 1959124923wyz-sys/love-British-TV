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
