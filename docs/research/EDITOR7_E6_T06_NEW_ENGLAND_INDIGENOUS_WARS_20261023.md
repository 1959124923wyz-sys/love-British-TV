# 爱英TV｜E6-T06 新英格兰原住民战争与战俘奴役：出版审查及接手（2026-10-23）

## 研究范围及出版对象

- 母专题 `E6-T06`：`1620—1679年新英格兰：皮阔特战争、梅塔科姆战争与原住民战俘奴役`。
- 叙事 `data/stories/serial/e6-t06-new-england-indigenous-wars.json`：12节、11条可追溯公开来源、12条主张审查记录、34处正文金色地图事件链接（33个不同正式Atlas事件ID），均采用 **事件动作而非裸年份** 作为链接语句。
- 独立政治主体：Pequot、Mohegan、Narragansett、Pokanoket/Wampanoag各社群，英格兰普利茅斯、马萨诸塞湾、康涅狄格及罗德岛殖民当局。**不等于单一原住民联盟**；Pequot War 1636–1638与Metacom/King Philip's War 1675–1678分开叙述。
- 殖民者声索、原住民土地实际处分、战争影响、殖民法院劳动法、战俘外卖，必须明确分开。1637屠杀和1675大沼泽袭击不能自动推定当地整片政治疆域发生转移。1676年Metacom死亡也不是东北战争或原住民生存史的自然终点。

## 文献实证及使用深度

| 编号 | 来源 | 本次实际核查与局限 |
| --- | --- | --- |
| NE01 | Mashantucket Pequot Tribal Nation, [History](https://www.mptn-nsn.gov/history/) | **部族机构第一方自述**，米斯蒂克屠杀、1638条约、1651/1666重居和部族生存；≠每笔殖民地地契全文 |
| NE02 | Mashantucket Pequot Museum / Connecticut History, [Connecticut Declares War Against the Pequot](https://connecticuthistory.org/connecticut-declares-war-against-the-pequot/) | 部族博物馆研究型公共史，1636–1637战事和参加政治主体 |
| NE03 | 同机构，[Slavery and the Pequot War](https://connecticuthistory.org/slavery-and-the-pequot-war/) | 俘虏处置、跨大西洋强迫运输；绝不将一项航海联系当具体船的GPS航迹 |
| NE04 | Connecticut State Department of Education, [Eastern Pequot history](https://portal.ct.gov/sde/publications/teaching-native-american-studies/eastern-pequot-tribal-nation/eptn-history?archived=true) | 州教育来源所载部族历史，分散的幸存者与战后剥夺 |
| NE05 | US National Park Service, [King Philip's War](https://www.nps.gov/rowi/learn/historyculture/kingphilip.htm) | 官方公共史，Narragansett中立与难民、大沼泽、1676反攻；事件死亡数字为估算，未重建伤亡登记 |
| NE06 | 同机构，[Roger Williams Memorial chronology](https://www.nps.gov/rowi/learn/historyculture/rowi-timeline.htm) | 1620/1675/1676政治过程简年表；1676不等于17世纪所有冲突结束 |
| NE07 | Colonial Society of Massachusetts, [The Changing Nature of Indian Slavery in New England, 1670–1720](https://www.colonialsociety.org/node/1397) | 同行学术史研究支持普利茅斯178人送往加的斯、女性和儿童服役、战俘法律；**仅该船次178人，不能扩展成战争总人数** |
| NE08 | CTHumanities, [Pequot War](https://connecticuthistory.org/topics-page/pequot-war/) | 地方公共史专题，战事与政治压迫 |
| NE09 | CTHumanities, [Connecticut settlement timeline](https://connecticuthistory.org/timeline-settlement-of-the-colony-of-connecticut/) | 河谷殖民城镇与塞布鲁克堡背景 |
| NE10 | US Library of Congress, [Benjamin Church historical edition](https://www.loc.gov/item/02013756/) | 已读**馆藏版本说明**（1827年后世编辑版）；并未把它冒称17世纪原稿逐页核阅 |
| NE11 | CTHumanities, [Edward Hopkins and Hartford Treaty](https://connecticuthistory.org/edward-hopkins/) | 辅助1638年条约时间与殖民政治主体 |

**未冒称已核实的资料：**英国或殖民政府的全部海运逐船账册、战争全部伤亡名册、部族祖地原始封界、全部17世纪地契和战俘案件正本、现代定位点所对应的战场考古边线。条例允许惩罚、出海的授权 ≠ 已确证实际对每个当事者执行。

## 地图交付

- `data/seventeenth-century-spatial-evidence-1600-1699.geojson` 从51增加至**61个**非主权辅助参考点，新增10项：1636塞布鲁克、1637米斯蒂克、1638哈特福德条约、1666 Mashantucket 重居、1675大沼泽袭击、1675普利茅斯俘虏输出、1676普罗维登斯驱离/财产处分、1676 Uncas庇护、1677 Scinnae家属请愿、1679 Sassamon家属继续求释。**全部使用正式Atlas所载同ID年份的现代参考坐标，而非本轮猜测的历史地理点位**。
- `data/seventeenth-century-regional-studies-1600-1699.geojson` 从18增至**19个**；新增单一浅红虚线 **1637年塞布鲁克—米斯蒂克两具名战场阅读示意面**，其闭合边线完全为地图观看而设，不推论范围内每处遭战争或英国统治。保留13个虚线Polygon、6条非GPS关系LineString。严格标记 `historical_boundary_confirmed:false`, `fill_authorized:false`, `territorial_claim:false`, `area_sqkm:null`, `exclude_from_area_aggregation:true`。该图层不得加入任何 `colonial_polygons` 面积计算。
- 1675年纳拉甘西特大沼泽、1677年家属请愿等仅按具名地点落点，**不从单一位置人为生成影响半径**。

## 实际前端导航：保持16世纪程序

已发布 `data/atlas-16xx-16xx.json` 的33个真实历史事件作为新篇入口和正文链接；链接格式 `[[1670S-E017|殖民联军袭击纳拉甘西特大沼泽冬季聚落]]` 等（实际JSON自然语言以核准原文为准）。单击保留文章、切年份并用Leaflet panTo定位；双击进入事件档案，再可返回文章及来源年份。**没有改造事件阅读器，也没有新增页面顶栏按钮**。

## 合并前必测

```bash
node scripts/test_serial_story_contract.js
node scripts/test_editor7_17c_inline_story_map.js
node scripts/test_17c_tudor_parity_20261023.js
node scripts/test_editor7_new_england_major_story.js
node scripts/test_editor6_17c_spatial_batch01.js
node scripts/test_editor7_17c_regional_studies.js
node scripts/test_editor7_rac_story.js
python3 scripts/audit_spatial_semantics.py --strict
python -m http.server 8765 &
python scripts/browser_editor7_new_england_story.py
python scripts/browser_editor7_17c_inline_story.py
```

专用CI `.github/workflows/editor7-new-england-story.yml` 将实际运行Chrome，检查1637入口、1675战争、1677原住民家属请求、1638条约地图平移、1676双击、返回入口年份。旧16世纪文章与之前五篇17世纪故事应保持回归正常。

**留给下一阶段：**面对Pequot/Wampanoag土地旧契和部族地理史时，逐篇核阅档案、补全可测史料边界。只有新的独立土地范围证据才可升级为政治控制面，不得直接将现在示意边界硬转换。
