# 无现代国名的历史地图自然地理底图：P0修复（2026-10-15）

## 问题与决定

1589年用户截图出现现代的 United States、United Kingdom、Deutschland 等名称，是旧版 `tile.openstreetmap.org` 标准街道底图在16世纪年份下显示当代标签的直接结果。这不是16世纪英国与苏格兰真实疆界数据。历史视图不允许将当代国家政治标签隐性混入主地图。

## 修复

- 将Leaflet的默认在线瓦片改为 **NASA GIBS / BlueMarble_ShadedRelief_Bathymetry** 物理影像。此层没有现代国家、市镇、道路名称，也不画当代国家边界。它体现**现代观测的自然地貌与海底地形**，不声称复原历史海岸线、16世纪植被或气候。
- GIBS Web Mercator 图块采用 `GoogleMapsCompatible_Level8`，Leaflet固定 `maxNativeZoom:8`。网站允许缩放至11级，但8级之后影像仅放大插值，绝不可声称高倍缩放获得更精准的历史疆界。保留原应用Zoom事件、主权及历史地理绘制程序。
- NASA底图服务连续报告3次错误时移除该底图，异步加载仓库内的 **Natural Earth 1:110m land-only TopoJSON**，以本地的简洁陆地轮廓替代。该文件没有政治国界/国家名称，来自公共领域的Natural Earth物理数据，由 `cublya/world-atlas` 以TopoJSON形式再分发。fallback渲染放在原瓦片之下，`interactive:false`，不挡战区及事件点击。
- 地图署名指向NASA GIBS，图例文字说明地形参考仅是现代自然地理；历史政治实体仍由经过审核的年代图层及相关档案解释。无CARTO、Esri或其他需用户自行设置API Key的依赖。
- `scripts/browser_smoke.py` 识别PNG或JPEG瓦片地址，防止将旧格式写死造成历史交互测试的假失败；`scripts/test_historical_basemap.js` 防止现代街道瓦片回归，并加入CI与Pages部署门禁。

## 需要明确保留的局限

1. 这是**现代自然地理参考底图**，不包含历史测绘。图上仍有当代地貌表现，不能从它推断英国殖民统治面积。
2. 在高倍放大下，NASA影像可能显得模糊；本地1:110m兜底在局部地区也较粗略。本次仅消除 P0 时代错置的底图**国名和政治边界**，不解决所有精细地形需求。
3. NASA GIBS 是外部网络服务，仓库回归可验证代码结构，但真实线上可用性需浏览器实测，服务未加载时触发本地无国名fallback。不要静默换回OpenStreetMap现代标注底图。
4. 现有 `data/modern-uk-regions.topojson` 是**独立的现代地理参考**，它的政治解读与真实历史政体不得混同；本次不擅改既有已批准的历史图层。
5. 本次只修改**底图与其校验**，不更改任何历史事件、航迹、领土面、政治归属或年份。

## 来源与许可

- [NASA GIBS APIs](https://nasa-gibs.github.io/gibs-api-docs/)，[GIBS影像使用致谢](https://nasa-gibs.github.io/gibs-api-docs/)：建议致谢NASA GIBS。图像署名在地图上可见；来源非16世纪历史地图。
- [NASA Earthdata数据使用与引述政策](https://www.earthdata.nasa.gov/engage/open-data-services-software/data-use-policy)：教育、信息性使用的数据共享与署名要求。
- [Natural Earth物理矢量图](https://www.naturalearthdata.com/downloads/110m-physical-vectors/)，[Natural Earth仓库](https://github.com/nvkelso/natural-earth-vector)：公共领域物理地理。
- [world-atlas](https://github.com/cublya/world-atlas)：Natural Earth 数据的TopoJSON再分发（land-only），本地归档保证第三方服务不可用时依然没有现代政治标签。
- [CARTO底图条款](https://www.carto.com/legal/basemap-terms/)及[Esri Static Basemap Tiles文档](https://developers.arcgis.com/documentation/mapping-and-location-services/mapping/basemaps/introduction-static-basemap-tiles-service/)：由于当前授权要求，未选择未经批准或无密钥的商业瓦片直链。

## 验收

CI需通过 `node scripts/test_historical_basemap.js` 及此前所有章节、地图交互和地理数据校验。Pages实际发布前，对1497、1548、1589、1599的全球和英伦视图截图比对：不得出现 United Kingdom / United States / Deutschland 等现代底图国名；应保留完整历史点、线、面和点击功能。网络断开时应显示本地陆地示意，而不是退回现代行政地图。
