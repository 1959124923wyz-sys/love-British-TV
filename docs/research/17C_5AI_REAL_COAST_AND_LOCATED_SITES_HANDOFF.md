# 第 5AI 批｜1600—1699 旧参考矩形全面退出显示：真实岛岸与史料地点

最后复核：2026-11-21。基线：第5AH批主分支（PR #495、fdddf864）。本文件供GIS研究与后续智能体使用，非读者界面文案。

## 发布变更与严谨口径

**原始源文件不改动。** 5AH确证的26条轴线平行矩形原本分布在以下数据文件，全年代依旧可以检索对应档案：

- 14条特许法权／公司商馆／军事驻点粗框：\`data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson\`
- 12条战斗／聚落／海岸研究阅读框：\`data/seventeenth-century-regional-studies-1600-1699.geojson\`

本批新增 [**真实地理和点位 GeoJSON**](../../data/seventeenth-century-editor43-5ai-localized-geometries-1600-1699.geojson)，按旧ID建立26组一一追踪关系：

| 属性 | 本批变化 |
| --- | ---: |
| 原始旧矩形退出正式地图显示 | **26/26** |
| 用真实自然岛岸替代的原参考框 | **3**（圣赫勒拿、普罗维登西亚、圣基茨／尼维斯） |
| 新增真实自然岛岸面 | **4**（圣基茨、尼维斯严格拆开并按1628年起算） |
| 其他旧框改为具名地点的组 | **23** |
| 已核史事来源的局部地点 Point | **30**（11个原特许/商馆框地点，19个原战事专题点） |
| 声称新恢复的17世纪准确军事/领土边界 | **0** |
| 原26条矩形还在正式地图继续绘制 | **0** |
| **原26条矩形在史料源数据中保留** | **26** |

📌 精确 ID—来源—显示几何—年度映射：[17C_5AI_26_RECTANGLE_DISPOSITIONS.json](17C_5AI_26_RECTANGLE_DISPOSITIONS.json)。以前5AH的旧框台账**冻结原样**作为历史快照，新表显示退役去向。不得把现代自然海岸线自动视作英国领土实测边界。

### 三处岛屿：实际多边形而非又一批人造面积框

| 原框 | 新形状与年份 | 身份、证据与注意点 |
| --- | --- | --- |
| \`claim-st-helena-1659\` | \`EDITOR43_5AI_ST_HELENA_ISLAND\` 1659—1699，28个闭环海岸顶点 | 圣赫勒拿岛本岛自然岸线。圣赫勒拿政府确认1659年东印度公司殖民，1673年存在荷兰短占及英方重占，不能把整座岛的1630年代或1673年每一日都画作连续英军实控。https://www.sainthelena.gov.sh/st-helena/history-and-heritage/ |
| \`claim-providence-island-1630\` | \`EDITOR43_5AI_PROVIDENCIA_ISLAND\` 1630—1640，9个闭环顶点 | 哥伦比亚Old Providence／Isla de Providencia本岛位置，殖民公司1630起、1641被西班牙攻取。Natural Earth 10m该小岛只有9顶点，是**粗比例尺地理岸线**，如需沿岸地籍需找更精细海岸数据。https://www.cambridge.org/core/books/providence-island-16301641/2D80A7915966CD48D2401A45EB2C0EDD/listing |
| \`claim-st-kitts-nevis-1623\` | \`EDITOR43_5AI_ST_KITTS_ISLAND\` 1623—1631（28顶点）和 \`EDITOR43_5AI_NEVIS_ISLAND\` 1628—1631（15顶点） | 圣基茨另有法国殖民者及卡利纳戈人土地，**英法分区尚无同期精确边线**；尼维斯英国殖民据点1628始建，不能在1623年使尼维斯“英属”。参考联合国文献与学术研究。https://www.un.org/dppa/decolonization/sites/www.un.org.dppa.decolonization/files/decon_num_18-1.pdf 、 https://www.forumfed.org/libdocs/FedCountries/FC-StKitts.pdf |

现代岛岸 GIS 来源为 [Natural Earth 1:10m Land v5.1.1](https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-land/)，公开领域地图数据，许可 https://www.naturalearthdata.com/about/terms-of-use/ 。原 ZIP 固定 URL https://naturalearth.s3.amazonaws.com/10m_physical/ne_10m_land.zip ，SHA256 \`e547d749445eaa0964aba76738090ec88f5e63c4585122170f98c67a7ea922dc\`。全套4组由同一公开原数据提取，GitHub Actions及生成脚本可重复运行，抽取时验证各岛国位置、边界限位、几何有效性与原source_urls。未补画不存在的海岸顶点；数字较少的岛继续升级 GIS 源。

### 其他23条阅读框与机构框

其余11个原殖民地／商馆／堡垒的参考框，转用原 Atlas 已有经过来源审查的历史地点：魁北克、普罗维登斯、丹吉尔、海岸角、孟买、马德拉斯、苏拉特、胡格利、苏塔纳蒂、明古伦、万丹。统一区分早期商贸许可、英国军政实际驻点、王室特许及当地既有国家权力。

另有12条战斗／战争地区多地点读者示意框，共18—19个具名来源锚点，以原 \`anchor_places\`＋对应 Atlas \`source_event_id\`和**完全相等的历史坐标**重新定位：塞布鲁克—米斯蒂克、詹姆斯敦—凯考坦、里奥努埃沃、帕沃尼亚—科利尔斯角、1670/1680两处查尔斯敦、哈德孙湾三堡、1629两处皇家港、1690皇家港、1696博巴桑、1696费里兰、1696圣约翰斯、1667梅德韦。每个点分别沿原研究案源和年份呈现，地图上不再用一个地区矩形包住好几座相距甚远的堡垒。

**严格区分参与方：** 1643帕沃尼亚／科利尔斯角的施暴者是**荷兰新尼德兰殖民当局**，1658里奥努埃沃为英军与西班牙力量交锋，1696阿卡迪亚袭击须标出法方和米克马克主权关系。地点进入英国殖民历史项目，不应把所有对象涂为英方主权区域。

## 技术安排与人工验收

- 源数据编译：\`scripts/build_editor43_5ai_17c_localized_geometry.py\`，经GitHub Actions从Natural Earth读取公共海岸多边形，并只复制既有事件坐标；生成文件的\`metadata.natural_earth_zip_sha256\`可验证源。
- 地图渲染：\`app.js\`保留两个原始GeoJSON作为档案入口；只有生成文件通过26 ID、34 feature、年代、史料URL与领域区分检验后，绘制分支才从26旧框切换到新形状／点。
- 可逆回退：若新地理数据加载失败，旧史料可供读者继续检索；禁止因新图文件错误而清空整世纪历史记录。
- 代码验收：\`scripts/test_editor43_5ai_17c_localized_areas.js\`＋原5AH／17C完整测试、\`python3 scripts/audit_spatial_semantics.py --strict\`。
- 真实浏览器：\`scripts/browser_editor43_5ai_localized_17c.py\`按1602—1700年逐年检查，另修订前批5AE、原17C示意屏幕数量以兼容已批准的26条视觉退役。
- 用户界面只呈现年份、人物、政治身份、殖民活动、地方反抗和来源，审计字段及制图免责声明仅用于研究记录。

## 5AJ及后续最应该真实补面的地方

1. **仍未配准的17世纪具名城镇与城堡。** 1630—1641普罗维登西亚岛英方堡址、1662—1684丹吉尔城防与海湾口、1665海岸角原瑞典堡（注意十八世纪后期重建不能前推）、1640马德拉斯最早圣乔治堡、1650年代胡格利的交易建筑地籍、1690年代三村地契原线。
2. **其余非标准矩形参考区。** 5AH原筛查之外的7条默认隐藏巨大特许包络，17世纪12条削角8边的战地/财产权示意区域，与16世纪图层全部重新建同等稳定ID清单；不能以“原26条都退役”宣称无概略示意。
3. **精细海岸源升级。** 普罗维登西亚和尼维斯的10m海岸顶点较少，下一步考虑官方 GIS 或有公开许可的海岸数据和同期地图匹配；保留原 naturalearth.zip SHA 与 geometry_sha256。
4. **十八世纪点转面继续跟踪。** 5AH已将165个近邻候选中30项标记禁误套，其余135条要按同一历史地物、年份、测绘比例和来源重新核对；不得直接近邻批量替换。
5. **16/17世纪原住民族政治地理。** 从实际协议、村落历史、堡墙和调查测绘出发，避免英国商站获准经营后把本地土地主权整片染色。

真实历史边界仍沿原主题原则：史图可证但有不确定的轮廓使用虚线；只知道地点就显示地点。重大事件加入互动需遵照16世纪成套范式，维护源、时间、权属和前后交接。
