# 爱英TV｜1510—1519年研究交接入口
研究员1号 · 2026-10-12 · Git独立分支：`research/territorial-1510-1519-20261012`

## 请先读这里
1. [RESEARCH_REPORT.md](RESEARCH_REPORT.md)：核心报告，逐年故事、各地真实统治及疆界推定、外交款项、文献冲突、下一个档案任务。
2. [CONTROL_EPISODES.json](CONTROL_EPISODES.json)：12组政治统治和武装权力关系，每条与来源索引关联；历史精确多边形为空。
3. [CHRONOLOGY_AND_LOCAL_POWERS.json](CHRONOLOGY_AND_LOCAL_POWERS.json)：17条1510—1519年事件，包括图尔奈1513年占领、1518年移交条约、1519年2月撤军、1513年弗洛登、1512与1516年爱尔兰地方军政活动。
4. [GEOGRAPHY_HYPOTHESES.geojson](GEOGRAPHY_HYPOTHESES.geojson)：继承上一年代Calais/Irish Pale推定包络（原始来源与许可元数据均已保留），加图尔奈1.15km**任意示意圈**和3种其他事件地点参照。**任何面都没有正式有效统治疆界审批。**
5. [interactive_research_map.html](interactive_research_map.html)：独立Leaflet十年切换原型，现代OSM地名底图联网查看；**不改公开主站**。滑动年份不移动地图视角；1519年底隐藏图尔奈英王控制示意圈。

## 实际权力的核心差异
- **加来**：1500年代延续王室驻军和财政机构；边界仍须查TNA E315/407等及法国地方档案。
- **图尔奈**：1513-09-23至1519年2月持续英王实际驻军治理。Henry VIII对其宣称法国王国领地的政治身份；不是1513加入英格兰本土行政郡或议会议席。1518年签约—1519年撤军两个独立事件。
- **泰鲁阿讷**：1513-08-23军占和城市破坏；1514—19没有足够证据允许全年全区英方行政控制涂色。
- **英苏**：1513年弗洛登与沃克城堡短时占领，不改变独立苏格兰王国的主权；摄政并非英王合并。
- **爱尔兰**：基尔代尔委托政府、Pale行政、Roscommon 1512局部军驻，O'Donnell 1512 Omagh与1516 Sligo地方实际控制及改易不可混作英王长期直辖全郡。
- **海峡群岛/马恩岛**：特殊王权关系和地方政府，法制独立；不列为王室普通行政郡。
- **大西洋**：1516/1517 Pert-Cabot冒险记述文献晚出且有1527年航程混淆，不能建殖民地或精确航线。

## 资料查找顺序
- [SOURCE_REGISTRY.json](SOURCE_REGISTRY.json)：基础19条权威机构与学术史料。
- [SUPPLEMENTAL_SOURCES.json](SUPPLEMENTAL_SOURCES.json)：14条新增史料系列、地方编年史、学术考证。
- [PRIMARY_ARCHIVE_FINDINGS_A.json](PRIMARY_ARCHIVE_FINDINGS_A.json)：5条具体档案/测图线索，包括英国图书馆1518年12月交城信件和国家档案馆Flodden坐标。
- [TOURNAI_CONFLICT_AUDIT.json](TOURNAI_CONFLICT_AUDIT.json)：五个游客网站、官方遗产和专业史家冲突点（1513/1515/1517城堡建设期、1518/1519移交、议员代表权、左右岸、约定款不是到账）。
- [FINANCIAL_CANDIDATES.json](FINANCIAL_CANDIDATES.json)：5个不同会计类型的候选；600,000金币属于1518条约偿付**承诺**；2,264 livres是1517年市政筑堡支出的学者整理候选，**非英王直接获利**。

## 下位同事最值得先做的任务
1. British Library `Add MS 48002 ff150v–152v`, `Cotton MS Vitellius C XI ff169r–189v`、`Cotton MS Caligula D VII ff57r–59v,63r–63v,73r–73v`核清1518签约、支付义务、1519实际交城。
2. `Add MS 48036 ff2r–9v,22r–26v`与Murphy(2014)追1515—1518图尔奈市政/城防/地方居民负担与可能经济受益人。英国图书馆馆藏初审可用，但原文多需到馆。
3. 英国TNA `SP 1 (1509–1547)`、`SP 2 (1516–1539)`与法国/比利时地方档案，按城市、近郊、教区、爵位身份重建图尔奈的实际管辖地理，不把现代Tournai commune或主教区全部填色。
4. UK/NRS对读1513弗洛登及Wark守军维修、奥尔巴尼1515摄政原件。远征胜利不代表国家合并。
5. UCC `M1512.8–9`, `M1516.7`, `M1516.12`, `M1519.4`与独立当地史料核对爱尔兰城堡权力变动；只有地点可证时制作地点点位。
6. 经济研究仅在原始回单/账簿逐条核完后展示数额，先分开法国王室的条约赎金、图尔奈市政负担、英王军费、英国毛呢/羊毛集散关税和宗教财产权。

