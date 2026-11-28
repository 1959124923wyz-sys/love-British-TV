# T088 / T089 — production audit

- Scope: 1950–1999 Australia and 1957–1999 Pacific; post-1999 rehabilitation is contextual only.
- Register: [T088_T089_EVIDENCE_REGISTER.json](T088_T089_EVIDENCE_REGISTER.json), 25 source entries, 34 events, 10 dated point records; 34 article sections. No operational trial coordinates, equipment specifications or hypothetical fallout boundaries.
- 1985 Royal Commission conclusions and recommendations inspected, including pages 16–20 and 31, paragraphs 87–99, 113–117, 124–129. Land access restrictions and protection failures are findings; individual medical causation remains unresolved. Ooldea mission closure itself not attributed directly to tests.
- FCDO 1993 exchange of notes, printed pages 3–4, inspected: £20m scheduled government-to-government payment, not verified receipts. 1956 and 1968 memoranda are referenced, not independently obtained. MARTAC 2002 text parsed, pp. 47–48; large-file page image retrieval unsuccessful. AUD13.5m community arrangement separated from UK payment; no currency conversion or double count. 76,420 km² legal land return, not fallout area.
- Pacific: ANU Press historical study chapters 15–17 and 22 inspected; colonial archive records referenced by the author, not original files. CO1036/281, /283, /284, /514 are retrieval leads. 1984 UK parliamentary response treated as government's claim. 1999 Fiji law cited via study, original act and payment records pending. 1962 US-led phase separate from British-led phase.
- Geography: modern named island/settlement references only. Missing historical land deeds, restriction maps, legal survey plans and individual exposure data preclude boundary or loss estimation. Oak Valley is a modern community reference, not a claim that its current built settlement existed throughout 1984. No region fills, exposure polygons or area aggregation. Unlocated records intentionally null.
- Candidate content gated by explicit review20c=1; ordinary entry excludes candidate events, features, and article links. Shared gate follows parallel PR #637 to minimize integration differences. Workboard retains production_review / geometry_review / not_published until independent review and checks.
- Tests: dedicated Node integrity and gate tests, desktop Selenium navigation/visibility test, common serial, GIS and public-copy checks configured. No full local browser execution claimed; CI and independent review required.

