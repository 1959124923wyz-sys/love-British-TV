# 爱英TV 第六章／第七章交界｜1544—1550 英军驻堡与战争动态：主编可直接调用的数据包

**GitHub**：独立研究分支 `research/editor-ready-1544-1550-control-deltas-20261013`。此包只存研究数据和候审导入文件，**未覆盖正式 main、未修改正式浏览器脚本、未派发 Actions**。

**制图底线**：苏格兰1540年代仍是独立王国。城堡被英军驻守、道路曾走过英军、苏法围城与当地领主给英王效忠，分别属于四种不同事实；不可自动拼成英国主权区／完整连续实际控制面。本包新增古址全为官方现代遗址或历史市镇**Point**，**新增经过当时实测的实际控制Polygon=0**，推定前线不许统计面积。

## 一、真正可“直接导入”的资产

| 文件 | 实际内容 | 主编如何调用 |
| --- | --- | --- |
| [SOURCE_LEDGER.json](SOURCE_LEDGER.json) | 18条带URL/史料范围的来源，包括现代古址精度和旧学术地图版权提醒 | 首先核对源ID，英文官方档案不能因同一段二手引文被重复计算成“多条独立证据” |
| [CONFIRMED_1547_GARRISON_POINTS.geojson](CONFIRMED_1547_GARRISON_POINTS.geojson) | **3处新增、坐标有官方记录的1547英军实际驻地**：Castlemilk塔堡、Lochwood塔堡、Dumfries市镇。Point坐标/史料ID/唯一stable_id/有效年份/弹窗说明齐全 | **可以按`stable_id`去重后追加**到正式`data/military-control-points-1540-1549.geojson`；有效范围严格仅`1547—1547`。Dumfries点代表市镇位置，**不是英军营房的具体建筑** |
| [ATLAS_EVENT_IMPORT_DELTA_1547_1548.json](ATLAS_EVENT_IMPORT_DELTA_1547_1548.json) | **5条Atlas现有结构兼容的新事件**，包括上述三处西南驻军和1548 Saltoun/Yester驻堡事件；自带需要增加进正式Atlas的来源条目 | 先并入`source_entries_to_append_to_atlas_before_merging`，再按事件ID并入`new_events`。Saltoun/Yester是发生过军事活动，并非年末实控占领 |
| [PROVISIONAL_1548_GARRISON_EVENTS.geojson](PROVISIONAL_1548_GARRISON_EVENTS.geojson) | **3处准确古址、但驻军年末未核的地点**：Saltoun、Yester、Fast Castle。包含官方遗址点/英文名称/史料说明/禁填范围 | 只交给**事件**层或有争议的地方资料面板；**禁止**导入“全年稳定控制点” |
| [DYNAMIC_WAR_CONTROL_CHANGES_1544_1550.geojson](DYNAMIC_WAR_CONTROL_CHANGES_1544_1550.geojson) | **12条夺取／撤军／收复及史料争议变化Point**：1547西南3、1548东洛锡安2及Hailes苏军收复、1549 Haddington撤军与Fast Castle争议、1550 Broughty／Boulogne／Eyemouth／Forthill控制退出 | 按`change_year`与`date_precision`驱动节点时间轴和弹窗，**不是占领面Polygon**。若`already_published_main_event_id`存在，应关联既有事件而非重复追加 |
| [YEAR_END_CONTROL_STATES_1544_1550.json](YEAR_END_CONTROL_STATES_1544_1550.json) | **7份1544—1550年底快照**：复用主站15处既有驻点，单独加入3处1547西南驻点；1550退去英国苏格兰要塞，保留英国加来/吉讷等合法实际据点 | 年末切换直接读取对应年份，不能把1547新增西南驻军不经审查复活于1548/1549/1550 |
| [WAR_OPERATIONS_AXES_1544_1549.geojson](WAR_OPERATIONS_AXES_1544_1549.geojson) | **5条LineString军事方向辅助线**，复用已由HES史料核证的PR41调查数据：1544利斯海袭、1547东岸进军、1548邓格拉斯交通、1548被苏法封锁的哈丁顿方向、1549撤军后收缩 | 仅适合军事方向图层，**不能作实际控制地块**。禁止恢复此前从城堡任意连出的4片紫色多边形 |
| [PENDING_PLACES_AND_UNRESOLVED_TRANSITIONS.json](PENDING_PLACES_AND_UNRESOLVED_TRANSITIONS.json) | **15项旧新城堡／驻军档案研究候选**及5项关键不定位或1550日界未证任务 | 排队给后续调查，切勿默默忽略，更不能自动当确定英国占领 |

