# 主编研究交接｜17世纪超长专题跨入18世纪（2026-11-06）
**状态：仅研究候审。原17世纪正式文章/地图未改。**

## 结论及保护约束
从现有 `data/stories/serial/index.json` 检查到**36条17世纪专题登记**：**29条published+approved、7条research_only**。本次为每一条建立稳定原ID、实际出版研究年段、18世纪后续研究ID、独立来源、承接类型、后世纪地图不得自动继承的标记。完全可审的结构化记录在 [CROSS_CENTURY_STORY_CONTINUITY.json](../../research/18c/CROSS_CENTURY_STORY_CONTINUITY.json)。

原16—17世纪已批准 `data/atlas-*.json`、`data/stories/serial/index.json`、网页均不修改。**长篇应沿同一主题系列发展**，后世纪可以追加章节或经审核的续篇，但不同作战/新法律必须独立事件年、独立出处、独立历史主体和地图时效。世纪之交不是政治状态自动取消/生效日期。

### 类型统计（覆盖全部36条）
| 分类 | 数量 | 具体处理 |
| --- | ---: | --- |
| 直接跨越1700年的同一事件 | 2 | 苏格兰达连第二次远征；纽芬兰1699年法案部分条款于1700生效 |
| 殖民管理/奴役法律/商业网络在18世纪持续 | 18 | 港口、公司、地权、奴役制度按年份重查；不能自动将1699面层复制到1700 |
| 前阶段行动已结束、后世有不同性质后果 | 7 | 16—17世纪战争/征服时间不外推，建立遗产/制度及其他历史阶段的关联 |
| 仍未审完的长题母项目 | 7 | 其原research_only状态保留；后续发表不自动激活原母题 |
| 原殖民行动已经结束、无直接相同英国占领续篇 | 2 | 苏里南、普罗维登斯岛殖民，禁止延展英国国土 |
| **合计** | **36** | 无未登记旧专题 |

**研究性列表：105项18世纪题目、88条来源登记**，其中11项补入此轮，48项18世纪主题携带17世纪稳定专题ID。

## 最紧急的世纪断点与有据后续

