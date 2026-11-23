# T41｜1888—1899英属南非公司征服与暴行：史料证据及GIS独立审计

制作分支：`feat/19c-t41-matabeleland-atrocities-cattle-labour-gis-20261123`。**生产候审；未完成正式发布。**

## 结构与去重

- 原卷 `T41_CASE_CROSSWALK.json` **20** 项全部保留原案号与单独事件ID；针对独立暴行、掠夺和殖民政府响应扩展 **17** 项当年/史学独立节点；总 **37** 项历史事件，`34`节`102`段。
- 三大叙事章：T41.1 1888—1893权利文件、王廷与占领；T41.2 1893—1895牲畜扣押、拍卖、地籍与税；T41.3 1896—1899追杀、焚村、毁粮、洞穴爆破与强制劳动及殖民法规延续。
- **24**个原史料/同行评审及地方历史资料登记。特别关注英国下院1893年12月11日、1896年4月17日/6月4日、1898年5月6日的同期议论，及Richard Martin 1897年的政府调查结论。
- 核准可用于地名导航的**8处**现代城市年份Point；其他**26条**史案无精准原址，仍`lat:null,lng:null`。没有古王宫、古营地、炮位、洞穴、土地保留区、殖民疆界的假坐标或实线Polygon。

## 重罪线索和史料级别

1. [1888年Rudd特许契约](https://sahistory.org.za/archive/rudd-concession-king-lobengula-matabeleland-1888)承诺每月£100及军火；[1888年下院回复](https://api.parliament.uk/historic-hansard/commons/1888/dec/20/south-africa-matabeleland-the-chief-1)明确国王独立。合同承诺不等于已经付款或国土主权转让。
2. [1893-12-11下院](https://api.parliament.uk/historic-hansard/commons/1893/dec/11/matabeleland)已经听取新殖民城圈地、持续扣牛及阻止播种的报告。这一条属于当期议会质询，不冒充全部都经过独立实地核验。
3. [牛津大学Oriel历史研究](https://www.oriel.ox.ac.uk/cecil-rhodes-racial-segregation-in-the-cape-colony-and-violence-in-zimbabwe/)核出1894年**Goold-Adams部队约2,000牛、Colenbrander约3,000牛/1,000被强征劳工、六月拍卖超过5,000牛**。它们可能跨占有和拍卖重复，严禁相加成总掠夺数量。牛津网页有关Schultz扣牛写**200**，其旧PDF见有不同转写，未调原档前不把这个争议个案列入数字汇总。
4. 1895年Vintcent委员会**约74,000头**与1896下院引公司报告**79,500头**需对照不同时点和信托/烙印的口径。约41,000与33,000是委员会建议划分而非交付凭证。[当时下院回复](https://api.parliament.uk/historic-hansard/commons/1896/jun/04/matabeleland)承诺调查。
5. [1896-04-17下院](https://hansard.parliament.uk/commons/1896-04-17/debates/4d84fd5d-9769-43bd-b763-c4e96dbce756/Matabeleland)殖民大臣为烧村辩护；但议员提出某农舍炸药**约100死亡**一说，部长明确称未掌握证据，**不得计为已确认死亡案**。
6. [1896-06-04下院](https://api.parliament.uk/historic-hansard/commons/1896/jun/04/matabeleland)殖民大臣谈及军队携粮和毁粮条件；牛津史学所引Selous、Sykes、Alderson报告包含**焚屋、夺粮、追击撤退者、洞穴炸药、妇孺避难**。个案有不同指挥系统，按具体军人和军政链条区分。
7. [Martin调查在1898年下院公布讨论](https://api.parliament.uk/historic-hansard/commons/1898/may/06/class-ii)：确认强征劳工确有制度性安排、官员供给公私机构、经地方首领无果后用武力；同时保存公司支持者质疑强征程度的辩护。
8. 牛津研究对1893—1895 Ndebele **4,000—5,000**及1896—1897诸区死亡提出**含战斗、饥荒与疾病**的长期研究估算；这是研究者估计、不是人口普查或已经完全确证的遇难者名簿。不可与战场分项直接叠加。
9. [联合国教科文组织](https://www.unesco.org/en/memory-world/nehanda-and-kaguvi-mediums-judgement-dockets-april-1897-case-between-state-versus-nehanda-and-kaguvi)确认Nehanda/Kaguvi判决档可追，具体逮捕、审判、执行日期另取卷宗，现代纪念点不当刑场。

## 地理范围和无法定位案例

- 仅将Bulawayo、Harare、London的**现代市级地名**交叉官方史料和GeoNames使用于年份Point（有来源双注册，纬度负号为南半球）。多处城市事件只代表故事导航，不写成旧军营的实际炮击坐标。
- Gwayi、Umguza、Insiza、Makoni、Manyepera、Gwaai/Shangani、Fort Mangwe、Matobo会谈点及王廷旧址，缺19世纪测图/考古配准即保留无位置；不绘假路、不涂British面积。
- 尤其区分“公司特许法律号召”“实际军事进占”“土地个人权利消失”“公司矿权收益”“公司与殖民部下属军队的不同执行责任”。

## 继续查档

- TNA CO879及英国议会1893、1896、1897、1898议会附卷；1893、1894战利品栏牛群个体烙印及拍卖分配账；1894王室令及Gwaai/Shangani同代土地委员会图。
- 1896—1897 Selous、Alderson、Plumer、Sykes原军人日志、征工名册、各乡村死亡/饥馑记录、洞穴爆破原图与津巴布韦地方口述。
- 1900年前公司与英国政府财务往来、矿地登记及王廷交付记录；Nehanda和Kaguvi司法原案；各批次工人工资克扣受害者姓名。

*本审计随制作PR提交，正式独立出版需另起PR且必须检查真实桌面浏览器和Pages。*

## 制作验收结论（2026-11-23）

- [制作PR #541](https://github.com/1959124923wyz-sys/love-British-TV/pull/541)：63/63 Check通过并合并 `eca4890d99cd08cc22aaa7b09d392b4629df1d0d`，含专项史料GIS、1780px Chrome及全站回归。
- 制作期间修复原有Editor15 17世纪目录测试的点击后立即断言竞态条件。真实桌面浏览器已确认T41的1888—1899跨年跳转、历史叙事与Bulawayo／Harare／London城市镜头正常。
- 正式发布仍需新出版PR全绿、合并及Pages build/deploy验证。严禁提前报公开成功。
