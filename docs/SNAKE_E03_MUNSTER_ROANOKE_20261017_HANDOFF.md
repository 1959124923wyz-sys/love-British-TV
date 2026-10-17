# 蛇E分身03｜专题36/37 验证、点线面与提交说明（2026-10-17）

## 责任范围与当前状态

本包为**本地编审完成、尚未远端提交**的专题代码包。此前建立过 `feature/snake-e-03-stories-staging-20261017` 独立分支；本次 ZIP 不代表分支已更新、PR已提交或 GitHub Pages 已上线。主编应先从最新远端拉取或重建目标分支，再使用 `scripts/apply_snake_e03_stories.py` 在分支上合并。本包不会修改用户批准的时间轴、地图侧栏布局或全局配色。

研究范围：36. 1584—1589芒斯特殖民地契、测绘、实际授地与抵抗后续；37. 1585—1590罗阿诺克殖民、当地居民被袭击与殖民地消失。正文为8节和10节历史叙事。章内事件链接按既有 `[[事件ID|显示文字]]` 语法。两文互不重播德斯蒙德战争主体段落。

## 关键去重核查（已对2026-10-17主分支事件原文核对）

以下事件早已在主库，不得新增同义事件：
- `1580S-E015`：1585-07-18 阿夸斯科戈克村被焚，已有北卡B-72地标参考坐标。
- `1580S-E022`：1586 莱恩袭杀温吉纳，但尚无地理锚点；本补丁增加北卡州B-69公路史迹标记参考，**绝不是历史村址或杀人现场的精确坐标**。
- `1580S-E023`：1587 怀特殖民团误袭克罗托安盟友，地点仍不明，不强行把袭击钉在克罗托安岛上。
- `1590S-E003`：1590 怀特发现空置营地和CROATOAN刻字，已有罗阿诺克锚点；不另画迁徙假想线。
- `1580S-E013 / E018 / E029 / E030 / E027` 已包含1584勘丈、1586分图与批准、1588实施进度、1589乔布森图；仅补1587地权冲突办理节点。
- `1590S-E026 / E030` 已包含1598芒斯特反殖民起事、斯宾塞城堡遭焚；只在长文中作为后续衔接，不把事件提前到1580年代显示。

## 本次补图清单

| 年份 | ID | 类型 | 简要事实 | 地理处理 |
|---|---|---|---|---|
| 1586 | `1580S-E022`（原事件改良） | 点 | 温吉纳在达西门克皮克地区遭英方杀害 | 使用B-69现代路边标牌参考坐标35.870983,-75.784983，说明原村位置仅为“大致附近” |
| 1586 | `ROA1586-LANE-COLONY-EVACUATION` | 点 | 莱恩殖民军随德雷克撤出罗阿诺克 | 沿用NPS Fort Raleigh现代遗址参考坐标，不表示整个岛被英国控制 |
| 1587 | `ROA1587-GEORGE-HOWE-KILLED` | 资料卡 | 殖民者豪遭当地人袭杀，引出殖民团报复行动 | 遇害现场未定位，坐标为null |
| 1587 | `ROA1587-JOHN-WHITE-DEPARTURE` | 点 | 怀特从罗阿诺克离开返英求援，1588英西战争延误回航 | 沿用已核的罗阿诺克现代遗址锚点 |
| 1587 | `MUN1587-LAND-CLAIMS-COMMISSION` | 资料卡 | 王室向布朗下达处理芒斯特旧自由保有者与新承领者争议的指示 | 处理地点未核实，保持null，不画芒斯特整省为新占领面 |
| 1586 | `snake-e03-roanoke-attack-dasemunkepeuc-1586` | **线** | 莱恩殖民军从罗阿诺克驻地出动，袭击达西门克皮克 | 仅为两端历史地名之间的示意连接，两端使用现代遗址/标记点，未知行军路径；不得称实测军道 |

**新增实控面：0。** 芒斯特1586—1589年地图的庄园地块为计划、申请、勘测和部分获授信息，尚不足以直接等同逐年实有控制面积。罗阿诺克仅有军营及不稳定定居点，缺乏证明英王获得附近大陆大片政治控制的材料。所有历史疆域统计值保持null。

## 重要史料

1. 科克大学CELT：《德斯蒙德勘丈》及1586年芒斯特地契条款 https://celt.ucc.ie/published/E580000-001.html ， https://celt.ucc.ie/published/E580000-001/text005.html 。支持1584—1589勘测、正式授地方案和土地继承/使用限制；**批准方案不同于实地控制**。
2. 爱尔兰国家图书馆1587年原文档案目录 https://catalogue.nli.ie/Record/MS_UR_014622 。核实有处理自由地权人与承领者争议的枢密院指示，当前已读的是馆藏目录，并未把未阅原文当作全文材料。
3. 科克大学CELT：罗伯特·佩恩1589年小册 https://celt.ucc.ie/published/E590001-007.html 。作为当时英人殖民招募、利益期待的立场材料；不能当中立全景统计。
4. 美国国家公园管理局罗阿诺克系列：https://www.nps.gov/fora/learn/historyculture/1585-the-military-colony.htm ；https://www.nps.gov/fora/learn/historyculture/1587-the-lost-colony.htm ；https://www.nps.gov/fora/learn/historyculture/1590-rescue-voyage.htm 。
5. 北卡罗来纳自然与文化资源部B-69：https://www.dncr.nc.gov/blog/2023/12/06/dasemunkepeuc-b-69 、B-72：https://www.dncr.nc.gov/blog/2023/12/06/aquascogoc-b-72 。B-69现代路标坐标另参考 HMDB：https://www.hmdb.org/m.asp?m=256820 （35°52.259′N,75°47.099′W）。明确非古村精确定位。
6. 怀特本人1590年返航记摘录：https://encyclopediavirginia.org/primary-documents/john-white-returns-to-roanoke-an-excerpt-from-the-fift-voyage-of-master-john-white-into-the-west-indies-and-parts-of-america-called-virginia-in-the-yeere-1590-1600/ 。

## 关联专题入口设计

主库 `js/history-stories.js` 使用 `storyByEvent:Map<event_id,story_id>`：同一事件若被新旧两篇文章写入索引会产生覆盖。为保持已上线的35专题入口，36专题在索引仅独占没有在35索引登记的年份后续事件：1580S-E030、1580S-E027、1590S-E026、1590S-E030；原35篇仍独占1580S-E013、E018、E029。36正文中的这些共享事件仍可通过内文链接定位。额外仅在长文阅读页增加轻量`related_story_ids`互链按钮，不改变主页地图UI。

## 主编合并与验收

1. 先核对主分支有无他人已新增36/37或同ID，尤其当前同时存在的草稿PR #118—#120。本补丁导入脚本对同ID有冲突保护，不强推覆盖别人改动。
2. 解压ZIP，把`repository_files`内目录放到仓库根目录；由主编在新支线执行 `python scripts/apply_snake_e03_stories.py` 和 `python scripts/test_snake_e03_stories.py`。无需用户自己写代码。
3. 继续运行仓库自带 `scripts/validate_atlas.py`、地图时间连续性与重大专题reader测试，并跑Chromium真实浏览器：测试入口可见、36和35互链、正文内跳年定位、双击详情/返回恢复、1590不会显示假想失踪者迁移线。
4. 如旧测试以固定数量断言年份事件累计数字，应更新测试断言；不能回删历史事件以凑数。
5. 主编合并到main后核对GitHub Pages成功部署，再宣告上线。此ZIP尚未提交GitHub，且尚未完成远端CI和浏览器验收。
