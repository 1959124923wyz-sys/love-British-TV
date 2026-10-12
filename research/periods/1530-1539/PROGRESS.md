# PROGRESS｜1530—1539年调查接班

日期：2026-10-13；`research/territorial-1530-1539-20261013`；基于当时最新版已部署的`main`创建独立分支。**远端GitHub已分批保存，主干与正式Pages不受调查分支更动。**

## 已建立且远端提交保存的资料

- `SOURCE_REGISTRY.json`：源自已检索的官方/学术/档案索引 **42项**，未声称直接读取任何16世纪原始手稿。里程碑 `dd947710a77c`、`6ea27ec315bb`、`18a03149ce67`、`d6d702f1f6c6`。
- `TRANSITION_1529_1530.json`：主干旧7地点全部继承 + 独立苏格兰政治关系 = **8个稳定身份**、**1530—1539十份年度快照**、3组局部新地图研究对象。提交 `86e78aae51af`。
- `CHRONOLOGY.json`：**24项事件**，以1534 Dublin未陷、1535 Maynooth攻陷、1535/36 Wales法律改革、1537爱尔兰语言衣着强制同化法令、1536 Hore纽芬兰远航、1539海防工程为重点。提交 `b80f12d9f16b`、`e5e02687be48`、`5d6db36f6f36`。
- `MAP_REFERENCE_1530_1539.geojson`：**8个轮廓**：旧7区域原样继承+威尔士现代地域轮廓虚线法律地理参考；无实测1520年代外边界冒用。提交 `8e12954618b6`。
- `CONTROL_EPISODES.json`：15类政治、军事、宗教法权与独立苏格兰关系，0新增有效历史Polygon，提交 `c0faba86baec`。
- `CONTROL_CORES_1530_1539.geojson`：3英王城市Point；`POLITICAL_RELATIONS_1530_1539.geojson`：4特殊政制Point；`EVENT_SITES_1530_1539.geojson`：9事件点，保存 `67855fe43fb2`、`f8ef041fec1f`、`c83e21e36db2`、`ead4afc8904e`。
- `MAP_DELTA_1530_1539.geojson`：梅努斯局部占领Point、威尔士现代轮廓法律制度变化说明，不等同新殖民国土。提交 `3c98555088dd`。
- `ATLAS_REVIEW_CANDIDATE.json`：**24事件、7延续地点、41直接引用源**，供主编审核，不覆盖正式发布。提交 `91bfcb06a174`。
- `FINANCIAL_EVIDENCE.json`：七项带账目类别与档案号的财政、罚没、宗教地产、军事支出研究对象，具体金额未原档验收，全部明确留null。提交 `5096f32d3f47`。
- `ARCHIVAL_ACTION_QUEUE.json`：**17条**P0/P1原件查证任务，9个P0，提交 `1e495e337c0e`。
- `validate_research.py`（提交 `43f32a7171bd`）与GitHub Actions单独校验工作流（提交 `cf0735e0d1e0`）。

## 审计标准

检查旧七地不消失、苏格兰独立、图尔奈不能复活、1535年Maynooth与1534年Dublin、24事件均有来源及年份、旧7块轮廓坐标不能被随意修改、威尔士现代参考不能冒充古界、25项以内新事件不能凭空创造殖民Polygon、爱尔兰法权与当期实控分层、财政没有虚构货币数值。**CI实际运行状态须以GitHub Actions结果为准。**

## 剩余疑点

原始Calais 1530年代边界、Irish Pale和O'Connor地区实际驻军、Kildare没收庄园位置、威尔士边区旧领主地界、Richard Hore精准航程、1537衣着语言法的实际执行，均在`ARCHIVAL_ACTION_QUEUE.json`列明，不要为了完成地图就编造精准多边形。继续确保下一十年1539→1540递交已核实的7个名称与状态。

## 后续加深并已分批提交（2026-10-13）

- `df6082a942d2`：`interactive_research_preview.html`，独立Leaflet地图，包含逐年时间轴、概略地理、多政治类型、事件点击详情、双击平滑定位和高亮（不放大）。
- `c71410a9695c`：研究CI增加提取HTML内联JavaScript、Node `--check`语法校验；原自动历史结构检查保留。
- 最终CI状态应以GitHub Actions当前提交实际结论为准。先前版本`df6082a942...`已确认研究数据、跨年持续性及旧UI合同三类PR检查均成功；追加语法检查等待相应提交运行后核对。
- 本独立研究分支PR #25已建立： https://github.com/1959124923wyz-sys/love-British-TV/pull/25 。
