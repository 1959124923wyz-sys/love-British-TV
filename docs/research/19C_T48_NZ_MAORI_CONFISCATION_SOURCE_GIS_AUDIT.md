# 19C R2 T48｜新西兰殖民战争、毛利土地没收、暴行与历史GIS史料审计

**2026-11-22主编48资料制作版。** 三章 T48.1 北地／怀卡托／帕里哈卡、T48.2 陶朗加／东海岸流放／Ngātapa、T48.3 Te Urewera焦土与迁居。严格区分英军、殖民王室军警、获英国支持的毛利武装、当地反抗者的行动与法令实际处分；不把所有不同人群伤亡合并为“英军亲手杀人”。

## 去重与产物清点

| 对象 | 本轮制成品 | 去重与后续 |
| --- | --- | --- |
| 新母篇 | `E19-T48-NEW-ZEALAND-MAORI-LAND-CONFISCATION-WARS`，**43节129段73来源81独立历史事件链接** | 原本无T48公开或编审母篇；先保持`editorial_review/not_submitted`供独立出版门禁审查 |
| 年表 | 1860年代**42条**、1870年代**10条**、1880年代**21条**，合计**73条新登记事件** | 原研究C01/C02/C21/C22/C49/C50 ID在`research_original_node_ids`保留；81正文内链中71个新事件、10个已登记1840年代事件 |
| GIS | 1860年代10、1870年代2、1880年代3，总计**15个官方具名现代地理锚点** | 1840年代原有14个新西兰相关地理要素及Ruapekapeka寨址有源Polygon完整保留；不重复新建其形状 |
| 地权 | 1863法、1864—65 Waikato、1865 Tauranga、1866东岸及Taranaki公告分阶段独立叙述 | **0个**无1890以前实测坐标的没收地Polygon；不把今日新西兰行政区填色成当时没收区 |

**重要统计口径：** 原研究T48有176条案内年表、88条地图线索、8项待核问题；此次只将其中73宗严格有出处和独立时点的事件、15个具坐标并可说明地名的点转换为正式地图资源，不将研究总数冒充正式站图层成果。

## 第一手法律、军事与受害者证明矩阵

