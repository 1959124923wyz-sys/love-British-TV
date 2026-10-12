> **今后每个十年都按此调查纲领执行：**[调查员七步工作流程](../../docs/RESEARCH_TERRITORY_CONTINUITY_PLAYBOOK.md)，[根目录 AGENTS 接手入口](../../AGENTS.md)，[十年过渡台账模板](templates/DECADE_TRANSITION_TEMPLATE.json)，[主编交接模板](templates/EDITOR_HANDOFF_TEMPLATE.md)。
> 通用结构校验脚本：`python3 scripts/validate_control_transition.py --previous <上期数据文件> --transition <本期过渡JSON>`。任何上一期身份遗漏、旧边界未经核验就实心着色，都必须阻止移交。

# 跨年代控制区交接｜研究入口

**研究分支**：`research/territory-continuity-20261012`。本目录是跨十年的持续状态账簿，不改任何正式地图数据或网站代码。

## 先看什么

1. [强制跨年代规范](../../docs/TERRITORY_CONTINUITY_RULE.md)：所有新十年的调查员先复制上一期控制关系，再逐一审查扩张、收缩、终结及附属政体差别。
2. [1519→1520控制区过渡台账](TRANSITION_1519_1520.json)：对应主干1510—1519章的**7条政治状态**，逐条注明1520年代是延续还是结束；另记录吉讷边区和苏格兰独立王国等研究参照。
3. [过渡一致性检查](check_transition.py)：`python3 research/continuity/check_transition.py`；检验上一期状态无遗漏、图尔奈停止、控制区不被误作实测古地理多边形。
4. [进度记录](PROGRESS.md)：Git提交与继续完善建议。

## 交给主编的最低内容

- 进入下一十年之前，先提出**上一章持续控制清单、明确终止清单和证据不足待复核清单**，并说明本章相对上一章新增、减少、转移、恢复的具体地区。
- 城市实控面积符号与推定区域边线必须分层。没有历史真实轮廓时，可给有证据的城市实色核心符号，但不能当真实边界或平方公里。
- “上一章史料止于1519年”并不等于“1519年被逐出”；“1520年才新建标记”也不代表“1520年才征服”。分别识别**资料年代**与**历史政权存续**。
- 对三种时间分别记录：史实开始日期、史实结束日期、史料最后证实日期。
- 每个新章更新过渡台账。主编审核通过并准备发布时，再扩充 `data/`、地图年份与跨章加载逻辑。研究分支不能自动上线。

## 当前过渡边界

**上一章7地点**：加来、都柏林、泽西、马恩、奥克尼、设得兰延续；图尔奈1519年2月终止英方占领。**另外两个研究关系**：吉讷（已有英王边区中新单列的地点，非新征服大区）；独立苏格兰王国（非英国控制区）。已核对研究员原始1520年代 `CONTROL_EPISODES.json` 与主编候选 `ATLAS_REVIEW_CANDIDATE.json`。

本台账不是原始档案的替代品。有关吉讷乡村边界、爱尔兰Pale法权线、驻防持续日期的核验仍必须继续，相关史料直接去当前研究分支查阅。

**1530—1539年调查时不得从空白地图开工**：先将上述未证实终止的状态与1520年代经审核的新增政治关系逐一传递至1529→1530年度过渡表，发现实质变化后再改动政治控制图层。


## 最新：1497—1529全链条已经组装（2026-10-12）
请从 [EDITOR_HANDOFF_1497_1529.md](EDITOR_HANDOFF_1497_1529.md) 开始：**不用重新读各十年全部事件与控制记录**。

- [CONTROL_TIMELINE_1497_1529.json](CONTROL_TIMELINE_1497_1529.json)：9个政治主体/控制关系、33个年末时间状态、6次有明确去向的关键变迁，均保留源文件引用。
- [staged/atlas-1520-1529.json](staged/atlas-1520-1529.json)：把PR #9的24件候审事件、7处历史政治地点、49条来源直接放进第四章接棒结构；未被错误宣布为已经审核通过。
- [staged/french-urban-control-1497-1529.geojson](staged/french-urban-control-1497-1529.geojson)：加来保留至1529；图尔奈只保留1513—1518；既有加来区内的Guînes从1520起独立显示。
- [staged/political-relations-1500-1529.geojson](staged/political-relations-1500-1529.geojson)：都柏林、泽西、马恩、奥克尼、设得兰跨年保留，但继续区分各自政制，**奥克尼/设得兰属独立苏格兰，绝非英属殖民地**。
- [staged/geography-hypotheses-1500-1529.geojson](staged/geography-hypotheses-1500-1529.geojson)：加来与爱尔兰Pale老地图参考虚线不断档，图尔奈外围参考在1519年停用；未复原成历史实测领土多边形。
- [独立连续网站样图](../../preview-continuity-1497-1529.html) / [JS](../../app-continuity-1497-1529-preview.js)：在**不改main**前提下直接试播1497—1529四章、32次年间转换。主编审核后参考此实现合入正式地图。
- [check_full_continuity.py](check_full_continuity.py)：自动核六处原有地点不中断、图尔奈停止、吉讷仅新增显示、历史地理仍为虚线、1520s源引用及33年切片完整。上一版 [check_transition.py](check_transition.py) 继续保留。
- [TRANSITION_1529_1530_RESEARCH_SEED.json](TRANSITION_1529_1530_RESEARCH_SEED.json)：1529年末八种记录完整递交1530年代；因为1530尚未查证，**没有生成1530已确认政治控制区**。

注意：自始至终区别**政治状态存续**、**史料最后记录年份**和**地图象征性几何**。本轮shadow JS已通过静态JS语法解析、远端JSON来源交叉验证；尚未在正式网页浏览器完成手工视觉/交互验收。
