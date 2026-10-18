# 爱英TV｜31份开放PR与历史分支对账清单（2026-10-18）

> **重要：本表是基于 GitHub API 查询的差异文件与标题分类，不代表已经逐条审完史料，也不意味着任何PR可以立即删除或合并。** 本表用于主编确认下一步行动；开放数量会随其他智能体的工作变化，按需更新。

**检查快照：** `main` 仍正式发布1497—1599年十章；31份开放PR，其中23份只变动研究/编审/文档，8份触及正式代码、Atlas、UI或CI；158个远端分支。与[仓库整理总纲](REPOSITORY_HOUSEKEEPING_20261018.md)配套。

## A｜涉及正式网站、史料主库或自动化的8份PR（先审核差异，绝不整包合并）

| PR | 修改范围与风险 | 建议处置 |
|---|---|---|
| [#164](https://github.com/1959124923wyz-sys/love-British-TV/pull/164) | GIS严格审计/Pages/桌面Smoke/AGENTS；独立维护成果 | **保留推进**，等待主编或合并流程确认同SHA CI，全绿不代表已发布 |
| [#124](https://github.com/1959124923wyz-sys/love-British-TV/pull/124) | 卡文迪什与1588爱尔兰海难专题，触及两份Atlas、故事索引、CI及多项测试 | **拆分审稿**，先与现有无敌舰队故事及卡文迪什事件逐ID核对 |
| [#118](https://github.com/1959124923wyz-sys/love-British-TV/pull/118) | 勒阿弗尔和霍金斯专题，触及 `app.js`、Atlas、GeoJSON、故事索引和CI | **拆分审稿**，检查已发布霍金斯、勒阿弗尔点线及故事关联重复 |
| [#82](https://github.com/1959124923wyz-sys/love-British-TV/pull/82) | 面积排除标志、路线关联、GIS审计脚本、两条工作流 | **择优移植** 已核定的几何安全约束；与#164新严格审计去重 |
| [#47](https://github.com/1959124923wyz-sys/love-British-TV/pull/47) | 制图交付门禁与主编台账，触及多条CI、`AGENTS.md` | **制度比对**，保留独特审核规范；不得以旧Pages/CI覆盖#164 |
| [#41](https://github.com/1959124923wyz-sys/love-British-TV/pull/41) | 1540年代海岸军线/界面代码 | **疑似旧实施**，按地图现状与事件来源核对，核实已吸收后再关闭 |
| [#39](https://github.com/1959124923wyz-sys/love-British-TV/pull/39) | 「版图/事件」双开关旧实现及页面/CSS | **疑似已吸收**，主干已有双开关；仅比对遗留差异，不重新覆盖 |
| [#38](https://github.com/1959124923wyz-sys/love-British-TV/pull/38) | 1540年代战线可视化旧实现、CSS与前端 | **高制图风险**，含历史战争示意面，先审学术依据和用户禁用的假Polygon问题 |

## B｜纯研究、编审或文档的23份PR（先保全独家证据，再按内容归档）

| PR | 主题及用途 | 下一动作 |
|---|---|---|
| [#148](https://github.com/1959124923wyz-sys/love-British-TV/pull/148) | 1600—1699规划及三分身派工 | **活跃保留**；对接17世纪A/B/C分身，不发表未审核年代 |
| [#129](https://github.com/1959124923wyz-sys/love-British-TV/pull/129) | 读者文案冗余与位置说明审计 | **保留待审**；合理史学不确定性不能一键删除 |
| [#126](https://github.com/1959124923wyz-sys/love-British-TV/pull/126) | 1500—1599国家暴力、财产剥夺史料缺口 | **与主干比对**；形成独立史料候选清单 |
| [#92](https://github.com/1959124923wyz-sys/love-British-TV/pull/92) | 历史暴力的点线面漏绘调查 | **保留排查**；与#82/#83和已发布GIS逐项核对 |
| [#61](https://github.com/1959124923wyz-sys/love-British-TV/pull/61) | 1590—1599研究/主编导入包 | **仅增量审查**；正式1590年代已经发布 |
| [#59](https://github.com/1959124923wyz-sys/love-British-TV/pull/59) | 1580—1589研究/主编导入包 | **仅增量审查**；禁止旧Atlas整体覆盖正式版本 |
| [#56](https://github.com/1959124923wyz-sys/love-British-TV/pull/56) | 1570—1579深度研究、原档检索与贩奴事件 | **仅增量审查**；与正式长文事件去重 |
| [#52](https://github.com/1959124923wyz-sys/love-British-TV/pull/52) | 1560—1569霍金斯、勒阿弗尔、殖民/航路研究 | **仅增量审查**；与#118协作 |
| [#50](https://github.com/1959124923wyz-sys/love-British-TV/pull/50) | 苏格兰古堡官方考古图与Issue #46 | **重点保全**；现代法定保护Polygon不可冒充历史占领面 |
| [#44](https://github.com/1959124923wyz-sys/love-British-TV/pull/44) | 1547—1550驻军、行动线、年末状态研究 | **与已发布驻点比对**；继续核验未决地名 |
| [#43](https://github.com/1959124923wyz-sys/love-British-TV/pull/43) | 1548军控地图与档案交叉验证 | **归入#46史料队列**；保留未取得原图的问题 |
| [#33](https://github.com/1959124923wyz-sys/love-British-TV/pull/33) | 1550年代持续政治控制与研究包 | **比对补遗**，只迁移未纳入的有据细节 |
| [#27](https://github.com/1959124923wyz-sys/love-British-TV/pull/27) | 1540年代英苏战争控制史料 | **比对补遗**，图层边线继续虚线待证 |
| [#25](https://github.com/1959124923wyz-sys/love-British-TV/pull/25) | 1530年代政治控制与法律研究包 | **逐项对账**，避免旧章节事件回退 |
| [#14](https://github.com/1959124923wyz-sys/love-British-TV/pull/14) | 1520年代边界证据追踪 | **依赖注意**：此PR的base不是main而是#8研究分支 |
| [#8](https://github.com/1959124923wyz-sys/love-British-TV/pull/8) | 1520年代研究包与史料 | **先核史料再处理#14依赖** |
| [#7](https://github.com/1959124923wyz-sys/love-British-TV/pull/7) | 1510年代主编审核底稿 | **核对是否已吸收**，不覆盖正式章节 |
| [#6](https://github.com/1959124923wyz-sys/love-British-TV/pull/6) | 1510年代远航、爱尔兰、图尔奈史料 | **原始研究保全**，有独家档案时留入口 |
| [#5](https://github.com/1959124923wyz-sys/love-British-TV/pull/5) | 加来/Pale古界假说与原型 | **只作研究假说**，严禁推入实心主权地图 |
| [#4](https://github.com/1959124923wyz-sys/love-British-TV/pull/4) | 1500—1510深挖及爱尔兰、加来研究 | **核对补遗**，不要以资料庞杂作为删除依据 |
| [#3](https://github.com/1959124923wyz-sys/love-British-TV/pull/3) | 研究资料地基与许可规范 | **核对独有方法论**，记录是否纳入当前AGENTS |
| [#2](https://github.com/1959124923wyz-sys/love-British-TV/pull/2) | 军政有效控制判断及权威档案 | **核对独有来源条目**，保留史料标准 |
| [#1](https://github.com/1959124923wyz-sys/love-British-TV/pull/1) | 第一批调查员基础规则与1497历史来源 | **核对独有底稿**，说明继承/替代关系 |

## C｜不是PR的分支：需保留的关键例子

- `main`：受保护、正式发布，禁止强制重写。
- `baseline/approved-ui-v0.9-20261012`：用户曾批准的UI回退参照；在没有等效标签、快照验证前不能删除。
- `research/1600-1699-a-ireland-domestic`、`research/1600-1699-b-americas-caribbean`、`research/1600-1699-c-africa-asia-maritime`：17世纪活跃分身入口，即使尚未建立PR也不能视为“孤儿分支”。
- 其他没有开放PR的 `feature/`、`history/`、`research/`、`fix/`、`editorial/` 分支，须先辨别：是否已合并、是否含未归档的研究、是否在被同事使用、是否有工作流或文档引用。现阶段不执行批量删除。

## D｜归档/关闭/删除的验收字段

对每份开放PR记录：

`PR编号 | 当前目的 | 实际变更文件 | 是否包含独有史料 | 已纳入主干的event_ids/geometry IDs | 未纳入证据及去向 | 对应主干提交SHA/补遗Issue | 审核结论 | 可否关闭 | 可否删除分支`

其中“可否删除分支”必须独立于“可否关闭PR”。优先保护具有原始档案、史料链接、年代连续性和未核证边界问题的研究结果。**没有写出对账证据的，一律标记“待审”，不擅自销毁。**

下一轮更新建议优先 #164 → #82/#47 → #41/#39/#38 → #118/#124 → #50/#44/#43，之后再按年代顺序处理所有研究底稿。其他AI须参考本台账而非依照PR数字大小盲目操作。
