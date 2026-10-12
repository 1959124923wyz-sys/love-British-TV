# PROGRESS — 1520—1529主编预审交接
日期 2026-10-12；分支`editorial/intake-1520-1529-20261012`；基于`main`独立建立，未更新正式网站。

## 已成功的提交
- `ef26917182db2f244445b1ceefa55ef9ca9d6138`：`ATLAS_REVIEW_CANDIDATE.json`，21个符合此前事件数据主要契约的候审事件、7处有历史持续关系的政治地点、28个直接来源。
- `9cdee3e6bf188b20bffdacd46db3da13c18e07a0`：`DECISION_MATRIX.json`，研究24件对应候审21件、暂留研究3件（源史实不丢）。
- `17c39d9627c2869edfb5a5e41679943ab302182f`：`GEOGRAPHY_REFERENCE.geojson`，3个早期已研究虚线几何加Guînes/Ardres/Calais三个法英归属对照点；0获批正式控制polygon。
- `ffad43522027d503c71342d19be88ccc0fd929cb`：`SOURCE_DELTA_INDEX.json`，对比上一期137条跨年代档案、109不同链接，本次28个引用中有8个网址已出现、20个首次在编辑候审中引用。
- `0e79c65999a5b300239c61b05efe10da2eda4907`、`d517f4c0eebcd92ad83223b18ef428fd03567931`：`README.md`目录及增补全球时间轴样图入口。
- `e073e15ec6cd06eedf7d45d321a75452a92cef0a`：`check_candidate.py`可执行自动结构审计，包括加拿大St John's harbour AAWED专门防混淆测试及1519 Tournai退出测试。
- `bea22b914b68632c80b54ef147417ffd38f9df61`：`interactive_research_preview.html`独立Leaflet研究试播，地图视角拖年份不自动缩放，左栏保留所有21项候审历史事件。**没有触及主站app.js**。

## 校验范围与不确定性
- GitHub回读当前候审六核心文件并逐件检查ID/来源/经纬度/十年年份，结果无引用缺失、无新伪造多边形。
- 21事件有11处现代城镇/加拿大官方港湾位置参照，10处保持`lat/lng:null`，比误放城堡和航线更可靠。现代参考坐标不是古代战争准确占地。
- 已确知1519年2月归还的英王Tournai城市点在本十年持续政治点中为0。
- 1525Guînes调查与1529法院定居法规相区分；禁止声称全部外国租户被真正驱逐以及人数。
- Ellis学术文章引用的税收、军费、欠缴不得重复累计；`ATLAS_REVIEW_CANDIDATE.json`未把财政候选直接显示成殖民净收益。

## 主编后续动作
1. 确认候选文字、图标重要性并将选择的记录迁移到`data/atlas-1520-1529.json`；
2. 对照已有正式1510—1519数据新增第三个十年章节，修改时间轴/前端读取；
3. 各地图年份切换保留视角与事件列表，既有同地点SVG图标聚合保持主编规定；
4. 如要沿用本期GeoJSON，确保可关闭、淡色虚线，旧1488法令折线不能误当1520王权实际司法区；
5. 浏览器/Pages实际交互检查及部署仍由主编执行。
