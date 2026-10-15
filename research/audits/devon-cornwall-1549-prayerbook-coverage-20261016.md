# 03｜1549年德文—康沃尔王室镇压与西南祈祷书起义：历史与地理补缺交接

**目的：** 对应爱英TV第三组漏绘地区。时间主要1549年，保留第六章已有的 Clyst St Mary 和 Sampford Courtenay 两条事件和两片局部研究面；本次补点、非实测概略面及史料来源，沿用正式双开关/图标/逐年显示模式。

## 史料基础及适用界限

1. Devon County Council, Historic Environment, [Battlefields of the Prayer Book Rebellion](https://www.devon.gov.uk/historicenvironment/projects/battlefieldsprayerbookrebellion/)，引用 Glenn Foard / Alexander Hodgkins (2009), *Battlefields of the Prayer Book Rebellion: An Archaeological Resource Assessment*. 明确四组独立战斗：Fenny Bridges、Woodbury、Clyst、Sampford Courtenay；是可信战斗节点与研究地域，不是同年王室控制面积。
2. Historic England, [Clyst St Mary Bridge & Causeway, listing 1020209](https://historicengland.org.uk/listing/the-list/list-entry/1020209/)，确认1549年8月4日王室军焚烧村庄、桥梁攻防、绕行并在Clyst Heath胜利。地方史料存在8月5日前后的不同分期表述，本次日期标4—5日，不假造被焚房屋界线。
3. Historic England / Devon & Dartmoor Historic Environment Record, [Sampford Courtenay final battlefield, MDV12578](https://historicengland.org.uk/listing/heritage-gateway/results/record/c39bc47e-3b72-4a06-9863-681629e456a2/MDV12578)，明确最后战役在村东及山坡；部分记载17日，部分18日。旧事件统一为17—18日；并独立建6月村民反对新礼拜书的起事事件。
4. Historic England, [Sampford Courtenay Church House, listing 1105293](https://historicengland.org.uk/listing/the-list/list-entry/1105293)，佐证6月村民与支持新礼仪者William Hellyons的致命冲突，其主体为当地反抗者。
5. Cornwall For Ever!, [Prayer Book Conflict timeline](https://www.cornwallforever.co.uk/history/prayer-book-conflict)；参考地方书目 Payton (1996)、Stoyle (2002)、Rose-Troup (1913)。提供Bodmin集结、Trematon Castle、Exeter围城、Fenny/Woodbury/Clyst/Sampford与St Ives/Stratton/Bodmin战后绞刑。作为**区域二级史源**；不将无法独立核定的约数、报复轶事细节或被杀者姓名作为已量化事实。

## 生产事件清单（12条新地点，2条旧事件修订）

| 时间 | 地区 | 行为主体与性质 |
|---|---|---|
| 6月 | Sampford Courtenay | 反对强制礼仪改革的村民暴力，Hellyons被杀；起义一方 |
| 6月 | Bodmin / Castle Canyke | 康沃尔群众集结，反对王室宗教改革；起义一方 |
| 6月 | Trematon Castle | 起义军夺取城堡；**不是王室军攻占康沃尔** |
| 6—8月 | Exeter | 起义者围城与守军抵抗；围城不是完整占有埃克塞特 |
| 7月28日 | Fenny Bridges | 王室军与起义者交战；不能由文献估算死亡位置 |
| 8月4日前后 | Woodbury Common | 起义者袭击王室营地，王室军击退 |
| 8月4—6日 | Clyst St Mary | 王室焚村另与数百俘虏被杀的记载分开；部分死者数字无法核实 |
| 8月上旬 | Clyst Heath | 王室军击败起义军，桥头战与荒原战不同地点 |
| 8月上旬 | Exeter | 王室军进入、解除围城 |
| 8月后 | Bodmin | 王室战后报复性绞刑；轶事细节未单独证实 |
| 8月后 | St Ives | 当地王室处决记载；不推算全镇遭屠 |
| 1549年稍晚 | Stratton | 教区账本记录制作绞刑架费用，关联战后处决；不视作所有死者发生在此 |
| 旧记录 | Clyst St Mary | 8月4—5日王室军焚村、包抄桥梁；与俘虏被杀单独记 |
| 旧记录 | Sampford Courtenay | 17—18日王室军最后战役；与起义发端独立 |

没有增加任意货币征税额、俘虏死者精确人数、1510年代外推范围或整郡行政“新征服区”。

## 地图几何：旧两区+新增七区

原先两片 `en-clyst-1549-devon`、`en-sampford-1549-devon` 保留；另加:
- `en-western-1549-exeter-siege`：埃克塞特外围围城/解围局部研究区；
- `en-western-1549-fenny`：费尼顿与费尼桥交战地区；
- `en-western-1549-woodbury`：伍德伯里公地营地遭袭地区；
- `en-western-1549-bodmin`：博德明集结及战后绞刑的不同阶段；
- `en-western-1549-trematon`：特雷马顿附近起义者控制行动；
- `en-western-1549-stives`：圣艾夫斯战后王室处决记录；
- `en-western-1549-stratton`：斯特拉顿绞刑架账目所在地。

**均为人工依据具名地点的现代位置绘制的阅读示意**，从没有宣称来自古战场真实矢量边界；GeoJSON全量 `historical_boundary_confirmed:false`, `fill_authorized:false`, `territorial_claim:false`, `area_sqkm:null`, `exclude_from_area_aggregation:true`。同一大片地区内不同主体发生的活动不得根据示意面计算破坏面积。英国王室镇压本国起义必须明确归类，不能计入海外殖民面积。

## 前端及审查

- 地区资料继续调用标准右侧史料框，仍保留「版图」「事件」两个开关。
- 第六章80条事件，前1540—1548的53条不变；全项目研究面数量15。既有两片战地和诺福克区域不删除。
- `scripts/test_western_prayerbook_1549.js` 校验来源、主体、两条旧事件去重、时序、局部区不越界、链接真实归属和无面积规则。
- GitHub Pages部署前执行，Selenium在1549年份检查主要新增事件与至少三个具名地区并产出截图。
- 有史料尚未证实的真实围城外界、各村死亡人数、威廉赫利昂斯事件准确日、克利斯特被处决者姓名等列为后续研究，不通过增加多边形精度伪造结论。

**状态：** 此份为提交候审文档。合并及Pages成功后再标正式发布。
