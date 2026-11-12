# 爱英TV｜主编17 第十批：T19卡纳提克战争、海得拉巴附属同盟与Kattabomman税权抵抗

**2026-11-10｜分支 `map/18c-carnatic-hyderabad-kattabomman-20261110`｜源自第九批PR #298头部｜只在`?review18c=1`公开研究试阅，`main`正式网站不变。**

## 一、延续主编15/16/17前九批原始数据、成熟地图与写作范式

遵循前辈既有的16/17世纪Leaflet地图、逐年Chronology、独立长篇Article、`[[E18C-...|自然语言行动]]`正文可点/双击档案/返回的三层互动结构。没有新建读者网页系统，浏览器验收使用桌面1780×1020尺寸。

**主编15 `research/18c/consolidated/series/T19.json`共3个合并组、5条真正入选原始研究ID、7条原B助手注册来源键**：

| 真实组合 | 年份 | 真正原始候审ID | 第十批实际事件 |
| --- | --- | --- | --- |
| `E18-MRG-T19-01` | 1761／1763 | `AB-B22-001`、`AB-B22-003` | 1761 Pondicherry降约；1763巴黎条约第十一条商馆归还 |
| `E18-MRG-T19-02` | 1798 | `AB-NEW-029-001` | 1798-09-01海得拉巴附属军队财政条款 |
| `E18-MRG-T19-03` | 1798／1799 | `AB-R6-069-01`、`AB-R6-069-02` | Kattabomman与公司地税争议、1799 Panchalankurichi军事攻击 |

其余**9条**由皇家收藏、英国国家陆军博物馆、英国图书馆及印度官方独立证据补充；所有新增事件都留`research_merge_group_id:null`及`research_original_record_ids:[]`，**没有篡改315原研究组合归属**。

原始集中ZIP不作任何改动，保留原三助手原稿、162组、315入选映射与1126归档去向。第十批自动脚本将逐一打开集中ZIP内`SOURCES_B.json`，确认7条带B:命名空间的来源键与本批注册一致。

## 二、已入库的实际交付物

| 文件 | 内容与数字 |
| --- | --- |
| `data/stories/serial/chronology-preview-carnatic-hyderabad-1700-1799.json` | **14条真实具年份研究事件、20条来源、4个Royal Collection提供现代具名地点参考事件点**；其余10个空GPS；**0未经证实Polygon、0凭空画的行军线** |
| `data/stories/serial/e18-t19-carnatic-hyderabad-palayakkarar-1746-1799.json` | **18章54段完整中文专题及14处一对一Atlas互动行动** |
| `data/stories/serial/preview-18c-index.json` | 前九篇完整保留，新增第十篇；E6-T12 17世纪公司正式前篇只在审稿模式列出第十篇后续 |
| `research/continuity/1746-1799-carnatic/ACTOR_TREATY_CONTROL_DISPOSITIONS.json` | **13条**法国、英国公司、尼扎姆、地方Palayakkarar军政及法律状态过渡；无古疆界自动延续 |
| `scripts/test_18c_carnatic_hyderabad_map.js` | 审计5个原ID、3真实组、20来源、18章54段14处唯一地图链接、各年度经纬度和面积禁令 |
| `scripts/audit_18c_carnatic_source_registry.py` | 访问原ZIP里7个B源键，不能用新造的来源冒充旧研究 |
| `scripts/browser_18c_carnatic_hyderabad.py` | 真实1780×1020桌面：1798长篇→1760 Wandiwash→1761法方降约→1746法国夺Madras→1763无GPS条约→1799处决档案双击→返回1798；普通main模式隔离、16C旧事件回归 |
| `.github/workflows/18c-carnatic-hyderabad-map.yml` | 第十批+旧九篇源GIS静态和十篇桌面回归、Actions截图、可公开访问的第三方独立网页及其CSS/JS/数据完整性探测 |

## 三、历史纠偏与源证阅读级别

