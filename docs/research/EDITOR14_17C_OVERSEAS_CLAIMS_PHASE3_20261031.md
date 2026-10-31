# 主编14｜17世纪海外殖民声索着色第三批：六个跨洋地点（2026-10-31）

## 一、交付概况
在主编13/编辑23第一批14块及主编14第二批12块基础上，本次追加六个有史料对应的17世纪海外殖民据点和法律声索示意面，合计 **32块**。数据文件：`data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson`，回归测试：`scripts/test_editor23_expansive_17c_claims.js`。本轮亦将仓库首页过时的“17世纪专题尚未正式发表”描述更新为真实的**29篇published、7篇research_only**，但严守十个正式章号尚未扩充的区别。

所有色块均为可关闭、按年份显示的**宏观视觉参考**，不是历史实测边界或已确证军政实控面。现有`area_sqkm:null`、`territorial_claim:false`、`boundary_verified:false`、`historical_boundary_confirmed:false`、`fill_authorized:false`、`expansive_claim_overlay_only:true`、`exclude_from_area_aggregation:true`等属性一律保留。年代事件在原Atlas不受改动；岛群和堡垒周围概略矩形可能含水域或自治地区，绝不能作为英属海域或非洲、亚洲大陆主权面积。

## 二、逐项审核和出版禁忌

| 独立数据ID | 显示年份（均含首尾） | 历史证据与制图限制 |
| --- | --- | --- |
| `claim-surinam-willoughbyland-1650` | 1650—1666 | 1650/1651英格兰居民建立苏里南殖民据点，1663年领主特许。1667年荷军攻取、10月英军反夺，1668年4月前荷兰再控。**图层不在1667—1668直接涂成英国稳定统治**；该年换旗由正式事件、专题记录。资料：[Journal of British Studies研究（脚注8、61）](https://www.cambridge.org/core/journals/journal-of-british-studies/article/abs/left-behind-subjecthood-nationality-and-the-status-of-jews-after-the-loss-of-english-surinam/0825CCCDCE13530139601CE6032B1392)；[跨国殖民史研究](https://www.tandfonline.com/doi/full/10.1080/03096564.2019.1616141)。 |
| `claim-providence-island-1630` | 1630—1640 | 1630清教徒公司殖民今普罗维登西亚岛，1641为西班牙军队攻取，故不将1641年末染色。资料：[牛津国家人物传记·公司（1630–1641）](https://academic.oup.com/oxford-dictionary-of-national-biography/reference/63486/reference-article-abstract/581795119)；[Karen Ordahl Kupperman，剑桥大学出版社著作](https://www.cambridge.org/core/books/abs/providence-island-16301641/providence-island-company-and-its-colony-the-program/286208AFED06439921A3752C04DE44B7)。 |
| `claim-tangier-english-garrison-1662` | 1662—1683 | 葡萄牙婚约为移交依据，英军1662进驻，1684撤军；地图仅标城市与港口宏观范围，不得着色为摩洛哥内陆英国统治。资料：[堪萨斯大学肯尼斯·斯宾塞研究图书馆·1662—1670年代英属丹吉尔财务行政档案](https://archives.lib.ku.edu/repositories/3/resources/4365)。 |
| `claim-cape-coast-castle-1665` | 1665—1699 | 加纳博物馆与古迹委员会记录1665年英舰队夺取城堡；只承认城堡和邻近贸易设施，**不代表英国征服黄金海岸或阿肯人领地**。资料：[加纳博物馆与古迹委员会 Cape Coast Castle](https://gmmb.gov.gh/cape-coast-castle-cape-coast-1653/)。正式专题另记录1664/1665的史料差异，图层依据该馆选择1665年。 |
| `claim-bombay-east-india-company-1668` | 1668—1699 | 1661英王从葡萄牙婚约取得孟买，1668移交东印度公司；其余马拉塔、莫卧儿地区非公司主权，坐标框不是17世纪七岛复原。资料：[英国图书馆印度事务档案 IOR/G](https://searcharchives.bl.uk/catalog/032-000173250)。 |
| `claim-madras-fort-st-george-1640` | 1640—1699 | 1639获得印度地方统治者土地和商馆许可、1640圣乔治堡据点逐渐形成；只参考城堡及近邻城镇，不映射整个南印度为殖民地。资料：[英国图书馆印度事务档案 IOR/G](https://searcharchives.bl.uk/catalog/032-000173250)，[印度事务部旧档《List of Factory Records》历史档案整理](https://tamildigitallibrary.in/assets/docs/uploads/primary_files/book/TVA_BOK_0046310/TVA_BOK_0046310_List_of_Factory_Records.pdf)。 |

## 三、技术合同和回归
1. 本次只增加或修订 `data/seventeenth-century-expansive-colonial-claims-1600-1699.geojson`、`scripts/test_editor23_expansive_17c_claims.js`、`README.md` 和本文，不更改正式专题、历史事件、原有旧版本图层或移动端。
2. 新增六个区域的`related_event_ids`逐项连接已存在于十年Atlas的**真实事件ID**；自动测试禁止缺失与错链。新增年份断言验证1641西班牙收复、1667/1668苏里南英荷交替、1684丹吉尔撤离、1668孟买公司接收等关键节点。
3. 静态自动校验须通过`node scripts/test_editor23_expansive_17c_claims.js`和`python3 scripts/audit_spatial_semantics.py --strict`，且应通过真实桌面Chromium及独立红队GIS工作流；**绿色测试证明程序约束而非实测边线历史真实性**。
4. 发布须有GitHub PR合并和`Publish historical atlas`工作流成功的明确记录。没有完成时，不能称上线。

## 四、下阶段研究提醒

- 如果继续升级地图精度，优先拆分群岛中海水包络，并寻找对应的时代港口测绘、堡垒地籍与据点营建文书；不能把当前宏观矩形的面积当作土地面积。
- 专题中与西班牙、荷兰、法国及当地政治共同体的控制权冲突，应通过年内事件或历史正文解释，按年显示的色块不能代替逐日权力交接。
- 1600—1699的历史正文/事件维护任务与地图参考面独立审核，尤其不能为了视觉扩张虚构东印度公司在印度内陆的主权。
