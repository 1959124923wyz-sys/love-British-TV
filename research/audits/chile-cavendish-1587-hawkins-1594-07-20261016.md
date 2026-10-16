# 07｜1587卡文迪什金特罗登陆受挫、1594霍金斯瓦尔帕莱索私掠：智利太平洋海岸历史及地图补缺

**2026-10-16 | 目标：爱英TV已发布第十章1580—1589及第十一章1590—1599，承接06智利德雷克1578。** 

## 证据

1. **智利国家图书馆 Biblioteca Nacional de Chile，Memoria Chilena，[Los viajeros ingleses](https://www.memoriachilena.gob.cl/602/w3-article-619.html)**：明确将德雷克1578袭港、Thomas Cavendish 1587到Quintero、Richard Hawkins 1594袭掠Valparaíso作为三次不同英国私掠航次。特别注意原文1587 Cavendish往北捕获船舶的描述，**不能自动归入Quintero冲突中并宣称当地港区被抢掠**。
2. **智利海军暨海事史学院，《Boletín de la Academia de Historia Naval y Marítima de Chile》2018年第22号，[PDF](https://historianaval.cl/publico/publicacion_archivo/publicaciones/83_2.pdf)**：记录Cavendish在Valparaíso受雾阻碍后于Quintero登陆，并与西班牙殖民守军交战；英军留下阵亡与俘虏后驶离；另外记述Hawkins 1594行程。属于有明确出版机构和编审背景的海事历史文章。
3. **智利国家图书馆数字化历史书，[Quintero历史旧文](https://www.memoriachilena.gob.cl/archivos2/pdfs/MC0064379.pdf)**：有1587年4月9日至港、4月11日交战的记述，其他来源出现3月底等日期。因此地图保持「3—4月」，不虚构唯一确切日期。
4. **澳大利亚国立大学出版社，O. H. K. Spate，[The Last English Foray: Richard Hawkins](https://press-files.anu.edu.au/downloads/press/p66561/html/ch10s06.html)**：引述Hawkins本人1600年代出版的一手陈述，记先后夺取锚泊4船及另外入港1船，部分赎回或释放；包含商船物资与船上黄金，并有西班牙警戒与抵抗准备。数字是历史叙述的**船数**，不代表王室查验的持续净收益、被洗劫房屋数量或城镇占领面积。
5. **Richard Hawkins，[The Observations ... in the Year 1593](https://www.gutenberg.org/cache/epub/57502/pg57502-images.html)，1622原书，1847 Hakluyt Society重印**：当事人自述，可读数字化原著；带有船长自辩立场，与国家图书馆／大学研究对读。
6. 时代背景补充：**智利国家图书馆 [Británicos en Chile](https://www.memoriachilena.gob.cl/602/w3-article-3316.html)** 将1587 Cavendish与1594 Hawkins分开列年；以两次独立史事计数。

## 新增事件（各一条）

| 年份 | 数据文件 | 事件ID | 史实性质与范围 |
|---|---|---|---|
| 1587 | `data/atlas-1580-1589.json` | `PAC1587-CAVENDISH-QUINTERO` | 英格兰私掠船员在Quintero湾登陆取水遭西班牙殖民守军反击，英方人员被俘；金特罗**没有作为英国占领/成功焚掠区域**。死伤俘虏处决人数未跨多来源一致，不以确定数字录入。 |
| 1594 | `data/atlas-1590-1599.json` | `PAC1594-HAWKINS-VALPARAISO` | Richard Hawkins Dainty号在Valparaíso海湾夺取西属商船及仓储物资，后有部分船舶赎回。与1578 Drake同地异人异年，不应合并或把其中任何一年延续为英国控制领土。 |

新记载仍采用现代港湾参考Point用于地图定位，但 `historical_control_boundary_verified:false`、`actual_English_territory_created:false`、`actual_English_land_area_sqkm:null`、`colonial_profit:null`。

## 两片有据地理地区，非历史实测面

本批仅向既有 `data/followup-regional-stories-1562-1596.geojson` 追加两条：
- `cl-cavendish-1587-quintero-landing-defense`：智利金特罗湾登陆和当地军队反击的现代小范围阅读虚线；**不证明英军焚烧、持续控制或当地平民伤害**。
- `cl-hawkins-1594-valparaiso-plunder`：瓦尔帕莱索现代港湾被劫商船和港区仓储的阅读虚线；不是经史料测绘的房屋毁损边界。

两区一律 `historical_boundary_confirmed:false`, `fill_authorized:false`, `territorial_claim:false`, `area_sqkm:null`, `exclude_from_area_aggregation:true`；只在对应年份展示。**在1578年已有另一块Drake瓦尔帕莱索示意地区，应该按年份区分，不在1587—1593年持续显示该区域遭英国洗劫或实际控制。**

## 技术整合和保证

- 发布第十章37→38事件，78→81来源；第十一章37→38事件，71→74来源；地区连续研究图层12→14面。
- 当前 `app.js` 同时汇集早期研究地区、Followup叙事地区与世纪暴力区域；只修改Followup资源校验总数12→14，其他26片世纪暴力研究区域与曾经错误的1544—1589文件时段不受影响。
- 在 `scripts/test_chile_privateers_1587_1594.js` 检查双年份事件去重、官方来源存在、非领土面积、年份门禁、新两片概略区域资料和URL注册一致性。
- 扩充Followup年别地区单元测试、前一章继承校验、1588无敌舰队QA向前一年修订，以及两项真实Chromium浏览器截图/年轴回归。
- Pages发布前执行新检查，CI全部通过方合并主分支，无法确认线上页面刷新时不虚称已网页截图验收。

## 下一轮建议（未本批入库）

1587 Cavendish从Quintero沿南美西岸北上以及其后下加利福尼亚夺马尼拉帆船在第十章已有后者事件，后续可以研究**是否需要加南太平洋有据地点之间的“航程方向线”**，但不能未经核准连成每座沿海城市被袭击的错误整条红线。1594 Hawkins 后续北上并在现厄瓜多尔附近遭西班牙军俘获，可单列研究，不把失败归为英国占有海上通道。
