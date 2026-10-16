# 爱英TV｜专题24／25 研究与交接记录（2026-10-16）

## 正式提交
- `data/stories/le-havre-english-occupation-french-siege-1562-1563.json`：10节、3300+字，10个唯一关联事件，分章交代1562年胡格诺派进城、汉普顿宫条约、英格兰驻军、沃里克堡、驱逐法国居民、法王围城、疫病、撤军。
- `data/stories/john-hawkins-three-atlantic-slaving-voyages-1562-1568.json`：11节、3000+字，19个关联事件，区分三次航次与塞拉利昂抓捕、伊斯帕尼奥拉三港销售、博尔布拉塔及里奥阿查武力交易、1568年村社袭击与圣胡安德乌卢阿海战。
- `data/stories/index.json` 16→18篇，旧专题继续保留。

## 第24篇｜点、面、档案
勒阿弗尔市档案馆1562—63战争记录：
https://archives.lehavre.fr/vie-militaire-et-conflits-depuis-1548
**1563年7月15日沃里克围城图 1FI227：**
https://archives.lehavre.fr/document-archives/plans/plan-dit-warwick-pendant-le-siege-du-havre-15-juillet-1563
该馆注明现见版本为约1880年根据1563年原始地图复制的历史图，图中包括Fort Warwick、旧塔、Notre Dame、Ingouville高地法军阵位等，**没有对其进行GIS配准**，不可从照片复刻精确1570?（应为1563）墙线。

**8个新事件点：**
- `LEH1562-HUGUENOTS-SEIZE` 法国新教徒1562年5月8日夺城。
- `LEH1562-WARWICK-FORT` 英军在珀坎维尔方向修建沃里克堡，现代大概地点坐标，只是具名方位参照。
- `LEH1563-RESIDENTS-EXPEL` 英军驱逐法国居民。
- `LEH1563-INGOUVILLE-FRENCH-CAMP` 法军高地围城营地。
- `LEH1563-NOTREDAME-ARTILLERY` 圣母教堂钟楼用于英军炮位。
- `LEH1563-PLAGUE-GARRISON` 英军疫情、后方补给。
- `LEH1563-LEURE-CHURCH-DESTRUCTION` 英军拆除圣尼古拉教堂和格拉维尔礼拜堂。
- `LEH1563-JULY-SURRENDER` 七月末交城协议。原1560S-E009继续标记法国恢复统治。

在 `data/century-violence-regions-1544-1589.geojson` 新增两片虚线淡色**阅读区域**（原26→28）：1562英军驻守市区研究区域、1563英古维尔法军围攻研究区域。两者不是史料配准的1562占领面积，不可以汇总统计或用现代港区边界代替；已有 `data/eighth-control-sites-1560-1569.geojson` 两个年末控制点仍正确：1562英军、1563起法国。

**时间：**地方档案记录法国王室7月29日收复；其他来源以7月底至8月初撤军和正式入城分述。长篇正文说“7月末谈判和交城”，不制造唯一日。法国1564年后的新城堡不能错误回填为英军已筑要塞。

## 第25篇｜三次航次与点／线
- First 1562–63：Plymouth→Sierra Leone→La Isabela→Puerto Plata→Monte Cristi→England。基于Hakluyt公开原本对**三港顺序**的叙述；原`ch8-1562-63-SIERRALEONE-HISPANIOLA`沿线加入三港锚点；未添加臆测海上途经纬度。
- Second 1564–65：Elizabeth许可王舰Jesus of Lübeck；Plymouth 18 Oct1564→Cap Vert→Guinea→Borburata→Curaçao→Riohacha施压→英国Padstow返抵20 Sep1565。
- Third 1567–68：Plymouth 2 Oct1567→Cap Vert/Rio Grande→Sierra Leone暴力抓人→Dominica 27 Mar1568→Riohacha武力胁迫交易→Cartagena拒绝买卖→San Juan de Ulúa Sep1568英西海战。
- 新增7个地图事件：`HW1563-ISABELLA-SLAVE-SALE`, `HW1563-PUERTO-PLATA-SALE`, `HW1563-MONTE-CRISTI-SALE`, `HW1565-CURACAO-PORT`, `HW1565-PADSTOW-RETURN`, `HW1568-DOMINICA-LANDFALL`, `HW1568-CARTAGENA-REFUSAL`。其他原有事件12条完全保留。
- 高权重来源：Royal Museums Greenwich https://www.rmg.co.uk/collections/objects/rmgc-object-14229；2024年EHR https://academic.oup.com/ehr/article/139/598-599/680/7640954；LOC https://www.loc.gov/collections/sir-francis-drake/articles-and-essays/drake-biography/the-unfortunate-voyage/；Hakluyt transcript https://www.gutenberg.org/files/3752/3752-h/3752-h.htm 与 https://www.gutenberg.org/files/40803/40803-h/40803-h.htm。
- 霍金斯首次“300人”和1568年村落“约250人”仅是英方叙述源证，不当作每港实际售出数量；武力劫人、交易及圣胡安英西海战分别分类，不把塞拉利昂沿岸临时靠泊误算英国政治占领。原 `data/eighth-enslavement-coastal-activity-1560-1569.geojson` 3条淡色/虚线沿岸参考区仍完整。

## 验收
- `scripts/test_lehavre_hawkins_major_stories.js` 检查两篇 >=3000字、事件链接、15条新点、1563阿弗尔控制转换及3个销售港顺序。
- `scripts/browser_lehavre_hawkins_stories.py` 真实Chromium跨年点击/返回与参考资料状态。
- 接入Major history reader和GitHub Pages发布门禁；没有因本批修改改变整个地图的批准UI或扩充历史政治领土。

## 后续专项GIS建议
1. 从勒阿弗尔城市档案原图1FI227在满足版权与参照质量的前提下配准至少3处未被彻底改建的可靠历史地物，经复核后可升级沃里克堡、法军炮位等点的坐标；不要将1880年复制图未经复核直接勾成1563年军区边界。
2. 根据同时代海事文献中的各港实际锚点完善Hawkins 1564—65具体登陆区域；如某一次航次的港口遭遇只在文本讲“岛附近”，保持区域参考，不以现代岸线拟合海上GPS航迹。
