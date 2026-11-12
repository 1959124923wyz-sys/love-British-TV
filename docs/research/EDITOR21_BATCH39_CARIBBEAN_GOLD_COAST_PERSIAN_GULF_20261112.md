# 主编21｜18世纪第39批大地图：七年战争加勒比海、金海岸多国堡垒与波斯湾商站（2026-11-12）

## 用户目标及继承
爱英TV优先表现**英国殖民侵略、奴役贸易、占领与撤退的动态地图**，要求“量大管饱”、精度可概略，但历史记录必须真实且可溯源。第38批 Draft PR #333 的head是本批基准；第34—38批5代地图保留，原1126条前辈档案、34篇18世纪专题均不修改；严格隔离 `?review18c=1` 研究预览，**正式main绝不合并**。

## 第39批新增GIS空间覆盖
| 区域 | 新增有年份的概略面 | 可点击历史地点 | 有效阶段 |
|---|---:|---:|---:|
| 1759—1763及1790年代加勒比海短期军占、和约归还、战争人员受害 | 45 | 28 | 73 |
| 1700—1799加纳黄金海岸英／荷／丹堡垒及当地社会 | 36 | 20 | 56 |
| 1700—1799印度西岸及波斯湾公司商馆、税务、外交 | 45 | 35 | 80 |
| **本批新增** | **126** | **83** | **209** |
| **第34—39批累计** | **629** | **421** | **1099** |

区域面是**地图对象数**。不同时间阶段及同一个港口的军事、财政或外交层可能叠合；数值不是英国实际占领的629个省份。所有新增对象 `area_sqkm:null`，总面积禁算。

## 动画中需要观察的关键变化
- **1759英占瓜德罗普 → 1763归还法国**：1759年占岛时显示军事局部示意，1763以后转为法方控制空心虚线。英国国家陆军博物馆和UNB藏Amherst原始军事通信证实英军1759夺岛和1763撤出。
- **1761多米尼克、1762马提尼克/格林纳达/圣卢西亚/圣文森特/Havana**：短期岛级战争和约变化分阶段；1763瓜德罗普、马提尼克、圣卢西亚归法，英国保留格林纳达等法定殖民权益。军事控制局部、法定主权、Garifuna与Kalinago原住民政治主体分色。
- **1782圣基茨、尼维斯、蒙特塞拉特**：法军战时夺岛与1783和约后英军控制恢复。再连接1794瓜德罗普英军短占和法军反攻、1797特立尼达英军占港，以及圣多明各1798撤军。
- **1730之后Tantumquery、1742 Prampram Fort Vernon、1750 Winneba及1768 Apollonia**：有据英国商人堡垒以局部核心显示，内陆Fante/Nzema/Ga社群不计为英殖民地；阿诺马布1731拆堡→1753开建→1757竣工有独立阶段。
- **荷兰和丹麦旧堡不冒充英堡**：Sekondi Fort Orange、Apam Fort Patience、Kormantin Fort Amsterdam是荷方堡垒；Accra Christiansborg和1783年Ada Kongenstein为丹麦堡垒，分别以他国控制空心虚线展示，1890年之前各种殖民时代转移不得提前涂为英国。
- **1763→1769→1775→1798波斯湾**：1763年4月12日Bushire公司Resident开办，1769—1774停办、1775后恢复；1790年代Basra商站和巴格达帕夏争端后联系Grain/Kuwait，1798 Harford Jones任Baghdad公司驻地负责人。类别一律为商贸、外交及纸面机构中断，**不绘成英国征服伊朗、奥斯曼或科威特领土**。
- **Surat/Thana/Broach/Tellicherry/Murshidabad/Patna**：依据英国图书馆India Office Records的具体卷宗年份拆开公司商业、行政、税收、司法与个人利益，档案缺口不解释为地面占领中断。

