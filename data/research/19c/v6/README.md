# 爱英TV｜19世纪 V6 累计编审资料

接续 [V4 第二轮筛选草稿](https://github.com/1959124923wyz-sys/love-British-TV/pull/342) 和 [V5 累计交接包](https://chatgpt.com/library?file_id=libfile_58eb1dff170881918f3aeadb48f83cd1&account_id=personal)。C 原队列第 71–103 项已交。A 123、B 161、C 201，V4 分工共 485 项全部收到。计入 B 的 2 个新候审号及 5 个可逆归并旧号，共有 487 个可查编号、482 个编审入口。83 个宏观专题、1,339 条 V4 原始史料、1,773 条累计研究观察与索引。C 本轮新增 66 条研究观察和 64 项引用登记。

| 需要 | 文件 |
|---|---|
| C 新交 33 项、原号和未决问题 | [c-completion-71-103.csv](c-completion-71-103.csv) |
| 载入三层资料、定位分片、核对行数 | [manifest.json](manifest.json) |
| 专题列表 | [topics.csv](topics.csv) |
| 旧号及跨事件证据 | [event-relations.csv](event-relations.csv) · [evidence-crosswalk.csv](evidence-crosswalk.csv) |
| 主要纠错与继续调档 | [主编交接](../../../../docs/research/19C_V6_C_COMPLETE_20261113.md) |

CSV 为 UTF-8，按清单顺序读取，各片带表头。topic_id 连接专题和事件，event_id 是稳定事件号，display_event_id 是可逆归并后的主条。用 editorial_event_id 汇集研究证据，用 v5_editorial_event_id 汇集继承的 V4 节点。研究证据的 assistant 与 source_ids 以竖线连接成 source-provenance 的 input_id，原 V4 引用使用 V4 前缀。document_id 连接文献目录。原引用与阅档深度均可查。

本目录用于候审。地理表保留研究位置和证据，获准发布的几何数量为 0。局部历史边界有不确定性时，待主编和史图审核后采用虚线。不同实施主体、年代、地点和法域按实际证据组织。

[V5 累计 ZIP](https://chatgpt.com/library?file_id=libfile_58eb1dff170881918f3aeadb48f83cd1&account_id=personal) 保存原提交、V4 和更早归档。[A 的影印原档](https://chatgpt.com/library?file_id=libfile_539c4f7b0f1881919ec02da4c489628d&account_id=personal) 与 [影印校验清单](a-scan-originals-index.csv) 对读。

验收命令为 python3 scripts/verify_19c_v6_research.py。
