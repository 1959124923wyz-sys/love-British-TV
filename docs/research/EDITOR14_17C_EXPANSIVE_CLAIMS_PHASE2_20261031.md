# 主编14｜17世纪大面积殖民声索第二批：12块追加图层（2026-10-31）

**实施分支：** `cartography/17c-expansive-claims-phase2-20261031`。既有14块来自 PR #273，追加12块合计26块。只增加独立示意声索GeoJSON，不更改原始17世纪专题正文、年代地图事件、旧实控/影响区结构或16世纪版图；不设计手机端。

## 目的与界线

用户要求宏观地图显示17世纪殖民者涉及的大片区域。采用**历史特许或有证政权存在的最大宏观可视化外廓**，允许多边形互相重叠；**虚线外缘**提示没有精确古地图几何坐标；半透明填色表达文献中可证的法律/行政声索或发生过的局部军事行动，**不证明整个区域实际被占领**。任何多边形皆`area_sqkm:null`、`territorial_claim:false`、`boundary_verified:false`、`historical_boundary_confirmed:false`、`fill_authorized:false`、`expansive_claim_overlay_only:true`、`exclude_from_area_aggregation:true`。不能统计为英占地理面积。

## 新增范围及一手/权威资料

| ID | 起止（含） | 核心证据与年份门槛 |
| --- | --- | --- |
| `claim-virginia-crown-1625` | 1625–1699 | [美国国家公园管理局：1624公司特许撤销，王室殖民地继续](https://www.nps.gov/jame/learn/historyculture/chronology-of-jamestown-events.htm)；[Encyclopedia Virginia：1625王室殖民地](https://encyclopediavirginia.org/entries/house-of-burgesses/)；**不可继续沿用1609公司太平洋疆域声索** |
| `claim-maryland-1632` | 1632–1699 | [1632马里兰原始特许](https://avalon.law.yale.edu/17th_century/ma01.asp)，波托马克、切萨皮克与第40纬线的历史描述 |
| `claim-connecticut-1662` | 1662–1699 | [1662康涅狄格王室特许](https://avalon.law.yale.edu/17th_century/ct03.asp)，明言西至 South Sea（太平洋），最远纸面声索并非西部军占 |
| `claim-new-york-duke-1664` | 1664–1672 | [纽约法院历史协会](https://history.nycourts.gov/legal-history-by-era/new-york-under-dutch-rule/)，1664年荷属新尼德兰转为英属 |
| `claim-new-york-duke-1674` | 1674–1699 | [纽约州参议院年表](https://www.nysenate.gov/timeline)、[纽约法院历史协会1673—1674荷兰总督](https://history.nycourts.gov/figure/anthony-colve/)；**1673年两块纽约英方着色均不出现**，1674按年底英方重新控制显示，并不抹去该年11月前的荷兰治理 |
| `claim-nova-scotia-scottish-1621` | 1621–1632 | [加拿大公园局1621新斯科舍特许](https://www.parks.canada.ca/lhn-nhs/ns/fortanne/culture/charles-fort/histoire-history)：苏格兰王室赋予威廉·亚历山大，声索海洋诸省和加斯佩；与法属阿卡迪亚、米克马克地权重叠，**非英格兰国家直接殖民** |
| `claim-newfoundland-island-1610` | 1610–1699 | [纽芬兰与拉布拉多遗产基金会：1610整岛特许](https://heritagenl.ca/discover/provincial-historic-commemorations-program-designations/early-sponsored-settlement-in-newfoundland/)；最宽英方文书声索长期与法国殖民地、贝奥图克自主地域并存，并非连续全岛英国统治 |
| `claim-leeward-islands-1632` | 1632–1699 | [英国国家档案馆：17世纪圣基茨、尼维斯、安提瓜、蒙特塞拉特等殖民据点](https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/caribbean-social-and-cultural-history/)；岛群包络含海水与法方辖区，**不可转为海洋主权** |
| `claim-st-helena-1659` | 1659–1699 | [英国现行宪制文件追述1659据有和1673王室特许](https://www.legislation.gov.uk/uksi/2009/1751/schedule/part/PREAMBLE)、[岛史研究荷兰1673短占](https://www.sthelenahistory.com/navContent/02-Studies/Land_and_Property.html)；1673年内经历短时控制权变化，年级图层非逐月军控记录 |
| `claim-quebec-kirke-1629` | 1629–1632 | [魁北克省政府文化遗产档案](https://www.patrimoine-culturel.gouv.qc.ca/detail.do?id=25855&methode=consulter&type=pge)，明确1629降服、1632返还；框仅用于识别城镇河谷，**不可染成全加拿大殖民地** |
| `claim-massachusetts-province-1692` | 1692–1699 | [马萨诸塞州档案：1691王室特许、1692实施](https://www.sec.state.ma.us/divisions/archives/collections/mass-archives-collection.htm)，扩至普利茅斯、缅因及部分新斯科舍的文字声索；不是法属阿卡迪亚每处实控 |
| `claim-rhode-island-1663` | 1663–1699 | [罗得岛州务卿：1663王室特许](https://www.sos.ri.gov/divisions/civics-and-education/for-educators/themed-collections/rhode-island-charter)；不将文书里的原住民土地让渡说法视为独立核实的地权事实 |

## 技术与出版回归

- 年门控、色块点击史料来源、地图“版图”与“控制区”开关联动、下层事件保留，与既有 `renderSeventeenthColonialClaims` 共用；不修改 `app.js`、`index.html` 或移动端。
- 自动验收：`node scripts/test_editor23_expansive_17c_claims.js`、`python3 scripts/audit_spatial_semantics.py --strict`、原桌面 Chromium 测试及所有相关GitHub Actions。
- 单个区域外廓仅供视图感知，**绝不用于面积计算、现代民族国家疆界重建、正式占领面积研究数据**。
- 潜在进一步优化：有历史海岛形状矢量数据后可把“岛群包络包含海水”改成各岛多面图；历史年度精度不足的1674年、1632年、1673年在专题事件中仍按实际月日解释。

## 交接核验

以 `data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson`、`scripts/test_editor23_expansive_17c_claims.js` 最新main为准。未经全部 CI 通过不称已部署。合并后核实 GitHub Pages 的 `Publish historical atlas` 工作流成功，再按仓库标准归档最新参考ZIP。
