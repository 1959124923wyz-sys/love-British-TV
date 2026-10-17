# 爱英TV｜蛇E分身02｜重大历史专题40、41独立研究交接（2026-10-17）

分支：`feature/snake-e-02-cavendish-armada-40-41-20261017`。**待主编审核与合并，不得直接将独立分支称为正式上线。**

## 一、总体交付

### 专题40｜1587—1592年卡文迪什跨洋私掠与巴西港口袭击
- `data/stories/cavendish-pacific-brazil-privateering-1587-1592.json`：14节、约3900个中文字词混合字符的面向公众长文。
- 事件承接：`PAC1587-CAVENDISH-QUINTERO`、`1580S-E025`、`1590S-E005`、`1590S-E009`。新增：1587普纳岛西班牙军反击、圣安娜号被带走的亚洲少年、1588环球返英、1591新舰队从普利茅斯出航、伊利亚格兰德居民遭抢、1592麦哲伦海峡受阻、桑托斯再袭失败、维多利亚击退英船、圣塞巴斯蒂昂留下伤员、卡文迪什海上死亡。
- *航次分离不可破坏*：**1586—1588为首次成功环球航行**（1587金特罗与普纳岛、圣卢卡斯角劫获圣安娜号）；**1591—1592是另一艘舰队的失败远征**（巴西、麦哲伦海峡、再度袭击失败）。前者1588年返英，后者1591年重新出港，不能连成同一艘船未间断的1588→1591航线。用`voyage_id`分别保存。`ch10-cavendish-1587-`两段属于第一航次；`ch11-cavendish-`两段属于第二航次，均是具名地理端点的**示意顺序线**，不是航海日志坐标串。
- 第一次圣安娜号遭劫源见W. Michael Mathes编多方当事人证词目录与DNB19世纪英国传记；后者明确提到被带上英船的日本及马尼拉少年，但现有材料不足以证明其全部属于法律意义上的奴隶或后来均在市场被出售。保留“强行带走”并拒绝编造人数去向。
- 巴西国家图书馆 Sheila Moura Hue研究核实**1591年12月25日**英军乘弥撒袭击桑托斯，撤离前于**1592年**劫掠并焚烧圣维森特；后又折返袭击桑托斯、维多利亚，两次均遭当地人抵抗失败，随后留下Knivet等伤病人员。既有两座港城原事件保持，新增两次居民胜利但不倒填为英军抢城成功。
- 第一航次1587年普纳岛袭击取自Society for Nautical Research论文摘要，未声称已取得全文。Quintero沿用智利国家图书馆与海事研究的原记录，不添加无证死亡总数。
- 新增的全部地点只是现代岛屿/港市/海峡参照，非船舶泊位GPS。没有提供Santos、São Vicente等城镇的实测燃烧区多边形，故不新增“袭掠灾区面”。

### 专题41｜1588年西班牙舰队爱尔兰海难、幸存者遭杀害与庇护
- `data/stories/spanish-armada-ireland-wrecks-killings-refuge-1588.json`：14节约4000字面向公众连续历史文。
- 承接6个既有事件：`ARM1588-STREEDAGH-STORM`、`ARM1588-STREEDAGH-SHORE-KILLING`、`ARM1588-ROSCLOGHER-REFUGE`、`ARM1588-CLARE-SPANISHPOINT-EXECUTIONS`、`GAP1588-SLIGO-ARMADA-EXECUTIONS`、`ARM1588-SLIGO-OHART-TORTURE`。
- 新增4个互不重复事件：金纳戈湾`La Trinidad Valencera`沉船（爱尔兰地质调查局）、伊尼什欧文地方武装杀害幸存者（History Ireland；未定位）、巨人堤道`La Girona`风暴沉船（阿尔斯特博物馆）、`La Juliana`船员Pedro Blanco入奥尼尔家臣队伍（爱尔兰政府2025年出版物；未定位）。
- `ch10-cuellar-1588-streedagh-rosclogher-refuge`是仅表示德·奎利亚尔从沉船海岸进入地方家族庇护的**地点先后示意线**，非实测足迹，也不等于英国驻军的行军和占领区。
- 原地图已包含斯特里达沉船、罗斯克洛赫庇护、克莱尔绞刑、斯莱戈北部O’Hart酷刑四块虚线非主权历史阅读区，均保留，不叠加无依据的大面积椭圆。

## 二、人数核证与不可相加原则

| 数值 | 权威来源 | 对象与口径 | 禁止误读 |
|---|---|---|---|
| **至少700** | 皇家爱尔兰学院DIB George Bingham传记，2009年版 | 1588年9—10月斯莱戈与梅奥沿海，乔治·宾厄姆监督处决的**西班牙幸存士兵**，跨多个地点 | 不等于Streedagh海滩单点处决人数，不与其他统计简单相加 |
| **1,100余名** | 2025爱尔兰政府/国家古迹局与西班牙文化部联合研究 | Streedagh三船海难时及随后数日全部死亡，包含风暴溺亡与后续杀害 | **不是1100人均由英王军杀害**，其范围与康诺特处决统计可能重叠 |
| **约1,300船上人员、仅5人生还** | 阿尔斯特博物馆Girona沉船藏品说明 | 与Streedagh不同的另一船La Girona，安特里姆近海暴风失事 | 主要属风暴海难，不能算英军处决 |

