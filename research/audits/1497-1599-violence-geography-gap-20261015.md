# 1497—1599 年军事暴力、劫掠、强制管治地图遗漏复核（2026-10-15）

**状态：独立研究待主编审定；尚未接入正式事件库或地图。** 基准：main 的 `data/atlas-*.json`（11个历史文件）及 `app.js` 实际加载的 GeoJSON。原用户截图中的圆/虚线是当前显示，不能据屏幕外观认定对应历史范围已被证实。

## 方法与约束

1. 逐十年核对正式事件名称、现代坐标缺失及 app.js 载入的地理图层，优先检索官方历史遗产、国家档案、爱尔兰皇家学院、馆藏和学术出版物。
2. 区分 **全新事件 N / 已有事件但地点或地域不充分 G / 地理图层已有而正式事件未挂接 O / 候审 Q**；标记来源及反证。
3. 内部王权镇压≠殖民扩张；遭英国武装袭击≠英国有长期有效管治；当地抵抗造成英军伤亡≠英军暴行；贸易接触≠奴隶贩运；普通税收≠未经许可的强征或殖民收益。
4. 允许文献确证的具名历史地点使用**明确标注的现代城市/遗址参考点**。路线只能表达史料支持的行动顺序；不绘伪古代行军GPS。仅存在区域性扫荡证据时可提出虚线低透明局部概略面，不使用武断缓冲区、现代郡界、面积统计。
5. 任何候审示意面要求 `historical_boundary_confirmed:false`、`territorial_claim:false`、`fill_authorized:false`、`area_sqkm:null`、`exclude_from_area_aggregation:true`。无证据的伤亡人数、赔款数额禁止补填。

## 第一组：高优先级、来源已交叉或官方确认

