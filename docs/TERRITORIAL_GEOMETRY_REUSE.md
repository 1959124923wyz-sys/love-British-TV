# 历史地理共享几何：数据结构与维护规范（2026-10-15）

## 修复背景

以前六份 `territorial-footprints-*.geojson`（1497—1599）每份包含完全相同的7个历史参考几何和566个地理坐标位置，后五份每份重复约48KB的原始JSON坐标。即使政治身份、治理时段和史料注释逐期变化，几何本身没有变化。将其全部复制，会浪费传输与解析资源，也增加无意漂移的概率。

**本次仅优化数据存放、加载和验证机制。不改变用户明确要求的简洁前台地图、不改变任何既有的透明度、颜色、虚线、事件点、路线、时期及面积判定。**

## 方案：一个几何基准 + 多年代状态

1. `data/territorial-footprints-1497-1549.geojson` 保留所有七项GeoJSON geometry，作为发布地图的**稳定几何基准**，其中的近代地理参考仍不等同于16世纪实测疆界。
2. `data/territorial-footprints-1550-1559.geojson` 到 `data/territorial-footprints-1590-1599.geojson` 均保留原有 Feature `id`、`properties`（包括政治关系、年份、证据、面积使用禁令等），以有效GeoJSON允许的 `geometry:null` 存储。新增 `properties.geometry_ref` 为基准中同名 `id`，且 `metadata.geometry_reference_file` 明确指向基准文件。
3. 前端通过 `js/territory-geometry.js` 的 `hydrateFootprints(canonical,period)` 将引用还原成完整的GeoJSON对象。经严格ID匹配后，复用同一个不可变坐标对象，不再深拷贝几何。读取器只填补缺失的几何，既不篡改年份，也不推定范围。
4. 对将来新增的历史疆界或修订地理形状：**允许在年代文件中为新Feature保留独立的实测/研究几何**，但须依原有历史地理审核流程审核，不能靠相似地名继承不相干的坐标；旧有七项几何不得静默替换。

### 示意数据（非新的历史证据）

```json
{
  "type": "Feature",
  "id": "calais-pale-sourced-places-approx-1497-1519",
  "geometry": null,
  "properties": {
    "geometry_ref": "calais-pale-sourced-places-approx-1497-1519",
    "source_place_id": "calais-crown",
    "start_year": 1580,
    "observed_through_year": 1589
  }
}
```

其余既有 `properties` 不应被删除；这里为阅读方便仅展示部分字段。

## 重要技术限制

- `geometry:null` 是有效GeoJSON表达，但**不能直接渲染为地理面**。从GitHub直接取用后续文件的研究者，须先运行共享解析器；如需独立导出标准完整GeoJSON，可使用 Node.js `require('./js/territory-geometry.js').hydrateFootprints(base,period)` 得到完整对象。
- 前端在加载完基准的七项Feature之后立刻保存**固定的基准快照**，随后加入各年的Feature，避免第七章添加后因重复ID混淆几何源。
- 引用错误、找不到原始几何或文件指向不允许的路径时，解析器抛出错误，不会自动随机选择形状或把空几何标成零占领面积。
- 默认的现代OSM地点对照底图、两项“版图/事件”开关、地图点击和研究资料卡都不受影响。

## 质量检查与验收

`node scripts/test_shared_territorial_geometries.js`：
- 校验七项基准地理、五个后续年代各七项严格同名引用；
- 校验原有每期属性和精度限制不丢失，hydrated轮廓精确复用基准对象；
- 确保丢失或重复ID、指向未知图形、额外误附几何、无效基准路径均被拒绝；
- 确保新增地图脚本在 `app.js` 之前载入，五期更新都经过解析器；
- 约束原始JSON重复坐标确实被消除。

原有第七—第十章编号相对应的 `scripts/test_chapter7_published.js` 等测试、1558年加来政治归属测试以及 `validate_published_data_references.js` 在解析后继续检查真实几何。Github Actions的UI合同和正式Pages发布加入共享几何检查。

## 回退说明

此变更独立分支和PR记录可用于回退。若将来彻底迁移数据格式，须先完成**相同年份地理渲染、点击、疆界不确定性和历史政治状态的逐像素/代码验收**。优先避免为小幅性能改善引入改变前台地图效果的风险。