1. **1746 Madras法军占领**：皇家收藏RCIN 730073展示法国舰队和St George堡，馆方说明9月26日投降，而旧版印刷图标题写9月21日，可能涉及不同阶段、历法或记载；因此事件只标1746年，留不确定日期说明。法国短期夺取英国商馆不是法国对整个南印度拥有完整主权。
2. **1748 Aix-la-Chapelle**：英国国家陆军博物馆确认法国承诺将Madras归还以换取Louisbourg；1748是条约年份，不强行当作全部当地人员和军队已实际交割的同一日。
3. **1751 Arcot**：NAM记Clive公司军守城、法属公司与印度盟友参与；不会把本土各方当成法属或英属国家行政区。
4. **1760 Wandiwash**：皇家收藏RCIN 733001记1760-01-22 Eyre Coote击败Lally，并分列双方欧洲与印度士兵。馆方说明制图者未必赴印、具体地图资料来源不详，因此只用页面所列现代Vandavasi参考点，非旧阵地实测位置。
5. **1760—1761 Pondicherry**：Royal Collection RCIN 733022与原助手B来源证实1760-09-27开始围城、1761-01-16法军投降。城市控制有年节点，但旧军图军阵未做历史配准，不得虚构围城控制范围Polygon。
6. **1763巴黎和约**：原始Article XI明定法国恢复1749初在Coromandel／Orissa／Malabar／Bengal已有商馆，并限制在孟加拉驻军及新建防御工事；法方原商馆恢复是**书面国际条款**，各地实际移交须分地查证。不能把1761占领点一直染成1799英国直辖。
7. **1790尼扎姆—公司联盟**：Aitchison1909汇编按条约目录记1790-07-04攻守同盟，并保留尼扎姆独立邦国身份；随后1798条款是另一次深化。
8. **1798-09-01海得拉巴**：BL IOR/H/635 pp.119—134，印度考古调查局馆藏Aitchison重印条款共同证实六千Sepoys、月付201425卢比、年付2417100卢比、四期各604275卢比。这里是**合同应付**，不等同史上实际全数到账。1798年尼扎姆未因此让出全部属地。
9. **1798法籍军官**：Aitchison条约附加条款要求尼扎姆将法国军官和兵员移交公司控制；约定的强制过程不同于逐个实际交船日期。
10. **1798—1799 Kattabomman**：Cambridge历史论文与Tamil Nadu考古部门都保留当时Palayakkarar地方地税及军事统治争端。1799公司军攻Panchalankurichi古堡；Thoothukudi县政府记Kattabomman于1799-10-16在Kayathar身亡。1974年新建纪念堡不可冒充1799古堡精确座标。
11. **1800／1801绝不偷算到1798／1799**：BL IOR/H/635另列1800-10-12尼扎姆防御条约，Aitchison独立附表将土地割让置于1800。Tamil Nadu Archaeology墓地目录中不少铭文明确为1801年与Umaithurai战争，不能反推1799具体死亡人数。

## 四、地图GIS、统计与空间语义

- Royal Collection分别提供1746 Madras（13°05′16″N 80°16′42″E）、1760 Wandiwash（12°30′15″N 79°36′20″E）和1760—1761 Pondicherry（11°55′48″N 79°49′48″E）现代地点中心。**四个有坐标的年份事件对应三个具名现代地点**。
- 其余10件包括法律文本、财政条约、地方税务争端、古堡未核精确位置、Kayathar处刑地点等，全部`lat:null`；没有战场精准位置就让原Atlas展示空GPS事件说明。
- 真正控制Polygon批准数量**0**，不把1798常驻公司军当海得拉巴整个邦国被英国直接占领。将来如有不确定历史边界示意，采用虚线且标清法理与实控差异，绝不用现代邦县界倒绘。
- 数值仅採原条约编制及费用，不能把名义补贴、军费债权与实际公司收入混计。

## 五、具体权威史料与历史条文

- [Royal Collection RCIN 730073：1746 Madras旧军图](https://militarymaps.rct.uk/war-of-the-austrian-succession-1740-8/map-of-madras-1746-chennai-tamil-nadu-india-13deg0516n-80deg1642e)
- [Royal Collection RCIN 733001：1760 Wandiwash](https://militarymaps.rct.uk/other-18th/19th-century-conflicts/map-of-the-battle-of-wandiwash-1760-vandavasi-tamil-nadu-india-12deg3015n-79deg3620e)
- [Royal Collection RCIN 733022：Pondicherry围城](https://www.rct.uk/collection/733022/map-of-pondicherry-1760-61-puducherry-tamil-nadu-india-11deg5548n-79deg4948e)
- [NAM 1748 Aix-la-Chapelle与Madras恢复](https://www.nam.ac.uk/explore/war-austrian)
- [NAM 1751 Arcot、1760 Wandiwash与1761 Pondicherry](https://www.nam.ac.uk/explore/seven-years-war)
- [Yale Avalon《1763巴黎和约》Article XI全文](https://avalon.law.yale.edu/18th_century/paris763.asp)
- [British Library IOR/H/635: 1798 Hyderabad及1800不同条约目录](https://searcharchives.bl.uk/catalog/040-000004729)
- [印度考古调查局馆藏Aitchison1909条约汇编第九卷](https://ignca.gov.in/Asi_data/14007.pdf)
- [Tamil Nadu Archaeology：原Panchalankurichi宫殿发掘](https://www.tnarch.gov.in/panchalankurichi)
- [Tamil Nadu考古：英军墓葬1799、1801区别](https://www.tnarch.gov.in/British-Tombs1)
- [Thoothukudi县政府：Kattabomman卒年与Kayathar](https://thoothukudi.nic.in/tourism/festivals-personalities/)
- [Thoothukudi县政府：1974纪念堡是新建筑](https://thoothukudi.nic.in/tourist-place/panchalankurichi/)

## 六、网页链接及后继

**正常正式网站**：<https://1959124923wyz-sys.github.io/love-British-TV/>，正式`main`只含此前已经发布内容。存档PR为Draft，不修改Pages工作流（它只在main部署）。

**第十批公开可访问研究地图（第三方静态GitHub文件代理）**：

`https://raw.githack.com/1959124923wyz-sys/love-British-TV/map/18c-carnatic-hyderabad-kattabomman-20261110/index.html?review18c=1&year=1798`

网页可访问性必须由本批Actions对该SHA的HTML、JS、CSS、年度JSON与专题JSON做真实HTTP探测；预览与正式Pages严格分离。

下一位编辑继续查1746法军投降具体日期、皇家军图地理配准、1763各法国商馆实际重新移交日期、1798尼扎姆实际军费到账、1799 Palayakkarar地税原账和古堡地籍，并准备1800—1801跨世纪衔接。**源未核之前不得填写新主权边界或殖民总利润**。
