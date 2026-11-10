# 主编17 第十一批｜1762—1764年英军攻占马尼拉、洗劫居民和勒索赎金

**2026-11-10｜T22｜独立分支 `map/18c-manila-sack-ransom-1762-1764-20261110`，基于第十批 PR #299头部｜`?review18c=1`｜Draft、正式main不发布研究事件。**

## 本次重点：英国殖民暴力、财产掠夺与当地抵抗

延续前十批及16世纪专题标准；根据用户最新要求，优先叙述英国海陆军、东印度公司对民居、教堂、贵重货物的抢劫、暴力迫降、400万银元勒索、制度化分赃与英国央行追款，并说明菲律宾与西班牙在地人员抵抗。英法／英西争霸是这些具体事实的背景；不凑不存在的屠杀人数和掠获总额。

## 原始归并、证据保全

主编15的 `research/18c/consolidated/series/T22.json` **1个合并组，4条独立原始候审 ID**，保留`COMPLETE_1126_ARCHIVE_CROSSWALK.csv`和集中原ZIP，与前代同体制逐一映射：

| 原ID | 年份 | 新Atlas事件 |
| --- | --- | --- |
| `AB-E01-002` | 1762 | `E18C-MNL-1762-MANILA-STORM-RANSOM`，10月6日攻入与400万银元索求 |
| `AB-E01-003` | 1762 | `E18C-MNL-1762-ANDA-LUZON-RESISTANCE`，城外Anda和菲律宾地方力量抵抗 |
| `AB-E01-005` | 1763 | `E18C-MNL-1763-BANK-MANILA-RANSOM`，M5/110英国央行票据追索 |
| `AB-E01-004` | 1764 | `E18C-MNL-1764-BRITISH-WITHDRAWAL`，英国驻军撤离 |

原助手B真实 source key **BS26,BS27,BS29,BS76**，通过`scripts/audit_18c_manila_source_registry.py`直接读原集中ZIP的`SOURCES_B.json`检验。另12个增补事件**不冒充原315入选研究记录**，设`research_merge_group_id:null`和空原ID；11项权威史料增补对应BL、BOE、西班牙国家档案、Cambridge学术、美国国会图书馆、UNESCO菲律宾提交坐标和菲律宾NHCP遗迹等，合计15个来源条目。

## 交付

| 文件 | 实质内容 |
| --- | --- |
| `data/stories/serial/chronology-preview-manila-1700-1799.json` | **16个具年事件，15登记史料、5个UNESCO现代Intramuros城市参考事件点；11条无精确GPS，0历史控制Polygon、0假行军/舰船路线** |
| `data/stories/serial/e18-t22-manila-invasion-sack-ransom-1762-1764.json` | **18章54段完整历史叙事、16个一对一真实`[[E18C-MNL-...|历史事件]]`地图互动链接** |
| `research/continuity/1762-1764-manila/BRITISH_SACK_RANSOM_CONTROL_RESEARCH.json` | 10条英军占城、抢掠、Anda抵抗、港口要求、财政追索和实际撤离研究过渡；政治主体及地理边界分开 |
| `AGENTS.md` | 记录用户今后英国殖民烧杀掳掠优先、严格实证、不准恢复动态章节浮条 |
| `js/history-stories.js`、`css/history-stories.css`、`index.html` | 同步正式main PR #300删去所有浮动目录、阅读进度与重复TOC；十篇旧专题与十六世纪已发表阅读兼容 |
| `scripts/test_18c_manila_sack_map.js`、`scripts/audit_18c_manila_source_registry.py` | 原ID来源+15个源注册+16事件+54段/16互动+5有据点+无假边界+无浮动导航强制测试 |
| `scripts/browser_18c_manila_sack.py`与`.github/workflows/18c-manila-sack-map.yml` | 真实1780x1020 Chromium：1762抢劫/原文→1764撤离/1763BOE汇票→返回；十篇旧专题和主站16世纪回归；所有动态目录实际不可见；第三方网页HTML、CSS、JS、原数据HTTP核验并存截图 |

## 关键史料与可核争议

