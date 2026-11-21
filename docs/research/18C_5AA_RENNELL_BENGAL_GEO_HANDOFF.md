# 第5AA批｜1765年孟加拉与比哈尔地税地理、1779伦内尔地图与孟加拉湾海岸

主编37，2026年11月21日；基线 `c36a487e2b526f007fe5dfd6991fe115d5d3a5c5`。旧矩形 **133→110**，1799在用旧矩形 **61→44**，总计23条历史参考矩形退役，旧bbox、来源、年份和历史争议全部保留。

## 一、原始来源与空间边界

- [伦内尔1779年《A Bengal Atlas》地图库](https://collections.lib.uwm.edu/digital/collection/agdm/id/19613/)及[密歇根大学伦内尔研究](https://apps.lib.umich.edu/online-exhibits/exhibits/show/india-maps/rennell)：只用来复核十八世纪地名与研究辖区可能的范围。旧版原图尚未按可靠控制点数字配准，因而不生成虚构的1765年行政区Polygon。
- [英国图书馆1765—1781年地税与帝国议会原件目录](https://searcharchives.bl.uk/catalog/041-001116492)含Jessore账册、1765—67地税与地税区记载。[孟加拉手稿记录 Vol I](https://bsi.gov.in/uploads/userfiles/file/Rare%20Books/Bengal%20MS%20Records%20Vol.%201.pdf)记载1765 Diwani、1769派出的督察和1772 Hastings财政改革。1760年米德纳普尔、伯德万、吉大港原有 zamindari 权益见[研究手册](https://api.pageplace.de/preview/DT0400.9780429774706_A41590219/preview-9780429774706_A41590219.pdf)。
- [印度中央政府克塔克统计地区志](https://censusindia.gov.in/nada/index.php/catalog/28906/download/32088/21925_1961_CUT.pdf)及[剑桥大学研究](https://www.cambridge.org/core/journals/international-journal-of-asian-studies/article/genealogies-of-the-paika-rebellion-heterogeneities-and-linkages/4F1D10668F4ED9EE67FA01845047B201)：1751年马拉塔取得沿海奥里萨，1803年英军占克塔克。1765 Diwani的**名义奥里萨书面涵盖**独立于实际军政控制，不把奥里萨、克塔克改色为英属实控。
- [Natural Earth 1:110m公共领域海岸线](https://github.com/martynafford/natural-earth-geojson/blob/master/110m/physical/ne_110m_coastline.json)：取东经85—94、北纬18—24.5的**21折点连续真实海岸段**，不跨不连续海岸捏造直线。现今海岸、潮滩和河口会不同于1779年地理；形状保持虚线，面积null。
- [2025年河道改道研究](https://rgs-ibg.onlinelibrary.wiley.com/doi/full/10.1111/geoj.70059)及[2021年地貌论文](https://www.sciencedirect.com/science/article/pii/S0169555X21001045)：1765—77年的老布拉马普特拉经迈门辛汇梅格纳，后改道至贾木纳。尚缺据原图逐折点确定的旧河道线，故不手绘虚假的河道线。

## 二、本次新增及旧框对照

`data/eighteenth-century-editor37-5aa-bengal.geojson`：**16个Point + 1个MultiLineString**。15个旧税区由有据具名地点替代（伯德万、胡格利、纳迪亚、杰索尔、达卡、迈门辛、拉杰沙希、朗布尔、巴特那、伽耶、蒂尔胡特、普尔尼亚、巴加尔布尔、沙哈巴德、巴拉索尔），加1760年米德纳普尔扎明达里地名；此外8个重叠战争/官府旧框由上一批第5Y已经存在的战场和城镇点接续。新地点坐标为现今具名位置，并未配准旧税区边线。

- `B36-Z059` → `EDITOR37_5AA_BURDWAN`
- `B36-Z060` → `EDITOR37_5AA_HOOGHLY`
- `B36-Z061` → `EDITOR37_5AA_NADIA`
- `B36-Z062` → `EDITOR37_5AA_JESSORE`
- `B36-Z063` → `EDITOR37_5AA_DHAKA`
- `B36-Z064` → `EDITOR37_5AA_MYMENSINGH`
- `B36-Z065` → `EDITOR37_5AA_RAJSHAHI`
- `B36-Z066` → `EDITOR37_5AA_RANGPUR`
- `B36-Z067` → `EDITOR37_5AA_PATNA`
- `B36-Z068` → `EDITOR37_5AA_GAYA`
- `B36-Z069` → `EDITOR37_5AA_TIRHUT`
- `B36-Z070` → `EDITOR37_5AA_PURNIA`
- `B36-Z071` → `EDITOR37_5AA_BHAGALPUR`
- `B36-Z072` → `EDITOR37_5AA_SHAHABAD`
- `B36-Z073` → `EDITOR37_5AA_BALASORE`
- `B36-Z049` → `EDITOR36_5Y_MURSHIDABAD`
- `B36-Z050` → `EDITOR36_5Y_PLASSEY`
- `B36-Z051` → `EDITOR36_5Y_BUXAR`
- `B38-I-Z009` → `EDITOR36_5Y_PLASSEY`
- `B38-I-Z010` → `EDITOR36_5Y_MURSHIDABAD`
- `B38-I-Z011` → `EDITOR36_5Y_BUXAR`
- `B38-I-Z015` → `EDITOR36_5Y_MURSHIDABAD`
- `B38-I-Z016` → `EDITOR36_5Y_CALCUTTA`

程序 `js/eighteenth-editor37-5aa-bengal.js` 负责年份与悬浮、点击原始史料；`scripts/test_editor37_5aa_bengal.js` 完整检查23处退役/重复代理点、数据出处、坐标与所有渲染入口。新增GitHub Actions工作流；公共读者文案只含史实，不暴露研究内部GIS审核备注。所有形式 `area_sqkm:null`, `uncertain_line_dashed:true`, `historical_boundary_confirmed:false`。

## 三、后续制图目标

下批争取获得能批量地理配准的1779伦内尔原图分片，以同一年代稳定地物作控制点，记录每段边线误差，然后逐区画历史财政管辖外缘。北萨卡尔实际征税区、奥里萨马拉塔地区地界和阿卡迪亚驱逐地理保持独立待办。要跑严审 `node scripts/test_editor37_5aa_bengal.js`、`node --check js/eighteenth-editor37-5aa-bengal.js`、`python3 scripts/audit_spatial_semantics.py --strict` 和公共文案浏览器逐年测试。
