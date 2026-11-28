/* Cross-century mother-topic contract: old ten-year chapters must remain untouched. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const serial=load('data/stories/serial/index.json');
const chapters=load('data/chapters.json');
const old=load('data/stories/index.json');
const reader=fs.readFileSync(path.join(root,'js/history-stories.js'),'utf8');
assert.equal(serial.schema,'atlas-serial-stories-v1');
assert.equal(serial.navigation_contract,'existing_decade_chapters_unchanged');
assert.deepEqual(serial.topics.filter(t=>t.status==='published').map(t=>t.id).sort(),['E20-KEN-HOLA','E20-SOUTH-AFRICAN-WAR-CAMPS','E20-MAL-BATANG-KALI','E20-T040-CYPRUS-EMERGENCY-DETENTION-1931-1960','E20-T088-AUSTRALIA-NUCLEAR-LAND-1950-1999','E20-T089-PACIFIC-NUCLEAR-COMMUNITIES-1957-1999','E20-T050-NIGERIA-TAX-LABOUR-1914-1960','E20-T085-SOLOMONS-LABOUR-LAND-MAASINA-1901-1978','E20-T086-NEW-HEBRIDES-CONDOMINIUM-LAND-LABOUR-1906-1980','E20-T032-PALESTINE-MANDATE-LAND-REPRESSION-1917-1939','E20-T033-PALESTINE-DETENTION-IMMIGRATION-WITHDRAWAL-1939-1949','E20-T074-BRITISH-CHILD-MIGRATION-1902-1998','E20-T066-CHAGOS-FORCED-DISPLACEMENT-1964-1998','E20-T083-BANABA-PHOSPHATE-1900-1997','E20-T084-NAURU-PHOSPHATE-1906-1994','E20-T044-KENYA-LAND-1900-1963','E20-T027-EGYPT-OCCUPATION-DENSHAWAI-REVOLUTION-1900-1922','E20-T028-EGYPT-BASES-TREATY-PRIVILEGES-1922-1956','E20-T029-SUEZ-WAR-CIVILIAN-DAMAGE-1956','E20-T030-IRAQ-OCCUPATION-MANDATE-1914-1932','E20-T031-IRAQ-BASES-OIL-1941-1932-1958','E20-T023-INDONESIA-BRITISH-INTERVENTION-1945-1946','E20-T024-INDOCHINA-BRITISH-INTERVENTION-1945-1946','E20-T019-MALAYA-RUBBER-TIN-LABOUR-1900-1942','E20-T021-SINGAPORE-LABOUR-DETENTION-1945-1959','E20-T015-CHINA-CONCESSIONS-EXTRATERRITORIALITY-1900-1949','E20-T016-MAY-THIRTIETH-CANTON-HONG-KONG-STRIKE-1925-1927','E20-T012-BURMA-WARTIME-TRANSITION-1937-1948','E20-T013-BOXER-LOOT-INDEMNITY-1900-1913','E20-T014-TIBET-LOOT-TRADE-INDEMNITY-1903-1906','E20-T010-CEYLON-PLANTATION-MARTIAL-LAW-1900-1948','E20-T011-BURMA-RICE-LAND-REBELLION-1900-1937','E20-T005-FRONTIER-COLLECTIVE-PUNISHMENT-1901-1947','E20-T009-PARTITION-REFUGEES-1946-1948','E20-T007-QUIT-INDIA-DETENTION-1942-1945','E20-T008-BENGAL-FAMINE-1942-1945','E20-SALT-MARCH','E20-T003-BENGAL-PARTITION-DETENTION-1905-1919','E20-AMRITSAR-MASSACRE','E20-T002-INDIA-LAND-REVENUE-1900-1947','E20-T001-INDIA-FAMINE-RELIEF-1900-1909',"E19-T32-ZANZIBAR-PROTECTORATE-SLAVERY-1890-1898","E19-T35-SIERRA-LEONE-GAMBIA-TAX-DEPORTATION-1816-1899","E19-T39-NATAL-HLUBI-ZULU-ANNEXATION-EXILE-1873-1897","E19-T59-INDIA-COLLECTIVE-FINES-CRIMINAL-TRIBES-1852-1872","E19-T27-HONG-KONG-NEW-TERRITORIES-LAND-1888-1899","E19-T28-EAST-ASIA-INDEMNITIES-LEASES-1862-1898","E19-T30-JAVA-YOGYAKARTA-PALAMBANG-BANDA-1810-1842","E19-T29-MALAYA-NORTH-BORNEO-1824-1898","E19-T22-INDIAN-FRONTIER-EXPEDITIONS-1861-1898","E19-T24-ADEN-GULF-OMAN-PERSIAN-WAR-1809-1899","E19-T23-AFGHAN-WARS-INTERVENTION-1839-1881","E19-T25-PERSIAN-CONCESSIONS-CYPRUS-TRIBUTE-1872-1892","E19-T12-HIGHLAND-CLEARANCES-CROFTER-LAND-1811-1883","E19-T13-BRITISH-LABOUR-REPRESSION-TRANSPORTATION-1817-1855","E19-T16-EASTERN-INDIA-LAND-ADIVASI-RESISTANCE-1814-1899","E19-T17-BENGAL-INDIGO-ASSAM-TEA-COERCION-1840-1882","E19-T18-CEYLON-LAND-PLANTATIONS-PADDY-TAX-1815-1892",'E19-T07-RIO-DE-LA-PLATA-INVASION-BLOCKADE-1806-1850','E19-T08-FALKLANDS-GUIANA-BOUNDARY-1832-1899','E19-T09-BRITISH-CAPITAL-LATIN-AMERICA-SLAVERY-MINING-1810-1882','E19-T11-IRISH-LAND-WAR-COERCION-TRANSPORTATION-1803-1888','E19-T14-SINDH-PUNJAB-AWADH-CONQUEST-EXPROPRIATION','E19-T10-IRISH-FAMINE-EVICTIONS-ESTATES','E19-T21-BURMA-THREE-WARS-DISPOSSESSION','E19-T33-LAGOS-NIGER-BENIN-COMPANY-CONQUEST','E19-T34-GOLD-COAST-ASANTE-CONQUEST-LAND-GOLD','E19-T36-EGYPT-SUDAN-BOMBARDMENT-CONQUEST-CONDOMINIUM','E19-T40-SOUTHERN-AFRICA-MINES-CONVICT-LABOUR-BOER-WAR','E19-T41-MATABELELAND-CONQUEST-CATTLE-LOOT-CHIMURENGA','E19-T42-BASOTHO-CATTLE-DISARMAMENT-SOUTHERN-PROTECTORATES','E19-T43-NYASALAND-LAND-CLAIMS-GUNBOATS-ATROCITIES','E19-T44-CHAGOS-PLANTATIONS-COAL-INDENTURE-LAND-1835-1888','E19-T45-PALAWA-WAR-REMOVAL-REMAINS-1803-1878','E19-T47-AUSTRALIAN-INCARCERATION-REMOVAL-LABOUR-1838-1899','E19-T51-PACIFIC-LABOUR-GUANO-JURISDICTION-1843-1899','E19-T53-CANADA-TREATIES-RESERVES-PASS-1862-1899','E19-T55-CANADIAN-PACIFIC-RAILWAY-CHINESE-HEAD-TAX-1878-1899','E19-T57-CANADA-INDIGENOUS-STATUS-RESIDENTIAL-SCHOOLS-1842-1899','E19-T19-INDIA-FAMINES-COLONIAL-RELIEF-1866-1899','E19-T20-INDIA-FISCAL-RAILWAY-RESOURCE-TRANSFER-1849-1899','E19-T31-EAST-AFRICA-COMPANY-PROTECTORATES-RAILWAY-1884-1899','E19-T38-CAPE-FRONTIER-DISPOSSESSION-LABOUR-1850-1899','E19-T04-CARIBBEAN-PLANTATION-RESISTANCE-REPRESSION-1816-1897','E19-T06-BELIZE-GUIANA-TIMBER-LAND-RIGHTS-1814-1893','E19-T15-INDIAN-UPRISING-REPRISALS','E19-T26-OPIUM-WARS-CHINA-TREATY-PORTS','E19-T01-ABOLITION-COMPENSATION-APPRENTICESHIP-SUGAR-1801-1899','E19-T02-LIBERATED-AFRICANS-APPRENTICESHIP-1800-1875','E19-T03-INDIAN-INDENTURE-PLANTATION-LABOUR-1834-1899','E19-T48-NEW-ZEALAND-MAORI-LAND-CONFISCATION-WARS','E19-BUSSA-REBELLION','E19-CAPE-OPENING','E19-GULF-EXPEDITION-1809','E19-GULF-EXPEDITION-1819','E19-GULF-MARITIME-TREATY','E19-KANDY-OPENING','E19-RISDON-COVE','E19-T05-MORANT-BAY-MARTIAL-LAW-CROWN-COLONY','E19-T37-MAQDALA-EXPEDITION-LOOTING','E19-T46-AUSTRALIAN-FRONTIER-LAND-VIOLENCE','E6-T03-LAND-1642-1698','E6-T04-DARIEN','E6-T04-GLENCOE','E6-T05','E6-T06','E6-T07-BARBADOS','E6-T08','E6-T09-CAR','E6-T09-NY','E6-T10-ACADIA','E6-T10-HBC','E6-T10-NEWFOUNDLAND','E6-T11-VOYAGES','E6-T12','E6-T13','E6-T14-NAV','E6-T02','E6-T15','E6-T01','E6-T16-SURINAME','E6-T16-PROVIDENCE','E6-T17-AFRICAN-FORTS','E6-T07-LEEWARD','E6-T04-CONQUEST','E6-T03-WILLIAMITE-WAR','E6-T09-PENNSYLVANIA','E6-T10-QUEBEC-KIRKE','E6-T16-ATLANTIC-ISLANDS','E6-T09-NE-DOMINION'].sort() ,'only explicitly editor-audited completed story stages may publish');
const canonicalFamilies=Array.from({length:15},(_,i)=>'E6-T'+String(i+1).padStart(2,'0'));
const knownIds=new Set(serial.topics.map(t=>t.id));
assert.equal(knownIds.size,serial.topics.length,'unique IDs required');
for(const id of canonicalFamilies)assert(knownIds.has(id),'missing original mother family: '+id);
assert(serial.topics.length>=15,'may grow by reviewed subtopic additions');
const t46=serial.topics.find(t=>t.id==='E19-T46-AUSTRALIAN-FRONTIER-LAND-VIOLENCE');
assert(t46?.status==='published'&&t46?.publication_review==='approved'&&t46?.event_ids?.length===39,'T46 formally approved historical Australian frontier five-chapter longform');
const t05=serial.topics.find(t=>t.id==='E19-T05-MORANT-BAY-MARTIAL-LAW-CROWN-COLONY');
assert(t05?.status==='published'&&t05?.publication_review==='approved'&&t05.event_ids?.length===23,'T05 requires approved production PR with 23 audited Morant Bay event links');
assert(t05.article_file==='data/stories/serial/e19-t05-morant-bay-martial-law-crown-colony-1865-1879.json');
const t41=serial.topics.find(t=>t.id==='E19-T41-MATABELELAND-CONQUEST-CATTLE-LOOT-CHIMURENGA');
assert(t41?.status==='published'&&t41?.publication_review==='approved'&&t41.event_ids?.length===37&&t41.article_file==='data/stories/serial/e19-t41-matabeleland-conquest-cattle-chimurenga-1888-1899.json','T41 needs independent approval and all 37 crosslinked Matabeleland cases');
const t42=serial.topics.find(t=>t.id==='E19-T42-BASOTHO-CATTLE-DISARMAMENT-SOUTHERN-PROTECTORATES');
assert(t42?.status==='published'&&t42?.publication_review==='approved'&&t42.event_ids?.length===20&&t42.article_file==='data/stories/serial/e19-t42-basotho-cattle-disarmament-southern-protectorates-1852-1890.json','T42 requires independently reviewed 20 Basotho colonial plunder and south Africa legal events');
const t44=serial.topics.find(t=>t.id==='E19-T44-CHAGOS-PLANTATIONS-COAL-INDENTURE-LAND-1835-1888');
assert(t44?.status==='published'&&t44?.publication_review==='approved'&&t44.event_ids?.length===35&&t44.article_file==='data/stories/serial/e19-t44-chagos-plantations-coal-indenture-1835-1888.json','T44 Chagos independent publication requires 35 source-linked events with 33 new and two reused IDs');
const t43=serial.topics.find(t=>t.id==='E19-T43-NYASALAND-LAND-CLAIMS-GUNBOATS-ATROCITIES');
assert(t43?.status==='published'&&t43?.publication_review==='approved'&&t43.event_ids?.length===37&&t43.article_file==='data/stories/serial/e19-t43-nyasaland-land-claims-gunboats-atrocities-1891-1896.json','T43 independent source-reviewed Nyasaland artillery burnings land claims and execution requires 37 links');
const t40=serial.topics.find(t=>t.id==='E19-T40-SOUTHERN-AFRICA-MINES-CONVICT-LABOUR-BOER-WAR');
assert(t40?.status==='published'&&t40?.publication_review==='approved'&&t40.event_ids?.length===33&&t40.article_file==='data/stories/serial/e19-t40-southern-africa-mines-labour-war-1866-1899.json','T40 requires independent approved publication and 33 case-linked map events');
const t36=serial.topics.find(t=>t.id==='E19-T36-EGYPT-SUDAN-BOMBARDMENT-CONQUEST-CONDOMINIUM');
assert(t36?.status==='published'&&t36?.publication_review==='approved'&&t36.event_ids?.length===33&&t36.article_file==='data/stories/serial/e19-t36-egypt-sudan-conquest-1875-1899.json','T36 must have independent release approval and 33 archival event links');
const t34=serial.topics.find(t=>t.id==='E19-T34-GOLD-COAST-ASANTE-CONQUEST-LAND-GOLD');
assert(t34?.status==='published'&&t34?.publication_review==='approved'&&t34.event_ids?.length===35&&t34.article_file==='data/stories/serial/e19-t34-gold-coast-asante-conquest-1844-1899.json','T34 requires independent publication approval with all 35 source-backed events');
const t33=serial.topics.find(t=>t.id==='E19-T33-LAGOS-NIGER-BENIN-COMPANY-CONQUEST');
assert(t33?.status==='published'&&t33?.publication_review==='approved'&&t33.event_ids?.length===39&&t33.article_file==='data/stories/serial/e19-t33-lagos-niger-benin-conquest-1851-1899.json','T33 must have independent release approval and 39 source-linked events');
const t48=serial.topics.find(t=>t.id==='E19-T48-NEW-ZEALAND-MAORI-LAND-CONFISCATION-WARS');
assert(t48?.status==='published'&&t48?.publication_review==='approved'&&t48.event_ids?.length===81,'T48 new zealand must have 81 real links and publication approval');
assert(t48.article_file==='data/stories/serial/e19-t48-new-zealand-maori-confiscation-1840-1883.json');
const t21=serial.topics.find(t=>t.id==='E19-T21-BURMA-THREE-WARS-DISPOSSESSION');
assert(t21?.status==='published'&&t21?.publication_review==='approved'&&t21.event_ids?.length===109,'T21 Burma requires 109 audited event links and explicit approved publication');
assert(t21.article_file==='data/stories/serial/e19-t21-burma-three-wars-wuntho-land-rice-1823-1899.json');
const t10=serial.topics.find(t=>t.id==='E19-T10-IRISH-FAMINE-EVICTIONS-ESTATES');
assert(t10?.status==='published'&&t10?.publication_review==='approved'&&t10.event_ids?.length===34,'T10 publication must retain 34 sourced events');
assert(t10.article_file==='data/stories/serial/e19-t10-irish-famine-evictions-estates-1842-1861.json');
const t14=serial.topics.find(t=>t.id==='E19-T14-SINDH-PUNJAB-AWADH-CONQUEST-EXPROPRIATION');
assert(t14?.status==='published'&&t14?.publication_review==='approved'&&t14.event_ids?.length===51,'T14 must be independently approved with 51 reused dated source events');
assert(t14.article_file==='data/stories/serial/e19-t14-sindh-punjab-awadh-conquest-expropriation-1842-1859.json');
const t37=serial.topics.find(t=>t.id==='E19-T37-MAQDALA-EXPEDITION-LOOTING');
assert(t37&&t37.status==='published'&&t37.publication_review==='approved'&&t37.event_ids.length===12&&t37.source_register_state?.includes('museum'), 'T37 Maqdala is an explicitly approved publication with retained archival scope');
const glencoe=serial.topics.find(t=>t.id==='E6-T04-GLENCOE');
assert(glencoe && glencoe.parent_topic_id==='E6-T04','approved Glencoe subtopic ID must link to unchanged Scottish parent');
assert(glencoe.status==='published' && glencoe.publication_review==='approved' && glencoe.article_file==='data/stories/serial/e6-t04-glencoe.json','Glencoe publication requires explicitly approved existing article file');
assert.deepEqual(glencoe.event_ids,['E6-GLENCOE-1692','1690S-E049','1690S-E050','1690S-E027'],'Glencoe article must be accessible from 1692 oath and massacre plus 1695 parliamentary inquiry');
const jamaica=serial.topics.find(t=>t.id==='E6-T08');
assert(jamaica?.status==='published'&&jamaica.publication_review==='approved'&&jamaica.event_ids.length===17,'Jamaica story must have vetted historical event registry');
const ny=serial.topics.find(t=>t.id==='E6-T09-NY');
assert(ny&&ny.parent_topic_id==='E6-T09'&&ny.status==='published'&&ny.publication_review==='approved'&&ny.event_ids.length>=16);
assert(serial.topics.find(t=>t.id==='E6-T09')?.status==='research_only','Carolina and New York mother topic must stay in research');
const carolina=serial.topics.find(t=>t.id==='E6-T09-CAR');
assert(carolina&&carolina.parent_topic_id==='E6-T09'&&carolina.status==='published'&&carolina.publication_review==='approved'&&carolina.event_ids.length>=15);
const acadia=serial.topics.find(t=>t.id==='E6-T10-ACADIA');
assert(acadia&&acadia.parent_topic_id==='E6-T10'&&acadia.status==='published'&&acadia.publication_review==='approved'&&acadia.event_ids.length>=20);
const hudson=serial.topics.find(t=>t.id==='E6-T10-HBC');
assert(hudson&&hudson.parent_topic_id==='E6-T10'&&hudson.status==='published'&&hudson.publication_review==='approved'&&hudson.event_ids.length>=16);
assert(serial.topics.find(t=>t.id==='E6-T10')?.status==='research_only','E6-T10 mother arc remains research-only after publication of three independent children');
const nf=serial.topics.find(t=>t.id==='E6-T10-NEWFOUNDLAND');
assert(nf&&nf.parent_topic_id==='E6-T10'&&nf.status==='published'&&nf.publication_review==='approved'&&nf.event_ids.length>=14,'Newfoundland publication must have source-backed episode targets');
const darien=serial.topics.find(t=>t.id==='E6-T04-DARIEN');
assert(darien?.parent_topic_id==='E6-T04'&&darien.status==='published'&&darien.publication_review==='approved'&&darien.event_ids.length>=10);
assert(serial.topics.find(t=>t.id==='E6-T04')?.status==='research_only','Scottish larger arc remains active');
const forcedVoyages=serial.topics.find(t=>t.id==='E6-T11-VOYAGES');
assert(forcedVoyages?.parent_topic_id==='E6-T11'&&forcedVoyages.status==='published'&&forcedVoyages.publication_review==='approved'&&forcedVoyages.event_ids.length>=14);
assert(serial.topics.find(t=>t.id==='E6-T11')?.status==='research_only','unverified individual 17C shipboard mutinies remain research');
const navigation=serial.topics.find(t=>t.id==='E6-T14-NAV');
assert(navigation?.parent_topic_id==='E6-T14'&&navigation.status==='published'&&navigation.publication_review==='approved'&&navigation.event_ids.length>=20);
assert(serial.topics.find(t=>t.id==='E6-T14')?.status==='research_only','individual privateer cases still await research');
const virginia=serial.topics.find(t=>t.id==='E6-T05');
assert(virginia?.status==='published'&&virginia.publication_review==='approved'&&virginia.event_ids.length>=30,'Virginia long-form Pequot-equivalent published entry must have source-linked existing events');
const newEngland=serial.topics.find(t=>t.id==='E6-T06');
assert(newEngland?.status==='published'&&newEngland.publication_review==='approved'&&newEngland.event_ids.length>=30,'New England Indigenous wars must have source-backed real event links');
const barbados=serial.topics.find(t=>t.id==='E6-T07-BARBADOS');
assert(barbados&&barbados.parent_topic_id==='E6-T07'&&barbados.status==='published'&&barbados.publication_review==='approved');
assert(barbados.event_ids.length>=8,'Barbados topic must connect across multiple decades');
const irelandLand=serial.topics.find(t=>t.id==='E6-T03-LAND-1642-1698');
assert(irelandLand&&irelandLand.parent_topic_id==='E6-T03'&&irelandLand.status==='published'&&irelandLand.publication_review==='approved'&&irelandLand.event_ids.length>=20);
const eastIndia=serial.topics.find(t=>t.id==='E6-T12');
assert(eastIndia&&eastIndia.status==='published'&&eastIndia.publication_review==='approved');
assert(eastIndia.event_ids.length>=30,'EIC long story must be joined to the actual historic event records');
const royalAfrica=serial.topics.find(t=>t.id==='E6-T13');
assert(royalAfrica&&royalAfrica.status==='published'&&royalAfrica.publication_review==='approved');
assert(royalAfrica.event_ids.length>=18,'RAC major story must connect genuine existing atlas event records');
assert(serial.topics.find(t=>t.id==='E6-T11')?.status==='research_only','the separate Atlantic forced-voyage mother topic is not auto-published');
assert.equal(chapters.chapters.length,10,'published 1497-1599 decade chapters must not change');
assert.equal(chapters.chapters.at(-1).end,1599);
assert.equal(old.schema,'atlas-major-stories-index-v1');
assert(reader.includes("data/stories/serial/index.json"),'reader must opt into approved serial registry');
assert(!reader.includes('openSerialLibrary'),'do not create a separate long-story catalog');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(!html.includes('serialStoriesButton'),'top header must remain as in historical map design');
const seen=new Set();
for(const t of serial.topics){
 assert(/^[A-Za-z0-9-]+$/.test(t.id));
 assert(!seen.has(t.id),'duplicate topic ID: '+t.id);seen.add(t.id);
 if(t.parent_topic_id)assert(knownIds.has(t.parent_topic_id)&&t.parent_topic_id!==t.id,'orphan or circular direct parent ID');
 assert(typeof t.title==='string'&&t.title.length>0);
 assert(Number.isInteger(t.origin_year));
 assert(t.historical_end_year===null||(Number.isInteger(t.historical_end_year)&&t.historical_end_year>=t.origin_year));
 assert(Number.isInteger(t.research_window.start_year)&&Number.isInteger(t.research_window.end_year));
 assert(t.research_window.start_year<=t.research_window.end_year);
 assert(['research_only','editorial_review','published'].includes(t.status));
 assert(Array.isArray(t.event_ids)&&Array.isArray(t.segments));
 assert(Array.isArray(t.predecessor_ids)&&Array.isArray(t.successor_ids));
 const segmentIds=new Set();
 for(const s of t.segments){
  assert(s.id&& !segmentIds.has(s.id));segmentIds.add(s.id);
  assert(Number.isInteger(s.start_year)&&Number.isInteger(s.end_year)&&s.end_year>=s.start_year);
  // decade time slices are a display-only plan; do not cap historic_end_year
  assert(Math.floor(s.start_year/10)===Math.floor(s.end_year/10),'segment must be decade slice');
 }
 for(const s of t.segments){
  for(const k of ['prev_segment_id','next_segment_id'])if(s[k])assert(segmentIds.has(s[k]),'dangling decade slice link '+s[k]);
 }
 if(t.status!=='published')continue;
 assert.equal(t.publication_review,'approved','publication requires explicit editor approval');
 assert.equal(typeof t.article_file,'string');
 assert(/^data\/stories\/serial\/[a-z0-9-]+\.json$/.test(t.article_file));
 const article=load(t.article_file);
 assert.equal(article.id,t.id,'parent and article IDs must match');
 assert.equal(article.schema,'atlas-major-story-v1');
 assert.equal(typeof article.start_year,'number');
 assert.equal(typeof article.end_year,'number');
 assert(article.start_year<=article.end_year);
 assert(Array.isArray(article.sources)&&article.sources.length>=5);
 assert(Array.isArray(article.sections)&&article.sections.length>=8,'public story must contain full narrative stages');
 assert(typeof article.lead==='string'&&article.lead.length>=120);
 assert(article.sections.flatMap(s=>s.paragraphs).join('').length>=3000,'public major-story baseline: 3000 narrative characters');
 const sourceKeys=new Set(article.sources.map(s=>s.id));
 assert.equal(sourceKeys.size,article.sources.length,'duplicate source ID');
 for(const source of article.sources){
  assert(typeof source.url==='string'&&source.url.startsWith('https://'),'original source URL required');
  assert(source.access&&!source.access.includes('placeholder'),'do not publish unverified source placeholders');
 }
 if(t.parent_topic_id)assert.equal(article.parent_serial_topic_id,t.parent_topic_id,'article must link to approved series parent');
 const sections=new Set();
 for(const sec of article.sections){
  assert(sec.id&&sec.heading&&Array.isArray(sec.paragraphs)&&sec.paragraphs.length>=2);
  assert(!sections.has(sec.id),'duplicate section ID');sections.add(sec.id);
  assert(sec.period_start_year>=article.start_year&&sec.period_end_year<=article.end_year,'section date range differs from article period');
  assert(sec.period_start_year<=sec.period_end_year,'invalid section date interval');
  assert(Array.isArray(sec.source_keys)&&sec.source_keys.length>0);
  for(const key of sec.source_keys)assert(sourceKeys.has(key),'section uses missing source key: '+key);
  for(const paragraph of sec.paragraphs){
   assert(!/(本轮研究|本轮任务|下轮补充|GIS|地图不应画|未伪称)/.test(paragraph.replace(/\[\[[A-Za-z0-9-]+\|([^\]\n]+)\]\]/g,'$1')),'work-in-progress editorial notes are not public prose');
  }
 }
 assert(Array.isArray(article.topic_source_claims)&&article.topic_source_claims.length>0,'claim matrix must ship with article');
 for(const claim of article.topic_source_claims){
  assert(sections.has(claim.section_id),'claim references missing section');
  assert(Array.isArray(claim.source_keys)&&claim.source_keys.length>0);
  for(const key of claim.source_keys)assert(sourceKeys.has(key),'claim references missing source: '+key);
  assert(claim.original_document_page||claim.verification_depth,'claim location or access depth missing');
 }
 assert(Array.isArray(t.event_ids),'topic event IDs are independent of long-form publication');
 for(const id of t.event_ids) assert(/^[A-Za-z0-9-]+$/.test(id));
}
assert(!reader.includes('data/stories/serial/atlas-'),'must not fold serial registry into decade atlas');
console.log('PASS: serial story registry,',serial.topics.length,'review families, approved published stories retained');

const preview=load('data/stories/serial/chronology-preview-1600-1699.json');
assert.equal(preview.schema,'atlas-serial-chronology-preview-v1');
assert.equal(preview.from_year,1600);assert.equal(preview.to_year,1699);
assert.equal(preview.events.length,1,'only documented 1692 event may appear before full 17c audit');
assert.equal(preview.events[0].year,1692);
assert.equal(preview.events[0].id,'E6-GLENCOE-1692');
assert.equal(preview.events[0].historical_control_boundary_verified,false);
assert.equal(preview.events[0].actual_English_land_area_sqkm,null);
assert(!preview.colonial_polygons.length,'no fabricated 17c sovereignty polygons');
assert.equal(preview.events[0].geo_precision,'historic_house_site_approximate_100m_not_all_massacre_sites');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert(app.includes("function setYear(v)"),'preserve original year slider');
assert(app.includes("storyPreviewChapterForDecade"),'continue to use ten-year chapters');
assert(app.includes("serialPreviewByDecade.get(decadeForYear(next))"),'year slider must select 17c decade');
assert(!html.includes('长期专题</button>'),'no new header feature');

assert(serial.topics.some(t=>t.id==='E19-T45-PALAWA-WAR-REMOVAL-REMAINS-1803-1878'&&t.status==='published'&&t.publication_review==='approved'&&t.event_ids.length===34),'publication PR T45: 34 source-linked events');
assert(serial.topics.some(t=>t.id==='E19-T47-AUSTRALIAN-INCARCERATION-REMOVAL-LABOUR-1838-1899'&&t.status==='published'&&t.publication_review==='approved'&&t.event_ids.length===35),'publication PR T47: 35 source-linked events');
assert(serial.topics.some(t=>t.id==='E19-T51-PACIFIC-LABOUR-GUANO-JURISDICTION-1843-1899'&&t.status==='published'&&t.publication_review==='approved'&&t.event_ids.length===32),'publication PR T51: 32 source-linked events');

assert(serial.topics.some(t=>t.id==='E19-T53-CANADA-TREATIES-RESERVES-PASS-1862-1899'&&t.status==='published'&&t.publication_review==='approved'&&t.event_ids.length===29),'publication PR T53: 29 audited treaty and pass events');
assert(serial.topics.some(t=>t.id==='E19-T55-CANADIAN-PACIFIC-RAILWAY-CHINESE-HEAD-TAX-1878-1899'&&t.status==='published'&&t.publication_review==='approved'&&t.event_ids.length===20),'publication PR T55: 20 audited railway land and Chinese labour events');

assert(serial.topics.some(t=>t.id==='E19-T57-CANADA-INDIGENOUS-STATUS-RESIDENTIAL-SCHOOLS-1842-1899'&&t.status==='published'&&t.publication_review==='approved'&&t.event_ids.length===24),'publication PR T57: audited identity and residential school events');

assert(serial.topics.some(t=>t.id==='E19-T01-ABOLITION-COMPENSATION-APPRENTICESHIP-SUGAR-1801-1899'&&t.status==='published'&&t.publication_review==='approved'&&t.event_ids.length===25),'publication T01: 25 reviewed event links');
assert(serial.topics.some(t=>t.id==='E19-T02-LIBERATED-AFRICANS-APPRENTICESHIP-1800-1875'&&t.status==='published'&&t.publication_review==='approved'&&t.event_ids.length===25),'publication T02: 25 reviewed event links');
assert(serial.topics.some(t=>t.id==='E19-T03-INDIAN-INDENTURE-PLANTATION-LABOUR-1834-1899'&&t.status==='published'&&t.publication_review==='approved'&&t.event_ids.length===32),'publication T03: 32 reviewed event links');