| 年期／地点 | 证据与原页入口 | 目前可以确认的侵害 | 进一步查档目标 |
| --- | --- | --- | --- |
| 1863—65全北岛部分土地 | [New Zealand Settlements Act 1863](https://www.legislation.govt.nz/act/public/1863/8/en/1863-12-03.pdf)；[1865 Gazette No.3](https://library.victoria.ac.nz/databases/nzgazettearchive/pubs/gazettes/1865/1865%20ISSUE%20003.pdf)、[No.19](https://library.victoria.ac.nz/databases/nzgazettearchive/pubs/gazettes/1865/1865%20ISSUE%20019.pdf)、[No.35](https://library.victoria.ac.nz/databases/nzgazettearchive/pubs/gazettes/1865/1865%20ISSUE%20035.pdf) | 英国殖民政府将指定毛利地区土地没收、划为军事定居地，依法修改公告界线与赔偿渠道 | 原印公报所述地籍图、省界和每次修订时点须精确配准后才作Polygon |
| 1863 Waikato | [Ngāti Hauā 2013王室和解](https://www.whakatau.govt.nz/assets/Treaty-Settlements/FIND_Treaty_Settlements/Ngati-Haua_ua/DOS_documents/Ngati-Haua-Deed-of-Settlement-18-July-2013.pdf)、[Te Ākitai 2021和解](https://whakatau.govt.nz/assets/Treaty-Settlements/FIND_Treaty_Settlements/Te-Akitai-Waiohua/DOS_documents/Te-Akitai-Waiohua-deed-of-settlement-historical-claims-12-Nov-2021.pdf) | 7月英军越Mangatāwhiri；Rangiriri攻堡后**183名守军被俘**；Te Ākitai的Ihaka被拘押、Pepene Te Tihi拘押期间死亡 | 总督/军队扣押名册、Rangiriri逐名战俘名册；被俘人数勿换算被杀人数 |
| **1864 Rangiaowhia** | [NZHistory Manatū Taonga官方烧屋纪念碑](https://nzhistory.govt.nz/memorial/rangiaowhia-burned-whare-memorial)、[英国战役纪事](https://nzhistory.govt.nz/war/war-in-waikato/invasion-continues) | 英军攻击以农业、礼拜和居民为主的村落，一处whare起火、**最多8人被烧死、3名试图投降者被杀**（官方纪念用词）。议会史学亦记载其平民受害 | 火源和英国军官当时命令需复核各版战报、毛利口述及后世研究；不把伤亡推写成未经证明的“预谋种族屠杀” |
| 1865 Waikato土地规模 | [Waitangi Tribunal全国史学总览Vol II印页181](https://www.waitangitribunal.govt.nz/assets/Rangahaua-whanui/NATIONAL-OVERVIEW/NatO2.pdf)、[1873 AJHR C-4b](https://paperspast.natlib.govt.nz/parliamentary/AJHR1873-I.2.2.2.8) | 1871旧官署统计Waikato没收区**1,193,306英亩**，其中**278,891英亩**作为拨留/保留类别；统计主体和阶段保持原始分类 | 1871 AJHR C–4原表未逐幅对照，调查返还、军人授地、未售宗地，不将所有公告面积视为已变卖面积 |
| 1864—67 Tauranga与Waitaha | [Ngāi Te Rangi/Ngā Pōtiki 2013和解](https://www.tearawhiti.govt.nz/assets/Treaty-Settlements/FIND_Treaty_Settlements/Ngai-Te-Rangi-and-Nga-Potiki/DOS_documents/Ngai-Te-Rangi-and-Nga-Potiki-Deed-of-Settlement-14-Dec-2013.pdf)、[Waitaha Claims Settlement Act 2013](https://www.legislation.govt.nz/act/public/2013/0038/42.0/whole.html) | Tauranga初始没收公告常记约**290,000英亩**；英国殖民军1867年袭击Te Puke附近Waitaha家园并毁坏房屋、作物和牲畜 | Tauranga受公告界、王室实际保留约5万英亩及另购Katikati–Te Puna地块分别核原件，切勿把29万英亩当实际出售总量 |
| 1865—66 Ōpōtiki/Whakatōhea | [1866 Gazette No.3](https://library.victoria.ac.nz/databases/nzgazettearchive/pubs/gazettes/1866/1866%20ISSUE%20003.pdf)、[No.51](https://library.victoria.ac.nz/databases/nzgazettearchive/pubs/gazettes/1866/1866%20ISSUE%20051.pdf)、[2024和解法](https://www.legislation.govt.nz/act/public/2024/15/en/2024-06-04B.pdf) | Grey以传教士Völkner遇害为由实施戒严和东岸远征，军方摧毁Te Tarata、处死Mokomoko及迁徙Whakatōhea居民。**1866年1月原公告与9月修改公告之间法定地界变化必须独立入档** | 1866实际迁居Ōpape每户地籍、处决人与当事家族记录、1866旧界重叠和补偿执行簿 |
| 1865—69 东岸流放及Ngātapa | [Rongowhakaata和解](https://www.whakatau.govt.nz/assets/Treaty-Settlements/FIND_Treaty_Settlements/Rongowhakaata/DOS_documents/Rongowhakaata-Deed-of-Settlement-30-Sep-2011.pdf)、[Te Ara NZ wars](https://teara.govt.nz/en/new-zealand-wars/print) | Te Kooti未经普通刑事审判被流放查塔姆群岛；1869年Ngātapa堡寨战后约**120名俘者遭处决**。直接处决主要由王室一方Ngāti Porou战士执行，英属军政官员默许或放任，责任需分开 | Te Kooti与各流放者档册、被俘者逐人身份、Ngāti Porou作战军报与英国军官知情文件；绝不误记为“英军枪杀120人” |
| **1869–70 Te Urewera** | [Tūhoe Claims Settlement Act 2014](https://www.legislation.govt.nz/act/public/2014/0050/latest/DLM5481230.html)、[Ngāti Whare 2009和解](https://www.govt.nz/assets/Documents/OTS/Ngati-Whare/Ngati-Whare-Deed-of-Settlement-8-Dec-2009.pdf) | **王室自己正式承认**杀害非战斗人员、处决未武装战俘、以焦土战术毁毁村落、作物、牲畜与储粮；1870年进攻Whakarae及湖区违反和平承诺 | 具体Te Harema及Ruatāhuna家宅名册、被押妇女儿童去向、被焚农田/粮食及军事责任军官 |
| **1879—83 Parihaka** | [Taranaki Iwi 2015和解 §§2.78–141](https://www.whakatau.govt.nz/assets/Treaty-Settlements/FIND_Treaty_Settlements/Taranaki-iwi/DOS_documents/Taranaki-Iwi-Deed-of-Settlement-5-Sep-2015.pdf)、[NZHistory 1881侵入](https://nzhistory.govt.nz/te-ra-o-te-pahua-invasion-pacifist-settlement-parihaka)、[1882 Indemnity Act](https://www.legislation.govt.nz/act/public/1882/8/en/1882-08-07/official_scan.pdf) | **1881年11月5日John Bryce率约1600名武装警察和志愿军占领不持武器抗议的村落**，拘捕Te Whiti、Tohu，驱离住民并毁村庄、作物；1882殖民议会立法免责 | 居民每户补偿与家屋毁损、警队逐日损失、被扣枪械和粮食实物清单、妇女受侵害证言与直接执行者 |
| 1880—81 Rīpapa Island/Lyttelton | [1880 Gazette监狱令](https://library.victoria.ac.nz/databases/nzgazettearchive/pubs/gazettes/1880/1880%20ISSUE%20089.pdf)、[Christchurch Art Gallery Prison article](https://christchurchartgallery.org.nz/bulletin/210/christchurch-and-the-new-zealand-wars)、[同期船讯](https://paperspast.natlib.govt.nz/newspapers/NZMAIL18800821.2.41) | 因和平耕作与修篱笆而被捕的毛利人在南岛被长期羁押；Rīpapa岛事实拘押先于正式指定监狱公告，1881年1月报从该岛转监**149人**，3名具名Te Ātiawa囚者在南岛羁押死亡 | 各人从Taranaki出发、航程、登监、死亡/释放实际日期，不能重复累加不同航次及同一囚犯 |

## 15个坐标锚点及历史范围处理

- 本轮1860s **10**：Rangiriri、Ōrākau、Pukekohe、Pukehinahina/Gate Pā、Te Ranga、Tauranga、Ōpōtiki、Ngātapa、Ruatāhuna、Whakatāne。参考[新西兰国立Te Papa博物馆Rangiriri](https://collections.tepapa.govt.nz/place/1741)、[Ōrākau](https://collections.tepapa.govt.nz/place/1745)、[Gate Pā](https://collections.tepapa.govt.nz/place/1743)、[Ngātapa](https://collections.tepapa.govt.nz/place/2792201)及原地名坐标。
- 1870s **2**：Parihaka和平犁耕抗争、Waikato土地拍卖地名参考。1880s **3**：Parihaka 1881镇压、Rīpapa Island殖民监狱、Lyttelton转押港。
- 每个Feature是现代地名WGS84 **Point**，`historical_boundary_confirmed=false`、`fill_authorized=false`、`territorial_claim=false`、`area_sqkm=null`、`exclude_from_area_aggregation=true`。历史战场的全部毁损住宅、祖地、未丈量没收区、分给军人土地的真实边界**不在这些Point坐标中**。
- **必须后续补实区域**：Waikato 1864–65每一版公报附表；Tauranga 1865/1867没收及王室保留分区；东丰盛湾1866年一月和九月修界。可从[Waitangi Tribunal Hauraki Report Vol I 图14原印208页](https://forms.justice.govt.nz/search/Documents/WT/wt_DOC_68330839/Hauraki%20Vol%201.pdf#page=256)及1871公报与LINZ旧地籍GIS配准取得可复现地物。存在范围争议时仅用**虚线**画具名法定边界段；在得到实测地图前不得生成自画“示意领土Polygon”或计算该面面积。
- 已有1840s Ruapekapeka有证寨址Polygon与14个旧具名图元不删除、不会在新专题中重复生成。

## 明确尚未取得的8类原档

1. Waikato 1871 AJHR C–4原始面积页及按原令分类统计，和1927 Sim/Waitangi Tribunal转录逐列对读。
2. 1865各Gazette公告完整的调查署原图、地政B43与LINZ测量号，按年入档，不把1865最后版边界套到1864。
3. Rangiaowhia每个被烧屋及试图投降者姓名/受伤记录，区分英军动机推测与有原始证据的烧屋杀害。
4. 1866 Whakatōhea原始法令边界“先误后改”、各支hapū实际取得的保留地和迁居名册。
5. 1869 Ngātapa各名被俘者、直接实施处决的同盟部队与知情王室官员，以及流放查塔姆群岛无审判名单。
6. 1869 Te Urewera军官Whitmore/St John原命令、Ngāti Whare女性儿童被转送名册和被焚居民作物地块。
7. Parihaka 1881逐日警察报告的拆屋、拆栅和毁粮统计及妇女个案，1882豁免法生效与审理卷宗。
8. Rīpapa与Lyttelton监狱每个被押毛利人的入监、患病、死亡、释放和遗体返乡档册。

## 自动验收门禁

`node scripts/test_19c_t48_new_zealand.cjs` 核43/129/73/81、73新年表、15个准确地名点以及原案ID、各十年可点击链接；`scripts/browser_19c_t48_new_zealand.py` 以**1780×1020 Chrome**检查1845/1863/1864/1865/1869/1879/1880/1881/1882历史跳转、Parihaka和Rīpapa地图镜头、图层开关、双击进入并返回。附 `.github/workflows/19c-t48-new-zealand.yml`。当前仍为制作版`editorial_review/not_submitted`，待独立出版PR与GitHub Pages真实build/deploy验证之后才称正式发布。
