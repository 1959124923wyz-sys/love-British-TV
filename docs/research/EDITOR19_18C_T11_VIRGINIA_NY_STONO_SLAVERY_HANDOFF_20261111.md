# 主编19第二十批｜T11 英属北美奴役法、1712纽约起义与1739 Stono 镇压

2026-11-11。研究分支 `map/18c-t11-virginia-newyork-stono-slavery-repression-1702-1741-20261111`，直接继承第十九批 Draft PR #312；不修改正式 main。

## 研究来源和可核事实

- 已核主编15 T11 8个合并组、10个原始候审ID、21个原 A 来源注册键；1126行归档、315候审归并和原 ZIP 均原样保留。
- 26条有年份史事、47个来源入口、26章78段中文完整专题、26条正文地图联动。来源登记区分原注册键的组级来源网址和本批实际阅读的机构文章；未宣称逐卷阅读A助手原始手稿。
- 1705年弗吉尼亚原法律区分财产地位、主人惩罚致死免责、书面通行证、逃亡搜捕授权；不存在凭法条臆造的死亡人数。
- 1712年纽约起义确有九名白人死亡、殖民法院执行处决。Columbia MAAP、NYPL对起义人数、伤者和处刑人数记载不一致，按源保留差异。
- 1729马里兰法庭可判断手、绞刑和分尸；不以授权代替个案执行记录。
- 1735乔治亚奴役禁令与1751取消严格区分，1738 Fort Mose是西班牙总督许可、逃出英属殖民地非洲裔建立的自由据点。
- 1739 Stono起义者夺枪、杀白人、向自由进军；英殖民民兵反击杀人。Charleston County Library发现现代纪念碑并非起义精确起点，无假地点或路线。
- 1740英国军短占Fort Mose，Menéndez组织反攻并夺回；南卡1740奴役法的世袭动产、集会和外出限制独立记录。
- 1741纽约火灾与法院处决、加勒比流放，纽约法院历史学会与市地标委员会认为统一阴谋未得充分证明。

## GIS和交互

仅采用经GeoNames、UNT等来源支持的现代城市代表点；其余事件lat/lng=null。没有历史实际控制Polygon、推测军路线或以法律适用范围估算英属领土。站点读取仅在`?review18c=1`，不修改16/17世纪已发布内容，不恢复浮动动态目录。

## 验收

执行 `node scripts/test_18c_t11_slavery_law_resistance_map.js`、`python3 scripts/audit_18c_t11_original_A_sources.py`、`python3 scripts/audit_spatial_semantics.py --strict`，再运行全部前19篇兼容回归、真实1780×1020桌面Chromium以及独立网页访问检查。CI未完成前不宣称最终验收。

## 下一轮史料缺口

1712纽约法院处决原始判决名单、Stono现场地籍及民兵损失与杀害名单、1741 Horsmanden不同版本判决数、Fort Mose 1740战场位置、1705法执行个案及1751佐治亚法律撤销，仍需进一步追查。

