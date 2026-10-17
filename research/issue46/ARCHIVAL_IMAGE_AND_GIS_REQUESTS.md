# Issue #46｜原始1547—1550要塞图与实测矢量申请文本（未寄送）
日期：2026-10-13。**仅研究资料，未代表项目向机构发送邮件，也没有订购或支付档案费用。**

## A. NRS 苏格兰国家档案馆历史地图组
官方入口：https://nrscotland.gov.uk/contact-us/
历史检索室邮箱：lsrhe@scotlandspeople.gov.uk（馆方联系人，先咨询是否应转交Map and Plans Unit）
原图访问说明：https://www.nrscotland.gov.uk/learning-and-events/research-guides/maps-and-plans/?section=access-to-maps-and-plans
复制收费及订单约束：https://nrscotland.gov.uk/publications/printing-and-copying-services-at-national-records-of-scotland/
**费用可能产生，不要未经项目拥有者授权付款或下单。**

**Subject: Enquiry on RHP 6075, contemporary Scottish fortification plans (1547–1550), digital access and mapping rights**

Dear Maps and Plans Team,

I am undertaking a non-commercial historical GIS research project on the English military forts established in Scotland during 1547–1550. I am trying to distinguish verifiable English-held fortification footprints from later structures and from schematic military movements.

HES NRHE 58412 (Roxburgh Castle) lists “SCOTTISH RECORD OFFICE RHP 6075, Mid-16th Century, Belvoir MS – photostat copies of plans.” The University of Edinburgh doctoral study *Guns in Scotland*, Vol. 2, p. 490 n. 105, refers to contemporaneous Belvoir drawings of Broughty, Dunglass, Eyemouth, Lauder, Roxburgh and Fast Castle.

Could you please confirm whether RHP 6075 contains separately catalogued sheets for these forts and provide any available individual sheet references, original dates, scale bars, authorship and available digital images? I would particularly appreciate priority access to Roxburgh (William Ridgeway 1547), Eyemouth (first English defensive phase 1547) and Dunglass (English fort 1548–49).

Could you also advise whether accurate, unwatermarked research scans can be provided remotely, which permissions are required to georeference and publish *derived historical vector outlines with citation* in an educational online map, and whether any further permission is needed from Belvoir Castle/rightsholders? I would appreciate a quotation and confirmation of access conditions before any paid order.

Thank you for your assistance.

## B. HES / RCAHMS 2006—2009考古测绘原矢量
机构邮箱：archives@hes.scot；数字档案资料：digital.archives@hes.scot
公开访问说明：https://www.historicenvironment.scot/about-us/contact/archives-and-research/
史迹：https://www.trove.scot/place/58412
考古GIS项目：https://canmore.org.uk/site/58422/roxburgh
**Subject: Request for Roxburgh Castle 2006–2009 RCAHMS DGPS/GIS survey of the 1547 artillery fort footprint**

Dear HES Archives and Digital Archives Team,

I am preparing a source-audited, non-commercial educational GIS map of the 1547–1550 English military occupation sites in Scotland.

The RCAHMS 2006–2009 Roxburgh Castle field survey (NRHE site 58412; wider project 58422; SM1718) states that a 1547 English artillery fort plan (RCAHMS Inventory Fig. 517, after William Ridgeway) was overlaid in a GIS with DGPS terrain survey/hachure drawings. Your published notes distinguish the approximately 110 m by 65 m Henrician artillery enclosure from the substantially larger earlier medieval castle.

Would it be possible to identify and obtain any *digitised 2006–2009 GIS layer or surveyed vector linework specifically delineating the 1547 artillery fort* (rather than the modern scheduled-monument legal extent)? I would appreciate the CRS, archaeological-period attribution, plan georeferencing ground control points and error estimate, digitisation scale and any source metadata for that layer. If the vectors are not distributable, is a high-resolution survey plan with coordinate grid and written digitisation/reuse permission available?

My current map already uses your OGL scheduled-monument dataset as a separate modern legal-reference layer. I would not describe this as a confirmed Tudor fort footprint. Any approved 1547-specific vector would be used only with precise provenance and separate classification of later/older features.

Could you also advise on attribution and derivative vector reuse for an openly accessible public educational map and whether the original Belvoir image rights need to be cleared separately?

Thank you for your guidance.

## C. Eyemouth 1980—1988分期研究
可优先转发HES Archives，引用：
Caldwell, D. H. and Ewart, G. “Excavations at Eyemouth, Berwickshire, in a mid 16th-century trace italienne fort,” *Post-Medieval Archaeology* 31 (1997): 61–119. DOI:10.1179/pma.1997.002.
官方 SM3190：https://portal.historicenvironment.scot/designation/SM3190。
问题：能否提供1547 English first-phase trench/bastion plan 与1557 French construction second-phase plans、定位网格/发掘总图、绘图转载或GIS衍生许可？绝不可用SM4577 Corn Fort 替代。

## D. 本轮实际得到的数据
已通过GitHub Actions 38402612677 取得官方 `SM3190/SM3191/SM1718` **现代法律保护区**完整GeoJSON，并在 `HES_OFFICIAL_MODERN_SCHEDULED_REFERENCE.geojson` 保存。正式请求的是**古堡原施工/实际驻军围墙界**，而不是再申请另一份现行保护区边界。

## 地图准入状态
- verified_occupied_area 16世纪军控Polygon: 0
- official modern archaeological reference polygons: 3
- archive requests sent: 0
- paid image orders: 0
- pending critical archive: NRS RHP6075, HES/RCAHMS Roxburgh DGPS 2006–09 period-specific layer, Eyemouth Caldwell/Ewart phase maps

新材料入库必须记录馆方回复、文件来源、许可与原图配准误差；按分支提交。不得用现代保护区整面掩饰Issue #46的历史疆界缺口。
