# T37｜马格达拉远征与文物来源 GIS 审计（2026-11-22）

**专题** T37.1 / C10；已完成十二节母篇及读者正式发表：`published/approved`（PR #507、35/35CI、Pages #44981515205）。**此批准适用于已核的历史叙述、事件时间和非领土GIS参考点；下列档案研究缺口仍按原卷追查。**

## 原研究与新正文关系

- C10-E01 原Qwesqwam宗教供奉、C10-E02 特沃德罗斯二世迁移圣物为背景；不能把18世纪供奉标作1868年掠夺。
- C10-E03 攻取马格达拉、英军掠夺拆为不同可点击事件；1868年4月17日焚毁另按埃塞俄比亚史著及英国史料登记。
- C10-E04 为1868年4月20—21日军方德兰塔拍卖；部分文物未经过这一拍卖，绝不冒称每件战利品的共同来源。
- C10-E17 对应British Library `Or 607` 的1868年 Magdala Collection；藏品批次不等于单件拍卖/运输完整链。
- C10-E10 对应 V&A `MSL/1869/185/1` Aleka Zeneb的《诗篇》及1868年11月Saunders售给南肯辛顿的那组物品，约£15是**一组购价**。
- C10-E11 为1871-06-30议会争论金冠与圣杯；**动议不是收据**。C10-E05 为1872年英国财政部南肯辛顿寄存；勿倒写为2005年馆藏所有权转入。

## 史料与地点的边界

Maqdala堡垒、Aroge战场及Delanta拍卖营地的1868年实测轮廓均未复原。British Library馆藏目录 `IOR/X/12126` 列出远征军实测图，需要取源图、年份和比例尺后配准。Maqdala历史高原与现代Amba Mariam定位曾出现明显歧异：Getty TGN 11.4333°N/39.2833°E，Wikidata衍生地名库11.2°N/39.2833°E。经重新比对北欧非洲研究所保存的Bernhard Lindahl《Local History of Ethiopia: Mek–Mekwenta》（2005）第12/40页 HEE58，Mekdela Maryam教堂记录为11°21′N/39°11′E，处于历史Mekdela高原西南。**正式站新增点与虚线所用参考端点改为高原附近11.35°N/39.18333°E，并明确它是教堂附近地名参考，不是1868堡墙或战场实测中心。** 实测仍须British Library IOR/X/12126/19—23测图配准。

拟绘GIS图元：孟买出发、Zula驻点、Maqdala攻堡/劫掠/焚毁、Delanta拍卖、伦敦BM与南肯辛顿购藏、1871议会、1872财政部寄存；两端点之间有据顺序线（孟买→Zula、Zula→Maqdala、Maqdala→Delanta）仅画虚线、无面积。不以战地或航线转换为英国治下领土。

持续政治控制与时间表：1867英印远征启程；1868短期攻城、焚毁、拍卖，英军撤离；1871—72伦敦文物审议、寄存及埃塞俄比亚返还要求，**不延续1868英军政治控制为1880、1890年代的领土**。未经同期实测不输出Polygon及殖民面积。

## 史料入口

- [英国国家陆军博物馆](https://www.nam.ac.uk/explore/abyssinia)
- [V&A 埃塞俄比亚藏品来源研究](https://www.vam.ac.uk/articles/ethiopian-collections-at-the-vampa)
- [V&A Aleka Zeneb手稿](https://www.vam.ac.uk/articles/rediscovering-the-story-of-an-ethiopian-manuscript-at-the-vanda)
- [英国博物馆马格达拉藏品](https://www.britishmuseum.org/about-us/british-museum-story/contested-objects-collection/maqdala-collection)
- [英国图书馆 Or 607](https://searcharchives.bl.uk/catalog/032-003352898)；[IOR/X/12126测图目录](https://searcharchives.bl.uk/catalog/037-004282410)
- [1871英国议会原文](https://api.parliament.uk/historic-hansard/commons/1871/jun/30/motion-for-an-address)
- [历史研究：British Museum与远征](https://onlinelibrary.wiley.com/doi/10.1111/1468-229X.13439)；[Historical Journal对事前征集的研究](https://www.cambridge.org/core/journals/historical-journal/article/planned-plunder-the-british-museum-and-the-1868-maqdala-expedition/3109780C72D6A3E24D6B5A5387B6087C)

**后续查档和CI清单：** [T37_NEXT_ACTIONS.md](../../research/19c/consolidated/T37_NEXT_ACTIONS.md)。

## 2026-11-22 GIS坐标纠正原始依据

- [Nordic Africa Institute，Bernhard Lindahl, *Local History of Ethiopia: Mek–Mekwenta*（2005），p.12/40 HEE58](https://nai.uu.se/download/18.39fca04516faedec8b248e19/1580829013197/ORTMEK05.pdf)：Mekdela Maryam教堂11°21′N、39°11′E，位于Mekdela高原西南。
- [Getty TGN现代Amba Maryam条目](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=7003249&nation=&place=&subjectid=1089703)：11.4333°N、39.2833°E，现代地名记录；与历史高原近址不能直接当作同一点。
- 1868英国战地测量图I/O/R馆藏目录只确认图件存在，本轮未从中矢量化任何堡墙或战场Polygon。

## 正式出版审查与未解决史料分层

- 已审已发表：1867—1868英印远征、4月10日Aroge、4月13日攻堡、4月17日焚毁、4月20—21日德兰塔拍卖，英国馆藏冠杯、BL Or607、V&A Aleka Zeneb手稿和1871议会/1872寄存；来源NAM、V&A 2026、BM、BL和议会史料及史学研究。
- 未作事实过度推导：军方拍卖总实收/每件成交款、所有被掠宗教物品的完整数、损失总体金额、阿罗格死伤全额、历史堡垒实控地籍范围、Saunders每一次转手、埃塞俄比亚教会原账。数据继续保留证据精度和虚线权利状态。
- [正式发布PR #507](https://github.com/1959124923wyz-sys/love-British-TV/pull/507)合并SHA `58590ac07f40060d6efcdcfce5ef45fc19072901`，[Pages部署 #44981515205](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44981515205)；正式入口<https://1959124923wyz-sys.github.io/love-British-TV/?year=1868>。
