# 主编21｜第37批：西非贩奴堡垒、印度公司影响与加勒比易手动态图（2026-11-12）

## 用户目标与工程边界
- “量大管饱”，重点是历史地图在时间轴上有大量可见区域、短占、撤离、港口与影响线，不额外堆专题文章。
- 承接第34批 PR #329（24面15核心）、第35批 PR #330（81面42核心）、第36批 PR #331（130面83核心）。新工作只提交独立分支、**Draft PR**；不合并、更不修改正式main；保留34篇专题和1126条原始档案。
- 所有新增地理都是当代编辑**概略位置包围框**，每项存档 `area_sqkm:null`、`precise_historic_border:false`、`uncertain_line_dashed:true`，不汇总土地面积。

## 第37批GIS可见总量

| 目录 | 新增区域面 | 新增地点核心 | 年代阶段 |
|---|---:|---:|---:|
| 非洲（Gold Coast/冈比亚/塞拉利昂/Old Calabar/Ouidah） | 40 | 27 | 67 |
| 印度、苏门答腊、马六甲海峡、摩鹿加、锡兰 | 60 | 44 | 104 |
| 加勒比和圣多明各、西印度岛屿战时易手 | 41 | 37 | 86 |
| **第37批** | **141** | **108** | **257** |
| **前4批累计** | **376** | **248** | **673** |

以上是绘图对象和标记的**累积数量**，存在同城不同政治阶段和局部叠加；不是376块英国真实占领省、248座独立殖民城市，也不衡量面积km²。

## 具核实依据的年度变化

1. **西非黄金海岸**：阿诺马布英国Fort Charles存在至1731拆毁；1753议会拨款修新堡，1757竣工；Fort Metal Cross、Fort James、English Komenda、1768后Fort Apollonia分成堡垒与附近多方贸易影响区。阿波罗尼亚堡的准许来自Nzema首领。黄金海岸还有荷、丹、葡等多国要塞，不许统一上色为英国领土。
2. **冈比亚/塞拉利昂**：James Island英国商堡显示至1778，1779年法国摧毁后终止；Bunce Island有1700–1727英国商堡、1728遭非洲—葡萄牙商人攻击、1740年代英商重建、1779与1794法军袭击等阶段。具体恢复贸易的年份证据不足时，只画空心贸易影响，不使用英国长期军事控制标记。
3. **Old Calabar**：1767 Duke Town势力与英国船长合谋伏击Old Town商人、杀害300人以上。地图分别标当地社群的政治空间、屠杀地理参考、被劫押运与后续英国贩奴贸易联系；避免把整个河口涂成英属港。
4. **1765–1799印度**：普拉西1757、布克萨尔1764与1765 Diwani税权的时间先后分明；孟加拉比哈尔税区用财政色，贝拿勒斯与阿瓦德宫廷以外交和财产剥夺分色；1760年代公司对土邦介入、1792迈索尔割让、1799战后接管局部区域。
5. **东南亚新断点**：Bencoolen堡垒与公司行政等级1760–85升格、后降格；Balambangan 1761条约声索、1773–74英商驻站、1775苏禄力量夺占；Padang 1781短占；槟城1786建立与Kedah苏丹1790–91反对及条约；马六甲1795英占、安汶与班达1796英占。锡兰沿海1796接管与康提王国内陆自主相区分。
6. **加勒比**：1779格林纳达法军夺岛、1783英方恢复；1778多米尼克法军夺港、1783归英；1781多巴哥归法及1793英方再占；1794瓜德罗普英军短占后法军收复；1796圣卢西亚Fort Charlotte受降；1797特立尼达英军攻占；1793–1798圣多明各局部海港英军驻地及撤离。Fédon革命、Maroon、Garifuna反抗及强迁自有独立图层。

