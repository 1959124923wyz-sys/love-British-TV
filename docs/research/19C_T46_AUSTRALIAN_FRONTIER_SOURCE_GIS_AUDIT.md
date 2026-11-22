# T46｜澳大利亚殖民土地与边疆暴力：五章史料与GIS审核（2026-11-22）

**专题** T46.1—T46.5，原卷由5章、81条研究年表、10导读、98 GIS线索、17项原始疑问、72索引来源组成。首批正式制作`editorial_review / not_submitted`，后续出版须独立编审核准。

## 本轮生产

| 维度 | GitHub数据 | 实际内容 |
| --- | --- | --- |
| 正文 | `data/stories/serial/e19-t46-australian-frontier-land-violence-1829-1897.json` | 25节75段；T46.1–T46.5全五章；1829—1897 |
| 来源 | `story.sources` | 48项，国家博物馆、英国王室殖民原令／州议会、昆士兰／南澳／西澳档案、UNESCO原住民主导申遗、Central Land Council、学术研究；每章有对应`topic_source_claims` |
| 正文导航 | `data/research/19c-t46-editorial-event-ledger.json` | 39条不同真实事件ID；10复用既有地图事件；29新事件原案号可追溯 |
| 年表 | `data/stories/serial/chronology-1820-1829.json`至1890年代 | 29条新事件分布1820s=2、1830s=8、1840s=2、1850s=1、1860s=8、1870s=5、1890s=3 |
| GIS | `data/nineteenth-century-spatial-*.geojson`（5个年代） | 16个具名地理参考Point，1条具备历史顺序关系的虚线LineString；**0历史控制区Polygon**；全部`exclude_from_area_aggregation=true` |
| 自动QA | `scripts/test_19c_t46_australian_frontier.cjs` 和 `scripts/browser_19c_t46_australian_frontier.py` | 审查全部5章史料与39链接、屠杀和土地法令、1840/1850等跨十年、正文点跳转、地图图层开关、1899连续性 |

## 已存在的地图事件：不重复生产、不重复计死

- **T46.2/Pinjarra**：`E19-WA-1834-PINJARRA-MASSACRE`，西澳总督James Stirling率军警袭击Binjareb Noongar社群；不同资料给15—80等受害口径。**不重新追加一条Pinjarra事件。**
- **T46.3/NSW**：`E19-NSW-1838-WATERLOO-CREEK`、`E19-NSW-1838-MYALL-CREEK`；补的是后续两轮审判与七人处刑，且不把七名定罪者当作受害者人数。
- **T46.3/Gippsland**：`E19-AU-1843-WARRIGAL-CREEK`、`E19-AU-1843-WARRIGAL-MOUTH`、`E19-AU-1843-GIPPSLAND-BRUTHEN-CREEK`、`E19-AU-1843-GIPPSLAND-FRESHWATER-CREEK`、`E19-AU-1843-GIPPSLAND-GAMMON-CREEK`及1844 Robinson笔录；Newcastle Group与子地点相互覆盖，数字不能累加。
- **T46.4/Hornet Bank**：`E19-QNP-1857-HORNET`已有1857年袭击；新`E19-T46-1857-HORNET-REPRISALS`是后续独立报复阶段，非同一袭击事件重复制作。

## 五章独立史实与最重要原件

### T46.1　王室授地与原住民居占权

