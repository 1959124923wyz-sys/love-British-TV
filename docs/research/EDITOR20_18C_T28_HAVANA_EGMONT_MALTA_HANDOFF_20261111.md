# 主编20｜第30批T28完整编审交接（2026-11-11）

## GitHub传承
- 第29批Draft PR #324基线为 `2b40a458dd71468ac6a4dc095219821b4c9433c2`，在独立分支 `map/18c-t28-havana-falklands-malta-short-occupations-1762-1799-20261111` 继续，**不改正式main**。
- 原始 `research/18c/consolidated/series/T28.json` **2个研究合并组、4条候审ID、4个B原来源键**完整映射，原1126条crosswalk和不可变ZIP均保持原样。
- 第30篇：**33项具年份历史事件、33章99段完整中文、24项登记来源、33项正文—Atlas双向联动及33项多政治主体控制过渡**。前29篇保留。

## 历史证据
### 1762—1763 哈瓦那
- 美国国会图书馆记录1762-06-06英国海上封锁；皇家格林尼治博物馆原战事艺术品登记1762-06-30英军登陆攻城炮、1762-07-30英军夺Morro堡、8月英国舰队入港和缴获西班牙海军舰船。
- 国会图书馆引历史研究估计英军攻城编组包含**约2400名被奴役非洲人**；该数字仅军队劳役编组，未证其死亡数。
- 1763巴黎和约以哈瓦那归还西班牙与英国获得Florida作交换。哈佛Böttcher综合古巴、西班牙、英国档案研究英军约11个月占领如何改变与英国大西洋世界的贸易及奴役制度联系。
- [LOC](https://blogs.loc.gov/law/2022/01/how-havana-became-british-for-eleven-months/) · [RMG 7/30 Morro](https://www.rmg.co.uk/collections/objects/rmgc-object-11905) · [RMG缴获舰队](https://www.rmg.co.uk/collections/objects/rmgc-object-11908) · [Harvard](https://atlantic.fas.harvard.edu/Bottcher%20-%20WP%2097011)。

### 马尔维纳斯／福克兰群岛1764—1774
- 1764法国Port Louis东岛据点、1765英国Byron宣称对西岛权利、1766英国MacBride设Port Egmont军事设施、1767法国东岛站转西班牙Puerto de la Soledad，逐一分开。
- **1770-06-10西军迫Port Egmont英驻军投降**，6月14日英方撤出。西班牙行动不能以英国殖民扩张分类；此后英方声索不算实际驻兵。
- **1771-01-22英西外交声明规定恢复Port Egmont港堡，并保留西班牙对群岛先前主权权利的法律争议；9月16日恢复该英方驻地。**
- **1774英国从Port Egmont撤驻**，留下主权声索铭牌；无英国驻兵不能从1774起继续显示实占点。西班牙同时仍驻Puerto Soledad。现今英国和阿根廷对主权分别有不同法律解释，专题不裁断现代争端。
- [联合国S/15007历史年表](https://digitallibrary.un.org/record/29591) · [阿根廷外交部](https://cancilleria.gob.ar/es/politica-exterior/cuestion-malvinas/antecedentes/antecedentes-historicos) · [英国上院图书馆](https://lordslibrary.parliament.uk/sovereignty-since-the-ceasefire-the-falklands-40-years-on/) · [英国1961殖民部历史报告扫描](https://wellcomecollection.org/works/bef4yed3/items?canvas=60&page=10&shouldScrollToCanvas=true)。

### 马耳他1798—1799
- 1798-06法国入侵。马耳他大学Yosanne Vella 2022记录**1798-09-02马耳他居民自行起义**，选代表建立临时政府。1798-09-03 Mdina当地义军掌握，英葡海军此后协助封锁。1798-10-28 Gozo法军投降，Valletta法军继续据守。
- 1799当地Congress继续存在。英国海军军官Alexander Ball参与组织支援，但其1799年治理授权来自**那不勒斯王廷**；1799不能画作英国已经直接占领马耳他全岛。法国军队于1800-09才最终向盟军投降，位于本批截至1799年之后。
- [马耳他大学Vella](https://www.um.edu.mt/library/oar/handle/123456789/121918) · [法国拿破仑基金会](https://www.napoleon.org/en/history-of-the-two-empires/articles/the-taking-and-the-siege-of-malta) · [Ball的授权研究](https://timesofmalta.com/article/balls-governorship.279227)。

## 空间与数值约束
- 20个采用GeoNames/UNT核验的现代Havana、Valletta、Mdina、Gozo地名参考点，**Port Egmont未找到精确可审古堡GIS所以保持null**。
- 0英国未经核准实际占领Polygon、0西班牙或法军未经核准实占Polygon、0臆造军舰航线和死伤人数、0公司净利润猜算。
- 1771主权外交文件的约定与实际堡垒控制分开；1774撤军后不留英国驻军状态。马耳他1799地方抵抗、那不勒斯授权、法军驻守和英国海军封锁各自归责。

## 代码质量与历史缺口
- 静态：`scripts/test_18c_t28_havana_egmont_malta_map.js`，核33事件、4原候审、4 B键、24史料来源、所有正文链接、29旧篇及GIS。
- 审计：`scripts/audit_18c_t28_original_B_sources.py`，独立复核1126 crosswalk和原ZIP。
- 桌面：`scripts/browser_18c_t28_havana_egmont_malta.py`，真实1780×1020浏览器跨1762、1763、1770、1771、1774、1798、1799，双击史料/返回，旧29篇和16世纪回归。
- CI：`.github/workflows/18c-t28-havana-egmont-malta-map.yml`，包含3个独立任务；**最新HEAD三项success才可称最终验收**。
- 待进一步研究：1762英国军队奴役者名册与具体劳工命运、哈瓦那原港务账、1763实际归还日、Port Egmont18世纪堡址坐标及两国档案原卷、马耳他Congress档案和1800年法军投降后政治权利变化。