## 二、实际年表：可动画化的英苏战争控制变化

| 年份 | 可直接由研究文件读出的变化 | 仍不许擅自涂紫的范围 |
| --- | --- | --- |
| **1544—1546** | 继承主站原有Lochmaben短占、Boulogne军事占据、远征等现有资料。本研究包不重建原数据 | 暂无证据把苏格兰南部整郡当英王领地 |
| **1547** | 新增真正的**西南线**：Castlemilk(1547年9月降英)、Lochwood英军据堡、Dumfries市镇英军驻地。与已存在Eyemouth、Hume、Broughty、Inchcolm等东线据点并列；1547年Pinkie战役从Berwick沿东岸向北推进，但不是爱丁堡年末英军占领 | Cockpool史书记为1547英军据点，但HES疑似Cockpool/Moss Castle遗址不能与军事堡垒同一性核实，故**暂不上坐标**；更不能整块Dumfriesshire紫色填满 |
| **1548** | 主站Haddington、Dunglass、Lauder等有证实英军驻防；苏军1548当年夺回Hailes。另有Saltoun、Yester的英军占领/驻堡史迹，现已有官方遗址GPS参考点，但**1548年末是否属英军未证**。补给邓格拉斯→哈丁顿一段受苏法军骑兵封锁 | 不准把Saltoun/Yester标为全年英王实控区；Hailes英军控制已于1548年终结；不准把哈丁顿外一圈炮火范围当英国行政边区 |
| **1549** | 正式既有史料确认Haddington英军退出；苏格兰东南英军控制点收缩，仍有部分海岸/Lauder要塞。1547西南三处是否一直驻军到1549年尚须原始书信核对 | Fast Castle有1548苏军夺回与1549英军筑堡冲突记载，未判定年末控制；不画连贯稳定英占边区 |
| **1550** | **Broughty在2月苏法军收复**（HES记前一天先攻占北部Balgillo外围堡）；**Boulogne实际4月25日交接法国**；**Eyemouth英占结束于夏季**。Forthill此前军事控制于1550年末不再作为英国驻堡显示。加来Guînes等仍在英王制度/军队控制；苏格兰王国主权从未中断 | Lauder／Dunglass在1550年哪一天交付、以及西南驻军的退出日均未核，不能把1549英占点“延续到1550年12月”或编造1550-03-24为各堡真实离开日 |

### 重要限制：年份滑块 ≠ 某天的战报

目前网站多数采用**年底统一状态**。新的`YEAR_END_CONTROL_STATES`同样按年末生成；`DYNAMIC_WAR_CONTROL_CHANGES`为不同时间精度的历史事件，例如“1550年夏季”不可自动生成6月1日的精确动画断点；“1548年曾被英军夺取”也不可强行解释成1548年12月31日仍英占。若主编需月度动画，只用已有月日证据的事件推进，不可填补缺失日界。

## 三、兼容已修订的「版图」「事件」两个可同时勾选层

- **版图**：国家/区域底色（苏格兰始终独立）、确定年份的实际控制点、只描述军行动方向的虚线/淡影线、蓝紫争夺带。仅在“有年末证据”的年份显示新增3处西南英军Point，不自动生成360度“城堡占领圆”。
- **事件**：军队攻占、反攻收复、临时驻堡事件、焚掠、围城、撤军等有史料的Point/时间线条目（包括暂不能判定年末归属的Saltoun和Yester），显示清楚证据等级。
- **两个图层同时勾选**：在地理底图上看年末确证的英军据堡，并同时叠加当天/当年的军情标记；取消事件不应取消疆域/驻军。
- **不存在第三个『战况』图层**；`WAR_OPERATIONS_AXES`属于版图上的军事行动辅助视觉，战争事件图标属于事件。

## 四、主编具体导入顺序（无需重做调查）

