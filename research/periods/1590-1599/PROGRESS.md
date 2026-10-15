# 爱英TV 第十一章1590—1599研究：阶段保存与复工点

日期2026-10-15。分支 `research/ch11-1590-1599-violence-colonial-control-20261015`。
**GitHub Actions 38666535009 success**，https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/38666535009 。

### 当前成果已保存
- 研究官方、大学与初级档案 **51来源**（`SOURCE_REGISTRY.json`）。
- 史实 **35事件**（`EVENT_CANDIDATES_1590_1599.json`）及自动生成Atlas`editor_import/ATLAS_EVENT_REVIEW_CANDIDATE.json`。
- **32行**财务/人口伤害/被奴役人员截获及否证口径（`editor_import/PLUNDER_VIOLENCE_ECONOMICS_LEDGER.json`）。
- **9现代地点**，引出10个地图可定位事件和25个未确定古战地的纯史事。
- 1590–1599 **10个年末政治/堡垒状态**，**13个转移**，原15世纪地图依然缺带配准的实控Polygon（0）。
- **9档案地图/损失明细索引，16条未竟史料动作**。
- `editor_import/HISTORICAL_DETAIL_NOTES_1590_1599.json`35个来源绑定历史文献可展开详情；`VIOLENCE_AND_CONTROL_DELTA_1590_1599.geojson`年变化事件；`VIOLENT_EXTRACTION_ROUTE_REFERENCES_1590_1599.geojson`空线路，因为缺少逐段实测航线。
- `editor_import/EDITOR_IMPORT_README.md`完整导入主编说明及本目录`EDITOR_HANDOFF.md`历史接力。

### 核心新证据保护
- 1591 Cavendish桑托斯圣诞洗劫，1592年初圣维森特焚掠、1592英私掠船夺载奴葡萄牙船（非洲人去向和商业获利未知）、1595 Lancaster占据巴西累西腓约30日且抢糖/棉花/巴西木/东印度货物；来源巴西国家图书馆和Cambridge LARR。
- 不从Hawkins 1562–69重复克隆任何1590年英国直接奴隶贩售。
- 1590 Bingham焚城驱逐盖尔地方领主、1591奥罗克伦敦处决、1592年迈失明者O'Conor Roe吊死；来源UCC CELT原旧盖尔编年英译。
- 1598圣胡安为英军短期占据/归西班牙，1594—99英军和爱尔兰抗英势力都造成军事伤亡，严禁错误归责。
- 1596 Cádiz被掠王室实际净利未审；该城港被劫物资的西班牙库存与英王战利品调查已定位。
- 1970年代以后重修的古堡与现代市界不能作1595或1598英国实测区域；`certified_true_historic_occupation_polygons=0`。

### 技术自动保存
GitHub Actions `.github/workflows/ch11-editor-import-once.yml` 在研究分支首次变更后单次联网运行（另可手动）；工作流执行纯Python`build_editor_import.py`校验source/chronology/modern sites/finance then commit all generated files to research branch。最末一次通过链接见上。**没有自动后台定时任务，没有修改main**。审校范围为数据结构和来源链接，不等于学界全面审稿及主站浏览器前端验收。

### 复工动作
先以`EDITOR_IMPORT_README.md`直接导入。研究员继续向机构取得16项原始档案，最急1592年船上遭奴役人员去向及1595 Recife实际物资账本；随后关注Bingham1590村落范围与1598 English短期圣胡安堡垒准确历史墙界。任何不能追溯的点或面不填入，必须单独记录源及年份。


## 2026-10-15｜控制疆域概略面补绘：已真实提交（研究地图可直接导入）

本轮解决“研究已有大量史事但地图看不见占驻区”的问题。严格按主站`docs/MAP_FIRST_CARTOGRAPHY_STANDARD.md`准则，新增以下**实际可绘制**地理成果：

1. [`editor_import/APPROXIMATE_INFLUENCE_AREAS_1590_1599.geojson`](editor_import/APPROXIMATE_INFLUENCE_AREAS_1590_1599.geojson)：**2块虚线Polygon**，其一把`main/data/territorial-footprints-1570-1579.geojson`里1488年帕莱地名21顶点边界**原样继承**作为1590年代地理参考，其二以罗利赠地分布于Youghal–Lismore河谷的剑桥/ECU研究为依据，自行绘出**明显声明为手绘研究包络**的Blackwater一带殖民地理带，1598年反殖民战争后从“仍有英国居民控制”的研究参考层撤下。后者不是已测产权边线、前者不是1590年实测军政边境；全用虚线+低透明度，填色不得视作真实控制的主权面积。
2. [`editor_import/TEMPORARY_CONTROL_CORES_1590_1599.geojson`](editor_import/TEMPORARY_CONTROL_CORES_1590_1599.geojson)：**10处真正可视的城市/堡垒面积符号Point**，附官署/考古地点来源、`screen_radius_px`、逐年`year_end_visible`清单。**已证位置≠已证城墙面积**。含1594英军Enniskillen、1590-97 Kilcolman英国殖民庄园主人驻地、1591圣诞Santos临时英军占据、1595短期Recife、1598夏季圣胡安、1599 Cahir事件候选。
3. [`editor_import/CONTROL_EPISODES_1590_1599.json`](editor_import/CONTROL_EPISODES_1590_1599.json) 和 [`editor_import/YEAR_END_CONTROL_RENDER_PLAN_1590_1599.json`](editor_import/YEAR_END_CONTROL_RENDER_PLAN_1590_1599.json)：**10处占驻/庄园控制时间记录和10个已算好的年末地图显示切片**。国家公园管理局明确1598英国San Juan占领行动期**1598-06-16至1598-08-27**；1591 Santos年末有英国短驻，1592撤军；1594 Ennis英国堡，1595归Maguire；1598 Kilcolman和Portmore不再显示英国驻守。
4. [`editor_import/OCCUPATION_RESEARCH_PREVIEW_1590_1599.html`](editor_import/OCCUPATION_RESEARCH_PREVIEW_1590_1599.html)：**独立HTML可交互研究地图**，包含年份滑块、研究虚线面、城镇面积符号、短期占据选单、史料弹窗和爱尔兰/大西洋/全球视角（无主站更改）。下载后在浏览器打开；网络用于载入地图JS/CDN与底图。
5. 考古支持进一步加强：NMI / `excavations.ie`确定1594 Enniskillen现代古堡坐标 **54.346171,-7.644771**；Spencer Kilcolman现代遗址 **52.252298,-8.614258** 且1598年被焚；Blackwatertown现代考古地点是**未发现历史原堡遗迹**的近旁点，不假称Fort精确GPS。
6. 来源总量 **70**、事件**36**（增加1598 Kilcolman古堡焚毁事件）、新增17处年变记录、编绘2块参考Polygon和10个城市点；**符合史料认证的真实英国陆地占领Polygon仍为0，研究Polygon不计面积**。每一条参考面均有原出处、年份、不确定性、来源ID和权属类型。

实际机器QA记录见`editor_import/EDITOR_QA.json`与最新单次Actions。**无精确测绘时拒绝假装得到真实占领区，但已实际画出项目批准的虚线研究面和城市面积符号**。
