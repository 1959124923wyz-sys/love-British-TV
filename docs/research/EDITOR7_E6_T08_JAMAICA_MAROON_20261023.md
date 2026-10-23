# E6-T08 17世纪牙买加：英军入侵、马龙抵抗、奴役法制与帝国港口（2026-10-23）
## 交付
完整专题 `data/stories/serial/e6-t08-jamaica-conquest-maroons.json`，14章、15项可溯来源、14条论点审查记录、21处有行动语义的正文链接，对应17个唯一十七世纪事件ID（含本次新增6个历史事件），遵照已发布16世纪自然语言链接`[[ID|谁做了什么]]`、单击切年地图镜头、双击档案和返回原专题的阅读逻辑。

## 史料等级与限制
- [牙买加国家图书馆：《The Jamaican Maroons》](https://www.nlj.gov.jm/history-notes/The%20Maroons%20edited%20final.htm)：1655西班牙撤退、泰诺与非洲后裔山地自保、英西争岛约五年及长期马龙抗争的本国研究叙述。该文同时回顾18世纪1739年条约，**不可将后来的乡镇边界回填1655年**。
- [牙买加国家文化遗产信托：本岛英军入侵史](https://jnht.gov.jm/history.php)与[牙买加信息局：Rio Nuevo战场](https://jis.gov.jm/information/jamaica-heritage-sites/st-mary-heritage-sites/)：1655与1658分别为不同阶段。1658碑铭记录6月17日寨垒被夺，战史资料存在月份内交战日差别，事件只注明年份，**现代Rio Nuevo海滩坐标不能误称1658年历史要塞坐标**。
- [皇家历史学会学术研究：1655—1660年西班牙持续抵抗](https://www.cambridge.org/core/journals/transactions-of-the-royal-historical-society/article/abs/spanish-resistance-to-the-english-occupation-of-jamaica-16551660/403DA4CE85C82219630EDB127449A09E)：来源目录与论文研究说明已阅；未逐页核对塞维利亚存档手稿，不编造战斗损失确数。
- 新不伦瑞克大学 `Laws of Enslavement and Freedom in the Anglo-Atlantic World` 完整可读殖民法令：[1661外出票证](https://slaveryandfreedomlaws.lib.unb.ca/laws/jamaica-1661)；[1662奴役惩罚](https://slaveryandfreedomlaws.lib.unb.ca/laws/jamaica-1662)；[1664综合法](https://slaveryandfreedomlaws.lib.unb.ca/laws/jamaica-1664-0)；[1674修订](https://slaveryandfreedomlaws.lib.unb.ca/laws/jamaica-1674)；[1683拘押、财产权与口粮地法](https://slaveryandfreedomlaws.lib.unb.ca/laws/jamaica-1683)；[1696修订](https://slaveryandfreedomlaws.lib.unb.ca/laws/jamaica-1696)；[1699调集追捕军队法](https://slaveryandfreedomlaws.lib.unb.ca/laws/jamaica-1699)。1661法题系后拟，不是手稿原题；1699原件仅据1716年法律汇编抄本，月份日期不可核。法规证明授权/义务，非全年已执行的刑罚、追捕和被奴役人口统计。
- [牙买加1664年起议会记录的馆藏目录](https://loyalist.lib.unb.ca/record/journals-assembly-jamaica-1664-1826)用于定位后续档案，**未冒称完整查阅缩微胶卷**。
- [联合国教科文组织：17世纪Port Royal遗址](https://whc.unesco.org/en/list/1595)证明奴役贸易港、六处堡垒与1692年地震留下的陆上/海下遗存。不把地震当成战斗或英王失去整岛。
- [牙买加官方人物传记：Nanny of the Maroons](https://jis.gov.jm/heroes/nanny-of-the-maroons/)与[牙买加文化遗产信托：Nanny Town](https://jnht.gov.jm/site_nanny_town.php)：其主要斗争在18世纪，Nanny Town约建于1723年；1739年马龙和平条约亦在18世纪。以上用作防止年代错误，**绝不创建1655年南妮镇点位**。
- 1670马德里条约由已有`1670S-E066`可靠专题史源保留，外交承认非17世纪各山地社群的实际臣服证据。

## 新增有据地图档案
1. `data/atlas-1650-1659.json` 新增 `1650S-E090`（1658里奥努埃沃），现代近邻地点`[lng=-77.0137,lat=18.41]`来自牙买加国家环境规划局公开Rio Nuevo海岸坐标，**只作现代沿海地域参考点**；原始寨垒和战场边界未由本篇考古测定。
2. `data/atlas-1660-1669.json` `1660S-E090`（1661法规）；`data/atlas-1670-1679.json` `1670S-E090`（1674法规）；`data/atlas-1680-1689.json` `1680S-E090`（1683法规）；`data/atlas-1690-1699.json` `1690S-E090`（1696法规）及`1690S-E091`（1699追捕）。法律节点都沿用之前正式Atlas中的西班牙镇`[-76.955,17.992]`政治行政中心参考坐标，不冒充每宗案件/奴役者居址。
3. `data/seventeenth-century-spatial-evidence-1600-1699.geojson` 新增13处具名地点与政策参考圈（总数86），包含早期马龙自主、1658军事抵抗、1692港市地震，**不表示有据受影响面积**。
4. `data/seventeenth-century-regional-studies-1600-1699.geojson` 新增1处1658 Rio Nuevo固定年份淡红虚线阅读框（总21研究对象，15个不实测阅读Polygon、6条已有非GPS关系线）；手工边界不等于地表战区、1658英国直接控制区或马龙山地边界。全量数据继续`historical_boundary_confirmed:false`、`fill_authorized:false`、`territorial_claim:false`、`area_sqkm:null`、`exclude_from_area_aggregation:true`。

## QA、编辑协议
- `scripts/test_editor7_jamaica_maroon_story.js`核查整篇、17个真实事件、6条新增Atlas事件的来源/地理语义，Nanny Town/1739条约不倒填，13地点经纬度与Atlas一致，所有年代无实控面积假多边形。
- `scripts/browser_editor7_jamaica_maroon_story.py`实测：1655英军夺岛事件进入14章正文→1658 Rio Nuevo→1674奴役法→1699追逃法→1692皇家港地震；1683法律双击事件档案→文章→返回1655。
- `.github/workflows/editor7-jamaica-maroon-story.yml`与现有八篇17世纪、16世纪德雷克及`python3 scripts/audit_spatial_semantics.py --strict`须通过。
- 不得把网页/法条描述的山地作现代行政分区涂色，不得凭航次贸易授权捏造载奴人数、死亡率或海上航行经纬度。
- 提交合并PR和GitHub Pages部署确认为两项独立证据，均成功才报告上线。

## 下一步地籍原件调查
国家图书馆早期马龙山地地名、17世纪地理证据与本人/家庭名册、1670外交条款、1640s以前泰诺迁居、1661—1699殖民财务数据、Rio Nuevo防御工事考古报告、Royal Port港口货单，需下一批审查。1739以后Maroon条约/南妮军事实录应放18世纪专题，不随意回填17世纪。
