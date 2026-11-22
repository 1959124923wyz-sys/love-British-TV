# R2 T48｜新西兰战争、毛利土地没收、Parihaka与Te Urewera后续原卷调查

**2026-11-22主编48｜三章已正式出版并完成Pages部署。**

- **生产** [PR #525](https://github.com/1959124923wyz-sys/love-British-TV/pull/525)：**55/55** GitHub Actions检查全部成功，合并SHA `1a138ab4db740b955d74ae39a72be88c169a7f21`。
- **正式出版** [PR #526](https://github.com/1959124923wyz-sys/love-British-TV/pull/526)：**52/52** GitHub Actions检查全部成功，squash SHA `4e7c3f0e2f589a3d5ebec61e76ebd47f21035ac6`。
- **站点部署** [Pages #45022856080](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/45022856080)：`build=success`、`deploy=success`；正式入口[1864](https://1959124923wyz-sys.github.io/love-British-TV/?year=1864)、[1865](https://1959124923wyz-sys.github.io/love-British-TV/?year=1865)、[1869](https://1959124923wyz-sys.github.io/love-British-TV/?year=1869)、[1881](https://1959124923wyz-sys.github.io/love-British-TV/?year=1881)，无编辑预览参数。
- **正式冻结本轮规模**：T48.1、T48.2、T48.3共**43节129段73来源81正文互动历史事件**（10复用1840年代、71新增新ID），正式逐年数据新增73事件（1860s42、1870s10、1880s21），有依据地图具名Point 15个（10+2+3）；没有猜测的1865/66年毛利地权没收行政Polygon或凭空累计土地面积。旧1840年代14个新西兰GIS图元和Ruapekapeka真实历史寨址Polygon全部保留。
- 母篇`E19-T48-NEW-ZEALAND-MAORI-LAND-CONFISCATION-WARS`状态`published/approved`，三章节`published_new`。所有T48来源与不确定图层见 [史料+GIS审计](../../../docs/research/19C_T48_NZ_MAORI_CONFISCATION_SOURCE_GIS_AUDIT.md)，原卷见 [T48研究底册](topics/T48.md)。

## 一、最高优先级：实际夺地和殖民财产流向

| 紧急度 | 地点和时期 | 已有明确证据 | 必须继续取得的原始证据／绘图步骤 |
| --- | --- | --- | --- |
| P0 | **Waikato 1863—1865** | [1863《定居法》原件](https://www.legislation.govt.nz/act/public/1863/8/en/1863-12-03.pdf)、[1865 Gazette No.3](https://library.victoria.ac.nz/databases/nzgazettearchive/pubs/gazettes/1865/1865%20ISSUE%20003.pdf)、[No.19](https://library.victoria.ac.nz/databases/nzgazettearchive/pubs/gazettes/1865/1865%20ISSUE%20019.pdf)与[No.35](https://library.victoria.ac.nz/databases/nzgazettearchive/pubs/gazettes/1865/1865%20ISSUE%20035.pdf) | **原版不同日期的每一幅附表旧测图、LINZ测量卷号**。地图以受法令影响的某一地块/原测河界作为最小单位，区分首次指定、修界、返地、卖地、军人授地与未取得实际所有权地区。历史原图无法定位的段落只绘虚线，绝不画“Waikato整区被没收”的实填块 |
| P0 | **1871 Waikato政府没收地统计** | [Waitangi Tribunal总览卷II](https://www.waitangitribunal.govt.nz/assets/Rangahaua-whanui/NATIONAL-OVERVIEW/NatO2.pdf)重引1871 C–4，总额1,193,306英亩、拨留或保留278,891英亩 | 追**AJHR 1871 Session I C–4每一页原表**与1873 C–4b处分清册；逐项分取地、保留、返还和拍卖所得，区分原单位英亩、货币价格与英国王室实际净收益 |
| P0 | **Tauranga 1865/1867** | [Ngāi Te Rangi—Ngā Pōtiki 2013和解](https://www.tearawhiti.govt.nz/assets/Treaty-Settlements/FIND_Treaty_Settlements/Ngai-Te-Rangi-and-Nga-Potiki/DOS_documents/Ngai-Te-Rangi-and-Nga-Potiki-Deed-of-Settlement-14-Dec-2013.pdf)记最初公告约290,000英亩 | [Tauranga District Lands Act 1867](https://www.legislation.govt.nz/act/public/1867/46/en/latest/)所引1865年5月18日命令、每个补偿地、王室实际保留约5万英亩和Katikati–Te Puna另购逐案查契。**29万英亩是法令范围，不等于实际英国出售面积** |
| P0 | **Whakatōhea东丰盛湾 1866** | [1月17日命令原页](https://library.victoria.ac.nz/databases/nzgazettearchive/pubs/gazettes/1866/1866%20ISSUE%20003.pdf)、[9月1日修界原页](https://library.victoria.ac.nz/databases/nzgazettearchive/pubs/gazettes/1866/1866%20ISSUE%20051.pdf) | 比较两套原始边界文字中的Tarawera River、Waitahanui河口、Ōhiwa港与各测绘基准；实测不足以定点的线段必须画虚线。查Ōpape保留地逐户迁移和补偿记录 |
| P1 | **Taranaki & Parihaka 1865—1882** | [Taranaki Iwi 2015和解历史](https://www.whakatau.govt.nz/assets/Treaty-Settlements/FIND_Treaty_Settlements/Taranaki-iwi/DOS_documents/Taranaki-Iwi-Deed-of-Settlement-5-Sep-2015.pdf)含1879耕作抗争、1881入侵、1882刑罚和失地 | 查原测每一农场、道路及军人购买历史地块，把**被没收区域、和平抗议耕作地、警队毁农作物和后来城市定居者占地**做成四类时序证据。逐户灾害和军警实际执行记录比示意区域优先 |

## 二、最高优先级：英国殖民政府及盟军的暴行

| 紧急度 | 有证行为及执行者 | 原档和受害者链 | 下一步 |
| --- | --- | --- | --- |
| P0 | **1864-02-21 Rangiaowhia英帝国军突袭村居并焚屋杀人** | [新西兰官方烧屋纪念碑](https://nzhistory.govt.nz/memorial/rangiaowhia-burned-whare-memorial)：一间whare起火，最多8人被火烧死，3名试图投降者遭杀害。Ngāti Apakura和Ngāti Hinetū家族受到伤害 | 调Cameron及骑兵各部军报、各部族每名死者历史证词、房屋确址、火源；区分烧屋事实、现场士兵行为及是否预谋的史学争议 |
| P0 | **1869-01 Ngātapa约120被俘者遭处决** | [Rongowhakaata历史和解](https://www.whakatau.govt.nz/assets/Treaty-Settlements/FIND_Treaty_Settlements/Rongowhakaata/DOS_documents/Rongowhakaata-Deed-of-Settlement-30-Sep-2011.pdf)与[Te Ara新西兰战争](https://teara.govt.nz/en/new-zealand-wars/print)；执行者主要为**王室一方Ngāti Porou战士**，王室军政官署有默许责任 | 逐名受害者、英国军官与在场文职官员是否直接下令、处决山崖和埋葬地点，避免把盟军执行误称英正规军亲手杀120人 |
| P0 | **1869 Te Harema、Ruatāhuna与Whirinaki焦土军政行动** | [Ngāti Whare与王室2009和解](https://www.govt.nz/assets/Documents/OTS/Ngati-Whare/Ngati-Whare-Deed-of-Settlement-8-Dec-2009.pdf)、[2014 Tūhoe和解法](https://www.legislation.govt.nz/act/public/2014/0050/latest/DLM5481230.html)承认王室杀非战斗者、处决未武装战俘及毁村粮 | 军官Whitmore/St John作战命令、Te Harema具体家宅/仓粮、妇女儿童被关押后转送路径，未武装死者名单与Ruatāhuna村舍地名 |
| P0 | **1881-11-05 Parihaka约1600军警强行进入不持武器的社群** | [Manatū Taonga NZHistory](https://nzhistory.govt.nz/te-ra-o-te-pahua-invasion-pacifist-settlement-parihaka)、[Taranaki Iwi和解](https://www.whakatau.govt.nz/assets/Treaty-Settlements/FIND_Treaty_Settlements/Taranaki-iwi/DOS_documents/Taranaki-Iwi-Deed-of-Settlement-5-Sep-2015.pdf) | Bryce军令、逐日警察周报、被拆毁房屋/粮食/围栅的实际量、妇女受侵害证言、1882 Indemnity Act审判与责任豁免的适用个案 |
| P0 | **1880—81 Rīpapa岛与Lyttelton毛利囚犯强制押送和羁押死亡** | [1880年Rīpapa殖民监狱公报](https://library.victoria.ac.nz/databases/nzgazettearchive/pubs/gazettes/1880/1880%20ISSUE%20089.pdf)；[Christchurch Art Gallery档案研究](https://christchurchartgallery.org.nz/bulletin/210/christchurch-and-the-new-zealand-wars)登记149名同批移监 | 每人从Taranaki至Dunedin、Lyttelton或Rīpapa岛的到狱日、劳动、患病死亡、释放和遗体返乡记录；杜绝把多航次的同一人重复记为受害者 |
| P1 | **1866 Mokomoko在Mount Eden处决及集体惩罚** | [Whakatōhea历史和解](https://www.whakatohea.co.nz/_files/ugd/b7cce3_49542f2252d64d6a818d6e9195cd9c12.pdf)及[新西兰2024和解法](https://www.legislation.govt.nz/act/public/2024/15/en/2024-06-04B.pdf) | 五名同日被处决者分属Völkner与Fulloon案，殖民法院证据/翻译/行刑及家属遗体索回必须分案核；返地赔偿和刑罚损害两套账 |

## 三、GIS与来源管理技术规范（仅研究和工作板，不进公共正文）

- 新旧年份资源：1840年代已有47个NZ历史节点、14相关GIS（含Ruapekapeka准确寨址Polygon）；新1860年代42节点/10点、1870年代10节点/2点、1880年代21节点/3点，合计73新增事件/15新Point。仅将具有现代可核同名地的点放到地图；绝不能从现代城市中心推算1869年具体杀人现场或1881年被毁房间。
- 把**战役/军营/殖民法定没收区/实际授地/返还与赔偿/宗教和社群活动地**分为不同属性类别，避免同一种填色吞没不同法律权利；有足够原图时用对应日期和几何数据，仍存疑的界线虚线显示。
- 所有实际面积统计须给原文来源/单位/版本，`area_sqkm`只在有确证闭合历史多边形时计算。**单一政府公报估算英亩面积不授权凭想象闭合Polygon**。
- 不在公共文章或图卡添加“这是现代点位代理”“示意面积”等编辑文案；原始`source_urls`、`geo_precision`、`historical_boundary_confirmed`保存供史料审核。

## 四、正式交付与下一期候选

- 合并制作#525 **55/55**、正式出版#526 **52/52**，GitHub Pages #45022856080 build/deploy双成功；桌面真实Chrome、所有合并事件ID/来源索引、全站保护均通过，59专题/150章节工作板标记T48.1—T48.3 `published_new`。
- 下一次从[原始研究案T48](topics/T48.md)继续地籍与逐户案件深挖，也可按照工作板另选优先未发表项目；**无需用户上传ZIP、操作本地代码或手动绘图**。
