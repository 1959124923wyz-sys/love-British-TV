# 爱英TV｜主编17 第九批：T18罗希拉、第一次英马拉塔战争、阿瓦德财政与贝拿勒斯抵抗地图交接

**2026-11-09｜分支：`map/18c-maratha-rohilla-awadh-20261109`；仅`?review18c=1`研究试阅；继承第八批PR #297；保持主分支`main`完全不变。**

## 01. 原始资料为本，保持前八批成熟的16C17C交互范式

原调查使用主编15 `research/18c/consolidated/series/T18.json` 的**3组、8个原始候审ID**：`E18-MRG-T18-01`罗希拉1774（`AB-B10-002`）；`E18-MRG-T18-02`马拉塔1775/1776/1779/1781/1782（6个原ID：`AB-B11-003`、`AB-B11-004`、`AB-B11-005`、`AB-B11-007`、`AB-B11-002`、`AB-B11-006`）；`E18-MRG-T18-03`贝拿勒斯1781（`AB-NEW-018-003`）。全部与1126原始去向清单互查，严格只把同年且为组合成员的原始编号写入`research_merge_group_id`。

另增加5件真正有机构依据的背景或衔接事件：1773年公司—阿瓦德贝拿勒斯条约、1779年公司败退、1780年Gwalior军队夺堡、1781年阿瓦德财政协议、1781年Muir—Sindia阶段协议。这五条保留`research_merge_group_id:null`及`research_original_record_ids:[]`，**不把机构补充篡改为主编15原315合并候审**。

| 文件 | 具体成果 |
| --- | --- |
| `data/stories/serial/chronology-preview-maratha-rohilla-awadh-1700-1799.json` | **12事件、20史料**，3个具官方坐标现代城市参考点，9个无精确GPS，0新殖民Polygon/航线 |
| `data/stories/serial/e18-t18-maratha-rohilla-awadh-1773-1782.json` | **16章节、48段**自然中文长篇、**12个`[[E18C-MRA-...|行动]]`**可点击地图与双击档案入口 |
| `data/stories/serial/preview-18c-index.json` | 第九篇研究长篇进入目录，沿用17世纪已正式发表EIC前篇`E6-T12`的研究模式继续阅读入口 |
| `research/continuity/1773-1782-maratha-awadh/MULTI_ACTOR_CONTROL_EPISODES.json` | **11条**战争、条约、批准、局部军政与税务主体状态；没有生成任何未经核古界 |
| `scripts/test_18c_maratha_rohilla_map.js` | 12 Atlas ID与章节、所有8个原研究ID、原来9个注册B来源、3地图点、主分支隔离、无伪造版图 |
| `scripts/audit_18c_maratha_source_registry.py` | 打开主编15保留的集中ZIP`SOURCES_B.json`，逐一核**9个原助手B命名空间来源键** |
| `scripts/browser_18c_maratha_rohilla_awadh.py` | 真桌面1780×1020：1781专题→1775 Surat城市参考点→1773 Benares城市参考点→1779无GPS协定→1782双击档案与返回；旧16C/17C回归 |
| `.github/workflows/18c-maratha-rohilla-map.yml` | 新T18+旧八篇静态，ZIP/严格GIS/史事检验，九篇真实桌面浏览器自动回归、截图，附独立第三方网页访问检查 |

## 02. 史实与责任主体区分

1. **1773阿瓦德条约**：BL `IOR/H/633` 第1—5页确有1773-09-07 Shuja-ud-Daula与公司协议；同卷含相关的Chait Singh地方授田文书。对财税和军事安排的具体总额暂不机械照搬二手教科书，在原条款审校后入定量数据。
2. **1774罗希拉战争**：BL `IOR/H/221`第55—60页有1774-04-23“Battle of St George”在Miranpur Katra与Tissua之间、Hafiz Rahmat Khan战死，以及1774—1775 Alexander Champion文书。实际攻击军队为阿瓦德纳瓦布及英国公司盟军；阿瓦德获得的地方不归类为英国公司直接领土。现场坐标未核不绘点。
3. **1775—1776马拉塔继承争端**：孟买公司支持Raghunath Rao；1776-03-01 `IOR/H/633`第27—45页准确载Upton与Balaji Pandit的Purandhar协议。1775土地许诺、1776新协定、实际控制分层记录。
4. **1779瓦德冈**：Maharashtra State Gazetteer详细记载孟买公司军被马拉塔部队逼退，英国图书馆`IOR/H/633`第203—211页载`Wadgaon`协定并**特别写明孟买政府拒绝批准**。单列战败与协议；拒批没有自动完成全邦割地。两者不虚构到精确GPS。
5. **1780 Gwalior**：NAM旧版画馆藏记录1780-08-03 William Popham率**1200印度士兵**突袭夺取该堡，此人数仅指攻堡部队，不是整场战争投入兵力。要塞局部控制不外推整个马拉塔领土。
6. **1781 Kalpi**：Fisher版Dean Mahomet叙述公司部队逐马拉塔驻军并索取原向马拉塔缴付的地方税，原收税额及真正实现日期需调阅地税原簿。
7. **1781 Benares**：Chait Singh因Hastings的额外财政和军事征发、拘捕而发生地方反抗，BL `IOR/H/246`保留当年涉事公文。没有经原卷核准的死亡和军费数字不使用；UNESCO现代瓦拉纳西河岸坐标只作为城市参考。
8. **1781 Awadh财政与Sindia和谈**：`IOR/H/633`载9月19日Hastings与Asaf-ud-Daula协议、第91—93页10月13日Muir与Mahadji Sindhia协议。二者各为不同主体、不同财税与外交安排，不能与1782最终和约合并。
9. **1782 Salbai**：BL `IOR/H/633`第95—109页载1782-06-06 David Anderson与Mahadji Sindhia和平条约，`IOR/H/227`有1782—83双方往返信件。不同马拉塔统治集团与公司在此后仍保持复杂权利关系；没有任何“整个马拉塔联盟自1782年成为英国领土”的绘制授权。

