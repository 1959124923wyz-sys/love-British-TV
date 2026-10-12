# 上线交接｜1513—1519年图尔奈城及外围 Tournaisis（研究精度审查版）
编制：2026-10-12 · 基于图尔奈同期及近同期治理研究、法国/比利时历史地理文献及现代地名定位。研究分支：`research/territorial-1510-1519-20261012`；主编预审分支：`editorial/intake-1510-1519-20261012`。

## 一句话可用结论
- **实控城镇（高信度）**：1513-09-23图尔奈向亨利八世军投降，设英方总督、驻军、市政议会持续运作；1518-10-04同法王签订归还条约；英军1519年2月离开，法王恢复治理。年末时间轴图尔奈英方持续控制标记只显示1513、1514、1515、1516、1517、1518六个年末。
- **周边行政影响（中信度存在，低信度边界）**：英国在城外Tournaisis亦有一定行政、军事/财政联系。19世纪末至20世纪的图尔奈史料研究、瓦隆历史地图集、里尔大学区域司法研究支持研究对象不止城市。**目前无法把当年每一教区准确归属于英王直接控制**。
- **特殊领主区域（逐件核证）**：南面Mortagne、Saint-Amand既列于联合 bailliage 名称，亦有自己的领主/修道院司法权。历史“旧城堡领地”与1383年起的联合行政辖区不完全相同，尤其旧城堡领地甚至将图尔奈城排除。两地采用分开的历史辖区点位，**不自动延伸统一的英方领土填色**。

