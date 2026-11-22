# T26｜鸦片战争、赔款、条约港与英国对华贸易施压：史实、原案去重与历史 GIS 审核

**2026-11-22 · R1制作 · T26.1／T26.2／T26.3 · 主任务 [Issue #499](https://github.com/1959124923wyz-sys/love-British-TV/issues/499)**

## 一、交付边界

主专题 `E19-T26-OPIUM-WARS-CHINA-TREATY-PORTS`：十四节、四十四段正文、九十九个真实事件内链，研究时间1839—1899；为补足1830年代背景，另涵盖印度鸦片财政。二十三个新增事件对应 B01/B49/B67 原案；此前 B02 两次战争、圆明园事件直接使用既有正式ID，保留各地独立长篇，不重造事件或把同一损失重算。

新增 GIS：1840—1899 六个十年共 **48 个年度展示图元**，其中 **46 个具名地点图元**，**2 条历史行动关系虚线**。长期持续的重复十年图元使用同一 `stable_id`，不是把同一城市计成多处史实地点。五口×六个十年30个点，1877年四口×三个十年12个点，另台湾3个点、烟台1个点。**没有增加英国实际控制Polygon、没有伪造殖民面积**。

## 二、原案、既有正式地图、补写内容逐项去重

| 研究原案及章节 | 已有正式专题及事件 | 新增 | 处理口径 |
| --- | --- | --- | --- |
| T26.1 / B01 | `E19-OPIUM-TRADE-CRISIS`（1839）；`E19-OPIUM-WAR-TREATY-PORTS`（1840—1846）；已登记香港岛、舟山、鼓浪屿及印度工厂点 | 五口1843—1844各自开埠5个事件、跨十年口岸标记 | 原有战争、销烟、广州赎城、三元里起义和占城ID全部复用；签约权利/实际上岸/实开埠分别显示 |
| T26.2 / B02 | `E19-SECOND-OPIUM-WAR-CANTON`（1856—1859）；`E19-PEKING-LOOT-AND-CONVENTION`（1860—1865）及广州、北京、圆明园、九龙已有地物 | 与该主线的99个正文链接及1842年长江城市顺序虚线 | 英国与法国的驻军分列；鸦片条约税率与实缴款分开；不据1860条约杜撰九龙南部历史边线 |
| T26.3 / B49 | 既有正式图暂无这条连续安平行动链 | 1863脑馆1事件、1868安平6事件、1869舰船撤出1事件；安平古堡／台南／艋舺3点；安平—打狗1条关系虚线 | 海上封控、陆上暂驻及后续清方行政独立；古堡遗址参考点不能替代1868年炮位和港岸 |
| T26.3 / B67 | 现有1870s、1880s中国条约港事件及附加税则空缺 | 1875马嘉理案1（地理留空）、1876烟台签约／约款2、1877四口4、1885签附加专条1、1887通告／争议2；烟台点及四口跨年代12点 | 条约所载20万两、30+≤80两税则、1887追溯税争议各按原文口径，不误报为实收 |

研究档案源：`research/19c/consolidated/topics/T26.md`，原事件号 B01-E..、B02-E..、B49-E01–E08、B67-E01–E08；事实缺口原表 `tables/open-questions.csv`（T26共11条），地理线索 `tables/map-leads.csv`（18条）。源表保留不改。

## 三、重点条约和数值证据

- **英国国家档案馆 FO 93/23/1b、1842《南京条约》**：第II款五港商贸居留，第III款割让香港岛，第IV—VI款共21,000,000银元，6m鸦片赔付、3m行商欠款、12m军费。条文是**应付额**，收讫需另查财政凭据。原文核查入口：<https://worldjpn.net/documents/texts/pw/18420829.T1E.html>；英国国家档案馆馆藏介绍 <https://www.nationalarchives.gov.uk/education/teaching-resources/hong-kong-and-the-opium-wars/>。
- **英国军史与中国地方口岸记载**：1843广州新例7月27日，上海11月17日，宁波1844年1月1日，福州地方史1844年7月3日，厦门11月1日或2日存异。中华人民共和国地方及高校资料：<https://iqh.ruc.edu.cn/old/qdjjsyj/jjs_ztyj/dwmy/fd35f01bd03140d2b6e4ee1792407ea2.htm>、<https://fujian.gov.cn/xwdt/mszx/202504/t20250418_6902042.htm>、<https://zx.fuzhou.gov.cn/zz/gzwh/wszlhxxxcwyh/ttyw_2213/202505/t20250514_5018624.htm>。**开港日期、领事到任、开关征税不同层次，不用一个全国日期替代**。
- **1858上海通商税则 Rule V**：进口鸦片每担30两，外商在口岸销售、内地转运另有限制；资料：<https://worldjpn.net/documents/texts/pw/18581108.T1E.html>。该税率**不属于**1885年每100斤一箱的30+≤80两组合。
- **1860《北京条约》**：10月24日英约含8,000,000两约定、天津增列通商口岸、华人可与英国商人订约出洋、九龙南部及昂船洲割让；原文：<https://worldjpn.net/documents/texts/pw/18601024.T1E.html>；香港政府档案处1860租批及附图：<https://www.grs.gov.hk/ws/rhk/en/1860s.html>。三月租批、十月法律割让、1861实地接收三时点均独立。
- **1860圆明园劫掠**：复用 `E19-PEK-1860-LOOT`、`-PRIZE`、`-AUCTION`、`-BURN` 及王室如意入藏事件；英法共同夺物，1860年10月18—19日英军受令焚园；RCIN 70708按馆方实物纪录追，不能由一物推算整体损失。
- **B49台湾安平1868**：陈德智《清末臺灣安平砲擊事件之研究》，国史馆台湾文献馆《台湾文献》61(3)，pp.151–190、尤其175–186；原文索引/影印：<https://ws.th.gov.tw/002/TH/tjpdf20241015/var/www/html/new_site/05publish/03publishquery/02journal/tj/401061305.pdf>。1868年11月21—25日施压；26日登陆攻点；27日商人担保；12月2日归还衙署；海上行动延续至1869年1月18日。商人担保「四万元」的币种与最终归还、樟脑另项赔款的实收必须查收据，未在地图合并为总额。
- **B67《烟台协定》**：1876年9月13日中英签约，第I部分第5条有关20万两约款；美国同期抄件：<https://history.state.gov/historicaldocuments/frus1877/d57>；美国使节签约前报告：<https://history.state.gov/historicaldocuments/frus1876/d47>。收讫日期及分摊对象待核。
- **B67四港公布**：FRUS 1877 No.66 <https://history.state.gov/historicaldocuments/frus1877/d66>，中方通知宜昌、芜湖、温州、北海**1877年4月1日起准许外贸**。港区海关实际开征、商人首航及领事到任待地方逐港原簿。
- **B67 1885鸦片附加专条与1887争议**：FRUS1887 No.150 <https://history.state.gov/historicaldocuments/frus1887/d150>，1885-07-18伦敦签条，进口每100斤30两正税、≤80两厘金；1887-02-18美国公使照会记110两追征争议，**未取得实缴证据**。

## 四、地图 18 条研究线索与本次实际交付

| 研究线索 | GIS处理 |
| --- | --- |
| B01 Patna、Ghazipur、Calcutta | 已有1830/1840年代专卖、工厂、拍卖点；复用 |
| B01 Bombay、Lintin | 孟买马尔瓦制度写正文；伶仃洋流动趸船无原始船位，未虚构固定点、航路 |
| B01 Humen、Chusan | 复用虎门销烟、定海两度占领与1846归还及其明确时间窗 |
| B02 Yuanmingyuan、北京礼部会场 | 复用1860年代圆明园与北京行政点 |
| B02 Kowloon、Shameen | 复用已有九龙、沙面点和法律日期；九龙租批附图未配准，不生成新的真边线 |
| B49 Anping、Zeelandia、台湾府城/打狗 | 新增可引用的现代安平古堡遗址点、府城具名点；打狗是城市关系虚线端点，不是假定军舰航路 |
| B67 Chefoo、Ichang/Wuhu、Wenchow/Pakhoi、云南边境 | 新增烟台签字城市点、4口持续点；马嘉理遇害位置与路线尚未从历史地图核定，保留 **null** 坐标 |

**跨十年并非九处口岸长期都英国实际占据：**`t26-fiveport-*`（1843/44至1899，6段）与 `t26-chefooport-*`（1877至1899，3段）保持清朝地方控制 `political_controller:"qing"`；条约居留和贸易权益登记于 `legal_status`。不以现代城市边界裁剪历史租界。新增 `t26-anping-fort-1860s` 是古堡现代保护/旅游资料地点参考，不等于1868年精确炮位或港道；来源 <https://www.taiwan.net.tw/m1.aspx?id=147&sNo=0001016>。两条 `LineString` 均 `dash_only:true`，是史实端点顺序关系，**不代表行军GPS、船舶轨迹、炮火射程**。

全部48图元：`historical_boundary_confirmed:false`、`fill_authorized:false`、`territorial_claim:false`、`area_sqkm:null`、`exclude_from_area_aggregation:true`。不得将九个清朝城市当作九块英国殖民面积。本批没有历史土地Polygon。

## 五、验证与出版门禁

- 文章：`data/stories/serial/e19-t26-opium-wars-china-treaty-ports-1839-1899.json`。99个 `[[正式年表ID|史实词句]]` 贯穿14节。
- 挂载：`data/stories/serial/index.json`：`editorial_review/not_submitted`，独立预览，因待核材料尚未变更为 `published/approved`。
- 新年表：`chronology-1840-1849.json` 5个、`chronology-1860-1869.json` 8个、`chronology-1870-1879.json` 7个、`chronology-1880-1889.json` 3个；无原案支持的其他年代不造事件。
- 地理：`data/nineteenth-century-spatial-{1840..1890}*.geojson` 六段，叠加每十年正式事件，跳转遵循仓库单击迁年平移、双击阅读原事件规范。
- 核验：`node scripts/test_19c_t26_topic_map.cjs`；`python3 research/19c/consolidated/verify.py`；`verify_handoff.py`；`scripts/audit_spatial_semantics.py --strict`；公开文案门禁与真实桌面 Chrome `scripts/browser_19c_t26_topic.py`。
- 外部尚欠档案、具体行动、下一负责人记录见 `research/19c/consolidated/T26_NEXT_ACTIONS.md`。页面部署、PR号、合并SHA和Pages run须在通过验收后补记，不提前声称发布。

## 六、尚待核对但不影响已证点线的内容

参见 `research/19c/consolidated/tables/open-questions.csv` 所列11项：鸦片专卖毛/净收入议会原表、原奏折箱/袋数量异文、英海军定海撤军日志、五口领事原公告、第一次战争赔款银行收据；第二次战争清法军令及破坏、圆明园物件竞售价、1858/1860实收分款、九龙租地附图原界、安平担保返还及古港岸、烟台条约20万两实付和1885—1887鸦片征税原册。

缺少原件时保持数字来源归属和日期口径，不自动编写死伤人数、历史精确租界外缘或实际收款金额。

## 2026-11-22 · PR #503合并后的正式版本确认

- [PR #503](https://github.com/1959124923wyz-sys/love-British-TV/pull/503) 已经合并到 `main`：`53d9a7cb8287a6699b177b4a67126622cbb75aca`。
- 合并前 **35/35 CI 全部通过**。包括19C专项静态合同、`verify.py`、`verify_handoff.py`、严格GIS空间审计、公开文案审计、T26真实Chrome及现有16/17/18/19世纪回归。17世纪一个浏览器等待超时的偶发失败，经同一Git SHA重试后检查成功，无需更改历史源码。
- [T26 Chrome证据与截图](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44977109145)：1839总篇、1843上海、1868安平、1877宜昌、1885伦敦、双击原事件返回专题、1899地图仍可操作。
- [GitHub Pages正式部署run #44977462856](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44977462856)的 **build与deploy成功**；主站1839年预览 <https://1959124923wyz-sys.github.io/love-British-TV/?review19c=1&year=1839>。
- 数据和地图已进入主站，母篇仍是 `editorial_review/not_submitted` 历史研究编审预览。待核印证及地图真边界由 T26_NEXT_ACTIONS.md 长期持有，不提早上升为 `published/approved`。
