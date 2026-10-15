#!/usr/bin/env python3
"""Rebuild ALL chapter 11 editor files directly from reviewed research records.

Fail closed and never infer 1590s Polygon, battle GPS, slave sales or Crown profit.
No HTTP dependency; GitHub runner uses only committed sources.
"""
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parent
ED=ROOT/"editor_import"
ALLOWED_ICONS=set("POL EXP TER WAR REP SLV LAB ECO DIS FAM RES ABO IND INF CLM DOC".split())
def load(f):
    return json.loads((ROOT/f).read_text(encoding="utf-8"))
def dump(f,o):
    p=ROOT/f;p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(json.dumps(o,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
def check(cond,msg):
    if not cond:raise AssertionError(msg)
def build():
    old=load("EVENT_CANDIDATES_1590_1599.json")
    register=load("SOURCE_REGISTRY.json")
    geo=load("editor_import/CONTROL_AND_VIOLENCE_PLACES_1590_1599.geojson")
    account=load("editor_import/PLUNDER_VIOLENCE_ECONOMICS_LEDGER.json")
    control=load("CONTROL_TRANSITION_1589_1599.json")
    ids={s["id"] for s in register["sources"]}
    researchids={e["id"] for e in old["events"]}
    check(len(ids)==register["source_count"]==len(register["sources"]),"source uniqueness")
    check(old["total"]==len(old["events"])>=30,"event count")
    check(len(researchids)==len(old["events"]),"duplicate event IDs")
    check(len(geo["features"])>=7,"site count")
    byevent={}
    for f in geo["features"]:
        check(f["geometry"]["type"]=="Point" and not f["properties"]["polygon_fill_authorized"],"invalid site")
        for id in f["properties"]["associated_events"]:
            check(id in researchids,"site without event")
            byevent.setdefault(id,f)
    icons={e["icon_code"] for e in old["events"]}
    check(icons.issubset(ALLOWED_ICONS),"unapproved icon: "+repr(icons-ALLOWED_ICONS))
    events=[]
    for index,e in enumerate(old["events"],1):
        check(all(q in ids for q in e["source_ids"]),"unresolved primary source "+e["id"])
        check(1590<=e["year"]<=1599,"wrong date")
        p=byevent.get(e["id"])
        when=e.get("month_or_day")
        label=str(e["year"])+"年"
        if when:
            fields=when.split("-")
            label+=str(int(fields[0]))+"月"+(str(int(fields[1]))+"日" if len(fields)==2 else "")
        category=({"RES":"resistance","REP":"English_Crown_political_repression","WAR":"military_attack","ECO":"privateering_plunder","TER":"colonial_land_dispossession","DIS":"accidental_ordnance_disaster","POL":"political_negotiation","SLV":"forcible_capture_of_already_enslaved_Africans_not_proven_sale"}).get(e["icon_code"],"historical_violence")
        events.append({
            "id":"1590S-E"+str(index).zfill(3),
            "research_event_id":e["id"],"year":e["year"],"start_year":e["year"],"end_year":e["year"],"visible_from":e["year"],"date_label":label,
            "name":e["title"],"category":category,"icon_code":e["icon_code"],
            "lat":p["geometry"]["coordinates"][1] if p else None,
            "lng":p["geometry"]["coordinates"][0] if p else None,
            "geography_label":e["place"],
            "geo_precision":p["properties"]["geo_precision"] if p else "original_action_site_geometry_not_obtained",
            "description":e["description"],"short_description":e["description"],
            "source_ids":e["source_ids"],"certainty":"evidence_led_not_an_exact_survey_of_siege_or_killing_site",
            "significance":e["significance"],"colonial_profit":None,"actual_English_land_area_sqkm":None,
            "actual_English_territory_created":False,"historical_control_boundary_verified":False,
            "position_type":"modern_named_site_not_verified_Tudor_footprint" if p else "no_verified_historical_location_point",
            "editorial_status":"chief_editor_candidate_not_main",
            "source_context_warning":e["geography"]["rule"],"date_precision":e["date_precision"],"map_priority":e["significance"]["level"]>=2
        })
    sources=[{"id":s["id"],"title":s["title"],"publisher":s["issuer"],"url":s["url"],"kind":s["source_kind"],"evidence_read_level":s["review_status"],"precision_warning":s["claim_and_limits"],"origin":"1590-1599"} for s in register["sources"]]
    places=[]
    for f in geo["features"]:
        rel=[e for e in events if e["research_event_id"] in f["properties"]["associated_events"]]
        places.append({"id":f["properties"]["stable_id"],"name":f["properties"]["name"],"lat":f["geometry"]["coordinates"][1],"lng":f["geometry"]["coordinates"][0],"status":"modern_place_reference_only",
                       "description":f["properties"]["geo_precision"],"source_geography_url":f["properties"]["source_geography_url"],
                       "source_ids":sorted({s for e in rel for s in e["source_ids"]}),"start_year":min(e["year"] for e in rel),
                       "end_year":max(e["year"] for e in rel),"icon_code":rel[0]["icon_code"],"geo_precision":f["properties"]["geo_precision"],"area_polygon_verified":False,"map_layer":"events","editorial_status":"chief_editor_candidate"})
    atlas={"schema":"chapter11_tudor_control_editor_import_v1","dataset_id":"chapter11-1590-1599-editor-candidate",
       "period":{"from":1590,"to":1599,"next":1600,"start":1590,"end":1599},
       "origin":"research/ch11-1590-1599-violence-colonial-control-20261015","editorial_status":"chief_editor_review_required_not_published",
       "intro":{"title":"暴力兼并、私掠财富与爱尔兰反抗（1590—1599）",
                "description":"英王以焚毁村落、强制法权变更和处决地方领主扩大在爱尔兰的控制，却在阿尔斯特遭连番抵抗；英格兰私掠者夺取葡萄牙商船、洗劫加的斯，1598年暂占波多黎各圣胡安后撤退。1592年一艘运送被奴役非洲人的葡萄牙船遭英格兰私掠者截获；其后续去向与英方出售获利未证。1591年桑托斯和1595年累西腓遭英军洗劫，糖、巴西木与东印度航线货物被夺走。"},
       "events":events,"places":places,"sources":sources,"routes":[],"colonial_polygons":[],
       "presentation":{"year_end_control_file":"CONTROL_TRANSITION_1589_1599.json","control_reference_points":"CONTROL_AND_VIOLENCE_PLACES_1590_1599.geojson",
          "control_delta":"VIOLENCE_AND_CONTROL_DELTA_1590_1599.geojson","financial_archive":"PLUNDER_VIOLENCE_ECONOMICS_LEDGER.json",
          "historic_notes":"HISTORICAL_DETAIL_NOTES_1590_1599.json","chapter10_pending_PR59_not_necessarily_published":True,
          "Britain_did_not_exist_as_a_single_united_sovereign_state_in_1590s":True,
          "verified_historic_occupation_polygon_count":0,"slave_market_sale_evidence_1590s":None,"captured_Portuguese_ship_carrying_enslaved_Africans_in_1592_attested":True,
          "San_Juan_1598_English_present_temporarily_not_year_end":True,"Rathlin_1575_not_chapter11":True,
          "Bingham_1600s_scorched_earth_not_automatically_1590s":True,"ready_for_main":False}}
    delta=[]
    notes={}
    for e in events:
        f=byevent.get(e["research_event_id"])
        delta.append({"type":"Feature","id":"ch11-change-"+e["research_event_id"],"geometry":f["geometry"] if f else None,
                      "properties":{"stable_id":e["research_event_id"],"atlas_event_id":e["id"],"name":e["name"],"year":e["year"],
                       "map_layer":"events","source_ids":e["source_ids"],"kind":e["category"],"controller_area_polygon":None,
                       "historical_boundary_verified":False,"fill_authorized":False,"area_sqkm":None,
                       "spatial_qualification":"modern_named_place" if f else "unlocated_historic_action",
                       "foreign_sovereignty_transferred_by_raid":False}})
        notes[e["id"]]={"context":e["description"],"geography":"这是现代遗址或城市位置参照，不能推导战争所在全部土地的占领边界。" if f else "暂无足以绘制精确史实地点的可信GPS，保持地图坐标空值。",
           "impact":"分别记录当时英王镇压、地方领主反抗及海外私掠，不以单次战役判断永久主权。",
           "accounting":"战利品与王室可得净收益不同；英军战死与其造成的平民伤亡不同；英军没有新证明的1590年代贩奴销售收入不得编造。",
           "source_ids":e["source_ids"],"source_links":[{"title":s["title"],"url":s["url"],"review_status":s["review_status"]} for s in register["sources"] if s["id"] in e["source_ids"]],
           "historical_site_survey_verified":False}
    check(len(account["records"])>=20 and len(control["year_end_states"])==10,"ledger/state missing")
    for l in account["records"]:
        check(set(l["source_ids"]).issubset(ids),"ledger source not in registry")
        check(l["audited_royal_net_profit_gbp"] is None,"invented royal profit")
        check(l["related_event"] is None or l["related_event"] in researchids,"ledger orphan")
    out={"type":"FeatureCollection","schema":"ch11_control_and_violence_delta_v1","count":len(delta),
         "metadata":{"historical_occupation_polygons":0,"modern_point_features":sum(f["geometry"] is not None for f in delta),
           "unlocated_events":sum(f["geometry"] is None for f in delta),"not_for_automatic_colonial_fill":True},
          "features":delta}
    route={"type":"FeatureCollection","schema":"ch11_route_evidence_v1","features":[],"metadata":{
       "purpose":"No accurately measured 1592 Azores, 1595 Guiana, 1596 Caribbean or 1599 Essex march path found; nonzero synthetic lines deliberately withheld",
       "route_segments_confirmed_by_archival_waypoints":0,"route_as_English_territorial_corridor_forbidden":True}}
    qa={"schema":"ch11_editor_data_QA_v1","status":"PASS","as_of":"2026-10-15",
       "method":"GitHub runner static source-ID/dates/geometry/financial audit, not historic map visual or primary manuscript verification",
       "counts":{"sources":len(sources),"events":len(events),"distinct_modern_places":len(places),"mapped_event_points":sum(e["lat"] is not None for e in events),
             "unlocated_events":sum(e["lat"] is None for e in events),"annual_yearend_snapshots":len(control["year_end_states"]),
             "political_and_fort_transitions":len(control["transitions"]),"accounting_lines":len(account["records"]),"document_details":len(notes),
             "historically_audited_occupation_polygons":0},
       "blocked":["No colonised County Tyrone colored as English","No century-old Roanoke British control","No permanent 1598 San Juan colony","No indiscriminate blame for Gaelic-on-English military killing","1592 interception of an enslaved-African carrying Portuguese ship is supported; English slave resale and profit not proven","No automatic sea routes or eighteenth century forts as 1590s shapes"],
       "source_coverage_status":"scholarly/official/edited primary; originals not all directly read",
       "browser_publication_tested":False,"main_merge_authorized":False}
    dump("editor_import/ATLAS_EVENT_REVIEW_CANDIDATE.json",atlas)
    dump("editor_import/VIOLENCE_AND_CONTROL_DELTA_1590_1599.geojson",out)
    dump("editor_import/HISTORICAL_DETAIL_NOTES_1590_1599.json",{"schema":"atlas-event-notes-v1","period":[1590,1599],"status":"chief_editor_candidate", "records":notes})
    dump("editor_import/VIOLENT_EXTRACTION_ROUTE_REFERENCES_1590_1599.geojson",route)
    dump("editor_import/EDITOR_QA.json",qa)
    print("PASS CH11",qa["counts"])
if __name__=="__main__":
    build()
