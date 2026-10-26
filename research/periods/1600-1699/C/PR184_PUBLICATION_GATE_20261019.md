# PR #184｜丙01 R06 上线资格独立复核（2026-10-19）

> **审查结论**：**RESEARCH_ARCHIVE_CONDITIONALLY_ACCEPTABLE / PUBLICATION_BLOCKED**。本PR 13个文件均位于 `research/periods/1600-1699/C/`，GitHub技术合并兼容；不能据此声称已发表跨世纪专题或正式地图。禁止编辑6/主编误按绿灯Actions当史实出版批准。

## 1. GitHub 与长期专题接口

| 检查项 | 结果 | 理由/最小后续操作 |
|---|---|---|
| PR #184 draft | PASS / research only | Head `research/1600-1699-c-r06-agent01-20261019`, base `main`;所有文件是研究材料，不影响运行地图。 |
| GitHub Actions | PASS 2 jobs | Approved map UI contract、Territory continuity research gate；**两者没有验证C17-R06逐条史学主张或公众文章发布**。 |
| R06 ZIP与旧档案 | PASS (本地重算) | 本轮完整ZIP 171项，170行MANIFEST SHA256逐项吻合、CRC通过；内嵌R05源ZIP 211成员，CRC通过；全量ZIP现存Library `/爱英TV/Editor6-AgentC-1600-1699-R06-FULL.zip`，不在GitHub。 |
| 正式长期专题接口 | BLOCK | `main`没有 `data/stories/serial/index.json`、`scripts/test_serial_story_contract.js`；相关接口在 `research/editor6-17c-serial-topics-20261019` 的研究分支，必须先由其自己的PR完成主编验收，不能让本PR暗中替代。 |
| 公众长篇文章位置 | BLOCK | 本PR只有 `research/.../SERIAL_ARTICLES_R06/`，**不是**正式 `data/stories/serial/<slug>.json`。两篇 `draft_research_only`、所有 `topic_source_claims[].publication_approval=false`，`related_event_ids=[]`。 |
| 年度地图事件与空间 | BLOCK | 无新 `data/atlas-1600-1609.json` 等出版年度文件，没有核准的坐标、多边形或十年连续控制继承记录；不得以船舶停靠自动成占领。 |

## 2. 一手证据目录核验结果（避免主编再逐条找链接）

以下指向 **英国图书馆真实馆藏目录和英格兰银行官方页**；除已明说的数字化馆藏可访问，不代表本组读过原始卷页。

