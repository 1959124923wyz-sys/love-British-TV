# PROJECT STATUS — 大英殖民扩张历史地图

更新日期：2026-10-11

## 固定研究规则
- 英格兰—苏格兰—大不列颠—联合王国殖民扩张及其延续；不能混淆历史主体。
- 主时间轴从1490年代开始，十年主刻度；地图按实际年份呈现，历史转折设独立锚点。
- 研究广义殖民：领土扩张、军事暴力、经济控制、奴隶制、强制劳动、殖民抵抗与独立运动。
- 任何未经核实的领土、航线、登陆位置不能呈现为确定事实；模糊地理边界使用虚线。
- 经济收益不可把财政额、商品贸易额、私利与财富转移直接相加；保留估算方法和争议。

## v0.1.0 已落地
- 公开仓库 main：index.html、style.css、app.js。
- 数据：data/atlas-1497-1500.json（7条历史记录、9条来源、3条候选地点、2条示意路线）；data/modern-uk-regions.topojson（12个现代区域参考）。
- 地图功能：Leaflet底图；年份滑块1497—1500；历史事件详情、来源链接、图层开关、视图按钮、地图与资料栏交互。
- 精度：1497年登陆位置不明、两次路线均为示意、北美无已证实英格兰永久殖民据点；王室主张不是有效殖民统治。
- 研究分支：research/cabot-1497-1500（PROGRESS.md）。
- 协作：CHANGELOG.md 版本日志、RESEARCH_HANDOFF.md 分工与接力指南、SOURCE_MATRIX.md 资料清单。
- 测试：app.js 语法检查成功、JSON解析成功；GitHub Actions 加入 scripts/validate_atlas.py 数据核验，但 Actions 实际运行状态尚未得到验证。

## 发布状态（待确认）
- GitHub Pages 工作流文件已提交到 .github/workflows/pages.yml。
- Pages 是否已启用、站点是否可访问仍待核实；不可声称已完成发布。
- 若未启用请在 GitHub Settings → Pages → Build and deployment → Source 选择 GitHub Actions；此后检查 Actions 运行结果。
- 公开预期地址：https://1959124923wyz-sys.github.io/love-British-TV/

## 下一步
1. 用户或网页维护对话确认 GitHub Pages 状态与实际网页加载。
2. 检查移动端、底图加载、控件、史料卡片与边界样式。
3. 调研历史英苏国境与早期北美航线的文献限制，替代现代轮廓近似。
4. 按专题研究继续推进1500年代、1600年代及后续历史。

## 接力读取顺序
README.md → 本文件 → CHANGELOG.md → RESEARCH_HANDOFF.md → SOURCE_MATRIX.md → 数据文件 → 对应研究分支PROGRESS.md及最近Git提交/PR。
