# 爱英TV｜英国殖民扩张历史动态地图

本项目通过可核实的历史史料，按年份和地点记录英格兰、苏格兰及1707年以后大不列颠/联合王国的海外扩张、战争、强制劳动、贩奴、财政提取、土地剥夺，以及当地人民的反抗。对政治权属、实际驻军、交战影响区、海上航线作严格区分，避免把未经证实的土地涂成英国殖民地。

**[打开正式历史地图](https://1959124923wyz-sys.github.io/love-British-TV/)**

## 当前状态

- **正式发表**：1497—1599年，共10章。逐年导航、历史事件、长篇专题、史料与地图图层均以 `main` 分支为准。
- **正在研究**：1600—1699年，分爱尔兰/不列颠、美洲/加勒比、非洲/亚洲/海上扩张三组推进；这部分研究分支尚未正式发表。
- **正式章节索引**：[`data/chapters.json`](data/chapters.json)。**专题文章索引**：[`data/stories/index.json`](data/stories/index.json)。
- **网站交互**：使用已经批准的桌面地图规范。两个可独立启闭的「版图」「事件」开关、现代地名参考底图、按年更新、历史事件与来源点击均需保留。

**制图原则：** 只有证据充分的占领和政治关系才可作为实际统治判断；尚无测绘依据的版图须以虚线/不确定示意表示。现代OpenStreetMap道路和地名只作当代位置参考，不代表16世纪的国家或疆域。进军线、袭击区、奴役航线、法理统治与实际占领面积不可以混算。

## 研究和维护从哪里开始

| 需要做的事 | 唯一优先入口 |
|---|---|
| 查看正式地图已出版了哪些年代 | [正式章节索引](data/chapters.json) |
| 查看长篇历史专题 | [专题文章索引](data/stories/index.json) |
| 新智能体接手研究或修改代码 | [AGENTS.md](AGENTS.md) |
| 历史空间考证、地点定位与不确定性规范 | [历史空间叙事正式标准](docs/HISTORICAL_SPATIAL_NARRATIVE_STANDARD.md) · [审核清单](docs/HISTORICAL_SPATIAL_REVIEW_CHECKLIST.md) |
| 保持现有地图交互和16种事件图标 | [批准版地图交互](docs/APPROVED_MAP_INTERACTION_STANDARD.md) · [图标规范](docs/ICON_SYSTEM_V2_APPROVED.md) |
| 地图研究与编审如何交接 | [研究交接](RESEARCH_HANDOFF.md) · [制图审核](docs/WAR_CONTROL_AND_CONTESTED_ZONES.md) |
| 清理分支、旧PR和维护工作流 | [仓库整理制度](docs/REPOSITORY_HOUSEKEEPING_20261018.md) · [历史PR台账](docs/OPEN_PR_TRIAGE_20261018.md) |
| 查阅旧版本地图与历史发布过程 | [旧版完整README（2026-10-18封存）](docs/archive/README_FULL_PRE_COMPACT_20261018.md) · [CHANGELOG](CHANGELOG.md) |

## 仓库目录

- `index.html`、`app.js`、`css/`、`js/`、`assets/`：正式地图页面与交互。
- `data/`：正式章节、专题索引、已发布历史事件、航路和地理图层。
- `research/`：尚未正式发表的调查底稿、史料索引、候审GIS及跨时期延续研究。
- `editorial/`：史学编审、发表决定、证据补遗和过时方案的归档。
- `scripts/`、`.github/workflows/`：历史数据完整性检查、实际桌面浏览器测试和 GitHub Pages 发布。
- `docs/`：稳定制图规则、项目治理、质量报告及旧版资料。

## 发布和协作

`main` 是唯一正式网站来源。研究分支中写入GitHub的数据**不意味着**已进入地图。修改必须先在独立分支完成，核对事件ID、年份、历史出处、地点精度和地图语义，经 GitHub PR 进行回归测试后再合并；若 Pages 未成功部署，不得声称已正式上线。

多人同时调查时不得用旧研究整章数据覆盖较新的正式章节，也不得为了整理仓库擅自删除未经归档的原始证据和仍被使用的分支。长达数十年或跨世纪的历史专题应保留续接关系，不按年代切片强行拆断历史事实。

**项目说明**：本地图旨在呈现可以查证的历史事件与各方不同视角，不能把史料的不完整、地图的示意边线或官方记录的缺失混同于事件不存在。数字与地理范围没有可靠证据时不填入推算值。

---

历史版本更新说明原来混在README正文中，目前已完整保存在 [旧版README档案](docs/archive/README_FULL_PRE_COMPACT_20261018.md)，并未删除原有发布记录、链接或研究线索。