| 来源键 | 可确认的最小事实 | 仍不能声称 |
|---|---|---|
| C144 [BL Mss Eur G2](https://searcharchives.bl.uk/catalog/032-002297482) | 1657-11-06 EIC向克伦威尔请求护航、其上有建议 | 已派军舰、实际护航成功、财政开销 |
| C145 [BL Mss Eur C390](https://searcharchives.bl.uk/catalog/032-002266011) | 1665-10-10查理二世让东印度公司商讨荷兰战利品处置 | 战利品拍卖额、净利润、分赃结算 |
| C146 [BL Mss Eur G136](https://searcharchives.bl.uk/catalog/032-002297956) | 1669-03-27孟买£10年租**第一次付款**有收据 | 每一年全部支付、全孟买地图行政边界、殖民政府全部税款 |
| C147 [BL Mss Eur D1211](https://searcharchives.bl.uk/catalog/032-002276952) | 公司在苏拉特收到两位印度商人的贷款Rs45,000和Rs25,000；按需偿还 | 偿还已发生、利率、利润或历史卢比到GBP的兑价 |
| C148 [BL IOR/L/MAR/A/LXXXII](https://searcharchives.bl.uk/catalog/040-001104418) | Berkeley Castle船日志官方目录明确14港到达日期，第47叶来自其他未知船日志 | 实测船舶轨迹、载运奴役人数、14港均属英王辖地 |
| C149 [BL Mss Eur D774](https://searcharchives.bl.uk/catalog/032-002274313) | 1690-04-15公司股东清单印本 | 任何股东占比或资金总额 |
| C150 [BL Mss Eur D300](https://searcharchives.bl.uk/catalog/032-002272094) | 1690提议组建新公司之手稿 | 当年新公司已成立 |
| C151 [BoE founding archives](https://www.bankofengland.co.uk/museum/online-collections/archive-gallery/founding-documents) | 1694年创立特许及早期名册存档 | 名册卷页已全文核对 |
| C152 [BoE official FOI](https://www.bankofengland.co.uk/freedom-of-information/2020/details-of-the-bank-of-england-loan-to-the-government-in-1694) | 1694贷款£1.2m，首次利率8%；可由[BoE另一官方说明](https://www.bankofengland.co.uk/freedom-of-information/2015/28-august-2015-2)复核税款质押机制 | 借款是殖民净利润或银行股本=政府税收 |
| C153 [BoE History](https://www.bankofengland.co.uk/about/history?level=1) | 银行1694-07-27创设、1694-08-01营业、资助对法战争 | 借款来源可直接认定殖民掠夺分账 |

补充强证据：[BL IOR/A/1原系列行政说明](https://searcharchives.bl.uk/catalog/036-000178601)已公开具体特许、1661、1668公司治理权限、1698新公司筹资与后续1702/1709阶段信息；可供补写E6-T12大段缺失历史，但不能用该总目录冒充特许原本已逐页研读。

## 3. 七项事件逐项上线门槛

| 编号 | 证据闸口 | 地理/表现闸口 | 决定 |
|---|---|---|---|
| C17-E119 | 1657请愿目录明确 | `places=伦敦`并非G2目录直接记载签署地点；如发布，先复核文书地点或以机构所在地参考且加精度说明 | 研究可存，地图待审 |
| C17-E120 | 1665国王函目录明确 | `places=伦敦`未由C390原文确认，不得直接落“信在伦敦发出”图钉 | 研究可存，地图待审 |
| C17-E121 | 孟买租金首笔有收据 | 孟买是租金标的而非收据实际出具位置；只能采用明确财政关系图解，不能画英控现代孟买面积 | 研究可存，地图待审 |
| C17-E122 | 苏拉特公司借款目录明确 | 史料具名苏拉特，可考虑城市级参考点；历史卢比不换算今值 | 优先转有限事实卡片，待主编批准 |
| C17-E123 | 14港次日期精确 | 有据先后顺序可以**申请虚线示意路线**，但每港现代参考坐标须单独验证；无测量航迹/英控面 | 有空间叙事潜力，仍需审核 |
| C17-E124 | 1690股东清单存在 | `places=伦敦`为总部推定，不能代替清单发行地点 | 研究可存，地图待审 |
| C17-E125 | 1690提议书存在 | 提议发生地/正式机构效力未知；仅制度讨论标注 | 研究可存，地图待审 |

## 4. 两篇长篇出版前无法跳过的修订

- **E6-T12** 当前只有6节/12段；前五轮既有ARC-EIC专门史料尚未完整合成。至少补1600–1657商贸据点、东印度当地政治及反抗、1661/1668特许范围、1686–1690对莫卧儿战争结果、1698公司竞争体系；不能让零散新档案取代整部17世纪的主叙事。
- **E6-T15** 当前只有6节/12段；尚缺R05关于航海法执法、RAC账目、战争收支以及1694年税款担保的充分通史关联，不宜号称完成17世纪财政制度长篇。
- **母专题终止年不一致**：编辑6索引中的E6-T12 `historical_end_year=1874`，本PR稿件 `historical_end_year=null`。1873年法案 [East India Stock Dividend Redemption Act 1873](https://www.legislation.gov.uk/ukpga/Vict/36-37/17/pdfs/ukpga_18730017_en.pdf)对1874年股份权益处理作明确规定。移植正式索引前必须统一“研究窗口1699”“1858统治权移交”“1874法定公司结束”三层时间含义，不可按1699宣称公司终止。
- **所有`topic_source_claims`原始卷页仍为null**；无法由“来源键能找到网页”代替全篇内容已出版审核。

## 5. 最大限度减轻主编工作量的推荐操作

**现在**：保留Draft PR #184，可由编辑6作为纯研究档案先做“无正式地图修改”的轻量合并复核——只确认没有覆盖已上线文件、数据有出处、不泄露误导性地点与统计；**不应改为正式发表成功**。

**随后**：丙组继续完成扩充和文献核证（尤其原卷与R05整合），并用**另一个专门的专题发布PR**提交 `data/stories/serial/E6-Txx-slug.json` 与 `data/stories/serial/index.json` 改动，以便测试与逐篇批准。地图另走年度Atlas及空间审查PR。禁止把研究、长文出版和GIS上线强制绑成一次合并。

**主编最小不可委托决策**：确定是否批准公开史实表述、确定专题正式发布状态、批准疆域表现和最后生产验收。作者负责提交逐条证据—叙事—制图候选映射，主编无需重复人工找源或重编数据。

审查者：丙01自检；不能作为独立第三方历史学审稿，更不能替代编辑6/主编最终批准。
