# 爱英TV｜主编16 第五批：1704—1799爱尔兰惩罚法、地权与1798起义镇压互动地图

**2026-11-08｜分支 `map/18c-ireland-penal-rebellion-20261108`｜研究试阅 `?review18c=1`｜Draft｜未发表 `main`。**

## 1. 先查原始研究，才绘制地图

本批只领取主编15的 `T29`「爱尔兰惩罚法、宗教财产权与1720依附法律」及 `T30`「1798爱尔兰起义与英国镇压」，优先检索 `research/18c/consolidated/series/T29.json`、`series/T30.json`、完整 `MERGED_EPISODE_GROUPS.json` 与 `COMPLETE_1126_ARCHIVE_CROSSWALK.csv`，逐个对应原始 `C-...` ID。

- 原归并表共**10组**，其中T29有5组、T30有5组；**T30-05 Carnew战斗的7日/30日日期冲突暂不升级为精准地图事件**。
- 直接从原组拆分/转译为当前年份事件，或明确标记本批从爱尔兰国家档案馆、英国国家陆军博物馆、1798地方历史中心新增的补证事件；不为未选入315条的原正文材料制造虚假的合并组ID。
- 重要原始史料来源在集中ZIP `18c_consolidation/SOURCES_C.json`，`scripts/audit_18c_ireland_source_registry.py` 精确核对T29+T30实际用到的**23个C命名空间原始来源代码**；不依赖临时网络检索充当原档。
- 新核机构和现代地名来源登记层 `original_registry_key:null`，与原助手C来源明确分开。

## 2. 数据与正文

| 材料 | 成果 |
|---|---|
| `data/stories/serial/chronology-preview-ireland-1700-1799.json` | 20个具年Atlas候审事件，1704—1798，有史料/责任主体/原ID/现代坐标精度/控制门禁 |
| `data/stories/serial/e18-t29-t30-ireland-penal-rebellion-1704-1799.json` | 16节、48段中文长篇；20个真实 `[[已登记ID|行为词句]]`；29项来源 |
| `data/stories/serial/preview-18c-index.json` | 在阿卡迪亚、孟加拉、牙买加、Atlantic/Zong之后登记第五篇；正式 `data/stories/serial/index.json` 不动 |
| `js/history-stories.js` | 继承17世纪**已发表** `E6-T03-LAND-1642-1698` 与 `E6-T03-WILLIAMITE-WAR`，只在显式研究模式展示18世纪后篇入口 |
| `app.js` | 复用真实Leaflet地图和17世纪按年年轴、聚合及事件档案，不创建离线演示网页 |
| `research/continuity/1798-ireland/CONTROL_EPISODES_1798.json` | 7项具起止时序的地方军事控制/争夺及法国入境**研究期片段**，不画任何实控面 |

## 3. 史料核实的历史主题与主体

1. **1704惩罚法**：2 Anne c.6规定天主教财产权、部分租赁与继承、子女教育/监护、公职和宗教身份资格。明尼苏达大学法律图书馆的转写按议会会期标为**1703**，主编15年表与史学资料区分王室**1704-03-04**批准，属于同一法案不同日期口径。法条不自动证明所有私人土地当年被国家实地没收。
2. **1720依附法**：伦敦议会在Sherlock v Annesley上诉争议后宣布可对爱尔兰立法并拥有终审权。爱尔兰当时依然是有都柏林议会的**单独王国**，不是1720变成大不列颠的新郡县。
3. **1762乡村Whiteboys**：多地主地、租佃和税费争议，非具固定战争疆界的统一自治政权。
4. **1778部分天主教地权救济及1782撤1720法**：英国议会官方史说明1782爱尔兰议会逐步争得法案制定权，但伦敦任命的总督及首席秘书持续掌握行政。故立法改革不能绘为爱尔兰完全独立。
5. **1791联合爱尔兰人**：Belfast政治改革运动包括新教长老会等力量，后转向争取共和国。不能写成单一种族/宗教军团。
6. **1797—1798反叛乱镇压与战争**：英国任命政府、正规军、爱尔兰民兵和地方效忠派团体实际关系、暴力事件逐件归属，国家陆军博物馆记录审讯、酷刑、房舍焚毁、抓捕与报复。
7. **1798-05-24 Dunlavin**：Wicklow地方史学者Chris Lawlor详细复核当年私信、后世目击记忆与不同受害者名单。36名被带往绿地枪杀，另有后续吊死者；旧43人的表述不能作为完全核实的最终死亡名单。**责任为Ancient Britons等亲政府武装**。
8. **1798-05-27 Oulart**：起义军击败North Cork Militia；国家档案馆有1798年5月27日Wexford副市长原信影印与说明。地点使用Sport Ireland 现代Oulart Hill 52.512104,-6.403327。
9. **1798年5月末短暂控制Enniscorthy与Wexford**：17份原档官方讲解把控制延续大致截至6月21日Vinegar Hill战役；不能将起义军当年短暂占城绘成十年连续领土。
10. **1798-06-05 New Ross与Scullabogue**：New Ross政府军与起义军互有得失，战斗中双方伤亡；同日Scullabogue部分起义者杀害100多名被囚亲政府人士。**Scullabogue罪责属于起义方**，不是英国政府军。
11. **1798-06-07 Antrim**：Henry Joy McCracken等北方起义军曾短暂突入Antrim后被政府击败，北部起义参与者中有长老会新教徒。
12. **1798-06-21 Vinegar Hill及政府报复**：政府军炮击起义营地后，部分效忠武装对战败起义者和平民实行残酷报复；总督Cornwallis谴责军队暴行。Vinegar Hill坐标来自爱尔兰考古登记52.502764,-6.552728，为**现代遗址定位**不是参战部队古战线。
13. **1798年西部法军干预及Ballinamuck**：法国Humbert 8月23日进入Killala区域，9月8日Ballinamuck法爱联军战败。法国军队不能划成英国军队，Killala现代镇点不冒充实际船艇靠岸地点。

