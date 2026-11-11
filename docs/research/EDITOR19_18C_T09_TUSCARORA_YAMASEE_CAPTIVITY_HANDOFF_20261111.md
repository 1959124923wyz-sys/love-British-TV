# 主编19第二十一批｜T09 英国卡罗来纳殖民掳奴贸易、Tuscarora堡垒焚毁与Yamasee反抗

编审日期2026-11-11。分支 `map/18c-t09-tuscarora-yamasee-indigenous-enslavement-1702-1732-20261111` 直接继承第20批PR #315。18世纪内容全部仅研究试阅，正式main不变。

## 一、已复用GitHub既有研究

- 主编15现存 `research/18c/consolidated/series/T09.json`：5个合并研究组、9个原始候审ID、9个原A来源键。
- 原始ZIP（内含A Round8及注册来源）、完整1126条原档去向、315条候审去重、162事件组及前辈原始ID不作更改。
- 前任主编9的 `docs/research/EDITOR9_E6_T09_CAROLINA_20261024.md`、已发表17世纪 `E6-T09-CAR` 为历史控制和奴役贸易前史基线。1663/1665纸面特许、Westo掳奴贸易、Kussoe土地契据须与1712/1715本批案件明确延续；没有更可靠的边界依据，不将新研究事件反推成英方全面领土。
- 第20批 `E18-T11-VIRGINIA-NEWYORK-STONO-SLAVERY-1702-1741` 为制度连续专题，本批新文建立双向历史阅读关系。

## 二、正式研究内容（仅候审）

- 23条具年份历史事件、32条来源注册、23章69段完整中文专题、23个 `[[事件ID|中文自然叙事]]` 互动与23项按历史主体分类的控制过渡；所有事件在年轴内单击定位、双击档案与返回。
- 1702—1707：英国贸易商债务压榨及1707贸易委员会监管失败；东南部原住民政治主体独立。
- 1710—1711：英属殖民聚落伸入Tuscarora传统地区；Tuscarora战士1711年袭杀殖民居民的事实保留归责。
- 1712：英国殖民将领John Barnwell及原住民盟军攻Narhantes与Catechna，接受和谈后在Fort Barnwell诱捕原住民并将其送往南卡奴隶市场；北卡州DNCR官方历史标记提供完整的暴力及地点叙述。
- 1713：James Moore南北卡民兵及原住民盟军围攻Nooherooka，焚毁堡垒。北卡官方记392人在堡内遭焚死/杀死、另558人被杀或俘，**950为死与俘合计**；整个战争约1000人被贩卖为奴、逾3000流离失所是另一组跨战争估计，不重复计为当日死亡。
- 1715：Yamasee首领在Pocotaligo因殖民商人盘剥、土地侵占与被掳人口贸易发动反抗。Yamasee攻击贸易商及英国殖民农场造成平民死亡，英方Craven殖民民兵亦杀伤并驱赶原住民；交战双方与原住民盟国分别记名。国家公园局资料指出在战争报复中英国焚毁Ocmulgee Town，但尚未核准该事件的准确日，因此不据来源无具体年份推演周年日及疆域。
- 1716—1718：英国殖民政府收回印第安贸易控制、争取部分Cherokee助战、Yamasee与其他原住民迁移。官方资料对战争实际收束1717或政府宣布结束1718有不同表述，分别记录。
- 1723：北卡殖民地法律明确规定获释者须六个月内离境；被迫回境者可能被拘捕并在公开竞卖中被迫劳动七年。依据UNB法律文本原文，未将立法直接视为已发生的个体判决。
- 1732：乔治亚王室特许仅作政治声索与殖民延续的研究节点，不涂满原住民土地。

## 三、源档审计：不强迫把不确定候审做成事实

主编15的9条原候审记录全部保留原文来源指针。**其中8条已作为具年Atlas事件直接纳入，1条 `E18A2-TUS-FEBTREATY` 原记1715年2月和约，但暂未取得签署主体、条约全文、准确签约日支持，留在原ZIP与crosswalk并在本数据集中注册 `deferred_original_ids`；不将其造为确定历史事件。** 专项审计验证8+1=9以及全部9个A注册来源真实存在于原ZIP。

Original registry keys: A:R15、A:R16、A:R17、A:R14、A:S73、A:N39、A:V6002、A:V310、A:V312。

## 四、现代参考地理及严格GIS

- 使用NOAA现代New Bern城市河口代表坐标35.10816,-77.03449与GeoNames Charleston 32.77632,-79.93275；共有4个具城市/行政地名的年代事件使用参考位置，非确切战地。
- Tuscarora的Narhantes、Catechna、Nooherooka与Yamasee的Pocotaligo、Port Royal区域虽有官方历史位置文字，其战时精确GPS/营垒测绘未充分核准；维持null，没有虚构定位。
- 0新英国历史实际控制Polygon、0从战斗点推导的占地面积、0虚构贩奴航线、0未核财产收益或精确死亡数字。
- 政治主体：英属卡罗来纳殖民政府、独立Tuscarora与Yamasee社群、与英军结盟的其他原住民政治主体、西属佛罗里达收留幸存者分别记录。

