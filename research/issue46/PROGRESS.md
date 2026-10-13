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


## 2026-10-13 21:02起｜第二轮：真正下载官方空间几何并上线研究预览

- 提交 `2ccdc9e10643f3a001622f76046e56e85e1906f6`：`fetch_hes_scheduled.py` 实作直接查询 HES ArcGIS REST，校验编号/地理偏移/GeoJSON闭合性/审计字段；不使用任意 buffer/hull。
- 提交 `42c7b144731cff9941911a8027fe82beb01f1e40`：**仅本研究分支、仅工作流文件首次变更触发**的一次性 GitHub Actions `.github/workflows/issue46-hes-once.yml`（附手动触发）；不启用任何定时搜索/巡检，不影响1550s独立QA。
- GitHub Actions **38402612677** 已真实成功执行 `https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/38402612677`。官方三个 Polygon 已由 GitHub Actions bot 实际上传到 `research/issue46/HES_OFFICIAL_MODERN_SCHEDULED_REFERENCE.geojson`，在 GitHub 远端读取并校验：3个ID齐全；SM3190 Eyemouth、SM3191 Dunglass、SM1718 Roxburgh。
- HES ArcGIS返回形状为Polygon，原始采集精度：**SM3190 10m内、SM3191 1m内、SM1718 10m内**。注意这些都是**现代遗址法律保护多边形的定位精度**，不是1547—1550英军原墙测量精度。地理源 `https://inspire.hes.scot/arcgis/rest/services/HES/Scheduled_Monuments/MapServer/0`；HES空间数据 OGL v3.0；保留正式署名。
- 提交 `4adb656f79147159bf3675b5db909791a2ed9a8d`：`ARCHAEOLOGY_REFERENCE_PREVIEW.html` 作为研究工具，通过HTTP相对路径加载已入库三处**真实现代考古保护范围**，时间轴仅切换三处英军史实**参考点**，虚线展示现代保护面；无法被误认英国1548实际面积。
- 工作流运行后已经直接从远端逐项读取 **三处真实Polygon坐标**，并检验全部`fill_authorized=false`、`historical_boundary_confirmed=false`、`area_sqkm=null`、历史Polygon数量仍为0。**Issue #46未达成真实英军历史控制边界上线，严格P0 OPEN**。

### 已明确的关键“剩余一步”
取到现代官方界并不足以通过历史疆界审查；现在应该请求RCAHMS/HES 2006—2009 Roxburgh DGPS/GIS **其中1547炮堡的具体围界折线**（从古城遗存保护区里拆出~110×65m英军堡），以及NRS RHP6075原图像/许可。取得这些文件后用原图GIS配准/误差审计产生`verified_occupied_area`，再交主编整合。现代遗产保护面不得移入`war-occupied-zones-1540-1549.geojson`作为实控面。