1. 备份现行 `data/atlas-1540-1549.json`、`data/military-control-points-1540-1549.geojson`与历史点事件。先读[Atlas导入文件](ATLAS_EVENT_IMPORT_DELTA_1547_1548.json)的`source_entries_to_append_to_atlas_before_merging`并按ID去重，确保新事件 source_ids 均能解引用。原来49条历史事件**原样保留**。
2. 在原有15个 `military-control-points` Feature 后，仅追加[3个确定新增驻点](CONFIRMED_1547_GARRISON_POINTS.geojson)（check `stable_id`）。必要时令前端保留点击详情，运行年份1547显示；不要自动将这些点列入1548/1549年末稳定控制。
3. 追加5项[Atlas候审史事](ATLAS_EVENT_IMPORT_DELTA_1547_1548.json)，只按来源支持的年份显示。对已有Hailes回收和Haddington撤军主站历史事件采取ID合并/关联，不重复开新历史事件。
4. 由[年度台账](YEAR_END_CONTROL_STATES_1544_1550.json)驱动统计字段中的“确定英国驻苏格兰军堡地点数”；交战影响带、短暂攻城和政治宣誓不计入占领行政面积。
5. 采用[PR41方向线](WAR_OPERATIONS_AXES_1544_1549.geojson)替换主站原4片缺证实的紫色多边形——**不是用此线计算或填充英国面积**。主编需按地图实际视觉验收边境线路有据与主权颜色一致。
6. 1550以后移交给[第七章 PR33](https://github.com/1959124923wyz-sys/love-British-TV/pull/33)既有1550—59控制台账。不要把1550夏前的埃茅斯英军数据沿用到1551，也不要把后来1557法军在埃茅斯新筑堡与英军旧堡合为一事。
7. [未确认列表](PENDING_PLACES_AND_UNRESOLVED_TRANSITIONS.json)务必留档并转交下一批调查员，对Cockpool真实驻堡位置、Saltoun与Ormiston1548多次易手、Fast Castle、Balgillo旧堡和西南英军后续退出时限继续核验。

## 五、地图史料分层和版权

- 来源以 **HES／Trove／RCAHMS官方古迹记录**核定现代或历史遗迹位置，以1996苏格兰历史地图集与英国牛津学术研究辨认军事地点网络，并用英法军营、军事通信和考古研究限制战线推断。
- 《苏格兰历史地图集》新数字版网站标明**CC BY-NC 4.0**；其他版权方对改编地图可能仍要求书面授权。本包只记录事实性站点/年份和自己的官方地点引用，**没有复制原书地图图像或描摹底层边线**。
- `geometry_precision`、`fill_authorized:false`、`year_end_English_confirmed`、`source_ids`等字段是编辑准入条件，不得为获得“漂亮的紫色连成一片”而删除。
- 原书第127—128页的所有据点符号尚未逐点完成原图目视登记；大量1548—1550英国/苏格兰当年信件仍未亲阅。本包是**分证据等级的可用地图候审增量**，不是已证实的西南苏格兰全面占领边界。

## 六、验收要求

- 1547地图新增 Castlemilk、Lochwood、Dumfries **3处**西南英军据堡／驻军地点；名称/坐标正确，非Glasgow同名Castlemilk。
- 1548切年**不会凭空把这3处又当年末已证英军占地**，而Saltoun、Yester有查史料的历史事件。
- 1548 Hailes仍由苏方年末控制，1549 Haddington没有英国年末据堡。
- 1550 Broughty/Boulogne/Eyemouth不保持英国年末控制；撤军时点按月、夏季、具体日分别显示。
- 点击每个新增Point可以看到证据来源，不展示任何“古堡周边若干公里都归英国”的无法证实面积。
- 双勾选版图/事件与年份切换无重复数据，不破坏原第六章49项事件/15个据点。
- **研究QA和浏览器上线测试不同**：本包可在GitHub校验JSON/GeoJSON结构和跨源关系；真正入主站仍应由主编运行图形/手机视图测试与兼容检查。

**主编导入原则**：对正式史料仍不完整的地方，宁可补出一条「年末控制待核」的信息提示，也绝不伪造一个紫色占领Polygon。
