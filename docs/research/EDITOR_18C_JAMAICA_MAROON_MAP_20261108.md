# 爱英TV｜第三批18世纪互动历史地图：牙买加马龙战争、奴役政策与1796放逐

日期：2026-11-08｜分支：`map/18c-jamaica-maroon-exile-20261108`｜**状态：独立18世纪研究试阅，未合并正式网站**

## 一、按16世纪与前两任主编已验证方法制作

本批承接17世纪正式专题 `E6-T08`，维持**同一长期历史进程**，不把1700年当作马龙社群自治和殖民地奴役法律的终点。以`research/18c/consolidated/series/T03.json`与`T04.json`初筛数据为基础，重组相近时间/区域反复发生的攻防与法令细节，形成**17件具年历史事件、16节完整中文长篇／48段正文、17个自然语言地图事件链接、18项有阅读层级的来源**。

- 主地图优先候审10件；专题及正文附属7件。
- **只有5个具名现代参考地点的事件**拥有经纬度，另外12件保留`lat:null/lng:null`，不为条约签署地、Nanny Town古山寨、Trelawny Town、跨岛法令或海上流放航线乱猜GPS。
- 另建`data/eighteenth-century-jamaica-maroon-autonomy-cores-1739-1799.geojson`，只有**2个表示Accompong与Moore Town政治自主的现代地点参考Point**。这两处都**不是英国驻军或领土征服面**；采用不同于欧洲殖民控制的绿青虚线圆形符号；`area_sqkm:null`、`fill_authorized:false`。
- 使用现有`app.js`的逐年时间轴、17C地图镜头和聚合逻辑，以及`js/history-stories.js`的`[[真实事件ID|自然语言动作]]`、单击切年平移、双击史实档案及返回路径。
- 未改`data/stories/serial/index.json`、`data/chapters.json`或原17世纪`E6-T08`稿；只有`?review18c=1`开启试阅。原17C读者可在试阅模式从`E6-T08`跳到本篇，正式用户不见第三批稿。

## 二、史料核查及最关键的历史细节

