# 分支与PR库存清点｜2026-10-18

本清点来自 GitHub 实际远端 `branches` 与 `pulls` 接口。**分类不是删档许可证**：过去的PR可能采取Squash合并，单凭PR已合并也无法证明该研究分支没有新增文件或独家史料。账号下的活跃AI分身继续使用自己的研究分支。

## 库存数字（本次快照）

| 类别 | 数量 | 操作 |
|---|---:|---|
| 远端分支总计 | 163 | 全部已列入[逐分支CSV](maintenance/BRANCH_INVENTORY_20261018.csv) |
| `main` | 1 | 正式发布，永不清理 |
| 已获批UI回退基线 | 1 | 保留，除非另有经证实可替代快照 |
| 17世纪A/B/C研究分身 | 3 | 保留，正在使用 |
| 尚有开放PR | 27 | 先处理对应PR与独家材料 |
| 对应历史上已合并PR的分支 | 112 | 仅标为候选，不代表分支内容已无独家增量 |
| 对应历史上关闭但未合并PR的分支 | 12 | 谨慎核实；可能正是被否决或尚未保存的研究 |
| 找不到直接对应PR的其他分支 | 7 | 对照完整Git日志和当前使用者之后才能判断 |

历史PR统计：查询到 **27份开放PR、125份关闭PR**（其中合并 113 份，未合并关闭 12 份）。记录下的是GitHub当时状态；后续有人提交、合并或关闭PR，数字就会变化。

## 禁止批量清理的特殊分支

- `main`：正式历史地图的发布分支。
- `baseline/approved-ui-v0.9-20261012`：用户已经批准的交互基准，不可拿来作为一次性分支回收。
- `research/1600-1699-a-ireland-domestic`、`research/1600-1699-b-americas-caribbean`、`research/1600-1699-c-africa-asia-maritime`：目前分头搜集17世纪资料。
- 已关闭但需要保留完整修订史的 `research/1540s-scottish-warfront-visual-20261013`、`ui/map-modes-simple-20261013`、`fix/1540s-sourced-coastal-route-no-invented-control-20261013` 等，相关编审报告已入 [归档目录](../editorial/archive/2026-10/README.md)，**本轮暂不删除原分支**。

## 分支删除的安全门槛

必须同时满足：一，确认不是开放PR或当前AI/研究员活跃分支；二，以源提交和树差异核查 `main` 或持久研究档案是否拥有全部独特内容；三，保留原PR与必要的审查记录；四，没有工作流、其他研究PR或外部文档依赖该分支；五，有明确的负责人和操作记录，先分小批处理。

此次只完成GitHub远端盘点、分类与研究保护，不调用不可逆批量删除操作。按 `classification` 筛选CSV可确定下一批需要逐一核对的分支。对于 `closed-pr-merged`，尤其要防止误认Squash合并等价于Git祖先关系。

## 资料出口

- [仓库整理制度](REPOSITORY_HOUSEKEEPING_20261018.md)
- [旧开放PR逐项台账](OPEN_PR_TRIAGE_20261018.md)
- [已出版章节](../data/chapters.json)
- [17世纪研究入口](../research/README.md)
