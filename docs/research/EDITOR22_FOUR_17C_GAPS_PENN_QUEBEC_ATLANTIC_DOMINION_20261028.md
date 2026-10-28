# Editor22｜17世纪四大遗留缺口：宾夕法尼亚、魁北克、百慕大—巴哈马、新英格兰自治领

日期：2026-10-28。独立分支：`research/editor22-four-17c-gaps-penn-quebec-atlantic-dominion-20261028`。正式来源账：`data/research/editor22-four-17c-gap-evidence-20261028.json`（27条政府/州档案/国家博物馆/大学来源）。地图新增**24条**非面积事件，现已制成**4个专题、39章、26条故事地图目标关联**，发布审查以GitHub CI实际结果为准。

## 子专题与关键证据

### E6-T09-PENNSYLVANIA（1681—1696）
- [宾夕法尼亚州档案馆1681年3月4日原始王室特许](https://www.phmc.state.pa.us/portal/communities/documents/1681-1776/pennsylvania-charter.html)与英格兰债务安排：属于英王法律声索；**不等于**1681年莱纳佩人出售全州。
- [宾州州立大学土地契据与条约导览](https://guides.libraries.psu.edu/c.php?g=1145236&p=8358594)载1682年7月15日一份涉及内沙米尼溪和特拉华河之间的土地契据；同一馆明确说明1682年沙卡马克森条约传统**没有现存签署文件**。
- [美国国会图书馆霍尔姆1687年已改良地区土地地图](https://www.loc.gov/item/2006625100/)仅为已测量与分配的有限庄园、地块；不同版次不一定于1687年同年印刷；不据现代州界绘出完整据有区。土地办公室资料：[PA RG17](https://www.phmc.state.pa.us/bah/dam/rg/rg17.htm)。

### E6-T10-QUEBEC-KIRKE（1629—1632）
- [加拿大公园局圣路易堡历史](https://parks.canada.ca/lhn-nhs/qc/saintlouisforts/culture/histoire-history/natcul1)记英方驻控1629—1632；[加拿大联邦早期耶稣会史迹](https://parks.canada.ca/lhn-nhs/qc/cartierbrebeuf/culture/histoire-history/evenement-event/brebeuf/jesuite-jesuit)记1629驱逐、1632回归。
- [加拿大国家图书与档案馆历史著述](https://data2.collectionscanada.gc.ca/080027/amicus-4392506_02.pdf)记1632年3月29日圣日耳曼昂莱条约；[魁北克政府文化史迹资料](https://cdn-contenu.quebec.ca/cdn-contenu/adm/min/culture-communications/publications-adm/acces-information/demandes-acces/2023/2306027-110-document-1.pdf)确认1632归还、1633尚普兰返回。具体交接和公文日不可混同；后一PDF部分抓取时会返回404但有政府索引摘要。
- [加拿大公园局奥利维耶·勒热纳国家纪念](https://parks.canada.ca/culture/designation/personnage-person/olivier-le-jeune)证明一名非洲儿童于1629—1632英占期间在魁北克受奴役并遭转卖，具体家乡马达加斯加或几内亚未定。不能据一人推断总人口或将同年新法兰西涂满英色。

### E6-T16-ATLANTIC-ISLANDS（1609—1695）
- [美国国家海洋与大气管理局Sea Venture](https://www.aoml.noaa.gov/hurricane_blog/405th-anniversary-of-the-sea-ventures-hurricane-encounter/)1609；[百慕大政府政制史](https://www2.gov.bm/premier-bermuda)1612圣乔治、1615萨默斯公司、1620议会、1684转王室。
- [百慕大政府官方历史年表](https://www2.gov.bm/files/media-library/20260413/ed6325d8-2016-facts-and-figures.pdf)记1616一名黑人和一名原住民以**indentured servants（契约仆役）**入岛采珠。不得伪称当时已经确定他们的终身世袭法律身份。
- [巴哈马政府2013宪法委员会原报告第47页](https://cdn.bahamas.gov.bs/tenant/tenanttgotb/documents/All%20Documents/ConstitutionCommissionReport20138JULY2013-20240119174548.pdf)记1629希思特许、1647伊柳塞拉冒险者、1670六位卡罗来纳领主。该委员会1647与[官方旅游史1649](https://www.bahamas.com/our-history)年份不一，地图以1647作时间线入口并在文字标注**约1647—1649年**，严禁声称唯一确切登陆日。

### E6-T09-NE-DOMINION（1686—1692）
- [马萨诸塞州州务卿档案](https://www.sec.state.ma.us/divisions/archives/collections/mass-archives-collection.htm)区分1686年5月杜德利**无独立立法及税权**临时政府、1686年12月安德罗斯统合、1688加入纽约新泽西、1689年4月18日波士顿起义、1692新省特许政制。
- [史学会一手政府记录刊本](https://www.colonialsociety.org/node/1779)、[美国古物学会康涅狄格1687宪章争议研究](https://www.americanantiquarian.org/node/11157)以及[马萨诸塞州公布皇家委任原文索引](https://www.mass.gov/info-details/massachusetts-historical-laws-and-legal-documents)，明确皇家管辖声索不等于每个原住民部落和县区已被实际占领。

## 一致性验收和地图局限

新增24个Atlas事件全部携带`actual_English_land_area_sqkm:null`、`historical_control_boundary_verified:false`、`actual_English_territory_created:false`、`exclude_point_buffer_from_area_statistics:true`，坐标仅为现代具名地参考，不得变成历史填色面积；在存在可核历史边线且界线有争议时才允许虚线，绝不为了视觉效果构造不确定的疆域。此次没有改变任何现有17世纪Polygon（保持零）与1497—1599年既有叙事、地籍及地图。

发布前需验证`node scripts/test_editor22_four_gaps.js`、`node scripts/test_serial_story_contract.js`、`node scripts/test_17c_tudor_parity_20261023.js`、`python3 scripts/audit_spatial_semantics.py --strict`及对应桌面Chromium；同时兼容原有历史测试中的硬编码年份数量。实际CI判定优先于本文计划。

## 来源表

- **PA1** Pennsylvania Historical & Museum Commission, *Pennsylvania Charter March 4, 1681*: https://www.phmc.state.pa.us/portal/communities/documents/1681-1776/pennsylvania-charter.html
- **PA2** Pennsylvania State University Libraries, *Government Documents and Treaties: Indigenous Peoples in Pennsylvania History*: https://guides.libraries.psu.edu/c.php?g=1145236&p=8358594
- **PA3** US Library of Congress Geography & Maps Division, *Thomas Holme Map of Improved Part of Pennsylvania (1687 map content, copy later edition possible)*: https://www.loc.gov/item/2006625100/
- **PA4** Pennsylvania Legislative Reference Bureau archive, *Colonial Documents: Charter and Frames of Government 1682/1683/1696*: https://www.paconstitution.org/texts-of-the-constitution/colonial/
- **PA5** Pennsylvania State University Libraries, *Shackamaxon Treaty 1682 documentation warning*: https://guides.libraries.psu.edu/c.php?g=1145236&p=8358594
- **QC1** Government of Quebec (Ministry of Culture and Communications), *Vieux-Québec Site patrimonial official history dossier*: https://cdn-contenu.quebec.ca/cdn-contenu/adm/min/culture-communications/publications-adm/acces-information/demandes-acces/2023/2306027-110-document-1.pdf
- **QC2** Library and Archives Canada, *Historical Quebec chronology, English Kirke occupation 1629 and 1632 restitution (Digitized historical publication)*: https://data2.collectionscanada.gc.ca/080027/amicus-4392506_02.pdf
- **BE1** Government of Bermuda, *Premier and Bermuda constitutional history*: https://www2.gov.bm/premier-bermuda
- **BE2** Government of Bermuda Facts and Figures 2016 PDF, *Historical notes page 1: settlement, labor, assembly*: https://www2.gov.bm/files/media-library/20260413/ed6325d8-2016-facts-and-figures.pdf
- **BE3** US NOAA Atlantic Oceanographic and Meteorological Laboratory, *405th Anniversary of the Sea Venture*: https://www.aoml.noaa.gov/hurricane_blog/405th-anniversary-of-the-sea-ventures-hurricane-encounter/
- **BA1** Government of the Bahamas, Constitutional Commission, *2013 Constitutional Commission report section 5.1–5.3*: https://cdn.bahamas.gov.bs/tenant/tenanttgotb/documents/All%20Documents/ConstitutionCommissionReport20138JULY2013-20240119174548.pdf
- **BA2** Bahamas Ministry of Tourism official site, *History of Bahamas: Eleutheran Adventurers*: https://www.bahamas.com/our-history
- **BA3** Nassau Paradise Island tourism bureau, *Island History and Culture (Nassau Charles Town renamed 1695)*: https://www.nassauparadiseisland.com/experiences/history-culture
- **NE1** Massachusetts Secretary of Commonwealth Archives, *Massachusetts Archives Inter-Charter Period 1686–1692*: https://www.sec.state.ma.us/divisions/archives/collections/mass-archives-collection.htm
- **NE2** Massachusetts Secretary of Commonwealth Archives, *Massachusetts Archives volume list, volumes 106,107,126-129*: https://www.sec.state.ma.us/divisions/archives/collections/mass-archives-volume-list.htm
- **NE3** Colonial Society of Massachusetts, *Editorial introduction to 1689–1692 Government Records*: https://www.colonialsociety.org/node/1779
- **NE4** Massachusetts State Government, *Massachusetts Historical Laws and Legal Documents: Dominion commissions 1686, 1688*: https://www.mass.gov/info-details/massachusetts-historical-laws-and-legal-documents
- **NE5** American Antiquarian Society journal, *Expedition of Sir Edmund Andros to Connecticut 1687 (Albert C Bates 1938)*: https://www.americanantiquarian.org/node/11157
- **NE6** Colonial Society of Massachusetts, *Historical Introduction (1689 uprising context)*: https://www.colonialsociety.org/node/1784
- **NE7** Colonial Society of Massachusetts, *Massachusetts and British Documents 1689–1692 (Privy Council order 25 July 1689)*: https://www.colonialsociety.org/node/1796
- **PA6** US National Park Service, *William Penn Person History*: https://www.nps.gov/people/william-penn.htm
- **PA7** Pennsylvania Historical and Museum Commission State Archives, *Records of Pennsylvania Land Office, RG17*: https://www.phmc.state.pa.us/bah/dam/rg/rg17.htm
- **QC3** Quebec Ministry of Culture, *Olivier Le Jeune named historical figure 2020*: https://www.quebec.ca/nouvelles/actualites/details/mois-de-lhistoire-des-noirs-la-ministre-nathalie-roy-designe-olivier-le-jeune-comme-personnage-historique
- **PA8** US National Park Service, *First State National Historic Park New Castle William Penn*: https://www.nps.gov/frst/learn/historyculture/special-resource-study.htm
- **QC4** Parks Canada, *Saint-Louis Forts and Châteaux Quebec National Historic Site timeline*: https://parks.canada.ca/lhn-nhs/qc/saintlouisforts/culture/histoire-history/natcul1
- **QC5** Parks Canada, *Olivier Le Jeune 2023 national historical person recognition*: https://parks.canada.ca/culture/designation/personnage-person/olivier-le-jeune
- **QC6** Parks Canada, *Cartier-Brébeuf National Historic Site first Jesuit mission*: https://parks.canada.ca/lhn-nhs/qc/cartierbrebeuf/culture/histoire-history/evenement-event/brebeuf/jesuite-jesuit
