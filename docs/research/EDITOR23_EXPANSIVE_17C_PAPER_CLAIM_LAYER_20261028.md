# Editor23｜17世纪殖民地区宏观填色政策：最大纸面声索与历史实际控制分开

日期：2026-10-28。独立GitHub分支：`cartography/17c-expansive-colonial-claim-overlay-20261028`，研究PR #273。

## 用户请求与设计目的

用户希望17世纪殖民者拥有的殖民地区和国家**大面积画出来，不再只有事件标记**，并明确表示更重视宏观视觉覆盖而非细颗粒度严格测绘。本次直接实施14块年份门控、填色＋虚线外缘的宏观地理区域。**在叙事和数据字段内保持“纸面最大声索／有据政权的大范围概略示意”与“已完成真实实控测绘”这两种完全不同的陈述**。这允许表示宏大的17世纪殖民投资、特许和政权扩张，同时不对史料不存在的边界故作精确。

## 本轮14处区域

| 数据ID | 显示区间 | 依据及性质 |
|---|---|---|
| claim-virginia-company-1609 | 1609—1624 | 弗吉尼亚公司特许西抵太平洋，**纯纸面**，公司特许1624终止 |
| claim-massachusetts-1629 | 1629—1684 | 马萨诸塞湾原始特许横贯北美、宽取的带状示意，1684旧特许终止 |
| claim-carolina-1663 | 1663—1664 | 1663王室特许北纬31—36度、大西洋至太平洋 |
| claim-carolina-1665 | 1665—1699 | 1665扩张至约29—36.5度，与西班牙佛罗里达声索冲突 |
| claim-hudson-bay-1670 | 1670—1699 | 鲁珀特地哈德孙湾公司流域声索，长期争议 |
| claim-pennsylvania-1681 | 1681—1699 | 佩恩特许，外缘按宽取方向概略，不等于莱纳佩同意转让 |
| claim-ulster-1609 | 1609—1699 | 阿尔斯特六郡王室殖民政策概略地区；不是逐宗没产地籍 |
| claim-ireland-conquest-1653 | 1653—1699 | 英格兰征服后爱尔兰王国政治控制的现代全岛地理参考，不逐村证明服从 |
| claim-scotland-commonwealth-1652 | 1652—1659 | 英格兰共和国军占苏格兰本土；1660王政复辟后必须关闭 |
| claim-jamaica-island-1655 | 1655—1699 | 牙买加殖民者整岛声索，山地马龙持续自主抵抗 |
| claim-barbados-island-1627 | 1627—1699 | 巴巴多斯整岛殖民地区参考 |
| claim-bermuda-islands-1612 | 1612—1699 | 百慕大英格兰公司／王室殖民地区参考 |
| claim-bahamas-1670 | 1670—1699 | 巴哈马领主群岛特许，**包络多含海水，绝不等于海域主权** |
| claim-northern-acadia-scots-1629 | 1629—1632 | 苏格兰阿卡迪亚特许与查尔斯堡，**非英格兰直接殖民政府** |

每条记录具有各自的史料URL、起止年、具有年代关系的已有事件ID、文本的史料局限与制图方法。资料：`data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson`。

## 关键一手及权威资料

- [美国北卡州政府卡罗来纳王室特许](https://www.dncr.nc.gov/learn/resources-topic/350th-anniversary-carolina-charter)、[耶鲁法学院原始1663条文](https://avalon.law.yale.edu/17th_century/nc01.asp)、[1665新版](https://avalon.law.yale.edu/17th_century/nc04.asp)：向太平洋扩张属于英王的**理论性文字授地**，而非实际军占。
- [马萨诸塞州州务卿1629特许](https://www.sec.state.ma.us/divisions/archives/collections/mass-archives-collection.htm)、[纽伯里图书馆殖民地历史界线](https://publications.newberry.org/ahcb/documents/MA_Consolidated_Chronology.htm)。
- [耶鲁1681宾州特许全文](https://avalon.law.yale.edu/17th_century/pa01.asp)，[宾州州档案原始特许](https://www.phmc.state.pa.us/portal/communities/documents/1681-1776/pennsylvania-charter.html)。
- [哈德孙湾公司1670特许原文](https://www.gutenberg.org/cache/epub/6580/pg6580-images.html)及[加拿大政府研究指出边界争议](https://publications.gc.ca/collections/collection_2017/bcp-pco/Z1-1991-1-41-6-2-eng.pdf)，[温尼伯大学流域解释](https://www.uwinnipeg.ca/rupertsland/about-us/what-is-rupertsland.html)。
- [英国国家档案馆牙买加史](https://cdn.nationalarchives.gov.uk/documents/migrated-archives-3-guidance.pdf)，[UCLA出版史著](https://history.ucla.edu/publication/the-english-conquest-of-jamaica-oliver-cromwells-bid-for-empire/)；[加拿大公园局苏格兰查尔斯堡原址](https://www.parks.canada.ca/lhn-nhs/ns/fortanne/culture/charles-fort/histoire-history)。

## 技术合同

新增层在`app.js`里独立读取和校验，仅供16**00—1699**年份、版图开关打开时显示，位于旧版据点、事件图标下方；保留在地图图例的文字说明。出现失败时隐藏新增层，**不应阻断旧17世纪事件加载**。

- 大面积形状是依据源文献的纬度、地域和纸面权利，**人为概略宽取**的连线，不是任何一套真实历史测绘图。尤其波士顿特许、弗吉尼亚及卡罗来纳跨大陆面刻意夸大视觉上限。制图点位不可反向作为历史数据。
- 所有新面`historical_boundary_confirmed:false`、`boundary_verified:false`、`fill_authorized:false`、`territorial_claim:false`、`area_sqkm:null`、`exclude_from_area_aggregation:true`，独立`royal_paper_claim:true`可标明有文本声索但**不进入已确证控制统计**。
- 原始`data/atlas-1600-1699`十年表`colonial_polygons:[]`始终不变；不动1497—1599年官方历史地理资料和界面基础设施。
- 禁止以新增色块计算英国实际占地总面积；禁止因有色块便断言所有被覆盖的人、村落、国家有英国实质统治；用户应能一键关闭整个“版图”层、在历史图例看到“纸面声索”说明并点击来源。
- 浏览器验证1609、1629、1652、1670、1681、1690、1599，检查遮挡、开关、点击史料、年份消失，老版合同保持完整。

## 后续建议

下一阶段提高本层的几何美观度时，可优先引入有开源许可的历史地籍图和加拿大自然资源地表分水岭测绘，而不是从另一套当代国界推导历史军占。面积统计与历史军政实控仍应使用不同数据表。