| 标号 | 时间 | 具名地点（现代地点仅参考） | 事件主体及实质 | 现有数据缺口 | 地图建议 | 资料可信度 |
|---|---|---|---|---|---|---|
| SC-01 | 1544 | **利斯 Leith—爱丁堡 Edinburgh—邓巴 Dunbar** | 赫特福德英军由利斯进入并焚毁爱丁堡，亦在邓巴纵火；波及平民。 | **G**：`data/early-war-colonial-impact-1544-1575.geojson` 已有利斯—爱丁堡示意面；`atlas-1540-1549.json` 的1544苏格兰袭击仅一条泛化事件且 `lat/lng:null`；邓巴作为独立目标未被点化。 | 三个城市级参考 Point + 可以证实的登陆/侵入先后关系；原示意面不宣称焚毁边界。 | A（HES 官方 Pinkie BTL15） |
| SC-02 | 1544—1545 | **梅尔罗斯 Melrose、杰德堡 Jedburgh、凯尔索 Kelso** | 英军突袭、焚毁梅尔罗斯及杰德堡城镇/修道院；1545年凯尔索修道院严重破坏。 | **N/G**：1523杰德堡旧袭击已存在，但1544/45是**不同战争与日期**；本次3遗址的独立事件未见 1540s atlas。 | 分年3个遗址 Point；不得复用1523事件为1545；有据同次行动时才连接路线。 | A（HES BTL2 + HES Kelso Abbey） |
| SC-03 | 1545-02-27 | **安克勒姆荒原 Ancrum Moor** | 苏军迎击并打败越境英军；不得叙述为英国胜利或持续占有该战地。 | **N**：1540s atlas无该战役独立事件。 | 官方战地景观参考 Point（HES NGR NT 62938 26661）；官方 inventory boundary 是战场考古范围，**不是英军占区**。 | A（HES 指定战场 BTL2） |
| EN-01 | 1549-07—08 | **诺福克 Wymondham—Norwich—Mousehold Heath—Dussindale** | 王室镇压凯特起义，诺里奇遭攻防，杜辛代尔战斗造成大批起义者死亡。博物馆教研材料引用胜方约3,000人阵亡，数量不可视为无争议人口统计。 | **N**：1540s atlas 不含 Kett/Norwich/Dussindale 事件。 | 具名城市和战场点 + 有来源的行动先后线；图标分类**王室国内镇压**，不计殖民征服版图。 | A（Norwich Castle Museums） |
| EN-02 | 1549-08 | **德文 Clyst St Mary—Clyst Heath—Sampford Courtenay**，关联 Exeter 与康沃尔 | 祈祷书起义遭王室军队镇压；克利斯特圣玛丽村被焚，克利斯特荒原发生战斗，桑普福德考特尼最后一役。处决俘虏的细节见二级文献，尚须复核人数。 | **N**：1540s atlas 无 Prayer Book/Western rebellion 相关事件。 | 村镇和战地参考点；桑普福德史迹库提供参考经纬度 **50.797084,-3.929721**（现代遗址区域，不等于士兵位置）；不得画覆盖全部两郡的烧毁面。 | A：Historic England 列册和 Devon HER；B：二级叙述 |
| IR-01 | 1566 | **卡里克弗格斯 Carrickfergus—德里 Derry—德罗赫达 Drogheda** | 英王在阿尔斯特的军队与沙恩·奥尼尔部交战，吉尔伯特、锡德尼经具名地点行军/集结。 | **N**：1560s atlas 中未单列这段军务；既有 1570s 卡里克弗格斯据点无法代替1566记录。 | 区分双方军队的 3 Point + 仅有文献支撑的行动顺序线；不得把阿尔斯特填作1566英控全域。 | A（Dictionary of Irish Biography） |
| IR-02 | 1569-09—11 | **基尔肯尼 Kilkenny—基尔马洛克 Kilmallock—科克 Cork—北凯里 North Kerry—Connellough 林地** | 英王军统帅汉弗莱·吉尔伯特镇压第一次德斯蒙德叛乱：对城堡袭击、镇压，杀害平民和牲畜以迫使服从；DIB还记录 Garrystown 的屠杀，但**该同名遗址需先确认在芒斯特的具体旧址**，不得直接用都柏林附近现代 Garristown 坐标。 | **G**：1569 atlas仅一个泛芒斯特镇压事件（现代 Limerick 参考点），未形成多地点空间叙事。 | 已唯一识别的 Kilkenny、Kilmallock、Cork 等镇点；地理位置待核的 Garrystown/Connellough 先只进入时间线；已证军行动线，地区受袭研究范围可考虑局部淡色虚线、不可画整省被毁。 | A（爱尔兰皇家学院 DIB；Irish Manuscripts Commission `SP 63/29` 日志出版预览） |
| AT-01 | 1578-12 | **智利瓦尔帕莱索 Valparaíso** | 德雷克劫掠西属港口的商船、补给物资、黄金等；不建立长期英国统治。 | **N**：1570s atlas已记录1579卡亚俄及运宝船，未列瓦尔帕莱索；可按1578年首次单独发生记。 | 港市 Point / 低倍率固定像素提示；航次关系线接1579 Callao，不绘跨海影响区。 | A（美国国会图书馆 Kraus Drake Collection，西班牙相关文献引录） |
| IR-03 | 1588-09 | **斯莱戈 Streedagh Bay；康诺特其他海岸需另核** | 西班牙无敌舰队三艘船遭风暴失事，获救/登陆的部分人员遭王室军和当地人员杀害；与海难溺亡严格分开。 | **O**：`data/followup-regional-stories-1562-1596.geojson` 已有1588年 Sligo—Mayo 研究 Polygon，却在 `atlas-1580-1589.json` 未查到单列对应正式事件。 | Streedagh Bay 具名地 Point + 独立屠杀情节，复核区域概略面是否过宽；不得把死亡1100人都归到英军杀害。 | A（爱尔兰政府2025联合考古文献新闻，爱尔兰皇家学院 DIB Bingham） |

## 第二组：具名方向明确、再核细节后入库

| 标号 | 时间 | 地点与事件 | 审查状态与建议 |
|---|---|---|---|
| AZ-01 | 1597 | 葡属亚速尔群岛 **法亚尔岛 Faial / 奥尔塔 Horta**；埃塞克斯/罗利英军航次袭港。 | **N, B**：`atlas-1590-1599.json` 不含1597亚速尔；History Today研究确认对亚速尔的军事行动，地方史摘要记载奥尔塔遭袭。可先定位Horta为拟采录港点；纵火具体地点、日份、伤亡需再核早期航海史料，不能画整岛英国占领。 |
| IR-04 | 1575—1579 | Pale 的 **cess / billeting** 征赋与军需，既有 `1570S-E033` 参考 **Meath** 等； | **G**：现有`atlas-1570-1579.json` 已记录锡德尼改革强征军需，不是新事件。增补财政/居民受影响位置时必须与初始政策及实际征收文献匹配，不能用都柏林一圆代表征税地域。 |
| IR-05 | 1556 起 | **莱伊什 / 奥法利** 王室没收土地与殖民驻堡； | **G**：正式地图已有 `data/early-war-colonial-impact-1544-1575.geojson` 连续概略面及1550s事件，不能再次宣称新发现。优先考证哪一具体庄园、屯驻/地方反抗据点有可靠文献，以非连续点展示，而非扩大多边形。 |
| IR-06 | 1594—1599 | **弗马纳、阿马、芒斯特** 九年战争的行动与抵抗； | **G**：现有 `data/nine-years-war-operational-impact-1594-1599.geojson` 已有三个影响研究面和1599军事顺序线。新事件需具体到有史料的地名/日期，并清楚谁在袭击谁；不能简单复制一块“1590s英控阿尔斯特”。 |

