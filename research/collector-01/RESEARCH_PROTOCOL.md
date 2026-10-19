# 爱英TV · 信息搜集人1号：研究与数据入库规范 v0.1
更新：2026-10-11｜工作分支：`research/collector-01-foundations-20261011`｜状态：研究工作约定，待维护组审核合并

## 研究目的与范围
研究英格兰、苏格兰、大不列颠及联合王国不同历史国家／政府、特许公司、商人和代理机构参与殖民扩张、政治统治、土地攫取、跨洋奴隶贸易、强制劳动、税收与资源提取、军事暴力，以及受影响群体的抵抗与独立进程。
1490年代至当代是主图浏览范围；1490年前重要背景进入 `prehistory`，不能因为地图起点而将其说成“不存在”。十年刻度是 UI 导航，不可用来覆盖精确事件日期。1707年前不得笼统把英格兰或苏格兰行为称为“英国政府”。

## 分离五种证据对象
1. **历史事件（event）**：可陈述的行为、发生时间、地点、涉事主体，具有独立的事件ID。
2. **政治控制（control_claim / territorial_state）**：声称／获授权／曾登陆／贸易设施／有效占领／保护国／公司统治／非正式影响分别编码，禁止画为同一种殖民地填色。仅有宣称不得发布实际统治 polygon。
3. **经济流动（transaction / flow）**：区分合同条款、计划收益、海关贸易总额、政府财政收入、支出、私人利润、奴隶主补偿、人口运输；只归于明确时间与主体。贸易额≠殖民利润。
4. **影响与责任（impact / attribution）**：受影响人口、死亡、迁徙、剥夺等与政令／军事行动关系须列证据；饥荒或死亡不能未经分析全部归给某主体。
5. **史料论断（claim）**：一条记录可以含多个独立论断，每个论断绑定来源、原文定位、判断类型（直接记载／研究解释／争论）。

## 最低资料字段
`id`（永久唯一）, `title_zh`, `year_start`, `year_end`, `date_precision`, `political_actor_at_time`, `category`, `claims[]`（statement, source_ids, support_type）, `source_ids[]`, `geometry`（geometry_type, certainty, coordinates），`territorial_control`, `quantities[]`（value, unit, historical_year, account_type, beneficiary, derivation, confidence）, `significance`（1/2/3、理由、审核状态）, `editorial_status`, `open_questions[]`。
- 未知数用 `null`，不可用0、不许凭现代城市中心点冒充真实事件位置。
- 争议位置用 `geometry_type=none`、多候选区域或带不确定范围的虚线；地图坐标系用 WGS84，前端现有 Leaflet 是 [lat,lng]，GeoJSON 是 [lng,lat]，必须转换并注明。
- `source_ids` 解决关联，`claim.source_ids` 解决逐句责任。文献目录须记录标题、作者／机构、发表时间、URL/DOI/档案馆索引、获取日期、来源性质、权利状态（未核查不得批量复制）。
- 重要性与证据可信度完全独立；参考 main/docs/EVENT_VISUAL_HIERARCHY.md。

## 核验与出版闸门
- **lead**：线索，尚未核对原始出处。
- **source_checked**：核对过至少一份可靠材料，记录其真正支持的论断。
- **cross_checked**：关键时间、地理、当事人由独立资料核查；或明确说明没有第二份独立证据。
- **editorial_approved**：审稿人确认适合发布和地图语法，才合并 main。
- 单一机构消息引用其自身科研论文，不能机械算成两份独立证据。
- 计算区间时保留原始数值、历史币种及口径、运算表达式；不得随意折算到“今天英镑”或将货币与人数混算。
- 每批资料单独 Git 提交，`PROGRESS.md` 记录文件、进展、未决问题；不得改 main 或自动发布。维护者审稿后独立发 PR／合并。
- **可视化伦理**：既展示殖民剥削和当地反抗，也不把被奴役者当商品流量；从历史文书带出的贬损词只作文献分析，界面统一使用尊重当事人的语言。

## 当前网页兼容
main/data/atlas-1497-1500.json 是一期演示接口，不是全项目通用 schema。研究文件暂存此分支，不强迫 UI 立即迁移。后续由维护组通过数据转换器将审核记录并入新版数据结构。
