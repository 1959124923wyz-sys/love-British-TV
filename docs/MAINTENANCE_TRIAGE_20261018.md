# 爱英TV｜2026-10-18 主干维护体检与交接

> 性质：对仓库已发布文件及 GitHub 运行记录的**技术核对**，不是对历史史料逐条复核或历史边界认证。以 `main` 为基准；未合并 PR、旧研究草稿和旧版章节编号不能冒充当前正式内容。此文不擅自改动任何历史事件、制图几何或用户已批准的桌面交互。

## 一、核验范围（2026-10-18）

- 当前权威章节表：`data/chapters.json`；**1497—1599 共 10 章**；1600—1699 的规划仍在候审草稿 PR #148，未正式出版。
- 对 `main` 上十份正式 `data/atlas-*.json` 独立读取并作基础交叉检查：**575 条事件、438 条已配坐标事件、137 条未配坐标事件、74 条航路**。本次发现：跨章事件 ID 重复 **0**、事件坐标单轴缺失/超出 WGS84 范围 **0**、事件引用的章内来源 ID 不存在 **0**。
- 这只能证明上述结构条件，没有证明地点、航迹或史学论断正确。**不得为消灭137个空坐标而编造古代经纬度**；经史料核证的具名地应按现代参考坐标及不确定性标准逐个补录。
- `data/stories/index.json` 现登记 **39 篇**长文，其中 `published` 38 篇，其余 1 篇不应擅自变更状态。
- GitHub 查询时有 **29 个未关闭 PR** 和 **10 个未关闭 Issue**。多数 PR 是草稿研究包或已出版旧章节的增量候审资料，不能因为编号早就按顺序直接合并。
- 2026-10-18 最近一轮 `main` 的 Publish historical atlas、Approved map UI contract、Major history story reader pilot QA 均成功；它们不等于每个历史形状、每一页浏览器操作或每条史料链接均已审实。

## 二、确认的工程漏洞及本分支补救

**原漏洞**：`scripts/audit_spatial_semantics.py` 本身区分严重结构性 `ERROR` 与待历史复核 `REVIEW`，且只有携带 `--strict` 才因 `ERROR` 退出非零。但原 `phase2-spatial-redteam.yml` 仅执行 `--out`，因此存在检查记录严重错误却仍通过的风险；同时 PR 的路径触发器未覆盖多数其他年代的 Atlas 和 GIS 文件，`main` 的 Pages 发布流程也没有要求运行严格审计。

**本分支修改**：

1. `.github/workflows/phase2-spatial-redteam.yml`：对任意正式 Atlas 文件、`data/*.geojson`、章节索引等 PR 变更触发；对相关 `main` 推送触发；运行 `--strict --out`，使结构性 `ERROR` 真正导致失败，`REVIEW` 保持待审。
2. `.github/workflows/pages.yml`：在 Pages 上传与部署之前执行同一严格审计，防止未通过空间完整性门禁的修改发布到正式地图。
3. `.github/workflows/browser-smoke.yml`：扩大桌面浏览器冒烟检查到 CSS/JS 变更，并在前端变更进入 `main` 后复查；避免样式等改动跳过真实浏览器验收。
   - 旧版 `scripts/browser_smoke.py` 中 81 处年切换引用硬编码的事件累计数，在正式 Atlas 扩充后失效。本分支以 `data/chapters.json` 加对应 `chapter.source` 实际事件年份计算页面预期累计数，仍检查浏览器画面与正式数据一致，不放宽对双图层、时间泄露和地图点击的专项断言。
4. 无修改用户网站现有交互、史学事实、行政主权、军界边线、图层几何及面积数值。后续必须以 PR 工作流真实结果验收，不能把“已经提交到候审分支”等同于“正式网站已修复”。

**基线依据**：2026-10-17 GitHub Actions `Phase II independent historical GIS red-team` 成功运行 [39030546094](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/39030546094)，当时统计 0 项 `ERROR`、27 项 `REVIEW`，27 项均为 `geo_source_outside_published_index`。这些 ID 可能属于独立史料档案，必须人工建立引用对应关系，**不能机械复制新来源或删除疑点**。该日志是当时快照，不是对本分支或之后数据的最终验收。

