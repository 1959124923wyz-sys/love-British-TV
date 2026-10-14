# Issue #46｜2026-10-14 逐点军控原档与考古测绘第二轮实证报告

**状态：地图真实英军史实 Polygon 仍为0；研究来源和现代真实考古 GIS 取得3块。Issue 46保持P0 OPEN。**
研究分支：`research/issue46-rough-wooing-cartography-20261013`；PR #50；未编辑`main`生产网页/地图`data`。

## 一、已经能用史料断言的1547—1550事实（不使用任意缓冲区）
| 史地对象 | 最重要的直接证据 | 可以得出的结论 | 不可得出的结论 |
| --- | --- | --- | --- |
| 罗克斯堡 Roxburgh 1547 | 1547-10-15 Grey送Ridgeway原图，Belvoir→NRS RHP6075；RCAHMS 1956 Fig517；HES 2006–09 DGPS/GIS套合 | 英军曾建新炮堡，约110m×65m；“每英寸40英尺”原图尺度；堡内有门、壕、山地测绘锚点 | 不能把整座约320m×140m旧山堡遗址/SM1718保护区画成1547英占；不能凭尺寸制造矩形 |
| 罗克斯堡 1545 | HES引Hertford勘察旧城堡废墟 | 1545仅知旧址已毁旧城堡被英军勘察 | 1545**尚不能证明**1547新英军炮堡已经驻守 |
| 埃茅斯 Eyemouth 1547—1550 | 1997 Caldwell/Ewart考古与NRS RHP6075英堡原图索引 | 确认1547英军第一期土垒及1557法军后期工事是不同阶段 | 不许拿英国图书馆1557法军图或HES SM4577 Corn Fort保护区当1547英堡历史城墙；SM3190现代区域亦非古实控界 |
| 邓格拉斯 Dunglass 1548—49 | HES SM3191 French Camp考古记录与Belvoir原图索引 | “French Camp”后世名称掩盖了1548—49英军三角工事事实 | 未得到历史墙体原始坐标，现代保护范围不能染成真实1548英军占领面 |
| 哈丁顿 Haddington 1548—49 | HES围城研究、BL Add MS32657七月军官书信 | 英军驻城有具体日期与军官，不是打完Pinkie后占据全部东洛锡安 | 已经失传/未获的原堡垒墙线不得用后世城市界重建为精确Polygon |
| 1548驻军网络 | BL Add MS32657 ff28r–32v 1548-07-20粮秣送达清单 | 同时证实Eyemouth / Roxburgh / Hume / Berwick / Louther Castle及指挥官构成**有军粮往来的节点** | 不能将物资清单变成准确车队路线、补给走廊土地实控或1548年末占领状态 |
| 1549罗克斯堡继续通信 | BL Add MS32657 ff56r–58v、63r–64v（英旧式日期1548/9一月） | 英军自Roxburgh发信的时间证据跨至1549年1月 | 不能无原件和后续军令证明1549每月驻军不断档 |

## 二、这轮新增可追踪数字化来源
1. `ROXBURGH_1547_GIS_PRIMARY_PHASE_AUDIT.json`：区分HES 2006—2009四类真实测量集（航空判读、LiDAR、差分GPS地形、土垒实测）；记录1545旧城堡废墟→1547新英堡分期，要求先取原GIS样线。
2. `ROXBURGH_1547_ORIGINAL_PLAN_GCP_REGISTRATION_SPEC.json`：原图比例尺40英尺/英寸、Tweed/Teviot河、门、壕、井旧址、Bell Mount等图像套合候选锚点；原始图片和每个锚点坐标尚未获取，不能声称已配准。
3. `SCOTTISH_FORT_PHASE_AUDIT_20261014.json`：三处军堡考古阶段与地图准入清单；纠正1557法国堡退回1547英国版图的时代错误。
4. `BL_1548_1549_SUPPLY_AND_FORT_CORRESPONDENCE.json`：英国国家图书馆**真实一手手稿收藏号与卷内叶码**；仅官方馆藏目录确认，未读手稿全文。
5. `NRHE_KNOWN_SITE_EXTENTS_DISCOVERY.json`：GitHub Actions单次真实访问苏格兰官方NRHE Known Site Extents来源页；报告 **HTTP 403**，没有取得图形。官方数据库介绍 https://www.trove.scot/explore/datasets/national-record-of-the-historic-environment-data-for-download ，遗址范围与法定保护区概念不同，单独处理，任何一者都不证明1547军堡。
6. `validate_historic_occupied_polygon_gate.py` + CI `issue46-boundary-gate-once.yml`：阻断HES现代Polygon直接混成1547实占；至少需原图、地理配准GCP、实际残差、年代、考古期别、许可、审核人。**GitHub Actions 38497938339 运行成功，3处现代保护面全部拒绝冒充英国历史控制。**