## 核心第一手/权威来源（完整逐对象source_key保存在数据）
- [UNESCO：加纳海岸多国堡垒及跨大西洋贸易](https://whc.unesco.org/en/list/34/)
- [Ghana Museums：Anomabu Fort William 1753–1757](https://gmmb.gov.gh/fort-william-anomabu-1753/)
- [Ghana Museums：Beyin Apollonia 1768与Nzema首领](https://gmmb.gov.gh/fort-apollonia-beyin-1768/)
- [UNESCO：Kunta Kinteh/James Island 1779法国破坏](https://whc.unesco.org/en/list/761/)
- [Sierra Leone Heritage：Bunce Island历次英法与非洲商人战事](https://www.sierraleoneheritage.org/sites/monuments/bunce)
- [Oxford University Press：1767 Old Calabar大屠杀](https://academic.oup.com/book/58166/chapter-abstract/485239549)
- [美国历史学会：Old Calabar贩奴商人和被害者](https://www.historians.org/presidential-address/james-h-sweet/)
- [National Army Museum：公司军队、1757/1764/1765](https://www.nam.ac.uk/explore/armies-east-india-company)
- [British Library：Balambangan 1773–74原始EIC records](https://searcharchives.bl.uk/catalog/041-000173313)
- [British Library：婆罗洲Balambangan 1775苏禄军人夺站](https://searcharchives.bl.uk/catalog/036-000173310)
- [Cambridge University Press：Bencoolen Presidency 1760–1785](https://www.cambridge.org/core/journals/journal-of-british-studies/article/making-and-unmaking-of-a-presidency-envisioning-empire-in-british-bencoolen-16851825/4C0CA8C6BF1E88181DA0CEACBC33C47A)
- [Cambridge：1795马六甲及1796安汶/班达](https://www.cambridge.org/core/books/abs/british-traders-in-the-east-indies-17701820/inadvertent-imperialists-country-traders-and-british-officials/0418632561D0570B5052414E591A41B6)
- [槟城港口政府：1786和1791](https://penangport.gov.my/en/contact-us/public/port-history)
- [English Heritage：1794瓜德罗普、1796圣卢西亚英军、黑人法国革命军](https://production.english-heritage.org.uk/visit/places/portchester-castle/history-and-stories/black-prisoners-at-portchester/)
- [AM Digital：1793–1798英加勒比战争阶段和奴役反抗](https://resources.amdigital.co.uk/coc/time/access.php?end=1820&start=1750)

## 实现和质量边界
- `data/eighteenth-century-b37-africa.json`（40/27）；
  `data/eighteenth-century-b37-india-ocean.json`（60/44）；
  `data/eighteenth-century-b37-caribbean.json`（41/37）。都含原年份、来源、分类、概略bbox。
- `js/eighteenth-batch37-spatial.js`：三个独立地域文件验证后一次加载，叶子图层可点击来源，四条年表重绘路径以及原“版图”开关同步。行政和有据港市淡填色；财政金色淡面；声索、商业、战场、外国军事占领、当地反抗和强迫迁移**只画虚线、不实心涂色**。
- `scripts/test_18c_batch37_141_108.js`：数量、来源、几何与代理点、历史断点、旧3批数据不变。
- `scripts/browser_18c_batch37_141_108.py`：真实1780×1020桌面浏览器15个年份、点击来源、三批旧地图开关、1572旧版回归以及未开放18世纪的默认隔离。
- GitHub Actions执行三项独立验收：严格GIS/34篇旧专题/1126原档、真实桌面（四批联合回归）、固定SHA公开资源访问。
- **不计算不虚构英国18世纪控制面积**。区域参考面的bbox几何只是用于“地理位置”和“政治制度触及范围”示意，对当地社群主权不作取消或转让的想象。

## 下一批地图建议
在保留大覆盖量基础上，优先补「17世纪最后阶段到18世纪初」、印度东印度公司征地与征税的逐年折点、内陆民族和土邦对英公司的反抗范围。涉及殖民边界无法可信确定继续使用虚线。
