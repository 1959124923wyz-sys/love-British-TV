# 第5AD批｜1783—1786伯利兹采木条约、哈德孙湾原始河道、印度财税与北美战事（2026-11-21）

承接已合并第5AC批PR #486及Pages修复PR #487，以正式主分支 `0503994a7214adb79bb9c3660d1ebb41492059aa` 为基线。第5AD批一次归档退出 **25条旧矩形**。按上批审定整世纪盘点 **51→26**，其中1799年 **22→12**；完整1497—1799旧框 **77→52**。此总量基于上期全库台账及25条稳定ID的差分，工作分支更新的四份旧JSON分别剩余13条（其中4条有效于1799）；其余遗留来自未改动数据集。原记录、bbox、kind、periods、source_urls、原笔记、proxy site的完整史料不删，只增加`superseded_by`。

## 实际制图内容

- **26处具名历史地理点**：1763年匹特堡、迈阿密堡、普雷斯克岛堡；草原之犬与拉欣毛皮交易；贝拿勒斯税务关系、法扎巴德贝古姆财产案、1799坦贾武尔、特利切里、安詹戈；牙买加圣玛丽、西摩兰、汉诺威三教区反抗；格林纳达费东起义；坎伯兰豪斯；1767蒂鲁瓦纳马莱、1769马德拉斯和约、1780阿尔科特、1782萨德拉斯海战港；1780罗基芒特和菲兴溪、1781里士满；1783洪多河口与伯利兹河口、1786锡本河口、1784伯利兹河口木材聚落。现代教区中心、港口与纪念碑具有**地理参考性质**，不能等同当年具体战场、庄园或税界，精准度保存在GIS属性。所有点仅代表地点，零历史占领面积。
- **1组真实自然水系 MultiLineString**，将已有Natural Earth 1:10m `EDITOR36_5Z_HAYES_LOWER` 和 `EDITOR36_5Z_SASKATCHEWAN_RIVER` 的实有298个河线顶点按原路径集合保留为9个分离河段。无源GIS的中间河路保持断开；这是原住民与贸易运输的自然地理背景，绝不重构哈德孙湾公司具体船队航迹。
- **额外直接复用已出版原始GIS替代两旧框**：`B38-H-Z005→EDITOR36_5Z_HAYES_LOWER`、`B38-H-Z026→EDITOR36_5Z_LAKE_HURON`，避免重复新增湖岸并保持1799→1800河湖连续性。
- **伯利兹条约空间分期**：1783年与西班牙订约，许可英方在洪多河、伯利兹河、黑溪及图示内线之间砍伐染料木；1786年7月14日条约扩大采木范围至锡本河，另有撤出蚊子海岸条款。**明确区分英人采木权与西班牙法理主权，以及玛雅人的原有土地和生活**。1787年威廉·费登（William Faden）《尤卡坦东岸洪都拉斯湾采木地区图》保存在美国国会图书馆，彩绘有1783粉红许可区、1786黄色扩展区。**本批只画具证关键河口/聚落的经纬度点，没有冒用现代伯利兹国界或用直线围合条约多边形**。下一批应将原图配准到现代可靠水系，才能新增虚线条约许可面。
- **坦贾武尔1799政治性质**：据当地政府及英国档案，瑟福吉二世将收入、司法管理交予东印度公司，保有坦贾武尔堡等有限统治权；只新增坦贾武尔具名点，不把财政管理直接扩成整区英国驻军实测面。

## 逐条旧框替换表

| 旧记录 | 替代地理对象 |
|---|---|
| B36-Z020 | EDITOR38_5AD_FORT_PITT_1763 |
| B36-Z021 | EDITOR38_5AD_FORT_MIAMIS_1763 |
| B36-Z022 | EDITOR38_5AD_PRESQUE_ISLE_1763 |
| B36-Z029 | EDITOR38_5AD_PRAIRIE_DU_CHIEN |
| B36-Z033 | EDITOR38_5AD_LACHINE_TRADING |
| B36-Z080 | EDITOR38_5AD_BENARES_REVENUE |
| B36-Z081 | EDITOR38_5AD_FAIZABAD_BEGUMS |
| B36-Z094 | EDITOR38_5AD_TANJORE_1799 |
| B36-Z096 | EDITOR38_5AD_TELLICHERRY_FORT |
| B36-Z097 | EDITOR38_5AD_ANJENGO_FORT |
| B36-Z107 | EDITOR38_5AD_JAMAICA_ST_MARY |
| B36-Z108 | EDITOR38_5AD_JAMAICA_WESTMORELAND |
| B36-Z109 | EDITOR38_5AD_JAMAICA_HANOVER |
| B36-Z114 | EDITOR38_5AD_GRENADA_ST_JOHN |
| B38-H-Z005 | EDITOR36_5Z_HAYES_LOWER（前批实测复用） |
| B38-H-Z019 | EDITOR38_5AD_CUMBERLAND_HOUSE_CREE |
| B38-H-Z020 | EDITOR38_5AD_HAYES_SASKATCHEWAN_WATERWAYS |
| B38-H-Z026 | EDITOR36_5Z_LAKE_HURON（前批实测复用） |
| B38-I-Z023 | EDITOR38_5AD_TIRUVANNAMALAI_1767 |
| B38-I-Z024 | EDITOR38_5AD_MADRAS_TREATY_1769 |
| B38-I-Z025 | EDITOR38_5AD_ARCOT_1780 |
| B38-I-Z029 | EDITOR38_5AD_SADRAS_1782 |
| B38-S-Z024 | EDITOR38_5AD_ROCKY_MOUNT_1780 |
| B38-S-Z026 | EDITOR38_5AD_FISHING_CREEK_1780 |
| B38-S-Z044 | EDITOR38_5AD_RICHMOND_JAMES_1781 |

