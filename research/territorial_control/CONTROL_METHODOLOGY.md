# 爱英TV · 实际控制区（Effective Territorial Control）制图判定规范 v0.1

**日期**：2026-10-11  
**用途**：研究方法与审核门槛，暂不直接改变主站。适用范围：1490年代—当代。  
**身份**：研究员1号建议稿，网页维护者及史料审核者复核后才能作为主库正式契约。

## 0. 核心研究问题

每一个年份：**英格兰／苏格兰／大不列颠／联合王国王权、政府或受授权的公司，在何处实际实施何种治理权？**  
**先确认“控制”及其时间和边界，再关联财富提取；政治控制本身不能证明英国政府、股东或商人已赚取利润。**

研究单位优先是 `territorial_control_episode`（主体在某区域的一段特定治理关系），而非“殖民地国家名”。一个现代国家可存在多个历史统治区，彼此时间与法律性质不同。同一土地亦可能权力重叠、遭地方政权或原住民长期抵抗，地图需保留这种复杂性。

## 1. 五类不同关系，必须分层

| code | 定义 | 地图基本表现 | 典型证据 |
|---|---|---|---|
| `effective_civil_administration` | 具可核实的长期政府机构／司法／税务／土地登记或持续殖民行政的地块；不得单靠声称决定面积 | 经审核的实心殖民控制面；必要时仅点/局部范围 | 行政法令与实际执行记录、官员信件、税务／司法档案、多期地图 |
| `effective_company_administration` | 受授权公司在当地实际执行财政、司法、军事或行政权；不是仅有贸易专营权 | 与王室直接统治颜色/纹理有区别的面或局部范围 | 权利文书+当地行政、税收、军队部署记录 |
| `protectorate_or_indirect_rule` | 殖民权力控制对外关系、军事或财政等关键权力，但当地政体仍行使部分内部治理 | 分层纹理，明确受控制的领域、承认的当地政治主体 | 条约+实际驻扎、任命/外交/收税证据 |
| `temporary_military_occupation` | 已占据据点／地带，尚不能据此推定长期民政 | 临时军事控制图层；可选局部占领面及有效期 | 战报、军政命令、控制起讫纪录 |
| `claim_charter_trade_or_contact_only` | 王室宣称、地图标注、贸易许可、单次登陆、未实现的土地授予或短暂停泊 | 点/线/说明，不允许殖民统治面填色 | 特许状、航海日志、地图宣称 |

其他：`contested_mixed_control` 只能在明确记录主体和空间证据后用争议纹理；`unknown_or_insufficient` 为“无资料或未通过审查”，**不能**被自动改成“无人控制”或“英方已统治”。

## 2. 政治权利与实际控制要分别记

每个控制期至少需要分别问：

1. **法理／声称**：王室、殖民公司或议会宣告的权利是什么？有没有条约、特许证或法令？仅此项无法确立“实际统治”。
2. **行政／强制力**：当地是否有可核实的官员、定居点、法院、军政、税务、土地登记、海关、驻军、警察等？持续多久？实际能在哪些地方运行？
3. **地方权力／反证**：是否另有原住民政权、地方军队、自治体系、持续抗拒或多方争夺？治理在多大范围存在缺口？
4. **时间**：法律宣称日、到达日、驻军日、实际治理日、撤出日、移交日**分别**记录。若只能确认某一年，不能以十年刻度反推出一月一日。
5. **空间**：允许更小的据点/走廊/多块区域；禁止将皇家授予的几百万公顷面积直接当作受控区，也禁止沿用现代国家边界冒充历史疆界。

## 3. 数据结构（建议契约，研究阶段）

