# T42｜巴索托索牛、强制缴械战争、鲸湾与贝专纳殖民法权：史料/GIS审计

日期：2026-11-23｜专题：T42｜阶段：published/approved｜制作#546 / 出版#547 / Pages#45143169780 build及deploy双成功（2026-11-23）

## 已完成制作内容

- 长篇文章三章20节、60段、27项有明文URL的研究/原始来源；与20条逐年事件关联（16条旧案、4条新证）；通过27处文章事件跳转。1852至1890年分四个年代文件保存。
- 在1870、1880、1890年代地图中新增6个WGS84**现代具名城市**参考点：鲸湾1878/1884，马塞卢1879/1880，伦敦1882/1890。
- 1852 Berea战场、Thaba Bosiu发信处、军营、已夺牛群实际分布、枪械战争村落、1890贝专纳电报线路与1878鲸湾历史界线，没有核验现场位置或当时地图边界，事件使用null坐标，未编造Polygon或面积。
- 正文中的“索牛10,000头”“实际夺牛4,500头”“1881裁决罚牛5,000头”均分别存档，既不相加也不推定全部实收。

## 证据链：武力、财产与责任

| 事件 | 史料可证部分 | 不确定/后续核档 |
| --- | --- | --- |
| 1852年12月英军索牛与Berea军事行动 | 卡思卡特军令记录Napier中校所部运回4,500头牛；Moshoeshoe停战信承认英军已带走大量牛 | 后世研究记10,000头索牛要求；各户损失、实际处置及返还未有独立账册 |
| 1879–1881巴索托解除武装战争 | 1880年4月6日缴械公告由开普政府推进；1881年议会质询确认政策责任和战争，英帝国政府与开普殖民执行者分开 | 伤亡及毁村村落清册待查；不把英国中央军队与开普骑枪兵混为同一部队 |
| 1881年4月Robinson仲裁 | 学术研究记5,000头罚牛、每枪每年£1许可费；英国下院记录首领请愿与后续争执 | 5,000头是裁决量；追查扣押、实际支付和各首领执行进度 |
| 1882年3月议会争论 | 议员披露罚牛过重、没收土地及被拘者家属劳动安排指控 | 议员指控需对照殖民公文与巴索托证词；不可当作逐案已判明事实 |
| 1878/1884鲸湾 | 英国海军1878年公告接管；1884年开普并入法及总督公报，后收入1911年国际边界裁决 | 具体港湾陆界与当地土地权利按当年测图继续核验 |
| 1885贝专纳与1890电报线 | 英国政府在保护国建立司法/行政主张；1890年议会公开为跨过当地首领土地铺设电报辩护 | 列具体首领同意、公司工程入地和当地补偿合同，不画未经核准的连续英国实控面 |

## GIS精度及政治责任

- 马塞卢：GeoNames 932505（27.48333, -29.31667）城市参考；没有把1852战场定位到此。
- 鲸湾：GeoNames 3359638（14.50528, -22.95750）城市参考；1878声索港口不是整个西南非。
- 伦敦：GeoNames 2643743（-0.1278, 51.5074）城市参考；英国议会史料发生于伦敦。
- 六点全部标注 `modern_named_city_reference_not_historic_site_or_boundary`、`exclude_from_area_aggregation=true`、`territorial_claim=false`、`historical_boundary_confirmed=false`；无新殖民面积。
- 补绘真实范围须核查历史地籍图、公告法定界、实际行政控制与部落首领政治疆域。证据不足的范围只保留研究层文字或虚线；避免用现代行政国界模拟19世纪控制。

## 精确引用清单

