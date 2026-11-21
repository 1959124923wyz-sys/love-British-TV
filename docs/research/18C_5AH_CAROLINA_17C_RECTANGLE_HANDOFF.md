# 第 5AH 批｜1700—1711卡罗来纳早期落点、17世纪26条旧框复核及下一轮GIS交接

更新：2026-11-21。基线：主分支 `219e18d`，继承第 5AG 批。**本文件为内部研究交接；地图读者界面只展示史实与出处。**

## 可立即归档的核验结论

1. 主数据 `data/eighteenth-century-mass-schematic-zones-1700-1799.json` 原始卡罗来纳记录 `CAROLINA_PROPRIETORS` 是 **1700—1711** 的单幅矩形 `[-83.8,31.3,-75.5,36.7]`，性质 `paper_claim`。交接前对应 `superseded_by:null`，**没有依据证实四角是同时代的疆域测量线**。该法律和文献记录永久保留，当前显示改为挂接三处具名聚落；显示屏幕上不再出现此巨框。
2. 用 GitHub Actions 直接遍历 4MB 主档 `zones/regional_zones/regional_sites/sites`，年段 1700—1711、地点窗口 `[-84,31,-75,37]` 的结果：1 条原矩形、**0 条有同期面轮廓**、1 条独立 Point `CHARLESTON_FORT_JOHNSON`（1708 年起）。原始逐条结果：[`18C_5AH_CAROLINA_EXISTING_GEOMETRY_AUDIT.json`](18C_5AH_CAROLINA_EXISTING_GEOMETRY_AUDIT.json)。
3. 新建 **3 条独立地点 Point**，均有时间、州档/市政/美国国家公园等资料、现代地点参考坐标、原住民土地不作英国控制面、`area_sqkm:null`。出处与坐标核对表：[`data/eighteenth-century-editor42-5ah-carolina-localized-sites.json`](../../data/eighteenth-century-editor42-5ah-carolina-localized-sites.json)：
   - `CAROLINA_CHARLESTOWN_1700_1711`：1700—1711年牡蛎角查尔斯敦。沿用仓库已经通过NPS来源核验的**1680年** `17c-editor9-car-1680s-e003` Point 坐标 `[-79.929,32.776]`，不搬用1780年城市多边形。
   - `CAROLINA_BATH_TOWN_1705_1711`：1705—1711年北卡巴斯港镇。北卡州历史遗址署说明成立于**1705**，坐标 `[-76.81425,35.476944]` 是巴斯市政用地规划文件中公布的当代城市坐标，不构成1705年原址边界。北卡另有1706年约翰·劳森参与建镇的记法；两件记法涉及建制/建镇过程，暂按州历史遗址署的1705年建制年份统一展示。
   - `CAROLINA_NEW_BERN_1710_1711`：1710—1711年新伯尔尼瑞士与普法尔茨移民据点。北卡州文化资源厅明确 **1710** 年始建；位置采用美国国家历史街区的现代代表点 `[-77.049444,35.115556]`。1710年原始地籍图需从档案影像配准后方能另画实际街区。
   - 另原有 `CHARLESTON_FORT_JOHNSON` **1708年起**独立点继续保留原出处，不重复新增。
4. 原始18世纪巨框退役后，按同一 `bbox && !geometry && !superseded_by` 口径，十八世纪**尚未退役旧框=0**，1799年亦=0。此数字表示旧制图框处理完毕，不表示全历史版图真实测量完毕。保持第5AG批1条未退役的**历史快照**不变；新快照：[`18C_5AH_OLD_RECTANGLE_INVENTORY.json`](18C_5AH_OLD_RECTANGLE_INVENTORY.json)。
5. 另从两个十七世纪 GeoJSON 源图**逐条计算坐标环**重建原始旧矩形 **14 + 12 = 26 条**。其中14条为特许／公司／岛屿等宏观参考，12条为攻城／奴隶贸易／战役与研究阅读框。这26条独立ID、原始史料与时间戳已经建立长期清单：[`17C_5AH_EXACT_26_RECTANGLE_SOURCE_INVENTORY.json`](17C_5AH_EXACT_26_RECTANGLE_SOURCE_INVENTORY.json)。**这些仍在17世纪图层中**。7条默认隐藏的超大殖民特许多边形以及其他非矩形宽包络另列；不能把它们混入26条旧矩形计数。

