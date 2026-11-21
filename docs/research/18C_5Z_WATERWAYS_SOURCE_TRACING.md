# 第5Z批｜有证据的湖岸与河网：实体多边形替换地图旧框

2026年11月21日，继第5Y批合并（主分支基线 `94d94eae8a760031b011972aa9812f98de03230d`）后的区域绘图。共绘出 **10 个真实湖岸多边形**与 **8 组真实曲折河线**，取代 **7 条十八世纪旧矩形**。各自然水系使用 Natural Earth **1:10m** 坐标；历史活动由加拿大公园管理局、国家历史遗址、马尼托巴档案和原住民历史研究另行证明。

## 数据清单

| 湖泊多边形（10） | 史实阶段 |
| --- | --- |
| 伍兹湖 Lake of the Woods | 1732年法方在湖畔建立圣查尔斯堡；当地水路先于此存在 |
| 温尼伯湖 Lake Winnipeg | 1730年代法方商站；后来约克工厂和内陆水路联系 |
| 马尼托巴湖 Lake Manitoba | 法方远征及当地内陆交通 |
| 温尼伯戈西斯湖 Lake Winnipegosis | 1739年多芬堡及原住民族水路 |
| 西皮韦斯克湖 Sipiwesk | 海斯河—约克工厂水运地理 |
| 苏必利尔湖、密歇根湖、休伦湖、伊利湖、安大略湖 | 1763年以后英方军商网络接入此前法方及原住民族交通，独立保存湖岸各社群主体 |

| 河道线（8） | 史实与制图边界 |
| --- | --- |
| 海斯河下游 Hayes River | 只画 Natural Earth 记录的下游；长程搬运道暂不添凭空直线 |
| 纳尔逊河 Nelson | 两组自然河道数据接续，湖泊和中断段分开 |
| 萨斯喀彻温河 Saskatchewan | 1774年赫恩借助原住民向导建立坎伯兰豪斯 |
| 北萨斯喀彻温河 North Saskatchewan | 十八世纪后期毛皮商路网络 |
| 红河 Red River | 1734年后福克斯的贸易活动 |
| 阿西尼博因河 Assiniboine | 1738年法方抵达福克斯及原住民族使用 |
| 渥太华河 Ottawa | 阿尔冈昆人传统水路及后续毛皮商队 |
| 密西西比河上游 Mississippi | 1767年起上游原住民族—欧商联系，地图只留真正连续的线段 |

**新 GeoJSON**：`data/eighteenth-century-editor36-5z-waterways.geojson`；**地图程序**：`js/eighteenth-editor36-5z-waterways.js`。新稳定ID为 `EDITOR36_5Z_` 前缀。矢量外形来自实地水系的现代综合图，而各自是否曾供商贸旅行由独立史料确立。河流遇到被湖泊切断、现代水电改造、自然地理底图不连续之处，不额外绘制声称已有证据的捷径或旧航迹。所有水系以虚线、低透明度显示，`area_sqkm: null`。现代湖岸线不冒充1760年实测边界。

**本次退役的旧框**，全部保留原JSON与原始来源，同时写入 `superseded_by`：
- `B38-H-Z006` 纳尔逊河口航路 → `EDITOR36_5Z_NELSON_RIVER`
- `B38-H-Z018` 萨斯喀彻温河路线 → `EDITOR36_5Z_SASKATCHEWAN_RIVER`
- `B38-H-Z021` 阿西尼博因周边贸易 → `EDITOR36_5Z_ASSINIBOINE_RIVER`
- `B38-H-Z023` 红河与福克斯周边商贸 → `EDITOR36_5Z_RED_RIVER`
- `B36-Z028` 上密西西比商业水路 → `EDITOR36_5Z_MISSISSIPPI_UPPER`
- `B36-Z030` 休伦湖贸易联系 → `EDITOR36_5Z_LAKE_HURON`
- `B36-Z031` 渥太华河毛皮贸易联系 → `EDITOR36_5Z_OTTAWA_RIVER`

