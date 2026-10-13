# Issue #46｜调查3研究工作日志与恢复入口
日期：2026-10-13。研究分支 `research/issue46-rough-wooing-cartography-20261013`，候审 Draft PR https://github.com/1959124923wyz-sys/love-British-TV/pull/50 。主 Issue https://github.com/1959124923wyz-sys/love-British-TV/issues/46 **仍必须OPEN**。主站 main 无本研究新增Polygon。

## 已经成功上传GitHub的分批成果
1. `784897662fbbf66739e037d4683180752021dc87` — 1547—1550军控原图与逐年史实首次研究文档，锁定NRS **RHP 6075**、Roxburgh史图+考古GPS及Eyemouth两期不同工事。
2. `b4b083381ea29de78fb3a3fc634cf77bb278b62e` — 可机读研究证据队列：7处要塞/城防、5个P0/P1原档行动，`historic_polygon_count=0`不冒称已证古界。
3. `cb7e6001a8bb4d593f59b5b5b1c8d9fa3e6b9c42` — 第六章主站遗漏的Roxburgh英军1547—1549实际驻地 **现代官方代表Point GeoJSON**，不是1547地理界。
4. `f779b34a3d6ed1f3d11923256bfae92e3c7029e2` — 新增独立HES官方GIS编号 **SM3190 Eyemouth / SM3191 Dunglass / SM1718 Roxburgh**，发现错误沿用Corn Fort SM4577不可描英堡。
5. `a9048e1aa0c2e506aa63b9391efc9e2cf60a0c66` — HES公开 ArcGIS REST 记录图层，确认正式英苏军堡现代保护区范围属于 OGL v3.0，保存直接查询字段、三处遗产编号、正确署名和“保护区≠历史实控”硬约束。

## 本次重点核实（避免重错）
- 当代原图 RHP 6075 是 Belvoir原档在苏格兰国家档案馆的摄影复制品；馆方称公开原图往往需要事先提交取件/扫描请求。官方价格另需最终报价。
- HES三处**现代古迹法定保护面积**可据 OGL 数据读取 Polygon；但尚未通过1547—1550原图、发掘期别和坐标残差分割，**一律不能作为当年英占Polygon**。
- **Roxburgh**的已知约110×65米只是古炮堡尺度，不能凭人工矩形替代多边形；其2006—09地形模型与1547图确曾在GIS叠合。
- **Eyemouth**第一期英军1547防垒与1557法国复建范围不同。HES SM4577 Corn Fort相距约250米、可能更早，现有英炮垒需改查SM3190。 
- **Dunglass**后世遗址名 French Camp，但官方文本记1548—49英军营垒，不能从名称推断为法占。
- 英军`pale`是军控据点互援体系及政策理想，**不等于逐年测绘确认的连续英格兰统治国界**。

## 恢复行动（优先真正产出第一片可审计历史边界）
1. 优先通过 NRS `RHP 6075` 取得6幅原时代工事图完整高清件、地图原件年份、分图及转绘许可。
2. 索取 HES/RCAHMS Roxburgh 2006—2009 DGPS/GIS测量对象、已配准1547炮兵堡外墙折线或原测绘图；误差/底图许可必需。
3. 取得 Caldwell/Ewart (1997) Eyemouth 1547英军第一期具体防线和1557法军第二期分层GIS/调查图纸。
4. 读取 HES OGL现代保护区地图 `SM3190 SM3191 SM1718` 做地理参照，不要直接变成英国实际控制面。
5. 最小验收：能够追溯档案页/地图、地理控制点、配准残差、有效年份及行政/军事属性的 **1个真实历史占据堡垒核心Polygon**，由主编选定展示形态、与十年控制台账相连接、执行浏览器与历史审稿。做不到保持Issue开放。

全部成果只在研究PR，不修改正式前端，拒绝用任意半径/凸包“解决”Issue。