## 交付数据
- **[TOURNAISIS_OPTIONAL_OVERLAY.geojson](TOURNAISIS_OPTIONAL_OVERLAY.geojson)**：19项GeoJSON：1个**视觉用现代村镇中心凸包**、1个图尔奈英方实控城市参考点、17个现代地名点。边界是所列当代村庄地名中心的数学分布外壳，**不是任何1513年原图边界的描摹**。它大致覆盖图尔奈邻近地区（约经度3.2801–3.4880、纬度50.5677–50.6543）；不能计算所谓的1513英方领土面积；不能用来判断包络内全部村镇都受英王统治。这是给读者定位的外缘参考；**并不包括**最南部有特殊法制的Saint-Amand与Mortagne乡镇。
- 原史学材料：[TOURNAISIS_BOUNDARY_EVIDENCE_1513_1519.json](https://github.com/1959124923wyz-sys/love-British-TV/blob/research/territorial-1510-1519-20261012/research/periods/1510-1519/TOURNAISIS_BOUNDARY_EVIDENCE_1513_1519.json)：11份史料/地图/地名来源、8项逐条判断。GeoJSON的`meta.source_registry`也直接列出所需的13个来源及核查等级，主编可从点选的source_ids直接匹配URL。
- 待扩展源：2025年CC BY 4.0的维基资源 [传统Tournaisis示意SVG](https://commons.wikimedia.org/wiki/File:Map_of_Tournaisis.svg) 可按其作者FL00 80、许可及改动说明合法再利用，但是其地理含义是**传统历史地区**，不能径直用作1513年英军有效控制版图。这次没有描摹它。
- 同期专业地图：[瓦隆1513—1519英王影响地区图](https://connaitrelawallonie.wallonie.be/histoire-et-symboles/histoire/atlas-historique/tournai-et-le-tournaisis-sous-influence-anglaise)，以及[UNamur的16世纪区域习惯法地图](https://bouquetwallon.unamur.be/s/bcw/item/443)；两者版权归各自机构，本版**只保存外部链接，没有向仓库复制或逆向数字化**。

## 审核后的前端用法
1. 正式章节先使用主编预审[ATLAS_REVIEW_CANDIDATE.json](ATLAS_REVIEW_CANDIDATE.json)内 `tournai-occupied-city-1513` 作为**英王城市实际治理的点位状态**，维持年份至1518（1519年2月撤军为另一事件）。不要把GeoJSON polygon自动导入`colonial_polygons`。
2. 将这里的GeoJSON存放在最终被批准的`data/geography-1510-1519-hypotheses.geojson`路径后，由前端载入到现有`groups.hypotheses` **可关闭的参考范围图层**；过滤`type: Polygon`、`p.visualization_only===true`、`p.fill_authorized===false`且 `1513 <= year && year <= 1518`（按**年末快照**）；线使用浅金色虚线，面透明度在0.06–0.09范围。
3. 保留主站既有1500年代加来/爱尔兰参考包络，但要检查1510以后是否仍按历史研究要求持续显示，而不能仅凭`year >= 1500`无限延续。与1510年代新图层分别过滤，避免重复加载新旧包络与颜色冲突。
4. GeoJSON共含17个古地名对位的**现代地名锚点**，其中Mortagne、Saint-Amand两个不能当作有证据的英王直属驻军或征税中心。若主编只需要简洁界面，**仅显示一个区域淡色虚线轮廓与既有图尔奈城市点**，其余地名只放在“历史文献”展开或按需图层。
5. GeoJSON 1个可视化凸包源于**现代地名**，部分地点（如Antoing）当年政治司法归属尚待核。可当宽泛活动区示意，但如果主编希望橙色统一英王实控填色，应只显示已确证城市标记，**不要用此凸包直接填色**。
6. 若日后独立复原到1513教区/行政辖区真实边界，需要用有来源、有再用许可的乡村司法图册（里尔大学Mariage2013论文、2015版图与原始档案）替代目前凸包；更新`source_ids`、空间审稿记录，保留推测原版以供追溯。

## 网站标准适配已经核过
当前 `main/app.js` 的 `renderHypotheses()` 使用 `groups.hypotheses`、`L.geoJSON` 以及 `f.properties.public_title/public_summary`，面型支持Polygon；旧1500章历史参考包络文件在 `data/geography-1500-hypotheses.geojson` 中使用 `display_mode:"independent_dashed_hypothesis"`、`fill_authorized:false`、`approval:"never_render_as_published_actual_control"`。本候审GeoJSON对齐这些主要字段。**本研究分支未修改main、尚未执行实际生产图层渲染**。
- 旧地图JS原本只载 `atlas-1497-1500.json` / `atlas-1500-1509.json`，年份上限1509；公开1510年代必须由主编显式添加第三章和年末状态时间过滤，不能只Merge这一份地理文件。
- 事件卡叙事保持1—3句。建议：“1513年，亨利八世占据图尔奈，并通过英方总督与当地市政机构管理城市。英王权力也影响图尔奈外围的乡村地区；当地领主和乡村法庭仍保持各自权力。1519年2月，英军撤离，法国恢复治理。”来源/争议及疆界精度均存在第二级考证或交互虚线，不占首屏。

## 关键来源与反证
- [Hocquet / d'Herbomez1901书评](https://www.persee.fr/doc/bec_0373-6237_1901_num_62_1_461164_t1_0397_0000_1)：图尔奈及Tournaisis均属1513—1518史料研究范围（其截止年代通常围绕1518 割让条约，不能把研究截止错当撤军时间）。
- [《图尔奈城堡领主》1899书评](https://www.persee.fr/doc/bec_0373-6237_1899_num_60_1_452542_t1_0518_0000_2?pageId=T1_519)：旧封建城堡领地以Escaut、Scarpe、Elnon和Espierre等河流为参照，却排除图尔奈城与部分修道院/领主领地；**该旧界不能直接等同于1513后的联合行政辖区**。
- [Mariage2013里尔大学博士论文](https://pepite.univ-lille.fr/ori-oai-search/notice/view/2013LIL30041)：1383年起约60乡村教区联合bailliage包括Tournaisis、Mortagne、Saint-Amand，地方领主权多元；教区数与受英王直接管理的乡村数不同。
- [Davies1998论文](https://www.cambridge.org/core/journals/historical-journal/article/abs/tournai-and-the-english-crown-15131519/B07E63FC8D447BD02398FDD99F09BB62)：Tournai被英王视作声称“法国王国”中的城市，而非并入英格兰本国议会。瓦隆历史地图网站错误地提到英国议员，制图不要采用这项说明。

## 给主编的上线决策
**可以上线的部分**：1513图尔奈英王城市驻军与地方管理、1518割让条约、1519年2月撤军，配图尔奈点位。
**可上线为“研究性参考图层”的部分**：中央Tournaisis宽泛地理包络，**虚线、低透明、可关闭**，保持“读者可以大致看到区域”的体验。
**目前不应自动上线的部分**：覆盖约60教区的英王实控地图、大批尚无源的乡村直接统治断言、Mortagne/Saint-Amand自动并入英属、长时条约赎金当即期现金利润。
