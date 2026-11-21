# 第 5Y 批｜波斯湾与印度财政中心：57 个旧框退役、25 个具名地点

2026 年 11 月 21 日。承接主编36第 5X 批 #480，基线 `4e70feff61f87e8417c25c20f1e402d835e99e00`。本批以史料可核的港镇、商馆所在地与战场名称补绘，保留原始档案、日期与原记录 ID。

## 数据与制图

- 原 `data/eighteenth-century-b39-gulf-surat-factories.json` 的 36 条旧矩形和 `data/eighteenth-century-b37-india-ocean.json` 的 21 条旧矩形，各自写入 `superseded_by`，相应旧代理点同步退役；每一条有新的具名地点 ID。
- `data/eighteenth-century-editor36-5y-named-sites.json` 新增 25 个点，保留 57 条原记录的 `legacy_id`、各自标题、来源、类别与年代。年表按细项可逐条追溯，原始 B37/B39 源文件不删。没有证据证明港城城墙、商馆建筑墙线、公司海上航线或财政区边界精确位置，因此以现代同名城镇/港口附近具名位置锚点呈现，不将矩形换成所谓英国疆界；海路与税区无可靠实测范围则只入档案。
- 地理经纬度仅用于具名现代城市/港口的定位，在未完成历史地籍配准前不声明为十八世纪建筑的绝对坐标。地理误差没有实测值，因而不虚构误差公里数。地图数据 `area_sqkm: null`，不可据此累加历史占地。
- 原有地图数据中的详细历史争议、原来矩形和来源全部仍然保存；地图悬浮与详情只出现历史事实及来源。

## 地区与原档案交叉表

| 地区 | 新具名点 | 被替代的旧矩形 | 史料主体 |
| --- | --- | --- | --- |
| 波斯湾 | BUSHIRE、GOMBROON、BASRA、KUWAIT、BAGHDAD | B39-G-Z001—Z022 | 布什尔商馆、阿巴斯港交易记载、巴士拉与格兰迁驻、巴格达1798年驻员 |
| 印度西岸 | SURAT、BHARUCH、BOMBAY | B39-G-Z023—Z029、Z045；B37-I-Z023 | 苏拉特商馆日记、布罗奇税账、孟买及第一次英马战争 |
| 孟加拉 | MURSHIDABAD、PATNA、CALCUTTA、PURNIA、BHAGALPUR、DHAKA、PLASSEY、BUXAR | B39-G-Z039—Z044；B37-I-Z002—Z011（其中已退役的其他ID保持不变） | 财税委员会与1757、1764年战场 |
| 印度腹地 | TRICHINOPOLY、ARCOT、LUCKNOW、FAIZABAD、BENARES、PUNE | B37-I-Z017—Z024中实际仍使用的旧框 | 联盟、王公财政、贝古姆财产和1781年冲突 |
| 东南亚 | BENCOOLEN、PADANG、AMBON | B37-I-Z041—Z042、Z046、Z055 | 马尔伯勒堡胡椒经营、巴东1781年夺港、香料转运 |

新 ID 前缀统一 `EDITOR36_5Y_`。以上范围为按地点分组的档案编号，不表示该编号范围内所有记录均发生替换；准确替代名单见新 JSON 的 `retired_zone_ids` 和每个点的 `records`。

## 史料核定的关键日期

1. **布什尔（Bushire）**：英国东印度公司驻员和当地谢赫于 **1763 年 4 月 12 日**建立商务关系；英国图书馆 IOR/R/15/1 原件目录记录商馆在 **1769—1775 年暂停**，之后恢复。原 B39-G-Z004 是停办记载，保留为史料，地图不在暂停期显示公司贸易驻地。 [英国图书馆档案](https://searcharchives.bl.uk/catalog/037-000227428)
2. **巴士拉与 Grain（科威特）**：1793 年 4 月末塞缪尔·马内斯蒂离开巴士拉，同年 7 月起有从 Grain 发出的信件；1795 年 9 月重返巴士拉，10 月起的书信以 Maghil/巴士拉为发信地。故巴士拉驻地年段分为 1703—1792、1795—1799；Grain 为 1793—1795。不同地点在 1795 年同年显示代表两次交接在一年内发生。 [英国图书馆 IOR/L/PS/9/8](https://searcharchives.bl.uk/catalog/040-000544473) · [卡塔尔数字图书馆，巴士拉原信件](https://qdl.qa/en/archive/81055/vdc_100185017365.0x000056)
3. **巴格达驻员**：1798 年英方哈福德·琼斯作为公司 Resident 与当地帕夏交涉，原记录中的外交与商信具体年份分别保留。 [英印档案目录](https://searcharchives.bl.uk/catalog/041-000177265)
4. **孟加拉财税与暴力**：1765 年后 Diwani 财税经营、1772 年收入制度重组和地方官员的往来档案按各自年代保留。1757 年普拉西、1764 年布克萨尔及 1763 年巴特那遭遇战依原数据，避免将不同主体的战争结果都写成英方暴行。 [英国国家陆军博物馆](https://www.nam.ac.uk/explore/armies-east-india-company) · [英国图书馆印度事务档案检索](https://searcharchives.bl.uk/) · [埃克塞特大学孟加拉饥荒史料数据库](https://famineanddearth.exeter.ac.uk/displayhtml.html?id=fp_00353_en_comptrollingcommittee_4thfebruary-10thoctober1772)
5. **西苏门答腊与香料港**：明古伦、巴东和安汶仅在地方已有驻地、战事或交易证据范围内落点，具体旧堡几何沿用 5G、5W 已验收资料。 [剑桥大学出版社研究](https://www.cambridge.org/core/journals/journal-of-british-studies/article/making-and-unmaking-of-a-presidency-envisioning-empire-in-british-bencoolen-16851825/4C0CA8C6BF1E88181DA0CEACBC33C47A)

## 继任事项

- 本批清掉 57 条 **未配准的参考矩形**，并非 57 个新占领地；25 点中有同地点的多条史料分期。原 18 世纪旧矩形 197→140，1799 年显示的旧框 93→67。
- 1799 年新具名点是否沿用至 1800 年，需对照已有十九世纪历史点和档案。不得用跨世纪年表复制代替下一世纪已核来源。
- 第 5Z 批建议继续清理 1799 年仍显示的 67 条旧框，尤其 `B36` 财税地区与 `B38-H` 贸易走廊。拥有历史边线才绘虚线区域；其余按有据事件、地点、史实路线分别处置。
