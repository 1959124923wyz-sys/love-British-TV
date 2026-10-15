# P1｜加来—吉讷统治主体与地图渲染解耦（2026-10-15）

## 问题

前端 `renderTerritories()` 曾用 `year>=1558 && p.source_place_id==='calais-crown'` 特殊条件为旧加来Pale参考面强制改法国青绿色。与此同时，1560—1599年若干GeoJSON仍使用 `relation_type:direct_crown_control`、`political_control_proof:documented_English_governance` 与英王时代名称；部分城市Point也仍写有 `polity:Kingdom of England`。这使地图颜色正确但语义错误，且每新增一种历史更替都必须编写硬编码规则。

## 核实的历史转换

- 英王实际占据/治理加来直到1558年。英国国家档案馆明确给出1347—1558这一时间范围：https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/french-lands-english-kings/
- 加来市政府档案馆给出1558年1月8日被法国收复：https://archives.calais.fr/decouvrir/les-archives-du-moment/le-document-du-moment/une-charte-de-privileges-accordee-a-calais
- 本项目已出版1550年代档案和城市据点证据也记录吉讷在1558年易手。地图按**年末状态**，故1557年仍为英王、1558年年末则为法王。并不声称复原1558年每一日的前线。

## 数据模型

对相关 `territorial-footprints-*.geojson` 的加来Pale参考面、以及 `french-urban-control-*.geojson` 中加来和吉讷的城市Point，加入 `properties.controller_periods`：

```json
[
  {"start_year":1550,"end_year":1557,"controller_group":"english_crown","controller_zh":"英格兰王室","relation_type":"direct_crown_control"},
  {"start_year":1558,"end_year":1559,"controller_group":"french_crown","controller_zh":"法兰西王室","relation_type":"direct_french_crown_control"}
]
```

1497—1549仅英王；1560—1599仅法王。每个年份恰好存在一个状态，不能重叠或中断。静态GeoJSON中的 `source_place_id` 和历史 `feature.id` 是**跨年地理实体身份**而不是当年统治主体；旧文件名 `french-urban-control` 与 `calais-crown` 可以保留作为兼容ID，但不能被用作政治归属推断。

1550年代区域的顶层关系改为 `crown_governance_transition`；后期改为 `direct_french_crown_control`，证据说明同步改为法国治理。城市Point改正后期 `polity`、`historical_state`、`control_class`、名称及描述；1550年代过渡记录不再携带错误的唯一静态 `polity`。研究几何完全不变，`historical_boundary_confirmed=false`、`fill_authorized=false` 与 `area_sqkm=null` 仍然保留。

## 渲染及用户视角

- `controllerAtYear(properties,year)` 从GeoJSON日期区间取得当前控制主体；颜色统一由 `historicControllerPalette` 映射。前端不能再按地名+年份猜测法国颜色。
- 点与面使用同一治理判断，地图边缘与城市圆点同步改变颜色；地理轮廓的“地名包络/虚线”性质仍由 `geometry_role` 决定，而非由政府名称决定。
- 点击区域或加来、吉讷城市Point的资料卡显示「当年治理主体」。不能在1558年点击城市后自动跳到跨章节沿用的旧英王据点介绍，造成明面颜色与详情互相矛盾。
- 这种数据结构可供日后公司治理或不同王朝更替复用，但**公司、保护国、间接控制等未来史实需另行证据和政策审查**，不可自动套用为王室主权。

## 测试

`scripts/test_calais_governance.js` 检查1497—1599年全范围年末状态、1557→1558变更、城市与区域同步、来源年份没有间断、多边形完全继承以及未授权实际面积为空，并禁止返回旧硬编码。它作为GitHub Actions UI与正式部署的强制检查。既有浏览器历史切片与浏览器截图测试继续执行。

## 继续关注的非本次事项

旧加来Pale地名包络来自前期英王时期研究；1558年后的法国治理范围并未通过16世纪实测边界恢复。因此保留虚线示意，不可依据轮廓计算法国或英国准确控制面积。如取得足够档案，后续应更换具来源的测绘几何，而不是推高这一轮廓的准确度评级。
