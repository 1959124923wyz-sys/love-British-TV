# PR #27｜1540—1549年定向缺漏审查与收口结论

2026-10-13 · 仅供编辑审稿 · 从`research/territorial-1540-1549-20261013`原分支继续提交。严格遵守用户要求：**优先修正真正影响地图的漏绘或错误年份；查不清的古界用虚线参考，不再耗费时间，不阻塞第六章。**

## 影响地图正确性的主要缺口与结论

| 级别 | 发现 | 审查和最终处理 | 状态 |
| --- | --- | --- | --- |
| P0 | 布洛涅城之外Ambleteuse英军堡垒漏绘 | 1958年《Revue du Nord》Héliot研究给1546年4月开工；Ambleteuse法国市镇官方史确认1549年8月24日法军炮击、25日攻陷英军城堡。新增地点Point、1546—48年英占状态、两条历史事件与1549年退出。 | 已在PR #27修复 |
| P0 | Mont Lambert/Boulemberg英军外围炮台漏绘 | Héliot 1958给1546年5月开工，记载1549阿姆布勒特斯失守后英军撤出，法国据其控制高地；王室收藏1549历史军事图佐证布洛涅外围炮台空间关系。新增现代Mont Lambert参考点/虚线、1546—48英军驻守、1549退出。 | 已在PR #27修复 |
| P0 | 1549边区据点消失与布洛涅城依旧英占容易混淆 | 时间状态强制分离：阿姆布勒特斯与Boulemberg 1549年退出；布洛涅城区到1549年末仍为英军驻地，1550年另经史实退出。1550研究种子内两外围堡明确已于1549结束。 | 已加机器校验 |
| P1 | 布洛涅1544夺城日期此前仅有月份 | Héliot史料载1544年**9月13日**投降；已在年表、编辑候审及控制台账记录这一天。 | 已在PR #27修复 |
| P1 | 苏格兰临时占领据点控制断档 | 已有英军洛赫马本1544/45、因奇科姆1547/48、哈丁顿1548/49进退；此次检查发现并保留这些年份，未清掉Broughty、Eyemouth及Lauder的持续占领。 | 旧资料已解决，现经回归检查 |
| P1 | Hailes 1549年控制继续还是终止 | 现存权威资料确认1548英占和驻军，但不足以在短时间内确认1549命运。保持`uncertain_continuity`，不上确定英军实色，不擅定撤退年。 | 未判明，**明确跳过** |
| P2 | 都铎Ambleteuse、Boulemberg堡墙与Boulonnais乡村边界 | 1549王室版画属绘景/示意，Héliot图为现代学术说明；均无可直接授权的高精度1546军政边疆矢量。采用现代村镇Point与轻填色**虚线位置示意**；代码字段禁止面积统计和确界声称。 | 未测得古界，**不阻塞主编** |
| P2 | 爱尔兰1541法权、1543封爵的真实地方执行 | 英王名义称号与盖尔领主实际控制不能混同，全岛面积未证实。保持法律事件和间接政治状态，不虚构统一英王直辖区。 | 原有限制有效，继续跳过 |

## 可快速复核的核心史料

1. Pierre Héliot (1958), “Les fortifications de Boulogne sous l'occupation anglaise (1544–1550),” *Revue du Nord* 40(157), pp. 5–38, DOI 10.3406/rnord.1958.2255。开放研究入口：<https://www.persee.fr/doc/rnord_0035-2624_1958_num_40_157_2255>。条目载9月13日1544布洛涅投降、1546年4月Ambleteuse施工、同年5月Mont Lambert炮台开工、1549年法军攻取外围据点后的英军撤离。**研究论文不是16世纪原始可复制GIS图。**
2. 法国Ambleteuse市镇历史：<https://ambleteuse.org/histoire/>。详述1549年8月24—25日法国军夺英军堡垒，法国市镇中心GPS只是大致地点；17世纪Vauban海堡与1546英军堡不同，不能拿晚建建筑描边。
3. Royal Collection Trust, RCIN 721017, *View of Boulogne, 1549*：<https://militarymaps.rct.uk/other-16th-century-conflicts/view-of-boulogne-1549-boulogne-nord-pas-de-calais-france-50deg4300n-01deg3700e>。仅用作英法防线及英军外堡相对位置参照，原图未地理配准、不可擅自翻描其图线。
4. Cambridge University Press, Neil Murphy (2019), *The Tudor Occupation of Boulogne*，为殖民占领和农村土地政策的学术主干。此轮确认其目录和相关章节确实存在，但未逐页获取受限原著。
5. 苏格兰历史环境局HES：<https://www.historicenvironment.scot/visit/all/broughty-castle/history-and-stories/>、<https://blog.historicenvironment.scot/2017/10/tudor-warships-ahoy/>、<https://blog.historicenvironment.scot/2022/07/the-story-of-scotlands-longest-siege/>。旧资料苏格兰英军局部进退的可信依据。

## 地图回归测试清单

主编在正式图层审稿至少核对：1544年布洛涅加入（1544-09-13）；1545年Lochmaben英军退出；1546年Ambleteuse和Boulemberg进入；1547年Broughty/Eyemouth/Inchcolm进入；1548年Inchcolm退、Haddington/Lauder进；1549年Ambleteuse和Boulemberg退、Haddington退，**布洛涅城仍在**；Hailes保持未经证实继续状态。1549→1550交接亦必须清掉两座已在1549失守的法国外堡。

对接文件：`CHRONOLOGY.json`、`ATLAS_REVIEW_CANDIDATE.json`、`ACTIVE_CONTROL_PLACES_1540_1549.geojson`、`MAP_REFERENCE_OUTLINES_1540_1549.geojson`、`MAP_DELTA_1540_1549.geojson`、`CONTROL_TRANSITION_1539_1549.json`、`TRANSITION_1549_1550_RESEARCH_SEED.json`、`validate_research.py`。

**自动化注意**：本分支`.github/workflows/1540s-research-quality.yml`已由仓库维护调整为**仅手动触发**；本次没有擅自恢复自动Push/定时验证，以免重复发送GitHub故障邮件。可以本地运行`python3 research/periods/1540-1549/validate_research.py`。本轮GitHub主站UI与连续性常规检查状态、以及内部静态结构审核情况需分别记录，**不把旧SHA成功状态套用到新增数据**。

## 最终准入建议

**数据基础已具备主编选择性接入资格。** 未核准确历史墙界、没有一手账本金额和不确定Hailes持续状态不是本章阻塞原因。实际主站正式上线仍由主编按已批准交互、地理免责、来源与地图可视效果逐项确认；本次只修改PR #27研究资料，不修改`main`。
