# Issue #46｜三处官方GIS保护图层与1547–1550年真正英军工程界：优先取图清单
2026-10-13 · 这是档案索引，**法定保护区≠1547–50军控区**；截至本稿没有经过古图配准许可的实控Polygon。

## 可用“真实坐标”追索三处一手工程遗址，而非任意缓冲圆

### 1. Eyemouth 英军1547 / 法军1557 两期炮垒——HES **SM3190**，非SM4577

- 苏格兰历史环境局正式保护地 **Eyemouth Fort SM3190**：https://portal.historicenvironment.scot/designation/SM3190 ，参考地英国格网 **NT9432 6484**（源自SCAPE Scottish Borders Map13，SCAPE资料PDF：https://scapetrust.org/wp-content/uploads/reports/elothian.pdf ；此坐标为现代可考古中心，不是古墙）。
- 另有 **The Corn Fort, Eyemouth SM4577**：https://portal.historicenvironment.scot/designation/SM4577，保护的是相距约250米的另一处可能中世纪海角堡垒，不是1547英军在 King's Mount/Fort Point的炮垒。用户现有来源绑定如为SM4577须先纠正。
- Edinburgh考古学博士（《Guns in Scotland》vol.2 p.486, p.490）指出1980/81年开掘英军 **1547第一期实存壕沟、反斜坡、夯土堡垒**，竟验证今天英军土垒的剖面形态与原构造基本一致；1997 Caldwell/Ewart鉴定 1557法军增建与1547英军旧线不可共用一组多边形。
- 1547原图NRS RHP6075、与原图对应的实地发掘面，需要从HES/考古原论文中分出“英语第一期防御线”，不能直接把跨多时代的SM3190法定保护边界当1547古实控界。
- 机构考古总纲明确16世纪苏英、苏法炮垒是当时创新堡垒体系：https://scarf.scot/regional/sesarf/9-medieval/9-5-conflict/9-5-1-fortifications/
- 可查政府开放地理保护层许可 HES + Crown Copyright OGL v3，但还要单独核对实际1547配准图及原样复刻版权；现代保护地作为**参考层**可以申请审定，非直接著作人授权的古墙Polygon。

### 2. Dunglass 英军1548—1549堡垒——HES **SM3191**（正式名 French Camp）

- https://portal.historicenvironment.scot/designation/SM3191
- 现代国家格网中心 NT 76318 71717，约55.9379,-2.3807，官方列入1548–49英军营垒（名字 French Camp 不等于法国当年占领）。
- 东洛锡安古迹公报记录地上土垒和壕沟围成不规则**三角形**，包含后建Gazebo、滚球场和步道；现代附加工程须排除；法国间谍1548年12月记录该英堡规模较小。
- 地理证据：HES修订2018 https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:decision,500001983 ，古迹来源： https://www.spenergynetworks.co.uk/userfiles/file/Branxton%20Substation%20EIAR%20Vol%20I%20Chapter%2010%20Archaeology%20and%20Cultural%20Heritage.pdf 第10章pp.10-23—24（引用政府遗迹记录）。
- 英军同时代平面图NRS RHP6075，须取图后和地上三角土墙配准，避开现代园林围界。

### 3. Roxburgh Castle 真正1547炮堡——HES **SM1718**

- https://portal.historicenvironment.scot/designation/SM1718
- 英方1547炮兵堡 **110×65米** ，只占广阔旧山城一部分；1547 William Ridgeway军图已由官方2010研究GIS与DGPS现场勘测匹配；HES https://canmore.org.uk/site/58412/roxburgh-castle
- 具名对应遗迹控制点：城堡中心NT71307 33729；早期城墙残片NT71282 33729、1547原图井迹近NT7128 3368；现代保护区含旧城墙及旧城廓，不可用完整SM1718剪裁成英军统治面。
- 1547古图复刻（Figure 517, 图示键Figure 518）可在HES Trove Castle图集寻找： https://www.trove.scot/place/58412；NRS RHP6075更适合取得高质量原图和分图许可。
- 古图与2006–09考古档案 GIS 的数据具体索取项：`1547_artillery_earthwork_polygon`, GCPs, DGPS/RTK survey, 1547图配准误差，原图/制图许可，以及开始结束日期。**不能凭两个边长人为构建长方形。**

## 实际工程落实的先决条件

1. 获取 HES 历史遗迹保护面GIS的授权数据（SM3190 / SM3191 / SM1718）作**只读研究底层参照**；承认它们未必代表古城墙。
2. 获取 NRS RHP6075 图像；NRS官方允许申请图影，2026年报价表指现有数字副本50便士一张、新摄制图从每张£2.50起，另有最低£15订单金额，需按当次馆方最终报价：https://nrscotland.gov.uk/publications/printing-and-copying-services-at-national-records-of-scotland/ 。馆方确认大多图纸在网上不能直接看到原件，须预先申请：https://www.nrscotland.gov.uk/learning-and-events/research-guides/maps-and-plans/?section=access-to-maps-and-plans
3. 逐图识别原文 England/Scotland/France军事阶段；要求实际可复核的围界+测量误差，做英军 **仅堡垒实际实占面积**的动态Polygon。
4. 没有以上成果，公开层只能画军堡参考图和示意围攻；绝不通过多处堡垒连线拼出1548全苏格兰连续英国领土。

最有价值的档案事实是 **NRS RHP6075同时包含多个英军原始工事图**、**HES三个正式独立遗址编号**、**1547 Eyemouth英军原壕沟现代形态与同时代工事一致**、**Roxburgh考古原地GIS叠合1547原图**。这些给出可审计的实际地形研究方案，而不是另一次依靠UI尺寸造领土形状。
