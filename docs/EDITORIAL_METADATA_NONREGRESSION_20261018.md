# 历史事件重要性审查字段：非破坏性新旧分离门禁（2026-10-18）

本项目正式历史事件的 `significance.level` 决定显示重要程度；`significance.rationale` 解释理由，`significance.review_status` 标明审核状态。已经有现代参考坐标的事件还应有 `position_type`、`geography_label`、`geo_precision` 说明。**这些元数据缺失不等于历史事件造假，也不应由模型自动编写看似学术的补充。**

## 2026-10-18 正式数据基线

在 `main` 10章575项事件中，经逐份JSON只读检查，以下字段没有完整覆盖：

| 字段 | 基线缺项 |
|---|---:|
| `significance.rationale` | 305项 |
| `significance.review_status` | 27项 |
| 已经具坐标的 `position_type` | 31项 |
| 已经具坐标的 `geography_label` | 13项 |
| 已经具坐标的 `geo_precision` | 0项 |

其中有 **79项最高等级（level=3）历史事件尚缺评级理由**。对应[Issue #81](https://github.com/1959124923wyz-sys/love-British-TV/issues/81)已更正旧310事件/163缺项数字。

## 实施方式

- `data/legacy-editorial-metadata-exceptions-20261018.json`：由正式十章读取得到的缺项事件ID名单，仅证明“这些记录历史上已经缺字段”，**不为其历史证据背书**。
- `scripts/audit_event_editorial_metadata.py`：重读全部发布章节，对比今天与旧名单；已经登记的旧缺项允许暂留；新加入或修改后出现的未登记缺项属于CI失败；已补齐的旧缺项自动从当前缺项统计消失，不需要重建整个名单。
- `.github/workflows/approved-map-ui.yml` 与 `.github/workflows/pages.yml`：对于新缺项执行 `--strict`，正式部署前避免质量滑坡，但不会因为305项尚待人工考证的旧欠债让网页突然无法发布。
- 此审核只校验字段存在与数据结构，**无法判断理由是否可信**。编审必须逐项对照可追踪原始档案、权威研究和事件细节修订文本；特别是79项3级事件要优先确认视觉重大性判断并防止叙事偏向。

## 后续操作

编审或调查员在独立分支补来源与可靠理由时，移除旧缺项即可；不得直接把这一份例外名单当作完整的“需要消除的错误”。若既有事件本身重大性有争议，保持待审并在主编记录说明，不能为了过CI删除有价值的史料。新加入正式地图的历史事件必须从一开始填写必要审核字段。

本门禁不改坐标、事件级别、历史描述、地图交互或17世纪候审资料；仅实现新旧数据分离和自动增量监测。 