## 史料入口（具名官方/馆藏/学术）

- HES Battle of Pinkie, BTL15：<https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,BTL15>
- HES Battle of Ancrum Moor, BTL2（含位置、1544 Melrose、1545 Jedburgh、战役叙述）：<https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,BTL2>
- HES Kelso Abbey 1545 毁坏：<https://www.historicenvironment.scot/visit/all/kelso-abbey/history-and-stories/>
- Norwich Castle 1549 官方教学研究包：<https://www.norwichcastle.norfolk.gov.uk/media/14193/Ks2-Ketts-Rebellion-Resource/pdf/p9ks2-ketts-rebellion-resource.pdf?m=1701427818977>
- Norfolk Historic Environment Records Dussindale：<https://www.heritage.norfolk.gov.uk/record-details?uid=%27TNF107%27>
- Historic England / Devon HER Sampford Courtenay 地点：<https://historicengland.org.uk/listing/heritage-gateway/results/record/c39bc47e-3b72-4a06-9863-681629e456a2/MDV12578>
- Historic England Clyst St Mary Bridge（村庄焚毁及军队攻防）：<https://historicengland.org.uk/listing/the-list/list-entry/1020209>
- Dictionary of Irish Biography, Gilbert：<https://www.dib.ie/biography/gilbert-sir-humphrey-a3467>
- Irish Manuscripts Commission, `Campaign Journals` 1569（原件目录 TNA SP 63/29/64,68,82a,b,83）：<https://www.irishmanuscripts.ie/pdf/products/147/Campaign%20Journal%20Preview.pdf>
- 美国国会图书馆，德雷克航行瓦尔帕莱索和卡亚俄：<https://www.loc.gov/collections/sir-francis-drake/articles-and-essays/drake-biography/the-famous-voyage/>
- 美国国会图书馆，西班牙文献引录（1578年12月到智利港）：<https://www.loc.gov/collections/sir-francis-drake/articles-and-essays/drake-biography/strait-of-magellan/>
- 爱尔兰政府 2025 年 Cuéllar/1588 研究及后续杀害：<https://www.gov.ie/en/department-of-housing-local-government-and-heritage/press-releases/new-irishspanish-joint-publication-reveals-the-fascinating-story-of-captain-cu%C3%A9llar-1588-spanish-armada-shipwreck-survivor/>
- DIB Richard Bingham（王室官员指挥处置沉船幸存者）：<https://www.dib.ie/biography/bingham-byngham-sir-richard-a0665>
- History Today 1597 Azores（整体远征，不直接证明Horta旧市区界）：<https://www.historytoday.com/archive/islands-voyage-1597>
- Azores 1597 Horta 地方历史简介（需再核档案）：<https://azores.com/azores/islands/faial/history/>

## 供主编按次序执行的接入工作

1. **首批可交付**：SC-02、SC-03、EN-01、EN-02、IR-02、AT-01、IR-03：补已具名现代参照点、事件说明、来源；对有歧义地名不赋经纬度。IR-02 可以从既有1569芒斯特泛化事件拆分成具名子事件，原事件保留为概况，避免重复统计。
2. **复核 / 去重**：SC-01 已有概略几何，增具体城市；1575 Rathlin、1580—1583 Munster、1584—1589 Drake 四港、1594—1599 Nine Years War 现有图层和事件，不能重复以“新发现”上线。Issue #83 的德雷克四港任意椭圆放大误读问题另行处理。
3. **正式地图可视化**：不新增图层开关，历史暴力 Point 属现有「事件」，军事概略 Polygon/行动线属现有「版图」；优先单点聚合展开，缩放使用固定像素提示，不在城市级画任意半径灾区。
4. **数据审核**：所有新的事件有有效年份、主体、行为、后果、source_ids、位置精度及归类；暴力、英国占领、苏军反抗应独立类型；每一个 Polygon 适用上方四项禁止面积字段。
5. **逐年浏览器验收**：1544、1545、1549、1566、1569、1578、1579、1588、1597 的世界/国家/城市三级、桌面/移动、版图/事件双开关截图；核对前一年无未来标记。无真实浏览器截图不得宣称已完成验收。

**当前交接：此文件只代表第一轮高可信度补缺成果与新增地理研究计划；没有更改生产史实、CI或UI，也没有宣称所有遗漏已穷尽。**
