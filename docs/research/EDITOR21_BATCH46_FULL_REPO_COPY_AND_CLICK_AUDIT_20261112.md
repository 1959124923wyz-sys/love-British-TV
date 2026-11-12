# 第46批：16—18世纪地图交互及制图说明全仓宽口径审计

## 问题

用户于1762年地图发现大量透明区域无法通过鼠标直接选择，也再次看到诸如：

> 区域海河贸易通道，非英国河两岸主权  
> 虚线为概略历史地理参考，边界未经历史地图实测配准。

等制图学术说明。此次审计扩大到整个仓库，**区分源文件存储与读者页面实际渲染**，保留可追溯原始史料与地理不确定性标记。

## 全仓扫描结果（首次快照）

在第46批审计脚本 `scripts/audit_atlas46_editorial_copy.py` 执行时：

| 项目 | 数量 |
|---|---:|
| 被扫描的文本文件（JSON/GeoJSON/HTML/JS/CSS/MD/YAML/TXT） | 935 |
| 宽口径疑似说明片段 | **6,332** |
| 涉及文件 | 599 |
| JSON 中标题、说明、描述等潜在展示字段 | 1,444 |
| 历史数据与空间精度等研究元字段 | 2,785 |
| JS、HTML、文档等其他文本 | 2,103 |
| 潜在展示字段与前端源码汇总 | 1,615 |

宽口径分类（允许同一条多次命中）：

| 类别 | 匹配数 |
|---|---:|
| 虚线、线框与色块 | 1,774 |
| 未核边界、几何与坐标 | 1,764 |
| 控制、主权及占地提醒 | 1,141 |
| 读者编辑提示 | 951 |
| 计算面积与重叠限制 | 769 |
| 学术式限定语 | 764 |

**解释**：这是高召回、低精度的疑似片段排查表，不等于页面上有6,332句遗漏提示。源文件中 `area_sqkm` 等程序字段、原始史料中的真实主权争议，以及开发文件中的描述都会命中。移除这些基础史料会损害可核查性，因此仅修改读者展示层。

### 来源最多的文件

| 文件 | 宽口径疑似片段数 |
|---|---:|
| `data/atlas-1690-1699.json` | 284 |
| `data/atlas-1670-1679.json` | 263 |
| `data/seventeenth-century-spatial-evidence-1600-1699.geojson` | 209 |
| `data/atlas-1680-1689.json` | 186 |
| `data/atlas-1660-1669.json` | 167 |
| `data/atlas-1650-1659.json` | 153 |
| `data/eighteenth-century-expansion-batch36-1700-1799.json` | 144 |
| `data/seventeenth-century-regional-studies-1600-1699.geojson` | 126 |
| `data/atlas-1640-1649.json` | 122 |
| `data/atlas-1610-1619.json` | 116 |
| `data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson` | 108 |
| `app.js` | 94 |

完整每一项 `file`、`where`、类别、原文及总数统计，以 GitHub Actions `atlas46-comprehensive-ui-and-source-copy-inventory` 工件中的 `atlas46-editorial-copy-audit.json` 和 `.md` 提供；以后可以重复运行，不必依赖关键词的人工记忆。

## 确认定位的用户原句

- `data/eighteenth-century-b38-hudson-company.json` / `zones[B38-H-Z006].note`：**“区域海河贸易通道，非英国河两岸主权”**。
- 18世纪地图批量区域组件 `js/eighteenth-mass-spatial.js` 此前直接 `escapeHTML(x.note)` 输出到右侧；已替换为与其他组件一致的 `AtlasReaderCopy.clean()`，不删除历史事实和来源。
- 原有过滤器漏掉对河口、航运通道、贸易信函路线与实际主权之间的编辑提醒；已扩大规则并加入原句测试。

## 发现的交互问题与修复

过去第44批主要在 Leaflet 的 `map.on('click')` 上接收背景点击，区块路径 `bubblingMouseEvents:false`、其他覆盖的 SVG 路径或图形标记可截断事件传播。即使地理命中算法识别到区域，内部鼠标点击仍可能到不了背景处理器。

- **18世纪**：在地图容器 capture 阶段以鼠标真实地理坐标执行 `locate`，统一处理可见区域边线、内部透明部分及多区重叠；为事件 marker、控制面板、tooltip 保留其原有交互。
- **16／17世纪**：对普通地图背景增加坐标判定，保留历史区块自己的SVG点击和原有事件图标；扩充对背景传播被阻断时的响应。
- 保留原有历史数据信息、每年变化、独立右侧来源链接、悬停发光及虚线地图绘制。
- 不修改 main；本分支直接接续第45批 Draft PR。

## 验收与剩余范围

自动化检查：`scripts/test_atlas_46_copy_click.js` 验证精确提示过滤和历史事实保留；`scripts/browser_atlas_46_real_pointer.py` 使用实际 Chrome 鼠标像素点击1762年哈瓦那重叠区域与1783年哈德孙湾贸易区块；同时执行第44批回归。

> 由于审计采用宽口径，仍需按实际显示入口逐步消解剩余优先级较高的提示，不应把原始 `geo_precision`、史料地理状态和 source_urls 等字段全仓删除。