## 逐条已读来源入口
- 18CT11-EV-VA1705: Encyclopedia Virginia：1705《仆役与奴役者法》法条原文转录 — https://encyclopediavirginia.org/primary-documents/an-act-concerning-servants-and-slaves-1705/
- 18CT11-VCDH-1705: Virginia Center for Digital History：殖民弗吉尼亚奴役法律 — https://www2.vcdh.virginia.edu/gos/laws1700-1750.html
- 18CT11-EV-RUNAWAY: Encyclopedia Virginia：逃亡者与殖民追捕制度研究 — https://encyclopediavirginia.org/entries/runaway-slaves-and-servants-in-colonial-virginia/
- 18CT11-NYPL-BLACK: 纽约公共图书馆历史项目：英治纽约奴役和1712年起义 — https://blacknewyorkers-nypl.org/slavery-under-the-british/
- 18CT11-NYCOURTS-1702: 纽约法院历史学会：1702与1741年殖民奴役刑法和审判 — https://history.nycourts.gov/product/2021-society-calendar-race-slavery-nys-courts/
- 18CT11-COLUMBIA-1712: 哥伦比亚大学MAAP：1712年纽约Maiden Lane起义 — https://maap.columbia.edu/place/34.html
- 18CT11-NY1712-ACT: Duke大学法律史：1712年纽约奴役者起义惩罚法转录 — https://firearmslaw.duke.edu/laws/an-act-for-preventing-suppressing-and-punishing-the-conspiracy-and-insurrection-of-negroes-and-other-slaves-ch-250-1712-n-y-laws-james-b-lyon-1894
- 18CT11-MD1729-LAW: 马里兰州档案馆：1729年殖民处罚法原文 — https://msa.maryland.gov/megafile/msa/speccol/sc2900/sc2908/000001/000075/html/am75--383.html
- 18CT11-UNB1729: 新不伦瑞克大学：1729年马里兰法律全文 — https://slaveryandfreedomlaws.lib.unb.ca/laws/maryland-1729
- 18CT11-GEORGIA-1735: New Georgia Encyclopedia：1735禁奴政策及1751取消 — https://www.georgiaencyclopedia.org/articles/history-archaeology/slavery-in-colonial-georgia/
- 18CT11-GEORGIA-CHARTER: New Georgia Encyclopedia：乔治亚托管殖民地 — https://www.georgiaencyclopedia.org/articles/history-archaeology/trustee-georgia-1732-1752/
- 18CT11-NPS-MOSE: 美国国家公园管理局：Fort Mose设立、英军占堡与自由黑人夺回 — https://home.nps.gov/foma/learn/historyculture/fort-mose.htm
- 18CT11-FL-PARK-MOSE: 佛罗里达州公园局：1738年Fort Mose自由黑人聚居地 — https://www.floridastateparks.org/learn/history-fort-mose
- 18CT11-LOC-STONO: 美国国会图书馆：1739年Stono起义与史料地图 — https://www.loc.gov/item/today-in-history/september-09/
- 18CT11-CCPL-STONO: 查尔斯顿郡公共图书馆：Stono旧地籍、战斗地点纠错 — https://www.ccpl.org/charleston-time-machine/stono-rebellion-1739-where-did-it-begin
- 18CT11-SC-ENC-STONO: 南卡罗来纳百科全书：Stono起义与镇压 — https://www.scencyclopedia.org/sce/entries/stono-rebellion/
- 18CT11-UGA-1740: 乔治亚大学出版社：1740年Oglethorpe有关Stono的当代叙述 — https://ugapress.manifoldapp.org/read/1a695407-f524-4099-a15e-9fe50d7d6792/section/aa2464e8-db89-4e56-b15b-73ff22e9847a
- 18CT11-UNB1740-LAW: 新不伦瑞克大学：1740年南卡奴役法全文 — https://slaveryandfreedomlaws.lib.unb.ca/node/253
- 18CT11-NYCOURTS-1741: 纽约法院历史学会：1741年纵火案与奴役审判 — https://history.nycourts.gov/case/slave-conspiracy-trials/
- 18CT11-LOC-HORSMANDEN: 美国国会图书馆：Horsmanden殖民审判记录1810年再版原书 — https://www.loc.gov/item/01014322/
- 18CT11-NYC-LPC1741: 纽约市地标保护委员会：1741年指控历史争议 — https://archaeology.cityofnewyork.us/collection/nyc-timeline/1741-new-york-rebellion-of-enslaved-people
- 18CT11-UNT-NEWYORK: 北德州大学地理库：纽约市现代地名代表点40.71427/-74.00597 — https://digital.library.unt.edu/explore/locations/p00041/
- 18CT11-GEO-CHARLESTON: GeoNames：Charleston现代城市参考坐标32.77632/-79.93275 — https://www.geonames.org/4574324/charleston.html
- 18CT11-GEO-WILLIAMSBURG: Mapcarta／GeoNames Williamsburg现代城市参考点37.271/-76.7059 — https://mapcarta.com/Williamsburg
- 18CT11-NPS-STONO-MARKER: 美国国家公园管理局：Stono历史遗址登记及地址（非准确起义点） — https://npgallery.nps.gov/AssetDetail/NRIS/74001840
- 18CT11-NYPL-1712-LAW: 纽约公共图书馆：1712年起义与12月刑法背景 — https://blacknewyorkers-nypl.org/slavery-under-the-british/