一条 `control_episode`：
- `id` 稳定永久编号；`region_label_historical` 当时名称，`modern_lookup_label` 仅便于检索。
- `sovereign_claimant_id` 与 `effective_governing_actor_id` 分开（如王权/公司/当地行政/驻军）。
- `relationship`（本规范之一）；`legal_status`（royal_claim/colony/protectorate/...）；`control_facets[]`（civil/court/tax/military/land/customs/diplomacy）。
- `start`, `end`：各含 `date`, `precision`, `qualifier`；有覆盖区的起止变化须拆成多条 episode。
- `assertions[]`：每条 `claim_id`, `claim_text`, `supporting_source_ids[]`, `contradicting_source_ids[]`, `original_locator`, `review_state`；记录各来源真正支持了哪项论断。
- `geometry`：`type`（polygon/multipolygon/point/line/none），`geometry_status`（historically_attested/estimated_with_boundary_range/representative_only/unknown），`source_id`, `map_date`, `georeference_method`, `uncertainty_reason`, `verified_geometry_uri`，以及`coordinates`（无来源时为null）。
- `benefits[]` **独立关联实体**；最低需 `account_type` (colony_revenue, customs, corporate_profit, private_dividend, gross_trade, tax, land_rent, expenditure, transfer), `payer`, `recipient`, `currency_year`, `method`, `source_id`; 缺值为 `null`，不可填“富有”“暴利”作数值。
- `evidence_assessment`: `document_status`, `date_confidence`, `spatial_confidence`, `control_confidence`, `reviewer`；单独 `significance`（1/2/3及理由）供可视化使用。

**地图读取原则**：只能发布 `editorial_approved=true` 并含合格 geometry 的有效控制面。地理不确定但控制事实可信，可表现为虚线范围／非精确点，附明确标注，不得创造伪精确坐标。

## 4. 可审核的判定门槛

**文书证据：**
- 一份特许状、宣称地图、后世帝国概览表：只能生成 `lead/claim`，不得发布整片填色。
- 一份明确记录当地设立治理机构的原始文书：可提升到 `source_checked`；但需要查管理实践与实施范围。
- 一组行政持续性证据 + 独立空间证据 + 核对争议：可提请 `editorial_approved`；允许明确标为部分有效控制或争议区域。
- 对年代和控制范围无法证明的边界，只用虚线；`geometry_type=none` 时绝不输出polygon。
- 即使有某年地图，也要查其绘图者和性质：帝国官方宣传／土地赠与图可能夸张实际控制。原生测量图与图纸上的政治主张仍需区分。
- 一个领土可以按历史期分割：收复、占领、地方叛乱、分治或条约变更不可由一个单调增长的范围表达。

**不合格情形：**
- 1496年的卡博特特许状直接推断英格兰控制整个纽芬兰。
- 1607年Jamestown定居点直接画满现代弗吉尼亚州。
- 1656—1658年Down Survey的地块所有者宗教比例直接冒充“英国有效疆界”。
- 把1886年后国际边界数据库拿来填充1700年全球殖民地。
- 把殖民税收、贩奴贸易总额、公司利润与殖民地支出直接相加为“英国净收益”。

## 5. 三个起步检验案例（此处不发布 polygon）

| 案例 | 目前能说什么 | 空间绘制的缺口 | 锚定史料 |
|---|---|---|---|
| 1490年代爱尔兰 | 英格兰王权政治宣称和实际行使权力的地区有差异；不同地域控制不均 | 需要可审核的The Pale／英格兰据点历史边界，现阶段不能把全岛填色 | `TNA-IRELAND-SP-1509-1782`（从1509年起，故无法代替1490年代证据；需补15世纪一手档案和专业研究） |
| 1607年Jamestown | 有英国殖民定居点在该年建立的政府机构历史叙述 | 能证明据点，不等于可直接画整个Virginia；需查定居地控制范围与波瓦坦政体的管治疆界 | `USNPS-JAMESTOWN`, `TNA-EARLY-COLONIES-1574-1782` |
| 1650年代爱尔兰征服与土地分配 | 1649—1653年征服后，1656—1658年土地测量记录并可与1641、1670所有权变动关联 | 先使用实际丈量地块描述土地转移，不能自动将所有地块变成同一种主权统治面 | `TCD-DOWN-SURVEY`, `TNA-IRELAND-SP-1509-1782` |

## 6. 给地图维护者与接力研究员

1. 先读 `SOURCE_REGISTRY.json`，其中记录来源机构、档案号、覆盖期、访问和许可。
2. 再读本文件。新证据优先填 `assertions[]` 与控制关系，而非直接从现代国界切割矢量面。
3. **第一轮不要绘制新的殖民多边形**：先选最有争议的1490年代爱尔兰控制区、1607年早期殖民据点验证协议；能证明的才上图。
4. 不强行整齐铺满每十年：每个控制关系记录开始/结束的**证据精度**，UI 时间刻度只触发显示。
5. 任何经济因果论断均需独立证据；控制区只为收益搜集提供线索，不自动产生利润数字。
6. 文件均在独立研究分支，不能与主网页混淆。未核验第三方素材再分发许可时仅保存链接与书目。
