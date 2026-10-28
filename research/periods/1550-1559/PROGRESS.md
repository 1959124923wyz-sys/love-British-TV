# 第七章调查｜1550—1559 · 阶段保存（2026-10-13）

分支 `research/territorial-1550-1559-20261013`，从GitHub `main`独立创建，研究对接第六章PR #27的 `research/periods/1540-1549/TRANSITION_1549_1550_RESEARCH_SEED.json`，**第六章PR尚未并入main，本支不会覆盖网站`data/`、`app.js`和网页**。

调查优先级：
1. 1550英王布洛涅撤出和苏格兰Broughty、Eyemouth、Lauder、Forthill撤军，确保1549→1550续存但年末及时退出。
2. **1558年法国攻取英属Calais与Guînes**（重大领土逆转），有明确史料年份后才清除英王Pale旧区，Pale疆界需实测方可制作准确Polygon。
3. 爱尔兰1556–1557 Mary I的Queen's/King's County法定殖民、Maryborough与Philipstown堡垒，及O'More/O'Connor反抗；县名法定覆盖≠整郡实控。
4. 英王北方航海与1555 Muscovy Company（贸易公司／航线按证据），不擅将俄国、北美或西非沿岸涂为英国领土。
5. 财政收益、和约赔偿、土地没收、成本按概念单独记录，查不清保持null。

本目录的研究均作为候审，历史版图有不确定边界用虚线/点，不计伪面积。随查随提交并保留增量检查。

## 2026-10-13｜分阶段提交与交接（已实际保存到GitHub）

