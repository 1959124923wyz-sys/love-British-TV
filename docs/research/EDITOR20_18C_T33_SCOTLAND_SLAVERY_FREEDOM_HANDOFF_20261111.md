# 主编20｜第31批T33：苏格兰奴役资本和司法反抗（2026-11-11）

## GitHub交接
- 直接继承主编20第30批 **PR #325** 最新HEAD `eab7a3fec69ea2f40e7d1cc11814cb451bda70f4`，独立Draft分支 `map/18c-t33-scotland-slavery-investment-court-resistance-1707-1792-20261111`，目标分支是第30批，**正式main不修改**。
- 原始研究档案 `research/18c/consolidated/series/T33.json`：**0个原始合并组、0条原候审事件、0个A/B/C原始来源键**。不可为了凑原始数据虚构原始ID、来源键或此前研究。保留原1126条crosswalk与2026-11-08 ZIP未变。
- 新的T33研究成果：**29条有年份的史实、29章87段中文全文、21个公开可查来源、29个Atlas地图正文互动、29项法律/贸易/行动主体控制过渡**；31篇研究试阅索引和前30篇保持。

## 可核直接史料与研究
1. [苏格兰国家档案馆跨大西洋奴隶贸易航运诉讼](https://nrscotland.gov.uk/learning-and-events/research-guides/slavery-and-the-slave-trade/?section=enslavement-in-africa-and-slave-trade-voyages)：**1721 AC9/718 Daniel v Graham；1727 AC9/1022 Clark v Inglis；1727 AC9/1042 Horseburgh v Bogle**，后者70余件财务、证人和贩奴商人契约文书。**1731年5月**Bleney Harper巴巴多斯致格拉斯哥William Gordon & Company报告，CS228/A/3/19；1762 Alexander v Colhoun & Company亦有相应卷宗。以上为馆藏条目及档案指南，未当作逐页亲阅原始账册。
2. [苏格兰国家档案馆商人及种植园记录](https://nrscotland.gov.uk/learning-and-events/research-guides/slavery-and-the-slave-trade/?section=estate-plantation-and-business-records-of-merchants-and-enslavers)：**Glasgow Buchanan & Simpson 1754—1773 CS96/502–509**，1754是留存文书起始年份，不是臆造单笔交易年。1707年英国联合后苏格兰正式跨境商品和人口奴役贸易准入独立登记。
3. [James Montgomery案NRS](https://nrscotland.gov.uk/learning-and-events/slavery-and-scotland/the-james-montgomery-slavery-case-1756/)：1750-03-09弗吉尼亚原买卖证书价格56镑12先令6便士**当地币种**；1756-04-21在Port Glasgow逃离强制遣回、广告通缉和Edinburgh Tolbooth监禁；**1757-01-04拟开庭前已死于狱中**，确切去世日未知，未形成法庭终审。
4. [David Spens 1769案NRS](https://nrscotland.gov.uk/learning-and-events/slavery-and-scotland/dalrymple-v-spens-and-henderson-1769/)：约1768自西印度被带回，**1769-09-01**Wemyss教区受洗，次日获John Henderson庇护并抗争，1770奴役者Dalrymple死亡后案件不经法院最终判决而终结。
5. [James Somerset 1772案English Heritage](https://www.english-heritage.org.uk/visit/places/kenwood/history-stories-kenwood/somerset-case/)：1771-10-01逃离苏格兰裔奴役者Steuart，11-26遭抓上船，**1772-06-22**Mansfield法庭禁止强制拘押出境至牙买加，**裁决范围狭窄**，没有废止海外种植园奴役。
6. [Joseph Knight案NRS](https://nrscotland.gov.uk/learning-and-events/slavery-and-scotland/the-joseph-knight-case/) · [司法机构逐年说明](https://judiciary.scot/home/media-information/media-hub-news/2022/12/06/plaque-marks-historic-slavery-case-at-court-of-session) · [1778年判词BAILII](https://www.bailii.org/scot/cases/ScotCS/1778/Hailes020776-0472.html)：1773-11捕押令；1774-05-20珀斯Sheriff抗诉成功；1775书面互辩；1776全席辩论；**1778-01-15以10比4确认Knight在苏格兰不受殖民奴役及终身服役控制**。本土自由与西印度种植园殖民法律分开。
7. [George Dale 1790口述原档GD50/235](https://nrscotland.gov.uk/learning-and-events/slavery-and-scotland/the-history-of-george-dale-a-native-of-africa-1790/)：**1790-08-06**爱丁堡口述被掳、西印度奴役、伤残、Greenock/Glasgow和Edinburgh生活，童年被绑具体年份不详，不根据后述推断精确原乡GPS或航线。
8. [1788英国奴役船舶限制和1792议会辩论](https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/parliament-and-empire/parliament-and-the-american-colonies-before-1765/the-west-indian-colonies-and-emancipation/) · [Edinburgh University Press Stephen Mullen](https://euppublishingblog.com/2021/11/10/clarifying-henry-dundas-role-as-the-great-delayer-of-the-abolition-of-the-slave-trade-part-1-historiographical-orthodoxy-public-debate-and-memorialisation/) · [1806年英国议会反省原文](https://api.parliament.uk/historic-hansard/commons/1806/jun/10/abolition-of-the-slave-trade)：1788法规限制每船载运上限；1792年4月Dundas主张渐进废除，历史解释存在争论，**1792没有正式废除英国奴隶贸易，1807才立法**。

## 史学与GIS硬约束
- 17个现代城市参考坐标：Edinburgh、Port Glasgow、Perth、London由GeoNames核实；不是旧法庭／监狱／码头地籍。17世纪及18世纪的商贸账本不能凭城市坐标推导奴役受害者的人数、财富或奴役人口实际控制范围。
- 原史料“70余件”是1727诉讼卷宗数量，不是70名被奴役者。
- 0历史殖民疆域Polygon、0奴役船航线/目的港推定GIS、0没有财务原账支撑的奴役商人净利润、0历史法庭建筑冒充现代城市中心。
- 1769 Spens逃离与1770获释分开；Montgomery死于预定1757-01-04开庭前但死亡具体日期未知；1772 Somerset判决与1778 Knight判决适用法律地理范围不同；1792不是废奴既成事实。

## 代码与验收
- 专属静态：`scripts/test_18c_t33_scotland_slavery_courts_map.js`。逐项验证29事件、29章87段、29互动、21来源、17现代坐标、对原T33没有伪造候审源流、31篇索引、严格0领土面。
- 原档审计：`scripts/audit_18c_t33_empty_predecessor_sources.py`，重新核GitHub原T33 0记录及1126 crosswalk/ZIP。
- 真实Chromium：`scripts/browser_18c_t33_scotland_slavery_courts.py`，1780x1020，跨1707—1792、双击史料和正文返回，全部30前篇及16世纪已正式展示地图回归。
- GitHub Actions三重门槛：`.github/workflows/18c-t33-scotland-slavery-courts-map.yml`，最后HEAD静态审计、真实桌面和公开网站外链各自success，Draft PR仍不合并。
- 后续优先：AC9/1042 70余件海商档案中的船舶买卖原账和人数；CS96/502–509商账量化；Joseph Knight家族口述进一步细节；1792 Dundee/Glasgow地方反奴隶贸易议会请愿记录。
