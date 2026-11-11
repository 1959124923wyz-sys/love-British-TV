# 主编19第二十二批｜T08 七年战争、英国军事殖民、Cherokee焚村、Fort Pitt天花毯子和Paxton屠杀

编审时间：2026-11-11。新分支 `map/18c-t08-seven-years-war-cherokee-pontiac-paxton-land-1740-1775-20261111`，严格继承第二十一批Draft PR #316的18世纪研究预览前端与原20批累积作品；正式main不变。

## 一、GitHub现存研究底稿完整继承

- `research/18c/consolidated/series/T08.json` 原编15母题：11合并组、12个原始候审事件、24个A助手来源键，全部一对一转入本批事件并保留原事件ID和合并组ID。
- 原1126逐项档案、315候审/162研究组、原始ZIP与A来源登记绝无修改。32个新事件、50项来源登记、32章96段中文正文，32处一对一Atlas可点击事件ID与32项分年政治控制过渡。现代城市地理参考5处，其他没有历史坐标的事件全部保留空GPS。
- 对接17世纪E6-T10-ACADIA、E6-T09-CAR与已有18世纪Acadia/T09资料。1755驱逐Acadian事件以British行政暴力再说明，地区驱逐汇总人数不跨专题相加。

## 二、核心被害人、作战和原住民政治主体

1. **1740 St Augustine及Fort Mose**：英国总督Oglethorpe的围城、海军炮击、暂占西班牙自由黑人聚居地、自由黑人与西班牙协同反击，7月20日英军撤退分开；勿提前绘佛罗里达英属。
2. **1745—1758 Louisbourg控制断点**：1745年英国新英格兰民兵及皇家海军夺城，1748年条约归还法国，1758年英国再次征服。各时段守军事实不能无间断填色。
3. **1754—1759 Ohio/Acadia/Canada**：1754英属Virginia军越界；1755 Braddock被法国与原住民盟军打败；1755 Beausejour炮击、Acadian英军强制放逐；1758法国自焚Duquesne与英军建Pitt；1759 Niagara驻军易旗、Quebec英军炮击及法军投降，法兰西防御与各原住民社会权利独立。
4. **1759英国直接袭击原住民村庄**：加拿大国防部军事史称Rogers英国游骑兵焚毁Abenaki的Bécancour、约30人遇害、5人被俘，并记被俘者在食物短缺时遭食人暴行。这是加拿大官方军事史的引述，仍需核Rogers军日记，不把它扩大为整个Abenaki被杀总数。
5. **1760—1761 Cherokee焦土行动**：NPS明记Montgomery和Grant正规军攻入原住民村镇、焚毁农田粮食，Cherokee围攻Fort Loudoun并打击撤离英军。分别登记双方暴力与独立主体。
6. **1763原住民军事反抗**：Odawa领袖Pontiac及其他独立原住民盟军围攻Detroit、攻取若干要塞；不能将独立部族议和/盟约绘成英国治理的全部五大湖区域。
7. **1763英方传播天花企图**：史密森博物馆使用William Trent当事人日志与Fort Pitt账单，记英方取天花病院毯子及手帕赠与Lenape谈判代表，试图造成感染。Jeffery Amherst与Henry Bouquet在7月书信里讨论传播天花；实际赠毯行为在6月，通信在7月。**意图和实物交接有证，最终因果传播与被害死亡人数保持null。**
8. **1763 Conestoga屠杀**：Paxton白人殖民暴徒12月14日杀死村中6人、27日攻入Lancaster本应保护Conestoga的设施再杀14人，合计20人。由当代Benjamin Franklin的叙述、美国国家人文基金会核对；行凶者为殖民白人团伙，不能嫁接成英国正规军奉令杀人。
9. **1763—1774土地与贸易主权**：1763巴黎和约只是英法西列强主权外交移交；1763公告未有效阻止定居者越界；1764 Bradstreet暂时和约被Gage否决；1768 Fort Stanwix涉及Haudenosaunee对其他原住民国家领地权利的代表争议；1770 Lochaber原条约列出Cherokee签名与边界条件；1773 Augusta以商贸债务换取Creek/Cherokee历史所谓200万英亩；1774魁北克法不代表英国当年已经统治所有Ohio原住民土地。
10. **1775 Georgia原档突破**：Georgia Digital Library公开的殖民总督会议汇编**1775年3月27日**清楚载明商人针对**1773年6月1日**Creek、Cherokee债务抵地的请求和原文。主编15原ID已从纯候审文献链条取得逐字来源证实，但原手写档案未至馆查阅、地产成交明细继续待核。