| 年份 | 重要过程 | 来源与争议/空间控制 |
|---|---|---|
| 1718 | 议会赏金搜捕、处决与夺取被俘年幼者 | [UNB完整原法转录](https://slaveryandfreedomlaws.lib.unb.ca/node/324)；编录具体日标为**Inexact**，不造1月1日历史史实 |
| 1730年代 | 第一次马龙战争长期山地攻防 | [Jamaica National Library](https://www.nlj.gov.jm/history-notes/The%20Maroons%20edited%20final.htm)、[Historic England](https://historicengland.org.uk/research/inclusive-heritage/the-slave-trade-and-abolition/time-line/)；口述史可溯更早年，1730并非唯一开战日 |
| 1734 | 殖民军夺取Nanny Town但Windward未被歼灭 | 牙买加国家图书馆与[JIS Nanny人物志](https://jis.gov.jm/heroes/nanny-of-the-maroons/)；**古寨无可靠精测GPS，事件在年表可读，地图点留空** |
| 1739-03-01 | Cudjoe的Leeward Maroons和约、1500英亩**条约法理面积** | 国家图书馆重印条约全文；土地文字不是已经审核的历史GIS外轮廓 |
| 1739-12-23 | Quao率Windward Maroons另签独立条约 | 牙买加国家图书馆；不得把两个马龙政治社群当英国直接管理的一个统一省份 |
| 约1740 | Nanny另行达成安排并关联今Moore Town | [牙买加国家遗产信托](https://www.jnht.gov.jm/site_moore_town.php)和[Getty TGN](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=&place=&subjectid=7018598)；现代村位置不是古时签署地点 |
| 1760-04 | Tacky领导St Mary被奴役者起义并扩散 | [牙买加JIS教区史](https://jis.gov.jm/information/parish-profiles/parish-profile-st-mary/)；Port Maria仅为现代区域点，非当年庄园战场GPS |
| 1760-12-18 | 殖民议会立法限制被奴役者通行、武器、集会、Obeah及自由黑人身份证明 | [UNB 1760完整法文](https://slaveryandfreedomlaws.lib.unb.ca/laws/jamaica-1760)；明确属国家层面制度性控制 |
| 1769/1770 | 修订马龙抓回逃亡奴役者的赏金制度 | [UNB 1769法文](https://slaveryandfreedomlaws.lib.unb.ca/laws/jamaica-1769)；**1769年立法、1770年3月1日部分条款生效**须分开 |
| 1788 | 马龙城镇白人监督员、处罚和可能重新奴役的法律，另有一般奴役法律整编 | [UNB马龙城镇法](https://slaveryandfreedomlaws.lib.unb.ca/laws/jamaica-1788-0)及[奴役法整编](https://slaveryandfreedomlaws.lib.unb.ca/laws/jamaica-1788)，后者1789年1月1日生效 |
| 1795—1796 | 第二次马龙战争，以**Trelawny Town**为主的冲突 | [Parks Canada国家历史事件](https://parks.canada.ca/culture/designation/evenement-event/marrons-maroons)；Accompong、Moore Town不得自动被归同一战役阵营 |
| 1796-04 | Trelawny马龙**约150家庭、500余人**被强制送离牙买加 | 加拿大公园局；禁捏造出港地、逐船人数组或真实航线 |
| 1796-07 | 同一批流放者抵达Halifax，后来被要求参与殖民工事劳动，逐步迁至Preston | [Halifax Citadel国家历史遗址](https://www.parks.canada.ca/lhn-nhs/ns/halifax/culture/histoire-history/marrons-maroons)；**四月离岛与七月抵达不是两批人，不能重复统计** |

当时马龙社区已经获得特定法定自由，其在Halifax受到的低工资、劳动强制压力和宗教同化不能一概写成“同一批人在1796年被重新贩卖为奴隶”。加拿大公园局记录他们主动抗议，后于**1800年迁往塞拉利昂**；1800属于直接跨入19世纪的后篇，不能把1840年前史或未来航程反填到1799年。

## 三、空间与历史主体标准

`E6-T08`的1655—1699年原始奴役制度与山区马龙抵抗历史有独立身份。本篇延续同一系列，1707年后的政府称为英属牙买加当局，而具体殖民民兵、总督、议会、奴役种植园主、Windward、Leeward、Trelawny、Accompong、Moore Town应保留具体行为主体。

现代Accompong坐标来自美国NGA地名资料转录；Moore Town坐标来自Getty TGN；Port Maria属于今St Mary教区首府；Halifax Citadel属于加拿大公园局的现代纪念遗址位置。圆形在画面上以固定屏幕像素符号呈现，不得计算历史实际土地面积；**未批英国实控Polygon数量为0**。海上流放路线没有可证每次登陆、转向和航行时间节点，故`routes:[]`。地理上缺失的资料保留为`null`而不是任意城市中心或假边线。

## 四、其他同事接棒

- **档案深挖**：核1739原本条约签署与马龙领地历史边线；查1718奖励的实际执行账；1788处罚具体适用案例；1795—1796战事的殖民军令和Maroon参与者口述史；1796被放逐者逐船名册、死亡日期和Preston真实配地。
- **出版前必须检查**：地图1718法令不显示虚构日、1739的两份条约严格区分；1738/1739/1740两处马龙自治点按有据时间出现；1795 Trelawny战争不清除Accompong和Moore Town；1796 April/July人口不得求和；旧17C源篇与本稿双向可读。
- **下一世纪延续**：1800年迁往塞拉利昂和后续身份仍属同一流放历史，不预先分配未注册正式专题ID。
- **验收脚本**：`node scripts/test_18c_jamaica_maroon_map.js`、前两批合同检查、`python3 scripts/audit_spatial_semantics.py --strict`和`scripts/browser_18c_jamaica_maroon.py`的桌面Chromium截图。适配本分支审核页`?review18c=1&year=1796`。

**状态门禁**：未具经审核历史控制边界、未形成完整18C逐年控制台账与正式主编批准前，本批保持Draft PR与research_only；不修改`main`、不谎称已经通过上线验收。
