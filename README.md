# 帝国的代价 · 英格兰—苏格兰—大不列颠—联合王国殖民扩张历史地图

基于可核验史料、精确年份、历史主体与不确定性标记的全球动态地图。

## 地图链接

- **GitHub Pages 正式地址（仓库 Pages 服务启用并成功部署后）**：https://1959124923wyz-sys.github.io/love-British-TV/
- **即时临时预览（第三方 raw.githack；可能先显示一次安全确认页）**：https://raw.githack.com/1959124923wyz-sys/love-British-TV/main/index.html

若正式地址暂时不可访问：仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**；随后在 Actions 中查看 Publish historical atlas 的运行情况。

## 首批试运行

**1497—1500**：英王亨利七世支持的约翰·卡博特远航、第一次北美登陆地假说、1498年二次远航、王室对海外土地的象征性主张。北美不绘制无证据支持的殖民统治区。航线为方向示意，不是史实精确路径。


## 正式获批图标规范（2026-10-12）

以下三个文件为所有研究与网页维护对话的**正式约定**：

- [16类历史事件图标规范 v2.0](docs/ICON_SYSTEM_V2_APPROVED.md)
- [可调用 SVG 图标库（POL / EXP / TER / WAR / REP / SLV / LAB / ECO / DIS / FAM / RES / ABO / IND / INF / CLM / DOC）](assets/atlas-icons.svg)
- [16类机器可读编码与配色](data/icon-categories.json)

基础颜色按照类别表达，图标大小表达历史重要性（三级），虚线/问号表达地点不确定性；相关概念不得混同。当前1497—1500的地图标记与侧栏已改为使用此SVG库。后续分支也必须复用相同标准。

## 多对话交接

- [PROJECT_STATUS.md](PROJECT_STATUS.md)：项目当前状态、已知问题与待办。
- [CHANGELOG.md](CHANGELOG.md)：正式变更日志。
- [RESEARCH_HANDOFF.md](RESEARCH_HANDOFF.md)：研究与网页维护的任务分工、分支与合并机制。
- [SOURCE_MATRIX.md](SOURCE_MATRIX.md)：资料来源。
- [数据文件](data/atlas-1497-1500.json)：机器可读史料和地理不确定性信息。
- [专题研究分支](../../tree/research/cabot-1497-1500)：研究日志 PROGRESS.md。

开发：静态 HTML + CSS + JavaScript / Leaflet；部署通过 GitHub Pages；本地英国区域轮廓基于 ONS 开放数据，**现代轮廓只用于定位，不代表1497年政治边界**。

网页使用 © OpenStreetMap contributors / © CARTO 底图；地域边界来源为 ONSvisual/topojson_boundaries，含 ONS/OS 开放地理数据，详见来源清单。

- [查看16种正式SVG图标（网页预览）](icon-gallery.html) — GitHub Pages 地址：https://1959124923wyz-sys.github.io/love-British-TV/icon-gallery.html

## 1500—1509：信息搜集员1号资料首次上线（2026-10-12）

- **地图时间范围已扩展到1497—1509年**；拖动滑块到1500年进入第二章。
- 新增公开正式数据：[1500—1509事件和代表性政治据点](data/atlas-1500-1509.json)，包括14条来源关联事件、6处有证据的具名地区位置与50条史料来源索引。
- 研究员原始成果 [research/periods/1500-1510/](research/periods/1500-1510/README.md) 完整按已提交状态快照入库；研究分支仍继续使用，不发生自动覆盖。
- [来源与制图审查](research/periods/1500-1510/CONTROL_AND_CHRONOLOGY_REVIEW.md) 指出 Calais March、English Pale 等区域的可复核边界尚未就绪，**目前没有新增任何殖民地实心控制多边形**。
- 史料上没有确认的1508—09卡博特远航轨迹不作为确定路线发布；钱款注明性质，王室航海拨款/年金与外交收款不计为殖民利润。



## 2026-10-12：v0.6 时间轴、持续状态与调查员新一批资料
- 新时间轴：分章节色带 + 年份里程碑。当前年份切换不再隐藏同章全部历史事件。
- 地图相近事件聚合选择，避免英苏条约挡住1501—1502年三名来自大西洋彼岸的人物记录。
- 新的数据：[1500—1509正式事件](data/atlas-1500-1509.json)（21条事件、6处政治据点、54条来源）。
- 调查员持续上传的文献：[1500—1509深入调查报告](research/periods/1500-1510/DEEP_FINDINGS_CALAISES_AND_IRELAND.md) 与 [假设地理包络研究](research/hypotheses/1500/README.md)；后者仅存档研究。
- 公众事件写作与十年分段的长期规范：[叙事与时间状态规范](docs/PUBLIC_NARRATIVE_AND_TIME_MODEL.md)。

## 2026-10-12 · v0.7 正式地图布局与地理参考预览
- [在线历史地图](https://1959124923wyz-sys.github.io/love-British-TV/)：地图仅保留紧凑年份卡与章节时间轴；右侧考证采用覆盖式抽屉。
- 1500—1509年度英国范围缩放显示全部21个事件图标和可证时段内6个政治关系据点；同一地点图标向上错列，而非数字圆圈。
- [调查员的三项地理参考线面](data/geography-1500-hypotheses.geojson)：独立淡色虚线，在1500—1509年可见，可在侧栏关闭。 [原30项研究素材](research/hypotheses/1500/HYPOTHESIS_ENVELOPES.geojson) 保留供继续考证。
- [第二级历史文献与考证库](data/historical-detail-notes.json)：34条记录，一层读故事、二层看具体档案和统计口径。
- [最新项目状态](PROJECT_STATUS.md) / [完整更新日志](CHANGELOG.md)。


### v0.8 · 地图浏览方式（2026-10-12）

多事件地区默认使用小型数字主标记；鼠标悬停或点击主标记展开独立史事SVG图标；点击空白收起。加来历史地理推定包络更醒目，但保持紫色虚线与低透明度。数据集和源档无变动，详见 [更新日志](CHANGELOG.md) 与 [项目现状](PROJECT_STATUS.md)。
