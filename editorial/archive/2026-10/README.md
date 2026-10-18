# 2026-10 历史地图旧方案归档（PR #38 / #39 / #41）

本文件夹保存**已经被后续正式实现超越**的历史讨论和证据线索。原始文档是独立研究分支中的逐字留档，不等于现行地图事实与有效边界。

## 当期主干核查

- 经核查，2026-10-18 `main/data/war-front-corridors-1540-1549.geojson` 有 **8个LineString要素**，不是旧PR #38提出的推测性大面积紫色Polygon；正式区域不得因视觉连续而虚构英国占领面积。
- `main/index.html` 已有 `mapLayerTerritory` 与 `mapLayerEvents` 两个独立开关；相应的 `scripts/test_two_public_layers.js`、正式UI合约及桌面浏览器测试由当前自动化验证。旧PR #39不应再覆盖正式UI。
- `main/app.js` 已包含独立的战争进军线路渲染，正式战事线采用方向示意、非实际控制面积。旧PR #41是史料与地图语义纠偏的重要发展过程，但它当时的5条测试线不再是现行8条数据的发布标准。
- 2026-10-18 主干维护门禁已通过 [PR #164](https://github.com/1959124923wyz-sys/love-British-TV/pull/164) 合并。新章和后续编辑必须继续遵守 `docs/HISTORICAL_SPATIAL_NARRATIVE_STANDARD.md` 及严格空间审计。

## 归档材料与性质

| 来源 | 已保全材料 | 作为现行地图依据？ |
|---|---|---|
| [PR #38](https://github.com/1959124923wyz-sys/love-British-TV/pull/38) | [战争北伸早期方案](PR38_NORTHWARD_CONTROL_VISUAL_PR_REVIEW_20261013.md) | **不可直接采用**：其中手工Polygon的面积表现已被线性方案纠正；只保留当时史料和工作解释 |
| [PR #39](https://github.com/1959124923wyz-sys/love-British-TV/pull/39) | [双开关UI早期设计说明](PR39_MAP_MODE_UX_REVIEW_20261013.md) | **以main现行UI和已批准规范为准**；此说明记录设计演进 |
| [PR #41](https://github.com/1959124923wyz-sys/love-British-TV/pull/41) | [史料支持的苏格兰进军方向研究](PR41_EVIDENCE_BASED_SCOTTISH_COASTAL_CONTROL_AXIS_20261013.md) | 可用于进一步历史考证，但路线顶点不得声称GPS实测 |
| [PR #41](https://github.com/1959124923wyz-sys/love-British-TV/pull/41) | [旧版五线路结构测试快照](PR41_COASTAL_ROUTE_TOPOLOGY_QA_20261013.json) | **旧测试快照**：不是现行8线路的验证报告 |

以上四份文件从对应原分支复制；未删除、重写、简化原始史料。原PR的全部Git差异以及候审代码仍可通过GitHub的PR与分支历史查看，因此关闭重复旧PR并不销毁完整研究证据。

## 本批清理约束

- 对 #38、#39、#41，**仅在本归档PR成功合并main且正式地图CI检查仍正常后**，可给原PR留下具体替代出处并关闭（不合并旧代码）。
- 原研究分支此次继续保留；删除分支需要后续独立的依赖与未入库资料比对。
- 若未来发现历史控制线存在新的未核来源或地图误导，通过新Issue/PR修复 `main`，而非恢复旧大面积紫色Polygon。
