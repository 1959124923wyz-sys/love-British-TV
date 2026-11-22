# 归档进度

## 2026-11-19 · 十九世纪编审资料入库

- 归档 59 个专题与 150 个章节，保留原 273 案处置、1,980 条分章年表、1,520 条史料索引与 374 份文本底稿。14 个混合原卷按历史进程拆分。
- 可按专题、章节、原案号、原事件号和史料编号联查。底稿保留原路径及哈希，179 件扫描附件由上游总包定位。
- 现阶段为研究交接。后续按拟用专题逐卷复核重要日期、伤亡或财物统计口径、既有地图 ID 与地理精度，再提交发表审查。
- 本批校验结果可使用 [本地验证脚本](verify.py) 复核。提交身份以 Git 历史中的本批变更为准。

## 2026-11-21 · 长期接力机制和工作板建立

- 核对原草稿 PR #463 所保存研究卷：59专题、150章节、27项“首批”专题、32项“后续”专题；1,317条地图线索在来源表中仍为研究线索。
- 建立 [接力总入口](START_HERE.md)、[59专题任务板](TOPIC_WORKBOARD.csv)、[150章节任务板](CHAPTER_WORKBOARD.csv)，以及 [可重复运行的工作板校验](verify_handoff.py)。每章单独追踪证据、写作、GIS、正文跳转、桌面CI和正式发表。
- 当前工作板的 `not_checked` 表示**尚未核实原档案与当前main站内文章、年表和GIS的对应关系**；不表示现有网站确实空白，也不表示还没有用户可见的19世纪内容。
- 尚待分配：27项首批按 [R1—R4分组](START_HERE.md#5-前四轮推荐制作顺序可并行但专题-id-不可重号) 安排；逐章检查现有正式地图ID后启动调查、正文及绘图。回查研究原始案号，不因推进而抹去旧案或关联来源。
- 当前归档的179条扫描件仅有上游ZIP的路径/校验和，未来涉及原始图片内容时需按原件索引定位或重新获得合法可访问源，不按未阅扫描件编写可发表细节。
- 首次站内正式发表完成后必须更新：两张任务板、专题源文件、`PROGRESS.md`、研究GIS来源目录、提交SHA及 Pages 验收地址。

## 2026-11-21 · T15 印度起义专题首轮制作中

- 分支 `feat/19c-t15-india-rebellion-map-20261121` 已新增八节专题阅读稿，复用既有德里、坎普尔、阿杰纳拉及安达曼地图事件；贝拿勒斯、阿拉哈巴德、詹西新事件及图层、CI和发布验收尚在制作中。
- 对英国议会1858年2月8日所引三封1857年来信（7月6日、13日、22日）、英国国家陆军博物馆1858年3月24日及4月3日年表、印度国家古迹管理局詹西堡坐标完成原文/网页定位；烧村之村名、原卷法律文书及城内平民死者统计仍待核。

## 2026-11-21 · T15 R1首个专题完成代码与GIS接入（审查中）

- GitHub分支 `feat/19c-t15-india-rebellion-map-20261121`：编写8节24段历史专题，正文链接34个正式事件；复用德里、坎普尔、阿杰纳拉、安达曼此前已有四个长篇。
- 新增8条1857—1858年史料明确的事件，含贝拿勒斯驻军缴械、阿拉哈巴德7月6日及22日来信、贝拿勒斯7月13日来信、詹西1857年6月死亡事件及1858年3月围城和4月入城/杀戮；新增3个具名地参考点和2条虚线行动关联线，保留来源及历史边界限制。
- 参阅 `docs/research/19C_T15_1857_INDIA_MAP_SOURCE_AUDIT.md` 追溯各证据与原事件号。现在为 `editorial_review / not_submitted`，待审稿、静态校验和Chrome真实地图QA；尚未作为正式发布计数。
- 后继优先查英国图书馆 IOR/H/726（Neill指令及村庄名）、詹西Godse原文/英译、Lowe原印和印度地方户籍/财产文书，不补写未证死亡人数或土地外缘。

- PR [#501](https://github.com/1959124923wyz-sys/love-British-TV/pull/501) 已建立。首次GitHub Actions中专题静态链接与坐标测试通过，但研究验证发现T15.md到审计文档的相对路径需上溯四级；本次提交已更正并重启CI。

## 2026-11-21 · T15 首个专题合并、34项CI全绿和Pages部署

- [PR #501](https://github.com/1959124923wyz-sys/love-British-TV/pull/501) 已合并到 `main`，**合并提交 `9be6c54facd485197155edbc80eccf0d36efa967`**。
- 该PR在合并前共 **34/34 项GitHub Actions成功**，含T15专项静态历史/地理合同、1857→1858詹西桌面Chrome年份和地图中心跳转、19C研究归档/工作板、严格GIS审计与跨世纪回归。
- [GitHub Pages发布工作流 #44922027446](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44922027446) 的 `build` 和 `deploy` 均成功；主站十九世纪阅读预览入口：<https://1959124923wyz-sys.github.io/love-British-TV/?review19c=1&year=1857>。
- **状态**：T15母篇在 `data/stories/serial/index.json` 中仍为 `editorial_review/not_submitted`，属于可在预览入口打开的专题；其正式发布及行政边界原卷审查仍单独排队。已在T15、T15.1、T15.2任务板写入审稿和桌面CI结果，保留未核事项。

## 2026-11-22 · R1 T26 鸦片战争、中国条约港与对华贸易施压（审查分支）

- 认领 T26.1/B01、T26.2/B02、T26.3/B49+B67；创建独立分支 `feat/19c-t26-china-opium-treaty-ports-gis-20261122`，此前主分支已存在四个分别覆盖1839专卖、第一次战争、广州占城及1860年北京劫掠的史料较详专题。
- 新母篇 `E19-T26-OPIUM-WARS-CHINA-TREATY-PORTS` 已完成 **14节44段、99个真实地图事件链接**（复用76、补23），严格区分战争临占、永久割让、通商法权与条约款项应付/实收。
- 1850/1890等十年审计后沿用现有数据，新增 **48个十年展示图元**（46点、2条虚线），包括五口1843/44—1899和《烟台条约》四口1877—1899清朝行政延续；没有新增未经证实的历史领土多边形或可计量殖民面积。
- 本轮来源和新事件原案对照：`docs/research/19C_T26_CHINA_OPIUM_TREATY_PORTS_GIS_AUDIT.md`；**11项待核研究问题**、原卷/档号、下一批作业和验收清单：[`T26_NEXT_ACTIONS.md`](T26_NEXT_ACTIONS.md)。正文 `editorial_review/not_submitted`；未执行CI和Pages以前不称正式出版。

## 2026-11-22 · T26 首个横跨1839—1899中国专题合并、35项CI全绿及Pages部署

- 制作PR [#503](https://github.com/1959124923wyz-sys/love-British-TV/pull/503) 已合并 `main`，**合并 SHA `53d9a7cb8287a6699b177b4a67126622cbb75aca`**；14节44段长文99条地图内链、23个补写事件、六十年连续48个GIS展示图元（46点/2虚线）；所有原有鸦片战争/广州/圆明园4篇独立文章不被覆盖。
- PR #503 全部 **35/35 项GitHub Actions最终成功**（17世纪跨年回归因偶发浏览器等待超时单独重跑后成功），含T26专项静态史料/空间审计及桌面Chrome 1839→1843→1868→1877→1885、双击返回、1899地图连续性。专项 [Actions #44977109145](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44977109145)。
- [Pages 部署工作流 #44977462856](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44977462856) `build` 和 `deploy` **成功**，预览入口 <https://1959124923wyz-sys.github.io/love-British-TV/?review19c=1&year=1839>。研究缺口的史料编审仍保留 `editorial_review/not_submitted`，非最终史料批准。
- T26.1/B01、T26.2/B02、T26.3/B49+B67 三章CI及交互状态回填任务板；[T26未结原卷与长期待办](T26_NEXT_ACTIONS.md)列清11项研究缺口、历史边界和财税收据；下一个R1制作专题 **T37马格达拉（C10）**，随后 **T46澳洲边疆扩张与暴力**。

## 2026-11-22 · T37 马格达拉远征初版制图与长篇（编审分支）

- 按R1顺位制作T37.1 / C10；原研究59专题、150章、1980条年表等常量保持不变。对照National Army Museum、V&A、British Museum、British Library、1871 Hansard和研究论文，保留物件原宗教来源、夺取、转卖与英方馆藏的区别。
- 新增[12节T37长篇](../../../data/stories/serial/e19-t37-maqdala-expedition-looting-1867-1872.json)及12条正式年表事件链接；分布1867年2、1868年7、1871年1、1872年2；原研究C10-E03等映射见[T37来源GIS审计](../../../docs/research/19C_T37_MAQDALA_PROVENANCE_GIS_AUDIT.md)。
- 1860/1870s GIS增11图元（8具名参考点、3有据关系虚线），**零个未经测量的行政/英国实控多边形**；马格达拉与Aroge原测图尚未取原件配准，战场精确坐标保留空值。
- 冠杯1871年议会动议与1872年财政部寄存、V&A 1868年11月约£15的整组购价、Or607馆藏批次和个别物件运输缺口分账。详情与后续任务见[T37长期待办](T37_NEXT_ACTIONS.md)。
- 制作分支 `feat/19c-t37-maqdala-provenance-gis-20261122`，状态`editorial_review/not_submitted`，专项CI、浏览器验证、PR合并和Pages仍待核，下一制作顺位T46。

- **GIS纠偏**：交叉对读Nordic Africa Institute/Bernhard Lindahl (2005) Mekdela Maryam 11°21′N/39°11′E，与Getty TGN及Wikidata衍生地名纬度差异后，将马格达拉地图点/两条关系线端点更正为高原西南**近址**39.18333E/11.35N，保留堡墙及Aroge战地待同期原测图配准；正文和QA同步修正。

## 2026-11-22 · T37 #505合并36项CI全绿及Pages部署

- [制作PR #505](https://github.com/1959124923wyz-sys/love-British-TV/pull/505)已squash合并到 `main`，提交SHA `2cdc3ed1a23293a49be0b06d9fcb4d0005dda18f`，15个文件变化，12节历史母篇及12事件、11GIS已正式进入源树。
- PR最新 `cfc1222196bef1038c229f7b2f33d87ceb61312c` 全部 **36/36 GitHub Actions成功**，含T37来源GIS审计和真实桌面Chrome。T37专项[工作流 #44979476836](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44979476836) 2/2 jobs成功并保存地图截图证据。
- [Pages #44979833161](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44979833161) **build+deploy成功**，T37编审预览 <https://1959124923wyz-sys.github.io/love-British-TV/?review19c=1&year=1868>。
- T37继续维持 `editorial_review/not_submitted`，BL 1868原测图、原竞买账、Saunders上手、财政部寄存实物凭证未核；T26 11个遗留问题未改动。[T37待办](T37_NEXT_ACTIONS.md)独立保存。**下一制作顺位为T46**，五章、81条研究年表、98GIS线索、17原问题，见[T46任务清单](T46_NEXT_ACTIONS.md)。

## 2026-11-22 · T37马格达拉真正正式发布（不再只是编审预览）

- 取得[PR #507](https://github.com/1959124923wyz-sys/love-British-TV/pull/507) 35/35 CI全部通过，合并SHA `58590ac07f40060d6efcdcfce5ef45fc19072901`；保留12节/12可跳转事件/11GIS（8点、3虚线、0无据Polygon），修正文稿中的制图内部说明，并在原英文机构史料基础上补足英印远征后勤与具体实物出处。
- [GitHub Pages #44981515205](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44981515205) `build/deploy`成功；普通网站地址 <https://1959124923wyz-sys.github.io/love-British-TV/?year=1868> **不需要**`review19c=1`。
- 仅T37在 `data/stories/serial/index.json` 中获`published/approved`出版资格，研究原卷和未核档案不因此判为全部查清。正式站T37母篇与T37.1按`published_new`记入工作板，BL历史测图、德兰塔售卖原簿与本地教会原件仍待核。[T37跟进](T37_NEXT_ACTIONS.md)；[T46接力](T46_NEXT_ACTIONS.md)为下一优先。

## 2026-11-22 · R1 T46澳大利亚边疆五章联稿与地图生产（专项审查中）

- 五章全部从[T46源研究](topics/T46.md)转入独立[25节75段长篇](../../../data/stories/serial/e19-t46-australian-frontier-land-violence-1829-1897.json)；48条附出版机构及链接的史料来源，39个可点击事件链接（10条同事件现有ID复用、29条新事件）。
- 新增29条严格逐十年事件：1820年代2、1830年代8、1840年代2、1850年代1、1860年代8、1870年代5、1890年代3，未改变原已公开Pinjarra、Myall、Waterloo及Warrigal五子案的ID/死亡统计。Queensland Native Mounted Police的Hornet Bank和Cullin-la-Ringo报复不同事件及相互覆盖数据库组案保留各自口径；Barrow Creek纪念碑同时追述原住民雇员Jemmy。
- 新增**16个可追溯具名点及1条只有证据端点的虚线**：珀斯、Melbourne契约涉及地区、Sydney/Bourke/审判、Glenelg、Roebourne、Murujuga UNESCO景观、Barrow Creek、Boulia城镇及Bunuba已开放遗址，**零新增无据土地面积Polygon**。对原住民圣地、受害遗骨和没有原测绘确认的屠杀/战地保留空坐标或区域点。
- 研究审计：[T46来源地理审计](../../../docs/research/19C_T46_AUSTRALIAN_FRONTIER_SOURCE_GIS_AUDIT.md)；独立静态CI、桌面Chrome脚本和工作流随分支提交，当前索引状态`editorial_review/not_submitted`，须等PR全面检验、Pages成功才更新发布。下一优先依[T46长期待办](T46_NEXT_ACTIONS.md)调SROWA、QSA、GRG档案与Bunuba/Wurundjeri等当地资料。

## 2026-11-22 · T46五章全部正式发布（37+35项CI与双阶段Pages）

- T46生产[PR #509](https://github.com/1959124923wyz-sys/love-British-TV/pull/509)通过37/37全站检查后合并`main` SHA `5ebc9757a4e4129d2d1ccc6a11dbb8035b962ef9`：25节75段、48项结构化来源、39个事件跳转（10既有、29新增）、16具名GIS参考点/1虚线、0无据殖民领土Polygon。
- 主编正式公开[PR #510](https://github.com/1959124923wyz-sys/love-British-TV/pull/510)通过35/35全站Actions，含无预览URL的真实桌面Chrome跨1829—1899、单击跳年地图镜头、双击档案与返回、地图图层开关，合并SHA `4995474e0ec87496a59e878f310dd3b18979a3ea`。T46单专题状态`published/approved`，原T15/T26的编审状态未变。
- [正式Pages #44985306164](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44985306164) **build+deploy均成功**；[官网1838年入口](https://1959124923wyz-sys.github.io/love-British-TV/?year=1838)无需`review19c`。T46与T46.1—T46.5全部登记`published_new`，来源、GIS和原案待核研究仍独立续查。
- R2下一主要制作任务切换到**T05牙买加1865 Morant Bay戒严镇压与王室殖民治理**，具体原案、顺位、法令地理与数字计数限制见[T05执行清单](T05_NEXT_ACTIONS.md)。其它T15/T26等编审预览仍等各自来源核证。

## 2026-11-22 · 主编45 R2 T05 Morant Bay：两章18节长文及1865—1879年地图制作PR

- 新增[T05制作PR #512](https://github.com/1959124923wyz-sys/love-British-TV/pull/512)：T05.1/A01、T05.2/A-X14共18节54段历史正文，19条结构化史料来源，23个与正式1860年代年表对应的单击/双击事件链接。原26条研究卷年表、15制图线索与6待核问题继续保留。
- 1865—69新增4个具名地理参考点和1条仅有证据端点的虚线，1870—79新增1个Kingston英国王室殖民地行政延续点；没有伪造Surrey戒严边界、战地微址及殖民面积。来源审计详[独立T05 GIS研究](../../../docs/research/19C_T05_MORANT_BAY_SOURCE_GIS_AUDIT.md)。
- 1872年英国议会关于439死者、600鞭打和约1000毁屋的回述各属不同统计口径；Gordon/Bogle的23/24日处刑与军事审判依来源分列。文章状态先保留`editorial_review/not_submitted`，T37/T46已发表及T15/T26待审状态不动。
- 专用Node历史空间合同、1780×1020桌面Chrome互动脚本与T05 Actions工作流一并提交，正式CI/PR合并/Pages部署结果须另据实际运行更新。本批待调原卷详[T05长期待办](T05_NEXT_ACTIONS.md)。

## 2026-11-22 · T05制作PR47/47通过，独立正式出版审核

制作[PR #512](https://github.com/1959124923wyz-sys/love-British-TV/pull/512)已在47项全站Actions（包括1780×1020真实桌面Chrome和历史GIS严格审核）全部成功后合并至主分支 `734caec0adde77e447018934d7636e7340ffe109`。另按出版流程独立审核母专题的普通网站入口：T05.status=`published`，publication_review=`approved`，两章章节板=`published_new`，新增不带`review19c`参数的桌面浏览器门禁。正式出版PR自身的Actions与Pages构建/部署记录应在运行完毕后填写，不得提前声称成功。历史郡界、原地籍、逐人军法与财产登记疑问继续保持开放。

## 2026-11-22 · R2 T05正式出版与Pages归档完成

- 制作[PR #512](https://github.com/1959124923wyz-sys/love-British-TV/pull/512)在47/47全站Actions与桌面Chrome成功后合并（`734caec0adde77e447018934d7636e7340ffe109`）。
- 独立正式出版[PR #513](https://github.com/1959124923wyz-sys/love-British-TV/pull/513)在46/46 Actions成功后合并（`dd20fca460be9008524fe5e66a965bc85f9ccf8d`）；母专题`published / approved`，T05.1/T05.2工作板`published_new`，读者不需要`review19c`，并有真实桌面Chrome出入年表和图层验收。
- GitHub Pages [#44991739561](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44991739561)制作版和[#44992361081](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44992361081)正式版均已核实`build=success / deploy=success`。直接进入[1865年莫兰特湾主题地图](https://1959124923wyz-sys.github.io/love-British-TV/?year=1865)。
- 成果最终：T05两章18节54段、23新关联年表、19史料来源、1860年代4现代具名地名点与1文献端点虚线、1870年代1Kingston行政持续点；0无据控制区Polygon和0伪造面积。原26条研究卷保留，历史原文/地籍待核继续开放，详[T05长期执行表](T05_NEXT_ACTIONS.md)。**R2下一制作顺位 T14：东印度公司征服信德、旁遮普、阿瓦德。**

## 2026-11-22 · R2 T14「信德—旁遮普—阿瓦德征服与殖民掠夺」编审制作

- 重点以英国官方材料核查三地战争、强迫签约、财物没产及惩罚：1843米亚尼英军馆藏逾5000当地Baluch战斗伤亡（与民众遇害统计分开）；1848—1850信德战利品分配和纳皮尔回溯所获683522卢比（1877著作待原账）；1849第II条旁遮普国家财产全数没收与第III条光之山钻石交女王（英王室馆藏承认强迫签字）；1858勒克瑙凯萨尔巴格英军劫掠（英国家陆军博物馆明确记载），及阿瓦德有条件没产与1859重发地契。
- 已制作[T14三章29节87段长文](../../../data/stories/serial/e19-t14-sindh-punjab-awadh-conquest-expropriation-1842-1859.json)，采用30份选定来源和51条**既存**正式年表ID，原四份具体专题的状态与事件均不变；未造新战役/死亡数字。参见[51事件去重台账](../../../data/research/19c-t14-existing-event-crosswalk.json)。
- 1840年代增加米亚尼、奇利安瓦拉、古杰拉特三个已有年表地名参考点；已有1855阿瓦德示意旧界强制虚线、不授权实控填充和面积合计；旧海得拉巴、拉合尔、木尔坦、勒克瑙、凯萨尔巴格GIS继续复用。
- [独立来源、数字和GIS审计](../../../docs/research/19C_T14_CONQUEST_PLUNDER_SOURCE_GIS_AUDIT.md)保留原账户、军民伤亡、王廷财物、土地逐宗地籍8类未解问题；研究卷B06十条原事不删。
- 当前母专题 `editorial_review/not_submitted`、T14.1—.3 `review_ready`，已加入专用Node和1780×1020真实桌面Chrome制作门禁；后续见[T14_NEXT_ACTIONS.md](T14_NEXT_ACTIONS.md)。待PR和Pages验收再确认是否出版。

## 2026-11-22 · T14制作PR49/49通过并合并，正式出版独立审核

[T14制作PR #515](https://github.com/1959124923wyz-sys/love-British-TV/pull/515)全部49/49 GitHub Actions成功，含真实1780×1020桌面Chrome及51复用年表链接验证。主分支squash提交`5b97aede9766610784e983945585d86f6fca5bfa`。独立出版审批将母专题转为`published/approved`，三章T14.1—.3为`published_new`，并把T14正式写入`test_serial_story_contract.js`白名单；出版浏览器须不带预览参数运行。独立出版PR本身的CI和GitHub Pages部署结果尚须另行核实并写入长期交接。各地战役伤亡、原王廷财物、军官奖金、1849国家财产没收和1858地产归还按来源分列，原件继续待核。

## 2026-11-22 · R2 T14三章正式发表、真Chrome和GitHub Pages双验收结案

- [制作PR #515](https://github.com/1959124923wyz-sys/love-British-TV/pull/515)在49/49项GitHub Actions通过后合并`5b97aede9766610784e983945585d86f6fca5bfa`；另经[出版PR #516](https://github.com/1959124923wyz-sys/love-British-TV/pull/516) 48/48项CI和无预览参数真实桌面Chrome通过后合并`c580550e911242a039ddc29bb77cb9d83399e3be`。
- Pages制作版#44999188189和[正式版#44999746867](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44999746867)都通过**build/deploy双成功**。网站[1843年历史地图](https://1959124923wyz-sys.github.io/love-British-TV/?year=1843)正式专题状态`published/approved`、三章工作板`published_new`。
- 已发表29节87段、30来源及51项**全部复用**Sin/first-Sikh/second-Sikh/Awadh已考史实节点；新增3具名地名点和旧阿瓦德边界虚线（禁止控制填色与面积），不编造平民死亡数字。重点公开原英国议会和英军档对Talpur俘虏与战利品、锡克条约国家没产和光之山、凯萨尔巴格劫掠、阿瓦德没产公告与再授地契的证据。资料未核处见[T14长期执行清单](T14_NEXT_ACTIONS.md)。下一主制作候选T10爱尔兰大饥荒。