## 读者文案复审
原始编辑说明迁入独立审计，正文只保留历史叙述。原说明：
- e20-t088-2：群岛地名只用于定位历史地区，不能用一个点推断辐射覆盖，更不能将西澳海岸的行政范围当作实际污染范围。
- e20-t088-4：这一认定属于对防护制度的官方调查结论。它支持将原住民保护不足列入历史记录，但不宜据此为每一个居民赋予未经测量的暴露量。
- e20-t088-5：Yami Lester的失明因果关系未获委员会确定。他推动社会重视原住民经历的作用与具体医学因果判断应分别陈述。后续调查需要原始证言和医学材料。
- e20-t088-6：原始地图和行政命令对于确定历年限制区具有重要价值。目前掌握的是档案目录与机构历史，不足以据此重建逐年封锁边界。
- e20-t088-7：但现有换文仅援引既有文件，不能代替备忘录全文。因此本专题不从这条引用推断未见原件的赔偿责任或场地界址。
- e20-t088-8：Ooldea地区在地图中使用现代具名地理参考，目的在于联系这一地区的土地历史。原始禁区和传统土地界线尚未核定，地图不填充任何推测区域。
- e20-t088-9：这一案例说明行政限制与实际保护并不等同。对于相关家庭具体经历、健康后果和行政处置，需要继续核查委员会证言及地方档案。
- e20-t088-10：因此本专题时间范围延伸至1990年代的协议与修复阶段。地图仅呈现有证据支持的历史节点，不把所有后续年份都标为试验进行期。
- e20-t088-11：应将清理行为、政府验收及残留污染调查区分开。清理发生不等于某一块土地已适于恢复传统使用。
- e20-t088-12：由于尚未取得1968年原件，现阶段只记录援引的日期及法律关系的变化，不对其未见条款作扩大解释。
- e20-t088-14：该面积属于土地权利安排，不是测量得出的污染面积。Oak Valley聚落作为社区延续的地理参考，不能代替立法附图或历史地籍界线。
- e20-t088-15：建议属于调查机关提出的措施，其法律实施和实际支付需要另行核查。后来的土地归还、修复和赔偿协议应作为独立事件记录。
- e20-t088-16：这一阶段的交涉对象包括英国政府、澳大利亚政府及传统所有者。不能将政府间清理费用自动理解为直接支付给受影响居民的款项。
- e20-t088-17：这里记录的是条约规定的付款义务与日程，并非已经核验的实际到账。协议另含责任与补偿安排，不能把政府间清理款重复计算为居民个人赔偿。
- e20-t088-18：这笔款项与英国承诺的2000万英镑具有不同付款方、币种、对象和性质。资料未提供可逐户核对的支付明细，故不作人均赔偿估算。
- e20-t088-19：2009年只作为20世纪事件的后续背景，不加入本世纪时间轴。最终边界、修复分区和限制范围应依据原始官方图件核定。
- e20-t089-1：迁居涉及当地家庭的生活、工作及社区联系。档案中的实际迁移记录与后续行政部门讨论的计划应当区分，不能把所有拟议撤离者都计为已迁离人口。
- e20-t089-2：人口表不是个人剂量记录，也不是受到健康损害的人数。缺少逐人证据时，应避免从人口数字计算未经证实的健康损失。
- e20-t089-3：这里关心的是殖民地治理中的土地、居民和劳动保障问题，地图使用岛屿参考地名，不标示具体试验操作位置或推测辐射区域。
- e20-t089-4：这表明人员服务并非仅由岛上地方管理部门决定，而涉及英国与殖民政府之间的行政协调。具体命令原件仍需要依据档号调阅。
- e20-t089-5：应将斐济派遣人员、本地合同工及其他居民分开，分别追踪雇佣条件、服务责任及保障制度。不同身份的人不能用一个未经核对的总数替代。
- e20-t089-6：但会议意见并不必然等于实际执行。需要比较后续命令、迁居记录及居民证言，以厘清政策制定与实施之间的差异。
- e20-t089-7：这是一项有条件的制度安排，不是对每名人员未来所有疾病的无条件赔付承诺。原始电报、备忘录及具体执行决定仍需调卷。
- e20-t089-8：证言具有记录生活经验的重要价值，但个人疾病是否由特定活动造成需要专门证据。官方说明和居民经历应并列，而非由一方自动覆盖另一方。
- e20-t089-9：将这些通信与1990年代退役人员的诉求比较，可以追踪承诺、制度解释及申请结果之间的差距，而不能直接将所有未赔付个案计为违约。
- e20-t089-10：专题对各阶段分别归属责任，不将美国实施的活动全部计为英国实施。英国参与人员的保障责任仍可作为单独的调查方向。
- e20-t089-11：其人口表述不能与1957年岛上人口记录直接相加。答复也不是独立临床调查的替代品，健康影响需继续查阅个体资料和其他研究。
- e20-t089-12：这一往来呈现退役人员获取保障时遇到的制度问题。信件细节现依据学术著作所引档案，完整原件尚未取得。
- e20-t089-13：这批材料为理解殖民人员在英国计划中的处境提供了当事人视角。访谈内容不应被换算为未经医学或行政记录证实的伤亡统计。
- e20-t089-14：当事人记忆、档案记录与政府立场之间的差异值得继续核查。专题采用明确归属的叙述方式，避免将研究者的历史判断写成同期政府原文。
- e20-t089-15：这项制度变化应与英国既往保障承诺分别登记。原法条、适用资格及实际支付明细仍待核验，目前不推算受益人数和金额。

## 2026-11-28 出版前正文强化（待独审）
- 两篇可读正文 2447→3373、1740→3472 字符；新增25段、5个来源键（原25→30），保留34个事件链接与10个现代具名参考点。复读NMA、ARPANSA传统所有者访谈、ABS 1997年鉴、南澳政府Lester人物史、澳档案馆1984保存令、ANU Press ch15–17/18/21/22 与1984、1985英国议会原文；新增来源仅支撑长文，不改原事件来源或几何。ANU章节18与21保留受访者意见归属，不作个体医学判定。1999斐济法律仍以学术研究转引，尚未取得当年原法条；1985披露授权仅限特定信息。无新增伤亡、污染范围、军事试验操作细节或未经核实的地图。
- T088/T089新增去除互动标记后3000可读字符门槛，保留生产隔离与原专项门禁，待独审及CI；未提交正式出版。
