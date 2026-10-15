# 1549年诺福克：诺里奇—Mousehold—杜辛代尔历史军事空间专项修补

**研究日期：2026-10-16；阶段：候审生产补丁；主图维持已批准“版图/事件”双层以及淡色虚线语义。**

## 结论

1549年凯特起义是**英格兰国内反圈地政治社会冲突**，不是殖民征服、不是英格兰王室扩张边界。
王室军对起义者进行军事镇压，27 August 1549 在杜辛代尔决战击溃起义军，史学研究引述约2,000—3,000名起义者战死，但**战场阵亡≠被军队直接处决的平民**；战后另有俘虏处决、凯特兄弟在12月被绞死的记载。
另有史料指责部分诺里奇城门和谷仓在起义军战斗过程中毁坏，**不可悉数归咎王室军**。

## 时序与地点链（经纬度均为现代参照）

| 日期 | 发生地与实际主体 | 补图形式 | 史料 |
|---|---|---|---|
| 7月8日前后 | 怀蒙德姆：居民拆除圈地，罗伯特·凯特加入反抗 | 新Point，现代城镇参考 | Newcastle University; Norfolk Record Office |
| 7月12日起 | Mousehold Heath：起义营地、反圈地诉求与地方代表会议 | 新Point，现代Kett’s Heights/St Michael遗址附近位置，**不是1549年营界** | Newcastle University |
| 7月下旬 | 诺里奇：起义者进入城内并击退北安普顿侯爵王室军 | 新Point，现代市内中心参照；反抗方独立记录 | Newcastle University; Hodgkins 2015 |
| 8月24—26日 | 诺里奇街巷：沃里克王室军与起义者交战并逐步重新占领市区 | 新Point + “诺里奇—Mousehold”局部示意区 | Hodgkins 2015; Carter 1983 |
| 8月27日 | 杜辛代尔：王室军决定性胜利，大量起义者战死 | 既有GAP1549-KETT重写来源/精度 + 新的杜辛代尔候选谷地面 | Hodgkins 2015; Carter 1983; Norfolk HER |
| 8月末 | 诺里奇北侧：王室军在战后处决部分俘虏 | 新Point，只指向北城；无确定绞刑架、遇难者人数、具体外廓 | Norfolk Record Office |
| 12月7日 | 诺里奇城堡：罗伯特·凯特被处决 | 新Point，现存城堡现代遗址参照 | Norwich public heritage; Norfolk Record Office |
| 12月7日 | 怀蒙德姆修道院：威廉·凯特被处决 | 新Point，官方修道院中心坐标，不是确认绞刑地点 | Newcastle University; Wymondham Abbey |

**解释差异：** 学术文献给出的起义者进入诺里奇日期（22、24、29 July等）存在不同的叙事界定：首次突入、占城、抵抗王室兵力等过程不宜合并为单个毫无争议的“7月22/29日占城”。地图以“7月下旬”处理，并不声称持续每天完全控制全市。 

## 制图措施

原研究图 `en-kett-1549-norfolk` 曾为约 [1.03,1.49] × [52.53,52.73] 的**县域近似矩形**，用户难以分辨实际事件涉及地。现改为城区、Mousehold近邻的不规则地方阅读示意，同时新建 `en-kett-1549-dussindale-valley-research` 局部候选谷地区。

杜辛代尔战场的**地理推定基础优于普通猜测**：
- Anne Carter，*The Site of Dussindale*，Norfolk Archaeology，1983，依据 Norfolk Record Office 1589年Mousehold Heath旧图（NRO MS 4547）、William Cooke 1718绘图、1576 Postwick庄园册、1812圈地地图，指向Thorpe St Andrew / Postwick / Great Plumstead一带，Green Lane / Boundary Lane附近古谷地。
- Alexander Hodgkins，*Reconstructing Rebellion: Digital Terrain Analysis of the Battle of Dussindale (1549)*，Internet Archaeology 38 (2015), DOI:10.11141/ia.38.3，采用地图回溯/坡度建模分析谷地；明确战场**确切范围仍未最终确定**。

两面**均为手工概略阅读包络**，不是从上述论文图中提取测量点坐标，更不是史料认可的边界；面积统计全部排除，区域被渲染成淡色虚线，低倍率采用像素小圆提示。

**拒绝补充的伪精度：** 杜辛代尔战死者逐人坐标、1549年王军全部精确阵地、诺里奇被烧每栋建筑的分布、凯特营地真实栅栏、诺福克整郡被烧与英国新增实际土地面积。没有史料GIS支持，不标“精确占领区”。

## 主要可复核来源

1. Hodgkins 2015：<https://intarch.ac.uk/journal/issue38/hodgkins_index.html> 及 <https://intarch.ac.uk/journal/issue38/3/4-1.html>
2. Carter 1983，存于 Archaeology Data Service：<https://archaeologydataservice.ac.uk/archiveDS/archiveDownload?t=arch-3749-1/dissemination/pdf/vol_39/NorfolkArchaeology39_P54_P62.pdf>
3. Newcastle University，公共地与凯特起义：<https://research.ncl.ac.uk/wastesandstrays/wastesandstraysblog/ketts-rebellion/>
4. Norfolk Record Office，反圈地及王室镇压：<https://norfolkrecordofficeblog.org/2018/09/17/lord-willoughby-and-the-time-of-rebellion/>
5. Norfolk Historic Environment Record（已纳入旧章节）：<https://www.heritage.norfolk.gov.uk/record-details?uid=%27TNF107%27>
6. Visit Norwich 罗伯特·凯特历史：<https://www.visitnorwich.co.uk/service/robert-kett/>
7. Wymondham Abbey 官方建筑定位：<https://www.wymondhamabbey.org.uk/visiting/>

## 上线验收

1. `1548` 完全不得出现1549凯特组的点或面；`1549` 必须有新7事件+原杜辛代尔总事件，以及**恰好两片诺福克地区虚线**（不是整郡）。
2. 鼠标/触摸事件选择右侧详情正确带来源；不可把落点精度写成实测战场外廓；王室/起义者行动主体应单独显示。
3. `世纪、五章节卡、逐年拖动、版图/事件` 与原来一致，年度事件总数逐年增加；先前49—1548数据及18世纪占位不变。
4. 旧事件 `GAP1549-KETT` 只加强内容，不再复制一个同年“杜辛代尔决战”新事件造成重复计数。
5. CI通过、真实浏览器检查通过并且合并，Pages发布成功后才能称已上线。
