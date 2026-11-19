# 1497—1799 年制图进展与待办｜主编 35 交接

2026 年 11 月 19 日复核。正式地图以 [主分支 ad5bde1](https://github.com/1959124923wyz-sys/love-British-TV/commit/ad5bde1ec740f23d1130bdb90f6e19073c38f2ee) 为统计基线，截至第 5J 批。打开 [1799 年地图](https://1959124923wyz-sys.github.io/love-British-TV/?year=1799) 可以用「下一年」查看 1800 年的接续。

## 当前盘点

| 时段 | 仍显示的旧矩形参考 | 待办重点 |
| --- | ---: | --- |
| 1497—1599 | 原盘点识别为 0 条 | 补清点只有点位或概略范围的加来、图尔奈、帕莱，以及莱伊什／奥法利和芒斯特没收地。 |
| 1600—1699 | 26 条 | 商站查万丹、苏拉特、胡格利，港堡查海岸角、丹吉尔，另查北美早期聚落。7 条默认隐藏的最大纸面特许范围另有档案。 |
| 1700—1799 | 345 条，其中 146 条在 1799 年显示 | 先查下方 92 条重点旧框，再处理其余 253 条。 |
| 合计 | **371 条** | [第 5D 批原始盘点 #457](https://github.com/1959124923wyz-sys/love-British-TV/pull/457) 共 403 条，后续六批累计替换 32 条。 |

计数单位是地图记录。同一地点可有多个时段或多条旧记录。1497—1699 的矩形数沿用 #457 的桌面盘点，十八世纪使用本次主分支数据重新计算。只有点位或尚未入库的范围仍待建立完整名录。

## 已上线批次

| 批次 | 已完成 | 当批替换旧矩形 | 批后十八世纪旧矩形 | 1799 年仍显示 | 批后跨年待核 |
| --- | --- | ---: | ---: | ---: | ---: |
| 5D 后的起点 | [盘点报告 #457](https://github.com/1959124923wyz-sys/love-British-TV/pull/457) | — | 377 | 171 | 38 |
| 5E | [黄金海岸沿岸堡垒](18C_GOLD_COAST_FORTS_HANDOFF.md) · [#458](https://github.com/1959124923wyz-sys/love-British-TV/pull/458) | 15 | 362 | 159 | 26 |
| 5F | [莫雷、塞尼亚贝拉库与阿克拉](18C_GOLD_COAST_MOREE_AND_ACCRA_HANDOFF.md) · [#459](https://github.com/1959124923wyz-sys/love-British-TV/pull/459) | 2 | 360 | 157 | 25 |
| 5G | [安汶、班达与北摩鹿加](18C_MALUKU_FORTS_AND_SPICE_HANDOFF.md) · [#460](https://github.com/1959124923wyz-sys/love-British-TV/pull/460) | 2 | 358 | 155 | 23 |
| 5H | [马六甲、河西旧城与南宁](18C_MALACCA_FORT_AND_PORT_HANDOFF.md) · [#461](https://github.com/1959124923wyz-sys/love-British-TV/pull/461) | 2 | 356 | 153 | 23 |
| 5I | [孟买港岛、萨尔塞特、塔纳与瓦赛](18C_BOMBAY_SALSETTE_THANA_HANDOFF.md) · [#462](https://github.com/1959124923wyz-sys/love-British-TV/pull/462) | 8 | 348 | 149 | 20 |
| 5J | [新不伦瑞克与圣约翰岛](18C_MARITIME_PROVINCES_HANDOFF.md) · [#464](https://github.com/1959124923wyz-sys/love-British-TV/pull/464) | 3 | **345** | **146** | **20** |

更早批次见 [十八世纪制图路线图](18C_CARTOGRAPHY_ROADMAP.md)。第 5J 批发布后，正式站桌面实点了拉茹瓦港 1758 年驱逐、马德堡 1774 年受降，并从 1799 年原位打开新不伦瑞克和爱德华王子岛的 1800 年档案。

## 接手顺序

- [ ] **第 5K 批先清五大湖重复旧框。** 先处理 `B36-Z014` 米希利麦基诺克旧堡和 `B36-Z016` 麦基诺岛新堡，联查 `B36-Z015` 的 1763 年夺堡记录与三者的代理点。把大陆旧堡和岛上新堡分开。岛堡已有 `MACKINAC_ISLAND_FORT` 和 1800 年的 `fort-mackinac-garrison-1800`，先比较年份及档案覆盖，尤其核对 1780–1781 年迁驻和 1796 年实际接防。逐条核准替代关系后，再处理安大略湖、尼亚加拉河和俄亥俄旧框。[魁北克与五大湖](18C_QUEBEC_BORDERLANDS_HANDOFF.md) · [安大略湖与尼亚加拉河](18C_LAKE_ONTARIO_HANDOFF.md) · [B36 旧框](../../data/eighteenth-century-expansion-batch36-1700-1799.json)
- [ ] **加勒比 44 条重点旧框按岛、港和短占时期归并。** 同一岛的驻防、行政和短期军事行动逐项对照。先核现有城港图能接替的记录，再找可配准的历史外廓。
- [ ] **西非 12 条重点旧框按堡和治理主体核查。** 复用已完成的黄金海岸驻堡。将堡址、港口交易和当地政权分别追到可证期限。与下方跨年表中的奥图阿姆、普兰普兰、温内巴、阿达等一并对照。
- [ ] **亚洲／印度洋 6 条、欧洲／地中海 1 条重点旧框。** 单列短占、驻防和行政。对照已完成的安汶—班达、马六甲、孟买等较细专题及各自档案。
- [ ] **把 20 条跨年待核逐条清账。** 有接续证据时更新稳定 ID、去向与首期状态。只有贸易、政治关系或原住民活动证据的条目保留对应语义。对旧矩形与跨年待核重叠的条目，同时更新两处状态。
- [ ] **补建 16、17 世纪点位及缺绘名录。** 记录时间、主体、地点和证据，分别查清可配准史图、定界条款及地方驻点。18 世纪其余旧框也按证据分别保留事件、点、线或面。
- [ ] **接续十九世纪研究归档。** [研究草稿 PR #463](https://github.com/1959124923wyz-sys/love-British-TV/pull/463) 为并行资料入库，待审内容含 59 个专题、150 个章节、1,980 条分章年表和 1,520 条史料索引。历史专题先核源档和候选地图 ID，地图发布状态查 [正式章节](../../data/chapters.json) 和 [专题索引](../../data/stories/index.json)。

## 92 条重点旧框逐条清单

逐条对照原盘点的 113 条驻防、行政及占领记录。下列 ID 在本次基线上仍使用旧矩形。同一地点的档案可能已经有较细的图形，后续须核验分期覆盖再登记替代。

<details>
<summary>北美大陆／北大西洋（29 条）</summary>

| 记录 ID | 原档案名称 | 1799 年显示 | 数据文件 |
| --- | --- | --- | --- |
| `B36-Z010` | 1750年代达特茅斯殖民港市 | 是 | [eighteenth-century-expansion-batch36-1700-1799.json](../../data/eighteenth-century-expansion-batch36-1700-1799.json) |
| `B36-Z014` | 1761年后米希利麦基诺克英国旧要塞 | — | [eighteenth-century-expansion-batch36-1700-1799.json](../../data/eighteenth-century-expansion-batch36-1700-1799.json) |
| `B36-Z016` | 1781年麦基诺岛英国新要塞 | — | [eighteenth-century-expansion-batch36-1700-1799.json](../../data/eighteenth-century-expansion-batch36-1700-1799.json) |
| `B36-Z019` | 1763年匹兹堡英军守堡 | — | [eighteenth-century-expansion-batch36-1700-1799.json](../../data/eighteenth-century-expansion-batch36-1700-1799.json) |
| `B36-Z035` | 1783后谢尔本保皇派移民定居港 | 是 | [eighteenth-century-expansion-batch36-1700-1799.json](../../data/eighteenth-century-expansion-batch36-1700-1799.json) |
| `B36-Z036` | 1783后迪格比保皇派定居港 | 是 | [eighteenth-century-expansion-batch36-1700-1799.json](../../data/eighteenth-century-expansion-batch36-1700-1799.json) |
| `B36-Z038` | 1776—1783斯塔滕岛英军后勤与驻扎区 | — | [eighteenth-century-expansion-batch36-1700-1799.json](../../data/eighteenth-century-expansion-batch36-1700-1799.json) |
| `B38-H-Z008` | 1717—1730 Churchill River Post英国公司据点 | — | [eighteenth-century-b38-hudson-company.json](../../data/eighteenth-century-b38-hudson-company.json) |
| `B38-H-Z009` | 1731—1771 Prince of Wales Fort英公司石堡建设 | — | [eighteenth-century-b38-hudson-company.json](../../data/eighteenth-century-b38-hudson-company.json) |
| `B38-H-Z010` | 1772—1781 Prince of Wales Fort英军商堡驻守 | — | [eighteenth-century-b38-hudson-company.json](../../data/eighteenth-century-b38-hudson-company.json) |
| `B38-H-Z011` | 1782法国舰队攻取Prince of Wales Fort | — | [eighteenth-century-b38-hudson-company.json](../../data/eighteenth-century-b38-hudson-company.json) |
| `B38-H-Z013` | 1783后Fort Churchill重新建立英商驻站 | 是 | [eighteenth-century-b38-hudson-company.json](../../data/eighteenth-century-b38-hudson-company.json) |
| `B38-H-Z017` | 1774 Cumberland House首处内陆HBC商馆 | 是 | [eighteenth-century-b38-hudson-company.json](../../data/eighteenth-century-b38-hudson-company.json) |
| `B38-H-Z022` | 1738后The Forks法国贸易站Fort Rouge | — | [eighteenth-century-b38-hudson-company.json](../../data/eighteenth-century-b38-hudson-company.json) |
| `B38-S-Z001` | 1780年英军在卡姆登军事驻镇近郊 | — | [eighteenth-century-b38-south-campaign.json](../../data/eighteenth-century-b38-south-campaign.json) |
| `B38-S-Z004` | 1780年Ninety Six英军筑星形堡局部 | — | [eighteenth-century-b38-south-campaign.json](../../data/eighteenth-century-b38-south-campaign.json) |
| `B38-S-Z006` | 1780年Augusta英军和保皇派驻堡局部 | — | [eighteenth-century-b38-south-campaign.json](../../data/eighteenth-century-b38-south-campaign.json) |
| `B38-S-Z008` | 1780年Fort Watson英方和保皇派防御堡 | — | [eighteenth-century-b38-south-campaign.json](../../data/eighteenth-century-b38-south-campaign.json) |
| `B38-S-Z010` | 1780年Fort Motte英国军驻扎 | — | [eighteenth-century-b38-south-campaign.json](../../data/eighteenth-century-b38-south-campaign.json) |
| `B38-S-Z012` | 1780年Fort Granby英国防御岗哨 | — | [eighteenth-century-b38-south-campaign.json](../../data/eighteenth-century-b38-south-campaign.json) |
| `B38-S-Z014` | 1780年Orangeburg英国和保皇派驻点 | — | [eighteenth-century-b38-south-campaign.json](../../data/eighteenth-century-b38-south-campaign.json) |
| `B38-S-Z016` | 1780年Fort Galphin英军和保皇派商馆堡 | — | [eighteenth-century-b38-south-campaign.json](../../data/eighteenth-century-b38-south-campaign.json) |
| `B38-S-Z038` | 1781年英军Wilmington补给港 | — | [eighteenth-century-b38-south-campaign.json](../../data/eighteenth-century-b38-south-campaign.json) |
| `BOSTON_GARRISON` | 波士顿英军占城与围困范围 | — | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |
| `CONNECTICUT` | 康涅狄格英属殖民行政参考 | — | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |
| `GEORGIA_COLONY` | 1732年后佐治亚英属殖民行政参考 | — | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |
| `NC_COLONY` | 北卡罗来纳英属殖民行政参考 | — | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |
| `SC_COLONY` | 南卡罗来纳英属殖民行政参考 | — | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |
| `WEST_FLORIDA` | 1763—1781英属西佛罗里达参考 | — | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |

</details>

<details>
<summary>加勒比／中南美（44 条）</summary>

| 记录 ID | 原档案名称 | 1799 年显示 | 数据文件 |
| --- | --- | --- | --- |
| `ANTIGUA` | 安提瓜英国殖民行政参考 | 是 | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |
| `B36-Z113` | 1795—1796英殖民政府被迫缩守圣乔治港 | — | [eighteenth-century-expansion-batch36-1700-1799.json](../../data/eighteenth-century-expansion-batch36-1700-1799.json) |
| `B36-Z115` | 1793—1797英军热雷米海港占据 | — | [eighteenth-century-expansion-batch36-1700-1799.json](../../data/eighteenth-century-expansion-batch36-1700-1799.json) |
| `B36-Z116` | 1793—1797英军圣尼古拉斯角驻军 | — | [eighteenth-century-expansion-batch36-1700-1799.json](../../data/eighteenth-century-expansion-batch36-1700-1799.json) |
| `B36-Z117` | 1794—1797英军太子港占据 | — | [eighteenth-century-expansion-batch36-1700-1799.json](../../data/eighteenth-century-expansion-batch36-1700-1799.json) |
| `B36-Z119` | 1781圣尤斯特歇斯Oranjestad英军抄没商产 | — | [eighteenth-century-expansion-batch36-1700-1799.json](../../data/eighteenth-century-expansion-batch36-1700-1799.json) |
| `B36-Z120` | 1781圣尤斯特歇斯港湾英军短期控制 | — | [eighteenth-century-expansion-batch36-1700-1799.json](../../data/eighteenth-century-expansion-batch36-1700-1799.json) |
| `B36-Z125` | 1782年巴哈马拿骚被西班牙军占领 | — | [eighteenth-century-expansion-batch36-1700-1799.json](../../data/eighteenth-century-expansion-batch36-1700-1799.json) |
| `B37-C-Z009` | 1781—1792 Tobago法军控制Scarborough | — | [eighteenth-century-b37-caribbean.json](../../data/eighteenth-century-b37-caribbean.json) |
| `B37-C-Z010` | 1793后Tobago Scarborough英军夺岛 | 是 | [eighteenth-century-b37-caribbean.json](../../data/eighteenth-century-b37-caribbean.json) |
| `B37-C-Z013` | 1794—1799英国占Martinique Fort de France | 是 | [eighteenth-century-b37-caribbean.json](../../data/eighteenth-century-b37-caribbean.json) |
| `B37-C-Z014` | 1794—1799英国占Martinique Saint Pierre港 | 是 | [eighteenth-century-b37-caribbean.json](../../data/eighteenth-century-b37-caribbean.json) |
| `B37-C-Z022` | 1781英军短占St Eustatius Oranjestad | — | [eighteenth-century-b37-caribbean.json](../../data/eighteenth-century-b37-caribbean.json) |
| `B37-C-Z024` | 1793—1797英军Saint Domingue Jérémie海港 | — | [eighteenth-century-b37-caribbean.json](../../data/eighteenth-century-b37-caribbean.json) |
| `B37-C-Z025` | 1793—1797英军Saint Domingue Môle St Nicolas | — | [eighteenth-century-b37-caribbean.json](../../data/eighteenth-century-b37-caribbean.json) |
| `B37-C-Z026` | 1794—1797英军Saint Domingue Port au Prince | — | [eighteenth-century-b37-caribbean.json](../../data/eighteenth-century-b37-caribbean.json) |
| `B37-C-Z030` | 18世纪Bermuda St George英方殖民港 | 是 | [eighteenth-century-b37-caribbean.json](../../data/eighteenth-century-b37-caribbean.json) |
| `B37-C-Z031` | 18世纪St Kitts Basseterre英殖民港 | 是 | [eighteenth-century-b37-caribbean.json](../../data/eighteenth-century-b37-caribbean.json) |
| `B37-C-Z032` | 18世纪Nevis Charlestown英殖民港 | 是 | [eighteenth-century-b37-caribbean.json](../../data/eighteenth-century-b37-caribbean.json) |
| `B37-C-Z033` | 18世纪Antigua St Johns殖民商港 | 是 | [eighteenth-century-b37-caribbean.json](../../data/eighteenth-century-b37-caribbean.json) |
| `B37-C-Z035` | 18世纪Montserrat Plymouth英殖民定居港 | 是 | [eighteenth-century-b37-caribbean.json](../../data/eighteenth-century-b37-caribbean.json) |
| `B37-C-Z036` | 18世纪Bahamas Nassau英国殖民港镇 | 是 | [eighteenth-century-b37-caribbean.json](../../data/eighteenth-century-b37-caribbean.json) |
| `B37-C-Z037` | 1782 Bahamas Nassau西班牙军事占领 | — | [eighteenth-century-b37-caribbean.json](../../data/eighteenth-century-b37-caribbean.json) |
| `B39-C-Z013` | 1762年英国占Martinique法属殖民岛 | — | [eighteenth-century-b39-caribbean-1759-1763.json](../../data/eighteenth-century-b39-caribbean-1759-1763.json) |
| `B39-C-Z014` | 1762年Martinique Fort Royal英军占港 | — | [eighteenth-century-b39-caribbean-1759-1763.json](../../data/eighteenth-century-b39-caribbean-1759-1763.json) |
| `B39-C-Z015` | 1762年Martinique Saint Pierre英占岛背景 | — | [eighteenth-century-b39-caribbean-1759-1763.json](../../data/eighteenth-century-b39-caribbean-1759-1763.json) |
| `B39-C-Z017` | 1763—1793 Martinique返还法方殖民统治 | — | [eighteenth-century-b39-caribbean-1759-1763.json](../../data/eighteenth-century-b39-caribbean-1759-1763.json) |
| `B39-C-Z026` | 1762 Saint Vincent英军占岛引发主权争议 | — | [eighteenth-century-b39-caribbean-1759-1763.json](../../data/eighteenth-century-b39-caribbean-1759-1763.json) |
| `B39-C-Z027` | 1762 Saint Vincent Kingstown英占殖民港 | — | [eighteenth-century-b39-caribbean-1759-1763.json](../../data/eighteenth-century-b39-caribbean-1759-1763.json) |
| `B39-C-Z039` | 1782 Saint Kitts法军短占期间英军失守 | — | [eighteenth-century-b39-caribbean-1759-1763.json](../../data/eighteenth-century-b39-caribbean-1759-1763.json) |
| `B39-C-Z040` | 1782 Nevis法军占领英属岛港 | — | [eighteenth-century-b39-caribbean-1759-1763.json](../../data/eighteenth-century-b39-caribbean-1759-1763.json) |
| `B39-C-Z041` | 1782 Montserrat英军失去岛上驻地 | — | [eighteenth-century-b39-caribbean-1759-1763.json](../../data/eighteenth-century-b39-caribbean-1759-1763.json) |
| `BARBUDA` | 巴布达英国殖民行政参考 | 是 | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |
| `CAYMAN` | 开曼群岛殖民隶属及奴役贸易参考 | 是 | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |
| `EAST_FLORIDA` | 1763—1783英属东佛罗里达 | — | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |
| `MARIE_GALANTE` | 玛丽加朗特1759—1763英军短占 | — | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |
| `MARTINIQUE_1762` | 马提尼克1762年英军短占 | — | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |
| `MARTINIQUE_1794` | 1794年后马提尼克英军占领 | 是 | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |
| `NASSAU_PORT` | 拿骚1783年归英后的岛港行政参考 | 是 | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |
| `NEVIS` | 尼维斯英国殖民岛屿参考 | 是 | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |
| `PORT_EGMONT` | 福克兰群岛Port Egmont英军短期据点范围 | — | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |
| `ST_KITTS` | 圣基茨英国殖民岛屿参考 | 是 | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |
| `ST_VINCENT` | 圣文森特1763后英属殖民争夺 | 是 | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |
| `TOBAGO` | 多巴哥1763及1793后英国控制 | 是 | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |

</details>

<details>
<summary>非洲（12 条）</summary>

| 记录 ID | 原档案名称 | 1799 年显示 | 数据文件 |
| --- | --- | --- | --- |
| `B37-A-Z003` | 阿诺马布Fort Charles旧英国堡 | — | [eighteenth-century-b37-africa.json](../../data/eighteenth-century-b37-africa.json) |
| `B37-A-Z006` | 1757后阿诺马布Fort William新英堡 | 是 | [eighteenth-century-b37-africa.json](../../data/eighteenth-century-b37-africa.json) |
| `B37-A-Z008` | Dixcove Fort Metal Cross英方堡 | 是 | [eighteenth-century-b37-africa.json](../../data/eighteenth-century-b37-africa.json) |
| `B37-A-Z018` | Gold Coast英荷丹葡多国堡垒共存 | 是 | [eighteenth-century-b37-africa.json](../../data/eighteenth-century-b37-africa.json) |
| `B37-A-Z019` | Gambia James Island英商据点 | — | [eighteenth-century-b37-africa.json](../../data/eighteenth-century-b37-africa.json) |
| `B39-A-Z001` | 奥图阿姆坦图姆奎里英商据点 | 是 | [eighteenth-century-b39-gold-coast-forts.json](../../data/eighteenth-century-b39-gold-coast-forts.json) |
| `B39-A-Z004` | 1742年Prampram Fort Vernon英方小型贸易堡 | 是 | [eighteenth-century-b39-gold-coast-forts.json](../../data/eighteenth-century-b39-gold-coast-forts.json) |
| `B39-A-Z007` | 1750前后英国Winneba贸易堡所在沿岸 | 是 | [eighteenth-century-b39-gold-coast-forts.json](../../data/eighteenth-century-b39-gold-coast-forts.json) |
| `B39-A-Z021` | 1783年Ada丹麦Fort Kongenstein建堡 | 是 | [eighteenth-century-b39-gold-coast-forts.json](../../data/eighteenth-century-b39-gold-coast-forts.json) |
| `B39-A-Z026` | 1700—1730 Anomabu Fort Charles英商旧堡 | — | [eighteenth-century-b39-gold-coast-forts.json](../../data/eighteenth-century-b39-gold-coast-forts.json) |
| `B39-A-Z029` | 1757后Anomabu Fort William英堡完工 | 是 | [eighteenth-century-b39-gold-coast-forts.json](../../data/eighteenth-century-b39-gold-coast-forts.json) |
| `SENEGAL_STLOUIS` | 圣路易斯堡英军港口占领范围 | — | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |

</details>

<details>
<summary>亚洲／印度洋（6 条）</summary>

| 记录 ID | 原档案名称 | 1799 年显示 | 数据文件 |
| --- | --- | --- | --- |
| `B37-I-Z037` | 1700—1713 Fort York Bencoolen英商旧堡 | — | [eighteenth-century-b37-india-ocean.json](../../data/eighteenth-century-b37-india-ocean.json) |
| `B37-I-Z044` | 1773—1774 Balambangan英东印度公司商站 | — | [eighteenth-century-b37-india-ocean.json](../../data/eighteenth-century-b37-india-ocean.json) |
| `B38-I-Z003` | 1751年Arcot城堡Clive据守并战胜围军 | — | [eighteenth-century-b38-india-mysore.json](../../data/eighteenth-century-b38-india-mysore.json) |
| `B38-I-Z007` | 1757年Chandernagore英军夺取法国商馆 | — | [eighteenth-century-b38-india-mysore.json](../../data/eighteenth-century-b38-india-mysore.json) |
| `B38-I-Z045` | 1784年Burma征服Arakan与英属Chittagong边境 | 是 | [eighteenth-century-b38-india-mysore.json](../../data/eighteenth-century-b38-india-mysore.json) |
| `B38-I-Z047` | 1784年缅甸王朝夺取Arakan的东部边境战事 | — | [eighteenth-century-b38-india-mysore.json](../../data/eighteenth-century-b38-india-mysore.json) |

</details>

<details>
<summary>欧洲／地中海（1 条）</summary>

| 记录 ID | 原档案名称 | 1799 年显示 | 数据文件 |
| --- | --- | --- | --- |
| `ELBA_1796` | 1796—1797英国短期占驻厄尔巴军事港岛 | — | [eighteenth-century-mass-schematic-zones-1700-1799.json](../../data/eighteenth-century-mass-schematic-zones-1700-1799.json) |

</details>

## 1799 → 1800 年尚待核对的 20 条

[期末台账](../../research/continuity/1800-1819/1799_1800_SPATIAL_HANDOFF.json) 已查 646 条期末记录，510 条关联到 1800 年公开几何。下表按原 ID 保留 20 条待核记录。原住民政权和活动范围需按其各自证据处理。

| 记录 ID | 原档案名称 | 数据文件 |
| --- | --- | --- |
| `B37-A-Z018` | Gold Coast英荷丹葡多国堡垒共存 | [eighteenth-century-b37-africa.json](../../data/eighteenth-century-b37-africa.json) |
| `B37-A-Z033` | Old Calabar Old Town当地商人政治活动 | [eighteenth-century-b37-africa.json](../../data/eighteenth-century-b37-africa.json) |
| `B37-A-Z038` | Ouidah原住王国及1727后Dahomey政治 | [eighteenth-century-b37-africa.json](../../data/eighteenth-century-b37-africa.json) |
| `B37-C-Z030` | 18世纪Bermuda St George英方殖民港 | [eighteenth-century-b37-caribbean.json](../../data/eighteenth-century-b37-caribbean.json) |
| `B37-C-Z035` | 18世纪Montserrat Plymouth英殖民定居港 | [eighteenth-century-b37-caribbean.json](../../data/eighteenth-century-b37-caribbean.json) |
| `B38-H-Z013` | 1783后Fort Churchill重新建立英商驻站 | [eighteenth-century-b38-hudson-company.json](../../data/eighteenth-century-b38-hudson-company.json) |
| `B38-H-Z015` | Cree Dene Inuit在Churchill河岸长期利用区域 | [eighteenth-century-b38-hudson-company.json](../../data/eighteenth-century-b38-hudson-company.json) |
| `B38-H-Z024` | Assiniboin原住民湖湾交易中介政治影响 | [eighteenth-century-b38-hudson-company.json](../../data/eighteenth-century-b38-hudson-company.json) |
| `B38-I-Z045` | 1784年Burma征服Arakan与英属Chittagong边境 | [eighteenth-century-b38-india-mysore.json](../../data/eighteenth-century-b38-india-mysore.json) |
| `B39-A-Z001` | 奥图阿姆坦图姆奎里英商据点 | [eighteenth-century-b39-gold-coast-forts.json](../../data/eighteenth-century-b39-gold-coast-forts.json) |
| `B39-A-Z004` | 1742年Prampram Fort Vernon英方小型贸易堡 | [eighteenth-century-b39-gold-coast-forts.json](../../data/eighteenth-century-b39-gold-coast-forts.json) |
| `B39-A-Z007` | 1750前后英国Winneba贸易堡所在沿岸 | [eighteenth-century-b39-gold-coast-forts.json](../../data/eighteenth-century-b39-gold-coast-forts.json) |
| `B39-A-Z012` | Sekondi附近Ahanta当地反欧洲据点行动背景 | [eighteenth-century-b39-gold-coast-forts.json](../../data/eighteenth-century-b39-gold-coast-forts.json) |
| `B39-A-Z021` | 1783年Ada丹麦Fort Kongenstein建堡 | [eighteenth-century-b39-gold-coast-forts.json](../../data/eighteenth-century-b39-gold-coast-forts.json) |
| `B39-A-Z033` | 1727后Ouidah当地Dahomey王国政治控制 | [eighteenth-century-b39-gold-coast-forts.json](../../data/eighteenth-century-b39-gold-coast-forts.json) |
| `B36-Z010` | 1750年代达特茅斯殖民港市 | [eighteenth-century-expansion-batch36-1700-1799.json](../../data/eighteenth-century-expansion-batch36-1700-1799.json) |
| `B36-Z011` | 18世纪大阴郁沼泽逃奴与原住民避难社区 | [eighteenth-century-expansion-batch36-1700-1799.json](../../data/eighteenth-century-expansion-batch36-1700-1799.json) |
| `B36-Z035` | 1783后谢尔本保皇派移民定居港 | [eighteenth-century-expansion-batch36-1700-1799.json](../../data/eighteenth-century-expansion-batch36-1700-1799.json) |
| `B36-Z036` | 1783后迪格比保皇派定居港 | [eighteenth-century-expansion-batch36-1700-1799.json](../../data/eighteenth-century-expansion-batch36-1700-1799.json) |
| `B36-Z047` | 1784后莫霍克社群迁往加拿大大河流域 | [eighteenth-century-expansion-batch36-1700-1799.json](../../data/eighteenth-century-expansion-batch36-1700-1799.json) |

跨年工作同时查 [1699 → 1700 面记录](../../research/continuity/1700-1709/1699_1700_PUBLIC_LAYER_HANDOFF.json) 和 [点位对照](../../research/continuity/1700-1709/OLD_1699_SPATIAL_POINTS_CROSSWALK.json)。改动一个跨世纪记录时，按稳定 ID 对照两边的时间、几何与年代归属。

## 更新这份交接清单

1. 从最新 `main` 读取数据。旧矩形按 `data/eighteenth-century-*.json` 中 `zones` 记录计数，记录有 `bbox`、无 `geometry`、无生效的 `superseded_by` 即计入。1799 年采用当年落在 `periods` 内的子集。用 ID 和源文件追踪去向。
2. 每批登记旧记录、新几何、起讫年份、归属、权威史料及跨年结果。近似历史边界用虚线。和约与实际交割分开，驻点、征收、贸易和控制范围按各自证据记录。为已被细图接替的记录保留原档案及替代关系。
3. 按 [AGENTS.md](../../AGENTS.md) 的检查和发布流程验收。空间审核用 `python3 scripts/audit_spatial_semantics.py --strict`，世纪接缝用 `python3 scripts/test_century_seam_handoffs.py`。桌面点验旧框退出、区域开关、史料档案和 1799 → 1800 的原位接续。
4. 在 PR 记下基线提交、所属批次、变更计数及剩余疑点。合并后核对 Pages，更新上方统计、批次链接与逐条待办。
