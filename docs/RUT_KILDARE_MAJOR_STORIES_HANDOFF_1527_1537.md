# 爱英TV｜第09、10项重大历史专题交接（2026-10-16）

## 交付与研究边界
两个项目按原有用户批准的二级历史专题体系建设，不调整主页面、SVG图标、时间轴及版图的颜色。第09项已由原B级“核心两条事件不足”升为可以编写有来源长文：1527年普利茅斯启航、8月3日圣约翰港来信与西班牙11月莫纳岛和圣多明各英船资料之间建立可审的文献关系；同时强调南航英船是否为Rut本人仍属推断。

第10项写为1534—1537年完整战争与王室报复史：父亲赴伦敦、托马斯在圣玛丽修道院宣布叛乱、都柏林城堡久围不下、阿坦大主教遭叛军杀害、英王军梅努斯夺堡并处决投降守军、托马斯投降、1537年伦敦泰伯恩司法处决及地产追夺。书写双方行动分别归责，不将叛军杀害阿伦算为英王暴行。正文只讲历史，空间精度留在研究元数据。

## 源文件与故事
- `data/stories/john-rut-north-atlantic-voyage-1527.json`：9节，3000+汉字正文，主要来源加拿大传记辞典David B. Quinn、Biggar (1913)同时代文献转录研究及Wright (1929)西班牙档案编译节录。正文明确后两港英船没有证实为玛丽·吉尔福德号。
- `data/stories/silken-thomas-kildare-rebellion-1534-1537.json`：10节，3000+汉字正文，主要来源Steven G. Ellis 2019 *Historical Research*论文**公开摘要**、Kildare County Libraries的Durney地方研究、爱尔兰OPW圣玛丽修道院及梅努斯资料、Church of Ireland大主教Alen档案文章和English Heritage的Tyburn实地。
- `data/stories/index.json`：专题库从8篇增至10篇；`docs/MAJOR_STORY_BACKLOG_1497_1599.md`同步09/10状态及剩余分类。
- `data/historical-detail-notes.json`：7条新历史点的证据和空间精度均有可追溯记录。

## 新落图（保持原事件）
### 09｜1527拉特
1. `RUT1527-PLYMOUTH-DEPARTURE`：已证1527年6月10日普利茅斯出发，现代港市点，不复原码头泊位。
2. `RUT1527-MONA-ENGLISH-VESSEL`：1527年11月19日西班牙文书记载英船出现，标明身份未证实，现代莫纳岛中心。
3. `RUT1527-SANTO-DOMINGO-ENGLISH-VESSEL`：11月25日同类英船见证，UNESCO圣多明各现代老城参照。
4. `RUT1527-MONA-SANTO-DOCUMENTED-ENGLISH-SHIP`：仅1527年有效的两地文献顺序虚线，actor为未具名英船，非实测航路、不属于英军短占。原既有普利茅斯—圣约翰虚线和圣约翰两条事件保持不变。

### 10｜1534—1537基尔代尔
1. `KIL1534-STMARYS-RENOUNCEMENT`：1534圣玛丽修道院现存议事厅遗址参照位置，OPW和国家建筑遗产调查。
2. `KIL1534-ARTANE-ALEN-KILLED`：阿坦大主教遇害，现代地方点；Church of Ireland强调托马斯下令情况未证。
3. `KIL1535-MAYNOOTH-GARRISON-EXECUTIONS`：英王军攻堡后处死投降守军，与原攻堡事件分开记录；城堡现代遗址参考，无捏造死者数量。
4. `KIL1537-TYBURN-EXECUTIONS`：伦敦泰伯恩司法处决，现代English Heritage地面纪念标志位置；原`1530S-E012`保持无坐标，禁止误落爱尔兰。
5. 原`1530S-E003`从都柏林普通城镇中心修正为都柏林城堡考古中心 `53.342886, -6.267428`，并把屏幕可见说明改成历史叙述。

## 仍未解决
- John Rut：参孙号最后命运、最高纬度、拉布拉多港湾古地名、1527年加勒比英船船名与船长、真正航迹未证。不得用现代最佳航线模拟古人路线。
- Kildare：阿伦命令责任与守军处决总数不能臆断；1536/1537莱克斯利普相关法令需要查原始法令卷；叛乱区和没收地没有精确边界，因此不画新的占领Polygon。
- Ellis 2019仅访问学术摘要；西班牙文献译编目前从公开前言确认关键航期，不能声称逐页读完全部西班牙原始档案。

## QA 与接班
- `scripts/test_rut_kildare_major_stories.js` 校验二篇长文、年限、事件、源证、GIS非占地、伦敦归属和新史事在原研究笔记中可追溯。
- `scripts/test_major_story_pilot.js` 允许第09篇**同一年起止**的文献史专题；其他既有跨年交互保持。
- 更新旧脚本的固定事件/路线计数，但保留旧事件ID与全部原行政参照面。
- `.github/workflows/major-history-stories.yml` 与 `.github/workflows/pages.yml` 已接入新测试。
- **以GitHub PR主分支差异、最新CI和Pages实际部署为准**，不得以此文断言已经上线。
