# 爱英TV｜主编16 第六批：澳大利亚流放殖民、原住民失地及Pemulwuy抵抗（1717—1799）

**日期：2026-11-08。分支：`map/18c-australia-first-fleet-resistance-20261108`，上游第五批PR #294；本批只做研究试阅 `?review18c=1`，不改变正式main与出版的16C/17C地图。**

## 原档优先：主编15资料追溯

- 原版研究：`research/18c/consolidated/series/T34.json`、`T35.json` 共 **10个**研究合并单元，`MERGED_EPISODE_GROUPS.json`、`ORIGINAL_TO_GROUP.csv` 与 `COMPLETE_1126_ARCHIVE_CROSSWALK.csv`保留每一事件的原始ID与出处。
- 原始助手C来源注册册实际嵌在 `research/18c/consolidated/18C_Consolidated_Research_Handoff_20261108.zip` 的 `18c_consolidation/SOURCES_C.json`。 `scripts/audit_18c_australia_source_registry.py`已在GitHub Actions核证本主题所用 **23个C命名空间原始来源**，0缺失。三位助手原始ZIP保持原样，统一归档完整性由 `scripts/test_18c_archival_integrity.py`验证。
- **1770 Cook声索**原候审 `C-D01-001`在1126条归档中被标为低价值，`C2-D01-001`为正文证据。本批结合[澳大利亚国家博物馆Cook声明与First Nations观点](https://www.nma.gov.au/defining-moments/resources/cook-claims-australia)提升为研究试阅重大地图节点，但 **`research_merge_group_id:null`**，未谎称它是原315条筛中候选。
- 本批23个具年节点，**18个确切指向原合并组/同组同年子事件**，其余5个是原低价值或正文证据结合新的官方资料重新审查，仍保留`research_original_record_ids`、`research_provenance_kind`。没有回写或覆盖原1126条去向。
- 另登记24项机构与现代地点来源，合计 **47项带完整url的来源记录**；不得把现代地名数据库伪装成当年土地边界的测绘档案。

## 本批真正完成的地图与专题

| 文件 | 内容 |
| --- | --- |
| `data/stories/serial/chronology-preview-australia-1700-1799.json` | 23个1717—1799年候审事件、47来源、9个现代地名/已证历史遗址参考点；0新殖民Polygon、0虚构航线 |
| `data/stories/serial/e18-t34-t35-australia-first-fleet-1717-1799.json` | 21节、63段完整中文长篇；23处一对一真实 `[[E18C-AUS-...|中文自然动作]]`交互，按年份打开地图 |
| `data/stories/serial/preview-18c-index.json` | 第六个草稿专题；前五批阿卡迪亚/孟加拉/牙买加/Zong/爱尔兰全部保留 |
| `app.js`、`js/history-stories.js`、`index.html` | 原JS/Leaflet/16C17C阅读器增加第六份研究年表；仅 `?review18c=1`，无需另做假地图 |
| `scripts/test_18c_australia_map.js` | 检查21节/63段/23链接/47来源/9地点、18正确研究组、5归档升级但不伪造组ID，以及0疆界语义 |
| `scripts/browser_18c_australia_resistance.py` | 1780×1020实际桌面Chromium：Sydney 1788→专题→1770声索岛定位→1792 Prospect抵抗定位→1795无坐标档案双击返回→普通网站隔离→16C实地图回归 |
| `.github/workflows/18c-australia-map.yml` | 核原始C来源和合并ZIP、GIS、六篇静态测试、六篇真实浏览器回归和截图Artifact |

## 事实、制度与空间的严格区分

1. **1717和1786年法律**：英国海外流放法与爱尔兰本身的流放法有不同机构和日期，不把爱尔兰的法律直接并入英国法。
2. **1770 Cook声索和1787 Phillip委任状**：声索整个澳洲东岸与东经135度法定辖区是王室书面政治主张，**未取得各原住民主权社会的土地同意，也没有当时实际英国军政覆盖全域的证据**。一律`fill_authorized:false`及`area_sqkm:null`。
3. **1788真实据点**：Warrane/Sydney Cove、Norfolk Island Kingston与Rose Hill/Burramatta分别有行政、军队或农耕据点资料。图上仅以有来源的现代具名地点作为索引；无跨据点连片英国领土区。
4. **经济与强迫劳动**：囚犯海运及雇主承包、军需补给和流放犯耕作，服务新殖民地的土地开发。1790第二舰队死亡率针对约1250名**男性被流放者**，不与所有船上人员混用分母，更不把抵港后死亡再计一次。
5. **1788/1789强制抓捕**：Arabanoo于1788年12月被拘，确切30/31日存在来源口径差异，年表只标月；Bennelong/Colebee 1789年另列，尊重当事人的自治社会与后续政治能动性。
6. **1789天花**：澳大利亚国家博物馆证实原住民遭严重疫情冲击，但确切传播机制仍有争论；不编造英国政府有明确故意散毒命令。
7. **1790、1792、1794及1797 Pemulwuy抵抗**：以澳洲国家博物馆、学术传记、当代殖民记录及原住民历史观点对照。1790年Phillip正规军惩罚远征意图与实际执行结果分开；1794斩首具体旧址未经核不设GPS。
8. **1794 vs 1795 Hawkesbury**：前一年定居者土地侵占及局部致命冲突与1795代理总督**派62人正规军**的镇压是不同性质。七八人被杀/5人俘获属于**殖民官员报告值**，既不重复加在1794年，也不冒充完整原住民人口损失。
9. **1799年两个男孩受害与司法**：先记录当年审判及未执行惩罚的情况；1802赦免属于19世纪后续材料，不能倒填为1799年最终裁判。

## 源证据入口

- [National Museum of Australia: Cook's east-coast claim](https://www.nma.gov.au/defining-moments/resources/cook-claims-australia)
- [National Museum of Australia: First Fleet convict cargo](https://www.nma.gov.au/defining-moments/resources/convict-cargo)
- [State Library NSW: first fleet original catalog / dates](https://guides.sl.nsw.gov.au/convicts-bound-for-australia/first_fleet)
- [State Library NSW: second fleet and transport deaths](https://guides.sl.nsw.gov.au/convicts-bound-for-australia/second_fleet)
- [National Museum of Australia: Pemulwuy](https://www.nma.gov.au/defining-moments/resources/pemulwuy)
- [Towards Truth: Hawkesbury River frontier violence](https://www.towardstruth.org.au/themes/country/dispossession/120-frontier-wars/sub0533-hawkesbury-river)
- [State Library NSW: Indigenous abduction](https://www.sl.nsw.gov.au/learning/fighting-back/abduction)
- [Australian Maritime Museum: contested waterways](https://www.sea.museum/en/first-nations/contested-waterways)
- [City of Parramatta: Rose Hill Aboriginal history](https://historyandheritage.cityofparramatta.nsw.gov.au/research-topics/suburbs/rosehill-brief-history)
- [Documenting Democracy: NSW foundation documents](https://www.foundingdocs.gov.au/item-did-35.html)

**未取得的历史证据继续保持空白：** 1770—1799原住民每一社群疆界、英国军队真实控制区逐年实测图、运输船逐日GPS轨迹、1794/95沿河枪击准确现场、全部受害者名单与每艘囚犯运输船收支账。1699→1700前史与年末政治连续性也仍需独立审查。

## 交接与主编审核

本批沿用前辈模板：历史制度前因→责任主体与影响→有名年份事实→经济/人口影响→自治及抵抗→未解决的18C/19C连续性。不要把原本独立的十个研究合并组直接当作十个GPS点。所有界限不明地区应先保持空几何；未来有可靠范围证据时以淡色虚线承载不确定范围。

专项静态、真实桌面Chromium、GIS及全集回归最终状态以**本PR GitHub Actions运行记录**为准，提交文档不自动宣告通过。任何生产合并、18C正式年表开启或澳大利亚殖民地实控面积计算都要另行审核。