## 主要权威来源与仓库source_key
每条新的JSON对象包含唯一`source_key`、历史时间区间和`source_urls`；以下重点来源可查：
1. [英国国家陆军博物馆七年战争](https://www.nam.ac.uk/explore/seven-years-war)（1759瓜德罗普、1762马提尼克等）
2. [新不伦瑞克大学图书馆：Amherst Collection西印度群岛战争信函](https://lib.unb.ca/guides/loyalist-collection-british-west-indies)（1761/62占岛、1763撤军）
3. [耶鲁大学Avalon项目：1763年巴黎和约全文](https://avalon.law.yale.edu/18th_century/paris763.asp)（割让和归还）
4. [AM Digital Caribbean史实年表](https://resources.amdigital.co.uk/coc/time/access.php?end=1820&start=1750)
5. [Ghana Museums：1720年代Tantumquery英国小堡](https://gmmb.gov.gh/the-fort-at-tantumquery/)
6. [Ghana Museums：1742年Prampram Fort Vernon](https://gmmb.gov.gh/fort-vernon-prampram/)
7. [Ghana Museums：Dutch Sekondi Fort Orange](https://gmmb.gov.gh/fort-orange-sekondi-1670s/)
8. [Ghana Museums：Dutch Apam Fort Patience](https://gmmb.gov.gh/fort-patience-apam-1697/)
9. [Ghana Museums：Christiansborg丹麦城堡](https://gmmb.gov.gh/christiansborg-castle-accra-1661/)
10. [Ghana Museums：1783丹麦Kongenstein堡](https://gmmb.gov.gh/fort-kongenstein-ada/)
11. [剑桥大学出版社：1750年英国金海岸堡垒名录](https://www.cambridge.org/core/journals/transactions-of-the-royal-historical-society/article/abs/english-establishments-on-the-gold-coast-in-the-second-half-of-the-eighteenth-century/6952B0DF3DC5BB547173E0278227EF11)
12. [英国图书馆IOR/R/15/1：1763、1769、1775 Bushire驻地史](https://searcharchives.bl.uk/?q=037-000227428&sort=date)
13. [英国图书馆IOR/G/29/32：Basra—Grain—Baghdad商站纠纷和1798驻地](https://searcharchives.bl.uk/catalog/041-000177265)
14. [英国图书馆IOR/G/5：Broach公司商馆与1779—80财政账](https://searcharchives.bl.uk/catalog/036-000173372)
15. [英国图书馆IOR/G/38：Thana公司行政日记，1775—99](https://searcharchives.bl.uk/?f%5Bcollection_area_ssi%5D%5B%5D=India+Office+Records+and+Private+Papers&f%5Blevel_ssi%5D%5B%5D=%5B36%5D+Series&f%5Bproject_collections_ssim%5D%5B%5D=India+Office+Records&page=5&per_page=20&sort=date)
16. [英国图书馆IOR/G/36和IOR/G/37：Surat与Tellicherry公司商馆](https://searcharchives.bl.uk/?f%5Blevel_ssi%5D%5B%5D=%5B36%5D+Series&f%5Bmaterial_type_si%5D%5B%5D=Archives+and+Manuscripts&f%5Bproject_collections_ssim%5D%5D=India+Office+Records&page=2&per_page=50&sort=hierarchy)

## 地图表达与技术
- `data/eighteenth-century-b39-caribbean-1759-1763.json`（45/28）
- `data/eighteenth-century-b39-gold-coast-forts.json`（36/20）
- `data/eighteenth-century-b39-gulf-surat-factories.json`（45/35）
- `js/eighteenth-batch39-spatial.js`：全部对象一一验证后按年份重绘。紫色低透明度为英国局部军事/行政，金色为财政，青绿色空心为商业和本地政治行动，蓝灰为空心外国堡垒，粉/橙为强制或战场；虚线均为现代编辑参考包络。
- `app.js`现有4条年表重绘流程增加第39批，旧5代图层逐条保留；`index.html`更新图层说明。地图点击可见具体历史事件、时间及权威来源。
- `scripts/test_18c_batch39_126_83.js`对629/421/1099、全部来源、历史断点、null面积、示意定位与地理类型作回归。
- `scripts/browser_18c_batch39_126_83.py`用**真实1780×1020 Chromium**在16个采样年份点击地图/查资料、联动关闭6批图层、回到1572、离开预览恢复主站默认年份。
- `.github/workflows/18c39-caribbean-goldcoast-gulf-mass-territories.yml`独立三项：静态史料/GIS、6批真实浏览器、SHA固定公开预览。

## 后续编辑提醒
1. **别把贸易公司影响、1763条约的纸面声索、原住民自治和敌对国家守堡统计为英军实控面积。**
2. 拟补精确边界时优先从具体殖民省、岛屿或驻军堡垒取得历史地图库配准数据；无确切边界永远虚线。
3. 不需要为了增加对象数量而复制相同城堡的不同框；第39批已按源登记，后续应扩展地区或修正证据等级。
4. 任何GitHub验收失败均保持Draft，修复后记录工作流与截图；不能合并main。
