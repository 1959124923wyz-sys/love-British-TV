# 第七章1553—1557航线及西非贸易地理纠偏（2026-10-14）

## 编辑决定
保留29条事件、18处地点、加来1558控制变化及双图层设计。删除PR #51所加大幅专属地图阅读导航UI，回到批准的16类标准SVG图标（EXP、SLV、POL、REP、RES）、原事件聚合和航线机制。11条以前经纬度为空的事件设置**现代关联点或粗粒度地区参照**，每条含专门定位警告：并非确知的交易、登陆、掳人或签订法律精确坐标。

## 西非与贸易
- 1553 Windham航行涉及几内亚与贝宁，贝宁湾坐标仅区域参照。
- 1554 John Lok自泰晤士出航；Hakluyt详细描述Sestos、Cape Three Points及Mina一带的贸易和港湾，增加虚线大致连接及Cestos (Getty TGN 1122639)现代河位。
- 1555 Lok带回5名被奴役非洲人：**实际掳获位置不明**，以几内亚海岸做地区参照；返英路线仅是示意，不属于1562年后Hawkins三角贸易。
- Towerson1555始航及1556至Elmina（葡萄牙控制）的航次、1557 Sestos相关记录仍须后续核对第三次航次的完整先后，但按照已发表研究的年份展示相关概略路线，不补未经证实的中途停港。
- 两条西非海岸虚线，1553后Cape Three Points—Elmina—贝宁一带、1554后Sestos—Cape Three Points—Elmina，只表示史料所说的地理商业接触区段，**并非每公里有贸易活动，更非英国驻军或殖民领地**。
- 1553 Richard Chancellor经挪威以北、白海与俄罗斯通商，及1555英王对Muscovy Company伦敦商人颁特许：现代Kholmogory及伦敦市中心分别是阅读锚点，不是英国在俄罗斯取得领土。海上路线中的折点非实测GPS。
- 1556爱尔兰中部设郡、O'More/O'Connor土地没收和抵抗的参考点依托Portlaoise、Daingean有史料的英军军堡，拒绝将现代县界虚构为被完全占领的1556领土。

## 研究来源
- Hakluyt原航海文字（Perseus, Tufts）：https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.03.0070%3Anarrative%3D522
- Cambridge校勘Hakluyt 1556 Towerson对Mina海岸航行：https://www.cambridge.org/core/books/abs/principal-navigations-voyages-traffiques-and-discoveries-of-the-english-nation/second-voyage-of-m-william-towrson-to-guinea-and-the-castle-of-mina-an-1556/1C2ED1E2382E6DA560EC7F5EFE331AFC
- Historic England奴役人口历史：https://historicengland.org.uk/research/inclusive-heritage/the-slave-trade-and-abolition/sites-of-memory/slave-traders-and-plantation-wealth/britain-and-the-slave-trade/
- Getty Cestos River现代地理参考：https://www.getty.edu/vow/TGNFullDisplay?english=N&find=1047875&nation=&place=&subjectid=1122639
- UNESCO葡属Elmina地标：https://whc.unesco.org/en/list/34/
- 爱尔兰中部殖民：https://www.askaboutireland.ie/learning-zone/secondary-students/history/tudor-ireland/tudor-plantations/
- 大英博物馆莫斯科公司商人特许：https://www.britishmuseum.org/collection/object/H_1928-0315-1

## 技术与限制
分年数据保存在 data/atlas-1550-1559.json: events29，routes9，sources52。旧 data/seventh-event-geographic-anchors.geojson 仍保留为历史研究档案，但主站前端不加载，不应当与新事件标记重复显示。route_kind 记录海上示意/人口强制运输/沿岸活动带；所有对象走现有 groups.routes/voyagePane/atlas-voyage-hit，史料档案明确没有精确航迹。不得对线路计算运输人数之外未经证实的数额、地理面积或殖民利润。

浏览器验收必须检查1550无新航线、1553累计3条、1555累计7、1556累计8、1557累计9，海岸线与强制运输线具有不同语义；标准图标不随缩放失去辨识；双击事件不改变缩放；关闭事件图层同时撤销全部贸易海上线。
