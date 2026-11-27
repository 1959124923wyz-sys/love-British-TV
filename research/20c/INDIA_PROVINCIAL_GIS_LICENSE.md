# 印度省邦历史地图｜来源、许可与分期审查

关联 E20-T002、T003、T004、T008、T009（地图行政背景；不关闭任何专题）。PR #634。

## 原始数据与权利
W. Tennant 等，Climate drivers of plague epidemiology in British India, 1898–1949（2020），https://pmc.ncbi.nlm.nih.gov/articles/PMC7341932/ ，历史地图方法见第2(d)节。研究者将 Administrative Atlas of India 历年省界数字化并构建中间年资料。
- 原始 Shapefile/DBF：https://github.com/wtennant/plague_india/tree/master/Data/Shapefiles
- 原研究年份匹配：https://github.com/wtennant/plague_india/blob/master/Code/plot_cases_annual_space.R
- 原许可：https://github.com/wtennant/plague_india/blob/master/LICENSE （LGPL-3.0）；许可全文副本：licenses/plague_india-LGPL-3.0.txt；GPLv3配套条款 https://www.gnu.org/licenses/gpl-3.0.html 。两份衍生GeoJSON遵循原许可，不以本站代码许可覆盖。原始文件SHA逐条记录于数据属性。原始数据、修改后的GeoJSON及转换说明保持可获取。
- K. M. Lawson 公开的纬度校正：https://github.com/kmlawson/playground-india-language/blob/main/tools/latfix.py 。其拟合基于1931图与1941行政区数据，原始图虽带等积投影标签但坐标实为经度、拉伸纬度。本批沿用 lon=x, lat=-0.00579*y*y+1.10155*y-0.53785，并将坐标四舍五入至4位小数；逐环去相邻重复点、按包含层级识别外环/内洞、调整方向，同名同治理类型的记录并为MultiPolygon。1931拟合推广至同一系列其他年代尚需独立地标误差验证；一律虚线，禁止面积统计。原始环方向异常与排除项目保留在各文件 metadata.audit；尚需GIS拓扑验证。只采用原始系列，未使用混入现代行政边界的衍生省图。

## 年份与政治关系
来源图1891→1900（原研究采用；19世纪末行政细变待校正）；1901→1901–1902；1903→1903；1904→1904；1911→1905–1911；1921→1912–1922；1923→1923–1930；1931→1931–1935；1936→1936–1937；1941→1938–1946。1935仍沿用1931图，因信德、奥里萨分设于1936年，依据1935法令及实施时间。1947年停止该英属印度层。省级范围为近似历史分区，不假定每个地块逐年不变。NATIVE=0直属行政范围；NATIVE=1土邦及地方政权（按不同政治关系描述），不算英国直接主权。锡金保护关系另述。排除葡属果阿、归属不清的边境代理区/部族区、缅甸（宏观数据已另有，地方分区另核）和空几何。1900年的原图中西北省、卢沙伊山地等名称未匹配，明确列入待核，不能假装全部覆盖。
史料：芝加哥大学数字南亚图书馆1931地图 https://dsal.uchicago.edu/reference/gaz_atlas_1931/ ；孟加拉百科全书分割及撤销 https://en.banglapedia.org/index.php?title=Annulment_of_Bengal_Partition ；1935印度政府法 https://www.legislation.gov.uk/ukpga/Geo5and1Edw8/26/2/body/made ；1947独立法 https://www.legislation.gov.uk/ukpga/Geo6/10-11/30/body/enacted ；Cambridge University Press, The British construction of indirect rule https://www.cambridge.org/core/books/abs/indian-princes-and-their-states/british-construction-of-indirect-rule/D5BFA28A6160106FB53C2A1B90156E90 。

## 已完成
1900–1930 183条，1931–1946 90条，共273条分期范围；来源登记17条（包含重复来源在不同文件的独立ID）。重新获取两个GitHub blob，检查ID唯一、每年稳定ID唯一、来源引用、闭环、数值范围、虚线、面积字段，0结构错误。地图加载器及逐年桌面测试已经接入，新增分割、1936改组及1947停止的断言。

## 仍需完成
真实Chrome、全部CI、GIS拓扑/地标误差独立复审、公开页面归属与点击重叠验证、许可交付复核。待补边境地区、缅甸地方分区和独立后政区；不得将该行政层当作具体饥荒、强迁或暴行发生区。下一专题优先1943年孟加拉饥荒有证地区、肯尼亚历史土地划分。