## 五、交互、发布、独立验收

- 在 `?review18c=1` 模式注册第二十一篇 `E18-T09-TUSCARORA-YAMASEE-INDIGENOUS-CAPTIVITY-1702-1732`；保留完整20篇旧研究专题及16、17世纪原网页行为，不增加浮动目录或手机端工作。
- 必须运行 `node scripts/test_18c_t09_tuscarora_yamasee_map.js`、`python3 scripts/audit_18c_t09_original_A_sources.py`、所有前20篇静态脚本及 `python3 scripts/audit_spatial_semantics.py --strict`。
- 真1780×1020 Chromium须经过21篇研究阅读器、年度切换、城市级定位、双击历史档案与返回、16世纪旧事件及无预览时的研究信息隔离。
- 完整GitHub Actions三个专项job latest SHA 全成功后才可写最终通过。PR保持Draft，正式main不得自行合并。

## 六、可继续研究的档案

- 北卡档案馆Barnwell `North Carolina Historical Review`及私人信件（原档原页需进一步核）、1712纳入奴隶贸易的逐人名单和私人贩售记录。
- 1715年2月Tuscarora和约原登记（暂仅有前人候审ID，未发现核验原件）。
- 1713 Nooherooka 392/558的死亡与被俘比例、考古现场地籍和时间轴。
- Yamasee贸易账本、被掳女子与儿童去向、贸易官私人贿赂/地契、殖民军作战日记。
- 1715—1718英殖民者烧毁Ocmulgee的具体年月、Cherokee-Creek谈判原卷、西属佛罗里达收容名册。
- 1723北卡自由人法规逐份落实判案与是否真的出售为劳役7年，后续法律废止年份。

