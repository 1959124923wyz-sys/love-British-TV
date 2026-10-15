# 爱英TV｜1584—1589年土地剥夺、殖民庄园与1586年加勒比劫掠——区域面研究包

审核日期：2026-10-15；成果：`data/tenth-land-dispossession-and-raids-1584-1589.geojson`（3幅图，按历史时序仅展示当年有关面）。

## 历史研究：两种不同的殖民暴力

### A. 芒斯特土地没收调查→殖民庄园方案（1584—1589）

- 1584年开始调查德斯蒙德起义后宣布没收的土地；调查工作延续到1585—86年，现存资料很不完整，原拉丁调查资料的一部分毁于1922年都柏林四法院火灾。英国王室并未因此在1584年实际占有调查所及的每一块田地。证据：University College Cork, CELT `The Desmond Survey`, introduction, https://celt.ucc.ie/published/E580000-001/text004.html（仓库来源 C10-S05）。
- 1586年6月27日王室殖民地契条款规定若干种庄园面积档次（12,000、8,000、6,000、4,000 acres）、租金和限制特定爱尔兰人士承领的条件。这是**法律计划的条款**，并不是已经完成地籍测量或者租金实际征收入账。证据：UCC CELT `The Desmond Survey`, original royal articles ¶365—373, https://celt.ucc.ie/published/E580000-001/text005.html（C10-S69）。
- 1588年已有英方殖民庄园分配，但实际执行少于规划；具体人数等差额参见 C10-S70，须对比英王实际授予的档案记录，不能从申请名单推算殖民人口或实际占地面积。
- 1589年 Francis Jobson 的 `The Province of Munster` 是后续精确地理重建的优先史料，但目前资料显示其档案目录和研究讨论，**尚未在本项目数字化并独立交叉验证每一条原始地契界线**：https://doi.org/10.7486/DRI.rb69b272p（C10-S06）； https://www.cambridge.org/core/elements/decolonial-deep-mapping/796ACC5FC33F7406F9F41435BD8DB2E0 （C10-S08）。

地理画法：1584—1589年延用本项目已有、显式不代表实测历史边界的`1581—1583芒斯特概略区域研究面` **同一个粗略多边形**；改为暖赭色虚线和浅填充，用作**王室土地调查与殖民政策发生地理范围的定位参考**，而不是没收庄园地块、英格兰人口定居区、已授土地实控范围或面积统计依据。按年份分四个内容阶段：1584—85调查、1586—87殖民分封政策、1588实施差距、1589庄园地图。改变的是公共详情文字和本年允许显示的来源，不捏造逐年领土增长。

### B. 德雷克舰队攻占港市与勒索赎金（1586）

- 美国国会图书馆 Kraus Collection `The Caribbean Raid`：https://www.loc.gov/collections/sir-francis-drake/articles-and-essays/drake-biography/the-caribbean-raid/ 对1585—86年航次及圣多明各、卡塔赫纳抢劫和赎金有历史叙述，其中给出 25,000 与 110,000 杜卡特金额。两笔历史货币**不转化为现代净利润、英王财政收入**，具体后续分配和价值待独立审计。
- 西班牙文化部贵族历史档案馆保存1586年腓力二世签发追击德雷克的命令，其文字提及德雷克劫掠、勒索圣多明各（与英方战果叙述独立交叉印证）：https://www.cultura.gob.es/cultura/areas/archivos/mc/archivos/nhn/destacados/documentos-destacados/drake （C10-S09）。
- 多米尼加共和国国家总档案馆有1586年4月17日相关袭城及火灾报告的档案目录；目前项目只检查到目录，未核对报告全文：https://colecciones.agn.gob.do/opac/ficha.php?codopac=OP003&idpag=2144141705&informatico=00071107PI （C10-S10）。
- 卡塔赫纳历史博物馆（Museo Histórico de Cartagena de Indias）对1586年城市遭袭、勒索、焚毁以及六周左右临时占据有详细地方史叙述：https://www.muhca.gov.co/cartapedia_plano-del-asalto-de-drake-a-cartagena-de-indias-1586-8 （C10-S11）。其中使用的1599年印刷木刻不是1586年的精确城市边界GIS。
- 西班牙PARES馆藏目录收录当局关于1586年德雷克袭击圣多明各与卡塔赫纳的信件：https://pares.cultura.gob.es/ParesBusquedas20/catalogo/description/127430 。部分文献日历日期不完全一致，项目**只按1586年显示**，不无据细分至某日。

本次港市画法：在原第十章已有事件坐标`1580S-E019`圣多明各和`1580S-E020`卡塔赫纳周围绘制 **约0.11经纬度宽的定形椭圆示意面**，淡红色填充、虚线边界，保持港市事件图标及原有航迹可点击。**椭圆只起视觉定位效果，顶点不代表城市当时城墙、英军的真实登陆范围、烧毁街区、被征赎地理界线、经济损失面积或永久英国统治**。资料卡引用港市档案来源。1587年自动消失——不表示港市的社会经济创伤于1586年完结。

## 数据与交互原则

- 两条主线与1580—83战争示意为**不同性质**，不把土地剥夺政策区域画成占领区：warm ochre = 查没土地/殖民庄园政策，soft red = 实际袭击的港市位置。
- 所有面都写 `historical_boundary_confirmed:false`, `fill_authorized:false`, `territorial_claim:false`, `area_sqkm:null`, `occupation_area_sqkm:null`，以及 `exclude_from_area_aggregation:true`。这些字段禁止本次研究包进入任何英国统治面积统计。
- 所有区域仍归属于既有**“版图”**可见层，不增加常驻选择框，不改变OpenStreetMap默认现代地名底图。界面只在 hover 看到简短名称，点击展开史料与严格限定当年内容。
- 第十章既有`atlas-1580-1589.json`的事件及来源不作任何修改；将它们作为地域研究面`source_ids`及`related_event_ids`的可溯源链接。
- 不在1584年提前展示1586年条款，按`year_stages`动态选择当年标题/摘要和史料。老事件链接同样限制为已发生。十年章节管理不等于10年军事行动持续。
- 新功能校验`scripts/test_tenth_land_and_drake_areas.js`，公开GeoJSON验证器和Chromium浏览器测试保证地图数据与语义。网址深链：`?year=1584`, `?year=1586`, `?year=1588`。

## 下一阶段研究（尚未落图的真实领土）

在获得可核验的1586年分封清单、1587及1589年Jobson原始地图与明确授权再利用的图像后，可尝试史料配准及对承领地块边界和定居率的分级核验；关键是先区分 **surveyed / claimed / granted / occupied / actually cultivated**，不能从政策文本直接推出英国实际拥有一整块芒斯特行政控制面。同理，如果找到德雷克1586年堡垒或城市测绘原图，可以升级港市研究面，否则保留为不精确的可点击符号示意。
