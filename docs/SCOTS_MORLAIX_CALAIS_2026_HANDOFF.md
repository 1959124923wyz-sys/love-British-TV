# 爱英TV｜06／07／08历史专题与史地补缺交接（2026-10-16）

## 06 1522—1523年英苏战争与边境焦土袭掠（上线文章）
- `data/stories/anglo-scottish-war-border-raids-1522-1523.json`，9节逾3000汉字，7个关联事件。通行历史学术大标题为Neil Murphy《Henry VIII, the Duke of Albany and the Anglo-Scottish War of 1522–1524》，因项目计划仅写前两年，文章标题限定1522—1523，正文交代后续战争延伸至1524。
- 重点来源：Murphy（2023/2024）专著第1、2、5章公开摘要、Murphy 2020《Scottish Historical Review》论文、英国Historic England Wark古迹及1523英军通信、苏格兰HES Cessford/Ferniehurst古迹记录。
- 新事件：
  - `SC1522-KELSO-RAID` 1522凯尔索城镇遇袭，依据弗吉尼亚大学转录地方历史；史料成书较晚，**不照搬焚毁一半城镇的具体比例**。
  - `SC1523-KELSO-ABBEY-ATTACK` 1523再袭凯尔索修道院，参考Murphy 2024书摘；不宣称全毁。
  - `SC1523-ALBANY-COLDSTREAM-MUSTER` 苏法军在Coldstream附近集结，准备越特威德河攻英王沃克城堡。
- 新关系线 `SC1523-COLDSTREAM-WARK-SCOTS-ADVANCE`，仅1523年可见，属性`actor=Scotland_France_counteroffensive`，直接区分英军烧掠与苏法军反击；线为端点先后概括，非真实历史渡口轨迹。
- 不以现代边境行政边界绘英军攻占苏格兰领土。Murphy章节可证明有系统的毁粮、烧田、掠畜，**没有逐田块、逐村庄完整空间边界**，不新增伪造的大型焦土Polygon。
- 杰德堡修道院毁坏程度存在信函与书本解释不一致，正文维持谨慎叙述。

## 07 1522年莫尔莱袭掠（维持C级，不独立成篇）
- 新权威证据：法国布列塔尼大区文化遗产调查 `https://rec.patrimoine.bzh/gertrude-diffusion/dossier/IA29000772`（关于Fort Château du Taureau），具体记录1522年英舰队在**Carantec Anse du Clouët**上陆，途经**Henvic/Lézireur**（被焚乡村城堡及农庄），再到**Morlaix**掠城；当地英军落脚点和Henvic城堡精确墙线未确认。
- 新点 `FR1522-CLOUET-CARANTEC-LANDING`（今Clouët海滩位置），`FR1522-HENVIC-LEZIREUR-BURNING`（Henvic镇区代表点，非城堡遗址）。
- 新线 `FR1522-CLOUET-HENVIC-MORLAIX-RAID`：仅1522年、3具名地名顺序，非历史军道测绘。原 `1522-MORLAIX-SACK` 保留；整组不增加独立专题文章。布列塔尼大区资料把“内奸开城门”明确视为传说，禁止纳入确证事实。地方反击属于法国行动，不归类英军劫掠。
- 遗产资料认为1522年居民损失甚巨、后续建设Château du Taureau以防止再袭。但城堡在**1540年代**才开始兴建，切勿画成1522年已有的防御据点。

## 08 1497—1558年加来—吉讷英王飞地（上线文章）
- `data/stories/calais-guines-english-pale-1497-1558.json`，10节逾3000汉字、13条跨章节正式事件链接。文章先回顾1347年英王攻占，再从1497—1558年串连羊毛商团与王室军费、1500伊塔普勒条约款、1525吉讷委员会、1529排外法规、1533利斯尔副总督、1542—45加来驻军账簿、1558法军攻陷加来—吉讷—哈姆斯。
- 核心权威：英国国家档案馆`https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/french-lands-english-kings/`，其中有E351/530–535加来1542—1545王室司库声明账册；David Grummitt《The Calais Garrison》公开章节摘要；Susan Rose《Calais: An English Town in France》章节简介；Neil Murphy（2025）吉讷法律与边区农业移民的同行评审摘要；1558英国王室历史军事地图馆；议会史威廉·格雷传记。
- 新财政事件 `CAL1542-GARRISON-ACCOUNTS`：1542—1545王室驻军账册在加来城坐标展示；不虚构精确费用或新的征税面积。
- 历史守卫体系以已存`calais-crown`／`guines-crown-1520s`城市中心点和经审定控制图层表现；1558年沿用已有`1550S-E026`里斯班/纽纳姆桥交战，`1550S-E018`加来失守，`1550S-E019`吉讷失守，`1550S-E025`哈姆斯撤守。2015以后的Fort Nieulay建筑位置不得作为1529年纽纳姆桥老堡墙线。
- 1529吉讷法规的明确排外性质来自Murphy：鼓励英格兰农民、排斥非英格兰租地者、限制婚姻并要求学习英语；它是管辖区社会强制政策，**不是新的军事占领Polygon**。
- 历史上Calais Pale最初始于1347年，文章可讲前情但可交互出版数据库从1497年开始，因此标题时间段1497—1558年而非假定1347年可逐年操作。

## QA 与恢复
- 文章内单击历史事件自动跨年定位，双击打开子事件、返回回到原始文章和发起子事件。
- 新事件合计6条：苏格兰3、莫尔莱2、加来账册1；关系线2条。政治占领区数量**0个新增**，全部旧政治状态及1558主权转换保持。
- `data/historical-detail-notes.json`六处新增研究来源与地理限制；`scripts/test_scots_calais_stories.js`静态校验2文章、事件所属主体及1522/1523年度路线；`scripts/browser_scots_calais_stories.py`桌面Chromium跨世纪章节跳转与返回。
- 变更经独立研究分支`feature/stories-1522-scots-calais-1558-20261016`提交并建立PR，所有测试通过后方可合并主分支发布。
