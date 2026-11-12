# 爱英TV｜主编16 第七批：苏格兰1700达连、1707联合及1715—1792高地政策地图交接

**2026-11-08｜独立分支：`map/18c-scotland-union-culloden-clearances-20261108`｜仅 `?review18c=1` 研究试阅｜不更改正式 `main`。**

## 第一原则：前辈已有资料优先于重新选题

继承主编15留下的 `research/18c/consolidated/series/T31.json`、`T32.json`、`MERGED_EPISODE_GROUPS.json` 与完整 `COMPLETE_1126_ARCHIVE_CROSSWALK.csv`。该两系列共有 **9组合并研究**，每项子事件保留原始ID，原助手C **24个具命名空间的来源键**均已由 `scripts/audit_18c_scotland_source_registry.py`在GitHub Actions中解析原集中ZIP `SOURCES_C.json` 核验通过。三位助手原ZIP原样保留。

本批地图取 **23个具年独立史事**，其中17个由真实T31/T32组合及同年对应原ID支持，6条是原本未被列入315个正式候选的正文、低价值记录结合官方材料重新提升为研究试阅节点，并在事件中填入`research_merge_group_id:null`、原`research_original_record_ids`与审查备注。没有篡改315条原记录映射。

原始资料以外增加13项议会、博物馆、NRS档案目录、HES战场正式登记、NTS官方遗址资料，合计 **37项**来源登记，每项明确原C注册源或新增出处。

## 第七批实质产出

| 文件 | 作用 |
| --- | --- |
| `data/stories/serial/chronology-preview-scotland-1700-1799.json` | 23个逐年行动/法令/战事，37项登记来源与准确原ID、5处有依据的现代地理参考点，0新增主权Polygon |
| `data/stories/serial/e18-t31-t32-scotland-union-culloden-1700-1799.json` | 19节／57段完整中文历史专题，23处 `[[E18C-SCT-...|行为描述]]` 实际可点击事件链接 |
| `data/stories/serial/preview-18c-index.json` | 在六篇已建试阅专题之后登记第七篇，正文前篇关联 **正式已发表** `E6-T04-DARIEN`、`E6-T04-GLENCOE`、`E6-T04-CONQUEST` |
| `app.js`, `js/history-stories.js`, `index.html` | 只在显式研究模式加载本批、复用旧十年地图／双击档案／跨年历史互动，17C已发表苏格兰三篇可在该模式进入18C后篇 |
| `research/continuity/1700-1707-scotland/STATE_AND_DARIEN_ACTOR_TRANSITIONS.json` | 6项历史主体及日期账：达连苏格兰公司据点1700结束、1707-05-01两个王国法律合并、爱尔兰保持另外王国、Culloden不造成新的1746全苏疆界、司法及没收庄园不等于新主权Polygon |
| `scripts/test_18c_scotland_map.js` 与 `.github/workflows/18c-scotland-map.yml` | 第七批合并源、原1126条去向、GIS、全部六篇静态回归和七篇真实桌面Chromium地图回归，截图上传Action |

## 关键历史编辑判断

1. **1700达连**：古纳人一直使用自己的海岸，苏格兰公司Fort St Andrew殖民驻点被西班牙围攻后于1700年降约并撤离。此事接续旧`E6-T04-DARIEN`；这不是英国17C或1700年在当地稳定拥有的整块殖民土地。资料留有3—4月具体文件日期差别，仅按年在地图显示；现代Caledonia Bay 8°55′N,77°42′W为前辈已核宽域参照，不绘具体堡墙。
2. **1705英格兰Aliens Act**：英苏未合并前英国议会在英格兰政策框架下威胁限制苏格兰主要产品进口及苏格兰人在英财产待遇。<https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/act-of-union-1707/overview/westminster-passes-the-alien-act-1705/>。承认具体经济胁迫，不能误读为1705英军征服苏格兰。
3. **1706—1707联合法**：Whitehall的25条草案先达成，苏格兰于1707-01-16投票110：67通过，英格兰议会1707-03-06批准。**仅1707-05-01大不列颠正式成立**，苏格兰法律和法院制度继续存在；爱尔兰与大不列颠王国身份有别。依据英国议会及下院图书馆。
4. **1707财政Equivalent**：£398,085 10先令是联合法Article XV的**总财政补偿款**，不是单独Darien赔偿，更不能作为已核实全款贿赂达连股东总额；材料 `C2-UNION-PAY` 存首批1707年8月到账线索。
5. **1715王朝战争**：詹姆斯党希望恢复斯图亚特王朝，政府与反政府双方均存在不同苏格兰组织；Sheriffmuir两军互有胜负，HES不把它定为政府一场决定性歼灭战。
6. **1719 Glenshiel**：英国军与有西班牙分队参与的詹姆斯党军交战，HES BTL10记载存世阵地、老兵部队的原始绘图和现代历史地貌；不把1719战争解读为英苏分立王国作战。
7. **1725政策**：麦芽税骚乱与再次缴械属于不同责任、性质的行动。原助手单一研究提出Glasgow八人死亡，尚缺逐名官方本地核对，不把这个人数放上地图作核准总数。
8. **1745—1746大战及战俘**：Glenfinnan今纪念塔建于1814年，NTS认为举旗实际小址可能在塔北300米；Culloden以HES BTL6官方战场中心作现代地理锚点。战后羁押、处决和运往美洲南部及西印度契约劳动另列，不将战后受害和战场死亡相加。
9. **1747服饰禁令**：政府禁止的是特定高地男性平民服饰，**女性、王室军人等除外**；再次违法有海外流放七年的法定刑罚，实际执行案件另待原卷。
10. **1747—1752国家对土地与司法权的改造**：NRS档案目录指出《Vesting Act》查过53庄园，其中12的主张成立而未被没收；1752《Annexing Act》针对13座特定地产长期管理。1746标题的Heritable Jurisdictions法大部分取消世袭法院条款实际**1748-03-25**生效，苏格兰仍保持自己的法律制度。Fort George于1748开始建设、1769才基本建成。
11. **1782禁令废止**：高地服饰禁令的废止时间可依苏格兰国家博物馆核验，不应将1747禁令无限延长到1799。
12. **1792高地Year of the Sheep**：Ross-shire等地对地主改为大规模羊牧场的抗争，可在学术研究中查到约200参与者量级。不能把不同地主的18—19世纪清场压缩成一项1792年皇家军队驱逐全苏高地居民的事件。

