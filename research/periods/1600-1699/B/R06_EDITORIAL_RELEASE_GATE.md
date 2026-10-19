# 乙01｜PR #182 编辑6上线资格预审（2026-10-19）

**最终预审结论：研究归档可接受；E6-T07尚待专题终审；236条事件和任何殖民实际控制面不可批量上线。** 本预审不能替代编辑6或主编的正式审批。

## P0｜阻止正式发布的问题（先处理）
| 编号 | 发现 | 处理状态 | 需要的最终动作 |
| --- | --- | --- | --- |
| P0-01 1661版本 | UNB的CO 30/2数字转录沿用1661日期，但Brewer/Gemmell文本版本比较指出，现存见证已融入1664/1667修订，不能把每个条款均称1661原订。 | **研究稿已改写**并补文献/年份；未直接逐页读原会议簿 | 编辑6抽检修订归属；若不涉及各修订年份，公众叙事统一采用“1661立法、所读文本为后期修订见证” |
| P0-02 年份冲突 | 仆役法数字页索引1661-09-07、文末署1661-09-27；奴役法见证署09-24，Brewer/Gemmell引CO31/1称会议通过09-27。 | **研究稿年份保守化**，矛盾均登记 | 若要公众写精确日，优先核原档CO 31/1 pp.63–64和法文版本；否则只写1661 |
| P0-03 正式母专题未接入 | PR #182目前只在`research/periods/1600-1699/B/SERIAL_ARTICLES/`放研究JSON；main尚无待审专题的正式审核通过版索引/正文。跨世纪serial接口在编辑6另一分支。 | **没有偷偷改正式发布文件** | 编辑6/主编将经批准文章移入`data/stories/serial/`，对照母索引`E6-T07`，status/approval由主编设定，运行serial及旧章回归 |
| P0-04 年度地图不能批量上架 | R05乙组236候选事件的`latitude`及`longitude` **各0个非空**，研究GeoJSON69个候选对象中5个Point有坐标、64个geometry null；没有核准实控Polygon。 | **研究层保留，不强行补坐标或面** | 地名比对→现代参照精度→逐年GIS审核→稳定ID跨十年继承→正式Atlas审核，禁止用地名或现代岛国全界生成历史殖民面 |
| P0-05 事件史实未全面逐条核证 | 236条均有可解析source ID，但有来源只是起点，不代表原档均读过；目录、摘要、机构二手和原文转录深度差异巨大；`title_en`只有130条非空。 | **不能“236条已审通过”** | 正式事件分批逐条检验主体/日期/地理/后果/来源阅读等级，英文字段等上线质量要求逐项补齐 |

## 已经替主编完成的修正与验证
1. `SOURCE_CLAIM_MATRIX_R06.csv`此前的`E6T07-C01`在CSV指奴役法，长篇原JSON却指美国国会图书馆；**同名主张含义冲突已修复**。新版严格以每个`topic_source_claims`数组生成为唯一事实来源；9条claim、12条claim→source边，所有来源键存在。
2. R06新增两项可靠研究来源：`B6-SLP-BARBADOS-WITNESS`、`B6-BARBADOS-PARLIAMENT-HISTORY`，已有`SOURCE_REGISTER_R06_ADDITIONS.csv`；加上R05的173来源，研究组来源主键累计175项（只统计分组来源条目，不意味着独立175份原档）。
3. `E6-T07`七个小节均有对应证据主张；来源阅读深度区分“大学转录的后期见证”“17/18世纪后印法律汇编”和“机构二手史”。
4. `audit_r06_links.py`在同组目录检查文章schema、ID、来源、claim、CSV一一对应、未批准状态、历史终止年份和1667修订提示；`.github/workflows/editor6-b-r06-source-gate.yml`自动调用（**真正CI状态须以GitHub Actions运行结果为准**）。
5. 禁止将法律中的糖额/英镑罚款与赏金当真实税收、将法律前言的“造反阴谋”当已核实完整起义事实。1661法条不能直接分配到某项未核执行的年份事件。
6. 研究层和地图层隔离：没有更动`main`、正式`data/atlas-`或任何批准UI。保留原研究事件B196/B116，交由编辑6的重复视角映射处理。

## 三档审核建议
- **A 研究资料持久化：可。** PR可留为Draft；后续经主编审阅可以独立合并研究层，但研究层合并不等于任何史实/网站上架。
- **B 母专题长篇独立栏目：尚未。** 1661版本警示已改，仍需要审定最终公众叙事、法条年别和跨分支serial接口；由主编签署后方可改`publication_review:approved`。
- **C 年度地图事件、动态实控疆域：不可。** 未批量核史，事件坐标空缺及空间实控边界无证，不得替代正常年度与空间发布审核。

## 供编辑6最省时的最终签核顺序
1. **先读此表和`R06_PRIMARY_LAW_CLAIM_AUDIT.md`修订补遗**，无需从236条头开始重读。
2. 对`E6-T07`重点抽核：1627史事（巴巴多斯议会官方史）；1661初法/修订文本（Brewer/Gemmell与UNB）；1676 4月19/21两程序；1688 7月10/8月8两程序；1692告发法原文。
3. 审定已改好的研究文章是否达到公众文风，再将一篇文章接入跨世纪serial目录，**暂不挂未审地图事件ID**。
4. 网站实测、serial验收、主编批准后方可发布。其他235+候选事件后续单独按主题批次入图，不强行与一篇专题同时上线。

## 精确来源
- 巴巴多斯议会官方沿革：https://www.barbadosparliament.com/main_page_content/show_content/13
- Brewer/Gemmell 修订见证与CO31/1书目：https://slaverylawpower.org/barbados-huntington/
- UNB奴役法：https://slaveryandfreedomlaws.lib.unb.ca/laws/barbados-1661
- UNB仆役法：https://slaveryandfreedomlaws.lib.unb.ca/laws/barbados-1661-0
- UNB贵格会法：https://slaveryandfreedomlaws.lib.unb.ca/laws/barbados-1676
- UNB1688法：https://slaveryandfreedomlaws.lib.unb.ca/laws/barbados-1688
- UNB1692法：https://slaveryandfreedomlaws.lib.unb.ca/laws/barbados-1692-0
- UNB牙买加1664法：https://slaveryandfreedomlaws.lib.unb.ca/laws/jamaica-1664-0

**累积ZIP事项：先前用户Library内的R06-full存的是此番审查前的独立稿，当前**GitHub研究分支才是本轮法律版本修正与claim矩阵的较新版本；不得混称两个版本字节一致。下一次重新打包必须保留旧原件，并在CURRENT/中同步GitHub已修订稿与新的QA。**

## 已实见GitHub自动检查（同SHA `f0f4704`）
- [Editor6 B R06 source-claim gate](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/39221042922)：**success**。
- [Approved map UI contract](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/39221043019)：**success**。
- [Territory continuity research gate](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/39221042942)：**success**。
以上仅针对PR研究分支静态及规范门禁，**不能被描述为236事件历史审核全部通过或网站已上线**。
