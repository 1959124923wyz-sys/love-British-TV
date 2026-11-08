# 主编16｜18世纪第四批：大西洋奴役贸易、Zong杀戮与英国保险法律互动地图（2026-11-08）

**开发状态：研究试阅 / 待历史审查。上游PR #292；独立分支 `map/18c-atlantic-zong-insurance-20261108`；不得合并生产 `main`。**

## 1. 成果与接棒关系

- 主题：**T01+T02**，跨世纪链接已发表17世纪 `E6-T11-VOYAGES`（航次、抵抗与数值史料）；沿袭前三批阿卡迪亚、孟加拉和牙买加源码及已有 `?review18c=1` 地图。
- 年表：`data/stories/serial/chronology-preview-atlantic-zong-1700-1799.json`。14件1700—1799内具年候审事实（1711–1792）；23项机构、大学档案、法令重印及专业史料目录。
- 长篇：`data/stories/serial/e18-t01-t02-atlantic-zong-1711-1799.json`。15节／45段中文正文，14个已登记的 `[[E18C-ATL-*|自然语言行动]]` 内链。长系列叙事到1799年，**最新独立年代节点为1792年**，不为1793–1799无据年份伪造事实。
- 研究筛选：追溯 `research/18c/consolidated/series/T01.json` 和 `T02.json`。对应原 `E18-MRG-T01-01`、`T01-03`、`T01-04`、`T01-06`、`T01-07` 与 `T02-03`。此处原合并组ID仍非正式已审Atlas ID。
- 已更新 `preview-18c-index.json` 保留前三篇并增加第四篇；仅 `?review18c=1` 加载；17C真实已发表内容不改，普通网站最高可读年份与 `data/chapters.json` 不变。
- 前端沿用 `app.js` 统一历史年轴与原Leaflet地图、`js/history-stories.js` 正文跨年跳转／单击定位／双击档案／原专题返回，无独立示意网页及额外手机端。
- 历史点：仅旧英国议会Westminster现代机构、Guildhall历史法庭建筑、Black River今日城镇等具名地点的**现代参考坐标**；Zong船上杀人海域、Sally船上反抗地点及跨洋航路均 **`lat:null`**。新增殖民实控Polygon **0**，伪GPS航线 **0**。

## 2. 事件与来源核对矩阵

| 时间 | 审查对象 | 主要依据 | 归责／地图限定 |
|---|---|---|---|
| 1711 | 南海公司国债/贸易金融计划 | Bank of England、University of London South Sea archives（A01–03） | 1711是公司成立，1713才取得Asiento |
| 1713 | 《乌得勒支和约》、向西班牙美洲供给被奴役人口的Asiento特许 | Bank of England Museum（A01）、Senate House档案目录（A02） | 商业供应权，不是西班牙美洲的英国直接主权 |
| 1720 | 南海公司股票泡沫 | 大学档案及英格兰银行馆藏（A01/A03） | 股价损失≠贩卖人口所得或战争赔款 |
| 1750 | 非洲贸易法及Company of Merchants Trading to Africa | 史密森尼NMAAHC保留的法案印本（A04） | 法律要求与真实执行、非洲主权区别 |
| 1765 | `Sally`号船上反抗 | Brown University数字化航程账册与展陈（A05/A06/A22） | 8人当场死亡／2人后来死于伤，**109是全航次损失不是起义死亡**；船上地点未知 |
| 1772 | Somerset v Stewart | English Heritage及英国议会（A07/A08） | 法院禁止强行运出Somerset，不是英属殖民地全面废奴 |
| 1781 | Zong海上杀人及Black River抵港 | London Museum、Royal Museums Greenwich馆藏Walvin书目、Insurance Museum、牙买加Gleaner（A09–A13） | 约130／132／133不同陈述分开；杀戮海域无证GPS；抵港点不当杀人现场 |
| 1783 | Guildhall保险索赔初审、复审争论 | London Museum与Insurance Museum（A09/A11） | 初审支持船东不等于最终赔付；无确证重审；**不存在本案船员谋杀罪判决** |
| 1783 | Equiano向Sharp通报，舆论与法律倡议 | Walvin公开书籍节录等二次研究（A15/A09） | 没有宣称亲读Sharp手稿 |
| 1787 | 反奴隶贸易全国动员社团 | UK Parliament（A16/A17） | 反抗及废奴倡导者具有主动作用 |
| 1788 | Dolben法限制英籍运奴船人数 | UK Parliament及1788法案转写（A16/A18/A19） | 规制运输而非禁贸，按原法启运日期 |
| 1789 | 运奴船规制后续延长及修订 | 29 Geo III c.66重印（A20） | 不得写作1789年废奴 |
| 1792 | 渐进废奴决议未落实法律 | 英国议会1804/1806年回顾性辩论（A21/A23） | 1807禁贸应放下一世纪，不倒填 |

