# 第 5AC 批｜NPS独立战争测绘战场与阿卡迪亚1755年驱逐地理

2026-11-21，主编37，基线 `2092899b2d41a9302dad867c8e33537319d38ae0`，接续第5AB批/#484和修复/#485。本批归档退出 **33条十八世纪旧矩形**，全世纪余 **84→51** 条；1799年仍显 **22→22** 条。原始bbox、年份、source_urls、note、源档案和各代理点保留，统一 `superseded_by`，不删除任何历史研究内容。

## 史料和几何

- **19组真实官方战场研究区多边形**：NPS美国战场保护计划（ABPP）独立战争实测 `Revolutionary War Battlefield Boundary` FeatureServer 7，原来源美国公园局向国会呈送的2007年研究，网服2025年更新。含约克镇、卡姆登、瓦克斯霍斯、悬岩、马斯格罗夫、国王山、考彭斯、吉尔福德法院、尤托斯普林斯、布兰迪万、萨拉托加三战场、斯托尼角、九十六镇、奥古斯塔两研究区及布莱克斯托克。源字段 `OBJECTID_12`、`SITE`、`NAME`、`STATE`、`WAR`、`BOUNDARY=STUDY AREA` 与官方英亩数存入史料层，不作为英国殖民占地面积。源多边形只做0.00015°的RDP折点删减，未绘制人为圆形、凸包或旧bbox套壳；各图元仍用虚线标记历史边线解释上的不确定性。[NPS ABPP地图](https://www.nps.gov/orgs/2287/battlefield-boundaries-map.htm) · [ArcGIS原始向量](https://services1.arcgis.com/fBc8EJBxQRMcHlei/ArcGIS/rest/services/ABPP_BattlefieldBndry_Update_gdb/FeatureServer/7) · [GitHub官方源抓取工作流](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44881743608)
- **3组其他历史/战场区**：1780年卡姆登和九十六镇两处官方研究区组合；1781年九十六镇、尤托斯普林斯、奥古斯塔三个不连续的真实地点组合；已有十八世纪历史地图配准的博塞茹尔／坎伯兰堡主堡墙。分别只是分离的堡垒／战事地点，从不以一条虚构运输路线相连。
- **5组真实自然曲线**：阿卡迪亚潮汐湾岸（161折点）、南卡海岸（50折点）、萨凡纳河（29折点）、科罗曼德尔海岸（136折点）、马拉巴尔海岸（35折点）。来源Natural Earth 1:50m，保留相邻原节点，截取时不补造穿海连线。自然地理用于交代战场、港区与河谷，没有冒充十八世纪行政边界。[Natural Earth海岸](https://github.com/martynafford/natural-earth-geojson/blob/master/50m/physical/ne_50m_coastline.json) · [河流](https://github.com/martynafford/natural-earth-geojson/blob/master/50m/physical/ne_50m_rivers_lake_centerlines.json)
- **11处具名地点**：加拿大大普雷（联合国教科文组织登记点）、安纳波利斯Fort Anne、南部战役五座现代可辨聚落、万迪瓦什、1780年波利卢尔、波尔图诺伏、波纳尼。名称、位置及年代相互核证；不能把现代市镇几何推断成当年堡墙或交战面积。
- **南印度军事史图**：皇家收藏 [RCIN 733001，1760万迪瓦什](https://militarymaps.rct.uk/other-18th/19th-century-conflicts/map-of-the-battle-of-wandiwash-1760-vandavasi-tamil-nadu-india-12deg3015n-79deg3620e) 和 [RCIN 734061.2.a，1781波尔图诺伏](https://militarymaps.rct.uk/other-18th/19th-century-conflicts/map-of-the-battle-of-porto-novo-1781-parangipettai-tamil-nadu-india-11deg2859n-79deg4600e) 直接提供地点和精确日期。1780波利卢尔败战采用[FIBIS的1780战地记录](https://wiki.fibis.org/w/Battle_of_Pollilore_1780)，与[皇家收藏1781年第二次波利卢尔战役](https://militarymaps.rct.uk/other-18th/19th-century-conflicts/map-of-the-battle-of-pollilur-1781-pollilur-near-kanchipuram-tamil-nadu-india-12deg5000n-79deg4300e)分开。原英公司与迈索尔战争的大区域无法作为实测控制范围，继续留档。
- **阿卡迪亚驱逐**：加拿大公园局记录1755年在大普雷Les Mines驱逐约2,200人、皮西吉德爱德华堡约1,200人，坎伯兰堡则是强制集中拘押和迁运的一处军事中心。三地、河湾和堡墙分离，避免编造完整驱逐区地籍。资料：[Grand-Pré](https://parks.canada.ca/lhn-nhs/ns/grandpre/culture/histoire-history) · [Fort Beauséjour/Cumberland](https://www.parks.canada.ca/lhn-nhs/nb/beausejour/culture/histoire-history/deportation) · [Fort Anne](https://parks.canada.ca/lhn-nhs/ns/fortanne/culture/histoire-history)。

## 原始旧框和替代ID

| 原记录 | 第5AC新图元 |
|---|---|
| `B36-Z040` | `EDITOR37_5AC_ABPP_7` |
| `B36-Z041` | `EDITOR37_5AC_ABPP_30` |
| `B36-Z042` | `EDITOR37_5AC_ABPP_69` |
| `B36-Z043` | `EDITOR37_5AC_ABPP_45` |
| `B38-S-Z018` | `EDITOR37_5AC_ABPP_140` |
| `B38-S-Z023` | `EDITOR37_5AC_ABPP_32` |
| `B38-S-Z025` | `EDITOR37_5AC_ABPP_31` |
| `B38-S-Z027` | `EDITOR37_5AC_ABPP_29` |
| `B38-S-Z028` | `EDITOR37_5AC_ABPP_28` |
| `B38-S-Z029` | `EDITOR37_5AC_ABPP_23` |
| `B38-S-Z030` | `EDITOR37_5AC_ABPP_112` |
| `B38-S-Z032` | `EDITOR37_5AC_ABPP_19` |
| `B38-S-Z039` | `EDITOR37_5AC_ABPP_7` |
| `B38-S-Z042` | `EDITOR37_5AC_ABPP_8` |
| `B38-S-Z019` | `EDITOR37_5AC_CAMDEN_NINETY_SIX_NODES` |
| `B38-S-Z020` | `EDITOR37_5AC_SC_1781_BATTLE_NODES` |
| `B36-Z004` | `EDITOR37_5AC_GRAND_PRE` |
| `B36-Z005` | `EDITOR37_5AC_FORT_CUMBERLAND_CHIGNECTO` |
| `B36-Z006` | `EDITOR37_5AC_ANNAPOLIS_FORT_ANNE` |
| `B36-Z007` | `EDITOR37_5AC_ACADIAN_TIDAL_SHORE` |
| `B38-S-Z036` | `EDITOR37_5AC_SC_ATLANTIC_COAST` |
| `B38-S-Z021` | `EDITOR37_5AC_MONCKS_CORNER` |
| `B38-S-Z037` | `EDITOR37_5AC_CHARLOTTE` |
| `B38-S-Z040` | `EDITOR37_5AC_GLOUCESTER_POINT` |
| `B38-S-Z041` | `EDITOR37_5AC_WILLIAMSBURG` |
| `B38-S-Z043` | `EDITOR37_5AC_CHARLOTTESVILLE` |
| `B36-Z052` | `EDITOR37_5AC_WANDIWASH` |
| `B38-I-Z017` | `EDITOR37_5AC_WANDIWASH` |
| `B36-Z054` | `EDITOR37_5AC_POLLILUR_1780` |
| `B38-I-Z026` | `EDITOR37_5AC_POLLILUR_1780` |
| `B36-Z055` | `EDITOR37_5AC_PORTO_NOVO` |
| `B38-I-Z027` | `EDITOR37_5AC_PORTO_NOVO` |
| `B36-Z056` | `EDITOR37_5AC_PONNANI` |

上表的同一新ID可以承接多条同期档案。细颗粒度的原年份阶段仍在原始JSON中，读者地图的正式区域档案有更早已验收的专项点击入口时，保持旧入口的点击优先权。NPS研究区域显示在低于既有18C历史据点的地图面板，不屏蔽原叠压史料。

## 余项与下任5AD建议

第5AC完成后尚有 **51条**十八世纪旧参考矩形，其中1799年 **22条**。剩余重点为1759—1760后各国条约范围、1763北美公告线、英属伯利兹采木条款、尼扎姆/迈索尔财政边线、约克厂贸易运输和南卡部分尚未配准的骑兵、渡河及补给路线。应优先读取同时期军用图、土地契据、河谷旧图，不能凭战役点外推占领县界。旧大框与无法核实的商业路线继续留待核查。

第5AC文件包括 `data/eighteenth-century-editor37-5ac-surveyed-geography.geojson`、`js/eighteenth-editor37-5ac-battlefields.js`、`scripts/test_editor37_5ac_source_battlefields.js`、`scripts/browser_editor37_5ac_source_battlefields.cjs` 及独立CI。原源抓取脚本 `scripts/research_editor37_5ac_nps_abpp_probe.py` 保留于本分支，后继人员可按官方图层更新校准。严禁读者页面显示编审和精度说明；这些留在此研究档案。

## 战场多环审查与公共史实正文（5AC校订）

2026-11-21在主分支前QA发现测试代码原将全部坐标环展平后比对第一和最后一个点，误判NPS官方约克镇、格林斯普林及萨拉托加多环Polygon/MultiPolygon。现改为**逐独立ring检查坐标闭合与折点数**，同时保留官方的洞孔/不连续多边形信息；19个NPS全部原形源结构有效。战场公共档案的简介以独立战争的具体参战方、行动和结果为正文；官方ABPP研究范围性质、调查方法和RDP简化等仅在此研究档案和机器属性保存。
