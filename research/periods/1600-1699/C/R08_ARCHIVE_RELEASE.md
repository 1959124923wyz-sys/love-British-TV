# 丙01 R08 甲组教训整改：累计ZIP持久交付与两篇JSON来源
日期：2026-10-19｜Issue #166｜Draft PR #184｜research_only

## 最新全量归档已存 Library
- 完整ZIP：`/爱英TV/Editor6-AgentC-1600-1699-R08-FULL.zip`
- 体积：9,332,824 字节；SHA256：`921f6a0176db8a0e1d3f881fc035ce3fd8c3933569f65d4c889789e999ecc370`
- ZIP含186个文件（含1个MANIFEST）；前一轮R07整个ZIP原封不动放于`ALL_ROUNDS/Editor6-AgentC-1600-1699-R07-FULL.zip`，更早R06/R05亦由内嵌包和早轮副本保留。
- CRC、MANIFEST非自身文件路径/长度/sha256全比对、R07原ZIP一致性和研究源键自动检查通过；实际候选事件125条、来源158条未作无证扩充。
- **该二进制ZIP在ChatGPT Library，不是GitHub仓库附件**；GitHub现同步存放两篇完整R08最新JSON和全部8份审稿/QA文件。

## 最新文章（而非老R06快照）
- `CURRENT/SERIAL_ARTICLES/E6-T12-east-india-company-commerce-authority.json`：12节，1600—1698；长期法定结束1874、研究层状态。
- `CURRENT/SERIAL_ARTICLES/E6-T15-fiscal-credit-institutions.json`：11节，1651—1698；长时段财政制度结束年仍空、研究层状态。
- `CURRENT/EDITORIAL/EDITOR6_STANDARD_AGENT_C_APPLICATION_R08.md`：甲组格式/历史内容教训在本组的逐项整改。
- `CURRENT/EDITORIAL/SERIAL_STORY_AUTHORING_GUIDE_C_R08.md`：后续调查员八步制作流程。
- `CURRENT/EDITORIAL/E6_T12_T15_SOURCE_CLAIMS_R08.csv`及`E6_T12_T15_REVIEW_GATES_R08.md`：两篇各节来源深度、缺证与发表阻塞。
- `CURRENT/EDITORIAL/SERIAL_INDEX_PATCH_PROPOSAL_R08.json`：仅候审接口，不属于网站正式索引。
- `CURRENT/EDITORIAL/qa_serial_research_r08.py`：JSON键、年代、编辑语言结构QA，不取代史料核证。

## 真实审校结论
- **研究数据保全：通过**；**专题格式与段级来源关系：通过自动审查**；
- **长期史事公开刊发：未通过**，原始商馆/账页/律令未充分核读，亚洲政治主体、财政实际现金流、奴役贸易关系仍需深化；
- **正式年度地图与殖民疆界：本轮未提交，未审核，不上线**；
- **GitHub Actions已通过不等于史实审核通过**，仅编辑6和主编可以将正式索引置`published+publication_review:approved`。

## R09继续
只以R08 Library完整包为最新基线；先深化E6-T15官方会计/1694议会法令与投资者谱系，继而E6-T12完整地方政治及战争过程。完成每一篇全文和证据审查后再申请下一篇；下一轮仍交一份包含旧轮无损ZIP的新累计包。

### 最终时间字段来源关系修正
- E6-T12 `historical_end_year=1874` 已在JSON文章来源和独立claim矩阵关联英国1873年《东印度股票股息赎回法》第36条（C158）；此节点不同于正文最后历史事件1698年，也不同于1858年统治职权移交。