### 一、1695—1700：苏格兰达连公司殖民
既有17世纪专题 `E6-T04-DARIEN` 已叙至1699年11月第二批移民到达；**不能在此处结尾**。苏格兰国家博物馆记载，1700年1月苏格兰殖民队伍攻击西班牙Toubacanti堡，其后西军持续围困Fort St Andrew，苏方最终投降撤离。第二批1699年到达、1700年撤离是**同一殖民计划相邻阶段**；苏格兰当时仍有独立议会及殖民公司，不能以“1700大不列颠国军”追述。当地Guna领袖自身的政治及土地权利不因苏格兰公司商业文书消失。来源[S72：National Museums Scotland](https://www.nms.ac.uk/discover-catalogue/the-darien-scheme)；[S88：苏格兰与奴役体系](https://www.nms.ac.uk/discover-catalogue/scotland-and-the-transatlantic-slave-system)。`E18-F09` 承接，该事件于1700年结束，并非一直存在到1707年；后续是公司债权与英苏政治合并的不同阶段。

**地图门槛**：1699苏格兰小据点的参考区域不能经过一次英方切片自动改成1700英国领土。1700应查西军攻守、投降的具体时段和Guna领地权利后按年末绘制；既无已审1700年精准古堡界线，也未补审的场景不做实控Polygon。

### 二、1699→1700：纽芬兰法案的生效
原题 `E6-T10-NEWFOUNDLAND` 中1699 King William's Act（10&11 Will. III c.25），[S79纽芬兰大学历史遗产项目逐条原法转录](https://www.heritage.nl.ca/lawfoundation/articles/doc2_1699william.html)显示多处条款以**1700年3月25日**为执行起点。**1699法律制定、1700局部条款起效**不能当两次无关征服。此后1729官方司法行政制度见[S80省法院历史](https://www.court.nl.ca/provincial/about/court-profile/historical-overview/)。`E18-C26` 续研究，但法规及渔业空间不等同整岛土著Beothuk政治权利被剥夺的已测疆界。

### 三、1668—1774：哈德孙湾公司与原住民贸易
原题`E6-T10-HBC`的商业特许与英法堡垒交换延续到1713英法和约、1715 Dene—Cree外交和1774内陆Cumberland House贸易据点。来源[S81马尼托巴历史学会年代资料](https://www.mhs.mb.ca/docs/features/timeline.shtml)、[S85站点史研究](https://www.mhs.mb.ca/docs/transactions/3/princeofwalesfort.shtml)。`E18-C27`需逐堡确认实际驻军、贸易点和当地族群自主；**1670鲁珀特地特许的流域虚线不是任何年份公司军事占领的实心境界**。

### 四、1661—1718：卡罗来纳、亚马西与掳奴贸易
`E6-T09-CAR`已有1660年代特许、Westo等原住民俘虏贸易和地方地权。南卡罗来纳百科[S73](https://www.scencyclopedia.org/sce/entries/yamassee-war/)证实1715年战争爆发，与当地商人的债务制度、奴役者贩卖与定居者入侵有关，并有Yamasee、Creek、Cherokee等多个不同政治主体参与。记录 `E18-C21`，同时区别战争各方的暴力与责任；不可将1715反抗者村寨全部当英国新征服地方。

### 五、1607—1748：弗吉尼亚奴役法规
原题`E6-T05`包含17世纪战事和先于1700形成的世袭奴役法律。数字人文史料[S74](https://www2.vcdh.virginia.edu/gos/laws1700-1750.html)可追查1705与1748法律编订，是制度续篇而不是17世纪波瓦坦战争持续了150年。新专题 `E18-C22`；法律文本的各条权利、惩罚、身份效力须拆分而不得概括成一个失真的“殖民法”。

### 六、1609—1741：纽约奴役与审判
`E6-T09-NY`17世纪英荷换旗有各自具体终止年。现代纽约市人权委员会的历史研究[S83](https://home4.nyc.gov/assets/cchr/downloads/pdf/publications/AntiBlackRacism_Report.pdf)确证1712年被奴役黑人反抗及镇压，属于 `E18-C23`。1741年殖民法庭的大量所谓阴谋案审判，纽约州法院历史学会[S75](https://history.nycourts.gov/case/slave-conspiracy-trials/)指出重要证词疑点，须以“被指控”“法院认定”记录，不能把未经证明的阴谋定性为确有此事，属 `E18-C24`。

### 七、1681—1758：宾夕法尼亚莱纳佩产权
`E6-T09-PENNSYLVANIA`的17世纪土地契据衔接1737“Walking Purchase”，调查对象是**Penn家族殖民官员对Lenape的地契欺诈**与当地原住民随后的抗议，而不是一块不存在精确国界的“新英属大陆”。[S76哈弗福德学院馆藏](https://findingaids.library.upenn.edu/records/HAVERFORD_HC.MC.950.175)收录1735—1738步行与支付账册；[S86宾大莱纳佩历史资料](https://dia.upenn.edu/en/content/LeechM001/)及[S87部族资料](https://delawaretribe.org/cultural-education/culture-and-language/lenape-history/)为另一视角。各机构面积数字互异，不能选最大数上图，只有另证地籍轮廓才能绘制边界。

### 八、1685—1723：东印度公司本古伦据点
`E6-T12` 17世纪本古伦Fort York以后的公司据点继续成为18世纪地方冲突地。剑桥大学Journal of British Studies论文[S78](https://www.cambridge.org/core/journals/journal-of-british-studies/article/making-and-unmaking-of-a-presidency-envisioning-empire-in-british-bencoolen-16851825/4C0CA8C6BF1E88181DA0CEACBC33C47A)记1704刺激定居贸易政策、1714修Fort Marlborough、**1719本地反抗导致英方撤离、1723重新设防**；必须补齐公司行政和地方政治的阶段性中断，不得把所有年份涂成同一英国实控色块，属 `E18-E15`。

### 九、1670—1796：牙买加马龙自治及被迫流放
`E6-T08` 对17世纪的英国征服与马龙社区自主已有专篇。18世纪必须连到1739条约、1795再次战争及1796流放新斯科舍；族群社区有自身长期政治组织，不等于英国王权直接治理的全岛地形，见现有 `E18-A05/E18-A11/E18-A12` 及加拿大公园局S25、S26。

### 十、16—18世纪跨大西洋奴役航次
`E6-T11-VOYAGES`和`E6-T13`及`E6-T07-BARBADOS/LEEWARD`、`E6-T17-AFRICAN-FORTS`都连接18世纪，但**每世纪人数不得沿用旧分母并累加**。1698议会已调整RAC垄断权，非人口运输结束[S82英国议会](https://www.parliament.uk/about/living-heritage/transformingsociety/tradeindustry/slavetrade/overview/parliament-regulates-the-africa-trade/)。18世纪不同港口、航次、经济参与者、法案、反抗与受害者需按当期独立重编。

## 已产生的可机器复核文件与后续操作
- `research/18c/CROSS_CENTURY_STORY_CONTINUITY.json`：36/36既有专题，全部有承接类别与18C后续或明确终结状态。
- `research/18c/MAJOR_TOPICS.json`：105个18C候审专题，并可从48个新世纪主题回查17C原叙事。
- `research/18c/CROSS_CENTURY_REVIEW_EVENTS.json`：10件1700—1741研究候审事件，均包含行为主体、原17C故事、18C候审主题与来源，**全部地图坐标为null**、零个实控Polygon。该列表不代表全世纪已挖掘完整。
- `research/18c/TRANSITION_1699_1700_RESEARCH_SEED.json`：1699年的27个*示意参考图形*待逐个核1700，不是27个已核实政治实控实体。后续须从各种政体核心、岛屿、堡垒、许可证与本地自治形成真正按年的政治状态记录。

**历史及展示一致性验收门槛**：新事件源文逐项审定后才能进入对应 `data/atlas-1700-1709.json` 及之后十年；真实地图上的年份选择只显示当年/允许事件窗口的史实，旧世纪专题始终具有独立阶段与返回机制。未核经纬度不得补点，原17世纪地图长文章的旧ID不会因为开新世纪重新编号。