## 七、可公开查阅的来源登记（源键与阅览深度分开）
- 18CT09-ORIG-R15：主编15原A注册键 A:R15（原T09合并组层级的公开资料入口；非逐键独立核原件）；https://www.ncpedia.org/american-indians/tuscarora（核对等级：editor15_A_registry_preserved_group_level_source_url_not_individually_verified）
- 18CT09-ORIG-R16：主编15原A注册键 A:R16（原T09合并组层级的公开资料入口；非逐键独立核原件）；https://www.ncpedia.org/american-indians/tuscarora（核对等级：editor15_A_registry_preserved_group_level_source_url_not_individually_verified）
- 18CT09-ORIG-R17：主编15原A注册键 A:R17（原T09合并组层级的公开资料入口；非逐键独立核原件）；https://www.ncpedia.org/american-indians/tuscarora（核对等级：editor15_A_registry_preserved_group_level_source_url_not_individually_verified）
- 18CT09-ORIG-R14：主编15原A注册键 A:R14（原T09合并组层级的公开资料入口；非逐键独立核原件）；https://www.ncpedia.org/american-indians/tuscarora（核对等级：editor15_A_registry_preserved_group_level_source_url_not_individually_verified）
- 18CT09-ORIG-S73：主编15原A注册键 A:S73（原T09合并组层级的公开资料入口；非逐键独立核原件）；https://www.scencyclopedia.org/sce/entries/yamassee-war/（核对等级：editor15_A_registry_preserved_group_level_source_url_not_individually_verified）
- 18CT09-ORIG-N39：主编15原A注册键 A:N39（原T09合并组层级的公开资料入口；非逐键独立核原件）；https://www.scencyclopedia.org/sce/entries/yamassee-war/（核对等级：editor15_A_registry_preserved_group_level_source_url_not_individually_verified）
- 18CT09-ORIG-V6002：主编15原A注册键 A:V6002（原T09合并组层级的公开资料入口；非逐键独立核原件）；https://slaveryandfreedomlaws.lib.unb.ca/laws/north-carolina-1723（核对等级：editor15_A_registry_preserved_group_level_source_url_not_individually_verified）
- 18CT09-ORIG-V310：主编15原A注册键 A:V310（原T09合并组层级的公开资料入口；非逐键独立核原件）；https://www.georgiaencyclopedia.org/articles/history-archaeology/trustee-georgia-1732-1752/（核对等级：editor15_A_registry_preserved_group_level_source_url_not_individually_verified）
- 18CT09-ORIG-V312：主编15原A注册键 A:V312（原T09合并组层级的公开资料入口；非逐键独立核原件）；https://www.georgiaencyclopedia.org/articles/history-archaeology/trustee-georgia-1732-1752/（核对等级：editor15_A_registry_preserved_group_level_source_url_not_individually_verified）
- 18CT09-NC-FORTB：北卡文化与自然资源厅｜Fort Barnwell、1712年战斗与议和后抓捕；https://www.dncr.nc.gov/blog/2023/12/07/fort-barnwell-c-32（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-NC-CATECHNA：北卡文化与自然资源厅｜Catechna原住民堡垒与1712围攻；https://www.dncr.nc.gov/blog/2023/12/14/catechna-f-36（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-NC-TORHUNTA：北卡文化与自然资源厅｜Torhunta遭破坏；https://www.dncr.nc.gov/blog/2023/12/18/torhunta-f-38（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-NC-NEOHEROKA：北卡文化与自然资源厅｜Nooherooka堡垒与伤亡俘虏；https://www.dncr.nc.gov/blog/2023/12/14/nooherooka-f-37（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-NC-1713：北卡文化与自然资源厅｜1713年Nooherooka陷落；https://www.dncr.nc.gov/blog/2016/03/23/culminating-battle-tuscarora-war-1713（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-NCP-TUS：北卡州立图书馆NCpedia｜Tuscarora战争与战俘奴役；https://www.ncpedia.org/nooherooka-tuscarora-war（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-NCP-PRIMARY：UNC历史教育｜von Graffenried记录与New Bern土地侵夺；https://www.ncanchor.org/anchor/primary-source-christoph-von（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-SC-TUS：南卡大学South Carolina Encyclopedia｜Tuscarora战争、Barnwell破坏议和；https://www.scencyclopedia.org/sce/entries/tuscarora-war/（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-SC-YAM：南卡大学South Carolina Encyclopedia｜Yamasee战争与英商债务；https://www.scencyclopedia.org/sce/entries/yamassee-war/（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-NCP-YAM：北卡州立图书馆NCpedia｜Yamasee战争与殖民军事报复；https://www.ncpedia.org/yamassee-war（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-SC-TRADE：南卡大学｜贸易委员会及1716战后垄断；https://www.scencyclopedia.org/sce/entries/commission-of-indian-trade/（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-NPS-MUS：美国国家公园局｜1715战争中英方焚毁Ocmulgee社群；https://www.nps.gov/ocmu/learn/historyculture/the-muscogee-nation.htm（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-NPS-GEORGIA：美国国家公园局｜Carolina奴隶贸易、Yamasee与Cherokee政治分歧；https://www.nps.gov/orgs/1539/the-southeast-chronicles-ninety-six-national-historic-site.htm（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-NPS-FRED：美国国家公园局｜Yamasee逃往西属佛罗里达；https://www.nps.gov/fofr/learn/historyculture/the-people-before-frederica.htm（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-NPS-PULASKI：美国国家公园局｜殖民原住民奴隶贸易与战后西迁；https://www.nps.gov/orgs/1539/the-southeast-chronicles-fort-pulaski-national-monument.htm（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-UNB-1723：新不伦瑞克大学殖民法律资料库｜1723年自由人驱逐及再奴役法全文；https://slaveryandfreedomlaws.lib.unb.ca/laws/north-carolina-1723（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-GA-1732：New Georgia Encyclopedia｜1732托管地特许；https://www.georgiaencyclopedia.org/articles/history-archaeology/trustee-georgia-1732-1752/（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-LOC-1732：美国国会图书馆｜1732英王特许与殖民早期；https://www.loc.gov/classroom-materials/united-states-history-primary-source-timeline/colonial-settlement-1600-1763/georgia-colony-1732-1750/（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-GEO-CHARLES：GeoNames：现代Charles Town/Charleston参考坐标32.77632 -79.93275；https://www.geonames.org/4574324/charleston.html（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-NOAA-NEWBERN：NOAA：现代New Bern城市河口代表坐标35.10816 -77.03449；https://tidesandcurrents.noaa.gov/benchmarks/8654812.html（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-NPS-NOO：北卡州历史标记显示Nooherooka在Greene县，位置未作为精准GPS入图；https://www.dncr.nc.gov/blog/2023/12/14/nooherooka-f-37（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-SC-NATIVE-SLAVERY：Nebraska University Press：William Ramsey《Yamasee War》学术图书；https://www.nebraskapress.unl.edu/nebraska-paperback/9780803232808/the-yamasee-war/（核对等级：institutional_public_history_or_edited_primary_statute_examined）
- 18CT09-NPS-TRADE：美国国家公园局｜鹿皮、枪械与原住民人口贸易背景；https://www.nps.gov/orgs/1539/the-southeast-chronicles-fort-pulaski-national-monument.htm（核对等级：institutional_public_history_or_edited_primary_statute_examined）

## 研究网页
https://raw.githack.com/1959124923wyz-sys/love-British-TV/map/18c-t09-tuscarora-yamasee-indigenous-enslavement-1702-1732-20261111/index.html?review18c=1&year=1715
