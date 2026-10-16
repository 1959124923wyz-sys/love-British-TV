# 爱英TV｜1543—1550年英苏战争重大专题交接（2026-10-16）

## 范围、历史性质与编辑结论
这一研究对应重大专题候选 #14：“粗暴求婚”英苏战争。**英格兰与苏格兰仍为独立王国**；不是英国境内平叛，也不是英军完全征服苏格兰。

史实骨架：
- **1543年** 婚约谈判破裂，苏格兰拒绝亨利八世利用玛丽幼王婚约施加的王权压力。
- **1544—1545年** 利斯、爱丁堡、梅尔罗斯、杰德堡、凯尔索、洛赫马本等地遭受英军侵袭或短期城堡夺取，安克勒姆荒原有苏格兰反击。
- **1547年** 萨默塞特公爵在平基战役大获胜利，但未达成婚约；英军继而尝试凭堡垒、岛屿、港口、补给线维持据点。
- **1548—1549年** 苏格兰与法国联合围攻哈丁顿，各堡垒反复易手，英军在1549年放弃哈丁顿。
- **1550年** 布劳蒂、Forthill与埃茅斯等英军据点退出；英法达成和平，英苏正式议和继续延伸到1551年诺勒姆条约。这两个外交层次不可混淆。

## 这次提交的可调用成果
- `data/stories/rough-wooing-anglo-scottish-war-1543-1550.json`：11节约5700字，12项可靠史料，36条正式事件ID；来源字段逐节对应，超链接全部采用已发布 `[[事件ID|说明]]`，不引入伪造的新经纬度。
- `data/stories/index.json`：在此前芒斯特长篇条目之外追加此次新专题；原有一篇不丢。
- `scripts/test_major_story_pilot.js`：单篇试点检查改成多篇数据库审核；逐事件校验ID、时间范围、唯一专题归属、正文链接、来源。
- `scripts/browser_rough_wooing_story.py`：真实桌面浏览器覆盖1544→1545→1547→1548→1550点击定位、1550年事件双击详情与返回长文、跨年回到最初1544年梅尔罗斯；反向从1550年布劳蒂进入，点击1547年后还应返回1550年。
- `.github/workflows/major-history-stories.yml`：两组浏览器测试和截图均成为必须通过的专项CI。
- `docs/MAJOR_STORY_BACKLOG_1497_1599.md`：编号14改为已上线，剩余候选按原优先级延续。

## 特别需要注意
1. 本专题是历史解读，不是新增 1547—1549 年战争占领面。**Issue #46** 关于连贯军控历史边界的数据缺口依旧存在；支持原有虚线示意，不可以因长篇文字而将示意区画实心、计算殖民面积。
2. 索引中 `1540S-ED-DUNDEE-1547-CONTROL` 等资料性事件无坐标时仍要按系统现有小窗显示；不得臆造邓迪古城墙位置。
3. 梅尔罗斯的毁坏存在连续行动和年代精度问题；正式稿避免用某一天确定整座建筑烧毁日期，保留既有事件的研究标注。
4. 史料中平基会战死亡人数差异甚大，官方资料不支持绝对精确的战死统计。正文避免整数虚假精度与战损面积推算。
5. 涉及法苏联盟和苏格兰民众税负时要如实指出各方军事动员造成的负担，不可为了主题刻意略去当地行为、失败攻势或英方的苏格兰支持者。
6. 仍采用子事件→专题的入口；文章仅在二级档案阅读栏显示，正文单击连动地图和年份、双击独立详情、返回恢复起点。不要增加主页大块文字和黄色时间轴圆点。

## 核心历史证据
- Historic Environment Scotland, Ancrum Moor official record (BTL2)：https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,BTL2
- Historic Environment Scotland, Pinkie official record (BTL15)：https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,BTL15
- Historic Environment Scotland, Scottish wars of the 1540s (2026)：https://blog.historicenvironment.scot/2026/08/mary-queen-of-scots-the-battle-of-pinkie-and-the-anglo-scottish-wars-of-the-1540s/
- Historic Environment Scotland, Siege of Haddington (2022)：https://blog.historicenvironment.scot/2022/07/the-story-of-scotlands-longest-siege/
- Historic Environment Scotland, Broughty Castle：https://www.historicenvironment.scot/visit/all/broughty-castle/history-and-stories/

以上文献用于连贯背景；每条单事件依然以原 `source_ids` 证据及地理精度为准，专题不得覆盖它们的验证等级。
