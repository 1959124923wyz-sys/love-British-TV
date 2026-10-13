# 爱英TV｜1540—1549历史研究地图资料包

**2026年10月13日；独立研究分支**：`research/territorial-1540-1549-20261013`。第六章候审数据。正式网站尚未因本研究分支而修改。

## 本期的实质性疆域变化

- **法国布洛涅**：1544年英军攻城之后建立军驻、定居和土地重分配制度，英方控制延续至1549年末；1550年交还法国留给下一期。以现代旧城堡地标画实际控制 **Point**，周边用**800米纯示意虚线圈**（屏幕可读性尺寸，不是英王据地实测面积），不能以圈代替当时Boulonnais边界。
- **苏格兰是独立王国**。英军1547年控制Broughty Castle、Inchcolm和Eyemouth；1548年因奇科姆英军3月撤退、Haddington与Lauder成为要塞、英军取得Hailes Castle；1549年Haddington撤军。每个据点独立按年份显示，**不能把东洛锡安或整个苏格兰填橙色**。
- **新增的两处已核军事据点**：洛赫马本城堡1544年被英军占领、1545年由苏格兰收复；东洛锡安Dunglass的英军山岗营垒于1548—1549年用于哈丁顿驻防。均采用官方遗产遗址Point，Dunglass营垒实址在庄园宅邸以西，现代遗产区地理中心不是1548年营墙。
- **Hailes记录必须谨慎**：只确认1548年军驻；1549年既无证实撤军，也未确认继续占据，台账保留为`uncertain_continuity`，不把它冒充已结束或持续的已核实实色控制。
- **爱尔兰**：1541王室称号变动（官方现代法规引用《Crown of Ireland Act 1542 c.1》），1543年本地领主授予伯爵头衔。英王的法律主张不等于对整座爱尔兰岛实行一致军事、税收和司法控制。
- **加来、吉讷及其他海岛**：保留上一时期的7处具名地理身份，外加独立苏格兰整体政治关系。上一时期的轮廓原样延用并标不精确；威尔士1535/36内部法律改革现代参考范围继续保留，不算新征服。

## 文件

| 文件 | 内容 |
| --- | --- |
| [SOURCE_REGISTRY.json](SOURCE_REGISTRY.json) | 43条有出处的政府、大学、专业史料和档号索引 |
| [CONTROL_TRANSITION_1539_1549.json](CONTROL_TRANSITION_1539_1549.json) | 8处1539年末政制全部承接；10个新增/变更军政地点及1540—1549十份年末快照 |
| [CHRONOLOGY.json](CHRONOLOGY.json) | 30项按记载年份出现的英法战争、苏格兰英军占领与抵抗、爱尔兰、军费历史事件 |
| [ATLAS_REVIEW_CANDIDATE.json](ATLAS_REVIEW_CANDIDATE.json) | 候审Atlas：30事件、16地点、41条本期直接关联引用 |
| [MAP_REFERENCE_OUTLINES_1540_1549.geojson](MAP_REFERENCE_OUTLINES_1540_1549.geojson) | 13个虚线参考图形，8处原有地理参考 + 5个完全标注示意性质的城区/要塞虚线圈 |
| [ACTIVE_CONTROL_PLACES_1540_1549.geojson](ACTIVE_CONTROL_PLACES_1540_1549.geojson) | 16个Point：7延续政治地名与9已研究军驻城市/堡垒 |
| [MAP_DELTA_1540_1549.geojson](MAP_DELTA_1540_1549.geojson) | 13处控制取得、撤离和法权变化示意点 |
| [FINANCIAL_EVIDENCE.json](FINANCIAL_EVIDENCE.json) | 6项费用、募税和殖民土地利用；1545估计募税£119,581；1549债务“超过£300,000”为君主政治声明而非审计净值 |
| [ARCHIVAL_ACTION_QUEUE.json](ARCHIVAL_ACTION_QUEUE.json) | 22个补档任务，重点是布洛涅乡村边界、Eyemouth古棱堡原图、Irish Gaelic领主局部权力 |
| [TRANSITION_1549_1550_RESEARCH_SEED.json](TRANSITION_1549_1550_RESEARCH_SEED.json) | 下一章1550年据地归还、撤军和旧政治关系的连续性研究种子 |
| [interactive_research_preview.html](interactive_research_preview.html) | Leaflet独立交互地图。逐年显示，双击事件定位并高亮，缩放保持不变 |
| [validate_research.py](validate_research.py) | 地理、史料、年末控制状态和财政估算口径校验 |

## 数据史料与版权口径

**无任何获验证的16世纪边疆实测Polygon。** 继承的Calais Pale/爱尔兰Pale是不精确旧地名包络，五岛形状为现代海岸线参考，威尔士为现代法律地理参考。新添加的5个透明虚线圆，只是帮助读者找得到布洛涅/英军苏格兰堡垒，不是历史据地面积，更不能计算平方公里。旧现代海岛GeoJSON适用项目既有GPL-3.0-or-later来源与许可提示。原历史军事测绘例如National Library Scotland英式棱堡档案和British Library Cotton图仅作为追索对象，**没有复制或临摹受限制地图**。

史料中，剑桥大学出版社Murphy 2019 Boulogne专著提供重要殖民统治概览，但原著全文受访问限制，**此次阅读的是开放的章节摘要**。苏格兰军驻/撤离优先使用Historic Environment Scotland官方史料说明。TNA 1545 £119,581是官方页面转述的史学估值，**不是法国殖民地利润或一手原账核实金额**。

**交给主编**：[EDITOR_HANDOFF.md](EDITOR_HANDOFF.md)。
