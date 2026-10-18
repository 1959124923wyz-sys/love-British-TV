# 爱英TV｜当前项目状态（2026-10-18）

> **这是一页交接入口，不是历史版本日志。** 当前发表的确切年份、事件、专题均以 `main` 的机器可读清单与实际 GitHub Pages 部署为准。若此文与数据清单冲突，以数据清单为准。
>
> 原有完整历次状态记录已逐字保存到 [历史PROJECT_STATUS档案](docs/archive/PROJECT_STATUS_FULL_PRE_COMPACT_20261018.md)，并未删除旧版本史料或发布记录。

## 一、观众能看到什么

- **正式年份：1497—1599年，10章。** [章节与数据源](data/chapters.json)
- **重大历史故事：** [专题索引](data/stories/index.json)，以每个专题 `status` 为准。
- **正式地图入口：** https://1959124923wyz-sys.github.io/love-British-TV/
- **观众交互与历史地理表达：** 延用 [获批桌面交互](docs/APPROVED_MAP_INTERACTION_STANDARD.md)、[16图标规范](docs/ICON_SYSTEM_V2_APPROVED.md)、[历史空间叙事规范](docs/HISTORICAL_SPATIAL_NARRATIVE_STANDARD.md)。未经证实的古代边界用虚线或不绘制，不将军事航线、交战范围和主权疆域混为一谈。
- 发布数据曾经独立核查出 **575条事件、74条路线、438条事件有现代参照坐标**（2026-10-18快照）。增加事件后请重新统计，勿把此数字写成永久固定配额。

## 二、当前工作安排

| 方向 | 正式入口 | 状态 |
|---|---|---|
| 16世纪剩余史料、历史边界核查与跨年专题 | [开放PR清单与移植优先级](docs/OPEN_PR_TRIAGE_20261018.md) | 研究候审，不可随意覆盖正式Atlas |
| 1600—1699年编辑与分身研究 | [第17世纪编辑规划PR #148](https://github.com/1959124923wyz-sys/love-British-TV/pull/148)、[调查甲 #163](https://github.com/1959124923wyz-sys/love-British-TV/issues/163)、[调查乙 #165](https://github.com/1959124923wyz-sys/love-British-TV/issues/165)、[调查丙 #166](https://github.com/1959124923wyz-sys/love-British-TV/issues/166) | 正在调查、未正式发布 |
| GitHub仓库清理与维护规则 | [仓库整理规则](docs/REPOSITORY_HOUSEKEEPING_20261018.md) | 2026-10-18第一批已完成；研究档案继续对账 |
| 1540年代旧军事线/双开关历史方案 | [归档目录](editorial/archive/2026-10/README.md) | 旧PR #38/#39/#41 已由新主干实现替代，留存研究说明 |

## 三、最近完成的维护（真实合并）

- [PR #167](https://github.com/1959124923wyz-sys/love-British-TV/pull/167)：正式仓库导航与31份开放PR历史快照索引。
- [PR #164](https://github.com/1959124923wyz-sys/love-British-TV/pull/164)：严格GIS错误门禁及真实桌面浏览器冒烟测试，消除过时的年份数量断言。
- [PR #168](https://github.com/1959124923wyz-sys/love-British-TV/pull/168)：逐字保存旧地图方案史料和评审记录。已逐条解释并关闭旧PR #38/#39/#41，分支尚保留。
- [PR #169](https://github.com/1959124923wyz-sys/love-British-TV/pull/169)：压缩正式README；原长篇版本日志完整迁入归档目录。
- CI并不等于全部历史事实通过认证。一轮主干故事浏览器检查曾在1522年跳转上超时，**同一次运行的失败作业复跑通过**；后续仍须关注重复发生的具体原因，而不应归咎于本次仅文档归档的改动。

## 四、继任智能体的工作约束

1. **先读** `AGENTS.md`、`data/chapters.json`、`data/stories/index.json`，再读相关年代研究材料和正式史料。
2. 在独立分支保存研究，标注正式史料、所引用原始文献、地理不确定性、跨世纪长事件接续关系，并按稳定事件ID进行去重。
3. 数据进 `main` 前需要分清真实控制点、攻防/战区示意和政治法理辖区；不可靠的“面积”不得累加或渲染成实心占领区。
4. 交付前运行 GitHub PR 检查、保存可点击的史料与地图证据；合并及 Pages 成功后才能宣称正式发布。
5. 旧研究PR是否关闭、远端分支是否删除需要**分别评估**。没有独家研究和工作依赖核查的结果，不应批量删档案。

## 五、档案索引

- [旧README完整文本](docs/archive/README_FULL_PRE_COMPACT_20261018.md)
- [旧PROJECT_STATUS完整文本](docs/archive/PROJECT_STATUS_FULL_PRE_COMPACT_20261018.md)
- [长期变更记录](CHANGELOG.md)
- [各期历史研究交接](RESEARCH_HANDOFF.md)
- [第六章旧方案与编审原文](editorial/archive/2026-10/README.md)

如需刷新项目现况，优先读取 GitHub 的 **main 分支、未关闭PR、Issues、Actions、Pages** 当前实际记录。本页时间戳用于避免把2026-10-12的旧版状态误认为今日正式内容。
