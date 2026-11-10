# 主编18｜第十二批 1795英国开普入侵与1799 Khoikhoi、Xhosa土地剥夺战争地图

**2026-11-10｜T25｜分支 `map/18c-cape-1795-khoekhoe-xhosa-resistance-1799-20261110`；基于主编17马尼拉第十一批Draft PR #301；仅研究试阅`?review18c=1`，不得自动发布正式main。**

## 01. 史料方法：英国殖民军事行动、原住民受害与抵抗放在中心

用户要求此后的历史研究突出英国人在扩张过程中的烧杀掳掠、殖民强制、夺地、奴役、镇压。**本批拒绝把荷兰时期早已有的每次农场侵地都写成英国军从1795新创造的行为，也拒绝把布尔移民、Khoikhoi、Xhosa当成一个反英阵营**。核心事实是1795英国用海军舰炮攻夺VOC殖民港与政府，1799英国军队在东部边疆镇压一场布尔移民叛乱之后，又卷入Khoikhoi和Xhosa为保护牧地、牲畜和劳动自由的反抗战争；英国军在当地遭袭，最终与部分社群妥协。

1795年东部原住民仍拥有政治生活空间；1799年Gqunukhwebe/Xhosa部分居民仍保有Bushmans、Sundays Rivers、Zuurveld附近的地方管辖。**不把荷兰VOC交城和英国战场到达点转化成现代整个南非或全西开普的英国主权色块。**

## 02. 从主编15 T25原档逐件归并（不可破坏原315映射）

原始 `research/18c/consolidated/series/T25.json` **3合并组、8原候审ID、8个助手B原来源键**，原完整归档 `COMPLETE_1126_ARCHIVE_CROSSWALK.csv` 及全部ZIP继续保留。

| 原研究合并组 | 真实原始ID | 经过核实的年份与对应新事件 |
| --- | --- | --- |
| `E18-MRG-T25-01` | `AB-NEW-046-001`, `AB-NEW-046-002`, `AB-NEW-046-003`, `AB-E06-001` | 1795 Simon’s Bay英舰、8月7日Muizenberg英舰炮击、9月16日VOC投降、英国开普海港行政权转移 |
| `E18-MRG-T25-02` | `AB-F5-ZA-001`, `AB-F5-ZA-002` | 1799年Graaff-Reinet布尔移民起义和英国Vandeleur军镇压 |
| `E18-MRG-T25-03` | `AB-F5-ZA-005`, `AB-F5-ZA-006` | 1799 Gqunukhwebe战士阻击英军、英国允许部分Xhosa继续居留Zuurveld |
| **纯学术及馆藏增补（9件）** | `research_original_record_ids:[]`、`research_merge_group_id:null` | 1795英国扣船、Pandoer反击与薪饷抗议；1799 Khoikhoi牧地和劳动剥夺、联盟抵抗、英军解械、Ferreira农场交战及Stuurman谈判 |

8个原B source键：**BS38, BS74, BS167, BS168, BS170, BS173, BS200, BS201**。`scripts/audit_18c_cape_source_registry.py`必须直接打开保存的原始ZIP内`18c_consolidation/SOURCES_B.json`并核全部8键的真实存在；20项登记来源为8旧注册键和12新机构佐证。历史原候审事件年份与所属合并组相同，绝不捏造原记录。

## 03. 实际GitHub成果与QA

| GitHub文件 | 内容 |
| --- | --- |
| `data/stories/serial/chronology-preview-cape-1795-1799.json` | **17条具年史事、20登记史料**，现代参考事件点5处、12件GPS空白，0古殖民边界Polygon，0假军路 |
| `data/stories/serial/e18-t25-cape-invasion-khoekhoe-xhosa-1795-1799.json` | **19章57段完整中文专题、17个真实`[[E18C-CAP-...|自然语言动作]]`正文地图导航** |
| `data/stories/serial/preview-18c-index.json` | 前11篇不变，加入第12篇，可从已发表17C东印度公司故事进入相关研究续篇 |
| `research/continuity/1795-1799-cape/BRITISH_INVASION_INDIGENOUS_TERRITORIAL_TRANSITIONS.json` | **17项**英军/VOC/布尔移民/Pandoeren/Khoekhoe/Xhosa分别记名的军事、地权、工资及谈判状态，0实际英国殖民疆域面 |
| `scripts/test_18c_cape_khoekhoe_xhosa_map.js` | 对T25 3原组合并、8原始ID、8原B源、17史实、5现代GPS、19章57段、17互动和无浮动目录／无虚构控制面做严格静态检查 |
| `scripts/audit_18c_cape_source_registry.py` | 直接以保留ZIP审计B来源键并输出对应原始目录证据 |
| `scripts/browser_18c_cape_khoekhoe_xhosa.py` | 真桌面1780×1020：开普英军Muizenberg炮击专题→Simon’s Bay→Muizenberg→1799 Graaff-Reinet→Khoikhoi受害→Zuurveld无GPS及档案双击返回；重复目录消失；正常已发布16C地图不受影响 |
| `.github/workflows/18c-cape-khoekhoe-xhosa-map.yml` | 第12篇源/GIS、前11篇回归、真桌面Chrome全集及截图；GitHub静态代理HTML/JS/CSS与研究JSON实际HTTP探测 |

**全站长篇的浮动“章节目录／已读百分比／回到开头”已依用户指令从公共阅读器永久删除**（主站PR #300于2026-11-10完成发布）；本批复用此实现，不得回滚旧阅读器。

## 04. 几个必须保留的争议与纠偏