## 三、历史地理与统计权限

- 现代Montréal(45.50884,-73.58781)、Detroit(42.33143,-83.04575)、Pittsburgh(40.44062,-79.99589)、Lancaster(40.03788,-76.30551)仅现代具名城市代表点，有GeoNames完整链接。并非1759战场、1763Fort Pitt历史毯子交接地点或Lancaster牢房精确位置。其余堡垒、历史条约线、侵掠路线无依据则lat/lng=null。
- **0英国新增实际控制多边形、0虚构军事路线、0借王室条约面积推导实际英占面积、0无来源直接屠杀死亡估算。** 暂不填实色；待真正历史边界地图及考古原坐标出现才讨论虚线示意。
- `research/continuity/1740-1775-seven-years/BRITISH_WAR_INDIGENOUS_LAND_TRANSITIONS.json`逐条登记军事、殖民外交、独立原住民社群主体，严格 `polygon_allowed:false` 和面积null。
- 1763 Conestoga两次屠杀6+14=20明确实际死亡；1759英国Rogers袭村约30是加拿大军史综述估计；1763天花病院毯子造成的直接死亡人数未知，保持null。

## 四、测试标准与上线边界

- 研究试阅入口 `?review18c=1&year=1763`；32具年事件、32个中文章节、96段正文及32个不同ID一对一相互链接。
- 22篇专题兼容测试、16/17世纪已公开数据回归、原ZIP+1126交叉审计、`scripts/audit_spatial_semantics.py --strict`、实际1780×1020 Chrome单击/双击/年度平移不放大/返回、GitHub公开代理文件响应均纳入独立工作流。
- 独立Draft PR，正式main不动，不恢复动态目录和进度条，也不进行手机端工作。

## 五、后续历史档案缺口

- Rogers 1759原军日记中袭Bécancour日期和幸存者名册，与加拿大国防部二手汇编对照。
- 1760—61 Cherokee各村落焚毁范围、Grant/Montgomery原军令与人口死亡清单。
- Fort Pitt六月赠毯实物及病疫可归因证据；Amherst/Bouquet七月通信全文及与前线实施的时序差异。
- 1763 Paxton州法院处理及殖民政府惩处失职的卷宗。
- 1768 Stanwix与1770 Lochaber原有线条地图配准及不同部族对土地权利的异议。
- 1773 Augusta土地债务的各部族独立谈判文本、逐块地契及受影响居民；1775请愿商人逐人债权账目与真实货币净额。

