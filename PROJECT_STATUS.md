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

## 部署激活检查 · 2026-10-11
- 用户提供的 GitHub Settings → Pages 截图显示 Source 已设为 GitHub Actions。
- 本次更新提交至 main 后，应触发仓库内 .github/workflows/pages.yml 的 push 自动发布流程。
- 暂未取得 GitHub Actions 运行成功与实际地图返回内容的可核验结果，不能标记为已上线；请检查仓库 Actions 页面的 Publish historical atlas。


## UI v0.2.0 交接 — 2026-10-11
- main 已写入深色地图 v0.2：index.html、css/dark-atlas-v2.css、app.js、data/atlas-1497-1500.json。
- 首屏：左右资料面板默认折叠；不取消底图和时间轴；折叠/展开后需刷新 Leaflet 容器尺寸。仅用户明确点定位按钮才调整地图视角。
- 实际地图瓦片源改为 https://tile.openstreetmap.org/{z}/{x}/{y}.png，消除旧 CARTO API KEY REQUIRED 占位问题。
- 历史事件按 significance.level 显示3级醒目、2级普通、1级按需；与 certainty/geoprecision 独立。规范 docs/EVENT_VISUAL_HIERARCHY.md。
- 折叠按钮 toggleSidebarBtn、toggleDossierBtn；图层 toggleEvents、toggleMinorEvents。不要误将这些功能与德国地图旧代码混在一起。
- 已于本次提交后执行 GitHub 远端 JS 语法静态校验、HTML 节点映射检查与 JSON 来源/等级检查。未能从此会话直接完成页面像素级浏览器验证；须在实际 Pages 网址复查。
- 下一步：验证实际黑色界面与底图；检查地图标记重叠、交互命中、历史边界精度和触屏表现；扩展后续历史。

### v0.2 当前精简状态
- 左右资料栏默认关闭；地图层和图例也默认折叠；底图 OSM 标准服务，航线悬停简述、点击详情。
- 英格兰紫色、苏格兰蓝灰；significance 为事件重要性分层；不确定落点使用虚线问号大标记。
- 参考文献与分级解释见 docs/EVENT_VISUAL_HIERARCHY.md。待用户在实际 GitHub Pages 页面验证无遮挡、底图加载和缩放稳定。

## 2026-10-11 · 首屏可读性热修复
- 现有 main 的 v0.2.1 页面将左侧章节栏设为默认展开（workspace 初始不含 sidebar-collapsed），右侧仍默认收起；按钮 aria-expanded 与初始状态一致。
- 首页导语采用1497年当时的历史视角，但严格基于英王亨利七世特许、布里斯托尔远航及寻求亚洲贸易航路的可靠资料。
- Leaflet atlas-hover 浮窗固定可读宽度与两行短文；避免截图中细长、竖排的悬浮框。
- 已拟制涵盖16种基础类别、三级历史重要性、地理确定性和视觉语法的 Word 标准预审稿，等用户确认后才可上传并冻结为正式规范。之前仓库 docs/EVENT_VISUAL_HIERARCHY.md 为既有草案，不代表对这次Word版本的批准。
- 静态代码检查通过；最终浏览器像素效果还需要用户重新打开已部署站点验证。


## 2026-10-12 / v0.3 UI 补丁
- 左侧章标题和叙事位于 chapterCard 独立可折叠部分，默认展开；历史事件列表和统计卡常驻左栏。
- 顶部右侧 mapControls 同时包含六项开关和图例说明；旧快捷定位按钮已经从 HTML 与 app.js 移除。
- 左栏“研究地图”免责声明及重复学术争议段落从首屏清除；保留真正有历史意义的证据边界、数据来源与地理精度字段。
- JS、HTML、CSS 已提交 main；版本参数更新至 pilot v0.3。待确认 GitHub Pages 实际页面效果，必要时 Ctrl+F5。
- 新版 Word 16图标提案属于单独待审草案，**没有上传GitHub**；当前线上标记继续沿用已有基础等级显示，等待用户确认正式图标后再整体替换。


## 正式批准版图标上线交接 v0.4.0 · 2026-10-12
- 用户已批准新版16类视觉符号意象。正式规范 docs/ICON_SYSTEM_V2_APPROVED.md；16类SVG assets/atlas-icons.svg；机器目录 data/icon-categories.json。
- 字段事件 icon_code 已写入 data/atlas-1497-1500.json（POL/EXP/CLM/DOC）；地图和左侧列表通过同一个 svgIcon() 生成 <svg><use href="assets/atlas-icons.svg#CODE"></use></svg>，符号不再是旧 emoji 或光圆点。
- 重要性级别 3/2/1 对应 34/27/21 像素；地理不确定性由虚线外框+问号独立表达，不与等级混淆。未来 LAB 皮鞭、FAM 骨骸、RES 持矛拳臂等已在SVG符号源登记，但首个1497—1500切片没有强制添加不存在的此类事件。
- 首屏章节独立折叠、图层与图例合并、两个快捷按钮删除、旧免责声明删除、底图用OSM无需API key、航线悬停/点击查看史料等改动保留。
- 工作流 scripts/validate_atlas.py 将验证 SVG图标ID与类别目录、全部event.icon_code；版本更新 v0.4.0。
- 公开地图 URL: https://1959124923wyz-sys.github.io/love-British-TV/ 。**外部访问与运行效果未独立证实**；不能标记为端到端验收完成。
- 尚需 UI 回归：实际看图标是否清楚、重叠、悬停尺寸、移动端和地图瓦片服务可用性；如用户发截图，应先修复实际缺陷再扩大研究年代。

- 图标预览页：/icon-gallery.html（直接引用同一SVG sprite）。部署后可查看真实网页图标外观，后续修改图标请一并回归检查此页。
