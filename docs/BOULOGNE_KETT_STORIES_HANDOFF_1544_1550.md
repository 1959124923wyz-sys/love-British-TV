# 爱英TV｜第15、16项专题接班记录（2026-10-16）

## 实施内容
- 15，布洛涅战争、英王军政管理、港区房地产征用、英格兰移民军屯、法军围困、外围炮堡失守及1550年法军恢复控制。11节约3400字。
- 16，诺福克反围地行动、罗伯特·凯特加入、莫斯霍尔德营地、二十九条请愿、诺里奇攻城及巷战、杜辛代尔决战、王室战后处决。10节约3100字。
- 专题库索引从12增为14，并继续使用二级阅读界面及历史事件点击跳年份、双击详情及返回原事件功能。
- 全部过去和新增的重大历史专题的读者页面通过 `js/history-stories.js` 中 `readerFriendly` 处理，以消除纯粹关于地图画法、史料口径及历史争论的句子；原文和来源与审查注释仍原样保存在JSON。折叠的参考资料保留资料标题和外链，不再渲染 `reading_note`、`map_note` 或访问层级说明。旧专题未丢失原始数据。
- 对两项核心事件卡的18条公开摘要改为直接历史叙述；修改前全文已无损备份在 `research/editorial/BOULOGNE_KETT_ORIGINAL_EVENT_SUMMARIES_20261016.json`。

## 15 源证、点线面与前后控制
- Neil Murphy (2019), Cambridge UP, *The Tudor Occupation of Boulogne* 各章节公开书目信息及独立学术书评；Pierre Héliot (1958) *Revue du Nord* 完整开放文章和文献图；法国国家图书馆1544–1550书目节点；Camden Society 1550年和约外交文件篇。
- 1544英军围城、入城，1545下城Citadelle修建征用居民及会士财产，1546英王枢密院提出居民五千上限方案，数据是拟定容量，不是实际驱逐人数。
- 英军炮堡：旧罗马灯塔Tour d'Ordre 1544建设，Young Man/Red Fort 1545，Ambleteuse 1546，Boulemberg Mont Lambert 1546。法军乌特罗高地炮垒自1545年起始，严禁当英军设施。
- 已有 `data/military-control-points-1540-1549.geojson` 明确区分布洛涅城内英王驻军管理、Tour d'Ordre、Ambleteuse/Boulemberg与Outreau法军敌对阵地；`data/war-contested-zones-1540-1549.geojson` 的 `front-boulonnais-1545-1549` 为非测绘战争阅读区域，属性 `fill_authorized:false`。未复制现代遗产法定范围作为1545年军界。战线实际位置仍需具备同时代地图精确配准后才能完成。
- 阿姆布勒特斯于1549年8月25日由法军夺回，英军驻堡年末到1548截止；Boulemberg也于1549退出，布洛涅主城仍到1550年4月25日法方接管才结束。1550年3月24日条约签署与4月25日实际交城不可混同。

## 16 源证、点线面
- Norwich Castle Museum官方凯特起义资源、Newcastle大学Wastes and Strays、Internet Archaeology专业历史地理研究、Durham大学开放研究、British Library Harley MS304二十九条请愿转录、Norwich Society及Norwich Preservation Trust。
- 新增 `KET1549-BISHOPS-BRIDGE`：1549年7月22日诺里奇主教桥攻城，参考 Historic England NHLE 1205642 的中世纪桥梁现代NGR TG2399308991，转换WGS84 (52.632418,1.308592)，不是完整城内战场边界。
- 新增 `KET1549-PALACE-PLAIN`：1549年7末—8月初北安普顿首支王室军与起义者的巷战，诺里奇保护信托记载宫殿广场；参考 Historic England NHLE 1051328 Bishop's Gate附近NGR，现代点 (52.633214,1.301335)。
- 原现有连续7节点加威廉·凯特处决点保留。已有两片战斗研究候选区保持原有淡色示意，杜辛代尔死亡量统计资料记录在后台，读者只讲军事过程。政府战场杀伤和后续司法处决分开，属于英国内部镇压，非海外殖民战争。

## 仍需审查
- 15城墙、Old Man、Young Man与Citadelle的精确历史墙线没有GIS配准，按现有据点表达；如果取得Pierre Haultin 1550原图控制点，应由独立地理研究分支配准且经QA后再发布。
- 16 Palace Plain现代参照点是邻近具有官方NGR的门楼，不应虚称1549英军站位；Dussindale候选区不代表精确阵型或完整战场。
- 数据、研究记录、所有脚本均保留真实来源；面向观众去掉关于研究争论和数字不确定的插话，不意味着将没有证据的数字当作事实。
- 合并前应通过 `scripts/test_boulogne_kett_major_stories.js`、`scripts/browser_boulogne_kett_stories.py` 及全部继承回归门禁。主分支合并后以Pages部署工作流SUCCESS为上线标准。
