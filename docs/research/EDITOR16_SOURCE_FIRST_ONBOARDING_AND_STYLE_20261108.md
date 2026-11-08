# 爱英TV｜主编16接任与史料优先工作法（2026-11-08）

**状态：作业规范和审计交接；不是新专题投产许可。** 实际继承路径：研究草稿 PR #289 → 阿卡迪亚 PR #290 → 孟加拉 PR #291 → 牙买加 PR #292 → 大西洋奴役/Zong PR #293。各PR仍为Draft，正式`main`不可擅自合入。

## 一、接任前已核实的现存原始底稿

来源仓库 `research/18c/consolidated/` 是主编15的**首选查询入口**，不应丢下它重新从空白网络搜索。

| 来源文件 | 实际用途 | 当前核对 |
| --- | --- | --- |
| `MERGED_EPISODE_GROUPS.json` | 162个研究聚合组、候审子行动、原始ID、初分级和外部链接 | 162个唯一组合ID；82主图候审+58专题候审+22正文组合 |
| `ORIGINAL_TO_GROUP.csv` | 315条筛入主图/专题候审的原始ID及最终组归属 | 315唯一原始ID；每条指向存在的聚合组 |
| `COMPLETE_1126_ARCHIVE_CROSSWALK.csv` | **所有原始记录**去向与来源线索 | 1126唯一原始ID；其中315归组、432仅正文、363低价值归档、16待核 |
| `series/T01.json`—`T35.json` | 按主题/地域领取和校对每个研究组合 | 35个系列文件；34个含候审组；T33是有意保留的空档 |
| `CONSOLIDATION_MANIFEST.json` | 汇总口径、候审与发布阶段、GIS门禁 | 0个通过审查的新英国实控Polygon；162条仍是编辑聚合组，不等于162个已发表地图事件 |
| `raw_sources/assistant_A_americas_round8.zip` | 助手A的美洲/加勒比/奴役贸易完整原始研究 | Git树有真实二进制，1,436,728字节；SHA256对照说明在`raw_sources/README.md` |
| `raw_sources/assistant_B_asia_africa_round7.zip` | 助手B的南亚/东南亚/非洲完整原始研究 | Git树有真实二进制，992,322字节 |
| `raw_sources/assistant_C_continuity_round8.zip` | 助手C的跨世纪/爱尔兰/苏格兰/澳大利亚研究 | Git树有真实二进制，711,148字节 |
| `18C_Consolidated_Research_Handoff_20261108.zip` | 162组、315原ID、1126去向、原来源登记册等完整集中包 | Git树有真实二进制，615,391字节，包含未逐一拆出仓库目录的JSON/来源登记册 |

**集中ZIP内部结构：** 来源登记册在压缩包内实际命名为 `SOURCES_A.json`、`SOURCES_B.json`、`SOURCES_C.json`，另有 `SOURCES_AUDIT.json`。该ZIP包含34个非空 `series/Txx.json`；空队列 `T33.json` 单独存于GitHub `series/` 目录。其余34个非空系列及T33合计35个，数据未因此漏组。

**目录差异：** README提及的 `ORIGINAL_TO_GROUP.json`、`COMPLETE_1126_ARCHIVE_CROSSWALK.json` 和 `ORIGINAL_RESEARCH_ZIP_SHA256.json` 并非都在`consolidated/`作为独立根级文件展开；应到集中ZIP内部查找，或使用已展开的CSV及`raw_sources/README.md`。不能因根路径不存在便声称证据丢失，也不能将压缩包文件存在误说成已经逐字验证原始手稿。

完整性独立脚本：`python3 scripts/test_18c_archival_integrity.py`。它验证35个分系列与162组一致、315与1126去向一一对应、三份原始ZIP的SHA-256及ZIP CRC、集中ZIP主要文件。由 `.github/workflows/18c-atlantic-zong-map.yml` 在代码提交时自动执行；以Actions实际通过结果作为验收凭据。

## 二、前辈已经上线的16世纪写法与17世纪成熟专题的实际范式

本次同时对照了已上传的30文件16世纪参考ZIP、`AGENTS.md`、`docs/templates/16c-story-map-standard/README.md`、前辈`HANDOFF_20261022.md`、已发表的 `data/stories/drake-panama-mule-train-raid-1572-1573.json` 和 `data/stories/serial/e6-t11-atlantic-slave-voyages-quant-resistance.json`，并复核前三批18C交接和真实JS加载器。

**一致性要求：**