## 03. 现代地点参考及GIS操作

- **1773 Benares、1781 Chait Singh：** 印度提交的UNESCO Varanasi历史河岸预备名单`25.28,82.95`（`https://whc.unesco.org/en/tentativelists/6526/`）。现代河岸参考点**不是**1773条约屋、1781拘捕室、真实军事阵线。
- **1775 Surat：** 古吉拉特邦Surat区政府`https://surat.nic.in/how-to-reach/`给出`21.170240,72.831062`，现代城市参考中心**不是**当时官署签字室。
- 其他9条没有可核精确古战场或条约签字点，`lat/lng:null`。不使用现代市县国界补成阿瓦德或马拉塔实控Polygon，不生成历史航线或军队“路线”的虚假GPS。
- 军事、政治控制、盟友协定、未批准的协定、税收和人群都分别建数据字段。可能发生的局部变化置于研究过渡账，不延伸到无证的年末控制。

## 04. 史料链接与查核深度

原助手B的9个source key实际注册URL和完整JSON由GitHub Actions读取，源自`research/18c/consolidated/18C_Consolidated_Research_Handoff_20261108.zip`，另新增11条重要机构核实来源，合计**20条登记来源**。重点：

- [British Library IOR/H/221｜Rohilla战争及1774-04-23战斗](https://searcharchives.bl.uk/catalog/040-000004262)
- [British Library IOR/H/240｜第一次Maratha战争1774—1783](https://searcharchives.bl.uk/catalog/040-000004282)
- [British Library IOR/H/633｜1773—1782协议和条约原卷书目](https://searcharchives.bl.uk/catalog/040-000004727)
- [British Library IOR/H/227｜David Anderson与Sindia往来公文](https://searcharchives.bl.uk/catalog/040-000004268)
- [British Library IOR/H/235｜Oudh的行政和财税卷](https://searcharchives.bl.uk/catalog/040-000004277)
- [British Library IOR/H/246｜1781 Chait Singh反抗的公文目录](https://searcharchives.bl.uk/catalog/040-000004288)
- [Maharashtra State Gazetteer｜Wadgaon](https://gazetteers.maharashtra.gov.in/cultural.maharashtra.gov.in/english/gazetteer/History%20Part/History_III/chapter_6.pdf)
- [National Army Museum｜Gwalior要塞1780攻占](https://collection.nam.ac.uk/detail.php?acc=1971-02-33-189-1)
- [Surat区政府定位](https://surat.nic.in/how-to-reach/)
- [UNESCO提交中的Varanasi城市参考地理坐标](https://whc.unesco.org/en/tentativelists/6526/)

所有档案级史料在叙事中区分：已核官方**目录元数据**与尚未逐页阅读的原手写文件。政治事实可采经档案目录能准确支持的日期、当事人和页码，但条约中具体金额、终局批准及逐地税收均留给下一次原文核验。

## 05. 网页链接及发布隔离

- **正式网站（仍是main批准地图）**：<https://1959124923wyz-sys.github.io/love-British-TV/>。
- **第九批Draft即时网页预览（第三方原文件静态代理，需首次确认）**：`https://raw.githack.com/1959124923wyz-sys/love-British-TV/map/18c-maratha-rohilla-awadh-20261109/index.html?review18c=1&year=1781`。
- 原仓库`.github/workflows/pages.yml`明确**只在main发布正式GitHub Pages**。没有修改正式main和自动部署逻辑；研究只依赖本分支的raw.githack静态网页，第三方代理首次打开有确认提示/缓存延迟。
- 工作流新增**可选的远程静态预览探测**，不能把尚未真实成功的外部预览检查宣称正式Pages已经部署。正式`main`上线需独立批准。

## 06. 待研究、合并与后继

必须继续查1774战场旧图配准、1779 Wadgaon堡垒与驻军状态、1780 Gwalior堡垒逐月控制、1781 Kalpi地税原始收据、阿瓦德公司军费现金流水、1782 Salbai条款执行各方地权变更。17世纪末部公司`stable_id`继续从原控制账核对，绝不自行捏造。

所有脚本与当前PR保留在独立Draft。GitHub Actions最终状态只以**最新HEAD**真实工作流全量结果为准；未核实之前不可自称36/36成功或正式出版。
