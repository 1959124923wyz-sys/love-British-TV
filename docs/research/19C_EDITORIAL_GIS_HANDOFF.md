# 爱英TV · 十九世纪总编交接与地图制作入口

**维护日期：2026-11-21｜研究范围：1800—1899｜研究归档起点：PR #463**

## 一句话接手

**从 `research/19c/consolidated/START_HERE.md` 开工。** 任何新对话依照仓库工作板选择任务并直接修改 GitHub，完成“权威史料→专题正文→真实地理轮廓/事件点→地图互动→浏览器与空间测试→PR审核→Pages发布”全流程，最后更新同一台账。用户不负责处理代码或手动搬运材料。

- [永久接力总入口](../../research/19c/consolidated/START_HERE.md)
- [59专题与150章节原始归档](../../research/19c/consolidated/README.md)
- [专题状态/认领](../../research/19c/consolidated/TOPIC_WORKBOARD.csv)
- [章节详细状态](../../research/19c/consolidated/CHAPTER_WORKBOARD.csv)
- [全卷原案与史料校验](../../research/19c/consolidated/verify.py) · [工作板完整性校验](../../research/19c/consolidated/verify_handoff.py)
- [持续进度](../../research/19c/consolidated/PROGRESS.md)
- [史料归档草稿PR #463](https://github.com/1959124923wyz-sys/love-British-TV/pull/463)

## 研究清单与正式生产清单不能混为一谈

研究卷为 **59专题、150章、273原案（其中245纳入）、1,980条分章年表、314导读节点、1,520史料引文、1,317 GIS线索、353未核问题、374底稿文本、179扫描件定位**。这些是**可审源数据**，不能从数量推断发表了59篇文章或1317个测绘地物。扫描件定位不是PDF本体。

当前主干另有 `data/stories/serial/chronology-1800-1819.json` 至 `chronology-1890-1899.json` 的九个十年年表，以及 `data/nineteenth-century-spatial-*.geojson`、`data/nineteenth-century-territorial-areas*.geojson` 的历史地理资产。后继人员必须先核对现有 `stable_id`、事件时间和当年主体，不重复发表或覆盖真实多边形。

已按资料原档优先级分出 **27项首批、32项后续**。建议 R1 并行 T15（1857印度）、T26（中国条约港与战争）、T37（埃塞俄比亚马格达拉文物流向）、T46（澳洲边疆土地与暴力），其余 R2—R4 在 [START_HERE](../../research/19c/consolidated/START_HERE.md#5-前四轮推荐制作顺序可并行但专题-id-不可重号) 编排。选择之前必须检查最新工作板，避免抢同章改动。

## 每批交付门槛

| 工种 | 交付 | 绝不省略 |
| --- | --- | --- |
| **调查员** | 逐史实对照原案、卷页、当事者、日期、受害规模和统计口径 | 反对方/当地原住民族记述、不同来源冲突、无法证实项 |
| **总编** | 有结构的重大专题长文，按章节登记来源，编排事件与抵抗 | 用 `[[真实事件ID\|自然语句]]` 连接地图，不能假设旧研究原ID已注册 |
| **GIS制图员** | 当期真实岸线/堡墙/战场研究边界/许可区，或有据点、河流、虚线参考 | 实控／军事／法权／商贸／原住民族地权分别编码，来源、年份、投影方法、边界可靠性 |
| **QA/交接** | 静态和真实Chrome测试、跨十年与1799→1800连续性、左右阅读器跳转、地图图元审计 | 更新 `TOPIC_WORKBOARD.csv`、`CHAPTER_WORKBOARD.csv`、`PROGRESS.md`；注明合并SHA与实际 Pages 发布 |

**史料或几何未核的情况留在研究层。** 不能按现代行政区补全殖民历史版图，不得画无依据的整片英国控制区；只有经考证的真实行政控制Polygon才可实心上色。仍需地图空间可读性时，用有据地点/河口/战场及淡虚线无填色参考，史实写在公众页，制图技术限制写在研究档案。

每个十九世纪制作任务先检查：
`AGENTS.md`；
`docs/templates/16c-story-map-standard/README.md`；
`docs/MAP_FIRST_CARTOGRAPHY_STANDARD.md`；
`docs/RESEARCH_TERRITORY_CONTINUITY_PLAYBOOK.md`；
`docs/READER_PUBLIC_COPY_POLICY.md`。

### 必须运行的基础检测

```sh
python3 research/19c/consolidated/verify.py
python3 research/19c/consolidated/verify_handoff.py
python3 scripts/audit_spatial_semantics.py --strict
node scripts/test_atlas_47_public_copy_guard.js
node scripts/lint_atlas_47_frontend_copy.js
```

制作正式文章/地理图的 PR 另行采用该功能原有的自动测试及真实桌面 Chrome（年代变更、地物切换、正文互动及资料源点击）。没有合格浏览器验证及主分支正式部署，不标“已发布”。

**下次接力无需本次聊天全文。仓库的本入口、两张任务板和提交历史才是单一真实进度来源。**