### 关键史料链接
- [Bank of England: museum guide](https://www.bankofengland.co.uk/-/media/boe/files/museum/slavery-and-the-bank-large-print-guide)
- [Smithsonian NMAAHC: 1750 Africa trade Act](https://nmaahc.si.edu/object/nmaahc_2019.28.2)
- [Brown University: Sally voyage timeline](https://cds.library.brown.edu/projects/sally/timeline.html)
- [English Heritage: Somerset case](https://www.english-heritage.org.uk/visit/places/kenwood/history-stories-kenwood/somerset-case/)
- [London Museum: Zong massacre/trial](https://www.londonmuseum.org.uk/collections/london-stories/zong-massacre-trial/)
- [Royal Museums Greenwich Walvin catalogue](https://www.rmg.co.uk/collections/library/rmgl-152984)
- [Insurance Museum: Zong case](https://insurance.museum/history-article-the-zong-massacre-1781-an-insurers-perspective)
- [UK Parliament: first parliamentary debates](https://www.parliament.uk/about/living-heritage/transformingsociety/tradeindustry/slavetrade/overview/the-first-parliamentary-debates/)
- [British statute excerpt: Dolben 1788](https://cyh.rrchnm.org/primary-sources/146.html)
- [Hansard 1804 retrospective](https://hansard.parliament.uk/Commons/1804-05-30/debates/6bdbb9e5-921c-424f-b156-a432f339a591/CommonsChamber)

以上部分为网络公开史料和专业机构整理文本，**没有取得并逐叶读完所有当年的法庭原卷、船长航海手稿、公司TNA董事会会计账册**。原件目录、原始法令节录、书目与史学转述在JSON中分层，不以多条同源报道充当完全独立交叉验证。

## 3. 历史地图语义及可读性验收

1. 不创造Zong大洋GPS、不把1781年牙买加抵达地点变成杀戮案发地，不用连接港口的直线冒充船舶真实航迹。
2. 现有参考点是可点击/可切年/可回文章的现代命名设施；没有据此新增英国境外实控Polygon，也不宣称西班牙殖民地因Asiento归英国。
3. 所有按年展现的独立法律、航次、法庭过程只在实际有据的年出现，长期专题本身可跨多个十年阅读。
4. 18C研究采用旧16/17C同一个Leaflet地图、事件聚合与专题长文阅读器；普通公开页面不载入这些候审事件。
5. 对少数没有唯一可核位置的立法、金融与集体行动采用空坐标；文章单击显示有据年份与概要，双击进入原事件资料，避免用错误坐标诱发镜头跳跃。

## 4. 代码与QA

- 静态：`node scripts/test_18c_atlantic_zong_map.js`，连同上三批合同检测与 `node --check app.js`、`node --check js/history-stories.js`。
- GIS：`python3 scripts/audit_spatial_semantics.py --strict`。
- 真实桌面浏览器：`python3 scripts/browser_18c_atlantic_zong.py`（1780×1020），1750—1792年节点与1781/1783跨年、Article↔Dossier双击返回、世界地图聚合、历史底图年份与非试阅网站隔离；老阿卡迪亚、孟加拉、牙买加真实浏览器回归继续执行。
- GitHub独立工作流：`.github/workflows/18c-atlantic-zong-map.yml`，截图在Actions Artifacts归档。本交接写入不表示工作流已成功，需以本PR最新提交CI为准。

## 5. 下一任待办

- 原1850年代以前皇家非洲公司/南海公司准确航次数据、Asiento人数与贸易利润：取得制度合同、账册与具体分母再考虑量化表。
- Zong：尽可能追查 `Gregson v Gilbert`的法庭笔录、当时保险索赔文件及1781年前后的原船证据；避免诉讼终局过度简化。
- 给1781年Black River以及1783 Guildhall核现代地点参考点的精度；Guildhall建筑中心不是当时具体审判室GPS。
- 经逐条审核后，将T01/T02初版拓展成更完整的18C奴役贸易统计和地方反抗专题；现14条节点只代表**本批选定的重大历史转折**，并非全部英船贸易或全部被奴役者反抗。
- 所有真实控制区仍需与1699→1700跨年政治状态台账独立复核，不以研究时间轴代替年末主权状态。

**禁止自动出版，保持Draft直到严格空间审查、史料审核与真实桌面测试可复核。**
