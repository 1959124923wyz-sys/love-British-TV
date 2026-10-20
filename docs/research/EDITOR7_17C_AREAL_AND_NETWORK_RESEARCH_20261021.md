# 17世纪大地图第二阶段｜来源核实和安全制图边界（2026-10-21）

## 目标和优先级
在已正式发布的44个地点级军事/土地/商业虚线提示上叠加**可复核的局部地区阅读范围**以及**有史实方向的贸易/战争关系线**。任何Polygon都不是历史疆界；任何LineString均不是实测航路/行军路。正式16世纪地图不回归，新专题阅读器不另建入口。

## 机构与学术证据：严格区分证实事实与示意几何
1. Trinity College Dublin **Down Survey of Ireland** 官方方法说明 https://www.downsurvey.ie/about/ ：列举1653 Gross/Brief Survey目标郡（芒斯特Limerick/Tipperary/Waterford；伦斯特Laois/Offaly/Meath/Westmeath；阿尔斯特Down/Antrim/Armagh）；1654 Civil Survey扩大调查；1656—1658 Petty Down Survey较精确测地，但对地界及地权的原稿保存有缺口。1641与1670为所有权两个截面；不能从一条法令或一张区域示意图得到实际土地过户名单。
2. Public Record Office of Northern Ireland PRONI **Plantations in Ulster 1600–41**, 文献No.23 London city调查 https://www.proni.gov.uk/files/proni/2025-12/Plantations%20in%20Ulster.pdf ：1610年伦敦公司参与Coleraine郡与Loughinsholin及Derry/Coleraine市镇，1613年两座城镇公司体制；公司实际分地须另查个别地契。不把德里—科尔雷恩之间所有地块称为已完成种植园。
3. PRONI PDF含文字原文可搜索摘录，但本轮未下载逐页进行目录校对；两城现代地理参照核查于Gazetteer of British Place Names https://gazetteer.org.uk/place/Coleraine%2C_Londonderry_322032 （Coleraine 55.131445,-6.671045），德里坐标沿用仓库已审事件1610S-E012。
4. National Army Museum https://www.nam.ac.uk/explore/battle-boyne、现有1690S-E001/E002/E003：1690年Oldbridge、Rosnaree、Duleek属于同一博因河战争场景，画局部虚线研究框，不是实际部署或伤亡界线。
5. Heritage Ireland https://www.heritageweek.ie/projects/never-so-hot-a-storm-the-1650-siege-of-clonmel 和 https://heritageireland.ie/2021/12/cahir-castle-50-years-open-to-the-public/ + 已入正式1650S-E001/E002：1650年Cahir及Clonmel相邻有据的共和国军事行动场所，区域阅读包络只用于读图。
6. British Library India Office IOR/G编目历史导言 https://searcharchives.bl.uk/catalog/032-000173250 ：EIC首航Acheen/Bantam，1612苏拉特等商馆，英格兰公司商贸网络与当地政权的贸易准入不同于领土管治。导言明确称公司知道Gujarat棉布在Bantam可换取胡椒；1610年起第六航次Darling自Surat赴Bantam（记录未提供实测航迹）。如用点间线，类别标为`commercial_relation_not_measured_ship_track`。
7. Ronald W. Ferrier，《Encyclopaedia Iranica》https://www.iranicaonline.org/articles/east-india-company-british-i-the-safavid-period/ ：1616年12月4日公司货物随James抵Jask，寻求Safavid丝贸易；1622萨非与EIC协同夺Hormuz。公司被许诺海关收入，不等于实际收款。Daniel T. Potts Qeshm研究 https://www.iranicaonline.org/articles/qeshm-island/ 记录1622 Qeshm先于Hormuz攻占，波斯驻军控制；西班牙/波斯关系综述 https://www.iranicaonline.org/articles/spain/relations-with-persia-in-the-16th-and-17th-centuries/ 进一步确认五月1日Hormuz投降。英国公司船队参与，不是全岛英王领土。
8. 1691年Athlone、Aughrim为战事阶段，事件现有1690S-E048/E047及History Ireland战史 https://historyireland.com/the-battle-of-aughrim/；可用点级保留和简短顺序联系，不能以中间区域全部遭炮击论证。

## 空间和时态合同
- 独立的`data/seventeenth-century-regional-studies-1600-1699.geojson`，Feature属性明确`historical_boundary_confirmed:false`、`fill_authorized:false`、`territorial_claim:false`、`area_sqkm:null`、`exclude_from_area_aggregation:true`。
- Polygon只通过上述来源支持的**具名锚点现代参考位置**和透明度低、虚线的示意轮廓绘图。任何包络顶点为读图插图而非史料，不得统计地理面积，禁止复用到`colonial_polygons`或任何实际治地声明。经纬度缓冲不表示真实影响公里半径。
- LineString仅对同一事件的已核两地或档案明确叙述的有向往来，显示为点间线；内容需标注起止年份、文献URL、相关现存事件ID、运输性质/军事主体及证据限制。避免利用任意相邻贸易点编航路。
- 各图层复用既有“版图”开关：局部区域放在低于事件SVG的`territory`底图叙事层；线按照经济/战争性质配色，便于向用户区分。绝不添加新的常驻按钮。
- 跨年持续只在现有文献支持的在场、行政或政策时段，单次军事行动按发生年显示；资料明确无证持续即不外推。
- 最后要通过`scripts/audit_spatial_semantics.py --strict`、新增分区语义测试、旧17世纪回归以及真实Chromium截图，GitHub多次小提交并存交接。

## 阶段状态
[证据阶段已保存；待后续GIS、前端和QA提交逐条填入SHA。]