## 地理位置及坐标算法可追溯

- 1715 Sheriffmuir：HES `BTL17` British National Grid `281036,702861` → WGS84 `56.203429,-3.919211`。
- 1719 Glenshiel：HES `BTL10` `199566,813704` → `57.170256,-5.316893`。
- 1746 Culloden：HES `BTL6` `273929,845126` → `57.478796,-4.104178`。
- 1745 Glenfinnan：HES `LB308`现代1814纪念碑 `190616,780575` → `56.869196,-5.437078`。NTS指出旧仪式现场可能偏北约300米，明确为后世纪念物坐标。
- 1700 Darien：直接复用17世纪发布篇中Caledonia Bay的现代宽域海湾点 `8.916667,-77.700000`，原堡墙旧址不假装实测。

全部苏格兰遗址格网由 `EPSG:27700` 以 `pyproj` 等价WGS84换算取得，校验脚本核具体数值。历史战场登记范围是研究或文化遗产保护区，不是1746英王主权国界；不将战线、庄园、海港用现代行政边界外插。

## 研究缺口

- 需要读旧17C稳定领土账确认Darien实际旧`stable_id`再自动迁移1700状态；目前账明确标为 `await_actual_17c_CONTROL_EPISODES_review`，绝不伪造ID。
- 1707同一自然年内（1月、3月、5月）发生宪制变化，项目目前的按年GIS控制状态需要未来升级为日级 `actor_transition`，不是本批修改历史行政边界的充分许可。
- 1747—52被没收庄园的逐庄原地籍与实际财产收益、1792及后来的地主清场家庭迁移名单，需要以NRS地产账和地形图逐条校验。
- 苏格兰高地与西印度殖民地之间战俘运船具体航次、盈利以及行政执行的实际数据尚未经审完整分类，禁止推算净收益。

## 质量门禁

- `node scripts/test_18c_scotland_map.js`静态校23事件、37来源、9组真实合并、17有效原归并、6归档升级、5点、19节／57段／23个正文地图链接、3个16/17C前篇与6项主体状态账。
- `python3 scripts/audit_18c_scotland_source_registry.py`读取未改原研究ZIP内的24个C来源键，`python3 scripts/test_18c_archival_integrity.py`验162/315/1126与三个原ZIP的SHA256/CRC。
- `python3 scripts/audit_spatial_semantics.py --strict`；`node --check app.js`、旧六篇的静态回归、Tudor历史地图回归。
- 真实1780×1020桌面Selenium Chromium：1746→原长篇，点1700 Darien时自动转年和平移、1719 Glenshiel准确官方地点、1745 Glenfinnan、1707法律空坐标、1747没收庄园双击独立档案再返回原文、普通模式隔离、16C Tudor网站回归，再跑六批历史网页。
- GitHub Actions在实际提交后执行，**最后验收必须以当次所有工作流的真实结论为准**，本交接不替代CI或用户正式上线批准。

## 史料入口

- [UK Parliament: Act of Union overview](https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/act-of-union-1707/)
- [UK Parliament: Economic pressure Aliens Act](https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/act-of-union-1707/overview/westminster-passes-the-alien-act-1705/)
- [UK Parliament: ratification 110/67](https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/act-of-union-1707/overview/ratification-october-1706---march-1707/)
- [UK Parliament: legal Articles](https://www.parliament.uk/globalassets/documents/heritage/articlesofunion.pdf)
- [NRS: exchequer and forfeited estates](https://www.nrscotland.gov.uk/learning-and-events/research-guides/exchequer-records/)
- [NRS: forfeited estates 1747 and annexed 1752](https://catalogue.nrscotland.gov.uk/nrsonlinecatalogue/details.aspx?reference=E738)
- [HES: Culloden battlefield BTL6](https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,BTL6)
- [HES: Sheriffmuir BTL17](https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,BTL17)
- [HES: Glenshiel BTL10](https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,BTL10)
- [NTS: Glenfinnan ceremony and site uncertainty](https://www.nts.org.uk/visit/places/glenfinnan-monument/1745-rising)
- [NMS: restrictions on Highland civilian male dress](https://www.nms.ac.uk/discover-catalogue/jacobites-and-tartan-symbolism-and-style)
- [Academic: 1792 Year of the Sheep](https://scholarcommons.sc.edu/ssl/vol46/iss1/6/)
- [NLS: The Darien Papers 1849 edited printed selection](https://deriv.nls.uk/dcn23/7878/78785290.23.pdf)

**状态：Draft研究成果。主分支未更改。**
