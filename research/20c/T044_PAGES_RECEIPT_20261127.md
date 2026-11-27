# T044 正式出版部署回执｜2026-11-27

关联 Issue #578；正式发布 PR #663，精确审核 HEAD `13e06b6fcf23341acd7fbc9a76254021a76408fb` 独审无发现，专项证据及真实桌面工作流 [45971679078](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/45971679078) 两任务通过，合并 `03fb02308eb9074b1f3b88aab28dd796b1caf26c`。

通过 GitHub Actions runs 集合按精确合并SHA查询（而非仅pull_request运行的专用接口），找到 push 触发 [Publish historical atlas 45972571987](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/45972571987)，head_sha与合并提交完全一致。build job 140416321707、deploy job 140416421212 均completed/success；部署日志2026-11-27T09:19:01Z报告成功及环境URL https://1959124923wyz-sys.github.io/love-British-TV/。已读取精确部署版本 serial index：E20-T044-KENYA-LAND-1900-1963 为published + approved，合计26个20世纪专题；当前main仍26个，故仅补记T044工作板。此为此前已部署但未登记的对账，不宣称本轮重新部署。公开URL直接访问工具不可达；未进行线上交互实测，以真实桌面CI与官方部署成功回执为证据，和PR #649采用同一口径。原历史地界及地图缺口不变。