独立研究分支：`research/territorial-1550-1559-20261013`，Draft PR [#33](https://github.com/1959124923wyz-sys/love-British-TV/pull/33)。主站main没有因调查被修改。

- 第一保存点 `a468dcaa1b30`：创建研究目录与跨年代基本要求；`186596d2ea80`：第一批24条布洛涅、苏格兰、加来、爱尔兰、几内亚、俄罗斯官方/学术史料。
- `769eaf3f3b57`：9个1549年既存身份、1550和1558的实际控制变化、1550—1559十份年末快照；1550 Eyemouth、Lauder、Dunglass、Hailes仍有不确定性。
- `de5cdf78268e`：22事件；`41b9274f1f30`：15个地理Point；`ef82f6755c1d`：前期8片虚线地理参考几何不作增面积；`0b609a91d8ba`：11条军政变化地理点。
- `c47225c4ddb4`：追加10条来源确认爱尔兰Fort Protector与Fort Governor建造早于1556殖民法令；对现代Risban/Nieulay确认为地理位置参考而非1558实测古墙。
- `2213f778ecb2`：两处爱尔兰1556法定殖民郡与既存英军军堡、O'More与O'Connor抵抗、殖民地产剥夺关系严格分开。
- `7b5a23fc1ce7`：六组1553—1557贸易航次及1555年押运五名被奴役者；海路未取得准确古代数据，GeoJSON路线为null，俄国和葡萄牙Elmina不标英属地。
- `818efbc4706f`：八类和约担保、公司资本、私人赎金、殖民夺地和人口奴役；绝不合并成“英国殖民总利润”。
- `02a62b4e2da0`、`3cfc0c6785d4`：从PR27及已发布第五章补足根西与七个老政治身份对应来源，史料索引增至**45条**；`d1a626fd26e2`及`3ec3c0cff3a0`为每个政体Point正确填源。
- `3125a6f61cdd`：主编候审Atlas 22事件、15地点、37个直接引用的Source ID；`dac1dca1f323`：修复Nieulay的法国1558起控制年份与地图颜色同步。
- `f8b80ef0eed5`：16项档案工作队列，其中7项优先；`c56a1173661b`：1559→1560继承历史种子，加来与吉讷仍属法国。
- `df7a555b2e08`：Python历史地图数据检查；`e437cd554301`又加入Risban/Nieulay从1558转法与预览变色硬规则。
- `7f578fbdc750`：Leaflet独立1550s时间轴研究地图；`b1afd404b085`：单独的**手动**研究Python+Node GitHub工作流（不自动发送失败邮件）。
- `e4c3109e0861`：主编正式交接说明；`07f418f3f4a4`：研究目录索引。

### 完成度和剩余工作

远端数据已重新读取做独立一致性断言：**PASS，0处数据结构/年代/来源缺失问题**；45条来源、22项事件、15地点Point、11项变化Point、8个继承参考区、9个持续政治身份、10张年末快照、8项财政对象，新增经认证的1550s精确实际英国控制Polygon=0。**这不是1550s手动GitHub Actions真正运行成功，也不包括浏览器视觉验收。**

P0未核：加来1558旧Pale实测古界、1558吉讷确切陷落日、爱尔兰1556逐宗没收地契范围与实际驻军区、1550苏格兰Eyemouth/Lauder等短期驻军末日。查不到时保留虚线/年份存疑，无需编造准确平方公里。

**下一位主编**先看`EDITOR_HANDOFF.md`，仅把审定的研究数据增量与第六章PR27衔接；不能用整个研究包覆盖main当前已有地图UI。正式发布由B线维护。


## 调查员3｜第七章地图连续性深挖增量（2026-10-13）

此节替代上方原版的计数结论；仍是原研究分支PR #33待主编审核的**新增证据**，不已上架。新批次来源扩展 `45→62`（初次 `718679f8`，HES/BL新批 `82b3d2e3`），事件 `22→29`、地理参考点 `15→18`、变化Point `11→15`、逐页原档行动任务 `16→23`，P0为13项。

地图问题具体突破：
- **1558 Hammes**：依据Royal Collection RCIN721026，发现漏记的Calais Pale沼泽城堡最后英军撤离；地点不能从现代Hames-Boucres镇中心造Pin，主资料以历史档案事件及全十年持续状态保存，历史地点待配准。
- **1550/1557 Eyemouth**：考古摘要确定英军到1550夏的旧堡；1557出现法国援苏的新堡（1559年谈判撤出）。苏格兰仍独立。原第六章误传Hailes占领未明亦已按官方HES同年1548收复修订进第七章。
- **1558 Calais逐次失地**：王室收藏馆引1558年1月4日Grey信表明Newnham桥和Rysbank已失；1月7日军事夺城／1月8日市档收复约定区别；Guînes及Hammes随后的抵抗与撤军不同步。发现RCIN Guînes城墙位置与同期BL Cotton图相矛盾，禁画未经校准Polygon。
- **三处新增苏格兰防御变化**：1550年Dunbar法军新堡、1556年Inchkeith苏法联合军堡、1559年Leith法军筑垒（仍无精确原墙地图）；与1557法国Eyemouth形成苏法盟军要塞变动链。合法苏格兰主权没有变成法国主权，亦没有英王在苏格兰扩张。
- **1556爱尔兰殖民**仍按两处从1540年代存在的军事堡垒加法定设郡和抵抗，并不准用现代Laois/Offaly完整县界冒充1556年英军实控。

实际提交：`TERRITORIAL_CONTINUITY_GAP_AUDIT_COLLECTOR3_20261013.json`（11控制episode、10年度控制对照）、`SOURCE_REGISTRY.json`、`CHRONOLOGY.json`、`ATLAS_REVIEW_CANDIDATE.json`、`MAP_DELTA_1550_1559.geojson`、`POLITICAL_CONTROL_SITES_1550_1559.geojson`、`CONTROL_TRANSITION_1549_1559.json`、`TRANSITION_1559_1560_RESEARCH_SEED.json`、`ARCHIVAL_ACTION_QUEUE.json`、`EDITOR_HANDOFF.md`，以及更新 `validate_research.py` 考证口径。人工原始16世纪手稿没有完成独立全面核查；对于保护区坐标和原时代相差的现代墙线继续 `fill_authorized:false`，可用精确新古代殖民实控Polygon = **0**。

主编具体发布审核以同目录最下方的`EDITOR_HANDOFF.md`追加“调查员3”逐年表为准；旧本文历史原稿与PR33旧文字计数仅属当时基线。编审完毕前**不修改main生产Atlas及JS、不启用自动GitHub校验**。


## 2026-10-13｜战争动态分层地图模型新增保存点

主编请求将“主权底色／英法实控区／蓝紫等两军条纹战区／孤立要塞”方案实际写入第七章支线，而非仅口头提案。现已创建`WAR_MAP_SPEC_1550s.md`、`WAR_CONTROL_ZONES_CANDIDATE_1550_1559.geojson`、`WAR_CONTESTED_ZONES_CANDIDATE_1550_1559.geojson`、`WAR_FRONT_NOTES_1550_1559.json`及`WAR_ISOLATED_OUTPOSTS_CANDIDATE_1550_1559.json`。共6控制候选、4争夺候选、15阶段变化、10年末状态、8个孤立军堡。

史料状态与界线坐标分离：仅复用旧加来Pale虚线Polygon作为候审**示意参照**，没有凭想象生成苏格兰控制走廊、爱尔兰大半个郡或哈姆堡未知古址。禁止据此计算任何实控面积；首版自带`fill_authorized:false`。第七章准确的趋势为英军1550苏格兰撤退、1558法国收复加来；爱尔兰1556殖民设郡法权不等于完整军事占领。编辑可在PR #33直接点击JSON/GeoJSON审核使用，不需用户编程。

旧文件中62来源、29事件、18地点等计数不因新**衍生候审战区**而自动增加；候审区是相同史料的战争制图表达方案，绝非7+新的历史发现。等待主编再审核，未触发GitHub Action，未修改main或前端。