1. **1762英军夺城**：英国参战主将William Draper发表的`A Plain Narrative`记录8月Madras出发，9月入马尼拉湾与10月6日破城。英国指挥官有辩护立场；需与西班牙PARES和Cambridge近年研究交叉阅读。
2. **城市洗劫为事实**：西班牙文化部PARES文书介绍明确记载英军即使要求支付赎金，仍洗劫城内财物。Cambridge发表的《Securing Trade》记述英军攻破马尼拉后出现抢掠。**所谓洗劫持续40小时及有无指挥官默许是英西双方证言争议，不把具争议的持续时数冒充独立核准统计**。
3. **400万西班牙银元是英国要求金额，非现金实收数**：西班牙文化部说明，为满足赎金安排，马尼拉大主教曾开具约200万比索向马德里国库支付的汇票；BOE档案M5/110日期1763-02-18至1771-04-12，记载持续催收，不能据此写四百万全部到账。
4. **英军对抢掠财务利益内斗**：British Library `IOR/H/77` pp7—45载马德拉斯委员会与英海陆军指挥官对战利品分配书信，pp145—147另载军官分赃争议；pp79—96载私人财产权相关请求，pp243—265载1763年3月占领现金账。只在逐页估价核实后计算殖民净收益。
5. **实际宗教遗址损害**：菲律宾国家历史委员会对San Agustin教堂的官方纪念牌记载英国1762占城期间教堂与墓地遭亵渎；Malate教堂标识记载英军在此登岸且用作后卫防护。
6. **Cavite军事设施与Anda抵抗**：原英方1762降约要求交出Cavite港口和炮台；同年Anda在Pampanga及吕宋其他地区组织军事政治抵抗。英军城市控制不能等同全菲律宾主权。
7. **1763 vs 1764**：巴黎和约的法理安排在1763，实际英军直到1764年4月才从马尼拉撤退；BL IOR/H/77 pp313—315的1764-10-07报告晚于撤军，不是撤退日。
8. **位置**：菲律宾2024年UNESCO提名Intramuros城墙遗址给出**N14°35′29″ E120°58′25″**（现代参考中心`14.591389,120.973611`）。5个有GPS年份事件都使用同一城市宽域参考；其余11个留空。现代遗产区0.67平方公里**不能用作英国1762实控历史面积**。
9. **国籍及殖民政治**：菲律宾1780年前已被西班牙殖民数世纪。本次英国短期攻城抢劫的受害者既有城中居民与宗教机构，也有其他社会群体；反英的Spanish/Filipino联合力量中的地方参与者并非都出自相同政治动机，不将整个菲律宾等同西班牙殖民政府。

### 权威可点击源

- [British Library IOR/H/77—投降、分赃、私人财产、现金账及1764撤军报告](https://searcharchives.bl.uk/catalog/040-000004114)
- [British Library IOR/H/76—Dawsonne Drake占领日记](https://searcharchives.bl.uk/catalog/040-000004113)
- [Bank of England M5/110—Manila Ransom 1763—1771](https://www.bankofengland.co.uk/CalmView/Record.aspx?id=M5%2F110&src=CalmView.Catalog)
- [西班牙文化部PARES—马尼拉夺城赎金与劫掠档案](https://www.cultura.gob.es/cultura/archivos/difusion/historial-destacados/destacados-anteriores-2006-2016/2012-12-22-toma-manila-1762.html)
- [Cambridge 2019—Securing Trade: British Occupation of Manila](https://www.cambridge.org/core/journals/international-review-of-social-history/article/securing-trade-the-military-labor-of-the-british-occupation-of-manila-17621764/6DD8E645C2627FFD682DAA81FB59E35B)
- [Library of Congress—The Attack of Manilla, October 1762](https://www.loc.gov/item/75692515/)
- [UNESCO菲律宾提交Intramuros具名地址与经纬度](https://whc.unesco.org/en/tentativelists/6715/)
- [菲律宾NHCP：San Agustin教堂墓地1762遭亵渎](https://philhistoricsites.nhcp.gov.ph/registry_database/church-of-san-agustin-2/)
- [菲律宾NHCP：Malate教堂英军登岸](https://philhistoricsites.nhcp.gov.ph/registry_database/church-of-malate/)

## 网页与出版

研究预览（需待本次最新HEAD Actions HTTP+真实浏览器验收）：

`https://raw.githack.com/1959124923wyz-sys/love-British-TV/map/18c-manila-sack-ransom-1762-1764-20261110/index.html?review18c=1&year=1762`

正式已发表主站：<https://1959124923wyz-sys.github.io/love-British-TV/>。PR #300已把动态章节目录清理合并main；第十一批单独Draft，只在研究预览展示，绝不将未经验证T22英国殖民历史控制范围假装正式发布。

未来优先继续调查**可核受害者个人财产诉状、当年的实际洗劫数额、军官分配账、银行汇票是否兑付、1762旧图与实际哨点**，准确再现英国殖民暴力和抵抗。
