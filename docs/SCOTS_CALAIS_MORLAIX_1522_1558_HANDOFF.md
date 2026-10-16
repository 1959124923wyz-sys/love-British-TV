# 爱英TV｜06、07、08专题阶段性交接（2026-10-16）

## 06｜1522—1523年英苏战争与边境焦土袭掠

**读者库**：`data/stories/anglo-scottish-war-border-raids-1522-1523.json`，9节、约3000汉字，涵盖英法战争与苏法联盟、英军烧掠、凯尔索、塞斯福德、杰德堡、费尼赫斯特与1523苏法联军反攻沃克。学界常用总称1522—1524年英苏战争，此篇聚焦其前两年。

新映射`data/atlas-1520-1529.json`：1522凯尔索城镇受袭`SC1522-KELSO-RAID`（主要依赖19世纪地方史史料，不采信具体烧毁比例）、1523凯尔索修道院遭袭`SC1523-KELSO-ABBEY-ATTACK`、1523苏法军冷溪附近集结`SC1523-ALBANY-COLDSTREAM-MUSTER`。独立学术考古报告[Society of Antiquaries of Scotland volume 135 (2005)](https://archaeologydataservice.ac.uk/catalogue/adsdata/arch-352-1/dissemination/pdf/vol_135/135_319_342.pdf)明确引述1523 Dacre原始书信：焚城及拆毁Kelso Abbey门楼。亨利八世此役不是英王真正占领整个苏格兰，盖尔—边区氏族并非统一政治实体。

只新增`SC1523-COLDSTREAM-WARK-SCOTS-ADVANCE`一条仅1523年显示的苏法军反攻英王沃克堡关系线，属性`actor=Scotland_France_counteroffensive`，不能标为英军袭掠。1523年农庄粮草被英军集中毁坏有墨菲学术专著支持，但未知村落清单和受害区外缘，**不画大面积焦土Polygon**。年代GIS不生成任何英王新占领苏格兰地界。

## 07｜1522年莫尔莱港袭掠及后续防御（C级暂不单独发布专题）

先前地图已有`1522-MORLAIX-SACK`；本轮新加入法国布列塔尼**区域官方文化遗产调查**逐点复核的`FR1522-CLOUET-CARANTEC-LANDING`（英军卡朗泰克Clouët岸湾登陆）、`FR1522-HENVIC-LEZIREUR-BURNING`（途经Henvic破坏Lezireur庄园）及只在1522年出现的`FR1522-CLOUET-HENVIC-MORLAIX-RAID`。法国地方记载的随英军一方的叛徒、街巷中居民复仇和大批伤亡数字应优先用同代文本再次核实，未充作实测屠杀数字和精确空间位置。

法国文化部文保档案[PA00090226](https://pop.culture.gouv.fr/notice/merimee/PA00090226)与[布列塔尼大区官方遗产清单](https://rec.patrimoine.bzh/gertrude-diffusion/dossier/IA29000772)还确认：英军1522年的破坏促使当地商民在陶罗岛修建炮台，法国文化部列出1542年建筑阶段，地图新增`FR1542-MORLAIX-TAUREAU-FORT`；今日城堡大部分为17—18世纪改造，现址坐标不是1542年原始防御墙线。

注意：原分支一度重复创建Carantec普通市镇图钉`FR1522-MORLAIX-CARANTEC-LANDING`，已经删除并统一采用现有史料精度更高的Clouët地点事件，避免地图上三重标记同次登陆。

## 08｜1497—1558年加来—吉讷英王飞地

**读者库**：`data/stories/calais-guines-english-pale-1497-1558.json`，10节、约3400字，串起1347年占领背景、羊毛商团财税与守军、加来和吉讷、1529年针对法兰西和佛兰德租户的限制、英格兰移民及语言治理、1533年利斯尔副总督、1542—45军费账册，直到1558年法国突然夺回港防和吉讷。

既有`1500-CALAIS-ETAPLES`、`1505-CALAIS-STAPLE-ROYAL-PAYMENTS`、`1525-GUINES-COMMISSION`、`1525-NEWEMBRIDGE-REFORTIFICATION`、`1529-GUINES-LAWS`、`1530S-E001`、`1540S-001`和1558年法军收复各节点仍保留。新增1542驻军财务档案`CAL1542-GARRISON-ACCOUNTS`，以及法国市档案馆与英国王室历史围城图共同支持的1558里斯班与纽纳姆桥两处攻防节点`CAL1558-RISBAN-FRENCH-CAPTURE`、`CAL1558-NEWNHAM-FRENCH-CAPTURE`。最后两点是**法军攻占英王外围据点**，绝不是英方继续扩展控制。

多年代叙事起于1497年、止于1558年；1347仅为历史前情，不另造1347年主时间轴章节。加来城市、吉讷边境军事辖区、羊毛税收范围、私人土地所有权不能用同一面表示。既有1558年1月王室对加来失控、吉讷和哈姆斯相继结束的控制时序数据未更改。不根据现今两处堡垒完整围墙假造1558年历史边界。

## 代码、QA与保护

本轮研究独立GitHub分支 `feature/stories-1522-scots-calais-1558-20261016`。草稿可能因对话中断暂停；文档、8篇专题库目录、各年代事件及来源均应先在该分支核实。历史档案`data/historical-detail-notes.json`已保留新增地点的证据限制及政治主体。

QA覆盖：
- `scripts/test_scots_calais_stories.js`：专题长度和事件链、1522英军对苏格兰袭掠与1523苏法反击、两条具体年份行动线、法国收复加来和1542莫尔莱防卫，不允许未经证实的领土面积；
- `scripts/browser_scots_calais_stories.py`：从子事件进入史料库、1523—1522往返、1497—1558跨年代阅读、双击子事件返回、原事件保留；
- 原有章节/地理测试的数据累计事件断言依照**新增史事保留原有全部记录**同步更新；
- PR检查全部通过方可合并，经Pages workflow确认部署成功后才算上线。

继续资料缺口：1522—1523年边境农业焦土实际范围和古军道不明；加来Pale的1510—1550年分年代行政边界未获可靠地理配准；英法海岸袭掠具体破坏街区和官方船舶清单未能完全复原。