## 同期历史地图与地籍来源优先级

| 资料 | 可据以核定 | 仍然不能由该来源自动推导 |
| --- | --- | --- |
| 1704 查尔斯敦防御工事：查尔斯敦县公共图书馆《Creating a Walled City: The Charleston Enceinte of 1704》 https://www.ccpl.org/charleston-time-machine/creating-walled-city-charleston-enceinte-1704 | 1703—1704年筑墙工程、被奴役非洲人承担挖沟土方、要塞防御规划、历史街网 | 尚未完成地理配准的真实墙体顶点坐标；不可采用1780年城镇轮廓回填 |
| 1711《A compleat description of the province of Carolina》，Mathews/Love/Nairne、Crisp插图，**美国国会图书馆原图** https://www.loc.gov/item/2004626926/ | 英法与原住民族具名聚落的相对地理、海岸河道与城镇防线绘图史料 | 领主声索范围、持续军控和17世纪后期/18世纪各年代不变界线 |
| 1709 John Lawson《A New Voyage to Carolina》，**美国国会图书馆原著** https://www.loc.gov/item/02018519/ | 当年贸易网络、河流、已命名聚落与原住民社群记述 | 把作者游记航线推成英国所有权或测绘城界 |
| 巴斯州历史遗址署 https://historicsites.nc.gov/all-sites/historic-bath/history | 1705年成立、原镇界与现代历史街区存在关联 | 不应直接拿现代历史街区多边形代表全部1705授地或军控 |
| 巴斯市政计划（含城市地理坐标） https://townofbathnc.com/wp-content/uploads/2020/11/Bath_CAMA_Land_Use_Plan_4-8-24.pdf | 现代点位的明确坐标证据 | 不应视为1705年边界勘测 |
| 北卡自然文化资源厅 von Graffenried 官方历史牌 https://www.dncr.nc.gov/blog/2023/12/06/baron-christoph-von-graffenried-c-10 | 1710年瑞士等移民建立新伯尔尼 | 冯·格拉芬里德殖民镇界、邻近图斯卡罗拉土地的失地范围 |
| 北卡自然文化资源厅历史教育展 https://www.dncr.nc.gov/news/press-releases/2015/07/20/tuscarora-world-and-new-bern-portrayed-map-exhibit | 1710年移民点及图斯卡罗拉土地历史、1711—1715战争脉络 | 移民不等于取得整条河流沿岸的土地 |
| 美国国家公园局历史街区登记 `NRIS/73001325` https://npgallery.nps.gov/AssetDetail/NRIS/73001325 | 新伯尔尼现代历史街区地理基准 | 不把20世纪保护范围涂成1710年实控 |
| 北卡州殖民法院档案 https://appx.archives.ncdcr.gov/findingaids/SR_401_Colonial_Court_Records_G_.html | 1665—1787年法院、地产事件与时间核对 | 未经过逐地契配准，无法拼成所有权面 |
| NC DNCR图斯卡罗拉历史教材 https://www.dncr.nc.gov/documents/files/bocactveducatorguide/download | 1711调查事件、殖民扩张与图斯卡罗拉族政治地区、被奴役人员等背景 | 整个北卡罗来纳不能染成英国独占 |

### 下一轮真正的“面”如何完成