## 三、遗留任务：按事故风险优先处理

| 优先级 | 项目及入口 | 维护处理原则 |
|---|---|---|
| P0 | [Issue #46](https://github.com/1959124923wyz-sys/love-British-TV/issues/46) 1547—1549 英军历史军控范围 | 缺乏古代可测控制区证据时继续以具名据点 Point、可靠关系线和淡色虚线示意；不可用凸包、现代法定保护边界冒充英占 Polygon |
| P1 | [Issue #83](https://github.com/1959124923wyz-sys/love-British-TV/issues/83) 港市突袭区域的椭圆误读 | 桌面地图较高缩放验证，避免观众误读为史实焚毁半径或实际占领地 |
| P1 | [Issue #161](https://github.com/1959124923wyz-sys/love-British-TV/issues/161)、[Issue #143](https://github.com/1959124923wyz-sys/love-British-TV/issues/143) 同一事件与跨长文去重 | 先对比正式 `main` 的事件 ID、起讫年、行动主体及长文连接，再审核研究增量；不能重建已发布记录 |
| P1 | [PR #82](https://github.com/1959124923wyz-sys/love-British-TV/pull/82) 红队 GIS 修正 | 已有独立的历史几何与面积保护增量，但当前与主线的融合必须逐文件复核，禁止整分支覆盖主线 |
| P1 | [PR #118](https://github.com/1959124923wyz-sys/love-British-TV/pull/118)、[PR #124](https://github.com/1959124923wyz-sys/love-British-TV/pull/124) 长专题候审 | 先与正式长文索引及事件映射比对，消除内容和位置重复，再分主题上线 |
| P1 | [PR #52](https://github.com/1959124923wyz-sys/love-British-TV/pull/52)、[#56](https://github.com/1959124923wyz-sys/love-British-TV/pull/56)、[#59](https://github.com/1959124923wyz-sys/love-British-TV/pull/59)、[#61](https://github.com/1959124923wyz-sys/love-British-TV/pull/61) 旧章研究包 | `main` 已出版相应年代；只提取增量且附来源审核，不整体回合旧章节文件 |
| P2 | [PR #129](https://github.com/1959124923wyz-sys/love-British-TV/pull/129) 读者文案审计 | 不可一键删掉真正必要的史学不确定性或位置精度说明；优先删重复废话，保留合理保守提示 |
| P2 | [PR #148](https://github.com/1959124923wyz-sys/love-British-TV/pull/148) 1600—1699 规划 | 仅供17世纪编辑主编审批；跨世纪长期事件要建连续续接接口，不能以1599年底强行断代 |

## 四、接手者应执行的验收顺序

1. 先从 `main/data/chapters.json` 和 `main/data/stories/index.json` 重建真实发布清单，不复制旧版 `PROJECT_STATUS.md` 内过时的章节号或旧条数。
2. 对本 PR 查看严格空间门禁、已批准 UI 回归、长文和实际浏览器测试的 GitHub Actions **同一提交 SHA** 的结果，任何红灯定位失败项，不以“重跑成功”掩盖结构错误。
3. 内容 PR 合并前，逐文件比较 `main` 与候审分支，校验历史事件唯一性、地点精度、来源链接、逐年控制状态及无数据丢失；仅增量引入已核证变化。
4. 正式 Pages 部署成功且桌面交互/多年份截图确认后，才标记“正式修复”；必要时为未解决疑点保留对应 Issue，不机械清仓。
5. 不确定历史版图始终用虚线/非实测示意标明；真实历史主权、军队短驻、人员掠卖航路、战役影响区四者不可互换，也不可合算为实际殖民占领面积。

维护建议：持续用小型独立分支作“问题复现 → 最小修复 → CI 验收 → 交接留档”，而不是一次性重写事件、地图与交互。 
