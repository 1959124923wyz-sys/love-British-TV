# 现代地点对照与无标签地形底图：双参考地图（2026-10-15）

## 问题与决定

1589年用户截图出现现代的 United States、United Kingdom、Deutschland 等名称，是旧版 `tile.openstreetmap.org` 标准街道底图在16世纪年份下显示当代标签的直接结果。这不是16世纪英国与苏格兰真实疆界数据。当代国名容易制造年代错置，但也有助于辨认今日地点；因此将现代参考底图与可核证的历史图层明确分离，在界面提供可切换的无标签地形视图。

## 更新决策：以古今对照为默认视图（2026-10-15）

使用者反馈更重视现代地名、道路作为历史地点参照。因此在不修改历史层的前提下，**将旧版 OpenStreetMap 标准街道底图恢复为默认**。现代国家名称只是**现代地点定位**，它们在16世纪并不具相应的政治、法律意义，也绝不能作为历史边界使用。

左侧「地图图例」提供已默认勾选的「显示现代地名与道路」选项；取消勾选转为无政治标签 NASA GIBS 自然地形图，再勾选即可恢复OSM。切换不触及地图中心、缩放、所选年份、历史点线面。两套瓦片分别按来源署名。无需商业API Key。

NASA Web Mercator 图片源 `BlueMarble_ShadedRelief_Bathymetry` 原生至8级，放大到11级时仅插值显示；其瓦片连续失败时，加载本地公共领域Natural Earth 1:110m land-only TopoJSON，不包含国家边界和国名。若用户切回OSM，该本地兜底自动消失，包括异步加载尚未完成的情况。

该改动继续保留自动历史数据和浏览器测试。新增底图开关回归检查，同时保持原两项「版图」「事件」开关语义不变。

## 需要明确保留的局限

1. 这是**现代自然地理参考底图**，不包含历史测绘。图上仍有当代地貌表现，不能从它推断英国殖民统治面积。
2. 在高倍放大下，NASA影像可能显得模糊；本地1:110m兜底在局部地区也较粗略。本次仅消除 P0 时代错置的底图**国名和政治边界**，不解决所有精细地形需求。
3. NASA GIBS 是外部网络服务，无标签视图故障时触发本地无国名fallback；OpenStreetMap 是用户明确选择的默认现代参照视图，不是NASA故障时的假历史底图。
4. 现有 `data/modern-uk-regions.topojson` 是**独立的现代地理参考**，它的政治解读与真实历史政体不得混同；本次不擅改既有已批准的历史图层。
5. 本次只修改**底图、底图选项与其校验**，不更改任何历史事件、航迹、领土面、政治归属或年份。

## 来源与许可

- [NASA GIBS APIs](https://nasa-gibs.github.io/gibs-api-docs/)，[GIBS影像使用致谢](https://nasa-gibs.github.io/gibs-api-docs/)：建议致谢NASA GIBS。图像署名在地图上可见；来源非16世纪历史地图。
- [NASA Earthdata数据使用与引述政策](https://www.earthdata.nasa.gov/engage/open-data-services-software/data-use-policy)：教育、信息性使用的数据共享与署名要求。
- [Natural Earth物理矢量图](https://www.naturalearthdata.com/downloads/110m-physical-vectors/)，[Natural Earth仓库](https://github.com/nvkelso/natural-earth-vector)：公共领域物理地理。
- [world-atlas](https://github.com/cublya/world-atlas)：Natural Earth 数据的TopoJSON再分发（land-only），本地归档保证第三方服务不可用时依然没有现代政治标签。
- [CARTO底图条款](https://www.carto.com/legal/basemap-terms/)及[Esri Static Basemap Tiles文档](https://developers.arcgis.com/documentation/mapping-and-location-services/mapping/basemaps/introduction-static-basemap-tiles-service/)：由于当前授权要求，未选择未经批准或无密钥的商业瓦片直链。

## 验收

CI需通过 `node scripts/test_historical_basemap.js` 及此前所有章节、地图交互和地理数据校验。Pages发布前，对1497、1548、1589、1599的全球和英伦视图截图比对：**默认OSM允许显示现代国名，仅供古今定位**；切至NASA无标签地形时不得有这些当代国名。保留历史点线面和点击功能；NASA故障时优先使用本地无国名地理参考。