**A. 查尔斯敦（优先）。** 以1711年Crisp插图的1704土墙作为几何原图；找至少4处可同时确认的历史/现代交会点，保留原图影像馆藏、地理配准误差、测绘年代与城墙后期扩建变化。形成1704—1711年具名城墙／街区的闭环，逐年证据验证。没有配准就只保留同地点 Point。

**B. 巴斯和新伯尔尼。** 寻找1705 Bath原始法定镇地段图（或早期地契上带方位距离的测量图）；1710 New Bern 建镇规划见 Burgerbibliothek Bern `Mss.Mül.466(3a)`，再核北卡州档案的地籍簿。按原始可测量地块逐个建 Polygon，不能把现代城市外轮廓染成1710殖民范围。

**C. 其他17世纪14条特许/商站方框。** 优先岛岸（St Helena、Providence、St Kitts/Nevis）与具名堡墙（Cape Coast、Tangier、Fort St George、Bombay Castle）；需要同时期海岸/设施年代与几何相符，不能用后建堡垒轮廓硬套更早的商馆。

**D. 17世纪12条阅读框。** 对战事点优先查同一时期战场注册边界、城堡考古和河岸实图；将地点联线与事件范围分开；保留原独立ID与连贯年份，未验明不做假多边形。

**E. 点转面165条。** `docs/research/18C_5AG_479_MASS_POINT_AREA_CANDIDATES.json` 是自动近邻筛查，165个条目没有任何一项自动确认为“同一历史设施、同年同边界”。[第5AH批165条逐项风险台账](18C_5AH_165_POINT_AREA_SEMANTIC_TRIAGE.json) 已把30条对象/时期不匹配列为禁止直接套用的候选，剩余135条仍待查；原近邻候选本身全部保留。本批3条新本地坐标独立统计；5AG既有479点、77点和已完成5个升级**保留冻结**。重点排除“相距近、对象不同”：例如 `GOLD_COAST_SEKONDI_ENGLISH_FORT` 不能转成**荷兰** `GOLD_COAST_ORANGE_FORT`；`OUIDAH_WILLIAM_FORT` 和 `OUIDAH_FRENCH_FORT` 不能转为**葡萄牙** `OUIDAH_PORTUGUESE_FORT`；`BEAUBASSIN_VILLAGE` 不应转成晚建 `FORT_LAWRENCE`；`PITT_FORT_MAIN` 不应套用较晚所建的 `PITT_BOUQUET_BLOCKHOUSE`；`MANILA_BINONDO_CHURCH` 位于因特拉穆罗斯城墙外，不能用城内 Polygon 替代。以上为人工核验**禁转示例**，其余逐项查史料。

## 本批审计/测试要点

- `scripts/editor42_5ah_carolina_historical_footprint_audit.py`：源数据读回检测，生成精确候选缺口。
- `scripts/apply_editor42_5ah_carolina_settlements.py`：唯一允许触及4MB地图主档的脚本；原81个`zones`只为1条追加`superseded_by`，不删除 `bbox/periods/source_urls`；280条历史面不变；原479条regional_sites不变，仅增加3条。
- `scripts/test_editor42_5ah_carolina_17c_inventory.js`：原参考框、原26条十七世纪来源、3个坐标/年份、1708约翰逊堡和0余框逐项校验。
- `scripts/test_editor41_5ag_localized_areas.js`：确认5AG历史的2条退役记录、3个五大湖堡面、5个澳洲定居局部面、479点/165近邻候选资料不丢失。
- `scripts/browser_editor41_5ag_localized_areas.cjs`：增加1700、1705、1708、1710、1712年真实桌面年度切换。
- 严格运行 `python3 scripts/audit_spatial_semantics.py --strict`、公共文案Chrome测试、全1497—1799年浏览器测试；审核或待核事项不可以伪造为已解决。

**最重要的交接结论：** 18C旧矩形清零后，下一个补绘主力从数量上转到17C26条源框与18C165点候选。不可把“没有旧矩形”当成完成全部历史土地测绘。
