# 史地研究包：1595特立尼达军事行动示意面与16世纪北非下一批资料

研究检查日期：2026-10-15。**只有可查证的军事实地活动才用红色区域；商业外交不能伪装成英国疆域。**

## 一、1595 特立尼达：从笼统“岛屿中心点”升级为两处具名军事活动地点

### 来源与交叉核验

1. [特立尼达和多巴哥国家图书馆 NALIS，《The First Non-Native Building in Trinidad》](https://www.nalis.gov.tt/resources/tt-content-guide/significant-sites/significant-sites-a-i/)：记载1592年San José de Oruña（圣何塞·德奥鲁尼亚，今St. Joseph）建立，并引述罗利自己的回忆：舰队到达Puerto España，他派人召见西班牙总督Antonio de Berrío，遭拒后向San José进军，击败卫队并放火焚毁城市。该文件是**现代历史研究对英方一手叙述的转述**，不能直接接受英方关于原住民参与、动机或伤亡的所有辩解。
2. [NALIS，《Governors of Trinidad and Tobago: 1593–1701》](https://www.nalis.gov.tt/resources/tt-content-guide/governors/governors-of-trinidad-and-tobago-1593-1701/) 给出更详细的港口抵达、军事行动和英方描述。
3. [英国图书馆 Add MS 36315](https://searcharchives.bl.uk/catalog/040-002054717)，1595年Domingo de Vera Ybargüen致西班牙国王的档案目录，f.264b 明确涉及「英国人焚毁 S. Joseph de Oruña」「捕获Berrío」等。该**西班牙对方资料**支持焚城与俘虏总督史实，但本项目只核查到档案馆详细目录，尚未对影印手稿逐行誊录。不能由目录虚构军队数量、伤亡或实际城墙。
4. [英国图书馆 Add MS 36316](https://searcharchives.bl.uk/catalog/040-002054718) 包含1595年西班牙殖民官员关于特立尼达及拉美地区英方袭击的书信目录，进一步支持两地局部战事。现有项目于PR#76已使用此馆藏作岛屿级资料。

### GIS重建边界

将之前坐标位于岛中部、无特定战场支撑的 `caribbean-trinidad-raiders-1595` Point迁至**St Joseph今日城镇中心附近**（10.6394，-61.4242）并标记精度为现代城市参考；新增另一个**Puerto de los Españoles现代港市参考点**（10.6619，-61.5166）。这两个经纬度只起**今日城镇定位**作用，并非16世纪港口测量点、原始城址图或炮兵阵地坐标。

新增一处 *Trinidad 1595 regional schematic*，仅围绕上述相距不远的两处具名城镇手绘淡红虚线概略包络，在地图默认低缩放级别以**29像素屏幕圈**显示，放大到8级及以上则还原概略包络原型：

- **历史事实可证**：罗利抵达港口，进军San José，对守军发动攻击、抓捕殖民总督，随后焚城。
- **历史几何不可证**：具体登陆点、实际行军路、各部队队形、被焚建筑范围，原住民参与的地理分布、特立尼达全岛是否被控制。
- **地图数据契约**：`historical_boundary_confirmed:false`、`fill_authorized:false`、`territorial_claim:false`、`area_sqkm:null`、`exclude_from_area_aggregation:true`。不计入任何年份英国领土面积。
- **历史主体**：英国罗利远征队、西班牙地方殖民当局及当地原住民不能混为同一个阵营。罗利的动机和原住民参与由其自述，不能概括为所有当地原住民支持他。

比起给整座特立尼达画一块“英国控制面”，这是符合用户批准方案B的**具名多地点军事行动示意区**。其他1595加勒比城市袭击点保留，不能凭它们分散的经纬度自动画一块横跨加勒比海的红区。

## 二、北非新发现：阿尔及尔、突尼斯、的黎波里，仍须作为贸易外交网络

从 [剑桥大学出版社重印的Richard Hakluyt《Principal Navigations》相应篇章目录](https://www.cambridge.org/core/books/abs/principal-navigations-voyages-traffiques-and-discoveries-of-the-english-nation/letters-of-zuldan-murad-can-the-great-turke-to-the-sacred-majestie-of-queene-elizabeth-anno-1579/38343C00AED85F040A3F690CFA41A457)，已明确检索出：
- 1583年阿尔及尔当地政权向英方Thomas Shingleton发放通行证；
- 1584年英国驻奥斯曼使节William Hareborne参与取得面向阿尔及尔、突尼斯、的黎波里的贸易通行保护；
- 1585年Hareborne任命M. Tipton为在Algiers、Tunis、Tripolis的英国领事；
- 另有英国船只遭阿尔及尔战船扣押、英国商人与被扣押人员名录。这个材料很适合研究英方早期的贸易扩张、海上暴力、掳掠和赎回活动；仅凭目录不能认定任何具体扣押案的具体地理经纬度、人数或日期。

国家治理语义：16世纪末阿尔及尔、突尼斯、的黎波里各有复杂的奥斯曼帝国—地方政治关系，**不能把英国商人的贸易权或领事活动升级为英国控制区**。当下一轮得到具体城市与文献对应年份后，可增加**青绿色商业外交节点**和仅由史料支持的联系线；无可靠的英方侵略面就只画点、线。

## 三、后续审查清单

1. 检查Hakluyt逐章原文，而不仅仅依Cambridge目录，核对领事书信日期、译名和所在城市，避免将“任命负责三城”错判为1585年在三城有各一处固定常驻领事馆。
2. 查英国图书馆Add MS 36315/36316全文的再利用权限与图像开放情况，若取得1600年前原始城镇图，再考虑取代手绘示意面。
3. 对1595—1596年Drake/Hawkins最后一次远征可参考[美国国会图书馆《The Last Voyage》](https://www.loc.gov/collections/sir-francis-drake/articles-and-essays/drake-biography/the-last-voyage/)；它区分1595圣胡安失败、巴拿马地峡上Nome de Dios/Porto Bello的攻击失败，不应把整条地峡定为英国占领区。
4. 重要：特立尼达国家信托的历史时间轴还提到1596年Lawrence Keymis对多巴哥的**声索**，法律声明必须与实际长期定居/行政控制分开审查，不能默认把1596年的多巴哥涂成英国领土。

## 四、回归检查

`scripts/test_caribbean_maghreb_1551_1598.js` 核验两处具名现代地标均落在研究包络、来源与非殖民属性、低缩放屏幕提示及面积排除；`scripts/browser_smoke.py` 检查1595年一个概略研究面及五个港市事件点、点击资料卡有权威史料，1597年不残留临时研究区。历史年份与原来默认现代地名底图完全不变。