- Stirling 1829-06-18殖民公告：[澳大利亚Founding Documents原令](https://www.foundingdocs.gov.au/resources/transcripts/wa4_doc_1829.pdf)；珀斯建城、Thomas Peel的50万英亩附条件承诺和25万英亩改批：[澳大利亚国家博物馆](https://www.nma.gov.au/defining-moments/resources/founding-of-perth)；Peel `Old Historic Plan 142`原地籍图待调，[州遗产机构](https://inherit.dplh.wa.gov.au/Public/Inventory/Details/d821986f-de08-472b-ac7c-1cf1829db6b7)。
- John Batman 1835-06-06文书为[维州图书馆馆藏原契约](https://www.slv.vic.gov.au/batman-deed-melbourne)；Richard Bourke 1835-08-26王室否认私人地契源于[官方文书](https://www.foundingdocs.gov.au/item-sdid-75.html)。**协会声称面积/条约解释和Kulin当地土地权分轨，不造私人领土面**。
- [南澳议会](https://education.parliament.sa.gov.au/learn/first-nations-history-and-the-parliament/)引1836-02-19 Letters Patent保留原住民现有居占权文字；[新州1861王室土地法规原文](https://www.foundingdocs.gov.au/resources/transcripts/nsw11_doc_1861.pdf)支持40—320英亩与押金制度；土地法规不能直接当作每块土地已经发生权利移转。

### T46.2　西澳殖民杀戮与Bunuba抗争

- [Pinjarra州遗产与地方议会](https://www.murray.wa.gov.au/places-and-spaces/pinjarra-massacre-site)及[国家博物馆Perth历史](https://www.nma.gov.au/defining-moments/resources/founding-of-perth)：1834-10-28殖民总督率军袭击Binjareb，保留各资料伤亡口径及Noongar社群回忆。
- 1868年Flying Foam由州驻地官Robert John Sholl授权两支武装行动，King Bay与Murujuga群岛相关：[UNESCO原住民主导申遗文书](https://whc.unesco.org/document/206065)、[ANU历史学研究](https://history.cass.anu.edu.au/files/docs/2024/12/ajbh_no_6.pdf)。殖民5—10名男性与1886年Gribble援引约60名男女儿童为不同口径，**绝不相加**。1869 Minderoo/Thalanyji独立于1868行动，原Sholl档`AU WA S1751`仍待调。
- Bunuba 1889—1897：[澳洲国家博物馆Jandamarra展览](https://www.nma.gov.au/exhibitions/encounters/places/west-kimberley)、[澳洲国家传记档](https://ia.anu.edu.au/biography/jandamarra-8822)、[西澳州历史遗址登记](https://inherit.dplh.wa.gov.au/public/inventory/details/4fd58261-2bfe-4b1b-9b4e-427386c93af5)。1894释放囚犯、Windjana Gorge冲突、1897-04-01死亡并非一次行动，逐年存证。

### T46.3　Waterloo、Myall、Warrigal、Rufus

- [澳大利亚国家博物馆Myall史](https://www.nma.gov.au/defining-moments/resources/myall-creek-massacre)：1838-06-10至少28名Wirrayaraay人遭杀，11-15初审全体无罪，11-29重审7人定罪，12-18处刑7人。
- 1843 Gippsland/Warrigal多节点不能被错误地计作多起完全独立屠杀；[ANU历史期刊讨论](https://press-files.anu.edu.au/downloads/press/n10914/html/01_paton_et_al.xhtml?page=5&referer=)为Robinson 1844原始档线索，仍应继续核Kulin/Gunaikurnai现存当地口述。
- 1841-08-27 Rufus River警队、牧队暴力：[Moorhouse参与者1841报告印本](https://upload.wikimedia.org/wikipedia/commons/f/f8/The_folklore%2C_manners%2C_customs%2C_and_languages_of_the_South_Australian_aborigines.pdf)与[Aboriginal History学术回顾](https://press-files.anu.edu.au/downloads/press/n2179/html/article06.xhtml?page=11&referer=)；近30人死与亲见21具遗体仅是不同证据等级，不能一起写为51人死。

### T46.4　Queensland Native Mounted Police与组织性报复

- [昆士兰州档Frontier Wars](https://blogs.archives.qld.gov.au/queensland-frontier-wars/)、[QSA原警务件选目](https://www.publications.qld.gov.au/ckan-publications-attachments-prod/resources/424a1fff-432a-4574-a89d-c025efb574be/200-frontier-wars-records-at-queensland-state-archives.pdf)及[1858年Dawson River殖民议会证言](https://aiatsis.gov.au/sites/default/files/docs/digitised_collections/remove/91884.pdf)，追查1857 Hornet Bank殖民定居者11人死与后续Yiman报复、1861 Cullin-la-Ringo定居者19人死与Nogoa等地的Gayiri报复。
- University of Newcastle历史数据库所列组估值约170（Hornet后）和109（Cullin后），均可能覆盖多个子案。殖民骑警军官及同编队原住民骑警身份必须分开标注。
- [考古警务站Boulia](https://frontierconflict.org/boulia)引1878-12-07同期报纸与Ernest Eglinton；站址在城外Burke River/Mucklandama，**本次地图点仅以昆士兰州地名数据库Boulia城区代表附近区域**，不发明警营准确GPS。

### T46.5　Barrow Creek及Kaytetye抵抗

- [Central Land Council Kaytetye传统土地权史](https://www.clc.org.au/land-won-back/)与[南澳历史信托电报线研究](https://stories.history.sa.gov.au/the-overland-telegraph-line/)分别记述1872电报站建设、水食资源压力、1874-02-22袭击及后来的警务报复，纪念碑长期遗漏原住民雇员Jemmy。
- [州档原卷GRG5/2索引](https://archives.sa.gov.au/__data/assets/pdf_file/0004/829678/GRG5_2_police-dept-correspondence_1873-1874.pdf)列1874 files230、261、461、540：逐笔搜捕与付款仍须调档核实。
- 报复遇害人数的殖民官方“11”及[学术数据库估值“约50”](https://c21ch.newcastle.edu.au/colonialmassacres/detail.php?r=700)是不同资料的系列范围；双方材料并列，不能累加。Barrow电报站地点使用[北领地公开遗产地名登记](https://www.ntlis.nt.gov.au/placenames/view.jsp?id=10659)，**报复杀戮具体位置不画点**。

## 17 GIS图元与安全边界

1. 1820s Perth现代市镇参考点1；1830s Melbourne契约相关地区、Sydney总督公告、Glenelg殖民行政、Sydney法院共4；1860s Sydney土地法、Brisbane警务、Roebourne殖民官署、UNESCO Murujuga文化景观现代中心4点另加Roebourne↔Murujuga虚线1条；1870s Barrow公开电报站三个不同年份的节点+Boulia公开城镇地区4；1890s Lillimooloora公开殖民警务遗址、Bandilngan开放峡谷、Dimalurru公开国家公园3。总16点+1线。
2. Lillimooloora遗址：西澳州遗产公示`UTM 51S E708629/N8072285`，经EPSG:32751→WGS84后四舍五入为`124.964E/-17.426N`；原地理空间仍以参考点表达，不根据现代遗址坐标定义1894年战斗范围。
3. Murujuga：UNESCO 2025世界遗产景观数据公开中心`116.6685278E/-20.5650278N`，**与1868 King Bay具体杀戮营地不一致，不能据此冒认遗骨位置**；Roebourne参考城镇→UNESCO景观中心是史料证明行动关系的虚线，只连接端点，不模拟真实进军路线。
4. Boulia：昆士兰州地名管理公布现代市镇近`139.9066E/-22.9097N`，考古研究认为1878警营位于城外约25km，未根据当代城镇GPS重画驻地；Bandilngan和Dimalurru只标公众可到访的国家公园地名，**不会标注Jandamarra死亡现场或原住民圣地**。
5. `historical_boundary_confirmed=false`、`fill_authorized=false`、`area_sqkm=null`、`exclude_from_area_aggregation=true`、`territorial_claim=false` 全部GIS图元保留；英国王室声称授地不等于真实占领整州。未核土地边界和原住民政治文化空间不凭现代州界或自制包络画Polygon。

## 原卷仍需调取与改进

- C86 Acc36／1829—1832原地契、Old Historic Plan142与Whadjuk／Noongar地方资料，比较实际产权面积；
- C-X21 Batman契约与Wurundjeri/Kulin社群对仪式的原生解释；1835官令本身仅能说明王室政策；
- C37／C41 西澳SRO `AU WA S1751`和地区长者原口述，区分Flying Foam多地行动与Minderoo；
- C23 Gippsland系案保护官Robinson 1844日记、Gunaikurnai机构批准的公开历史地名；
- C51 QSA `ITM3681985—1988`、`ITM3682012`及1858调查原证，查军官和私人队伍的同与异；
- C68 南澳 `GRG5/2` 1874 files230/261/461/540原信，区分Jemmy两种早期命运记述和警队真实施害数；
- C73 Bunuba地方机构公开许可历史场址、WA警务站原卷与Jandamarra尸体处理登记；未经许可不细画墓址与禁忌地。

**责任状态：** 本文件支持编审预览及CI审查，不能将未得原档直接写成完全通过史料发表审核；审查通过、GitHub Pages部署并取得主编批准后再修改`published_new`。
