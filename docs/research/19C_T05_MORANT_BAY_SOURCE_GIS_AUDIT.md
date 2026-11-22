# T05｜1865年Morant Bay及牙买加王室殖民治理：史料与历史GIS审计

**专题** T05.1/A01与T05.2/A-X14。2026-11-22 R2生产，18节54段、23新历史事件、1860年代4点1虚线、1870年代1点；不覆盖既有17/18世纪牙买加图层。研究卷26条原案事件、15地图线索、6待核项及16原来源键保持完整。

## 逐项可核证据及措辞边界

| 问题 | 已核公开来源 | 采用的结论和限制 |
| --- | --- | --- |
| 抗议起点 | [Jamaica National Heritage Trust](https://www.jnht.gov.jm/documents/Remembering-the-Morant-Bay-Uprising-article.pdf)；[JIS Paul Bogle](https://jis.gov.jm/information/heroes/paul-bogle/) | 10月7日法庭冲突、10月10日警务试逮捕、10月11日Stony Gut到Morant Bay抗议；不假设所有参与者均持枪 |
| 军令与法定地点 | [1866年《Jamaica Disturbances》Part I](https://ufdcimages.uflib.ufl.edu/AA/00/06/85/02/00001/A00068502_00001.pdf)；[Commission](https://ufdc.ufl.edu/ca01099977/00002) | 10月13日宣布Surrey County戒严，**city and parish of Kingston 例外**；13日公告的旧郡界、各军队实际到村地点、民事法权分开；没有可用同日高分辨率界图 |
| Gordon/Bogle日期 | [同期官方函令](https://ufdcimages.uflib.ufl.edu/AA/00/06/85/02/00001/A00068502_00001.pdf)、[JIS St. Thomas](https://jis.gov.jm/information/parish-profiles/parish-profiles-st-thomas/) | Gordon 21日审判、23日被处决；Bogle 23日近Stony Gut被捕、24日被处决；Gordon原预计处刑时刻与当日实际报告时刻不合并 |
| 三种镇压口径 | [1866 Hansard](https://api.parliament.uk/historic-hansard/commons/1866/jul/31/resolution)与[1872 Hansard](https://api.parliament.uk/historic-hansard/commons/1872/jul/08/supply-civil-service-estimates) | 439被杀/处刑；至少600被鞭打；约1000栋房屋毁损。1872年回述439含354经军法法庭判决与85其余死亡，此系439内部分类，不得再加 |
| 委员会性质 | [1866 Royal Commission](https://ufdc.ufl.edu/ca01099977/00002)和[Law and History Review](https://www.cambridge.org/core/journals/law-and-history-review/article/rereading-morant-bay-protest-inquiry-and-colonial-rule/8EF2A2E67182DAE4E752F62C370194EF) | 报告同时评价镇压初期行动、批评其后持续军法、频繁处刑、无节制鞭打及烧屋，不能只截取支持或批评一句 |
| 政制与1867年教区法 | [1866 Jamaica Government Bill](https://api.parliament.uk/historic-hansard/commons/1866/feb/28/bill-17-third-beading)；[1867法规No.20](https://en.wikisource.org/wiki/The_Laws_of_Jamaica,_passed_in_1867/No.20_A_Law_to_Reduce_the_Number_of_Parishes)；[牙买加地方政府史](https://localauthorities.gov.jm/history/local-government) | 1865军事镇压与1866政制变更、1867教区合并分开；官方网页另写Law 22，须对照法律原印，公共叙事暂不用编号 |
| 王室地与小农地权 | [Edinburgh Paton](https://www.pure.ed.ac.uk/ws/portalfiles/portal/75365306/01_Ch1_Paton_edited_WITH_DP_CORRECTIONS.pdf)；[牙买加国家图书馆馆藏法令目录](https://nlj.gov.jm/wp-content/uploads/2016/11/Morant20Bay20Rebellion20Bibliography.pdf) | 法定没产授权不等于实际没收份额；John Peter Grant时期乡村小农/占地者追地需每宗地契、租照、庭案核查 |

## 26条原案去向与23正式事件

本批从原研究中的A01-E01—E16、A01-B7/B8及A-X14-E01/E02选取23处可由原案和公开官料校核的可见节点。原案的Up-Park囚犯移送函、10月22日Vere秘密搜捕命令和其它尚无实际执行凭证的项目仍保留在`research/19c/consolidated/topics/T05.md`原表，不将书面命令自动当成完成的武装行动。正式新事件IDs见`data/research/19c-t05-editorial-event-ledger.json`。过去19世纪主网站该十年尚无Morant/Bogle/Gordon同案件正式ID可复用。

## GIS及统计审计

- **Morant Bay城镇中心** -76.409267,17.881448，原[GeoNames](https://www.geonames.org/advanced-search.html?country=JM&q=&startRow=300)、[JNHT法院](https://www.jnht.gov.jm/site_morant_bay_court_house.php)：不表示法院大门、军法庭室或绞刑架的微址。
- **Stony Gut村落** -76.435375,17.934921，原[GeoNames](https://www.geonames.org/advanced-search.html?country=JM&featureClass=P&q=&startRow=500)与[JNHT Stony Gut](https://www.jnht.gov.jm/site_stony_gut.php)：不推导10月23日逮捕房屋或军队焚村外缘。
- **Kingston城镇** -76.794,17.997，原[GeoNames](https://www.geonames.org/JM/largest-cities-in-jamaica.html)：在1865年公告中为适用**例外**，不会绘成戒严控制填充区。
- **Port Antonio城镇** -76.45215,18.17889，原[GeoNames](https://www.geonames.org/search.html?country=JM&q=port+antonio)：不指认为同期登陆码头实测点。
- **Stony Gut至Morant Bay虚线**：仅连接文献有证的抗议出发社群与抵达城镇两端，不能反推10月11日真实行进轨迹，不画两侧缓冲面。
- 1870—1879 Kingston延续为王室殖民地行政城镇点。1860年代现有Spanish Town官方殖民政府参考点沿用，不重复绘点。**0新增无据控制区Polygon、0伪造死亡现场、0新增面积计算**。
- 新GIS均设置`historical_boundary_confirmed=false`、`fill_authorized=false`、`territorial_claim=false`、`area_sqkm=null`、`exclude_from_area_aggregation=true`。所有地图审计措辞保留在本文件及数据，不进入读者正文。

## 长期待核原件

1. 皇家调查原卷附录1081—1082的Dacres等人请愿、1158命令原印逐字校核，现站只引已获史料交叉证明的请愿存在及拘押时间线。
2. 10月13日Surrey公告与1865—1866真实历史行政郡教区边线：候选1866 John Parry调查图和J.R. Mann/Edward Castle地图需取高分辨原图并配准，Kingston例外不能粗略扣现代城市矩形。
3. 10月23日Gordon预计08:00和同日Ramsay原报告07:00差异，核原印页与签发时间；Bogle逮捕具体房屋、军法庭现场分开核查。
4. 1865年10月12日登陆、15日Port Antonio行动、18日Stony Gut行动的实际部队人数、舰册和官兵行动日志。
5. 439人的地域/死因/军法处分明细、600人鞭打逐地点底数、1000房屋毁损的住户/索赔名册；不能用1872议员回述作为独立样本重算。
6. 1867 No.20/No.22法规编号与各新旧教区边界；John Peter Grant时期实物地契、王室地回收、受益人及被驱离家庭原登记。

**正式出版审核**：制作PR #512已47/47项检查全部通过（包括真实桌面Chrome与严格GIS）并合入主分支；独立出版PR将T05标记为`published / approved`，公开阅读无须`review19c`参数。该出版PR自身的全站CI与Pages构建/部署须单独留证，历史原档和边界疑问仍继续追查。
