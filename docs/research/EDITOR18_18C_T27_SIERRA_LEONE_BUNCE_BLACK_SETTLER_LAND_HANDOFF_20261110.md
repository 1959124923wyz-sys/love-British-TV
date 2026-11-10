# 主编18第十四批：T27塞拉利昂Bunce岛英国运奴堡垒、黑人迁居、英国公司土地剥夺与自治抗争

**2026-11-10｜Draft独立研究分支 `map/18c-sierra-leone-bunce-freetown-land-1728-1799-20261110`，从T26第十三批PR #304的头部继承。仅当 `?review18c=1` 时可见，正式main不包含本批历史专题。**

## 01. 历史叙事与责任界限

本批选择一座海湾上的**英国运奴贸易军事堡垒**与附近一个**黑人自由居民政治社群**，研究英国殖民主义的两种不同形式：

- 1728年英国皇家非洲公司经营的Bunce岛运奴堡垒遭商贸竞争者攻击并弃守；1744年前后由伦敦商人财团重新经营，凭军事建筑、囚禁和船舶强迫转运非洲人。该体系与南卡罗来纳、佐治亚稻作种植园的奴役劳动需求相联系。1779及1794年法国舰队攻击Bunce堡，应注明法军是炮击直接实施者，英国私人奴役商人的经营责任单独调查。
- 1792年黑人领导人Thomas Peters、John Clarkson组织约1,190名黑人效忠派从加拿大前往塞拉利昂。这些人是寻求自由和稳定土地的移居者，**不能将迁居当成另一艘被迫贩奴船**；参与妇女投票、选代表等政治自治。
- 伦敦Sierra Leone Company对移居前自由持地的承诺与董事会欲征收`quit rent`的财政规划相冲突。1799年公司拒绝授予freehold，黑人居民继续举行请愿与选举；**资料明确记载的武装叛乱起于1800年，严格留待19世纪，不编入1799年**。
- 与Temne、Bullom土地权人1787年的协议，英方认为获得永久土地权益，本地政治社会则按土地持有人—外来居民关系解释。对原有圣地、耕地边线及司法权不能凭现代地图擅自填成英国半岛主权。

## 02. 主编15原档追溯，真实历史候审不变

原始 `research/18c/consolidated/series/T27.json`：**3个合并组、4条原始候审记录、7个原B来源键**。

| 原归并ID | 原始候审ID | 年份 | 本批地图事件 |
| --- | --- | --- | --- |
| `E18-MRG-T27-01` | `AB-F5-SL-001` | 1728 | `E18C-SL-1728-BUNCE-RAC-ABANDONMENT` |
| `E18-MRG-T27-02` | `AB-E09-008` | 1792 | `E18C-SL-1792-FREETOWN-BLACK-LOYALIST-ARRIVAL` |
| `E18-MRG-T27-03` | `AB-R7-POL-041` | 1799 | `E18C-SL-1799-SIERRA-LEONE-COMPANY-FREEHOLD-REFUSAL` |
| `E18-MRG-T27-03` | `AB-E09-004` | 1799 | `E18C-SL-1799-BLACK-SETTLER-CONSTITUTIONAL-RESISTANCE` |

原助手B文献键：**BS179、BS181、BS166、BS171、BS165、BS42、BS111**。`scripts/audit_18c_sierra_leone_source_registry.py`直接打开未修改`research/18c/consolidated/18C_Consolidated_Research_Handoff_20261108.zip`内的`18c_consolidation/SOURCES_B.json`与原T27逐键对照。其余14事件由机构及历史学文献独立补入，全部保留`research_merge_group_id:null`与`research_original_record_ids:[]`，从不捏造原315条映射、改变1126档案去向。

## 03. 已创建文件和交互范围

| 文件 | 证据与工作成果 |
| --- | --- |
| `data/stories/serial/chronology-preview-sierra-leone-1700-1799.json` | **18条具年历史事件、25项登记来源（7原B＋18机构和论文）**，10件可核现代遗址/城镇参考点、8条无GPS；0新英国殖民领土多边形 |
| `data/stories/serial/e18-t27-sierra-leone-bunce-black-settlers-1728-1799.json` | **18章54段完整中文长篇、18个独立真实`[[E18C-SL-...|动作文字]]`地图导航** |
| `data/stories/serial/preview-18c-index.json` | 先前13篇仍在；T27为第14篇；关联前代T26英国西非奴役贸易长篇 |
| `research/continuity/1728-1799-sierra-leone/BUNCE_COMPANY_BLACK_FREEHOLD_TRANSITIONS.json` | **18条**英奴役贸易商／法国军／Temne-Bullom／黑人选民／伦敦公司权力过渡，4项合法政治关系，0历史British领土面积 |
| `scripts/test_18c_sierra_leone_bunce_land_map.js` | 强制核原3组4候审7B键、18事件/18链接、25真实来源、无1800预支、1190/65/112口径、0虚构殖民疆界及无动态章节浮条 |
| `scripts/audit_18c_sierra_leone_source_registry.py` | 原ZIP B资料目录双向比对 |
| `scripts/browser_18c_sierra_leone_bunce_land.py` | 真实桌面1780×1020：1728Bunce→1744奴役商人→1792黑人移民→1799公司拒地→双击1792移民65/112档案→返回；正常模式隔离与16C地图兼容 |
| `.github/workflows/18c-sierra-leone-bunce-land-map.yml` | T27、前13篇静态/严格GIS及原ZIP审计；真实桌面Chrome十四篇全回归；网页HTML/CSS/JS/年轴、长篇JSON在外部静态代理HTTP真实访问 |
| `app.js`、`js/history-stories.js`及`index.html` | 第14篇仅在`review18c=1`追加，用户要求取消的**浮动“章节目录／已读%／回到开头”依旧完全删除**，原正式main16/17C不触及 |

