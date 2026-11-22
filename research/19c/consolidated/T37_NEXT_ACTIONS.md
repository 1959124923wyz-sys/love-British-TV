# T37 长期待办｜1868 马格达拉远征、文物掠夺与回流

**维护日期：2026-11-22。** T37.1 / 原案 C10。按 `START_HERE.md` 执行，历史史实、地图与发布状态分轨；来源不足时不画英控Polygon。T26原11项长期未核问题保持原样，T46为本专题后的下一主制作顺位。

## 首轮制作门禁

- [x] 核对最新主分支：T37 无独立已注册专题，1860s/1870s年表没有对应 Maqdala 事件，原研究 C10 分拆自混合卷
- [x] 核对维多利亚与阿尔伯特博物馆、英国博物馆、英国图书馆、英国国家陆军博物馆、1871年议会辩论和研究论文的核心证据
- [x] 12节独立长篇及正式年表事件全部注册，保持原 C10 事件号的回溯关系
- [x] 将史实具名点和有据端点连接线加入1860s和1870s GeoJSON，所有未经复原边界仅用虚线，历史国土面积不增
- [x] 新增专项CI并核验 GitHub Actions [T37 #44979476836](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44979476836) facts-and-map与desktop-map-interactions均成功，整个PR [36/36工作流全绿](https://github.com/1959124923wyz-sys/love-British-TV/pull/505/checks)
- [x] 桌面Chrome验收1867→1868→1871→1872、正文跳年定位、双击事件/返回、1899地图连续性；截图保存在Actions T37桌面proof artifact
- [ ] **人工交互补测**：分别点击地图版图/事件图层开关、缩放叠加遮挡顺序，并核真实桌面浏览器上虚线显示；该项与已通过的日期跳转脚本分开
- [x] [PR #505](https://github.com/1959124923wyz-sys/love-British-TV/pull/505) 合并SHA `2cdc3ed1a23293a49be0b06d9fcb4d0005dda18f`；[Pages #44979833161](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44979833161) build及deploy成功；专题仍为 `editorial_review/not_submitted`

## P1 史料、地理和数字缺口

- [ ] **BL `IOR/X/12126/13、/15、/19—/23`**：取英国图书馆原测图、比例尺、出版/测绘日，配准 Aroge 战场、Maqdala 堡墙和 Delanta 军营；现有历史地名的现代GPS仅可作参考，北欧非洲研究所2005年地名资料新增Mekdela Maryam教堂近址11.35N/39.18333E作为可追溯定位锚点；仍须核原高原与堡墙、另比对11.2与11.4333的现代地名歧异。
- [ ] **Richard Rivington Holmes/英军拍卖原册**：逐笔核1868-04-20至21德兰塔竞买人、卖品、实际收款与军队分红；不要将“所有被掠物”统统归为正式拍卖。
- [ ] **V&A 手稿`MSL/1869/185/1`**：1868-11向W. H. Saunders购买一组藏品的入账与签收，补Saunders的上一手及手稿原在马格达拉哪处教堂；约£15为全组购价。
- [ ] **冠杯原宗教权属与政府寄存**：Qwesqwam教堂旧清单、1871议会动议、1872英国财政部移交/押存、2005 V&A永久入藏，四种事实分别登记；追溯有无实际购买支出。
- [ ] **British Library `Or 607`**：查题记、旧British Museum入藏登记与Wright 1877 p.142，查清1868批次、实际运输路线和个人经手人之区别。
- [ ] **埃塞俄比亚国内教会、修道院与地方记述**：恢复当地受害、毁损及归还诉求的可证史料，纳入先前Tewodros二世将教堂宝物转移至Maqdala的上一段经历。
- [ ] **1872 Yohannes IV归还请求**：查致Victoria原函、英国回函和实际交接账，核《列王荣耀》与圣像各自结果。
- [ ] **伤亡及毁城估值**：原军报、埃塞俄比亚材料分列，不从英方单一估计推定全部战亡、建筑损失或总掠夺数额。

## 后续顺位

T46「澳大利亚边疆殖民扩张与暴力」，先核五章、98条制图研究线索及其与既有Pinjarra/Myall Creek等正式地图事件去重；不使用现代州界描摹历史殖民实控范围。

## 证据入口

- [V&A：2026 Ethiopia collections](https://www.vam.ac.uk/articles/ethiopian-collections-at-the-vampa)
- [British Museum：Maqdala collection](https://www.britishmuseum.org/about-us/british-museum-story/contested-objects-collection/maqdala-collection)
- [British Library：Or 607](https://searcharchives.bl.uk/catalog/032-003352898)
- [British Library：IOR/X/12126测绘图目录](https://searcharchives.bl.uk/catalog/037-004282410)
- [National Army Museum：Abyssinia](https://www.nam.ac.uk/explore/abyssinia)
- [1871 Hansard冠杯讨论](https://api.parliament.uk/historic-hansard/commons/1871/jun/30/motion-for-an-address)

## 2026-11-22 GitHub发布验收实录

- [制作PR #505](https://github.com/1959124923wyz-sys/love-British-TV/pull/505)：36/36 GitHub Actions成功后按squash合并至`main`，SHA `2cdc3ed1a23293a49be0b06d9fcb4d0005dda18f`。
- [T37专项 Actions #44979476836](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44979476836)：两项jobs成功（史料/GIS静态契约、桌面Chrome1867—1899交互），产出`19c-t37-maqdala-desktop-proof`截图凭证。
- [GitHub Pages #44979833161](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44979833161)：`build`与`deploy`均成功。预览入口 <https://1959124923wyz-sys.github.io/love-British-TV/?review19c=1&year=1868>。
- 原案C10原始2项待核与本清单的实测图、购买链、教会原文仍留未勾项；严禁将当前版本标为史料最终批准。下一个主制作专题T46。
