# 19C T21｜三次英缅战争、温托军事镇压、王室战利品与殖民米业：史料和GIS审计

**制作日期：2026-11-22。专题T21.1战争/武力接管/镇压、T21.2土地法/矿产/信贷/出口。** 保留研究案B09/B58/B72及全部相关既有事件ID，新增事件在原时间段数据中逐案核实。本文重点考察实际夺取的王室财产、当地军警伤亡、被毁聚落和行政控制，而非将出口毛额冒充英国国家掠夺纯利。

## 与正式地图去重

- 既有三个 **editorial_review/not_submitted** 的旧专题：`E19-BURMA-YANDABO`（第一次英缅战争，10节）、`E19-BURMA-PEGU-ANNEXATION`（第二次，6节）、`E19-BURMA-THIRD-WAR`（第三次，6节）。旧稿及各个原年表ID完全保留，不改其发表状态。
- 本次独立母篇 `E19-T21-BURMA-THREE-WARS-DISPOSSESSION` 总计 **36节97段、93来源、109个唯一正文事件内链**。其中 **97条年表ID复用**现有1820、1850、1880年代节点；**12条有原始证据的新事件**分别为：1876土地法1、1891 Wuntho事件10、1898/99年度出口1。
- `chronology-1870-1879.json` 加1876法，`chronology-1890-1899.json` 加10个1891战争节点及1899海关统计；旧已发布章节不改。
- `nineteenth-century-spatial-1890-1899.geojson` 添加 **Kawlin、Pegon、Wuntho、Pinlebu 4个现代具名地名Point**。历史山寨、寺院及被摧毁民房没有可靠当年测绘，不加未经确认的真实战场点、Polygon、占领道路或行政界面积。Wuntho镇的英国地方行政关系于1891后持续到世纪末，但不由一个点推算整个王国领土。

## 英国军事行动、镇压与财产接收——可核罪证

