# 主编接入说明｜1530—1539年第五章

**研究分支**：`research/territorial-1530-1539-20261013`。本包提供已备份的真实资料和地理数据，无需从1520年代重新拼接。**全部待编辑审核，不得据此宣称Pages已发布。**

## 先接地图，后加事件

1. **继承上一年**：主干已发布`data/atlas-1520-1529.json`的7个地点：加来、都柏林、泽西、马恩、奥克尼、设得兰、吉讷。在`TRANSITION_1529_1530.json`逐条对应，额外有独立苏格兰王国；1530年不可直接清零。图尔奈1519年交还法国，不可再涂英王颜色。
2. **先加载大致轮廓**：`MAP_REFERENCE_1530_1539.geojson`有8个地理Feature。前7个从主干`data/territorial-footprints-1497-1529.geojson`原样复制；加来与爱尔兰Pale使用明显虚线、弱透明填充，群岛采用独立政治类型纹理；第8个威尔士现代区域仅辅助表现1535/36**内部法律改革**，虚线无历史精确边界资格。任何一项都不能混入`atlas.colonial_polygons`或累加面积。
3. **单列可确认统治核心**：`CONTROL_CORES_1530_1539.geojson`的加来、吉讷与都柏林为Point的示意像素城市面积符号。它们不证明城墙或周边农业控制界；吉讷是旧英王据点不是新占土地。
4. **不混淆特殊政治关系**：`POLITICAL_RELATIONS_1530_1539.geojson`显示王室属地、独立苏格兰群岛与马恩领主制度的不同图层；独立苏格兰绝不填英属殖民橙。根西现有参考polygon却尚无独立`atlas.places`地点，应另行复核再新增。
5. **审核年度史事**：`ATLAS_REVIEW_CANDIDATE.json`包含24事件、7地点、41源；地图同步参考`EVENT_SITES_1530_1539.geojson`中的9个有定位事件。未定位的北美航线、爱尔兰广大境内战事、全国法案不发明事件经纬度。1535年Maynooth城堡局部英王军攻陷与1534都柏林防守成功在地图上应呈现真实方向。
6. **主编保持网站交互**：读取1530年只出现截至1530年的历史事件；滚动滑块直至1539事件依真实年份逐步出现。地图视角/比例不自动变化，保留左栏与图标突出；双击左侧事件时应按已批准的编辑交互规则执行，不要被独立研究页面覆盖。
7. **核验**：`python3 research/periods/1530-1539/validate_research.py`；随后浏览器检查1529→1530，1533 Calais，1534 Dublin失败围城，1535 Maynooth，1536/37 Wales与爱尔兰法规，1537 Scotland，1539 England Device工程和确属1536纽芬兰航行无殖民面。

## 关键地图变化：避免两种相反错误

**1519—1539英王确实持续控制的城市**不能每到十年自然消失；反过来，**1535梅努斯城堡仅能画城堡点**，不能自动给整个基尔代尔现代郡县涂英王新殖民橙。1536/37基尔代尔地产被法律追夺确有证据，却并不证明每一块没收庄园都被实际驻兵或直接收租。Offaly的O'Connor地方领主依旧必须保留在政治史叙述中。1537英语/服饰同化法令证明政策，不证明盖尔地区普遍遵守。

**英国海外扩张（1530s）**没有找到可核证的新增海上殖民领土Polygon；纽芬兰Richard Hore 1536抵达属航行/接触，不是长期统治。英格兰1539海防新堡同样只是本国军事工程。

## 史料与版权把关

优先可复核官方史料入口：
- 英国国家档案馆SP3（1533—40 Calais）、E101/E364军政钱款；与Julian Munby古测绘讨论配对，不能把1556 Calais测量倒画成1530界。
- [英格兰1529威尔士法令27 Hen VIII c26](https://www.legislation.gov.uk/aep/Hen8/27/26/contents)：**官方题名及法令年代为1535**，1536常用于描述执行过程；正式事件date_label要保留1535/36会期不确定。
- [1534 Dublin围城研究](https://academic.oup.com/histres/article/92/258/705/5698429)、[Office of Public Works Maynooth堡](https://heritageireland.ie/visit/places-to-visit/maynooth-castle/)。
- [加拿大传记大学联合工程Richard Hore](https://www.biographi.ca/en/bio/hore_richard_1F.html)：远航登陆得到确认，后世叙事路线有矛盾。
- [1537爱尔兰同化法令学术研究](https://www.cambridge.org/core/journals/irish-historical-studies/article/wilde-shamrock-manners-anglicisation-and-the-politics-of-gesture-in-early-modern-ireland/66D7D32CE0E6172F7398F574D58DF277)：要关注强制同化和执行差别。
- [Historic England官方1539炮台研究](https://historicengland.org.uk/images-books/publications/iha-artillery-defences/heag197-artillery-defences/)。

旧Island几何的GPL-3.0-or-later子集许可继续保留；威尔士现代Topodata来自仓库既有文件，**额外复核原始现代边界数据的来源与授权后再公开复制为新图层**。原始16世纪史地图不复制未经授权的线稿。

## 下一轮优先

[ARCHIVAL_ACTION_QUEUE.json](ARCHIVAL_ACTION_QUEUE.json)收录17项，其中9项P0，包括Calais边区1540前边线、Guînes防务、Kildare逐庄园、Maynooth驻军时间、Welsh marcher法令名录、Irish Pale财政法界、Leixlip纪年分歧、1537文化法令执法。每一项属于**研究未核完成**，不得以代码通过冒称资料无误。

完成主编正式数据选择后，需要把1539年末的**7个控制地名及各自审核状态**交给1540年代调查员；下一十年1541爱尔兰主权称号改革先以史料核实。

## 独立交互可直接验收

预览文件 [interactive_research_preview.html](interactive_research_preview.html)：年份滑块依年推进24项事件、加来/爱尔兰Pale参考虚线、独立苏格兰蓝色政治图层；左侧点击读史料，**双击有地理位置的事件平滑转至地点并在原缩放比例高亮**。从仓库根目录执行`python3 -m http.server 8000`后用浏览器打开对应路径。这里是调查组测试平台，不能直接替换主编既有的v0.9／v1.2已批准UI，也不代表用户生产地图已经上线。