原本海湾远洋船只轨迹（B38-H-Z007）、1769—1772年赫恩和马托纳比陆路行程（Z016）、约克工厂到坎伯兰豪斯完整搬运道（Z020）、哈德孙湾公司纸面特许范围（Z025）均未伪造成精确多边形；留待有旧航行日志或条约原图时查。原住民族范围与公司商馆是不同图层主体。

## 来源与复核办法

1. **[Natural Earth 公共领域湖岸数据](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_lakes.geojson)**、[河流中心线](https://github.com/martynafford/natural-earth-geojson/blob/master/10m/physical/ne_10m_rivers_lake_centerlines.json)：从具名湖泊及自然河段按原始要素提取坐标，未画手绘四边形。来源仓库版本分别为 `ca96624a56bd078437bca8184e78163e5039ad19` 和 `0b9a6ceb0a7032713abd9460ac1e995a9c60cd1e`。原有的江河岸线经人工归属及地理包络核查，保留GeoJSON `hydro_source_id` 与原始 `source_urls`。
2. **[加拿大公园管理局约克工厂管理计划](https://parks.canada.ca/lhn-nhs/mb/yorkfactory/info/gestion-management)** 展示海斯河—湖泊—挪威豪斯的水运脉络；[加拿大遗产河流系统海斯河说明](https://chrs.ca/en/rivers/hayes-kisipikamawi-river) 记录自17世纪起通过该河的贸易与原住民族交通。[马尼托巴省官方遗产河流资料](https://www.gov.mb.ca/sd/parks/park-facilities-and-services/heritage-rivers/index.html)说明该网络中有关社区与河道的关系。
3. **[加拿大公园管理局 The Forks 史](https://www.parks.canada.ca/lhn-nhs/mb/forks/culture/histoire-history)** 区分1734—1760法方贸易接触与1760—1821多商团竞争；[坎伯兰豪斯国家历史遗址](https://www.pc.gc.ca/apps/dfhd/page_nhs_eng.aspx?id=736)核对1774年起河流与驻站。
4. **[加拿大历史博物馆毛皮贸易史](https://www.historymuseum.ca/virtual-museum-of-new-france/economic-activities/fur-trade/)**、[拉韦朗德里远征](https://www.historymuseum.ca/virtual-museum-of-new-france/the-explorers/pierre-gaultier-de-varennes-et-de-la-verendrye-1732-1739/)、[加拿大原住民族历史](https://cirnac.gc.ca/eng/1307460755710/1536862806124)与[渥太华河加拿大公园管理局](https://parks.canada.ca/lhn-nhs/qc/canalcarillon/culture/histoire-history/rapides-rapids)核对五大湖和蒙特利尔以西的交易变迁。[美国国家公园管理局密西西比河历史](https://www.nps.gov/miss/learn/historyculture/river-of-history-chapter-3.htm)核对内陆水运背景。
5. 1800年仅继承同一自然地理轮廓，行政、军政和公司地税分别由原有十九世纪历史图层提供，**不从水路继承主权**。新增内容不计入原历史台账中725条政治/驻点记录，另以 `additional_physical_hydrography_5z` 登记。

## 交付检查

运行 `node scripts/test_editor36_5z_source_waterways.js`、`node --check js/eighteenth-editor36-5z-waterways.js`、`python3 scripts/audit_spatial_semantics.py --strict` 及全站历史页面规范检查。桌面浏览器实点温尼伯湖，翻到 1731、1732、1762、1763、1773、1774、1799、1800、1801、1699 年，核实原框退出与跨年自然水系保留。

此批后十八世纪旧矩形 **140→133**；1799年可见旧框 **67→61**。后续优先对照詹姆斯·伦内尔当年版孟加拉地图、1765财税和1772行政改制，逐处找史图而后画实际地税范围，严禁以现代县界假替古代辖区。
