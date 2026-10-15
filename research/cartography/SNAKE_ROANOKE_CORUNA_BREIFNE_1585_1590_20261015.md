# 🐍 第三批：殖民暴力区域说明查漏补缺（1585—1590）

2026-10-15｜独立审查｜目标：优先真实伤害、权威来源、地点与时间；避免用大面冒充英国统治疆域。

## 本批五项新增，已经进入真实地图数据

| 年份 | 事件 | 责任、当地后果、证据与制图限制 |
| --- | --- | --- |
| 1585 | Aquascogoc村庄与农作物遭烧毁 | Richard Grenville带领的英国殖民武装；美国国家公园局与北卡自然文化资源厅有正式记录。地理区域只给Belhaven附近地区参考，不将考古未知古村地址伪造为已测点。来源：[NPS历史手册](https://npshistory.com/handbooks/historical/16/hh16d3.htm)、[北卡州历史铭牌](https://www.dncr.nc.gov/blog/2023/12/06/aquascogoc-b-72)。 |
| 1586 | Wingina/Pemisapan遭殖民者杀害 | 英国罗阿诺克军事殖民地行政首领Ralph Lane指挥；NPS记载原住民补给冲突、疾病与英方先发制人杀死当地领袖。不能据此称英国控制整片Algonquian领地。来源：[Fort Raleigh NPS](https://home.nps.gov/fora/learn/historyculture/1585-the-military-colony.htm)。 |
| 1587 | Croatoan友好原住民遭英国殖民者误袭 | John White领导殖民者准备报复George Howe之死，却误袭与英国友好的Croatoan人。NPS记述Manteo制止攻击及有原住民被杀的事实；不能把Croatoan人简单认作“英军敌人”，也不能推断整片原住民地区被屠。来源：[NPS殖民地史](https://www.nps.gov/fora/learn/historyculture/1587-the-lost-colony.htm)、[Manteo传记](https://home.nps.gov/people/manteo.htm)。 |
| 1589 | 拉科鲁尼亚渔民区遭英军攻击 | 德雷克/诺里斯英军袭扰Pescadería，试图攻城却遭加利西亚军民抵抗最终撤退。来源：[西班牙陆军博物馆](https://ejercito.defensa.gob.es/museo/HECHOS_HISTORICOS/HECHOS_HISTORICOS/05.14_mayo_MARIA_PITA_Y_LA_DEFENSA_DE_LA_CORUNA.html)、[市政文化机构](https://www.coruna.gal/castroelvina/es/castro-habitado/personas/detalle/sir-francis-drake/contenido/1453606084169?argIdioma=es)、[美国国会图书馆存世图研究](https://www.loc.gov/collections/sir-francis-drake/articles-and-essays/drake-biography/drake-norris-expedition/)。决不标为英军长期控制全城。 |
| 1590 | 西布雷夫尼英王军入侵与领主流亡 | 英王宾厄姆部队攻击盖尔地方势力，烧杀与迫使Brian O'Rourke离境的史实见UCC CELT《四大师编年史》及爱尔兰人物传记辞典；行动存在当地抵抗和反复控制。来源：[CELT](https://celt.ucc.ie/published/T100005F/text002.html)、[DIB宾厄姆](https://www.dib.ie/biography/bingham-byngham-sir-george-a0664)、[DIB奥罗克](https://www.dib.ie/biography/orourke-o-ruairc-brian-ballach-a7029)。 |

这五项与早前十二项合计17个新增历史背景区域对象。**17不是实际占领区个数，不是统计死伤数，不是独立行政版图数。** 一些是相邻年份同地不同状态，如勒阿弗尔1562英军短占、1563法军收复，以及罗阿诺克连续三年不同性质的殖民伤害。

## 数据与交互

- 数据：`data/followup-regional-stories-1562-1596.geojson`由6增至11个Feature；第一批`data/early-war-colonial-impact-1544-1575.geojson`仍6个Feature。地图已使用它们的共用年度渲染与资料入口。
- 每项都有本章`source_ids`、`related_event_ids`以及正式机构链接`source_urls`。不重复增加Atlas事件而破坏章统计。
- 每项必须保持`historical_boundary_confirmed:false`, `fill_authorized:false`, `territorial_claim:false`, `area_sqkm:null`, `exclude_from_area_aggregation:true`。图面低透明度、虚线。
- `scripts/test_followup_regions.js`检查11个Feature身份、来源、时序、边界及没有误认为英国疆域。`scripts/browser_regional_stories.py`增加1585、1586、1587、1589、1590的真实浏览器可点击、来源显示测试。
- 独立CI符合三套检查后可合并，保留主站「版图／事件」图层与所有年份点位。

## 未完成的审查

- 罗阿诺克原住民村庄的真实古址、伤亡人数目前没有可核史料支持复原。暂不作精准边界。
- 1577/1578 Mullaghmast杀戮：爱尔兰人物传记辞典的不同条目描述存在时间、死亡人数字段差异；优先史学复核既有事件文案，不将“70名”“100—400名”未经一致考证就填地图统计。
- 1588年西班牙无敌舰队沉船幸存者被Richard Bingham下令杀害一事见DIB；缺少可靠的每个登陆海湾与执行地点，暂时保持事件研究线索，避免用一个假“全西海岸死亡区”骗过读者。
