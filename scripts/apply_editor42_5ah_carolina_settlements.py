#!/usr/bin/env python3
"""5AH: keep original 1700-1711 Carolina charter bbox as documentary evidence;\nAlways preserve source provenance and previous 479 point baseline intact.
retire only its display and add independent named point references from sources.
No cadastral border, historical polygon, percentage or area invented.
"""
import json
import re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/"data/eighteenth-century-mass-schematic-zones-1700-1799.json"
MANIFEST=ROOT/"data/eighteenth-century-editor42-5ah-carolina-localized-sites.json"
raw=SRC.read_text(encoding="utf-8")
before=json.loads(raw)
source=json.loads(MANIFEST.read_text(encoding="utf-8"))
entries=source["local_sites"]
ids={e["id"] for e in entries}
assert ids=={
    "CAROLINA_CHARLESTOWN_1700_1711",
    "CAROLINA_BATH_TOWN_1705_1711",
    "CAROLINA_NEW_BERN_1710_1711",
}
assert len(before["zones"])==81 and len(before["sites"])==42
assert len(before["regional_zones"])==280
assert len(before["regional_sites"]) in (479,482)
assert before["area_aggregation_forbidden"] is True
assert before["approved_actual_control_polygons"]==0
old=next(z for z in before["zones"] if z["id"]=="CAROLINA_PROPRIETORS")
assert old["kind"]=="paper_claim"
assert old["periods"]==[{"start_year":1700,"end_year":1711}]
assert old["bbox"]==[-83.8,31.3,-75.5,36.7]
assert old["source_urls"]==[
 "https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/american-and-west-indian-colonies-before-1782"]
assert old["area_sqkm"] is None and old["territorial_control_verified"] is False
assert old.get("superseded_by") in (None,source["supersession_pointer"])
assert source["historical_boundary_reconstruction_count"]==0
assert source["existing_localized_record_ids"]==["CHARLESTON_FORT_JOHNSON"]
old_fort=next(x for x in before["regional_sites"] if x["id"]=="CHARLESTON_FORT_JOHNSON")
assert old_fort["geometry"]["type"]=="Point"
assert any(x["start_year"]==1708 for x in old_fort["periods"])
assert len({x["id"] for x in before["regional_sites"]})==len(before["regional_sites"])

for site in entries:
    assert site["geometry"]["type"]=="Point"
    assert site["area_sqkm"] is None
    assert site["historical_boundary_confirmed"] is False
    assert site["territorial_control_verified"] is False
    assert site["exclude_from_territorial_area_totals"] is True
    assert site["uncertain_line_dashed"] is True
    assert site["geometry_precision"]=="modern_named_place_reference_point_only"
    assert site["source_urls"] and all(u.startswith("https://") for u in site["source_urls"])
    assert site["periods"][-1]["end_year"]==1711
    assert 1700<=site["periods"][0]["start_year"]<=1710
    c=site["geometry"]["coordinates"]
    assert len(c)==2 and -84<c[0]<-75 and 31<c[1]<37

if old.get("superseded_by") is None:
    pat=re.compile(r'(?m)^([ \t]*)"id": "CAROLINA_PROPRIETORS",\r?\n')
    assert len(pat.findall(raw))==1
    raw,count=pat.subn(lambda m:m.group(0)+m.group(1)+
        '"superseded_by": "'+source["supersession_pointer"]+'",\n',raw,count=1)
    assert count==1

existing={x["id"] for x in before["regional_sites"]}
if ids & existing:
    assert ids <= existing and len(before["regional_sites"])==482
else:
    assert len(before["regional_sites"])==479
    marker=re.compile(r'(?m)^([ \t]*)"regional_sites": \[(\r?\n)')
    assert len(marker.findall(raw))==1
    def inject(m):
        # Existing array members are preserved byte-for-byte after these 3 records.
        indent=m.group(1)+"  "
        blocks=[ "\n".join(indent+line for line in json.dumps(
            entry,ensure_ascii=False,indent=2).splitlines()) for entry in entries ]
        return m.group(0)+",\n".join(blocks)+",\n"
    raw,count=marker.subn(inject,raw,count=1)
    assert count==1

after=json.loads(raw)
assert len(after["zones"])==81 and len(after["sites"])==42
assert len(after["regional_zones"])==280 and len(after["regional_sites"])==482
assert after["regional_sites"][:3]==entries
if len(before["regional_sites"])==479:
    assert after["regional_sites"][3:]==before["regional_sites"]
else:
    assert after["regional_sites"]==before["regional_sites"]
assert after["regional_zones"]==before["regional_zones"]
assert after["regional_lines"]==before["regional_lines"]
assert after["coastal_rights"]==before["coastal_rights"]
assert after["sites"]==before["sites"]
assert after["sources"]==before["sources"]
for former,now in zip(before["zones"],after["zones"]):
    if former["id"]=="CAROLINA_PROPRIETORS":
        assert {k:v for k,v in former.items() if k!="superseded_by"}=={
            k:v for k,v in now.items() if k!="superseded_by"}
        assert now["superseded_by"]==source["supersession_pointer"]
    else:
        assert former==now
assert not [z for z in after["zones"] if z.get("bbox") and
            not z.get("geometry") and not z.get("superseded_by")]
SRC.write_text(raw,encoding="utf-8")
print("PASS 5AH: original 1700-1711 Carolina bbox retained as archived metadata, hidden from display; three dated local settlement points added; original 479 sites and 280 real polygons intact.")
