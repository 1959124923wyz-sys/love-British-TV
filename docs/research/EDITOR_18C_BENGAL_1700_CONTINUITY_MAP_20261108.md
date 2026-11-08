# 爱英TV｜18世纪孟加拉1756—1773年地图制作与1700年前后连续性交接

日期：2026-11-08｜编辑分支：`map/18c-bengal-1700-continuity-20261108`｜**研究试阅：未进入 `main` 的正式十年Atlas**

## 一、本次按照前辈16世纪叙事+地图双层范式完成的项目

以16C成熟专题与17C东印度公司已发表 `E6-T12` 为范本，本篇 `E18-T14-T15-BENGAL-1756-1773` 同时带来：**17件具真实发生年份的候审地图事件、15处具名地区现代参考点、15节正文／45段中文叙事、17处真实地图事件ID超链接**。正文以`[[E18C-BNG-...|历史动作]]`连接已登记地图事件，复用原有单击切年地图平移、双击历史档案及专题返回；原公司前篇只在试阅模式显示续篇入口。四个史事阶段为1756—1757年军事与政变、1760—1765年纳瓦卜政权更替及Diwani税权、1769—1772年大饥荒与地方财政通信、1772—1773年公司管理转变及议会授权监管。

`data/stories/serial/chronology-preview-bengal-1750-1779.json`与`data/stories/serial/e18-t14-t15-bengal-company-famine-1756-1773.json`为研究分流表；后者引用16个有登记来源的机构/学术材料，只有经过审查后才可移入正式 `data/atlas-1750-1759.json` 等各年章节。现有 `data/chapters.json`、生产文章清单和现有16/17C地图均保持不变。唯一激活条件为 `?review18c=1`；普通访问继续保留1699年已有试阅上限。

## 二、历史空间与政策机制

- **1756—1757年加尔各答堡垒：** 1756年Siraj-ud-Daulah统治下军队攻陷英公司旧威廉堡，1757年英公司及王室军队重新夺取；核实的`C1700-ENGLISH-CALCUTTA`城市核心符号1756年末不出现，1757年重新出现。严禁从一次失堡推断全孟加拉主权发生变动。
- **1757普拉西：**英公司与孟加拉Jagat Seth银行界、Mir Jafar等地方政治势力结盟，英公司印度兵员参与战斗。历史当事主体比“英国人打败印度”更复杂。Palashi纪念碑代表性坐标为现代遗迹标记。
- **1764布克萨尔与1765 Diwani：**英公司军队击败Mir Qasim、Shuja-ud-Daulah与Shah Alam II的联盟。随后Shah Alam II授予孟加拉、比哈尔、奥里萨财政收入征收权。税务授权、当地纳瓦卜和扎明达尔继续执行管理，与英国真实军事驻军边界不是同一概念。此批**0个获授权英国历史实控Polygon**。
- **1769—1772税赋／饥荒：**埃克塞特大学编辑的印度及西孟加拉历史原信记录1770年1月伯德万**约三十万卢比暂缓并计划次年偿还**，5月9日普尔尼亚**约三分之一人口死亡是当地官员当期估计**，9月11日公司财税信件并列已收款与预期收入；1771年又因佃农死亡逃离调整伯德万部分减让。现代学术把1770年孟加拉死亡比例估计为约1/6—1/3，应按估算地理和分母分开解释，不能把人口范围或地方税账直接加总。
- **1772年普尔尼亚：** 佃农等对Debi Singh提出强购谷物、勒索及暴力控诉；公司税官Ducarel随即否认。正文既保留控诉存在，也保留当事人的答复，待原档独立裁断各项事实。
- **1773年：** 英议会在公司财政危机下推动英国国家对公司印度财政、军政的监管；具体监督机制并非同一天在所有印度土地上生效。

**研究中的控制地点**另存 `data/eighteenth-century-bengal-control-cores-1710-1779.geojson`。仅两个带实际年份分段的 `Point`：加尔各答EIC城核和Murshidabad财政与纳瓦卜朝廷关系。用低透明**虚线点**表示参考位置，明确1756公司驻港控制中断，不涂现代省界、不计算任何历史平方米或税收涵盖面积。

## 三、1700年的领土连续性先行

`research/continuity/1700-1709/` 完整保存**旧文献几何27个的逐条去向**、7个机构证据的1700据点Point参考、**10份1700—1709年全年研究快照**、独立苏格兰达连1700撤离以及法方控制约克堡/皇家港的历史事实。约克堡在1700年是法军Fort Bourbon，不能因为1670年HBC纸面特许而视为英军实占。1707英苏合并是王国性质改变，不是殖民地面积凭空增长。此批7个有时间段依据的参考点无法替代1699年所有真正stable_id的全面盘点；下一轮仍要逐地复核原住民政治空间、贸易据点、驻军实际撤离与财政司法重叠。

## 四、逐项证据与 QA

重要来源包含：
- [British National Army Museum: Plassey](https://www.nam.ac.uk/explore/battle-plassey) 和 [EIC Armies](https://www.nam.ac.uk/explore/armies-east-india-company)
- [UK Parliament: East India Company](https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/parliament-and-empire/parliament-and-the-american-colonies-before-1765/parliament-and-the-east-india-company/)
- [University of Exeter: India House 1770 Correspondence](https://famineanddearth.exeter.ac.uk/displayhtml.html?id=fp_00224_en_fortwilliam-indiahouse_vol06)
- [University of Exeter: 1772 Purnea Petitions](https://famineanddearth.exeter.ac.uk/displayhtml.html?id=fp_00358_en_committeeofcircuit_7thjuly-20thaugust1772)
- [Cambridge: Bengal Famine chapter](https://www.cambridge.org/core/books/abs/land-and-local-kingship-in-eighteenthcentury-bengal/famine-of-1770/932B785B5186FD79ADB4EC5FF5127F85)
- [British Library IOR archival catalogue](https://searcharchives.bl.uk/catalog/041-000809836)（**目录级线索，未称亲读原卷**）。

QA 包括 `node scripts/test_18c_acadia_map_pilot.js`、`node scripts/test_18c_bengal_continuity_map.js`、`node scripts/test_editor7_17c_inline_story_map.js`、`python3 scripts/audit_spatial_semantics.py --strict`，以及两套独立的 Chromium **1780×1020** 真正桌面浏览器脚本。截图保留为CI附件，而不冒充正式出版。

## 五、接棒步骤

1. 把1700各独立殖民政体的**真实1699年末** stable_id 从17C Atlas和具名控制点中完整提取，随后逐处比对已审核真实边线。不能将27个旧参考Polygon偷换成实控版图。
2. 建立孟加拉各县的1765—1773年Diwani实际收支`zamindar/pargana`账目矩阵、地方抗议/控诉证据的同时性，必要时把大范围**有据地理影响区**作虚线，而非用现代邦界着色。
3. 本分支只作为研究试阅原型，地图主编完成历史核实、空间监督和完整出版集成后，才可登记正式十年Atlas及原生故事目录。切勿合并未经审核的空间段。
