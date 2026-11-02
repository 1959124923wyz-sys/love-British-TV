# 主编14｜17世纪最大有据殖民声索和逐年连续性审查（2026-11-02）

## 决策与最终工程目标

项目主编要求：17世纪英国殖民者所声索和统治的地区优先采用**历史文书允许的较大外廓**，对不确定地区宁可大范围示意，也不要散点地图。但不得冒充全域实控。执行方式：大面积半透明填色、**虚线不确定外缘**，说明类别、阶段、强制披露文书/政体声索与军政驻守的区别。任意岛群包络可能包含海水；任何色块不得合算为英国实际占地面积。若某特许只有定居点周边有限纵深，绝不臆称海到海。

沿用前三批32块，本轮新增7块，合计39块；不新增未经核准的实控、面积、原住民土地转让量、屠杀伤亡或军事轨迹。全套年份以**1600—1699逐年**遍历，不允许年份完全空白；1641、1667、1689、1692等年度政治换手与具体时序仍须读历史事件正文，静态年度填色按该年末状态近似显示。

## 新增7块范围

| 新区域 ID | 显示区间 | 大范围的文书根据与限制 |
| --- | --- | --- |
| `claim-ireland-crown-1600` | 1600—1652 | 英王在1542年取得爱尔兰国王头衔、对全岛提出法理声索；保留1600—1603盖尔战争、1641后爱尔兰邦联及当地武装实际自治。参考：[英国国家陆军博物馆](https://www.nam.ac.uk/explore/timeline-ireland-and-british-army)、[英国国家档案馆爱尔兰国家文书](https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/state-papers-ireland-1509-1782)。1653以后转至已有共和国征服后政治控制示意，不宣称逐郡占领。 |
| `claim-virginia-first-charter-1606` | 1606—1608 | [1606原始特许全文](https://avalon.law.yale.edu/17th_century/va01.asp)允许伦敦公司沿北纬34—41°、普利茅斯公司沿38—45°**选择殖民点**；土地以落脚地左右沿岸各50英里、内陆约100英里为限。**本图仅是多处可选海岸走廊的共同外廓，不是已经整段封地**。1609第二特许正式取代，参考[弗吉尼亚州法典历史整理](https://law.lis.virginia.gov/compacts/extent-of-territory-of-the-commonwealth-after-the-constitution-of-1776/)。 |
| `claim-council-new-england-1620` | 1620—1634 | [1620年新英格兰委员会王室特许全文](https://avalon.law.yale.edu/17th_century/mass01.asp)明确北纬40°—48°、从大西洋到太平洋的**最大纸面声索**；原文排除他国已占地区，不能消除原住民族地权。参考[马萨诸塞州政府历史法规](https://www.mass.gov/info-details/massachusetts-historical-laws-and-legal-documents)、[纽伯里图书馆政区沿革](https://publications.newberry.org/ahcb/documents/MA_Consolidated_Chronology.htm)。委员会在1635年交还特许并解散，故以1634年末为最后完整年份。 |
| `claim-plymouth-colony-1620` | 1620—1691 | [马萨诸塞州档案馆普利茅斯殖民地诉讼、法令和契据目录](https://www.sec.state.ma.us/divisions/archives/collections/plymouth-records.htm)显示1620起长期殖民治理；1691新特许并入马萨诸塞湾省，1692正式生效。**瓦姆帕诺亚格人家园不能推定为早在1620年整体割让**，填色只是东南马萨诸塞殖民治理的宽取参考。 |
| `claim-st-kitts-nevis-1623` | 1623—1631 | [美国国务院圣基茨—尼维斯历史](https://1997-2001.state.gov/background_notes/St_Kitts_Nevis_0497_bgn.html)说明圣基茨英人1623定居、尼维斯1628年定居，圣基茨有法国殖民政权共存；图层以含两岛的大包络表示英方参与地区，**不表示独占两岛或周围海域**。1632转由旧版背风群岛包络接续。 |
| `claim-new-england-dominion-1686` | 1686—1687 | [马萨诸塞州档案馆](https://www.sec.state.ma.us/divisions/archives/collections/mass-archives-collection.htm)、[1686—1689自治领理事会记录](https://www.sec.state.ma.us/divisions/archives/collections/mass-archives-volume-list.htm)证明王室加强对北方殖民地的集权安排，色块为多殖民地行政声索；不表示当地政治关系一致。 |
| `claim-new-england-dominion-1688` | 1688年 | [纽伯里图书馆新泽西沿革](https://publications.newberry.org/ahcb/documents/NJ_Consolidated_Chronology.htm)记载1688年东、西新泽西纳入自治领；[纽约州参议院年表](https://www.nysenate.gov/timeline)记录纽约加入。以更大的淡色宽面显示**1688年王室纸面政区扩张**，1689年波士顿起义后终止该自治领着色。 |

## GIS质量与视觉重叠修复

- 在 `app.js` 的 `renderSeventeenthColonialClaims` 内，按各独立多边形的**经纬度矩形跨度代理**降序绘制。只为 SVG 层叠顺序服务，让跨大陆外廓先画、岛屿/局部堡垒/殖民聚落后画，减轻小地点被大面积色块拦截点击；**该数字不是地理面积，不得外传为实际土地统计**。
- GeoJSON中原鲁珀特地环线有一段重复零长度边；已移除。检查所有39块环线关闭、坐标范围、相邻重复顶点、简单边相交，手工审查没有发现明显自交。
- 新增 Node 合约检查：39块及7个新ID；每年1600—1699至少有一面；1606/1609、1620/1635、1623/1632、1652/1653、1687/1688/1689、1691/1692等时间交接。检查每块`area_sqkm:null`、`exclude_from_area_aggregation:true`、`boundary_verified:false`、`territorial_claim:false`等永久安全字段。
- 桌面 Selenium 增测1600、1606、1620、1623和1688年度截图，沿用原有1599回归、图层开关与来源档案点击验证。禁用移动端修改。
- **关键限制：** 以宽取图形计算出来的平面跨度或地图视觉占比没有史学测绘价值，严禁将其称作实际殖民土地；“海到海”的特许条款本身也不意味着欧洲或原住民各方同意王室单方声索。

## 发布与交接

代码、GeoJSON与自动测试保存在本轮独立分支 `cartography/17c-broadest-sourced-claims-continuity-20261102`。只能在合并前PR所有必需检查均通过后并入 `main`。网站部署状态单独确认 `Publish historical atlas` 工作流，未确认前不可称正式发布。原始1497—1599图层、17世纪专题、事件和全套Atlas十年记录未经本轮修改。

下一轮可针对鲁珀特地、阿卡迪亚、卡罗来纳、马里兰和北美原住民政治范围继续使用时代地籍图、流域矢量与公立档案增强历史准确性；**不能因希望面积更大而跨越无文件根据的边界**。
