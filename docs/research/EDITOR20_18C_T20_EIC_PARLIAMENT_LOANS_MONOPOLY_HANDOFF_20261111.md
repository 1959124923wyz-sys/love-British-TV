# 主编20｜18世纪第28批T20：英国议会、东印度公司贷款与贸易专卖（2026-11-11）

## 接续状态
- 从第27批Draft PR #322的 `d44c09825277a237bc96d669092a1623ee28d710` 建立独立分支 `map/18c-t20-eic-parliament-loan-monopoly-1709-1793-20261111`，研究预览不触及正式main。
- 保留旧27篇18世纪试阅、16/17世纪已发布地图与研究存档，禁恢复已删的浮动目录。
- 原前辈T20在 `research/18c/consolidated/series/T20.json`，**4合并组、9原B候审ID、9来源键**，通过crosswalk及不可变ZIP追溯。
- 第28篇提供29件逐年Atlas事件、29章87段完整中文正文、29处正文与地图联动、26项登记来源及29件法律/贸易/税权状态台账。

## 史实审查
1. **1709**：大英图书馆 IOR/A/1/67记5月7日旧公司交回特许状，公司法人合并不代表取得印度土地；[档案](https://searcharchives.bl.uk/catalog/040-000178672)。
2. **1748**：印度政府收藏Aitchison 1909卷X No XLVII记录Kotayam胡椒专卖；只认商业独占，无精确古邦地籍；[条约集](https://ignca.gov.in/Asi_data/14009.pdf)。
3. **1767/1769**：1813英国议会追述两次安排每年40万英镑公司对国家缴款，法定应付数与公司实际净利分开；[Hansard](https://hansard.parliament.uk/commons/1813-05-31/debates/30d76ed5-51da-48b9-9500-1867135975cd/EastIndiaCompanySAffairs%E2%80%94)。
4. **1771—1773**：埃克塞特大学据西孟加拉邦档案记1771年8月董事指令、1772年5月14日Committee of Circuit成立、1772年7月农户留种遭强购投诉、1773继续调查；[1772档案](https://famineanddearth.exeter.ac.uk/displayhtml.html?id=fp_00358_en_committeeofcircuit_7thjuly-20thaugust1772)。
5. **1772—1773**：英国议会及British Library记录1772公司财政危机，1773英国政府借款140万英镑及Regulating Act；该数是英国借给公司，不是殖民地收入；[BL IOR/A/2](https://searcharchives.bl.uk/catalog/036-000178727)。
6. **1773/1774北美**：美国国会图书馆确认1773茶法提供贸易优势但不新加茶税；波士顿居民倾茶及英国议会1774封港分列责任；[LOC](https://www.loc.gov/classroom-materials/united-states-history-primary-source-timeline/american-revolution-1763-1783/colonies-rebellion-1773-1774/)。
7. **1775—1776**：BL IOR/H/633有1775年5月21日Awadh拟议条款、1776年4月15日Chait Singh地权Sanad；拟议与生效法律分开，未编造英国占领边界；[BL](https://searcharchives.bl.uk/catalog/040-000004727)。
8. **1784/1786/1793**：政府任命六名委员组成Board of Control，1786进一步加强Governor-General，1793公司特许再续期，后1813贸易权缩减；[议会](https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/parliament-and-empire/parliament-and-the-american-colonies-before-1765/parliament-and-the-east-india-company/)。

## 严格空间与统计
- 仅采用GeoNames London、Kolkata、Boston的**现代城市参考点**，并逐项明确不是十八世纪原始文书现场；其他历史点null。
- **0英国真实控制Polygon、0猜想军队路线、0各地方邦国推测疆界、0未经独立核证殖民公司净利润。**
- 国家贷款£1,400,000、公司法定年缴款£400,000、后来每两年£40,000具有不同付款方向和法律时间，不得相加推断殖民掠夺收益。

## 验收与未决
- `scripts/test_18c_t20_eic_parliament_loan_monopoly_map.js` 核对29地图/章节联动、9候审原ID及各B来源原键、篇数、GIS与财政单位。
- `scripts/audit_18c_t20_original_B_sources.py` 独立核查原1126表与ZIP未改。
- `scripts/browser_18c_t20_eic_parliament_loan_monopoly.py` 1780×1020真实桌面浏览器检验年表、正文、双击与返回，附全部前27批和16C回归。
- `.github/workflows/18c-t20-eic-state-parliament-trade-monopoly-map.yml` 包含三项工作；以**最新HEAD的全部GitHub Actions成功**为终验条件。
- 待查：1744原法全文、各地五年承包实际竞拍账册、1775阿瓦德条款正式效力、公司历年利润实账、十八世纪历史地理配准与细分司法辖区。