## 接力与版权
每位同事在自己的 `research/<专题名>` 分支累积，分批提交和PROGRESS记录SHA。第三方图件若无许可只存来源网址，不能自动复制。参考上一阶段资料`research/territorial-1500-1510-20261012`和`research/hypothetical-boundaries-1500-1510-20261012`；本批不会直接提交main。逐年事件和控制关系有分别数据字段，严禁把本图中任意圆圈当“1513年图尔奈历史控制面积”。


## 第二次查漏补缺（2026-10-12）
请优先查阅 [RESEARCH_GAPS_AND_PRIORITY_20261012.json](RESEARCH_GAPS_AND_PRIORITY_20261012.json)，包含8项分级档号/研究任务（4个P0，3个P1，1个P2）。
- **重要新增1517**：John Rastell the elder 及John Howting、Richard Spicer获英王1517-03-05文书支持准备北美殖民定居，至少4艘船在英吉利海峡沿岸发生争执后未建立定居点；已纳入事件和控制关系库。可靠二手来源 David B. Quinn 载于[加拿大传记辞典](https://www.biographi.ca/en/bio/rastell_john_1F.html)。与原有Sebastian Cabot/Thomas Pert“航行传闻”是两条不同史料主张，不能互相代替。
- **1515爱尔兰行政原件入口**：British Library Add MS4792 ff96–110（国家状况/改革建议）、Add MS4763 ff481–495（后世抄本）；Sir William Darcy 1515-06-24文章在Bodleian Laud Misc611存有摘录。待核原文与作者/司法覆盖范围。
- **1519/1520纠错**：Ellis(2023)指出约1519-11亨利八世决定撤换Kildare，但Surrey获增强军队的lieutenant正式任命为1520-02，实际英国军官治理与远征属于1520年代。此前“1519 Surrey已实际主政”简化现已修订事件和控制数据库。
- **重要空间新资料**：[Wallonia historical atlas 1513–1519 Tournai and Tournaisis](https://connaitrelawallonie.wallonie.be/histoire-et-symboles/histoire/atlas-historique/tournai-et-le-tournaisis-sous-influence-anglaise) 显示城市之外还有大片Tournaisis研究对象，约60乡村教区受复杂乡村司法体系管辖（[Lille 2013 dissertation](https://pepite.univ-lille.fr/ori-oai-search/notice/view/2013LIL30041)）。原1.15km图尔奈圆圈只是地名标签，不能视为当年所有英方影响/行政疆界；地区图仅保留文献链接，未经制图授权未描摹。
- [FOLLOWUP_EVIDENCE_SOURCES.json](FOLLOWUP_EVIDENCE_SOURCES.json)：5条新的文献/档号说明。[SPATIAL_GOVERNANCE_FOLLOWUP_SOURCES.json](SPATIAL_GOVERNANCE_FOLLOWUP_SOURCES.json)：5条地区地图、地方政府、苏格兰群岛资料。现累计53条不同来源索引记录（原43+新增10）。

## 第二轮深挖与主编交接（2026-10-12）
- 新增 `PRIMARY_DOCUMENTS_DEEP_DIVE_1515_1518.json`：**10个**涉及1515年爱尔兰改革、1516年图尔奈市政与外围乡村的档案/同行评审来源，**8条**带原始档号的关键论断。其中英国国家档案馆 `SP 60/1 no.9`、英国图书馆 `Add MS 4792 ff96–110`、兰贝斯 `Carew MS 635 pp188–189`是不同来源/版本，需审稿人校勘。
- 图尔奈英王总督与当地市政议会共治，部分外围村庄表示提供城堡工役；**提出免费劳力**不等于确证实施或强迫劳动，未增加LAB图标。相关馆藏线索 `TNA SP1/13 ff28r–29v`、`BL Cotton Caligula E/I ff58r–59v`；早期地方财务申述也非独立审计账本。
- 比利时国家档案馆2015年专题介绍确认Tournaisis有复杂的封建领主、司法与村庄社群权力结构，因此任何宏观英王影响区只能是多层次暂拟边界。
- `FOLLOWUP_EVIDENCE_SOURCES.json` 已修正《加拿大传记辞典》网址为 `rastell_john_1F.html`，并分清John Rastell父亲组织1517年殖民定居计划，儿子是传记标题人物、后期另有航行。
- 为避免主编反复翻阅历史源档，另建 `editorial/intake-1510-1519-20261012` 审阅分支，整理了15条符合主站数据契约的预审候选及19→15+4研究去向表；该分支不自动修改正式地图。见其 `editorial/1510-1519/README.md`。

### 图尔奈几何原件去重记录（2026-10-12）

此前目录中的 `TOURNAISIS_PUBLICATION_LAYER_CANDIDATE.geojson` 与 `editorial/1510-1519/TOURNAISIS_OPTIONAL_OVERLAY.geojson` **完全相同**（Git blob SHA `5abce1836e0f69e12b1b92f9e64dec1cdf6962c6`）。为减少双份文件引起的修订分叉，工作树仅保留已在主编出版门禁和审核文档中引用的 `editorial/1510-1519/TOURNAISIS_OPTIONAL_OVERLAY.geojson`；研究原始版本与删除提交仍保留在Git历史中。几何、来源、审核等级均没有修改，研究用的外围凸包依然属于不确定虚线参考。
