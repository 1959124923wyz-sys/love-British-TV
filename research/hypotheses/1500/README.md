# 1500年前后两地疆界推定实验 | 爱英TV
研究员1号 · 2026-10-12 · **实验用，未获准上线为殖民地实控疆界**

## 最重要的结论
1500年英王在加来地区拥有实际的军事行政驻地，在爱尔兰东部的English Pale有王权统治与地方代理管治。但就**完整、精确的控制界线**而言，两区目前皆不能以现有档案原图得出可审定polygon。因此本文绘制的是**视觉包络与近似法令地名连接线（hypotheses）**，绝不是“已确认实际控制疆界”。当现有证据仅有地点时，记录点；没有任何事实填色授权。

## 已提交的地图源文件
- `HYPOTHESIS_ENVELOPES.geojson`：WGS84 GeoJSON，30条Feature（爱尔兰1488法定边防地点连接虚线、探索性的爱尔兰城镇覆盖包络、加来十处相关地点的数学凸包、27个现代地名锚点）。
- 所有几何位置为现代地名参考点。经纬度不得理解成1500年的堡垒、边防堑壕或国界勘测点。
- 每条虚线图层带字段 `approval: never_render_as_published_actual_control`；没有获得正式殖民地边界地理审核。
- 爱尔兰可视“区域”特别容易误导：1488法令的边防地名折线接近军事法令表述，海岸一侧的闭合通过现代Dalkey—Dublin—Drogheda—Ardee等城镇连接，**并非当时海岸线，更不是精确疆界**。
- 加来包络是历史提及十个据点的**点集凸包**，不是城外历史March的实际边界；区域外一些可能受英王控制的村庄和沼泽未必包含其中，区内亦不必都能实施王室统治；凸包面积无历史含义且禁止当作“当时统治面积”。

## 推定依据与可信度
### 爱尔兰 English Pale
1. **1500年前后更接近的历史参照**：1488–1489年爱尔兰议会要求修筑防御壕沟及城镇防御的法令；Weston St. John Joyce (1921) 按该法令画出地名顺序与线条，[原图](https://commons.wikimedia.org/wiki/File:The_Pale_According_to_the_Statute_of_1488.jpg)。这是**后世复原图，不是1488年原始测绘**；Commons标为公有领域，但其年代对应的是法令主张。
2. Tadhg O'Keeffe，*Medieval Frontiers and Fortification: The Pale and its Evolution* (1992), [学术转存](https://deremilitari.org/2014/06/medieval-frontiers-and-fortification-the-pale-and-its-evolution/) 区分法令的防御主张、实际工事的残存、领地控制能力。
3. Steven G. Ellis，*Ireland's English Pale, 1470–1550* (2021) [学术著作](https://www.cambridge.org/core/books/irelands-english-pale-14701550/75C7AB64DF6AAF406B9544F2D2BCDCFA/listing)：都柏林、米斯、基尔代尔和劳斯中世纪名义郡界并非今天四郡边界，也不等于有效施法范围。
4. **地名歧义**：Rathmore很常见。本实验专用Kildare Naas附近考古地名，禁止误用Kildare东北的另一个Rathmore。Siddan堡垒中心亦是考古或现代定位假说。

### 加来 Calais
1. [英国国家档案馆](https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/french-lands-english-kings/) 确认Calais、Guînes等财政/军事地带历史背景，档案 `E 315/407`（1482–83地籍/租册）、`E 36/269–272`（财政监察官）、`DL28/2/1–11`（地方财政）、`LR2/88`、`LR2/59`（调查）可为未来界线定点。
2. [法国文化部考古报告](https://www.culture.gouv.fr/mc/content/download/337416/pdf_file/SRA_GUINES-WEB.pdf?inLanguage=fre-FR&version=48) 有1352–1558加来英属飞地及Guînes地景历史示意，**长期概述接近300 km²并非精确1500测量**；不能复印或逆向数字化报告的版权绘图用于未授权再发布。本实验没有从其图像自动追踪边界，只选记载的地点及现代坐标构造独立包络。
3. David Grummitt，*The Calais Garrison* (2008), [出版方](https://www.cambridge.org/core/books/calais-garrison/6D76638AD8C8E6D7348A9943F2DDF919)，加来城/城堡、Guînes、Hames及Rysbank驻军。1510年前不存在后来1525/26新建的Newenham Bridge堡垒；不可按1556或1558历史地图倒填。
4. **排除控制的参照**：Ardres为法方堡垒，Gravelines属于佛兰德，Boulogne亦不归1500英王直接管理。地图以红叉标记Ardres与Gravelines，防止误染相邻区域。

## 技术方法与地图语法
- 数据坐标：`EPSG:4326`, GeoJSON `[经度,纬度]`；现代地名坐标来自GeoNames、公开OSM地名线索与有限考古地名记载，**不是历史界石测绘**。
- 爱尔兰法令地名点按史书/法令顺序连直线（橙色虚线）；这些线段不是法令中堑壕已实际建成的证据。
- 爱尔兰东侧简化覆盖多边形仅帮助非专业读者看大致都柏林内陆与海岸之间的位置关系，绝不可拿来计算面积。
- 加来透明紫区以各站点现代中心的二维凸包 `convex hull` 表示其**站点分布范围**。不是完整March、不是历史地图复刻、不是对当地每块土地实际统治的声明。
- 来源版权：GeoNames现代地名数据标CC BY（须署名），部分开放地图底图可能使用OSM ODbL；法国文化部报告绘图©Jean-Michel Willot，未获再分发授权，仓库**只保存链接、独立构造的假设几何和事实出处**。
- 更严谨研究应构造`control_minimum`（证实的古城墙/堡垒/地方税区）、`control_possible`（法定边地大致范围）、`control_contested`（具体外缘争议），各期独立核年代；本试验暂不声称最低面边界已确定。

## 质量红线与后续研究计划
1. 不准直接合并到主站当前殖民区填色图层。若展示于网页，须是**默认关闭、淡色透明、虚线、明确标“研究假说”**的独立实验图层，点击能看到来源与不确定性。
2. 当前WGS84地理包络无史学认可面积、无可靠地图配准的误差估计，禁止按图测算“1500英格兰共控制X平方公里”。
3. 必须查 `E 315/407`、`LR 2/88`、`LR 2/59` 真正日期和教区地籍，重建加来March历史行政线，再由法国地名与档案对照。
4. 爱尔兰查看1488法令原文完整地名序列、Joyce图上的各段注记，确认法定边防堑壕哪些实际修筑、地图中被简化过的连接线，与1490–1510行政收费、军政地点共同审核。
5. 独立核查现代定位点Rathmore/Siddan/Balinghem等地名歧义，先做无来源的点剔除，再决定是否需要分离片区。
6. 地图期间1500—1509仅作为参考窗口，不能认为1488法令一条边防线未变化维持十年。额外史料确定的变动必须替换时间片中的局部线段。

## 接力
本分支是地图猜测试验，独立于研究分支 `research/territorial-1500-1510-20261012`（PR #4）。新的发现优先保存证据与空间源信息，保留原始来源、坐标不确定性和审批状态。向主地图合并必须经过维护者批准。
