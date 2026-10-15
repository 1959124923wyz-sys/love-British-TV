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