## 04. 死亡人数、自由移民与英国贩奴堡垒须严格区分

- Clarkson给英国大臣Dundas的1792年原信写**1190名黑人乘15艘船自Halifax于1月16日出发，65人在海上死亡**。可直接核查[原信出版稿](https://blackloyalist.com/cdc/documents/diaries/mission/178-181.htm)，亦有加拿大Nova Scotia Archives《Clarkson's Mission》出版版。
- [加拿大UNB Clarkson Papers目录](https://loyalist.lib.unb.ca/record/papers-1785-1853)归纳**112人在航程或抵达不久后死亡**。这是较宽的时期口径，含前述65，不能错误相加为177。该馆所藏第四卷有医疗病例登记，可继续按姓名、疾病、死亡日期等核算；截至本批，未逐人转录。
- 1792年的自由黑人效忠派本身参与土地争权，不能与**Bunce英国商人强制贩运的被奴役非洲人**在数据上合并。后者在1750—1800年代运往美国稻作种植园的规模确实巨大，UNESCO称数万人跨不同时期从Bunce被迫运走，但本批没有逐个年份的受害者姓名、死亡或运送量，**没有将该总说法伪作1728或1744精确年度数字**。

## 05. 历史地图位置及政治合法性

- **Bunce现存英国奴役贸易堡垒**：2021年塞拉利昂共和国卫生部环境与社会管理文件附表4.9于世界银行库发布坐标`8°34′9.86″N 13°2′24.84″W`，转换为`8.56940556,-13.04023333`。1728、1744、1779、1794四件年度事件作相同遗产岛宽域参照。世界银行PDF表是**现代遗址位置**，不是1728或1794英国堡墙、军舰炮击点。
- **Freetown现代地名中心**：联合国UNGEGN首都地名档`8.43601409593,-13.2041483371`；六件黑人社区迁居、1794焚城、1796选举及1799地权争议等仅以现今城市中心导航。没用现代市界计算英国公司控制范围。
- **8条无GPS**包括1787与Temne/Bullom土地协议、1791迁居组织与土地承诺、1792实际船队和死亡时点、1792 Clarkson返英、1793公司董事解雇。无证据古航线不得画。
- **0英国现行行政区涂色、0殖民公司管理地籍填色、0猜测Temne/Bullom原住民边线**。1787或1799法律声索不等于当地政治共同体确认整半岛让渡。

## 06. 权威史料链接

- [塞拉利昂政府提交UNESCO：Bunce堡原址、奴役贸易、1728及1744经营转折](https://whc.unesco.org/en/tentativelists/5745/)
- [Sierra Leone Heritage：Bunce遭袭、1728弃守、1744伦敦商人恢复、1779／1794法国袭击](https://www.sierraleoneheritage.org/sites/monuments/bunce)
- [世界银行保存塞拉利昂政府2021报告表4.9：Bunce官方经纬度](https://documents1.worldbank.org/curated/en/662821635166256352/pdf/Environmental-and-Social-Management-Framework-ESMF-Sierra-Leone-Quality-Essential-Health-Services-and-Systems-Support-Project-P172102.pdf)
- [UNB Clarkson Papers原档：1190人出航，112人海上或抵达不久死亡](https://loyalist.lib.unb.ca/record/papers-1785-1853)
- [Clarkson写给Dundas的1792原信：65人在船上死亡](https://blackloyalist.com/cdc/documents/diaries/mission/178-181.htm)
- [UNB CO270档：黑人自治、1794法军焚城、1799拒绝freehold](https://loyalist.lib.unb.ca/record/sessional-papers-sierra-leone-co-270-1792-1801)
- [Rice大学James Sidbury 2016年论文：1796地租与代议、1800叛乱](https://futureafampast.si.edu/sites/default/files/06_Sidbury%20James.pdf)
- [2016专业论文《Rebellion or riot?》：起义发生于1800年](https://www.tandfonline.com/doi/abs/10.1080/0144039X.2016.1150686)
- [2021 Economic History Review：1792土地分配，498户明细](https://onlinelibrary.wiley.com/doi/10.1111/ehr.13020)
- [Temne地权历史研究：殖民公司对当地地权、圣地与协议边界的侵入](https://content.eurekamag.com/research/099/896/099896113.php)
- [联合国UNGEGN：Freetown现代参考坐标](https://ungegn.un.org/dashboard/cities/details?id=58)
- [Oxford研究：粮食不足、Temne/Susu贸易和Clarkson解职](https://academic.oup.com/cornell-scholarship-online/book/30815/chapter/262429667)

## 07. 网页、下一位编辑与尚待史证

T27网页预览（必须等最新HEAD的GitHub Actions外部HTTP检验完成才宣称实测可访问）：

`https://raw.githack.com/1959124923wyz-sys/love-British-TV/map/18c-sierra-leone-bunce-freetown-land-1728-1799-20261110/index.html?review18c=1&year=1792`

正式主站：<https://1959124923wyz-sys.github.io/love-British-TV/>；依用户要求本PR保持Draft，正式main不自动加入研究事件。

下一阶段最优先查找：TNA CO270黑人领袖具名请愿和地契；1787 King Tham土地协议双方条款和Temne/Bullom地权范围；1792医疗名册逐人死亡日期；Bunce奴役贸易堡垒实测古图、每艘英国船的装载与抵达人数。1800黑人居民反抗与公司武装镇压、1801—1802 Temne战争按十九世纪年份单独研究，不能偷写到1799年。
