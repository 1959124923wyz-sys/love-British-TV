# PROGRESS｜1520—1529年地图疆域与主编交接（调查2）

**2026-10-12 · 分支** `research/territory-outlines-1520-1529-20261012`。起点为当前`main`，全部新增仅在`research/cartography/1520-1529/`和专属GitHub Actions工作流。本轮没有修改`main`、`data/`、`app.js`、`index.html`。

## 远端GitHub已提交成功

| SHA（前12位） | 保存成果 |
| --- | --- |
| `1a1e1a58374d` | 8组相关权威史料入口、3组待查档号，区分1556测量和1520年代 |
| `5a890fffcbc2` | 7处跨年代概略GeoJSON：旧边界原样保留、全部不作面积计算 |
| `270d0ee295cb` | 加来、吉讷、都柏林3处城市控制/行政核心Point |
| `af96e1575ee6` | 10处已有研究证据的战事/遗址Point |
| `948a0c523941` | 24条候审事件、7政治地点、49引用，与地理文件挂接 |
| `e5daae7b85c9` | 1519七政治地点无损继承：6延续、图尔奈结束；十份年度状态 |
| `d85a402446db` / `6d4ac9199b5e` | 5处有时间意义的事件/治理地点变化；图尔奈经纬度从主干原样继承 |
| `fff6dfd14ce8` / `4872a3339426` | 汇总研究/编辑/地理来源与早期历史来源为76条可查source ID；如实保留7条旧ID待补详细目录 |
| `15ef727a93bb` | 自动检查程序，年份/来源/控制继承/GeoJSON精度/英法界线约束 |
| `9f9a148c50d7` | GitHub Actions独立校验，适用于研究分支push与PR |
| `5d39da199885` | Leaflet独立可逐年观看地图预览HTML，不影响正式网站 |
| `657609470cd1` / `ce62e8bf7b24` | README及主编最简交接说明 |
| `9e80c388b1d9` | 修复初轮机器校验发现的缺失历史政治类型字段，明确赋予7处地区各自历史关系 |

## 工程校验记录

- GitHub Actions `1520s research cartography validation`：**PR #17** 和 branch push 在 `9e80c388b1d9...` 提交上均获得 `success`。先前push的CI失败为新增GeoJSON缺`historical_control_type`字段；已修改并实际恢复通过。
- 同一版本GitHub Actions `Approved map UI contract`：**success**。旧主站v0.9/v1.2聚合交互没有被本分支修改。
- 校验脚本确认：24事件＋7主编候审地点＋49直接来源；上期7处状态100%解释（六持续一结束）；1520—29十份逐年快照；7概略区域几何和主干旧基线完全一致；3城市Point、10史址Point、5地图差异Point；76可追溯来源ID；**0个经过证明的新精确1520年代控制Polygon**。
- 不应混淆：以上为程序/资料链校验，并不表示一手原始文书逐页审毕，也不代表独立预览已经进行真实浏览器像素级验收；在线发布仍由主编执行。

## 给主编的固定入口

[EDITOR_HANDOFF.md](EDITOR_HANDOFF.md) → [ATLAS_EDITOR_CANDIDATE_1520_1529.json](ATLAS_EDITOR_CANDIDATE_1520_1529.json) → [APPROXIMATE_REFERENCE_OUTLINES_1520_1529.geojson](APPROXIMATE_REFERENCE_OUTLINES_1520_1529.geojson) → [CONTROL_CORES_1520_1529.geojson](CONTROL_CORES_1520_1529.geojson) → [interactive_map_preview.html](interactive_map_preview.html)。完整来源可下钻到研究员1的PR #8/#9以及连续性PR #10。

## 未解决的边界（需继续积累史料）

- 加来边区/吉讷农业租佃区：有政治归属和1529政策证据，但真正一手测量及是否适用于1520s需复核，外围虚线。
- 爱尔兰Pale：现代四郡面积不能当当期王权实际控制，1488旧法令线只是有据的地理参考，虚线。
- Monasteroris：攻占和驻军存在，撤军年份、所谓castle与修道院是否同址尚未核实，点标记。
- 苏格兰城堡：1523英军突袭不构成苏格兰主权并入英格兰，保留事件点。
- 可供下一期延续的关系只标为研究种子，1530年及以后仍需新史料复核。

## 恢复

GitHub PR #17 →本目录`EDITOR_HANDOFF.md`。修改本批数据后执行：
```bash
python3 research/cartography/1520-1529/validate_cartography.py
```
研究负责归档，不直接合并主站；编辑负责最终历史、UI与GitHub Pages审核。
