# 后续丙组调查员统一制作说明（R08修订版）

本说明在[编辑6统一作者手册](https://github.com/1959124923wyz-sys/love-British-TV/blob/research/editor6-17c-serial-topics-20261019/docs/research/EDITOR6_SERIAL_STORY_AUTHORING_HANDBOOK_20261019.md)基础上，针对非洲、亚洲、航运、奴役运输和财政数字执行。

## 第一步：从最新累计包接棒
只下载一份最新 `Editor6-AgentC-1600-1699-RNN-FULL.zip`，先验证外ZIP CRC、MANIFEST逐文件大小/SHA256、内部上一轮R(N-1)原ZIP SHA256。旧轮只读保留在`ALL_ROUNDS/`，每轮`CURRENT/`放全部最新材料，不要只放新增文件。本轮基线为R08，下一轮R09不得跳回R05/R06。

## 第二步：先划定可完整叙述的“历史故事”，再约定母ID
- ARC-EIC/E6-T12：1600贸易特许、许可商站、萨非—葡萄牙战争、莫卧儿帝国、马德拉斯、孟买及1698组织重组，不能以“东印度公司史”题名只写一艘船的日志。
- ARC-RAC/E6-T13：1618—1698公司与贸易垄断阶段，必须有具体非洲政体及堡垒控制时段。
- ARC-NAV/E6-T14：法令、战争、海盗、获授私掠分责，非实测航线只许注明示意。
- ARC-ATL-TRADE/E6-T11：SlaveVoyages唯一航次ID、出发/抵达/死亡/估算/计划分开，无可审计版本不做“贩运总人数”。
- ARC-FISCAL/E6-T15：政府公债、已征税、公司利润、王室租金、股份认购、奴役贸易利润分账户。
如果资料只支持某一阶段，则继续调查母篇；或申请编辑6批准设独立子篇ID，不得未经批准把母篇名字改小但沿旧ID宣称整篇完成。

## 第三步：先建主张—证据链，再写公众正文
对每节建立 `CLAIM_MATRIX_RNN.csv`：claim_id、article_id、section_id、具体事实、发生日及精度、行为人/地方主体、法律授权或执行/财政流向、source_key及具体卷页、证据访问等级、已核/争议/待核、可发表结论及阻塞项。原始法律原文、影印页、官方机关概述、学术论文、档案目录不得等价；仅见目录的金额应写为该编目记载，不得假装已核阅原始账本。

## 第四步：写成真正可以朗读的完整故事
正文使用自然汉语连贯讲述“当地环境—人物—行动与对抗—实际后果—长期转型”。写史实影响的重大争议；**不能写**“本轮、待上线、接下来查、地图不应画、GIS、GPS、我们的来源键、没有读到原文”。这些统一放到 `CURRENT/EDITORIAL/` 或 `QUESTIONS_AND_CONFLICTS.md`。人物首次出现写中文名及必要原文，制度讲清政体身份（1603共主不等于1707以后大不列颠）。

## 第五步：验证时间与身份
JSON `start_year/end_year` 等于**正文真实记录的时间跨度**，每节不得超出；`historical_end_year` 是真实长期进程结束日期，有据才写，研究窗口单独保存。东印度公司1858年结束治理与1874年法定解散不是同一种结束；银行及财政制度1699以后继续。栏目标题不要暗示1700以后已发生的故事被1600—1699文章完整讲完。

## 第六步：用标准JSON与索引对接，但不自行发表
研究层：`CURRENT/SERIAL_ARTICLES/E6-Txx-<ascii-slug>.json`，`schema:atlas-major-story-v1`，`id=parent_serial_topic_id`，每节非空段落、所有source_keys在稿内sources、所有sources在SOURCE_REGISTER、claim矩阵有可核身份。必须为`draft_research_only`；仅在编辑6宣布本篇研究已过审时可标`ready_for_editorial_review`。正式发表需另移至`data/stories/serial/<ascii-slug>.json`并在`data/stories/serial/index.json`设置文章路径。**published+publication_review:approved只有主编可批准**。

## 第七步：GIS与跨十年连续性单独审核
每个候选事件绑定原始年与具名地；真实地点允许现代参考点并说明精度；海上路线仅证实先后才能淡色虚线，不是GPS；地理历史边界不确定要用有据虚线且禁面积；东印度公司商站/堡垒/租赁地、莫卧儿/萨非等当地政体不得被涂成现代英国殖民省份。点线面与特许只进入候选层，必须经过年度atlas和空间CI审核才上线。保持`stable_id`及真实退出证据，不能到十年末清空。

## 第八步：机器+人工双重QA，然后唯一累计ZIP交付
强制验证JSON解析、唯一section/claim/source ID、空段落、时间范围、错别字与编辑术语、来源键可追溯、CSV与数值口径、案件跨世纪关系。每篇给“完整性/史料/数字/GIS/接口”五项结论；缺任何一项不能称作已批准长篇。压缩包结构必须有`ALL_ROUNDS/`、`CURRENT/`、`MANIFEST.json`、`PROGRESS.md`、`HANDOFF.md`、`CHANGELOG.md`、`QA_REPORT.md`、`QUESTIONS_AND_CONFLICTS.md`；CRC/SHA256测试后保存至GitHub独立研究分支（文本）及Library（完整ZIP），保留提交SHA，不碰main，最终由编辑6/主编审核。