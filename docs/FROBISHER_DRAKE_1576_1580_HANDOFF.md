# 爱英TV｜第33、34专题——弗罗比舍与德雷克交接（2026-10-17）

## 一、完成范围

本分身分支继承待合并PR #120的第33专题及第28、30—32专题。第33专题原有12节、四名因纽特人被掳/去世、三次远航、Kodlunarn采矿、1578年石屋和未成功的越冬殖民、矿石运回达特福德等史事全部保留，新增一处核实的政治史事：`FRO1578-GREENLAND-WEST-ENGLAND-CLAIM`。加拿大《人物传记辞典》明确指出弗罗比舍1578年6月以英王名义宣称格陵兰并称“西英格兰”，但无法确认持续控制区域或登岸地点；该事件保持坐标`null`，绝不填涂英属格陵兰。

第34专题新增`data/stories/drake-circumnavigation-privateering-resistance-1577-1580.json`，14节约3974字（以JS字符串长度计）中文连续历史叙事。沿普利茅斯—佛得角—巴塔哥尼亚—麦哲伦海峡—莫查岛—瓦尔帕莱索—拉塞雷纳—卡亚俄—瓦图尔科—北加州—特尔纳特—爪哇—普利茅斯，交代葡萄牙领航员遭扣留、船队内部处决、原住民抵抗、港城被抢、西班牙反击、丁香交易及1580返航。

## 二、本轮新增地图事件（有据9项）

1578：
- `FRO1578-GREENLAND-WEST-ENGLAND-CLAIM`——弗罗比舍格陵兰王权宣称，无可靠单一位置，null，不算殖民控制区
- `DRA1578-CAPE-VERDE-PILOT-CAPTURE`——佛得角商船遭截、葡萄牙领航员强制扣留，圣地亚哥岛参考点
- `DRA1578-MAGELLAN-PASSAGE`——穿越麦哲伦海峡，中段水道方向参考点
- `DRA1578-PACIFIC-FLEET-STORM`——太平洋失船及分离，沉船地点不明，null

1579：
- `DRA1579-CALLAO-INTELLIGENCE`——卡亚俄获知载金银船只航向；不冒充Cacafuego实际海上夺船坐标
- `DRA1579-TOLEDO-PACIFIC-PURSUIT`——秘鲁副王托莱多派军追击，安排萨米恩托测绘海峡
- `DRA1579-HUATULCO-DA-SILVA-RELEASE`——瓦图尔科释放被扣留的葡萄牙领航员
- `DRA1579-TERNATE-SULTAN-CLOVES`——特尔纳特苏丹与德雷克交涉、英国船购入丁香

1580：
- `DRA1580-JAVA-LANDCALL`——爪哇岛方向，实测港湾未核，继续印度洋和好望角返英

原有的`1570S-E018`（Cacafuego金银船遭夺）、莫查原住民抵抗、瓦尔帕莱索劫掠、拉塞雷纳击退袭击、`1580S-E006`返英均未删除和重复建卡。总的第九时段Atlas（1570—1579）由68增为76项，第十时段（1580—1589）由38增为39项，正式专题待合并总数由21增为22。

## 三、线、面保持既有正确成果

已合并的PR #102提供`data/drake-circumnavigation-1577-1580.json`的14段完整航次及跨国际日期变更线渲染，含1578南大西洋至智利、1579横渡太平洋及1580绕好望角返航。该段航路历史证据只支持地名先后顺序，未提供每日船位；本轮不复制第二组海线、不变更渲染算法。

1578莫查、瓦尔帕莱索、拉塞雷纳原有三个虚线局部研究区域仍分别表述原住民接触、港口暴力劫掠与居民防御，不合并成覆盖智利的英属占领面。格陵兰、新阿尔比恩、特尔纳特都不新增英王连续控制面积。两章`colonial_polygons`保持空。

## 四、权威资料与准入

- 加拿大《人物传记辞典》弗罗比舍传记： https://www.biographi.ca/en/bio/frobisher_martin_1F.html
- 加拿大公园管理局Kodlunarn历史遗址： https://www.pc.gc.ca/apps/dfhd/page_nhs_eng.aspx?id=332
- 美国国会图书馆Kraus收藏德雷克环球航行： https://www.loc.gov/collections/sir-francis-drake/articles-and-essays/drake-biography/the-famous-voyage/
- 美国国会图书馆德雷克年表： https://www.loc.gov/collections/sir-francis-drake/articles-and-essays/timeline/
- 美国国会图书馆托莱多文书及海峡调查： https://www.loc.gov/collections/sir-francis-drake/articles-and-essays/drake-biography/strait-of-magellan/
- 智利国家图书馆： https://www.memoriachilena.gob.cl/602/w3-article-619.html
- 美国国会图书馆历史航行地图： https://blogs.loc.gov/maps/2023/11/mapping-the-voyages-of-sir-francis-drake/

来源限制：国会图书馆Kraus馆藏叙述是馆藏历史研究和相关原始文献摘介，不能将它冒充每一页原始船员航海日记。1579金银商船被夺的海上经纬度、北加州唯一真实泊位、1580爪哇确切港口皆未得到同期船位实测，不应升格为精准地理点。

## 五、质量检查与依赖

- `scripts/test_frobisher_drake_stories_1576_1580.js`（新）：校验第33／34专题关联、来源、9个新增事件的时间与领土禁算、PR #102十四段不丢失。
- `scripts/browser_frobisher_drake_stories.py`（新）：从1577年出航进入第34篇，依次单击跨到1578、1579、1580年的新事件，保持专题阅读及返回功能；两项接入`.github/workflows/major-history-stories.yml`及`pages.yml`有关门禁。
- 原章节与专题测试含历史事件数量断言，已按新增史料同步修正，不删旧事实来满足断言。
- **分支依赖PR #120**，该PR包含28、30—33，及其上游PR #119内容。必须避免将本PR与PR #120同时无序合并，以免重复。由主编审核后确定合并顺序，最终主分支和Pages部署实际成功才能称正式上线。

## 六、交接

分身02只在`feature/snake-e-02-stories-20261017`保存修改，不主动改`main`。未来继续由蛇E指定新的专题，完整研究依据与缺失精度均从本文件及JSON直接恢复。
