# 爱英TV｜主编17 第八批：1767—1799迈索尔战争、抵抗与1799年分治地图交接

**2026-11-09｜独立分支：`map/18c-mysore-wars-partition-20261109`｜`?review18c=1`专用｜前七批均继承；不改正式 `main`。**

## 一、先学习前辈，再根据T17源档选材

已按`docs/research/EDITOR16_SOURCE_FIRST_ONBOARDING_AND_STYLE_20261108.md`、16世纪30文件标准包、前七批JSON/JS/Chromium、既有17C E6-T12公司专题核对作者规范。

本批使用主编15 `research/18c/consolidated/series/T17.json` 及 `COMPLETE_1126_ARCHIVE_CROSSWALK.csv`：**5个原合并研究组，12条唯一原始候审ID**。它们分别是：

| 研究组 | 年份 | 真实原ID | 第八批处理 |
| --- | --- | --- | --- |
| T17-01 | 1769 | AB-B12-002 | Madras逼和 |
| T17-02 | 1780、1781 | AB-R6-067-01 / AB-R6-067-02 | **两场战斗两种战果**，两个真实Atlas ID |
| T17-03 | 1784 | AB-B13-004 | Mangalore和约 |
| T17-04 | 1792 | AB-B14-002 / AB-B14-003 | 2月人质交接、3月三方分土条约 |
| T17-05 | 1799 | AB-B15-001 / AB-B15-002 / AB-B15-003 / AB-NEW-030-001 / AB-NEW-030-002 / AB-NEW-030-003 | 5月攻城、战利品与书籍、6月分治、7月附属条约；7月13日批准线索作为归档资料而不堆独立图标 |

前辈B助手原有**8个带B:命名空间的来源键**；`scripts/audit_18c_mysore_source_registry.py`将直接读取原集中ZIP内`18c_consolidation/SOURCES_B.json`，检查本批16项来源登记是否完全包含这8个B键。另增加8项独立可核权威机构目录与学术机构证据。1767与1790两个战争开端作为**无原315候审ID的补充事件**，分别设`research_merge_group_id:null`、`research_original_record_ids:[]`，避免冒充主编15的原始记录。

## 二、交付物

| 文件 | 内容 |
| --- | --- |
| `data/stories/serial/chronology-preview-mysore-1700-1799.json` | **12个具年Atlas研究事件、16项史料、5个参考点**；每条明确原ID、责任主体、定位误差；0边界Polygon |
| `data/stories/serial/e18-t17-mysore-wars-partition-1767-1799.json` | **16章48段**中文完整历史专题与12处自然语言`[[E18C-MYS-...|行动]]`真实地图互动 |
| `data/stories/serial/preview-18c-index.json` | 原7篇后新增第八篇；原已发表17C公司前史`E6-T12`仅研究模式提供后篇入口 |
| `app.js`、`js/history-stories.js`、`index.html` | 原Leaflet与年轴增量加载；点击改变年份和平移，双击事件档案、返回原长文；普通主站隔离 |
| `research/continuity/1792-1799-mysore/MULTI_ACTOR_PARTITION_RESEARCH.json` | 7条军事、宪制、割地与间接统治主体过渡，不假造任何年份的`stable_id`或政治面 |
| `scripts/test_18c_mysore_map.js`、`scripts/audit_18c_mysore_source_registry.py`、`scripts/browser_18c_mysore_wars.py`、`.github/workflows/18c-mysore-map.yml` | 史料溯源+GIS+原七篇静态回归+1780×1020真实桌面地图回归，截图保存至Actions |

## 三、交叉核实的关键历史主张

1. **1767—1769** 第一次战争末期，海德尔·阿里逼近马德拉斯并于1769年4月议和。东印度公司并未因此征服迈索尔；《Treaties, Engagements and Sanads》的目录载1769-04-03双方归还所占地方与互助防御的条约。
2. **1780 vs 1781 Pollilur**：1780-09-10的Baillie败北与1781-08-27 Eyre Coote获胜是两个不同战斗。NAM用Parambakum地名亦叙述1780公司军失败，Royal Collection RCIN 734067明确1781日期、指挥者和`12°50'N,79°43'E`的现代Pollilur地理标签。1780战位保留`lat:null`，绝不挪用1781的精确军图假定1780地理坐标。
3. **1784 Mangalore**：英国图书馆IOR/H/633 pp.139-146将1784-03-11和约与三名签署者登记明确；Add MS 39857-39858有使团日记。公司与迈索尔恢复和平，后续战争另起。
4. **1790—1792**：第三次战争由公司联络海德拉巴尼扎姆、马拉塔组成对迈索尔联盟。1792-02-26两名提普王子在围城谈判中作履约担保；1792-03-18正式和约参照BL IOR/L/PS/19/3的波斯及英文文本、地税`Jamabandi`。
5. **1792年割地**：约半数迈索尔领土分别给公司、尼扎姆、马拉塔三方；未经过地名地籍逐项配准，不计算“英国取得了多少平方公里”，更不把印度盟友所分领土标为公司直辖。
6. **1799年5月4日**：公司与尼扎姆盟军攻陷Srirangapatna、提普死亡，NAM和印度提交UNESCO的遗产资料相符。UNESCO现代岛镇中心`12.414,76.704`仅给城市宽域参照，不能指认王室帐篷、决口及军阵。
7. **官方处分财富**：NAM载1799-05-17 Prize Committee将提普战帽等交Cornwallis，以及金银器物售卖和奖金按军阶分配；馆方称2000余册图书手稿。BL Mss Eur E196馆藏目录亦记载物品及书籍分拨的往来抄件；**目录存在**并不等于已逐件估值或确认每册最终位置。
8. **1799分治及附属条约**：BL IOR/H/635 pp.141-168为6月22日公司—尼扎姆分治、pp.181-198为7月8日公司—迈索尔王室附属条约。既区分Company直辖地区，也区分Nizam获地与Wodeyar受约王国，拒绝生成虚假统一英国领土。