不产生三组数字的合计或模拟死因拆分。另由皇家爱尔兰学院DIB Richard Bingham传记确认理查德记录沉船并监督杀害幸存者，他与乔治属于兄弟但其行为不得混成一个人在每地亲自指挥。当地盖尔家族也有完全不同反应：奥罗克与麦克兰西庇护一些幸存者，奥尼尔部下另有对其他幸存者的杀害记载。克莱尔郡治安官绞刑与海难溺亡是不同性质的事件。

## 三、地理精度

1. **Kinnagoe湾**：Geological Survey Ireland ND006给出White Strand的ITM(EPSG:2157) `E662800 N946130`。转换WGS84约 `55.258304,-7.012110`，这是现代海岸研究参照位置，非La Trinidad Valencera历史船体精确坐标；该官方PDF原文记船于1588年9月16日沉没。
2. **Girona**：现代巨人堤道附近概略点 `55.24,-6.52`；海底考古界、碰撞岩点、船身分布尚未核实，不建立精确受灾面。
3. **Puná**、**Vitória**、**Ilha Grande**、**São Sebastião**、**Magellan Strait**：均为现代地区参考，不声称已从16世纪船员日志取得GPS。
4. **不设地图坐标**：Santa Ana船上亚洲被带走者的转移地点、伊尼什欧文具体杀害地点、Pedro Blanco具体住宿点、卡文迪什海上去世位置；用`lat:null,lng:null`，原版交互会展示史事而不伪造地标。
5. 两章节新增殖民地`colonial_polygons`数量**0**；新增路线一律标`schematic-only-not-historical-track`和`verified_English_territorial_control:false`、`actual_area_sqkm:null`。

## 四、核证资料（可直接调用）

- 巴西国家图书馆：<https://bndigital.bn.gov.br/artigos/ingleses-no-brasil-relatos-de-viagem-1526-1608/>
- 智利国家图书馆：<https://www.memoriachilena.gob.cl/602/w3-article-619.html>
- 英国海事研究协会Puná论文摘要：<https://snr.org.uk/thomas-cavendishs-visit-puna-island-1587-2/>
- Hakluyt史书参与者John Jane（转印PDF目录及摘录，非冒充已读全文）：<https://archive.org/details/voyagesofelizabe00hakliala>
- 旧英国国家人物传记辞典：<https://en.wikisource.org/wiki/Dictionary_of_National_Biography%2C_1885-1900/Cavendish%2C_Thomas>
- 日本和马尼拉乘员的《圣安娜号》多方证词辑本目录：<https://books.google.com/books/about/The_Capture_of_the_Santa_Ana_Cabo_San_Lu.html?id=7N48AAAAMAAJ>
- 爱尔兰和西班牙政府2025年联合Cuéllar研究：<https://www.gov.ie/en/department-of-housing-local-government-and-heritage/press-releases/new-irishspanish-joint-publication-reveals-the-fascinating-story-of-captain-cu%C3%A9llar-1588-spanish-armada-shipwreck-survivor/>
- UCC CELT Cuéllar参与者书信：<https://celt.ucc.ie/document/T108200/>
- 皇家爱尔兰学院DIB George：<https://www.dib.ie/biography/bingham-byngham-sir-george-a0664>；Richard：<https://www.dib.ie/biography/bingham-byngham-sir-richard-a0665>
- 阿尔斯特博物馆Girona：<https://www.ulstermuseum.org/history-galleries>
- 爱尔兰地质调查局Kinnagoe：<https://gsi.geodata.gov.ie/downloads/Geoheritage/Reports/ND006_Kinnagoe_Bay.pdf>
- History Ireland伊尼什欧文处决史：<https://historyireland.com/gaelic-lordship-and-tudor-conquest-tir-eoghain-1541-1603/>

## 五、QA与上线计划

- 新静态：`node scripts/test_cavendish_armada_stories_1587_1592.js`；两篇符合`atlas-major-story-v1`并写入`data/stories/index.json`，第40跨1587—1592，第41只用1588年事件；每篇不少于3000字、14节、12条以上有据内链。
- 新浏览器：`python scripts/browser_cavendish_armada_stories.py`；直接测试1587→1588→1591→1592跨章专题和1588风暴/杀害/庇护区别。
- 已同步受新事件影响的旧十年数量与年度浏览器检查，加入重大历史专题CI及Pages的发布前门禁。
- 本分支基于当前主分支已上线的第33、34研究集成，历史传承保留。主编须审查源级访问范围、测试报告、上线时期的真实浏览器结果以及与其他分身PR的事件ID冲突，确认无误后才可合并`main`并等待Pages真实部署成功。**没有得到明确上线指令前维持草稿PR。**
