# 爱英TV｜04、05历史专题实施交接（2026-10-16）

## 历史专题04：1513—1519年英法战争与图尔奈占领

文件：`data/stories/henry-viii-france-tournai-1513-1519.json`；9节、约3500字，英军围攻、1513年马刺战役、泰鲁阿讷投降与毁城、图尔奈占领、1515内堡、1518议和、1519撤军。

**新增3个正式子事件点**：
- `FR1513-GUINEGATE-SPURS`：1513年8月16日Guinegate/Enguinegatte马刺战役，取现代城镇参考点，战场边界不明。来源：Tudor Society引1513年Letters & Papers; Cruickshank评《Army Royal》。
- `FR1513-THEROUANNE-DESTRUCTION`：1513年8月泰鲁阿讷投降后拆城和破坏，明确与1553年最终毁城分开。法国泰鲁阿讷市政府 + Persée书评。
- `FR1515-TOURNAI-HENRYVIII-CITADEL`：图尔奈英王塔现存遗址。市政府确认1515年建设独立内堡、加强河道和城门控制，现存塔楼可定位；史迹现代塔楼位置来自OSM。市政府对1515年Poynings人物时间说法与近代学术书目关于1514年更替有冲突，故正文不具体断言1515年Poynings仍在任。

**新增1条仅1513年显示的两端关系线**：
- `FR1513-THEROUANNE-TOURNAI-ADVANCE`，泰鲁阿讷投降后英军转向图尔奈；仅示意战役先后，不复制现代路线。
- 现有 `data/french-urban-control-1500-1519.geojson` 中1513年9月开始、1519年2月结束的城市驻军控制点保留原值。1518年达成议和后仍有驻军；1519年2月才归还。历史边界仍不得由今城区轮廓代替。
- `data/geography-1510-1519-hypotheses.geojson` 原有图尔奈城外虚线仅为周边地名研究，不是精确英王军占面；没有再增实际占领Polygon。
- 重要史学纠错：Wallonia地方网络简介有“图尔奈向英议会派两名议员”说法，但Davies(1998)《Historical Journal》明确提出**图尔奈没有取得英议会代表权**；本次采信同行评审史学观点，未将网络误说写入正式读者文章。

## 历史专题05：1520—1522年萨里伯爵爱尔兰远征

文件：`data/stories/surrey-irish-expedition-1520-1522.json`；9节、约3000字。使用Steven G. Ellis(2023)《Irish Historical Studies》**开放获取论文全文**，并交叉比对皇家爱尔兰学院Howard传记。内容有统治更替、1520年都柏林登陆、驻军强征军需、莱伊什出兵、1521年奥法利民居粮食城镇被焚、三门重炮攻取莫纳斯特罗里斯和留军、纳斯防务、1521年8月伯爵险遭枪击、1522年撤军及奥蒙德接替。

**新增3个正式点**：
- `IR1520-SURREY-WOOD-QUAY-ARRIVAL`：Ellis记录1520年5月24日伍德码头登陆，结合NMI考古地点位置显示；无1520年船舶泊位测绘。
- `IR1521-SURREY-NAAS-DEFENCE`：1521年7月萨里返回都柏林后前往防备爱尔兰领主可能焚毁纳斯，位置为城镇参考点。
- `IR1521-SURREY-LEIX-SECOND-HOSTING`：1521年8月萨里再入Leix，头盔面罩受枪弹击中；Leix大区域参考点非战场实测；并为原 `1520-SURREY-LEIX` 补现代地理参照，不将整个Laois判定为王室实际控制区。

**新增1条仅1521年显示的关系线**：
- `IR1521-MONASTERORIS-TO-DUBLIN-RETURN`，Ellis依据同期通信确认萨里攻占莫纳斯特罗里斯并于7月24日返回都柏林；路线折点并无原始测绘，只保留两个史地端点。

**无法据此扩展政治疆界**：
- Ellis(2023)全文确认1521年英王军在Offaly毁房、粮食和城镇，但村落分布、破坏面积与连续扫荡周界未有可公开复核的原始地理图件；保留多点叙事，暂不画用现代Offaly县界拼出的战争红面。
- 局部首领1520年表示服从不等于此后接受长期王室司法与税收；1521年的再战证明当地对抗仍在。
- 1521年底萨里暂离、1522年3月短暂返回解散军队必须区分。

## 文件与QA

- 两篇文章数据和 `data/stories/index.json` 使专题总数由4增至6；9+9节，共新映射18条事件（含现有及新增）。
- `data/historical-detail-notes.json` 为新增6处全部追加档案/来源，保持现代地理参考点元数据及历史主体归属；文风符合“只讲历史，不教育用户地理精度”的规范。
- `scripts/test_tournai_surrey_major_stories.js` 独立核对每篇正文、来源、链接、城市控制结束时间、不允许伪造疆域、两条仅有据年份路线。
- `scripts/browser_tournai_surrey_stories.py` 真Chromium测试单击切年、高亮、双击详情、返回原子事件、1513/1521年的行动线不越年。
- `scripts/validate_atlas.py`、`scripts/test_chapter4_published.js`、`scripts/test_first_group_history_stories.js` 和 `scripts/browser_smoke.py` 同步在原有内容仍完整保留条件下更新数据数量预期。
- 正式发布须在PR全部门禁通过后合并，合并后核实Pages部署。若中断从此文件和GitHub独立分支恢复。
