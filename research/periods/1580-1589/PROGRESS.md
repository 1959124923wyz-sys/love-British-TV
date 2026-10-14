# 调查3｜第十章 1580—1589 GitHub 持久化进度与主编交接

更新：2026-10-14。独立研究PR：https://github.com/1959124923wyz-sys/love-British-TV/pull/59 ，分支 `research/ch10-1580-1589-violence-enslavement-plunder-20261014`；未改 `main`。第九章 PR #56 仍以实际 main 是否发布为继承判定标准。

## 主编可直接调用的最终候审数据（全部成功提交）
- `editor_import/ATLAS_EVENT_REVIEW_CANDIDATE.json`：30个真实史料关联事件、16个现代具出处地点、70个来源，正式应用所需基本字段及 `icon_code`。
- `editor_import/VIOLENCE_AND_CONTROL_DELTA_1580_1589.geojson`：30条年变，16个现代地点Point、14条`geometry:null`；非当时实测历史暴力范围。
- `editor_import/CONTROL_AND_VIOLENCE_PLACES_1580_1589.geojson`：16地点的现代位置GeoJSON，史迹/城镇/历史标牌坐标一一保留`source_geography_url`。
- `editor_import/VIOLENT_EXTRACTION_ROUTE_REFERENCES_1580_1589.geojson`：6条两端点虚线*行程顺序*，不是真实航海GPS或英军占领走廊。
- `editor_import/PLUNDER_VIOLENCE_ECONOMICS_LEDGER.json`：31条会计、人身伤亡、强制带人、殖民土地与未来租金证明/空值；不得将证词人数、地产面积、杜卡特赎金与英王净收入混成一个数字。
- `editor_import/HISTORICAL_DETAIL_NOTES_1580_1589.json`：30条`records`键与 Atlas 事件ID一致，供`data/historical-detail-notes.json`主编选择性导入。
- `editor_import/MUNSTER_1586_1589_UNDERTAKERS_SEIGNORIES.json`：8组1586拟授英国承领人、1589获授/描绘的英国领主、继续拥有土地的盖尔领主，1586原始条款§366—374提供计划户数、免税、军队保护和未来租金。
- `CONTROL_TRANSITION_1579_1589.json`：10年年末状态 + 12项真实政治、军控或土地法权变化。
- `PRIMARY_MAP_SOURCE_CATALOG.json`：7组历史图，特别1586 TNA MPF1/273拟授和1589 TCD MS1209(36)实际地图；都尚未得到配准实控Polygon，旧图并非现代精确定位。
- `ARCHIVAL_ACTION_QUEUE.json`：18个未解决的原始档案与法定地界研究任务。
- `editor_import/EDITOR_IMPORT_README.md`：主编导入顺序、图层、年份、可靠来源和实际前端验收操作。

## 文献突破
1. 1580 Carrigafoyle与Smerwick为两起不同英军杀戮事件：前者原约50名爱尔兰及16名西班牙**守军组成**而非确证66死者，后者约600遇害为近似史料报告。
2. 1582芒斯特饥荒死亡的“六个月三万人”是Warham St Leger陈述，现代学术将它视为无独立核实的估计上限；统计不得复制为省级死亡人口事实。
3. 1585-07-18 Aquascogoc村焚烧按北卡政府B-72史迹校正，Belhaven标牌现代坐标不是烧毁村庄实测位置。
4. 1586 Drake海上强制携带非洲人、穆斯林划桨者、美洲原住民有多份西班牙证言，数量150/200/250/300可能重叠，交易、结局和英王实际利润均未知。
5. 1586英王原始芒斯特地产法令（UCC CELT §365—374）是本轮最强第一手发现：实际年租**从1590年**才合同起算，规模12k/8k/6k/4k英亩与最低额外定居家庭36/24/18/12户等均为**计划**。另在法令内排除部分盖尔爱尔兰承领、有限期关税减免及王室出资驻防的规划，绝不可当1586年已实现利润、实际移民或驻军支出。
6. ECU数字历史研究记1586 86名预计承领人，至1588仅首批35名获地产；罗利约4万英亩，斯宾塞原想4千、研究记实际约3千，历史面积依地契口径记录。

## 已验证GitHub Actions
- 全包 Python 导入审计：**SUCCESS** [Actions 38565584938](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/38565584938)。
- GitHub bot保存`editor_import/EDITOR_QA.json` `status:PASS`；统计**30 events / 70 sources / 16 atlas geosites / 30 delta / 6 dashed routes / 31 ledger / 10 yearend / 30 foldout / 7 source historic maps / 8 undertaker-native groups / 18 queues / 0 historically authenticated polygons**。
- QA核验的是数字结构、字段互引、当年/历史报数、缺失值和来源约束，**不是第十章在浏览器发布的证明**，更不是历史原始图已经GIS配准。

## 主要提交记录（已保存）
- `08159c97` + `acfe6ab6`：1580英军凯里屠杀、原住民现代位置等新源。
- `75edf776` / `7fc41fda`：事件30以前各批，1585年官方日期纠错。
- `cc1a91ba`：16处现代具来源Point。
- `9347da36`：正式Atlas导入模板初稿。
- `8aef4079`：年变geojson；`00f66ca7`：6段有标签虚线顺序。
- `f9a78ebb`：18条财务初稿，`4a63ee6b`：28条详细历史栏初稿。
- `ceec7897`：最初主编导入说明。
- `7f82d866` + `a1ec95f6`：原始1586年6月27日条款及1588首批产权数字，来源至70、事件至30。
- `a60ea8f1` / `90532ede` / `4add591c` / `81c00a8a`：同步主编Atlas30、GeoDelta30、详情30、账本25。
- `8bb6f227` / `80ccc7f2`：8组领主及原始1586殖民家庭配额/免税/安全条款。
- `0105f622` / `9ac500e9`：扩展证据账本及编辑账本至31。
- `eacc49a9` / `495551da`：正式31账本、8地产组及英文旧时会计单位QA；Actions重新运行已PASS。
- 最新PR head与最终导入文件SHA以 GitHub 远端为准。

## 下轮准确接棒
**第一优先** 对TCD 1589 Jobson扫描影像地理配准原图、授权、可溯名地块→史实1589法定授予GIS；禁止使用现代Munster省边界当当年占领。第二优先：1586两份西班牙证言及英军舰队原始账本，分离被奴役者、强迫转移和商业贩卖；无贸易售人证据即记null。第三优先：1580—83芒斯特逐村烧毁范围和因战争饥荒实际受害证据。持续地缘统治不应从事件或法令自动推定。

本包已完成研究层交付，`main`未改，第十章正式上线仍由主编负责审核合并和浏览器实测。
