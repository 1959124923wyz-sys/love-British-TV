# 历史研究工作区（未发布资料）

此目录用于保存英格兰、苏格兰、大不列颠/英国殖民扩张与政治暴力的**史料调查底稿**，不是网站的正式数据目录。**正式发表只读取** `../data/chapters.json` 中状态为 `published` 的 `data/atlas-*.json` 及其已审核GIS/专题数据；`research/` 的档案不应被自动载入地图。

## 17世纪项目正在研究

- **调查甲**：1600—1699 爱尔兰与不列颠内部殖民、战争、财产剥夺，分支 [`research/1600-1699-a-ireland-domestic`](https://github.com/1959124923wyz-sys/love-British-TV/tree/research/1600-1699-a-ireland-domestic)，[Issue #163](https://github.com/1959124923wyz-sys/love-British-TV/issues/163)。
- **调查乙**：1600—1699 北美、加勒比殖民、原住民战争与奴隶制度，分支 [`research/1600-1699-b-americas-caribbean`](https://github.com/1959124923wyz-sys/love-British-TV/tree/research/1600-1699-b-americas-caribbean)，[Issue #165](https://github.com/1959124923wyz-sys/love-British-TV/issues/165)。
- **调查丙**：1600—1699 非洲、亚洲、远洋私掠、商业公司、战争金融，分支 [`research/1600-1699-c-africa-asia-maritime`](https://github.com/1959124923wyz-sys/love-British-TV/tree/research/1600-1699-c-africa-asia-maritime)，[Issue #166](https://github.com/1959124923wyz-sys/love-British-TV/issues/166)。
- 17世纪编辑规划和调查任务： [PR #148](https://github.com/1959124923wyz-sys/love-British-TV/pull/148)。**上述研究分支均未被本轮仓库清理删除。**

## 研究记录如何升级到正式地图

1. 在所属年份/专题下面保存史料、具体页码或档案号、候选事件、当地历史主体、跨年代续接ID和地点精度。分歧与无法确认的范围应诚实记为候审。
2. 调查员只提交研究资料；正式事件由主编对比 `data/atlas-*.json`、`data/stories/index.json` 和其他研究员的来源后去重，决定采纳与否。
3. 涉及领土的资料须分清主权、军队临时驻扎、海盗/贸易活动、征地、原住民抵抗及冲突影响范围。未取得可信历史测绘边界时只允许点/虚线/低精度示意，不将现代行政区或手绘包络当作殖民国土。
4. 正式导入时走独立PR与CI，核对来源ID、时间连续性、地图坐标、面积禁用标志及真实桌面浏览器；主干部署完成后才能把状态写成“已发布”。
5. 过去各年代研究包如果已有正式章节，**优先抽取新的可靠证据**而非覆盖整章；未被采用的独家资料仍保留在研究档案与对应PR。

## 寻找之前的研究

阅读 [旧研究PR台账（2026-10-18历史快照）](../docs/OPEN_PR_TRIAGE_20261018.md)、[长年制图工作规范](../docs/HISTORICAL_SPATIAL_NARRATIVE_STANDARD.md) 及 [通用研究交接](../RESEARCH_HANDOFF.md)。其中仍列有早期研究PR，而近期已关闭的界面PR应查询 [旧方案归档](../editorial/archive/2026-10/README.md)。各类记录只作为史料入口，不代表主编已同意其所有历史主张。
