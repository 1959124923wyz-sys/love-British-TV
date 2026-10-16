# 爱英TV｜专题12、13接班记录（2026-10-16）

## 12 威尔士与爱尔兰制度变革
正式篇名“1536—1542年都铎王权在威尔士和爱尔兰的制度重组”。用户最初要求1536—1541，然而关联的 `1540S-044` 在1542年发生，因此本篇主体仍为1536—1541，另设1542年康恩·奥尼尔归附与蒂龙伯爵受封的后续章节，不能把此事实写成1541年。

- `1530S-E007`：1535年《威尔士法律法》（27 Hen VIII c.26）于1536年前后实行郡县、司法调整，限制威尔士语在法院和任职方面的地位。1535年的短题不等于独立威尔士王国在1536年才被入侵；第二项1542年威尔士法律法在1542/43会期通过，不倒填到1541。
- `1530S-E009`：1536年爱尔兰议会推动英王教会最高权；`1530S-E024`：1537英语与衣饰同化法律，一部分规定1539年开始生效。
- `1530S-E014`：奥法利王室军事压力具名地区已知，但逐堡实际控制范围缺独立来源，保持无证战争多边形为空。
- `1540S-002`：1541年爱尔兰议会通过国王称号法令，官方现代短题为“1542年爱尔兰王冠法”；`1540S-044`：1542奥尼尔受封，属于地方领主与王室谈判，不是直接军事占据。
- 来源：英国官方立法数据库两部威尔士法、爱尔兰王冠法、皇家爱尔兰学院Dictionary of Irish Biography、Cambridge《Irish Historical Studies》Heffernan及Lydon可读摘要，大学公开1537法条摘录。来源访问层级在专题JSON中列明。
- 地理限制：`data/welsh-legal-shires-1535.json`十三处法律地名仍无可核同时代地理多边形；制度变化不产生“新增英王领土面积”。

## 13 亨利八世本土海岸防务1539—1547
全部依据English Heritage和Historic England官方古迹历史，不与海外侵略、殖民获利混算。

| 工程 | 日期与依据 | 地点 |
|---|---|---|
| Deal、Walmer、Sandown | 1539兴建、1540年10月三堡建成；Walmer于1540首次有驻军 | 肯特The Downs |
| Archcliffe | 1539—1540，Historic England NHLE 1016420，现代NGR TR31516 40283 | 多佛；原1539城墙不可由后期遗产界外推 |
| Portland、Sandsfoot | Portland 1539—1540；Sandsfoot约1541（NHLE1096763） | 多塞特锚地两岸 |
| Pendennis、St Mawes | Pendennis 1539—1545；St Mawes主堡1540—1543（NHLE1136705） | 康沃尔Fal河口 |
| Hurst | 1541开工、1542以Thomas Bertie为首设驻军、1544完工且约20炮 | 索伦特海峡西口 |
| 1547实存炮数 | Deal 57门，Portland 15门；Deal设计140余门不是实际配置 | 官方古迹资料 |

地图增2个1539年炮堡建设地点、9个1540—1547年建设／驻军／实际军备节点，并以官方NGR为多佛Archcliffe旧事件改进现代遗址参考坐标。各节点为英格兰本土防卫，与殖民控制或掠夺面积无关；没有新增臆造炮火覆盖扇形和战线。

## 文件与QA
正文：`data/stories/tudor-wales-ireland-legal-restructuring-1536-1542.json`、`data/stories/henry-viii-device-forts-coastal-defence-1539-1547.json`。登记：`data/stories/index.json` 共12篇。地点：`data/atlas-1530-1539.json`、`data/atlas-1540-1549.json`。引用与坐标精度：`data/historical-detail-notes.json`。

专项测试：`scripts/test_tudor_governance_device_forts.js`、`scripts/browser_tudor_device_forts.py`。已加入major-history-stories和Pages工作流。合并前逐项核对PR的最新HEAD CI；部署后必须检查Pages success。历史疆界尚未得到同年代配准，未新建占领Polygon。