1. **史实先于点位和版图。** 从具体行动的`original_id`、年份、责任主体和`source_urls`开始；保留`candidate_subevents`，同一次远征/法案/驱逐的琐碎阶段合并，性质与主体不同的行为单列。
2. **长期历史专题是完整的自然中文叙事。** 交代时代前史、行政/商业制度、具体行动、当地社会的自主与反抗、后果与跨世纪持续。避免大量重复事件标题；数字明确分母、币种、估算/档案级别，历史来源与当事方证词区别。
3. **每个成图史事有稳定的Atlas研究事件ID。** 在`sections[].paragraphs`用`[[已登记事件ID|实际行动词句]]`，文章入口由统一专题索引管理，正文散布真正可点击的节点。单击切所指年份／有据坐标则镜头平移而不缩放；双击独立档案，再返回原专题和原入口。
4. **时间切片不重置政治控制。** 1699→1700的上一期`stable_id`必须逐个取得`continued`/`transferred`/`ended`/`uncertain_continuity`去向；17C曾发布的某专题不能冒充该世纪全部古界审定。1707年前的苏格兰政治主体与英格兰分开。
5. **地理分层。** 已证真实驻点可用Point和固定屏幕圆标；无原年代界线的局部影响区只有有据锚点才能用淡色虚线参考层。单次海上袭击、航次、议会法案、经济网络不能推导英国殖民地面积或GPS船迹，`area_sqkm:null`、`fill_authorized:false`。
6. **首选在原地图增量开发。** 复用`app.js`、`js/history-stories.js`、`data/stories/serial/`、旧17C篇ID，不造第二套网页组件；18C研究只在`?review18c=1`独立试阅，正式`data/chapters.json`不改。
7. **保存且可回退。** 一批至少提交年表JSON、专题正文、史料证据、正确历史空间对象（可为零）、静态与1780×1020真实桌面浏览器QA、工作流、独立分支/草稿PR和交接报告。未确认CI与Pages前不得自称正式上线。

## 三、第四批来源映射复核与修正

**复核发现：** 第四批首稿部分`research_merge_group_id`仅凭主题相近指派，造成1711/1713/1720事件误指向**1750年的`T01-03`西非商人公司重组**，1787组织化运动误指向**1792年的`T01-07`议会渐进动议**，以及1789运奴船法规修订误被写作原先只收1788年材料的正式组合。这种对应方式破坏了原始315条的追溯性。

**现在已修正：**
- 每条第四批研究事件增加`research_original_record_ids`、`research_archive_dispositions`、`research_provenance_kind`、`research_related_group_ids`。只有原始候选真属于该组、年份也相符，才填写`research_merge_group_id`。
- 14件中：**8件直接对应经归并研究组**、**2件由原1126中的正文资料提升为试阅事件**、**4件为后续补充机构来源**。各项具体ID和理由见 `research/18c/EDITOR16_T01_T02_ORIGINAL_1126_PROVENANCE_AUDIT_20261108.json`。
- 1750年非洲贸易机构法对应`T26-02`（英议会法案、殖民种植园奴役人口需求），而`T01-03`只保留相关制度子步骤关联。归组跨专题是合法的历史结构，不应制造第二次不同的法案。
- 1713年英国Asiento特许已有原研究记录`E18A-1713-A02-01`（原定仅正文）而非1750原组；旧研究还保留了**1750年《马德里条约》终结Asiento安排**及双方批准的三个正文原ID：`E18A3-1750-ASIENTO-TREATY`、`...RATIFICATION-UK`、`...RATIFICATION-SP`。这三件是重要的同一制度历史结尾，先作为下一轮核原档的**专题正文材料**，不自动生成三个重复地图图标。
- 1788年Dolben提出、通过与生效内容归为一个制度地图事件；原先低价值子步骤保留原始ID作佐证，不升级成三个新事件。

## 四、以后每一批的资料优先检索顺序

1. **分系列研究**：先按T01—T35定位 `series/Txx.json` 的主图与专题组及原始`candidate_subevents`，不要直接从空白网页找题。
2. **全量回溯**：用`MERGED_EPISODE_GROUPS.json`、`ORIGINAL_TO_GROUP.csv`、`COMPLETE_1126_ARCHIVE_CROSSWALK.csv` 搜索同年/地域/主体原始记录，区分已经合并、正文证据、低价值资料、待核史实。没有对应的新增事实要独立注明补充来源，不能伪装原315条候选。
3. **原始材料**：在A/B/C ZIP中按原ID和`source_ids`/来源命名空间核对助手最初的`TOPIC_DOSSIERS`、`SOURCE_REGISTRY`、`EVENT_CANDIDATES`、`GAPS_AND_CONFLICTS`；原助手的链接仍需在机构/原档独立核对，目录不是已读原卷。
4. **跨世纪与前辈成果**：读取对应17C已发表专题ID、旧Atlas年份事件、上一期 `CONTROL_EPISODES` 与年末状态，避免旧文章重复和一换年份领土凭空消失。
5. **只补缺口**：优先证据高、地图价值大的事件，以及国家法令、财富转移、人口影响与当地抵抗；低价值案件转为正文或证据。若史料不足，保存研究缺口而不是猜日期、坐标、人数或疆界。
6. **一批一门禁**：历史主张→地图与文章→来源ID→严格GIS→静态测试→真实桌面交互→独立Git提交和详细交接→主编批准→合并及部署核验。

**接任决议：** 当前任务先完成以上审计和第四批来源指针整改。之后扩大T01/T02或推进T17/T30/T34等下一专题，都应重新使用本规范与完整1126原档，沿用前三批已建UI和前辈成熟16C/17C风格。