- **19C-T42-C14-S01**｜British Parliament：《Lords Chamber，Basutoland｜1880-02-09，搜 Basuto、disarm。同期上院答询》。https://hansard.parliament.uk/lords/1880-02-09/debates/8e1ea280-3e82-4297-9efc-e6a1622d8568/LordsChamber
- **19C-T42-C14-S02**｜Southern Journal for Contemporary History：《A Historical Context of Lesotho’s Integration into the 1910 Customs Union Agreement｜2021，Gun War 段。同行评审、区域研究》。https://journals.co.za/doi/10.18820/24150509/SJCH46.v2.3
- **19C-T42-C14-S03**｜British Parliament：《South Africa—The Basutos｜1882-03-14，Hercules Robinson 裁定与后续电报。同期下院答询》。https://hansard.parliament.uk/Commons/1882-03-14/debates/c643b64e-8d88-40e5-a12d-96f9d901488e/SouthAfrica%E2%80%94TheBasutos
- **19C-T42-C14-S04**｜British Parliament：《Commons Chamber，Basuto land and cattle｜1882-03-13，搜 confiscation of land and cattle。同期下院辩论》。https://hansard.parliament.uk/Commons/1882-03-13/debates/a785db00-1ca0-4790-a468-d5accd115955/CommonsChamber
- **19C-T42-C71-S01**｜George Cathcart / University of Pretoria：《Correspondence on Kaffraria, and on the Basuto and Orange River Sovereignty｜1856刊，印 pp.230–233；影像31–34；Moshoeshoe 信及12月22日 General Order。同期文》。https://repository.up.ac.za/bitstream/handle/2263/12526/006_p200-249.pdf?isAllowed=y&sequence=5
- **19C-T42-C71-S02**｜South African History Online：《Basotho Wars 1858–1868｜正文上半部1852先例。南非历史机构》。https://sahistory.org.za/article/basotho-wars-1858-1868
- **19C-T42-C71-S03**｜University of the Free State repository：《研究文本，Cathcart and Moshoeshoe｜Berea 章节，经引1852-12-21 Cathcart 回复。档案学术研究》。https://scholar.ufs.ac.za/server/api/core/bitstreams/cf4bb4c3-f7b9-48d4-b8dc-4ece9e2b24cc/content
- **19C-T42-C71-S04**｜University of Pretoria repository：《The Battle of Berea｜印 p.77，12月催缴记录。早期植民史汇编》。https://repository.up.ac.za/server/api/core/bitstreams/62735f16-7491-4c0f-aa09-410417439cfa/content
- **19C-T42-C71-S05**｜The Spectator Archive：《Foreign and Colonial｜1853-03-05，p.6。同期报刊》。https://archive.spectator.co.uk/article/5th-march-1853/6/forrigu-anh-colonial
- **19C-T42-C-X12-S01**｜英国下院 Hansard：《Africa (South)—Bechuanaland｜1885-02-23》。https://api.parliament.uk/historic-hansard/commons/1885/feb/23/africa-south-bechuanaland
- **19C-T42-C-X12-S02**｜开普敦大学开放库：《Margaret T. Peters｜The British Government and the Bechuanaland Protectorate, 1885–1895》。https://open.uct.ac.za/bitstream/11427/23566/1/Peters_Margaret_T_British_1947.pdf
- **19C-T42-C-X12-S03**｜英国下院 Hansard：《Bechuanaland｜1890-07-08》。https://hansard.parliament.uk/Commons/1890-07-08/debates/13334d77-c1c2-44b0-be4c-65acc5005a32/Bechuanaland
- **19C-T42-C-X13-S01**｜联合国国际裁决汇编：《The Walfish Bay Boundary Case (Germany, Great Britain)｜1911 裁决》。https://legal.un.org/riaa/cases/vol_XI/263-308.pdf
- **19C-T42-C-X13-S02**｜佛罗里达州立大学法律图书馆：《美国国务院｜International Boundary Study No. 125: South Africa–Namibia》。https://library.law.fsu.edu/Digital-Collections/LimitsinSeas/pdf/ibs125.pdf
- **19C-T42-HANSARD-BASUTO-1880**｜UK Parliament：《1880-05-25: Commons Basuto compulsory disarmament debate》。https://api.parliament.uk/historic-hansard/commons/1880/may/25/south-africa-disarmament-of-the-basutos
- **19C-T42-HANSARD-BASUTO-1881**｜UK Parliament：《1881-03-24: Lords Basutoland war and damage debate》。https://hansard.parliament.uk/Lords/1881-03-24/debates/4dc5d68a-f592-47d6-a4be-7e7c90ddfa07/LordsChamber
- **19C-T42-HANSARD-BASUTO-1883**｜UK Parliament：《1883-06-14: Lords Basuto war imperial finance debate》。https://api.parliament.uk/historic-hansard/lords/1883/jun/14/question-observations
- **19C-T42-NAMLEX-WALVIS**｜Legal Assistance Centre Namibia：《NAMLEX Background: Walfish Bay 1878 and Cape 1884 statutes》。https://www.lac.org.na/laws/NAMLEX_Background.pdf
- **19C-T42-CAMBRIDGE-BECH**｜Cambridge University Press：《Sekgoma and Bechuanaland protectorate legal scholarship》。https://www.cambridge.org/core/books/imperial-incarceration/detention-comes-to-court-african-appeals-to-the-courts-in-whitehall-and-westminster-18951922/15C03D021D48C0491B152ED53956E247
- **19C-T42-HANSARD-1881-RESP**｜UK Parliament：《South Africa—Basutoland, House of Lords 24 March 1881》。https://api.parliament.uk/historic-hansard/lords/1881/mar/24/observations-question
- **19C-T42-HANSARD-1882-LAND**｜UK Parliament：《South Africa—Basutoland, House of Commons 13 March 1882》。https://hansard.parliament.uk/commons/1882-03-13/debates/0ced203e-4e30-463d-97fc-412b97067be0/SouthAfrica%E2%80%94Basutoland
- **19C-T42-ELDREDGE**｜University of Wisconsin Press / South African History Online：《Elizabeth A. Eldredge, Power in Colonial Africa (2007)》。https://sahistory.org.za/sites/default/files/archive-files/elizabeth_a._eldredge_power_in_colonial_africa.pdf
- **19C-T42-LESOTHO-GOV**｜Government of Lesotho：《About Lesotho: 1871 annexation and 1884 direct Crown administration》。https://www.gov.ls/about-lesotho/
- **19C-T42-GEO-MASERU**｜GeoNames：《Maseru modern city centre》。https://www.geonames.org/932505/maseru.html
- **19C-T42-GEO-WALVIS**｜GeoNames：《Walvis Bay modern city centre》。https://www.geonames.org/3359638/walvis-bay.html
- **19C-T42-GEO-CAPETOWN**｜GeoNames：《Cape Town modern city centre》。https://www.geonames.org/3369157/cape-town.html
- **19C-T42-GEO-LONDON**｜GeoNames：《London modern city centre》。https://www.geonames.org/2643743/london.html

## QA与待办

- 已完成：制作#546及正式出版#547；1780x1020真实Chrome六次跨年份链接、图层与双击返回全部通过；Pages#45143169780 build/deploy双成功。
- 制作PR：静态专测T42 20/60/27/20/6、GIS strict、研究卷verify、正文合同、公共前端文案检测；不额外重复跨世纪Chromium长测。
- 独立出版PR：在`index.json`改`published/approved`，并运行T42一次1780x1020真实Chrome：年份、链接、图层、双击返回、非预览路径；随后Pages build+deploy。
- 待补证据：1852各户牧牛清册与战利品账；1880–1881枪械战争中的民用财产损害和土地没收个案；1881–1882殖民治安警与战俘家属劳务原卷；1878–1884鲸湾原界图；贝专纳签约原件与电报工程测量图。所有缺口不得由推断填数或虚构地图补足。
