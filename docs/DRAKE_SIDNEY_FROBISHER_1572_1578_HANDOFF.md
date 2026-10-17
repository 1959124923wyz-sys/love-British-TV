# 爱英TV｜专题31–33巴拿马、锡德尼和弗罗比舍交接（2026-10-16）

## 已完成
- `data/stories/drake-panama-mule-train-raid-1572-1573.json`：1572年Nombre de Dios袭港受伤、1573年Cimarron自由社群与法国勒特斯图共同伏击金银驮骡队、Venta de Cruces驿站被袭、返航。美国国会图书馆正文提供首航73人两船、1573年约£20,000战利品为历史估计，不能作为王室净利润。
- `data/stories/sidney-pale-cess-connacht-military-campaign-1575-1578.json`：锡德尼征粮、Pale地主申诉、1577伦敦代表被捕、1578都柏林城堡拘禁与罚款、康诺特洛赫雷/卡斯尔巴驻堡、德鲁里芒斯特镇压、1578召回。2026年10月13日剑桥大学新刊有细致原始账目研究：`https://www.cambridge.org/core/journals/irish-historical-studies/article/note-of-all-suche-presents-giftgiving-and-sir-henry-sidneys-cess-controversy-of-1578/E31FC0A173BC647CC71D5E0901735756`。
- `data/stories/frobisher-arctic-inuit-captives-mining-1576-1578.json`：三次航行与两次掳人、四名被掳因纽特人的英格兰去世记录、阿纳克/卡利乔的布里斯托尔安葬、Nutaaq伦敦转送死亡、北极挖矿、1578石屋及未成越冬殖民、达特福德熔炼厂和虚假黄金期待。加拿大公园局官方矿区研究：`https://www.pc.gc.ca/apps/dfhd/page_nhs_eng.aspx?id=332`；Kent HER Dartford熔炼：`https://heritage.kent.gov.uk/Monument/MKE20312`。
- `data/atlas-1570-1579.json` 增15新来源证实的事件，相关来源13条＋UNESCO巴拿马城市官方锚点1条；新增4条方向和运输链示意线路，总事件68、来源83、路线26。专题总数从18增21。
- 显示审美同原站，学术核证和制图限制记录在后台。新验收脚本 `scripts/test_drake_sidney_frobisher_major_stories.js`及`scripts/browser_drake_sidney_frobisher_stories.py`，纳入网站Pages门禁。

## 特别修正：1573巴拿马旧城误定位
1573年巴拿马城坐标必须采用**Panamá Viejo 9.006,-79.486**；原补充阶段一度采用**Casco Viejo 8.952,-79.536**，但后者是1673年搬迁新址，不应回填到1573。此轮已修正金银运输起点与事件坐标。证据：UNESCO `https://whc.unesco.org/en/tentativelists/5970` 和 `https://whc.unesco.org/document/217279`。现代UNESCO保护区及2025入选的跨地峡遗产路线不等于1573年每一段驮骡路线或劫掠现场。

## 地理限制
- 1573年Venta de Cruces具体旧址与英法Cimarron联军伏击集合地未精确考订：两事件`lat:null,lng:null`，无虚构点。巴拿马旧城至Nombre de Dios连线是跨地峡运输网络的端点示意，不是GPS驮骡道路。
- **Cimarrones为逃离西班牙奴役的非洲裔独立盟友，并非英国臣民**；同法国私掠者的联军行动不得记作英国长久殖民巴拿马。
- 1575–78 Pale的军粮征赋不能泛化到所有爱尔兰郡，不绘全岛征税多边形。法定地契、临时英军驻堡、某次城堡易手和全省有效管治必须区分。锡德尼手下德鲁里处决保留德鲁里为行为主体。
- 1576弗罗比舍实际从**伦敦Ratcliffe**启航，原路线误用1577/78出港的哈里奇，本轮已修正并添加设得兰到港节点；1577与1578则从哈里奇航行。原三次航行差异需保持。
- Kodlunarn岛加拿大官方地名坐标**62.816667,-65.416667**：`https://geonames.nrcan.gc.ca/search-place-names/unique?id=OAJFN`。今加拿大国家遗址法定边界只服务考古保护，不可当1578英占地界。原本拟留下100名士兵矿工越冬，但计划失败，留有小石屋和开矿遗迹，不是长期殖民地。
- 1576一名被掳因纽特男子及1577 Kalicho、Arnaq、Nutaaq，共4名不同被掳者；1577 Nutaaq从布里斯托尔转伦敦的第二段运输**不得再次计为新被掳人数**。1578没有第三批成功掳人。
- Kent HER Dartford厂址格网估计不等于精确厂区边界，新的`FRO1578-DARTFORD-SMELTING`采用现代城镇阅读点，不制造1578实际炉墙位置。

## 上线原则
测试GitHub历史地理、UI、浏览器阅读及Pages均通过方可并入main。由于本工作从研究PR#119分支派生，应先完成PR#119的验收，再以本分支为基础向main合并，避免数据库冲突；本研究不可被误报已经在正式网站发布。