## 三、获得史实精准空间面的最短归档路线
- **Roxburgh优先：** NRS RHP 6075 取得Ridgeway 1547全分辨率带尺度图，HES提供RCAHMS 2006—09 DGPS地形/1547炮堡原图GIS复合标记，追溯Fig517每个线段的遗址对应和误差，然后再绘历史围墙Polygon。
- **Eyemouth第二：** 正版1547英军土墙平面图及Caldwell/Ewart考古1547一期 vs 1557法国二期原始矢量/原图；发现仅第2期需拒绝。
- **Dunglass第三：** 取1648? **正确为1548年** Belvoir基地原图+ HES考古三角土垒测绘；排除18世纪gazebo及晚期步道。
- **总战线：** 即使取得上述若干真实堡垒围界，也不能自动推导连接堡垒的整片英国军占地。需逐地取得实际驻军税收/司法/控制地界的文书和位置边界；军事线路只作线或战区虚线。

## 四、优先文献档号与在线证据
- NRS RHP6075：Belvoir时期Rough Wooing数幅英军堡垒图，馆藏具体待核；爱丁堡大学博士论文 *Guns in Scotland* v2 p490 n105 https://era.ed.ac.uk/bitstream/1842/6848/2/253253_vol2.pdf 。
- HES NRHE 58412 Roxburgh：https://www.trove.scot/place/58412?page=2&tab=related-archives ，旧Canmore转移后的历史记录:https://canmore.org.uk/site/58412/roxburgh-castle （旧Canmore已退役，不依赖其API）。
- HES NRHE 58422考古工程旧摘要：https://canmore.org.uk/site/58422/roxburgh
- HES历史解读 PDF：https://i.rcahms.gov.uk/canmore-pdf/WP00005062.pdf ，确认1547堡垒和1550撤军、2006—09高分辨GPS，而不是古墙GIS导出文件。
- BL Add MS32657 https://searcharchives.bl.uk/catalog/040-002026717（目录可读，原手稿未读），Add MS33256 https://searcharchives.bl.uk/catalog/040-002027422（1548围城书信抄本线索）。
- Caldwell/Ewart, *Post-Medieval Archaeology* 31 (1997), DOI:10.1179/pma.1997.002。
- NRHE Areas已知遗址空间范围说明 https://www.trove.scot/explore/datasets/national-record-of-the-historic-environment-data-for-download ；古遗址面积非法律保护边界 https://www.data.gov.uk/dataset/d98aae8b-1de9-4563-a18c-d3490550872e/national-record-of-the-historic-environment-scotland-nrhe-areas ；技术规范 https://smrforum-scotland.org.uk/wp-content/uploads/2016/11/SHED-Technical-spec-1_KSE-Polygons-2015.pdf 。

### 目前尚未收到的原始档案
原始RHP6075清晰扫描**未收到**；BL Add MS32657手稿正文**未收到**；1547 Roxburgh考古逐顶点矢量**未收到**；NRHE Known Site Extents原始ZIP由于官方网页自动访问403 **未收到**。馆方询价/邮件申请草稿见 `ARCHIVAL_IMAGE_AND_GIS_REQUESTS.md`，未发送。**经确证16世纪战争占领Polygon仍然=0，Issue 46保持OPEN。**
