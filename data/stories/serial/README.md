# 爱英TV｜编辑6专题作者交付规范与跨世纪时间数据
以下为专题与事件分离的接口约定：
- 年份导航仍依据 \`data/chapters.json\` 的十年章节；未发布十年仅显示导航，不显示编造的事件。
- 母专题源文件 \`data/stories/serial/index.json\` 为唯一专题状态和跨期关系索引；可将一篇跨几十年的正文作为单条母专题发布。
- 研究层长期持续记录，使用\`ARC-*\`；展示层\`E6-Txx\`是稳定母专题ID，正式单年事件ID另外独立管理。
- 前端只读取\`published + approved + article_file 合法路径\`的索引行；其他记录全隐藏。
- 仅已发布年度事件能成为本专题的“相关重大历史专题”入口，读者通过事件点击进入完整正文；正文中的\`[[EVENT-ID|显示文字]]\`导航在过去/未来时间仍用显式切年和当年已发布事件作为准入，不能提前绘地图。
- 字段允许未来\`segments\`跨十年递增；不允许强迫对每个十年重复保存一篇长文或用图形假定实控面积。

建议稿:
\`\`\`json
{
 "id":"E6-T12",
 "title":"1600—1874年英格兰东印度公司与英国殖民企业",
 "lead_group":"C",
 "arc_family":"ARC-EIC",
 "origin_year":1600,
 "historical_end_year":1874,
 "research_window":{"start_year":1600,"end_year":1699},
 "status":"editorial_review",
 "publication_review":"pending",
 "article_file":"data/stories/serial/e6-t12-east-india-company.json",
 "event_ids":[],
 "predecessor_ids":[],
 "successor_ids":[],
 "segments":[
   {"id":"E6-T12-1600S","start_year":1600,"end_year":1609,"prev_segment_id":null,"next_segment_id":"E6-T12-1610S","event_ids":[]},
   {"id":"E6-T12-1610S","start_year":1610,"end_year":1619,"prev_segment_id":"E6-T12-1600S","next_segment_id":null,"event_ids":[]}
 ]
}
\`\`\`
以上是**接口示例**，不意味着这篇文章已经存在或1600—1619这些年份的地理内容已经获批准。续接到1858与1874属于编排计划，需要事件分期与史料审核。
