# T14 · R2长期执行清单（2026-11-22）

## 生产范围与出版门禁

专题 **T14「1843—1858东印度公司征服信德、旁遮普与阿瓦德」** 分为三章：T14.1 信德军事征服、埃米尔囚禁和战利品分配；T14.2 旁遮普两次战争、1846/1849强制条约、锡克国库与光之山；T14.3 阿瓦德国王拒签仍被吞并、王宫劫掠、塔卢克达尔土地没收与重新授予。

- [x] 读取原B06研究卷（10个原案事件、3条GIS线索、3项待核问题、8项引用键）与现有1840s/1850s网站事件。
- [x] 对照四个已有研究子专题，**复用51个有来源的正式年表事件ID**，无重复插入同一战役和没产节点。
- [x] 以1844/1858英国议会、英国王室收藏、英国国家陆军博物馆、英国图书馆、QDL与原历史条约制作三章29节87段母专题。
- [x] GIS加3个具名战役参考点；既有1855阿瓦德王国研究边界强制虚线、不得填色、不得计面积。
- [x] 将英国军事战斗伤亡、军人分赃、战后条约赔款、宝石单件转移、宫苑掠夺及土地没产六条账分别存证。
- [ ] 专用严格GIS/Node合同及真实1780×1020桌面Chrome跨省/跨年点击、双击返回、图层切换全通过。
- [ ] 制作PR合并并确认Pages部署；[ ] 另行正式出版PR强制无`review19c=1`；[ ] 出版版Pages build和deploy均成功。
- [ ] 更新59专题/150章节工作板、研究进度和协作Issue #499中的真正验收编号。

## 后继原始证据重点

一手战利品拨付和纳皮尔实际分赏账；Talpur王廷私产与被俘成员记录；米亚尼军民伤亡区分；1849锡克国库资产与光之山运输原账；1846条约赔款/驻军费实收；1858勒克瑙宫苑所失财物逐件清单；阿瓦德全省土地宣布没收与真正执行、1859发还地主契据的逐宗地籍。

**原文证据及制图误差说明：** [T14来源GIS审计](../../../docs/research/19C_T14_CONQUEST_PLUNDER_SOURCE_GIS_AUDIT.md)。**正文：** [T14三章故事](../../../data/stories/serial/e19-t14-sindh-punjab-awadh-conquest-expropriation-1842-1859.json)。**去重映射：** [51历史事件](../../../data/research/19c-t14-existing-event-crosswalk.json)。

**下一候选顺位：** R2 T10「1840年代爱尔兰大饥荒中的土地、救济和逐佃」；出版完成后再根据工作板确认，避免与T15已有1857专题重复。

## 正式出版审核阶段（2026-11-22）

- [x] [制作PR #515](https://github.com/1959124923wyz-sys/love-British-TV/pull/515) **49/49项Actions通过**，涵盖T14自身事实/GIS合同、真实1780×1020 Chrome跨三地、跨世纪合同、全站页面回归。主分支合并 `5b97aede9766610784e983945585d86f6fca5bfa`。
- [x] 将母专题登记`published/approved`、T14.1至T14.3正式出版字段`published_new`；出版白名单显式加入T14的51来源事件审查门槛。
- [x] 独立出版Chrome使用`T14_PUBLISHED=1`，测试普通网站`?year=1843`，不能依赖`review19c`编审参数。
- [x] 正式出版[PR #516](https://github.com/1959124923wyz-sys/love-British-TV/pull/516) **48/48项CI全通过**（含无预览参数真实Chrome），合并SHA `c580550e911242a039ddc29bb77cb9d83399e3be`；[x] 正式版[Pages #44999746867](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44999746867) **build=success / deploy=success**；[x] 本轮已在Issue #499及双工作板完成最终交接。

原账剩余六组未结疑问继续按[独立来源GIS审计](../../../docs/research/19C_T14_CONQUEST_PLUNDER_SOURCE_GIS_AUDIT.md)追查，不因母专题发布而关闭。

## R2 · T14正式结案后的可追溯验收链

| 阶段 | 验收页面 | 实际核证 |
| --- | --- | --- |
| 母专题生产 | [制作PR #515](https://github.com/1959124923wyz-sys/love-British-TV/pull/515) | 49/49 CI成功，真实Chrome覆盖1843/49/56/58并双击返回；主分支SHA `5b97aede9766610784e983945585d86f6fca5bfa` |
| 制作版部署 | [Pages #44999188189](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44999188189) | build、deploy均成功 |
| 正式出版审核 | [出版PR #516](https://github.com/1959124923wyz-sys/love-British-TV/pull/516) | 48/48 CI成功；公开长篇无`review19c`的Desktop Chrome通过；主分支SHA `c580550e911242a039ddc29bb77cb9d83399e3be` |
| 正式版部署 | [Pages #44999746867](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44999746867) | build、deploy均成功 |
| 公开入口 | [1843年南亚历史地图](https://1959124923wyz-sys.github.io/love-British-TV/?year=1843) | 1843年米亚尼、1849年拉合尔、1858年阿瓦德证据链均可在已发表母专题中切换阅读 |

**最终审定**：T14母专题`published / approved`，T14.1—T14.3全部`published_new`。成果29节87段、30来源、51个复用事件（0重复新增旧案）、3具名地理参考点；阿瓦德旧界仅虚线、不填色、不计实控面积。尚未校验的Talpur家族财产、英印军原始战利品账、拉合尔国库和光之山移交原件、凯萨尔巴格逐件损失及1858—59实际失地/再授地籍都保持**开放待核**。

**下一主制作候选 R2 · T10「1840年代爱尔兰大饥荒：救济、饥饿死亡、逐佃与土地转手」**，与T14的原财务档案追索并行。