一个GIS图元可以代表一组旧证据，而在两个河口不能用单点替代条约实际许可区。本批对同一财政、航线、民族政治或战地旧框全部保留源档案。资料地图工具不增加实色英国主权面，历史面积统计仍为null，未知边线虚线或不画。

## 权威来源与地理底图

1. 美国国会图书馆：[Faden 1787年一手地图，含1783和1786条约摘录](https://www.loc.gov/item/86692594/)；[2026年馆方历史地图解读](https://blogs.loc.gov/maps/2026/03/founded-in-the-forest-mapping-the-history-of-belize/)；[历史地图扫描](https://www.loc.gov/resource/g4820.ct008414/)。
2. [美国国务院历史文件（1783年条约原文）](https://history.state.gov/historicaldocuments/frus1939v05/d265)；[1773—1775年1763皇家公告线政策概览](https://history.state.gov/milestones/1750-1775/proclamation-line-1763)。
3. [加拿大公园局York Factory历史](https://parks.canada.ca/lhn-nhs/mb/yorkfactory/culture/histoire-history)；[加拿大历史河流海斯河](https://chrs.ca/en/rivers/hayes-kisipikamawi-river)；仓内已审[第5Z批真实河道来源](18C_5Z_WATERWAYS_SOURCE_TRACING.md)。
4. [印度坦贾武尔县官方1799英方历史](https://thanjavur.nic.in/british-history/)；[英国图书馆印度公文档](https://searcharchives.bl.uk/catalog/040-000004729)；[英国国家陆军博物馆EIC军队专题](https://www.nam.ac.uk/explore/armies-east-india-company)。
5. [美国国家公园局独立战争南部战场年表](https://www.nps.gov/cowp/learn/historyculture/revolutionary-war-timeline.htm)；[罗基芒特原址纪念碑及经纬度](https://www.hmdb.org/m.asp?m=228191)；[菲兴溪纪念碑](https://www.hmdb.org/m.asp?m=253482)。
6. [牙买加国家图书馆英属西印度群岛反抗编年](https://nlj.gov.jm/history-notes/Chronology%20of%20Resistance%20in%20the%20British%20West%20Indies.pdf)；[费东起义历史研究](https://www.cambridge.org/core/journals/americas/article/abs/island-of-grenada-in-1795/8A57445A2A9AFEDC7E95EC4A6D65FFEC)。

## 技术文件、验收门禁及下一批

- GIS：`data/eighteenth-century-editor38-5ad-treaties-waterways-sites.geojson`，保留各源网址、精度、断续线、时期与禁用面积字段。
- 浏览器：`js/eighteenth-editor38-5ad-geography.js`，使用18C正式host、图层开关、读者文案清洁、史料点击侧栏、桌面实时年份；`app.js`四个render点和`index.html`均已挂载。
- 静态测试：`scripts/test_editor38_5ad_treaties_waterways.js`，要求25个稳定替代ID、旧source与sites保留、26点+1线、顶点与5Z源河网严格深度相同、1783/1786日期、1799与1800接续。
- 浏览器测试：`scripts/browser_editor38_5ad_treaties_waterways.cjs`，实测纪年、读者点击、地理入库和历史文案；CI `.github/workflows/editor38-5ad-treaties-waterways.yml`，还跑前批兼容、严格式语义审计与世纪接缝。
- 上线后再实点[1783伯利兹](https://1959124923wyz-sys.github.io/love-British-TV/?year=1783)、[1786年](https://1959124923wyz-sys.github.io/love-British-TV/?year=1786)、[1799财税](https://1959124923wyz-sys.github.io/love-British-TV/?year=1799)、[1800年河湖](https://1959124923wyz-sys.github.io/love-British-TV/?year=1800)。

**第5AE批继续调查并保留未决旧框**：1763阿巴拉契亚公告线`B36-Z023/Z024`须查原法条对应分水岭、历史配准；哈德孙湾海路`B38-H-Z007`、赫恩/Matonabbee具体旅行`Z016`及HBC纸面特许`Z025`禁止画假海路和英属主权面；伯利兹1783/1786先配准Faden历史地图并点检河口、Black Creek与New River不同地名；印度库格、尼尔吉里辖界`B36-Z088/093`先核条约图档；美国南部`B38-S-Z022/033/048`需更细军图；牙买加1791—1792普遍动荡与圣文森特加里富纳地区原始事件拆独立政治体，不拿旧范围当精确控制面。地图目前只承诺源证支持的对象。
