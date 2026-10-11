# 史料源与旧文档复核：必须让后来同事知道的限制（2026-10-11）

## A. 可确认的目录规范更正
1. **CShapes 2.0 许可**：前一分支 `SOURCE_REGISTRY.json` 将原数据许可列为待核。现在美国国会图书馆[数据条目](https://www.loc.gov/item/2023592015/)写明 **CC BY-NC-SA 4.0**。这不意味着可以在不履行许可证条件时再分发，也不能把这一类1886—2019边界当作15世纪实际控制区。
2. **印度地图系列**：先前只列 `IOR/A/1` （东印度公司法律特许）与 `IOR/L/E`（经济卷宗）；本轮补充英国图书馆 `IOR/X` [印度事务地图专藏](https://searcharchives.bl.uk/catalog/032-002238107)，研究控制面时应优先同时检索它。地图上标为“British Territories / Protected States”也需反查真实治理。
3. **1490年代爱尔兰**：旧TNA研究索引 `SP60—67` 时间始于1509，不能作为1490年代直接史料；本轮找到 Steven G. Ellis, *Ireland's English Pale, 1470–1550*（2021）的实质摘要，说明四个历史郡**名义边界与有效行政疆界不同**。不能据此立即制作确定的全Pale多边形。
4. **1660年前后爱尔兰Down Survey**：历史地籍图能支持土地剥夺与财产转移证据，但不能直接代替殖民**政治疆界**；地图和配准数据版权另需确认。TCD[项目说明](https://www.downsurvey.ie/about/)有技术来源。
5. **历史地名工具的许可**：WHG官方文档说明通常需令牌，且各来源有不同许可证和不可再分发条目；其地点坐标不可自动当历史行政管辖点。[WHG API](https://docs.whgazetteer.org/content/technical/apis.html)。
6. **殖民统计蓝皮书**：TNA明确[不同殖民地统计口径不一致](https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/colonies-dependencies-further-research/)；财政并表前务必保留各账户主体和原始字段。

## B. 不要把试验网页的局限说成史实
- `main/data/atlas-1497-1500.json` 是7个事件的前端试验数据，卡博特远航点位含区域示意，尚未提供英格兰或苏格兰1497年原始历史边界。
- `main/data/modern-uk-regions.topojson` 是现代行政数据：研究员不能通过颜色将它传递为15世纪政治实体地图。
- 史料库需要 `period/observed_at` 与法律主张日/实际驻军日/持续税务日分开；该设计当前尚未进入主站。
- `main/SOURCE_MATRIX.md` 的网页地理底图文字可能含早期CARTO说明；此前 v0.2 改用OSM，网页维护者应在下次修改时核对并清理旧注记。本对话不擅动UI主干。

## C. 可信程度标识约束
- `institutional_finding_guide_read`：证明这个档案系列存在及其公开描述，不证明其中每件卷宗已审阅。
- `scholarly_abstract_read`：可谨慎转述章节摘要内容，**不能称作已读全文**。Ellis同一本书的多章节属于同一研究来源，不算独立学者的多次交叉证实。
- `primary_item_checked`：必须展示档号/页码/原件定位、当时日期以及对文书内容的精确解释。
- `published_boundary_approved`：必须另经版权、制图精度、地理证据、政治关系和审稿完成；不能仅因为来源“国家档案馆”便自动上线。

## D. 经济收益描述的核查
- 1823年的[殖民财政辩论](https://api.parliament.uk/historic-hansard/commons/1823/feb/25/colonial-revenue-and-expenditure)说明殖民地有各自年度财政收入/支出与英国本土军费；辩论中的数字并非已经独立复核的完整账册。
- 1880年前后的税收、海关收入可能留在殖民地财政，也可能资助军事或行政，不能直接视为英格兰/伦敦净利润。
- 同一个奴隶主有多处种植园，多条航次同属于同一股东时，应使用原始实体ID去重；不得简单累加为独立投资者收益。