## 四、GIS与未解历史问题

- 只有1781 Pollilur皇家收藏指定的现代村庄参考位置（`12.833333,79.716667`）；1792和1799部分首都事件采用印度政府提交UNESCO的Srirangapatna岛镇总参考位置（`12.414,76.704`）。**合计5个年度事件附现代参考点，0真实控制Polygon，0伪造行军线**。
- 战役与疆界为不同证据类型。1792割地、1799条约均不能据“约半数”“条约附件”而先绘现代邦县面。未来应调BL IOR/L/PS/19/3 Jamabandi、IOR/H/635 treaty schedules A/B/C及跨18/19世纪地名表逐县核查。
- 1799-07-13尼扎姆批准日期是助手原文件`AB-NEW-030-003`的描述线索，BL目录本轮只明确证实6月22日条约及7月8日另项条约，**暂不增加批准日的独立已核Atlas事件**。
- 原始1799战利品精确总额、战场双方死亡人数、不同年代人口变化、逐件宫廷藏品实物登记尚需原卷。项目不编造财富净额及伤亡。
- 旧E6-T12前篇含跨世纪公司驻点，1699→1700具体`stable_id`仍需逐处查询真正历史控制账，不以本批迈索尔为由改变其几何。
- UNESCO印度提交的遗址属于**申报预备名单**，岛镇现代坐标不是1799年的政治疆界；皇家收藏1781旧军图是史料，可用其现代地名标签定位，不能作为军队边界Polygon。

## 五、主要来源入口（馆方与原档先于二手转述）

- [National Army Museum—Tipu's war turban、战利品委员会与1799攻城](https://www.nam.ac.uk/explore/tipu-sultans-war-turban)
- [NAM—1780 Baillie败北、1781 Coote胜利](https://www.nam.ac.uk/explore/american-war-independence-key-battles)
- [Royal Collection RCIN 734067—1781 Pollilur战图](https://militarymaps.rct.uk/other-18th/19th-century-conflicts/map-of-the-battle-of-pollilur-1781-pollilur-near-kanchipuram-tamil-nadu-india-12deg5000n-79deg4300e)
- [BL IOR/H/633—1784 Mangalore原档目录](https://searcharchives.bl.uk/catalog/040-000004727)
- [BL Add MS 39857–58—使团日记](https://searcharchives.bl.uk/catalog/032-002059709)
- [BL IOR/L/PS/19/3—1792年和约及割地税收表](https://searcharchives.bl.uk/catalog/040-000564194)
- [BL IOR/H/635—1799分治及附属军事条约](https://searcharchives.bl.uk/catalog/040-000004729)
- [BL Mss Eur E196—1799藏书档案](https://searcharchives.bl.uk/catalog/032-002278328)
- [印度UNESCO预备名单 Srirangapatna岛镇](https://whc.unesco.org/en/tentativelists/5895/)
- [NCERT印度历史教材：公司从贸易向领土扩张](https://www.ncert.nic.in/textbook/pdf/hess202.pdf)

## 六、验收门禁与后续

本批CI定义为：`node scripts/test_18c_mysore_map.js`（12 ID及所有原ID映射）；`python3 scripts/audit_18c_mysore_source_registry.py`（B原ZIP编号）；全部七篇前代静态测试、`test_18c_archival_integrity.py`、严格`audit_spatial_semantics.py --strict`；桌面Chromium从1799年打开长文，跨年移动到1781皇家旧战图、1792城镇参考点，双击无GPS条约节点并返回；再跑七篇老地图与16C回归。**验收结论以GitHub本次PR最新HEAD的实际Actions为准。**

**所有内容为研究试阅，Draft；不得自动合并`main`或宣称正式网站发布。**
