# 爱英TV｜主编10接任基线与执行优先级（2026-10-24）

> 性质：接任时（2026-10-24 14:58 UTC）的历史基线与后来执行进展。第一节中的12篇/22项属于当时快照，**不是最新统计**。以本文件末尾更新章节及最新main复核。仅作编审交接，不代表未经史料支持的新版图。

## 1. 接任时已确认

- 仓库：`1959124923wyz-sys/love-British-TV`，默认分支 `main`。接任核对的最近正式专题合并提交：`edfed4f283c299671e9b610dfd8d5b193a573b9f`（PR [#221](https://github.com/1959124923wyz-sys/love-British-TV/pull/221)；2026-10-24 14:58 UTC）。
- `data/chapters.json` 中 **1497—1599年的十个正式十年章节**为 `published`。此统计不包括17世纪长期专题；**不能把12篇17世纪专题当作已发表十个17世纪年代章节**。
- `data/stories/serial/index.json` 共 **22个条目：12个 `published`、10个 `research_only`**。后一类包括尚未完成的母专题，不能由于子篇发表便自动改成published。请以实际索引及approved准入字段为准。
- 最近4篇主编9交付：[#215](https://github.com/1959124923wyz-sys/love-British-TV/pull/215) 纽约；[#217](https://github.com/1959124923wyz-sys/love-British-TV/pull/217) 卡罗来纳；[#219](https://github.com/1959124923wyz-sys/love-British-TV/pull/219) 哈德孙湾；[#221](https://github.com/1959124923wyz-sys/love-British-TV/pull/221) 阿卡迪亚。以上均经单独GitHub PR合并。
- #221 PR HEAD `90aed9e3e6b3b7874a9d81a25d323cdc1b265d8f` 的27项可见工作流均为 `completed/success`。**这不是独立确认合并后Pages部署成功**；任何“网站已上线”的最终说法需单独核对Pages。
- #221交接：[阿卡迪亚历史与地理](EDITOR9_E6_T10_ACADIA_20261024.md)，严格区分1605 Port-Royal Habitation、1629 Scottish Charles Fort、1654—1670英方驻点控制及1690短时袭击与米克马克自主权。未证殖民边界不画实控面积。
- `AGENTS.md`目前记载12篇已发表17C子专题。第十二篇合并后，ZIP更新PR [#222](https://github.com/1959124923wyz-sys/love-British-TV/pull/222) 已于2026-10-24合并（此前[#220](https://github.com/1959124923wyz-sys/love-British-TV/pull/220)只含11篇）；如需独立验收，仍须检查最新主分支ZIP的CRC、MANIFEST和正文，而不能把用户此前上传的较旧参考包当作最新归档。

## 2. 已核待办及原则

| 优先 | 问题 | 已知状态 | 下一步（尚未宣称完成） |
| --- | --- | --- | --- |
| P0 | [#46](https://github.com/1959124923wyz-sys/love-British-TV/issues/46) 1547—1549英军实际占领范围 | Issue仍open；驻军点、方向线和非实测虚线概略面不能代表真实领土 | 核英国/苏格兰原时期堡图、据点控制时序及测绘参照；只对有据局部面作有据显示，其余留空/虚线与不计面积 |
| P1 | 17C专题与逐年地图的差距 | 12篇serial已发表，不等于1600—1699整世纪控制/边界/航线/年末状态完备 | 按十年建立政治主体和控制继承台账，梳理地点、实际占领、短时袭击、贸易网络，明确真实边界与概念层 |
| P1 | E6-T10纽芬兰子题缺口 | HBC、Acadia子题published，E6-T10母题仍research_only | 逐份核官方或学术史料，检验纽芬兰港口/渔场、各国据点、原住民权利及时段；条件符合再独立出子篇，绝不将季节性渔业当主权 |
| 已合并、待独立校验 | 16C制作标准ZIP同步 | #222已合并，归档第12篇阿卡迪亚交接；旧用户附件不包含最新AGENTS | 可选择核主分支ZIP的MANIFEST/CRC/SHA和AGENTS收录，勿重复提交相同自动归档PR |
| P1 | [#180](https://github.com/1959124923wyz-sys/love-British-TV/issues/180) 原始研究ZIP归档 | Issue仍open，正文明确并未将R05全量ZIP字节归档到GitHub | 实际核附件或分支原始字节入库状态；不得将索引/本地存在当远程归档 |
| P2 | [#81](https://github.com/1959124923wyz-sys/love-British-TV/issues/81)、[#84](https://github.com/1959124923wyz-sys/love-British-TV/issues/84)等存量史学审校 | Issue open，旧数字来自旧主分支，不可直接当当前规模 | 按最新main重跑，逐条核重要性理由及Pale概略边界，不用填表代替真实史料 |

## 3. 强制交付底线

1. 完整专业历史叙述，不把面向研究者的元解释/审核备注塞给普通观众；逐段研究断言对应可追溯源。
2. 专题正文必须使用真实已核事件 `[[事件ID|自然语言史实]]`；单击切事件年份并平移地图，双击档案，返回恢复入口；检查跨十年。
3. 正式历史疆域、驻军据点、现代地点参考、军事行动虚线研究框、原住民自治、商业特许必须明确区分；任何不确定古代版图用虚线，`area_sqkm:null`和排除面积汇总，禁止虚构测量。
4. 不混淆1600—1699与1700以后事实、1707年前的苏格兰与英格兰、特许经营与真实政治控制；上一年代控制`stable_id`必须逐一交代。
5. 甲乙丙调查组研究PR（[#182](https://github.com/1959124923wyz-sys/love-British-TV/pull/182)、[#183](https://github.com/1959124923wyz-sys/love-British-TV/pull/183)、[#184](https://github.com/1959124923wyz-sys/love-British-TV/pull/184)等）是候审资料；严禁整包覆盖已更新的正式十年Atlas或无来源批量合并。
6. 每批工作独立分支，阶段commit+交接文件；检查通过才能PR合并，核实部署完成才能向用户称网站更新。用户不需要执行代码/修改GitHub。

## 4. 下一批主编工作建议

按“先验证发布/归档状态→巩固已发表地图质量→补证有据的动态控制与网络→继续纽芬兰及其余候审母题”的顺序执行。尤其不能为了赶专题数量，把**地图缺乏真实逐年控制变化**的核心问题掩盖。

必读：[AGENTS.md](../../AGENTS.md)、[16C成熟范式](../templates/16c-story-map-standard/README.md)、[接班手册](../EDITOR_SUCCESSION_PLAYBOOK_20261016.md)、[点线面史学规范](../HISTORICAL_SPATIAL_NARRATIVE_STANDARD.md)、[版图连续性规则](../TERRITORY_CONTINUITY_RULE.md)。

## 5. 2026-10-24主编10后续实际进展（本节优先于上述接任初始快照）

- 第十三篇子专题 `E6-T10-NEWFOUNDLAND` 已由 [PR #224](https://github.com/1959124923wyz-sys/love-British-TV/pull/224) 成功合并：16节、20份来源、12个新增Atlas事件、14处逐年辅助参考点、2个不计面积的1696短期虚线阅读框；PR HEAD **27/27** GitHub Actions成功。新增网页文章链接符合16世纪`[[事件ID|史实]]`机制。当前serial目录 **23项/13项published/10项research_only**，十个1497—1599正式年代章节不变。法军短期袭击不等于法国占领整个纽芬兰岛；贝奥图克人土地与政治权利不由英法特许或渔业法律自动消灭。史料与地理纠错参见 [纽芬兰交接](EDITOR10_E6_T10_NEWFOUNDLAND_20261024.md)。
- 第十三篇成功合并后，自动归档 [PR #225](https://github.com/1959124923wyz-sys/love-British-TV/pull/225) 经核**只改动16C制作标准ZIP一个二进制文件**且CI成功，已合并，合并提交 `4b8b1020964d0efa0676eaa24f4bc0786fa3c7a1`。不要用用户当初的旧ZIP取代。
- 主编10发现另一处**影响实际地图镜头的关键历史地理错误**：1697年Rijswijk（荷兰赖斯韦克）误写西经4.327°，应是东经约4.328°，其地图事件原指向威尔士地区。修复在 [PR #226](https://github.com/1959124923wyz-sys/love-British-TV/pull/226) 独立审核：GeoNames荷兰市镇坐标52.03490,4.32785，和平宫图书馆核1697年9—10月系列和约；同时核对Atlas、GeoJSON、正文来源、真实Chrome跳转。只有GitHub显示merged且合并后成功复检，才可称已部署。
- **最高优先级旧缺口[#46](https://github.com/1959124923wyz-sys/love-British-TV/issues/46)仍在**：1547—1549英军实占地理面不全；所谓“地图影响范围”的虚线不计面积，不能在没有史料时自动变成英军实控疆界。
- 研究归档[#180](https://github.com/1959124923wyz-sys/love-British-TV/issues/180)中的独立原始17C R05大ZIP仍需另核完整真实远端字节；规范示例ZIP与调查员原始资料ZIP**不是同一个附件**。

建议下一轮继续独立审核具体地图目标事件的坐标、来源与年份及新旧位置信息是否同步。待发布的PR与历史空间层均须按CI/原始史料独立验收。
