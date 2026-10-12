# 爱英TV｜主编研究文件总目录与接棒决策（截至1519年）
更新：2026-10-12｜定位：*文件索引与决策捷径*，不替代史料、不覆盖原数据。

## 当前事实：哪些已经有了、哪些不用再重做
**main** 当前 `data/atlas-1497-1500.json` 作为最初的远航原型，含7条事件与9条来源；`data/atlas-1500-1509.json` 已作为正式1500—1509章的数据，含**21事件、6条持续政治位置、54来源**。主站图标与时间轴规范以 `data/icon-categories.json`, `docs/ICON_SYSTEM_V2_APPROVED.md`, `docs/PUBLIC_NARRATIVE_AND_TIME_MODEL.md` 为准。这两个时期不应从旧研究分支整体再合并一遍，否则出现事件重复和来源编号错配。

**待增加** 1510—1519：本预审分支中的 [ATLAS_REVIEW_CANDIDATE.json](ATLAS_REVIEW_CANDIDATE.json) 已整理**15事件、7处延续地点、22条直接来源**，并没有提交 `main/data/` 或修改 `app.js`。仍需主编审核后才可上线。

## 研究分支及其角色
| 范围 | 分支 / PR | 可复用成果 | 主编当前应做什么 |
|---|---|---|---|
| 1497—1500远航 | `research/collector-01-foundations-20261011`，[PR #1](https://github.com/1959124923wyz-sys/love-British-TV/pull/1) | 早期卡博特与布里斯托尔文书、历史考证规范 | **既有原型/主干先参考**，不要自动倒灌 |
| 全球实控判定 | `research/control-evidence-foundation-20261011`，[PR #2](https://github.com/1959124923wyz-sys/love-British-TV/pull/2) | 11种档案入口、实控类型、三组无多边形试点 | 用作史实审稿范式；可精简纳入规范 |
| 研究地基第二批 | `research/control-foundations-02-20261011`，[PR #3](https://github.com/1959124923wyz-sys/love-British-TV/pull/3) | 档案检索表、历史时空许可、1910前后政治主体转换 | 复用来源/版权与地理精度门槛 |
| 1500—1509 | `research/territorial-1500-1510-20261012`，[PR #4](https://github.com/1959124923wyz-sys/love-British-TV/pull/4) | 加来驻军及羊毛关税、爱尔兰盖尔地方战事和史料链 | **main已有正式快照**；新增原档线索需按事件增量审核 |
| 1500年粗略疆界 | `research/hypothetical-boundaries-1500-1510-20261012`，[PR #5](https://github.com/1959124923wyz-sys/love-British-TV/pull/5) | Calais & English Pale现代地名包络和1488法令虚线 | 仅供研究，不得把数学凸包当政治实控面积 |
| **1510—1519研究源** | `research/territorial-1510-1519-20261012`，[PR #6](https://github.com/1959124923wyz-sys/love-British-TV/pull/6) | 19条史事、13种政治关系、8组历史地理候选、额外1515—1518学术/馆藏深挖 | 按本预审包对照审核，无需全部逐份读 |
| **主编快审包** | `editorial/intake-1510-1519-20261012` | [15条候审事件](ATLAS_REVIEW_CANDIDATE.json)、[去向矩阵](DECISION_MATRIX.json)、[来源证据等级](SOURCE_PROVENANCE.json)、[跨期索引](CROSS_DECADE_SOURCE_INDEX.json) | 审核选择，适配新年代数据，调整地图前端与测试 |

此表说明**用途与读取位置**，不代表所有历史报告都已在Git主分支审核并发布；打开具体PR可见当时分支及草稿状态。

## 史料保护方式
[跨年代来源总索引](CROSS_DECADE_SOURCE_INDEX.json) 已从**9份真实的GitHub源清单**抽取126条来源记录，按URL关联但**不丢弃源ID和研究文件路径**，得到100个不同URL。其中19组URL由多个源ID使用，不同源ID可能支持不同主张：不能因为网址相同就把两个历史事件合并，也不能认为双文献引用就是双重独立证据。

每条研究源的 `source_file` / `source_branch` 可反查完整项目归档；`source_status` 必须由原文件或专题研究审查，**这个交叉索引仅用于去重查找，不对事实来源降级/升级**。

## 1510—1519与前代切片衔接的两个时间门槛
1. 加来、都柏林Pale、苏格兰独立国家和特殊王室领地的状态，需要在1510年继续存在但仍是“现代地理代表点/有证据的持续政治联系”。不把1500—1509的21件历史事件重复成为1510s发生的新事件。
2. 1513—1519年英王实际治理图尔奈，应以1513年9月开始、**1519年2月交还法国**；1518年签约时仍在；1519年末图层已退出，但1519年交接历史事件保留在章节事件列表。
3. 当前图尔奈1.15公里示意圈**不是历史边界**。比利时国家档案馆/瓦隆地图/里尔大学专门研究支持进一步调查城外Tournaisis，地区内又有多层领主与乡村司法，统一实心填色尚缺逐乡核对。
4. 1515爱尔兰实际施法范围、王室财政企划与法定郡界分开存证。史料中的面积或财政假定数字不能直接转换成地图面积和“实际掠夺”。

## 主编工作量最小的接力路线
只要先看本目录和 `editorial/1510-1519/README.md`，然后挑选15条中的重要事件核其短叙述、证据和坐标，决定是否迁移到 `data/atlas-1510-1519.json`。史料冲突请查 `DECISION_MATRIX.json` 的原研究ID；需要财政和地理细节时再打开研究分支中的相应专业文件。所有暂缓材料原封不动保留在 `research/`，不必为了“整齐”删去。

以用户批准的16种图标为准，不要新增大面积免责声明；事实缺口体现在 `certainty`、`geo_precision`、虚线图层与二级展开文献里。数字来源只要尚未审核原始账页就不标为实际收益。

## 工程与安全提醒
- 主分支 `main` 和公开Pages没有被本对话修改；本包只提供可以人工选择的候选数据。
- `editorial/1510-1519/check_candidate.py` 进行结构和来源引用校验，**不检查历史真假**；主项目自有 `scripts/validate_atlas.py` 也继续适用。
- 1517年Rastell条目《加拿大传记辞典》网址为 `rastell_john_1F.html`；**同名父子不可混**。
- 依据保留现代坐标点以便导航，但不允许把它们自动转为古代行政疆界。虚线推测图仅研究用途。

**GitHub审核入口**：本期资料整理草稿 [PR #7](https://github.com/1959124923wyz-sys/love-British-TV/pull/7)；原始深度研究 [PR #6](https://github.com/1959124923wyz-sys/love-British-TV/pull/6)。公开网站主干没有因本任务改变。


## 图尔奈地方辖区新增地图源（2026-10-12）
- **主编候选**：[TOURNAISIS_OPTIONAL_OVERLAY.geojson](TOURNAISIS_OPTIONAL_OVERLAY.geojson)，从专项研究分支独立生成的参考范围（19 Feature），包含全部研究原来源与版权状态；不用扫描/描摹瓦隆历史地图和UNamur受保护历史地理图。
- **研究文档**：`research/territorial-1510-1519-20261012/research/periods/1510-1519/TOURNAISIS_BOUNDARY_EVIDENCE_1513_1519.json`（11种来源、8项判断）及同目录 GeoJSON原件。
- **上线准则**：[TOURNAISIS_PUBLISH_GATE.md](TOURNAISIS_PUBLISH_GATE.md)，支持沿用main的独立`groups.hypotheses`图层，1513 开始、1519年2月结束英王城市占领；外围研究包络只显示于1513—1518年末。对主干公开网站无自动代码修改。
