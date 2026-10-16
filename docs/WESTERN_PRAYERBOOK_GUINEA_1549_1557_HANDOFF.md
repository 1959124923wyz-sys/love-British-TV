# 爱英TV｜1549西南王室镇压与1553—1557西非贸易（研究交接）

## 交付
- 两篇重大历史专题：`data/stories/western-prayer-book-rising-royal-suppression-1549.json` 10节、至少2600汉字；`data/stories/english-guinea-trade-enslaved-africans-1553-1557.json` 10节、至少2500汉字；主索引从14扩为16。
- 1549年代增3条有具体地理锚点史事：克利斯特圣玛丽桥的防守与绕渡、埃克塞特西门军需防御、圣托马斯教堂牧师罗伯特·威尔士遭处决。伍德伯里、克利斯特焚村、克利斯特荒原与俘虏被杀及最终桑普福德会战此前已收录，**不重复创造新事件**。
- 1550年代增4条：1555洛克航次五名被奴役非洲人返英的英国端节点、1555托沃森纽波特出发、1556哈里奇出发、1557托沃森第二航次与葡萄牙舰队交战。原`1550S-E008`已经记载洛克押运五人，仍完整保留；新增英国端节点是出发商业网络参考，**不宣称其准确登陆英格兰地点**。
- 新增`data/war-front-corridors-1540-1549.geojson`中两条1549王军作战方向虚线：Fenny Bridges→Woodbury→Clyst Bridge→Exeter及Exeter→Sampford Courtenay。这些线仅按先后地名标示，不是实测16世纪道路，也不得统计其宽度为占地。
- 更新1554洛克、1555托沃森和1556托沃森既有海路的英格兰停靠港次序：伦敦/多佛/拉伊/达特茅斯、纽波特/达特茅斯、哈里奇/锡利/普利茅斯。不制造真实船舶GPS或无证航线。

## 史料证据
- Devon County Council: Foard & Hodgkins 2009 `https://www.devon.gov.uk/historicenvironment/projects/battlefieldsprayerbookrebellion/`
- Historic England NHLE 1020209 Clyst St Mary Bridge `https://historicengland.org.uk/listing/the-list/list-entry/1020209/`
- Devon HER MDV12578 Sampford battlefield; MDV62604 Long Goes battle landscape. **HER现代登记边界不可充当1549年实测交战面**。
- South West Heritage Trust: 1549埃克塞特城墙守备木材、火药购买与战后绞刑费用凭单 `https://swheritage.org.uk/receivers-accounts-2/`; St Thomas Church local church research on Robert Welsh/Welshe.
- Richard Hakluyt John Lok 1554 voyage, Perseus text `https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.03.0070%3Anarrative%3D522`.
- Cambridge University Press edition of Hakluyt: Wyndham 1553, Towerson 1555, Towerson second 1556 and third 1557 voyage chapter titles.
- Robert Kerr 1824 reprint of Hakluyt/Towerson `https://www.gutenberg.org/files/13287/13287-h/13287-h.htm`, includes pilot-level dated UK ports and combat chronology.
- UNESCO: Portuguese Elmina castle `https://whc.unesco.org/en/list/34/`.

## 不可突破的历史规则
- 克利斯特村庄王军焚烧与荒原军事交战分别记载；**俘虏被处决的人数不得并入战场战死人数**；不凭虚构伤亡规模绘制毁坏面积。
- Devon西南战事属**英国内部王权镇压**，不表现为英国对外国的殖民扩张或新增英属领土。
- 非洲港口与海湾接触属贸易、船上绑架押运和欧洲各方海上武装竞争，不等于英国殖民统治整片西非。1554洛克返英的五名被奴役者为特定航次，不应扩大为所有商船都携带五人。
- 非洲第三次Towerson航次：Hakluyt晚期文本标题作1557；Kerr 1824重编考证第三航次实际可能始于1558年1月。此批**仅把1557春王船与葡萄牙人交战归于1556年出发的第二航次**，原 `1550S-E017` 和原第三航次示意继续按既有档案年份，后续应作专门年表审核，不得自认存在1557年第三航次和第二航次同月同地。
- 港口现代点位为地理锚点，未使用现代港区边界补成历史港界。St Thomas教堂塔楼1549位置不等于今天重建建筑的墙体。Harwich必是东经 +1.287337，不能误写为 -1.286。

## 验收脚本
`scripts/test_western_prayerbook_guinea_stories.js` 对两篇文章、17条及10条关联事件、来源、1549军事线、1556哈里奇地理坐标、已有洛克五人节点不重复进行自动化检查。`scripts/browser_western_prayerbook_guinea_stories.py` 用Chromium检查点击事件、跨年份和专题返回。
两项脚本已纳入 `.github/workflows/major-history-stories.yml`及`.github/workflows/pages.yml`。所有旧自动化检查必须一并通过才合并主干，上线以GitHub Pages的Deploy SUCCESS为准。
