# 主编10｜1547—1549英军占领地理面P0：Eyemouth史料指针纠错与时段实控证据（2026-10-24）

> 范围：[P0 #46](https://github.com/1959124923wyz-sys/love-British-TV/issues/46) 的增量史料审计；**本文件不是P0完成报告**。不使用不确定的现代遗址边界冒充1547年军界；不由城堡驻军推算苏格兰整县英国实际统治。

## 一、发现并修复的源编号错误

原存量两个GeoJSON对象 `eyemouth-english-fort-schematic-envelope` 在`data/war-control-vicinity-1540-1549.geojson`和`data/war-occupied-zones-1540-1549.geojson`把官方遗址记录标为`SC-HES-EYEMOUTH-FORT-SM4577`。

实核苏格兰历史环境局(Historic Environment Scotland, HES)：
- **SM3190 是 Eyemouth Fort**（官方标题 *Eyemouth Fort*），NGR `NT 94260 64865`，地标坐标为现代官方登记的OSGB36网格基准，见 https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,SM3190 。
- **SM4577 是 The Corn Fort, Eyemouth**，为另外一处更早的海岬防御遗址；官方明确记载它与东南约250米的16世纪炮兵堡垒是两处，见 https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,SM4577 。**不得把 Corn Fort 的列入保护范围或110m×70m数据转嫁为1547年英军 Eyemouth artillery fort 的占领地理面。**
- 两个旧GeoJSON中该要塞的历史来源ID已改成`SC-HES-EYEMOUTH-SM3190`，与`data/military-control-points-1540-1549.geojson`中正确的英军要塞驻点来源保持一致；**多边形顶点、年份、虚线、空面积和非实测属性一律未改**。另设JS回归断言防止再次混淆。

## 二、历史阶段也必须分开：1547英军与1557法军

- 苏格兰Eyemouth Museum https://eyemouthmuseum.co.uk/the-museum/eyemouth-fort/ 说明1547英军建造炮堡、1550年拆毁原设施；1557年法国及苏格兰部队重修／扩建、后又拆毁。SCAPE Trust考古 https://scapetrust.org/eyemouth-fort/ 亦明确先英后法，存留夯土与考古层可能经历不同时代的改动。
- 英国国家图书馆 https://blog.nls.uk/scotland-defending-the-nation/ 证明1540年代军用比例尺平面图存在，但**不能从“同名地区有地图”直接推断任一张就是1547年英军实测墙界**。
- 英国图书馆档案馆藏 **Cotton MS Augustus I i 60**，标题 *Plan of the fort of Eyemouth*，**馆藏目录年代1557**：https://searcharchives.bl.uk/catalog/040-001101839 。SCAPE另指出此幅是1557年Eyemouth法国阶段、由英方间谍绘制的城镇炮堡图：https://scapetrust.org/the-next-generation-of-eyemouth-explorers/ 。因此**严格禁止把1557年图纸的整座要塞形状直接标为1547—1549的英军实控Polygon**；即使重合部分也须经史料和考古分层查明。
- 眼下我们能说：英军1547—1549年在该具名堡垒存在驻防；无法凭现有这些网页将1547年围壕逐点配准为经过审定的古代测量多边形。现代保护区围界是**行政保护界**，不自动等于16世纪英军军界。

## 三、其他优先核验地点

| 地点 | 可靠资料及实控层次 | 目前可画/暂不能画 |
| --- | --- | --- |
| **Broughty Castle** | HES官方历史 https://www.historicenvironment.scot/visit/all/broughty-castle ：英军1547年不经战斗取得城堡，约两年半后苏格兰夺回。 | 保留1547—1549经证明驻点及连续性标识；现代改建城墙绝不能替代1547城堡范围。 |
| **Haddington** | HES官方叙述 https://blog.historicenvironment.scot/2022/07/the-story-of-scotlands-longest-siege/ ；Haddington History Society https://haddingtonshistory.org.uk/the-siege-of-haddington-1548-9/ 指出1548年修筑棱堡约68天、英军离去后夷平，现代遗存有限。 | 1548有据驻军及围城局部点、战事虚线可保留；真实城周工程围界需要考古分层/早期炮堡图定点配准。 |
| **Eyemouth** | HES SM3190与SCAPE英—法工程分期，BL 1557 Cotton 目录 | 1547—1549英军局部据点存在；**现仍无经过验证的1547原堡Polygon**。|
| **其他Lowland Pale堡位** | 来源须逐一联系15—16世纪档案和学术地图，不可凭战事廊道或多个离散驻军点生成凸包。 | 无边界证据者继续来源驻军点及不计面积的地区提示。 |

## 四、验收与下阶段路线

1. 核获并辨认1547—1550年**英方原期的Eyemouth平面图**或可区分英法年代的考古测绘；申请/核实图像使用权限。不得借1557 MS替代。
2. 对BL/HES/NLS地图进行**现代基准校准与误差量化**，另存可回查控制点。若误差超过城堡尺度，维持点位而不发布古代细分Polygon。
3. 查哈丁顿1548要塞原始围壕层及东洛锡安考古证据，对是否能分离城墙、英军围壕、法苏包围区域分别设证据等级。
4. 全部分层继续`area_sqkm:null`、`historical_boundary_confirmed:false`、`fill_authorized:false`，直到取得可审原始几何。P0 #46 不能因“修好source ID”而关闭。

**本轮已完成**：修正2处错误遗址来源、补2处官方遗址直链、追加现存GIS非测量区追溯说明与保护测试；**尚未完成**：1547—1549满足#46标准的真实英军控制面。任何下一任编辑须首先核对这些档案编号，避免在同名地理对象上重复犯错。
