# 主编交接｜18世纪阿卡迪亚地图第一批真实代码（2026-11-08）

**分支**：`map/18c-acadia-first-map-pilot-20261108`，从综合研究提交 `97214b082490daa1f48203c18c8ec2d2e64adadb` 分出；**不合并main，不宣称1755年正式地图已经发布**。

## 前辈范式与本批改动

已对照根目录`AGENTS.md`、16C正式专题范本、`data/stories/drake-panama-mule-train-raid-1572-1573.json`、17C已有`E6-T10-ACADIA`长篇、`data/atlas-1590-1599.json`、`js/history-stories.js`、`app.js`及浏览器回归脚本。

本次**真正接入现有主地图引擎**，不另造一套不兼容的网页或更改已有16/17C事件ID：

- `data/stories/serial/chronology-preview-1700-1769.json`：18件具发生年历史事件候审对象，**14处现代官方遗址参考点**、4件无坐标；6件高重要度主图候审，其余为专题节点或正文背景。每项含来源、主体/地点精度与原合并专题组ID（如`E18-MRG-T07-04`）。`colonial_polygons`、`routes`、`places`均为空数组；绝不伪造驱逐船路线或米克马克土地的英国领土实心面。
- `data/stories/serial/e18-c07-acadia-deportation-1713-1764.json`：与16C/17C一致的10节完整中文历史叙事与18个`[[已登记候审事件ID|历史行为词句]]`。单击跨年定位，双击开事件档案、返回专题，再返回入口事件。原`E6-T10-ACADIA`前篇不变，作该专题的`related_story_ids`。
- `data/stories/serial/preview-18c-index.json`：**研究试阅专用**注册器，`status=research_preview`，不向正式`data/stories/serial/index.json`加未经审稿的published记录。
- `app.js`和`js/history-stories.js`：复用已批准的金色内文链接、十年/年份滑块、事件聚合、现有右侧资料卡及地图平滑`map.panTo`；**只有显式`?review18c=1`才读取18C试阅**，普通网页仍以1699年为17C候审上限。研究试阅可选1700—1769年，但其余年代空白并不意味着历史活动消失。
- `scripts/test_18c_acadia_map_pilot.js`、`scripts/browser_18c_acadia_pilot.py`、`.github/workflows/18c-acadia-map-pilot.yml`：自动校验及真正桌面浏览器脚本。浏览器脚本在1780×1020运行并保存截图。

## 实际审查的权威来源与史实侧重点

加拿大公园局 [Grand-Pré历史](https://parks.canada.ca/lhn-nhs/ns/grandpre/culture/histoire-history) 记录1755年Les Mines约2200人被驱逐，1764允许返乡时旧田地已被新英格兰移民占据。加拿大公园局 [Fort Beauséjour驱逐与抵抗](https://parks.canada.ca/lhn-nhs/nb/beausejour/culture/histoire-history/deportation) 记录**1755-07-28哈利法克斯驱逐决定**，8月Fort Cumberland地区先执行，9月Grand-Pré与Pisiquid跟进；约6000—7000人包含较长时间段，不与Les Mines、Pisiquid、Beauséjour各地子样本机械相加。[Beauséjour围城原址](https://www.parcs.canada.ca/lhn-nhs/nb/beausejour/culture/histoire-history/siege-1755) 记**1755-06-16法方守军投降**。 [Fort Edward历史](https://parks.canada.ca/lhn-nhs/ns/edward/culture/histoire-history) 记1755年秋Pisiquid约1200人被驱逐。[Skmaqn–Port-la-Joye–Fort Amherst](https://parks.canada.ca/culture/designation/lieu-site/skmaqn) 记1758年从Île Saint-Jean岛强制驱逐另批阿卡迪亚人。来源登记里的国家历史遗址点属于今日公园/纪念地位置，不冒充当时精确监禁、船舶停靠和屠杀现场。

17C前篇保留Mi'kmaq与Wolastoqiyik等政治主体的自治、1713条约主张争议及英法帝国竞争。1750年Beaubassin烧毁原研究有证据表明为**法国方面及其盟友**，不能错误归到英军。1758 Île Saint-Jean在该年英国夺取前**不是英国一直占据的土地**。

## 地图制作的下一轮具体任务

1. **先补1700年真实政治控制和连续性台账**：从1699年末27块参考声索层逐件提取真正已证据点与地方独立政体，分别记录有效年份；**不得自动继承这些参考Polygon**。阿卡迪亚17C的皇家港和Mi'kma'ki在1710、1713、1749、1755、1758、1764分时改变，须单处审查驻军/行政核心和原住民自治。
2. 针对1755驱逐令，核实省议会原始纪要、Winslow日记及押船清册：Hali​fax、Grand-Pré、Fort Edward、Annapolis和Fort Cumberland分地点记录；人口范围、名册、具体船次以原档为准。
3. 每十年落实真实Atlas（如`data/atlas-1750-1759.json`）之前，先批准年末控制台账；本试阅JSON不是正式十年Chapter。届时按真实来源和地理精度，把现有候审ID稳定移入正式Atlas，再将专题加入`published+approved`目录。
4. 其他编辑可分别领取T07其他子篇、T14—21孟加拉/印度及T34—35澳大利亚，但**独立分支修改各自地区**，不要互相覆盖`app.js`或`data/chapters.json`。主编以合并PR逐个审核。
5. 检查正文超链接**单击跨年平移、双击进入真实档案与返回**；没有可靠坐标的事件必须仍可阅读，但不让地图飞到任意地点。国家历史遗址点位需为空心/虚线参考符号。桌面Chromium通过才能考虑正式合并。

## 本地运行与自动化

审核者克隆此分支后，在仓库根目录运行静态服务器：`python3 -m http.server 8765`，浏览器打开`http://127.0.0.1:8765/?review18c=1&year=1755`。正常`/?year=1755`不得开启18世纪数据，仍保持此前17C上限。

GitHub Actions：`node --check app.js`、`node --check js/history-stories.js`、`node scripts/test_18c_acadia_map_pilot.js`、`node scripts/test_editor7_17c_inline_story_map.js`、`python3 scripts/audit_spatial_semantics.py --strict`；以及Python/Selenium真实浏览器脚本。所有截图写到临时CI artifact，不转为历史数据。

**永久验收底线**：已证政治控制城核与未经测绘的地方影响区分开；不存在历史实测疆域时不生成实心控制面；不得因某区发生战争或驱逐就声称英军持续占据全省；没有证据的路线/死亡数字/实际面积保持空值。