## 六、已登记来源（含原A键与后续补证的机构入口）
- 18CT08-ORIG-V315：主编15原A来源注册键 A:V315（原合并组所列公开资料入口）；https://home.nps.gov/foma/learn/historyculture/1740-siege.htm（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-V314：主编15原A来源注册键 A:V314（原合并组所列公开资料入口）；https://home.nps.gov/foma/learn/historyculture/1740-siege.htm（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-V319：主编15原A来源注册键 A:V319（原合并组所列公开资料入口）；https://loyalist.lib.unb.ca/record/louisbourg-papers-expedition-1745-1744-1758（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-V320：主编15原A来源注册键 A:V320（原合并组所列公开资料入口）；https://loyalist.lib.unb.ca/record/louisbourg-papers-expedition-1745-1744-1758（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-V318：主编15原A来源注册键 A:V318（原合并组所列公开资料入口）；https://loyalist.lib.unb.ca/record/louisbourg-papers-expedition-1745-1744-1758（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-V5036：主编15原A来源注册键 A:V5036（原合并组所列公开资料入口）；https://www.oldfortniagara.org/the-battle-of-la-belle-famille（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-V5045：主编15原A来源注册键 A:V5045（原合并组所列公开资料入口）；https://www.oldfortniagara.org/the-battle-of-la-belle-famille（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-V5046：主编15原A来源注册键 A:V5046（原合并组所列公开资料入口）；https://www.oldfortniagara.org/the-battle-of-la-belle-famille（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-V5050：主编15原A来源注册键 A:V5050（原合并组所列公开资料入口）；https://www.oldfortniagara.org/the-battle-of-la-belle-famille（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-N30：主编15原A来源注册键 A:N30（原合并组所列公开资料入口）；https://www.canada.ca/en/department-national-defence/services/military-history/history-heritage/popular-books/aboriginal-people-canadian-military/imperial-wars.html（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-N28：主编15原A来源注册键 A:N28（原合并组所列公开资料入口）；https://www.canada.ca/en/department-national-defence/services/military-history/history-heritage/popular-books/aboriginal-people-canadian-military/imperial-wars.html（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-N60：主编15原A来源注册键 A:N60（原合并组所列公开资料入口）；https://history.state.gov/milestones/1750-1775/proclamation-line-1763（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-N31：主编15原A来源注册键 A:N31（原合并组所列公开资料入口）；https://visit.archives.gov/whats-on/explore-exhibits/roots-rebellion（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-N49：主编15原A来源注册键 A:N49（原合并组所列公开资料入口）；https://www.neh.gov/article/benjamin-franklin-and-pamphlet-wars（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-S39：主编15原A来源注册键 A:S39（原合并组所列公开资料入口）；https://www.neh.gov/article/benjamin-franklin-and-pamphlet-wars（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-V6018：主编15原A来源注册键 A:V6018（原合并组所列公开资料入口）；https://www.nps.gov/people/john-bradstreet.htm（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-V6019：主编15原A来源注册键 A:V6019（原合并组所列公开资料入口）；https://www.nps.gov/people/john-bradstreet.htm（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-V301：主编15原A来源注册键 A:V301（原合并组所列公开资料入口）；https://home.nps.gov/articles/000/1768-boundary-line-treaty-of-fort-stanwix.htm（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-V4027：主编15原A来源注册键 A:V4027（原合并组所列公开资料入口）；https://home.nps.gov/articles/000/1768-boundary-line-treaty-of-fort-stanwix.htm（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-R8019：主编15原A来源注册键 A:R8019（原合并组所列公开资料入口）；https://ugapress.manifoldapp.org/read/the-american-revolution-in-georgia-1763-1789/section/dbff0882-9504-416c-90c5-307b74234f53（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-R8020：主编15原A来源注册键 A:R8020（原合并组所列公开资料入口）；https://ugapress.manifoldapp.org/read/the-american-revolution-in-georgia-1763-1789/section/dbff0882-9504-416c-90c5-307b74234f53（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-R8021：主编15原A来源注册键 A:R8021（原合并组所列公开资料入口）；https://ugapress.manifoldapp.org/read/the-american-revolution-in-georgia-1763-1789/section/dbff0882-9504-416c-90c5-307b74234f53（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-R8004：主编15原A来源注册键 A:R8004（原合并组所列公开资料入口）；https://www.nps.gov/waro/learn/historyculture/timeline-of-the-war-for-independence.htm（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-ORIG-R8007：主编15原A来源注册键 A:R8007（原合并组所列公开资料入口）；https://www.nps.gov/waro/learn/historyculture/timeline-of-the-war-for-independence.htm（登记级别：original_A_key_preserved_group_url_not_individually_verified）
- 18CT08-NPS-SIEGE：NPS：1740围攻圣奥古斯丁与7月20日英军撤走；https://home.nps.gov/foma/learn/historyculture/1740-siege.htm（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-NS-LOUIS：Nova Scotia档案：1745 Louisbourg被占、1748法国收回；https://acadien.novascotia.ca/en/timeline（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-PARKS-1755：Parks Canada：1755英军驱逐阿卡迪亚居民；https://parks.canada.ca/lhn-nhs/nb/beausejour/culture/histoire-history/deportation（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-PARKS-BEAU：Parks Canada：1755 Beausejour英国炮击和守军投降；https://www.parcs.canada.ca/lhn-nhs/nb/beausejour/culture/histoire-history/siege-1755（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-NPS-BRADDOCK：NPS：1755 Braddock向Ohio进军；https://www.nps.gov/articles/braddock-campaign.htm（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-FORBES：Mount Vernon：1758法军焚弃Duquesne及英军进堡；https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/forbes-expedition（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-PARKS-REST：Parks Canada：1758 Louisbourg、1759 Quebec、1760法军还击；https://parks.canada.ca/lhn-nhs/qc/ristigouche/culture/histoire-history/contexte（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-PARKS-MONT：Parks Canada：1760 Montreal投降；https://parks.canada.ca/lhn-nhs/qc/fortchambly/culture/histoire-history/site/conquete-conquest（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-OLD-NIAG：Old Fort Niagara：1759年7月25日法驻军投降；https://www.oldfortniagara.org/my-post（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-CAN-INDIG：加拿大国防部：英军袭Abenaki村及原住民盟军独立政治角色；https://www.canada.ca/en/department-national-defence/services/military-history/history-heritage/popular-books/aboriginal-people-canadian-military/imperial-wars.html（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-NPS-CHEROKEE：NPS：1760 Montgomery、1761 Grant毁Cherokee镇村及农作物；https://www.nps.gov/orgs/1539/the-southeast-chronicles-ninety-six-national-historic-site.htm（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-NPS-CHEROKEE-ED：NPS：1760—1761 Cherokee战争与英军焦土行动；https://home.nps.gov/cowp/learn/education/unit-5-the-southern-campaign.htm（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-STATE-PARIS：美国国务院：1763巴黎和约英法领土转移；https://history.state.gov/milestones/1750-1775/treaty-of-paris（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-STATE-PONTIAC：美国国务院：1763 Pontiac起义和1763公告、1774 Quebec Act；https://history.state.gov/milestones/1750-1775/proclamation-line-1763（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-SMITH-POX：史密森国家邮政博物馆：1763 Fort Pitt病院毯子及Amherst通信；https://postalmuseum.si.edu/exhibition/indians-at-the-post-office-murals-conflict/the-battle-of-bushy-run（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-NEH-PAXTON：美国国家人文基金会：Paxton武装杀6+14名Conestoga；https://www.neh.gov/article/benjamin-franklin-and-pamphlet-wars（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-DCB-BRADSTREET：加拿大传记辞典：1764 Bradstreet越权和议被Gage否认；https://www.biographi.ca/en/bio/bradstreet_john_4E.html（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-NPS-STANWIX：NPS：1768 Fort Stanwix、土地代表权及无边界执行；https://www.nps.gov/articles/000/1768-boundary-line-treaty-of-fort-stanwix.htm（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-EV-LOCHABER：Encyclopedia Virginia：1770 Lochaber条约原文；https://encyclopediavirginia.org/primary-documents/the-treaty-of-lochaber-october-18-1770/（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-GEORGIA-ROYAL：New Georgia Encyclopedia：1773债务抵地；https://www.georgiaencyclopedia.org/articles/history-archaeology/royal-georgia-1752-1776/（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-GEORGIA-ELBERT：New Georgia Encyclopedia：1773 Augusta约二百万英亩；https://www.georgiaencyclopedia.org/articles/counties-cities-neighborhoods/elbert-county（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-GA-1775-ARCHIVE：Georgia Digital Library：1775年3月27日总督与议事会会议记录，内含追索1773年原住民债务抵地的商人请愿全文；https://dlg.usg.edu/record/g-hi_g-hiia_collectionsofgeo10geor（登记级别：dated_1775_march27_colonial_governor_council_primary_document_edited_public_transcription）
- 18CT08-GEO-MONTREAL：GeoNames Montreal市区45.50884,-73.58781；https://www.geonames.org/6077243/montreal.html（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-GEO-DETROIT：GeoNames Detroit市区42.33143,-83.04575；https://www.geonames.org/4990729/detroit.html（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-GEO-PITTSBURGH：GeoNames Pittsburgh市区40.44062,-79.99589；https://www.geonames.org/5206379/pittsburgh.html（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
- 18CT08-GEO-LANCASTER：GeoNames Lancaster市区40.03788,-76.30551；https://www.geonames.org/5197079/lancaster.html（登记级别：public_authoritative_history_edited_source_or_modern_geolocation）
