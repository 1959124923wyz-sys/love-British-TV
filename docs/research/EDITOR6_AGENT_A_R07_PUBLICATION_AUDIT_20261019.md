# 编辑6｜甲组R07格伦科及爱尔兰专题上线预审（2026-10-19）

**结论：NEEDS_REVISION；不修改 published，也不写任何17世纪正式atlas。** 原包：`Editor6-AgentA-1600-1699-R07-FULL (1).zip`；ZIP SHA256 `8ae516d15e29666c8cfc6e48e3cf3338c55f0845b6dbe5621b25cbf82283766a`。

## 实测范围
- 83文件；MANIFEST列出其余82件，逐文件大小、SHA256均正确；外层/嵌套R05/R06 ZIP的CRC均通过。
- 217条来源、199条研究事件候选、67个旧空间候选，**不是已批准事件**。
- `CURRENT/SERIAL_ARTICLES/E6-T04-scotland-glencoe.json`：10节、约2453个正文字符、13个稿内来源条目、2个已存在的**研究候选**事件ID、0条正文事件链接；所有 `source_keys` 可在稿内和甲组来源台账对应。
- `CURRENT/SERIAL_ARTICLES/E6-T03-irish-land-property.json`：6节、约1021个正文字符、8个稿内来源、0条正文事件链接。两稿均 `editorial_status=draft_research_only`，所有 `publication_approval=false`。
- 这些格式通过只能证明候选包完整、JSON可解析，不意味着文章已完成、原件逐条核证、网站已发布。

## 不准上线的五大原因
1. **内容范围不匹配**：E6-T04母专题涵盖苏格兰独立法制、格伦科、达连、1707前后政制，但R07仅完成1690—1695格伦科段落；E6-T03尚缺1652/1653法规全文和逐庄园地产兑现闭环。研究员的 `REVIEW_GATE_R07.md` 已承认这一点。
2. **公众正文混入编辑工作话语**：E6-T04结尾有“现有资料仍需继续写入E6-T04”“本阶段完善的是……不能冒充全专题完稿”；宣誓章节有现代道路推测提醒，军令章节有“本轮没有伪称直接核阅”表述。移至 `reading_note/map_note/HANDOFF/QA`；真正影响解释的文献争议保留为自然叙事。
3. **年份不自洽**：T04 `start_year=1603,end_year=1700`，其 `continuation` 节 `period_end_year=1707`；T03 `start_year=1652,end_year=1691`，却有1641背景和1700结尾。必须区分正式文章实际内容、前史/后续说明、所属历史进程真正终止 `historical_end_year`。
4. **缺正式出版连接**：目前 `data/stories/serial/index.json` 的E6-T03、E6-T04仍 `status=research_only` 且 `article_file=null`。本地 `CURRENT/SERIAL_ARTICLES/*.json` 不会自动成为站点正文。只有主编在文档审核及CI通过后才可设 `published + publication_review=approved`。
5. **不能混淆史料访问等级**：T03 的A-S66/A-S67只读到法案书目（全文403），不能假装核实条款。T04 的NLS Adv.MS.23.6.24只见手稿目录，不可称读到原件；请求救济不是获偿证明，1690没产判决不是地块交割证明。

## 已抽核重要主张
- RPS 1695/5/160原苏格兰文明确 **8 July 1695**，同页现代英文译本错误作1693；原文 https://www.rps.ac.uk/search.php?action=print&filename=williamii_ms&id=58019&type=ms ，英译 https://www.rps.ac.uk/search.php?action=print&filename=williamii_trans&id=54355&type=trans 。甲组辨析正确。
- RPS 1695/5/99 认定格伦科杀戮为 murder，但不是所有军人已经被刑事法院定罪：https://www.rps.ac.uk/search.php?action=print&filename=williamii_trans&id=54240&type=trans 。
- NTS记载约120名士兵、38人被直接杀害及另有严寒中丧生，不得合并为确数：https://www.nts.org.uk/visit/places/glencoe/the-glencoe-massacre 。
- NLS收藏1692年军令Adv.MS.23.6.24，标明访问受限：https://manuscripts.nls.uk/repositories/2/resources/15554 。
- RPS 1690年7月14日没产判决确有格伦科相关被告，不证明地产实际交割：https://www.rps.ac.uk/search.php?action=print&filename=william_and_mary_trans&id=50391&type=trans 。

## 回稿指令
保留全部R07旧原件，先删正文编审术语、核对期间范围、将重要事实拆成逐条claim及真实原文页码。E6-T04须**或**补齐母专题题名承诺的各阶段，**或**申请编辑6批准建立“苏格兰长期母系列＋1690—1695格伦科子专题”（不重复同一正文）。不能未经许可自行改母编号。经审核后提交唯一正式JSON、来源核证矩阵、候选事件对应表、对接母索引的建议变更和完整R08累计ZIP；最后出版授权保留编辑6/主编。
