# 编辑6｜1600—1699年三组第五轮资料去重与专题整合（2026-10-19）

**状态：审核工作底稿，非已出版史实数据库，非生产地图数据。** 研究组提交形式为本地ZIP（A/B/C），并未自动保存到本仓库；原包仍由编辑6交付的本地整合ZIP保管。本PR只沉淀经审核的结论及交接，不能把它解释为547条已上传并正式核证。

## 1. 收到什么
- 甲：56文件、193事件候选、206来源、14专题草稿、67空间对象候选。
- 乙：55文件、236事件候选、173来源、33专题草稿、69空间对象候选。
- 丙：78文件、118事件候选、143来源、24专题草稿、1空间对象候选。
- 合计 **189文件、547条事件、522条源记录、71篇专题草稿、137个空间候选**；其中68个Point、5个LineString、64个geometry=null；没有Polygon获实控绘制批准。
- 机器检查：547条事件引用的来源编号均能在对应组SOURCE_REGISTER.csv找到，没有同组事件ID碰撞；GeoJSON已提供的点经纬度未见超出地理有效范围。此为结构完整性而非史料原文核证。
- 522条来源记录的标准化URL出现39组复用链接；其中有英国图书馆档案检索总入口。**相同网页/检索首页不等于同一原卷，不得删除不同shelfmark**。

## 2. 已确认且实际处理的两类重复
1. **B116 与 B196：同一南卡罗来纳《禁止与仆役及奴隶交易法》**。UNB原文（https://slaveryandfreedomlaws.lib.unb.ca/laws/south-carolina-1695）签署为March 16, 1695-6（1695/96双重纪年）。B196以1695单年，B116以1696，原为同法重录；以B116为canonical，B196保留raw alias，统一排序1696，不抹除原历写法。
2. **B185 与 C17-E016：同一1660年航海法**。C17-E016为母法律节点，B185提供殖民地实施与罚没条款视角；以C17-E016为canonical，B185保留raw alias、地方制度关系另行记录。

**净数量**：保留547原始行，归并2条确证相同的法令，得到 **545个暂定canonical事件/制度节点**。尚未逐件排除更多语义重复，不能称545为“全部核准事件”。

## 3. 严禁误删除的联动事实
|相关ID|性质|结论|
|---|---|---|
|B012 ↔ C17-E106|同一运输链不同阶段|1619 White Lion私掠截人与Point Comfort抵达分别表述；美国NPS称其为英籍私掠船并在荷兰权威下航行，不宜指称英王直接策划。|
|B037 ↔ B038|同年不同法律|巴巴多斯1661奴役法与契约仆役法分别立法，各自有UNB全文。|
|B040 ↔ B200|疑似部分复录|1676年巴巴多斯贵格会法笼统概述与具体法条可能重叠；暂不合并，先查原文及逃奴另法范围。|
|B200 ↔ B192|连续法案|1676原限制与1678延长不同，不可相互吞并。|
|C17-E058 ↔ C17-E059|同船不同过程|Hannibal号在非洲装载、跨洋死亡，船次统一；不可将同一批人两次计数。|
|B069 ↔ B072/B073/B074|声索/据点/控制转移|1670 HBC法权不能当整个Rupert's Land实控；York Fort的1684建堡、1694法占、1696英收、1697法占必须逐年表现。|
|A:1698-DARIEN-LEITH ↔ A:1699-DARIEN-FAILURE|跨世纪|达连殖民行动延伸至1700年，1699不是任意设定的总终止年。|

更多人工跨事件判断已保存在随用户交付的本地 `EVENT_LINKS_AND_DUPLICATES.csv`，另有原件保全ZIP。

## 4. 已独立核过的权威来源（仅对应主张，不夸大覆盖范围）
- PRONI，阿尔斯特种植园1600—1641原始文书汇编：https://www.proni.gov.uk/publications/plantations-ulster-1600-41-collection-documents；只证明合集可查，未等同已逐页审完1611/1622调查。
- Trinity College Dublin Down Survey：https://www.downsurvey.ie/about/；1656—1658地籍及后续产权变动，未逐宗证明特定庄园。
- UNB Barbados奴役法：https://slaveryandfreedomlaws.lib.unb.ca/laws/barbados-1661；1661-09-24；原文并不证明具体法定惩罚已经执行。
- UNB Barbados契约仆役法：https://slaveryandfreedomlaws.lib.unb.ca/laws/barbados-1661-0；另法，文末1661-09-27，与馆藏元数据日期应并存核对。
- UNB South Carolina法：https://slaveryandfreedomlaws.lib.unb.ca/laws/south-carolina-1695；原始1695/96双重纪年。
- NPS 1619 White Lion：https://www.nps.gov/subjects/africanamericanheritage/400-years.htm；确认劫取后抵达，不自动给每位被俘者套后来的世袭奴役法。
- Parks Canada York Factory：https://www.parks.canada.ca/lhn-nhs/mb/yorkfactory/culture/histoire-history；1684 York Fort在前两代已被侵蚀的旧址，今York Factory III不是它；据点1694/1696/1697转手，应接1713。
- Bank of England，1694首贷£1.2m、8%利率：https://www.bankofengland.co.uk/freedom-of-information/2020/details-of-the-bank-of-england-loan-to-the-government-in-1694；贷款≠殖民贸易毛利润或税款实收。

## 5. 高风险资料（暂缓生产）
1. C组1687马德拉斯海关“665”是人数还是帕戈达税额仍有不同文献读法；不给总人数。
2. C组采购40名年轻被奴役者、请求200—400名马达加斯加被奴役劳动者，只能称下令/请求，不能称完成运输；1683王室索取特定人身同理。
3. A组爱尔兰征服战争的军人/居民/饥荒与流亡伤亡不能同口径叠加；Down Survey没有逐宗引用不可绘古代实测地块。
4. B组York Factory III现代遗址坐标不得充当1684 York Fort历史准确GPS。
5. 法条最高罚则不等于财政实收；1694政府贷款不等于英国获得殖民净收益。
6. 英格兰/苏格兰1603共主≠1707合并；王室军、议会军、公司军、私掠者及当地盟友按具体事件分别归责。

## 6. 编辑6分阶段落地
**先专题后事件，再零散案补缺：**
- 第一批：阿尔斯特、1641—1653战争、1652后地权、巴巴多斯1661双轨法、1619截人链、York Fort连续控制。逐篇补原卷、写可读故事，边界精度先审。
- 第二批：弗吉尼亚与新英格兰殖民战争、牙买加、皇家非洲公司、东印度公司、航海法、英荷战争。
- 第三批：国内司法迫害、印度洋强迫劳工、海上私掠/信息劫夺、地方零星暴力和财政资本网络；一切数字单列会计/人员分母。
- 17世纪窗口只显示对应时间片；跨世纪每个ARC母编号继续接前史与后史，不能在1699年人工截断政治、经济、奴役制度和连续控制。

**原件去向：**已在用户可下载的本地整合ZIP中保留189原档与17世纪MASTER_EVENTS、MASTER_SOURCES、MASTER_GEOS、MASTER_TOPICS、SOURCE_LINK_COLLISIONS、EVENT_LINKS_AND_DUPLICATES、YEAR_DISTRIBUTION等数据文件；本仓库只提交上述核审摘要和编审目录。后续如需全量GitHub备份，可另行将原档逐个导入专用research分支，不能声称当前PR已有源档全部内容。
