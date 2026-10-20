# 主编7｜17世纪区域性军事、商业与地权图层交接｜2026-10-21

## 任务
继PR #195发布44个已来源核对的点级标志后，用户要求“尽可能多地把影响范围升级”，要求一边研究一边GitHub保存。**这次不是新建英国疆域面积数据，而是增加可点击的、明确标为推定阅读辅助的浅色虚线面/线。**

## 已完成并阶段保存
- Branch: `feature/editor7-17c-regional-envelopes-maritime-networks-20261021`
- Draft PR: https://github.com/1959124923wyz-sys/love-British-TV/pull/196
- 本分支已提交研究文献日志`9646d035`、9面5线初版`d1bc441d`、前端渲染`ea3d85b6`、Node+Chromium QA`4eb01a38`、另外4面1线`a16b2e41`、城镇现代地名与1599测试修复`cdb418f4`、旧测试与新区图层选择器兼容修复`a63d41fb`。
- 最终预计区域GeoJSON: **13个Polygon**和**6个LineString**，均独立在`data/seventeenth-century-regional-studies-1600-1699.geojson`。原有`data/seventeenth-century-spatial-evidence-1600-1699.geojson`的44个地点、17世纪8条关系路线和全部正式十年事件ID不改。

## 逐类有据空间叙事
**爱尔兰土地政策和地籍：**
- 1609年阿尔斯特种植园六郡名录，PRONI官方原件与文献选辑：Armagh、Cavan、Donegal、Fermanagh、Londonderry(后来名称)、Tyrone。现代城市参考点分别为Armagh、Cavan、Letterkenny、Enniskillen、Derry、Omagh。PRONI说明1613设立伦敦德里郡，1609时勿误用该郡行政名称为已成立。
- 1613年伦敦城市公司在Derry、Coleraine商业/土地安排，PRONI 1613报告，现代Coleraine参考位置由英国地名表核对。
- 1635年Wentworth在Connacht的Roscommon/Mayo/Sligo/Galway产权陪审程序，Royal Irish Academy DIB明确：**该大型殖民项目实际没有广泛落实**，不得画成已交割英王地产。
- 1653年Gross & Brief Survey文献明确三个郡组：芒斯特Limerick/Tipperary/Waterford、伦斯特Laois/Offaly/Meath/Westmeath、阿尔斯特Down/Antrim/Armagh。三个赭黄色地区多边形仅按现代城镇代理点粗略圈出资料涉及的**调查地域**；不意味着测绘完成程度或地块实际没收。
- 1642、1652、1653、1662、1665法律以及1691条约仍由PR #195保留的**按episode生效的地点参考符号**表达，没有全岛实心填色。原因：法令管辖效力 ≠ 每宗地产最终执行记录。

**17世纪具名战争：**
- 1649年Drogheda→Dundalk/Newry地区行动次序；1650年Cahir/Clonmel攻守；1690 Boyne Oldbridge/Rosnaree/Duleek与Kinsale James/Charles堡；1691年Athlone/Aughrim。
- 1622年Safavid军队主导、East India Company舰队协同对Qeshm和Hormuz葡萄牙阵地行动；伊朗百科全书专文直接证实先后阶段。
- 仅据具体具名事件形成**事件关联范围**，年份多属**单年**，不指称战争行动持续覆盖整个郡县或持续到事件之后；不得把英格兰行动和爱尔兰/莫卧儿/萨非反制统称英国扩张。

**公司经济联系：**
- Bengal Hooghly–Kasimbazar 1658两个英公司商馆（仍在莫卧儿当地政治制度下），仅1年研究时段；1610 Gujarāt Surat→Bantam商货交换方向（大约第六航次，非实际海航GIS）、1616 Surat→Jask英商货物抵达、1622 Qeshm→Hormuz军事次序、1613 Derry↔Coleraine土地公司组织联系、1658 Bengal两商馆组织关系、1690 Kinsale两堡关系。
- 商馆/贸易许可与英王直接领土统治**严格隔离**。

## GIS标准及风险管理
- GeoJSON的Polygon由具名来源锚点坐标的矩形圆角包络计算，外扩固定经纬度边距**纯为读图**；这是人为制图辅助顶点，并非历史原图数据、影响地界或统计范围。各polygon清楚载明`mapping_method`、`provenance_method`、`anchor_places`、`source_urls`、`related_event_ids`。
- LineString无中途转向点，图形仅现代端点直线，`route_kind`明确不同运输/军事/制度关联，未验证航迹的关联不称实际航路。
- 全部`historical_boundary_confirmed:false`、`fill_authorized:false`、`territorial_claim:false`、`area_sqkm:null`、`exclude_from_area_aggregation:true`、`occupation_area_sqkm:null`。正式十年`atlas-16*.json`的`colonial_polygons`保持空数组。
- 前端独立`seventeenthStudiesPane` (z-index452) 比历史政治点层低，不遮挡原有SVG；**同一个“版图”开关**控制研究面，青绿经济关系沿现有political侧开关，红/赭战争/土地沿现有control侧开关，绝不增加重复UI。图层加载失败采用局部catch，不造成17世纪历史正文全部退回格伦科预览。
- 与此前旧层的`atlas-17c-evidence-cue`类名分离；旧浏览器测试只统计点级符号，新测试统计`atlas-17c-regional-area`与`atlas-17c-regional-link`。
- `scripts/test_editor7_17c_regional_studies.js`结构/年限/来源/无殖民面积检查；`scripts/browser_editor7_17c_regional.py`实测1613、1616、1622、1650、1653、1658、1690、1691、1692及返回1599等不同年。截图作为Actions Artifact保留。

## 后续真正精确地区的路径
1. TCD Down Survey网站提供1641/1670地产持有人基准以及 Books of Survey and Distribution 的逐乡镇产权记录，须核证**同一乡镇的1641业主→没产行政编号→受领者及约1670业主→法庭复原/授地情况**；**不能**从1680年代摘录推断1652当年即时换主。
2. Down Survey原件与数字配准地籍能作为**历史业主图层**独立引用（须核准获取与使用许可）；不得未经审核把现县界或现代OSM地籍填入古代“已实控面积”。
3. 军事战区只有找到同时代战地小比例尺图及数个可靠地名锚点，才可替换目前为读图目的的凸包插图；不使用随意公里缓冲制造受袭村落数量。
4. 东印度公司持续商馆治理、确切撤离和当地政治关系需按稳定ID逐年登记控制episode，而非从“英商到访”推断城市主权，尤其区分Bombay公司岛港行政与Mughal统治的Surat等商馆。

## 发布要求
上述代码已保存于独立分支与草稿PR #196；**最终发布必须以全部CI通过、PR完成merge和Pages部署success为准**。任何后续交接不得把“已提交”误写为“已上线”。
