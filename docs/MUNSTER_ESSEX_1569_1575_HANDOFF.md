# 爱英TV｜专题28、30历史调查与地图交接（2026-10-16）

## 本次交付
- `data/stories/munster-gilbert-first-desmond-rebellion-1569.json`：10节，约3030汉字，17个关联事件。区分菲茨莫里斯与麦卡锡反抗、埃德蒙巴特勒反叛军在埃尼斯科西对平民的杀害、奥蒙德伯爵王室军镇压，以及吉尔伯特在芒斯特的攻堡屠杀、断首示众与毁坏牲畜。
- `data/stories/ards-clandeboye-essex-rathlin-colonisation-1571-1575.json`：11节，约3010汉字，17个关联事件。区分史密斯阿兹殖民授地、布赖恩奥尼尔抗争、埃塞克斯军粮食抢劫、贝尔法斯特宴饮诱杀、都柏林处决、拉斯林岛城堡守军被杀、洞穴非战斗平民被杀及麦克唐奈的1575年反攻。
- `data/atlas-1560-1569.json`：新增5个具名事件点，新增1条1569吉尔伯特王室军由布鲁里—基尔马洛克—科克的连段示意虚线。原Garrystown和军营断首事件仍不定位，原有5片1569作战阅读区域保持。
- `data/atlas-1570-1579.json`：新增9个具名事件点，1574焦土军向利福德行军方向及1575卡里克弗格斯至拉斯林运兵两条示意虚线。
- `data/century-violence-regions-1544-1589.geojson`：新增阿兹殖民与抵抗1572—75、拉斯林军民遭杀1575两片不填充的虚线研究区；原26片保留，现28片。
- `data/stories/index.json` 更新为18篇；`docs/MAJOR_STORY_BACKLOG_1497_1599.md` 标记专题28及30的研究分支进展。原站UI不增加新控件或改变暗色视觉规范。

## 首选史料
1. **Royal Irish Academy Dictionary of Irish Biography** Sir Humphrey Gilbert：`https://www.dib.ie/index.php/biography/gilbert-sir-humphrey-a3467` — 1569科克／凯里殖民计划，基尔马洛克王军行动，恐怖镇压。
2. DIB James fitz Maurice Fitzgerald：`https://www.dib.ie/biography/fitzgerald-james-fitz-maurice-a3161` — Kerrycurrihy、Kilmallock和7月科克要求。
3. DIB Sir Edmund Butler：`https://www.dib.ie/index.php/biography/butler-sir-edmund-a1236` — 1569埃尼斯科西集市平民受害责任归巴特勒叛军。
4. DIB Thomas Butler Earl of Ormond：`https://www.dib.ie/index.php/biography/butler-thomas-a1297` — 奥蒙德奉王命镇压家族叛乱及杀俘。
5. DIB Donal MacCarthy Mór：`https://www.dib.ie/index.php/biography/maccarthy-mor-donal-a5138` — 1569年12月4日利默里克投降。
6. DIB Sir Thomas Smith：`https://www.dib.ie/biography/smith-sir-thomas-a8152` — 1572年8月31日阿兹登陆、1573年10月20日小史密斯遇害、1574—75殖民点衰退。
7. University College Cork **CELT原始殖民宣传册**：`https://celt.ucc.ie/published/E570001-001/text001.html` — 1572《A Letter sent by I. B.》、殖民授地计划与原附历史地图（此轮未做GIS配准）。
8. DIB Walter Devereux：`https://www.dib.ie/biography/devereux-walter-a2554` — 1573—75卡里克弗格斯英军、1574贝尔法斯特诱杀、1575黑水河与拉斯林英军暴行、撤军和地方反攻。
9. DIB Sir Brian O'Neill：`https://www.dib.ie/biography/oneill-o-neill-sir-brian-a6948` — 本地领主土地权利、阿兹抵抗、宴饮诱捕与都柏林司法处决。
10. DIB John Norreys：`https://www.dib.ie/biography/norris-norreys-sir-john-a6234`；DIB Sorley Boy MacDonnell：`https://www.dib.ie/biography/macdonnell-sorley-boy-a5192` — 拉斯林岛英军、德雷克运兵、岛上守军和妇孺的不同遭遇。

## 精度和责任界限（仅供内部资料）
- **Garrystown 古址**与**吉尔伯特流动军帐断首位置**无唯一定位：保留 `lat:null,lng:null`；不得将现代都柏林郡Garristown误置芒斯特。
- 1569埃尼斯科西集市的商人与妇女遇害由埃德蒙·巴特勒叛军造成，不能错误归入吉尔伯特英军杀害数；奥蒙德王室军无审判处决另成一类。
- 1574贝尔法斯特宴饮诱杀随从与押到都柏林的布赖恩·奥尼尔处决不同地理位置；1575拉斯林岛守军在投降后被杀（约200）与岛内非战斗平民遭屠杀（约300–400）分项保存，不能混合两类事件或重复计死。
- 1575拉斯林岛洞穴精确位置不能根据现代旅游景点或今人地图伪造。该地图点仅为海岛阅读锚点，不对应找到并勘定的实际遭杀害洞穴。
- 1571殖民**地契**、1572纽卡斯尔康伯**定居据点**、1573卡里克弗格斯**英王城堡驻军**与完整阿兹/克兰德博伊**实际军政控制**须分开。半岛示意矩形不是英国殖民实际土地面积。
- 黑水河与利福德行军、卡里克弗格斯至拉斯林海上攻击仅连接有据节点，非实测道路/航迹。所有新区域 `fill_authorized:false`、`territorial_claim:false`、`area_sqkm:null`、`historical_boundary_confirmed:false`。
- 1575图洛·卢纳赫与埃塞克斯黑水河会谈和拉斯林屠杀同时期发生，不能由一次军队交涉称英王取得整个蒂龙郡。

## 验收与恢复
专项：`scripts/test_munster_essex_story_1569_1575.js`、`scripts/browser_munster_essex_stories.py`。CI纳入 `.github/workflows/major-history-stories.yml`与 `.github/workflows/pages.yml`。审查要求旧章节统计门禁保留全部真实旧记录，同时允新增14事件、3示意路线与2研究区。待PR全部检查通过再合并，GitHub Pages真正成功才宣布上线。
