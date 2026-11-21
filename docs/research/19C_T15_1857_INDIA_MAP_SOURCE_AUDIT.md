# 19世纪 R1 · T15 印度1857年起义、英军报复与殖民惩罚｜首轮专题、GIS及编审记录

2026-11-21 · 制作分支 `feat/19c-t15-india-rebellion-map-20261121` · 对应 [跨对话Issue #499](https://github.com/1959124923wyz-sys/love-British-TV/issues/499)

## 范围和结果

这次是 **T15.1/T15.2 的同一篇贯通长篇**，沿恒河军事镇压—德里和坎普尔城市暴力—阿杰纳拉战俘—詹西英军攻城—安达曼囚运和岛民反抗展开。新写8节、24段，34个自然语言事件内链。该史实专题仍经 `editorial_review/not_submitted` 门禁管理。

文件：
- `data/stories/serial/e19-t15-indian-uprising-reprisals-1857-1859.json`（全文、节级来源矩阵、相关长篇）
- `data/stories/serial/index.json`（总专题注册及事件入口）
- `data/stories/serial/chronology-1850-1859.json`（8条新事件）
- `data/nineteenth-century-spatial-1850-1859.geojson`（3个新具名点、2条虚线行动关系）

## 史料分级与逐项证据

| 地点、事件 | 正式新增ID（去掉公共前缀 `E19-T15-`） | 原案/节点 | 核查状态与来源 |
| --- | --- | --- | --- |
| 1857-06-04 贝拿勒斯缴械冲突 | 1857-BANARAS-DISARM | B45-E02；B45-S01/S03 | Kaye & Malleson英军史Book V ch.1（后期英方编纂，需持续交叉核） |
| 1857-07-06 阿拉哈巴德来信所述烧村 | 1857-ALLAHABAD-LETTER | B45-E03；B45-S02 | Hansard下院1858-02-08 cc.905–908，含被烧十座当时空村，具体村名及焚毁日未确定 |
| 1857-07-13 贝拿勒斯来信记多比 | 1857-BANARAS-LETTER | B45-E04；B45-S02 | 同次英国议会转引地方来信，Dobee具体地块未确定 |
| 1857-07-22 阿拉哈巴德来信追述6月22日夺畜申诉 | 1857-ALLAHABAD-PLUNDER | B45-E03/E04之同卷补充 | Hansard记穆罕默德·塔基羊群被铁路人员和武装随从夺走并获归还；7月22日是报告日期，6月22日是当事人申诉日期 |
| 1857年6月 詹西避难者与仆人遇害 | 1857-JHANSI-JUNE | B46-E01；B46-S01–S03 | National Army Museum馆藏、军史；王后参与程度仍有不同论证 |
| 1858-03-24起 詹西围城 | 1858-JHANSI-SIEGE | B46-E02 | National Army Museum 3月24日年表 |
| 1858-04-03 詹西攻城和掠夺 | 1858-JHANSI-STORM | B46-E03 | National Army Museum 4月3日年表，印度国家古迹管理局古堡定位 |
| 1858-04-03后 城中杀戮与见证 | 1858-JHANSI-AFTERMATH | B46-E04 | Thomas Lowe原书pp.259–262；Godse译介二手转引；双方对象与估数不一致 |

英议会原文：https://api.parliament.uk/historic-hansard/commons/1858/feb/08/vote-of-thanks-to-the-civil-service-army

英陆军博物馆：https://www.nam.ac.uk/explore/decisive-events-indian-mutiny

印度国家古迹管理局：https://www.nma.gov.in/showfile.php?lang=2&level=2&lid=2021&ls_id=1631&nma_type=0 ，第35页第3.1节给出古堡坐标北纬25°27′28″、东经78°34′32″（十进制度 25.45778, 78.57556）。该文献中2025年受保护古迹边界**没有**被移植成1858年军事管辖区。

## 五个GIS图元逐项审查

| 稳定ID | 图元、年份 | 事实和局限 |
| --- | --- | --- |
| `t15-benares-1857` | Point，1857 | 现地瓦拉纳西城市参考点；无证第37团营舍古外缘及Dobee旧地块 |
| `t15-allahabad-letters-1857` | Point，1857 | 阿拉哈巴德城市参考点；议会未列出烧村村名，不补画十个假坐标 |
| `t15-jhansi-fort-1857-1858` | Point，1857—1858 | 采用印度政府古迹坐标；原堡位置与1857年遇害地点、1858年攻城突破点分开 |
| `t15-neill-benares-allahabad-1857` | LineString，1857 | 军事移动城市顺序关系，虚线；没有取现代公路作为1857年确切行军路径 |
| `t15-calcutta-portblair-convicts-1858` | LineString，1858 | 文献已证加尔各答出航和布莱尔港登陆，虚线关联；航迹转折点未核，不编造海上GPS |

所有新几何：`historical_boundary_confirmed:false`、`fill_authorized:false`、`territorial_claim:false`、`area_sqkm:null`、`exclude_from_area_aggregation:true`。本批**没有虚构英国控制Polygon和历史面积**。此前德里、坎普尔、阿杰纳拉及布莱尔港等已登记空间元素保留并复用，不重复改写、扩色或删去旧内容。

## 正式资料反查和下一次目标

- T15.1：B05/B45/B46旧案的现地图事件—来源关系已去重；新补8事件、詹西古堡点与贝拿勒斯/阿拉哈巴德点。核 **IOR/H/726 pp.241–300** 里Neill/Renaud来往、烧村具名名单；查Godse马拉地原稿及Lowe pp.259–262；查1858占城后的当地墓葬/财产台账。
- T15.2：B18安达曼32已有事件逐项复用；只增一条加尔各答—布莱尔港囚运有据端点线。原住民抵抗记录不得用囚犯和殖民当局单方数字替代岛民死亡统计。
- 发布前执行 `node scripts/test_19c_t15_topic_map.cjs`、`python3 research/19c/consolidated/verify.py`、`verify_handoff.py`、`python3 scripts/audit_spatial_semantics.py --strict` 及公共文案静态/桌面Chrome门禁、Pages线上验收。

首批完成后，其他R1专题为T26鸦片战争、T37马格达拉掠夺、T46澳洲边疆暴力；以GitHub工作板和Issue #499为续作源。

## GitHub主分支合并与桌面验收（2026-11-21）

- [PR #501](https://github.com/1959124923wyz-sys/love-British-TV/pull/501) 已合并：`9be6c54facd485197155edbc80eccf0d36efa967`，合并前34/34项GitHub Actions绿灯。
- [T15专项桌面Chrome证据](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44921690991)：1857起点事件→8节长文→单击1858詹西攻城，年份1858、地图中心25.45778N 78.57556E、正文保留，截图以workflow artifacts归档。
- [Pages构建及部署](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44922027446) 成功。入口：<https://1959124923wyz-sys.github.io/love-British-TV/?review19c=1&year=1857>。
- 编审状态保留 `editorial_review/not_submitted`，即新专题可通过19C预览入口阅读，尚未提升为已获最终史料批准的正式文章。地图事件和GIS代码已进入主分支。