| 案件 | 最可靠证据 | 有依据的具体行动 | 统计/归属/后续缺口 |
| --- | --- | --- | --- |
| **1824–1826第一次英缅战争** | [英国国家陆军博物馆战史](https://www.nam.ac.uk/explore/first-burma-war)，[1826《杨达波条约》扫描](https://upload.wikimedia.org/wikipedia/commons/b/b0/Treaty_of_Yandabo.pdf) | 东印度公司远征军占仰光及沿伊洛瓦底江上行；第3、4条列若开及丹那沙林割让，第5条列1 crore卢比赔款（即一千万卢比） | 条约约定的赔款与实际各期入账、各地区驻军完全分开；不把地方主权声索混同 |
| **1852–1853第二次英缅战争** | [1852《伦敦宪报》战报](https://www.thegazette.co.uk/London/issue/21323/page/1529/data.pdf)、[英国下院1853-02-25辩论](https://hansard.parliament.uk/Commons/1853-02-25/debates/41602a5f-2a04-449a-aea9-ad9c8639a3d8/TheBurmeseWar) | 扣押缅王船只、英方索赔后攻占港口与勃固；1853年英军烧毁给抵抗者补给的村庄；勃固森林采伐权改由英国林务监管 | 烧毁村庄具体家数、强迁户数待英军原报/地方名册；不能用暂时军占面积代替正式划界 |
| **1885曼德勒掠夺** | [英国国家陆军博物馆年表](https://www.nam.ac.uk/explore/timeline-burma-army)、[Daw Kyan (1979), Prizes of War](https://www.burmalibrary.org/en/prizes-of-war-1885) | 英军进入曼德勒并迫使王室离境，接收王室首饰、礼仪器物、船、军械、象、马、地产，英属印度成立战利品委员会办理出售、分配 | 失散宝物归属及交易价款不以轶闻确定，优先搜1885–87 Prize Committee account、印度部交接单 |
| **1891-02-19 Kawlin山上佛塔** | [J. G. Scott / J. P. Hardiman, 1900, Gazetteer Pt I, p.181](https://www.burmalibrary.org/docs21/Scott-JG-1900-Gazetteer-Pt1-Vol1-tu.pdf) | 英方原官志称Prakasa Roya指挥士兵攻入佛塔寨垒，杀死在内的所有守卫者 | 英官志未写出被杀人数、是否投降及姓名；记录中英军自报3死6伤，不能将“所有”换算成虚构人数 |
| **1891-02-20 Pegon** | [同上官志p.181](https://www.burmalibrary.org/docs21/Scott-JG-1900-Gazetteer-Pt1-Vol1-tu.pdf) | 官志明确记录英军Keary与Kenny摧毁温托抵抗者集结地Pegon | 现有[现代Pegon地名](https://mapcarta.com/14946624)在Kawlin西北约3km；同名历史村须另查官志配图/原地籍，毁房具体损失不明 |
| **1891-02-22 Kyaingkwintaung** | [官志p.181](https://www.burmalibrary.org/docs21/Scott-JG-1900-Gazetteer-Pt1-Vol1-tu.pdf)、[英国陆军博物馆山寨照片](https://collection.nam.ac.uk/detail.php?acc=1991-01-33-17) | 英印军攻河边山寨并截断撤路；官志称当地防守者**50人被杀**，英军3死、15伤 | 50是英国军方报告，不是独立验尸名单；历史寨位及墓地坐标未取得 |
| **1891-02-22 Okkan/Monan寺院** | [官志pp.181–182](https://www.burmalibrary.org/docs21/Scott-JG-1900-Gazetteer-Pt1-Vol1-tu.pdf) | 另场交战官志报当地防守者**27死**，英军Hutchinson受伤后死亡 | 两战不按同一地点汇总，需独立名单交叉验证 |
| **1891-02-25 Mankin** | [官志p.182](https://www.burmalibrary.org/docs21/Scott-JG-1900-Gazetteer-Pt1-Vol1-tu.pdf) | 英军绕过山口，炮击有栅栏的Mankin村落 | 原官志未给出村民伤亡、各栋民房毁损，未推测经纬度 |
| **1891-02-24至03-19 Wuntho** | [官志pp.181–184](https://www.burmalibrary.org/docs21/Scott-JG-1900-Gazetteer-Pt1-Vol1-tu.pdf)、[剑桥大学RCS Y3029A/15照片和说明](https://www.repository.cam.ac.uk/items/af22387d-96ce-4761-83eb-8f3b45b95028/full) | 2月24日英军进温托，27日占Pinlebu；当地Sawbwa被废黜，旧政区转入英国官署；剑桥馆藏提3月19日财政官报告抵抗结束 | 英国官志声称交出约3000件武器，与抵抗者人数/被杀人数完全不同，不换算；宫室烧毁的执行者在官志中未指明 |

**参与者辨析：** 1891年2月15—16日Kawlin等殖民哨所被当地抵抗者袭击并起火；不能将这部分损坏归给英军。英军毁Pegon、炮击Mankin、攻佛塔和Kyaingkwintaung则有1900年**殖民编修官自己的直接书面记录**。

## 经济与土地有据口径

- [**1876 Burma Act II原文（1910汇编）**](https://www.burmalibrary.org/sites/burmalibrary.org/files/obl/1876-01-18-GB-No.2-tu-en.pdf)：第4条的保留林、公共用途和宗教场所例外，第7条认可地权的居住/纳税条件，第8条可继承转让权和政府税收/矿物保留。汇编包含1898、1907等后续修订脚注，版本分离，不能把后修内容填回1876年。各县实施和执行个案待收入官原卷。
- [**程锡华《The Rice Industry of Burma》，Appendix I.A印页238**](https://bookshop.iseas.edu.sg/component/get/15251)：1898/99贸易年度原表 **Rangoon 906,082 / Akyab 115,171 / Bassein 150,720 / Moulmein 118,901 / Other 7,571 / Total 1,298,445 Tons**，原表说明稻谷按67%换算为米。保留原Tons原单位及运出数量性质；不能由出口量推算英国国库收入、米商利润或被夺田亩。
- [**Robert V. Turrell (1988), Cambridge University Press**](https://www.cambridge.org/core/journals/modern-asian-studies/article/abs/conquest-and-concession-the-case-of-the-burma-ruby-mines/6131474B3F394AFEE32F86629E92BEF0)：1886吞并后抹谷矿权特许涉及英国资本、游说及英国议会争议，追IOL Mss. EUR.F. 130等函件可细查批准、转租、收益。
- [**Sean Turnell, The Chettiars in Burma**](https://research-management.mq.edu.au/ws/portalfiles/portal/23070650/mq-6878-Author%20final%20version.pdf)：下缅甸产权转让、土地抵押与信贷机制；二十世纪统计的农村失地比例不可移作十九世纪数。

## 新图层实测锚点

| GIS ID | 现代公开地名坐标（WGS84，lng/lat） | 1891有据行为 | 边界精度/风险 |
| --- | --- | --- | --- |
| `t21-kawlin-town-wuntho-1891` | [95.67770,23.79397](https://mapcarta.com/14985406) | Kawlin军警哨所遇袭、英军由此攻附近佛塔和Kyaingkwintaung | 仅镇中心；山寨在镇外，未定点 |
| `t21-pegon-modern-named-place-1891` | [95.66254,23.81455](https://mapcarta.com/14946624) | 英军摧毁Pegon | 现代同名聚落候选，需殖民地图排除同名异地 |
| `t21-wuntho-town-1891-annexation` | [95.68560,23.89890](https://mapcarta.com/14917676) | 英军进城、Sawbwa废黜、缴械、殖民直辖 | 仅镇中心，宫殿/城墙/农地各待核 |
| `t21-pinlebu-1891-occupation` | [95.38115,24.09043](https://mapcarta.com/14945590) | 英军接管首领驻地 | 仅镇中心，Mankin山口绝不挪用Pinlebu坐标 |

4个新Feature全部 `Point`，`historical_boundary_confirmed=false`，`fill_authorized=false`，`territorial_claim=false`，`area_sqkm=null`，`exclude_from_area_aggregation=true`。1891战争逐日事件和四点可通过交互阅读器点击；旧1820、1850、1880年军事点和持续英国实际行政锚保留。

## 下一步须取得的原档

1. 1891 Wuntho英印军报（Prakasa Roya/Keary/Davies/Hutchinson具体军报）、佛塔守卫者名单与Pegon居民的民房/粮食损失清册，英国印度事务部相关材料及当地口述史，查山寨当年精确位置。
2. 1891 Wuntho王国与Katha、Ye-u行政改隶原公告及原测地图；需要澄清1891实际管治与后来历史地图对王国结束年份的不同口径。
3. 曼德勒Prize Committee 1885–1887登记/拍卖/王室赠品/财政账，比较Daw Kyan研究和现存英国博物馆藏品登记。王宫王室被带离与具体珍宝失踪分案，不编造价值。
4. 第二次英缅战争1853年英军烧村和迁民执行者、下缅甸林务征收原卷。1852军事占领与1857界线绘图分开。
5. 下缅甸1876土地法各地区施行公报、地权案裁判、旧权利持有人与租税历史；1898/99稻米各港海关原始年册与价格，计算农户及殖民国库分账。
6. 与T20、T23缅甸森林和印度财政线索做原账索引，不把印度军费拨款、王国罚款请求、实收王宫财产或公司出口值加为同一“掠夺总额”。

## QA与发布

- 制作母篇 `editorial_review/not_submitted`，不影响三个旧独立编审故事或当前已发布T05/T10/T14/T37/T46。
- 专项测试 `node scripts/test_19c_t21_burma_wars.cjs`，真实1780×1020 Chrome `scripts/browser_19c_t21_burma_wars.py`，已配 `.github/workflows/19c-t21-burma-wars.yml`；严格检查109历史事件、12新事件、4地理点、法令和海关统计数字。
- 仅当制作PR通过仓库required checks和桌面测试并合并后，独立出版PR方可改为 `published/approved`，出版检查及Pages构建部署均应追记真实运行链接。当前不得提前宣称上站。

## 制作PR核准与正式出版候审（2026-11-22）

[制作PR #521](https://github.com/1959124923wyz-sys/love-British-TV/pull/521) 已合并：`805d2706f7cf5c9f068cd871fd2bd985e34e17d0`。两章36节97段、93来源、109有历史ID的事件链接，1891温托4个现代具名Point；严格GIS、桌面Chrome与强制交互检查已经通过。独立公开版本在 `release/19c-t21-burma-wars-publication-20261122` 待审核，`published/approved` 标记需发行PR主干合并和Pages实际build/deploy验收后才可称为正式上线。历史原地图、村民损失和王室财物去向仍按原始归档待追。

## 正式出版后核证与遗留原档（2026-11-22）

- 生产 [PR #521](https://github.com/1959124923wyz-sys/love-British-TV/pull/521) 51/51 GitHub CI通过，合并SHA `805d2706f7cf5c9f068cd871fd2bd985e34e17d0`；出版 [PR #522](https://github.com/1959124923wyz-sys/love-British-TV/pull/522) 50/50 CI通过，合并SHA `99e184ce9df619aded745c4253dce46dad4d6652`；[Pages #45007048591](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/45007048591) build/deploy均成功。
- T21`published/approved`，36节97段93来源109真实历史事件内链；新增4个现代地名WGS84点，不把当年山寨或地方王国边线虚构成实测GIS；两个章节在59专题、150章节工作板已正式记`published_new`。
- 后续原件执行清单：[T21_NEXT_ACTIONS](../../research/19c/consolidated/T21_NEXT_ACTIONS.md)。尤其调查英方2月19日在Kawlin佛塔内杀死全部守卫者的**确切人数**、2月20毁Pegon逐户财产账、2月25炮击Mankin损失与1885王宫战利品委员会实际接收、转卖及现馆藏档案。
