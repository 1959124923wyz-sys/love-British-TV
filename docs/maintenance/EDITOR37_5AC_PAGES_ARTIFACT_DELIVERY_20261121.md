# GitHub Pages deployment — artifact registration hardening (2026-11-21)

## Background
Following the merge of 5AC PR #486, the original `Publish historical atlas` workflow validated and uploaded the static site successfully, but `actions/deploy-pages@v4` immediately returned "Found 0 artifact(s)" on both the initial and re-run attempts, despite the uploaded `github-pages-1`/`github-pages-2` packages subsequently being accessible from the same GitHub run's Actions API. This is an artifact-index visibility issue, not a GIS or historic data validation failure.

## Implementation
Separate `build` (checks and `upload-pages-artifact`) and `deploy` (GitHub Pages environment) jobs using `needs: build`, to prevent the deployment action from fetching an artifact in the same newly-uploaded job. Before `actions/deploy-pages@v4`, query the official `GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts` through `gh api` until the versioned `github-pages-${{ github.run_attempt }}` appears, then allow a short additional index-propagation interval. All 83 publication validations remain unchanged. Failed or absent artifacts block deployment rather than silently deploy the previous site's content.

## Prior proof
- [Original 5AC release job 44883216912](https://github.com/1959124923wyz-sys/love-British-TV/actions/runs/44883216912): static validation pass, artifact uploaded, deployment API returned 0 artifacts twice.
- [5AC source and GIS work #486](https://github.com/1959124923wyz-sys/love-British-TV/pull/486)
- [5AC cartography handoff](../research/18C_5AC_ABPP_BATTLEFIELD_ACADIA_HANDOFF.md)

## Next check
Confirm both `build` and `deploy` jobs finish successfully on main, and new year 1755/1780/1781 maps load with versioned new GeoJSON. If GitHub reports a transient outage, compare official Actions and Pages states rather than changing historical data.