1. **1795年VOC向英国降服与其先前侵地不可混计**。南非政府明确记载英国1795接管开普以确保通往印度的海上航路，原荷兰东印度公司奴役和农场扩张始于1652年后。
2. **1795年6月Simon’s Bay登陆阶段**：英国舰队进驻False Bay后对VOC船只及补给施压，在Muizenberg战役前获得当地海岸登陆据点。旧文献对英国扣押具体船只日期存在不同记录，保持主图1795年、不杜撰统一日。
3. **1795年8月7日Muizenberg炮击**：开普敦市政府2026年确证海岸保有原胸墙与防御遗址、Khoekhoe和混合血统Pandoeren曾参与防卫。**2026年受保护地籍不是1795年全部战阵及当年英国军事占地范围**。
4. **8月8日、9月1日Pandoeren作战及待遇抗议**：来自Tydskrif vir Geesteswetenskappe 2020年学术文章，有具体军事行动及VOC对本地士兵待遇不公记载。Pandoeren反击英军与其随后对VOC不满同时成立。
5. **9月16日Cape VOC政府投降**：与8月7日英军炮击属于两件不同军事政治事件，不可同一天涂全Cape独占。
6. **1799年Graaff-Reinet布尔叛乱**：英国军首次压制的是荷兰裔殖民农场移民叛乱，不能直接写成英军正面消灭整个Xhosa。Khoikhoi/Xhosa对土地、牲畜、强制劳工的反抗，与布尔人向英国政府索求农场权利的争议不同。
7. **1799年Khoikhoi牧地和牲畜损失**：南非共和国政府原住民历史明确将其与1799集体反抗联系起来；分地区损失账和英国军在其中的直接责任需另外核对。
8. **1799年英国解除部分Khoikhoi武装**：南非军事史学会记载一些被解除武装者后来加入Xhosa武装；同一时期英军仍有Khoikhoi侦察和士兵，不能把所有族群成员涂为一个交战阵营。
9. **1799年Gqunukhwebe伏击Vandeleur与和议**：Denver Webb 2014同行评议论文确认当事英军在Gamtoos River一带遇伏，并记1799年达成妥协，Gqunukhwebe和部分Khoikhoi社群仍留居其土地。原伏击具体位置、伤亡统计未经原军报核查，空GPS。
10. **17—19世纪疆域不可代画**：南非政府区分英国1795第一次占领、1802 Amiens、1803短期交还巴达维亚政府和1806第二次入侵。后面19世纪历史必须另写，不能从1799故事假定永久英国直接占领。

## 05. 明确地理可信等级

- 1795 Simon’s Town：Stats SA现代城镇中心 **[-34.1782,18.4202]**，两件1795事件宽域标记。
- 1795 Muizenberg：SA History Online史迹登记地名 **[-34.1130,18.4650]**，一件炮击史事实地指引；2026省遗产保护地籍与1795历史阵位不同。
- 1799 Graaff-Reinet：SA History Online现代镇区中心 **[-32.2490,24.5320]**，1799布尔起义和英军进城两件年度点。
- 其他12条包含Pandoeren战地、Khoikhoi农场/牧道、Gamtoos伏击、Zuurveld谈判、Sundays River生活空间全部`lat:null`。0新殖民控制Polygon、0虚构登陆/军路及牲畜数量；无可信古边界时只允许将来有据的淡色虚线研究区，不写英国当年全省土地面积。

## 06. 主要权威来源链接

- [南非共和国政府 History：1652 VOC、奴役制度、1795英军占领](https://www.gov.za/about-sa/history)
- [南非共和国政府原住民历史表彰：1799牲畜牧场剥夺与抗争](https://www.gov.za/about-government/appendix-indigenous-systems-awards)
- [开普敦市政府2026年Muizenberg战地保护](https://www.capetown.gov.za/media-and-news/city-secures-battle-of-muizenberg-site-as-a-provincial-heritage-site/)
- [Tydskrif vir Geesteswetenskappe (2020)：Corps Pandoeren 1793—1795](https://scielo.org.za/scielo.php?pid=S0041-47512020000100013&script=sci_arttext)
- [Scientia Militaria (2014)：The Third War of Dispossession and Resistance in the Cape, 1799—1803](https://scientiamilitaria.journals.ac.za/pub/article/view/1094)
- [South African History Online：Eastern Cape Wars of Dispossession](https://sahistory.org.za/article/eastern-cape-wars-dispossession-1779-1878)
- [South African Military History Society：Khoikhoi士兵及1799战事](https://www.samilitaryhistory.org/vol035jd.html)
- [Nationaal Archief VELH319 1795开普战役旧版图（1806后绘）](https://www.atlasofmutualheritage.nl/page/2798/map-of-the-battle-of-muizenberg)
- [南非统计局Simon's Town地名点](https://www.statssa.gov.za/?id=343&page_id=4286)
- [SA History Online Muizenberg遗址现代GPS](https://sahistory.org.za/place/battle-muizenburg-monument-muizenburg)
- [SA History Online Graaff-Reinet现代GPS](https://sahistory.org.za/place/graaff-reinet)

## 07. 网页与交接

研究预览（需后续Actions真正HTTP验证后才能宣布可访问）：

`https://raw.githack.com/1959124923wyz-sys/love-British-TV/map/18c-cape-1795-khoekhoe-xhosa-resistance-1799-20261110/index.html?review18c=1&year=1795`

正式主站仍为 <https://1959124923wyz-sys.github.io/love-British-TV/>，不自动合并12个18世纪研究专题。后续建议从T26/T27西非奴役贸易和塞拉利昂土地争夺入手，优先源于被奴役者、土地占有人、抵抗者的事实，并继续保持年度时空和可查来源的准确性。
