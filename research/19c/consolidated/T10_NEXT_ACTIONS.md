# R2 · T10 长期待办｜爱尔兰大饥荒、土地夺取与1849—1861逐佃

2026-11-22接手，执行分支 `feat/19c-t10-irish-famine-evictions-estates-20261122`。

## 制作阶段核对
- [x] 对照正式站旧7节/34关联事件、研究A08/A40/A35/A60，去重并保留原ID。
- [x] 完成两章28节84段专题及50条具名史料索引，32个已注册/新增有证事件跳转；旧34点保留不改。
- [x] 新增1861 Derryveagh六条年表事件，分开4月12日报刊与4月19日政府核定口径。
- [x] 1860年代莱特肯尼城镇1点；没有来源的逐户民房和司法售地Polygon一律不画。
- [x] 加入专用Node、Chrome及GHA测试和史料地理审计。
- [ ] 静态CI与1780x1020桌面Chrome真实验收（凭PR run记录）。
- [ ] 正式发布独立审校，合并后确认普通网站 `?year=1847` 与 `?year=1861`、GitHub Pages build/deploy。
- [ ] 发布后同步工作板 `published_new`、全部提交SHA、PR、Pages run。

## 第一优先原始罪证
1. 1847济贫法实施记录：各联合区四分之一英亩排除名单、撤地移民资助个案、Board of Guardians会议簿。英国议会法令§X、§XIII可证明制度，不能直接替代逐人实施簿。
2. 1849杜洛：原版Mayo Constitution 4月10日、补报死者及申请人数；Westport Board of Guardians调整查验地点的执行者与公函。
3. 1861德里维格：47份法院逐佃令、郡司法官逐户执行单、警方行动名册及毁屋记录。原下院正式数47令/244人，先期报刊估计45户/280人；两种口径保留。Letterkenny 43户主申请救济院的入院日及结果尚未确认。
4. 1849–1857司法售地：PRONI D/1201、MIC/80/2、D.2125；NLI MS_UR_081877（目录核实），按每宗买卖契约、买受人、是否带租、付价及受影响家庭逐项编码。PRONI给约3000庄园/500万英亩多年累计，不能作为当场被逐的地块清单。
5. 原研究底册T10共6项未解决问题继续开放；死亡、移民、逐佃、出售产权、灾区税与英国国库收益各建分母独立的表格。

## 地图下一阶段
- 查1861历史地籍、每个townland及Loughbarragh居民房址；有可靠原测图再画地块；界不清仅淡虚线无填色。
- 死亡点、屋舍、谷地行军路线不能由现代城镇中心点臆造；已经存在的Skibbereen、Kilrush、Ballinlass、Louisburgh、Delphi各点全部保留且不重复。
- 1861 Letterkenny点只是求济城镇锚，来源记录、GPS精度与非领土统计字段保留在GeoJSON；公众页面只展示史实。
- 下一主制作候选可转 R2 T21（英缅战争及财产转移）、T48（新西兰被没土地）；T10原件追查可继续追加独立PR。

证据和GIS审计见 [19C T10 专题审计](../../../docs/research/19C_T10_IRISH_FAMINE_SOURCE_GIS_AUDIT.md)。

## 已找到的下一轮原档入口（11月22日新增）
- [多尼戈尔郡档案馆 Board of Guardians 会议簿目录](https://www.donegalculture.ie/media/ohnnfugh/donegal-board-of-guardians-list-updated-2022.pdf)：定位1861-04-26至05-03 relieving officer report；取Shane Bradley、Anne Burke、Susan Moore等人的申请、收容结果原簿。
- [1861-06-24 Hansard](https://hansard.parliament.uk/Commons/1861-06-24/debates/254d4536-869b-45b3-b689-63616471e515/TheDerryveaghEvictions)：159名儿童、46住房中28揭顶/拆平、200警力及议员转述一名老人病亡（待独立死亡登记）。
- [1861-07-02 Hansard](https://hansard.parliament.uk/commons/1861-07-02/debates/e972ae9c-6ef6-45ac-97cc-a7e62a8f3ea0/DerryveaghEvictions)：调查动议23赞成、88反对；后续如查1861年度进一步诉讼及调查，需要明确议会没有通过该项特别调查。
