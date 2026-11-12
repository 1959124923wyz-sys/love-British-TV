## 历史事实、地图与读者界面检查（必填）

- [ ] 所有年份、伤亡、征地、主权/政治主体及来源均可追溯；未捏造数据或边界。
- [ ] **读者可见全文零制图/编审免责声明**：图例、悬浮提示、地图标记、右侧区块、事件详情、专题正文、章节导语、按钮标题和无障碍文本均已检查。没有“虚线为概略历史地理参考”“边界未经实测配准”“非英国河两岸主权”“不能计算/叠加面积”“仅供示意”等同类句子。
- [ ] 原始史料JSON/GeoJSON、source_urls、精度标记照常保留；不确定版图仍用虚线。
- [ ] 新增展示使用 `window.AtlasReaderCopy.clean()/label()`；`js/atlas-public-ui-guard.js` 完整接入，未被绕过。
- [ ] 文案回归和真实桌面 Chrome QA 均通过（`scripts/test_atlas_47_public_copy_guard.js`，`scripts/browser_atlas_47_public_copy_guard.py`）。
- [ ] 地图单一区域、多区重叠与事件图标互不抢点击，至少完成跨16—18世纪回归。

规则：`AGENTS.md` 与 `docs/READER_PUBLIC_COPY_POLICY.md`。本检查不允许通过从史料中删除边界不确定性信息来“绿灯”。
