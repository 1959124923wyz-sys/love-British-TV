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
