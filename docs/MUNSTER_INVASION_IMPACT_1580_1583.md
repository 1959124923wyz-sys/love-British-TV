# 爱英TV｜1580—1583 芒斯特战争“英军入侵影响区”首批试点

**研究审核：2026-10-15。主题：英王军队的焦土军事行动、战争引发的农业破坏、饥荒及后续土地攫取。**

## 1. 已证史实与地理表达的区别

**证据支持：**

1. 1580年3月，英王官员 William Pelham 与 Earl of Ormond 在今Co. Limerick的Rathkeale会师，随后在Limerick和Kerry发动毁灭性的军事扫荡，攻取Carrigafoyle，处死守军；当年6月再次进入Kerry沿海并进行破坏性远征。[皇家爱尔兰学会《爱尔兰人物传记辞典》Pelham条](https://www.dib.ie/biography/pelham-sir-william-a7261)，仓库引用 `C10-S53`。
2. 1580年卡里加福伊尔围城、守军被处死。[Heritage Ireland Carrigafoyle](https://heritageireland.ie/unguided-sites/carrigafoyle-castle/)，仓库 `C10-S52`。
3. 同年斯梅里克 Dún an Óir 存在另一次英军围城及投降后人员被屠杀的记录，**不是Pelham三月进军的同一事件**。[Heritage Ireland Dún an Óir](https://heritageireland.ie/unguided-sites/dun-an-oir/)，仓库 `C10-S01`。
4. 1579—1583年的Desmond rebellion席卷Munster，战斗、摧毁生计的行为和人口流失造成严重经济与人口后果，随后英王当局实施土地没收和殖民安置。[Anthony M. McCormack, *Irish Historical Studies* 34 (2004), pp.1–15, DOI 10.1017/S0021121400004053](https://doi.org/10.1017/S0021121400004053)，仓库 `C10-S54`。该论文的参考文献含1582年政府官员书信（SP 63/91/41等）。
5. 1584—1586年对Desmond失地的调查、土地重分配有可核查档案。[UCC CELT, *The Desmond Survey*](https://celt.ucc.ie/published/E580000-001/text004.html)；皇家1586年殖民条款在 `text005.html`，仓库 `C10-S69`。**现有地图不能把1586年法律授地直接绘制为1586年全部实控面积。**

**证据不支持：**

- 不能复原1580年英军每一天确切的扫荡边缘；
- 不能由史料中出现三个地点，就认定这些点之间的全部村庄都被烧毁；
- 不能把整片Munster战争/饥荒区视为英王殖民地或英军占领区；
- 不能把多方交战导致的全部饥荒与流离都无差别归因于英军；英军焦土毁粮是重要有据因素，战争其他参与方的暴力同样存在；
- McCormack脚注77将英国官员对“六个月三万人”死亡的估计作为**缺乏独立验证的可能上限**，不能做成地图确定人数。本次无新增受害人数。

## 2. 已创建的两幅“研究示意面”

`data/tenth-invasion-impact-areas-1580-1583.geojson`

| 年份 | 范围对象 | 数据与界面语义 |
| --- | --- | --- |
| 1580 | 利默里克—凯里英军入侵、围城及扫荡影响区 | 综合Rathkeale、Carrigafoyle、Smerwick等有据事件的具名地理范围。**不同事件独立记述**。无持续英方治理主张。 |
| 1581—1583 | 芒斯特战争破坏、饥荒与英军焦土政策波及区 | 地区级概略示意；不声称每块土地均遇袭、不假设军控边界，不使用估计面代表死亡分布。战争参考面在1583年后退出，**不代表后果已于1583年结束**。 |

两幅地图面均为制图者依据史料涉及的地区和现代地点手工建立的**概略阅读包络（illustrative regional envelope）**，不是按1580年原始地图测绘的边界，也不能依据它们统计真正的受影响平方公里。图形围绕有史料的地名区域，顶点本身并无古代测绘证据。它们必须在地图上始终使用**淡红色半透明填充与虚线**。高亮不等于精度。

采用“**英军入侵影响区**”一词，只用于军队实际入侵/袭扰有据之处；1581—83的面积明确写“战争破坏与英军焦土政策”，避免暗指只有英军参与全部暴力事件。

## 3. 界面和时间契约

- 两项研究面属于用户现有“版图”开关，不增加独立常驻开关、警告框或夸张动画。
- 仅1580—83逐年出现。1580显示Pelham、Ormond等1580有据军情；1581—83换为持续战乱的区域级叙事，1584以后不再显示。
- 简介一行，详情抽屉提供确切引文链接、关联历史事件及区分控制/行动的解释。
- 点击与年份变化不修改地图中心或缩放，不影响默认OSM古今对照底图。
- 完整的原始论文、官方遗迹页、研究证据仍在相应事件和source_ids中；用户没有要求前台显示复杂的精度说明，**只在资料卡和后台保留必要限制**。
- `historical_boundary_confirmed=false`、`fill_authorized=false`、`territorial_claim=false`、`area_sqkm=null`、`exclude_from_area_aggregation=true` 均为不可省略的机器校验。
- 时间轴默认不得提前显示未来事件，例如1582年的资料卡不得出现1583年发生的事件链接。

## 4. 后续升级方向（尚未承诺已经复原）

基于英国国家档案馆的[1558—1610爱尔兰历史地图目录](https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/irish-maps-c1558-c1610/) 与UCC的Desmond/Peyton 1584—86 land surveys，可以继续审查当年地契庄园位置，若找到公开可复核的原始历史地理图像并可合理配准，另建“没收土地与实际承领区”的逐年图层，而不是继续扩大1580—83战争影响区。

同一规范可扩展到1540年代英苏战争、1586加勒比劫掠、1590年代爱尔兰镇压；但不同地区不能照搬本图形点位，仅能复用**分类字段、时间门槛、史料链接与虚线表达机制**。

## 5. 验收

- `scripts/test_munster_invasion_impact.js` 检查年限、学术及官方source IDs、事件挂接、图形闭合、具名锚点与研究包络关系、禁止面积量算；
- `scripts/validate_published_data_references.js` 检查新文件中坐标合法及已有事件、source_id 依赖；
- `scripts/browser_smoke.py` 截图并校验1580/1582表面逐年出现、1585消失、无未来事件泄露，点选资料卡能提供文献。

本试点的目标是把有史料记录的区域性英军暴行**直观化**，不是将示意图偷偷升级成真实疆域。
