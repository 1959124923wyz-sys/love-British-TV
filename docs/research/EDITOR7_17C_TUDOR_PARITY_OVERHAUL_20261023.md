# 17世纪专题按16世纪已上线制作范式统一改造｜审核及交接（2026-10-23）

## 修改对象及准则

依据 `docs/templates/16c-story-map-standard/README.md`、其30件源程序/GeoJSON/已发表专题ZIP、`AGENTS.md`、`docs/HISTORICAL_SPATIAL_NARRATIVE_STANDARD.md`，以**已标记 published+approved 的五篇17世纪专题**作为本批范围。15个系列母题中仍属 research_only 的选题并未擅自出版。

本次“与16世纪一模一样”指**完整、带史料的历史过程叙事**、与16世纪共同的 `[[事件ID|正文短语]]` 金色链接、单击自动切年并平移地图、双击打开事件详情和原路返回、点/有据关系线/虚线局部研究区/非政治控制权的严格分层、可追溯档案与浏览器验收。并非将十六世纪叙事内容、疆域轮廓和档案数字套到十七世纪。

## 本轮实际修改的五篇

| 专题 | 修改 | 严格的地图/史料限制 |
| --- | --- | --- |
| 爱尔兰土地失权 `E6-T03-LAND-1642-1698` | 1650年克隆梅尔、基尔肯尼、利默里克、戈尔韦的不同攻守过程补正文导航；1690—1691年利默里克、阿斯隆和奥格里姆分别连接真实事件 | 军事投降≠周边地块实际转手；地产测量仍须按Down Survey可核原件追踪 |
| 格伦科 `E6-T04-GLENCOE` | 开头政权交代直接链接1692事件；地图按既存正式坐标补威廉堡、因弗雷里、格伦科住宅参考点和1695爱丁堡议会问责四个虚线屏幕符号 | 苏格兰1707年前仍是独立王国；一个住宅旧址≠全谷地受难范围。1690没产判决不因为缺单独事件ID就伪造定位 |
| 巴巴多斯 `E6-T07-BARBADOS` | 八章扩成九章：新增1668/1672奴役者产权、继承、债务清偿的完整3段叙述、2条大学法规全文来源及1条主张来源矩阵；1688章向1661有据法律回溯；新增隔年启停的奴役法制政策地点符号 | 法律正式通过≠所有庄园确已执法；1688年法有全文，但没有公开Atlas事件，所以仅有带来源的地图辅助提示，不假造新Event ID |
| 东印度公司 `E6-T12` | 12节对齐16世纪“序号、阶段”写法；格什姆1622、阿尔马冈1625、孟买1677铸币权补准确跳转；1970s苏拉特借款章节明确1612商馆建立只是早期背景 | 1622霍尔木兹属于萨非伊朗主导的战事，公司不因此获得疆域主权；孟加拉两商馆不是历史影响面 |
| 皇家非洲公司 `E6-T13` | 地方非洲政治主体与英国特许的跨洲对照，以及1665科曼廷荷兰夺堡的地图回溯加入相应章节 | 不把1694 Hannibal个案认作已确认皇家非洲公司航次；西非堡垒不是整个黄金海岸主权，不编造运输人数和航迹 |

### 1668与1672巴巴多斯两法的新增核实来源

1. 新不动产属性法，1668年4月29日（University of New Brunswick, **全文转录**；CO 30/2 pp58–59与1732年印本）：https://slaveryandfreedomlaws.lib.unb.ca/laws/barbados-1668
2. 1672年解释法（同大学数据库**全文转录**；现见Hall 1764 pp93–94）：https://slaveryandfreedomlaws.lib.unb.ca/laws/barbados-1672

两法关于继承、个别买卖无须登记、债务清偿例外的区分均直接来自可读条文；并未核阅全部庄园过户或执法账簿。特别注意：数据库展示有后世印行副本，不能误称它们是1668/1672签署当日的手稿照片。

## 17世纪地图研究层修复

- `data/seventeenth-century-regional-studies-1600-1699.geojson`：原**19个**局部研究对象 → **18个**，其中 **12个虚线Polygon、6条示意LineString**。清除只凭1658胡格利与卡西姆巴扎尔两商馆坐标推演的孟加拉经济“影响面”，有据商馆联系线仍保留；修正 **1622年霍尔木兹/格什姆两项萨非—英商战事**所指的 `related_story_ids` 为 **E6-T12**（先前错误指向爱尔兰E6-T03）。
- `data/seventeenth-century-spatial-evidence-1600-1699.geojson`：原**46个**辅助点 → **51个**。四个格伦科专题地点均从已发表主事件坐标复制；巴巴多斯新增一项按1661/1668/1672/1676/1688/1692年分别出现的地方法律制度提示点；明确1688年属于史料已证而无正式Atlas ID的事件；孟买1668年据点标识补两条准确事件关联。
- 几何遵守 `[longitude,latitude]`；`historical_boundary_confirmed:false`、`fill_authorized:false`、`territorial_claim:false`、`area_sqkm:null`、`exclude_from_area_aggregation:true` 均保持。新增固定屏幕像素的虚线提示圈不是一段地表公里距离或英国实际控制土地的形状。
- **不作“所有五篇都有大面积影响区”的机械指标**。格伦科的杀戮地域和1668巴巴多斯各庄园法律执行范围，没有可核同一历史边界；16世纪规范要求这种情况先用有据具名地点和按时间变化的制度标识，不能滥画。

## 完整验收路径

```bash
node scripts/test_serial_story_contract.js
node scripts/test_editor7_17c_inline_story_map.js
node scripts/test_17c_tudor_parity_20261023.js
node scripts/test_editor6_17c_spatial_batch01.js
node scripts/test_editor7_17c_regional_studies.js
node scripts/test_editor7_rac_story.js
python3 scripts/audit_spatial_semantics.py --strict
# 带 Selenium/Chrome 的自动化运行环境：
python -m http.server 8765 &
python scripts/browser_editor7_17c_inline_story.py
python scripts/browser_editor7_17c_regional.py
```

正式工作流：`.github/workflows/17c-tudor-parity.yml`；旧有17世纪正文、RAC、地理与17世纪空间图层工作流继续保留。浏览器需检验真实点击后年份、镜头中心、文章保留及双击返回，并抽查16世纪德雷克原专题不退化。自动化检查需实际执行且通过后才合并发布，GitHub Pages部署成功后才能报告已上线。

## 仍存在的史料研究缺口

实际爱尔兰地籍地块1641→1670逐地权转换、某些地方军事行动的确切受影响范围、1668/1672巴巴多斯法律的完整执法记录、1692年格伦科谷地全部受害住宅位置、皇家非洲公司逐艘船的奴役运输数据及非洲各堡权属起止界线、东印度公司在莫卧儿帝国辖下商馆权利与特定街区界线，均不得用视觉示意自动填补。该规范强调“能标有无则先落点，有据地区才落虚线面”。

原16世纪ZIP：`docs/templates/16c-story-map-standard/16C_stories_cartography_interaction_reference.zip`。本轮专用检验与所有变更留在GitHub完整历史中。