## 4. GIS / 图标语义门禁

- 本次有**8个现代命名地点/考古或官方纪念地参考点**，其余12条保留`lat:null/lng:null`。地名资料来自Sport Ireland、爱尔兰考古发掘登记、Getty TGN和现代GeoNames/OSM姓名档案。
- **0个新殖民/起义军实控Polygon、0条凭空军队线路、0个从现代行政边界推导的古代统治面积。** 地图上的Wexford、Dublin、Antrim郡等现代界线不能直接当1798行政或战线。
- 7项`CONTROL_EPISODES_1798`有独立日期精度说明，Enniscorthy/Wexford等短暂被起义军控制至**不晚于**6月21日；New Ross/Antrim属于短时战斗，Killala French-United Irish短暂控制另列。任何片段**不自动延续至1798-12-31**。
- 起义被镇压之后的年末政体状况不等于已详细完成全岛每个旧殖民驻军`stable_id`的真实疆界审核。下一批应从1699年末继承基础单独审查，不把十年政策事件当实控范围。
- 1700—1799其他年份事件不足，不代表没有对应历史活动；绝不臆造“空白年没有战乱”。

## 5. 正式来源、原档与级别

- [英国议会：1720年爱尔兰依附法](https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/parliamentandireland/overview/constitutional-differences/) 与 [1782改革](https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/parliamentandireland/overview/meeting-irelands-terms/)
- [明尼苏达大学法律图书馆：2 Anne c.6逐条法律节录](https://librarycollections.law.umn.edu/archive/irishlaws/chron-anne.html)
- [爱尔兰国家档案馆：1798起义17份原始文书影印选编](https://www.nationalarchives.ie/PDF/1798.pdf)（官方影印教育包，不等同逐页阅档手稿原本）
- [英国国家陆军博物馆：Irish Rebellion 1798](https://www.nam.ac.uk/explore/irish-rebellion-1798)
- [Wicklow Heritage：Dunlavin 1798地方史学者详细研究](https://heritage.wicklowheritage.org/new-contributions/the-dunlavin-massacre-24-may-1798)
- [Sport Ireland：Oulart Hill历史步道及GPS](https://www.sportireland.ie/outdoors/walking/trails/oulart-hill-1798-walking-hub-cosan-na-gloire)
- [爱尔兰考古登记：Vinegar Hill战场](https://excavations.ie/report/2022/Wexford/0031602/)
- [国家1798起义中心：具体交战日程](https://1798centre.ie/history/timeline-of-1798/)
- [Cambridge：1778宗教土地权利改变之研究摘要](https://www.cambridge.org/core/journals/church-history/article/abs/catholic-relief-act-in-ireland-1778/00046185A6727830F62990B4BB170D6E)

文中保留国家军队博物馆的主权国家叙事与现代爱尔兰地方研究的视角差异。原文中个别士兵信件有偏见、地方死亡人数有分歧，逐点证据未通过终审前均为研究候审内容。

## 6. 自动验收及接棒

- 静态：`node scripts/test_18c_ireland_map.js`，自动重跑阿卡迪亚、孟加拉、牙买加、大西洋/Zong四批；保留16C/17C老文章连通。
- 档案：`python3 scripts/test_18c_archival_integrity.py` 查162/315/1126与三份ZIP原件SHA；`python3 scripts/audit_18c_ireland_source_registry.py` 核T29/T30原C来源键。
- 空间：`python3 scripts/audit_spatial_semantics.py --strict`。
- 真实桌面：`python3 scripts/browser_18c_ireland_rebellion.py` 以1780×1020打开原Leaflet年轴/文章/档案，从1798单击Oulart地图平移、1704法律跨年、双击Dunlavin返回，并跑上四批浏览器回归，截图GitHub Actions附件。
- 独立工作流`.github/workflows/18c-ireland-map.yml` 与来源索引`.github/workflows/18c-ireland-original-sources.yml` 均适用该分支；真实CI结果请到相应动作运行记录查看，不以报告文字替代验收。
- 进度书面保存但不合入`main`；等待下一任主编/历史审查确认后再讨论分支与正式年表的合并。

**下一批建议**：从已有原助手C来源调查 `T31` 达连1700和英苏1707联合的政治控制接续；或 `T34/T35` 澳大利亚1788—1799原住民土地、暴力、财政和强迫流动。仍须每个系列先读原研究再补外部来源。
