#!/usr/bin/env python3
"""Issue 46 discovery: locate HES NRHE *known site extent* download link.

This writes a metadata-only index. A site-extent Polygon is NOT verified
1547 English fortification, even where it covers surviving archaeological remains.
No bulk source dataset is mirrored and no third-party binaries are downloaded.
"""
import datetime
import html
import json
from html.parser import HTMLParser
import pathlib
import re
import urllib.parse
import urllib.request

SOURCE = "https://www.trove.scot/explore/datasets/national-record-of-the-historic-environment-data-for-download"
OUT = pathlib.Path("research/issue46/NRHE_KNOWN_SITE_EXTENTS_DISCOVERY.json")
class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.href = None
        self.label = ""
        self.entries = []
    def handle_starttag(self, tag, attrs):
        if tag == "a":
            self.href = dict(attrs).get("href")
            self.label = ""
    def handle_data(self, data):
        if self.href is not None:
            self.label += data
    def handle_endtag(self, tag):
        if tag == "a" and self.href is not None:
            self.entries.append((self.href, html.unescape(self.label).strip()))
            self.href = None
            self.label = ""

def main():
    data = {
      "schema": "issue46_nrhe_site_extent_discovery_v1",
      "observed_date_utc": datetime.datetime.now(datetime.timezone.utc).date().isoformat(),
      "official_source_url": SOURCE,
      "method": "GitHub runner fetched HTML and parsed hyperlinks only",
      "purpose": "Locate separately surveyed extent dataset, distinct from HES legal scheduled monument polygons",
      "candidate_sites": [{"nrhe":58412,"name":"Roxburgh Castle"},{"nrhe":58903,"name":"Dunglass French Camp"}],
      "known_site_extent_geometry_obtained": False,
      "verified_1547_1550_occupied_area_count": 0,
      "legal_status": "NRHE area polygons have no legal designation status, unlike HES SM1718/SM3190/SM3191",
      "historic_footprint_certified": False,
      "downloads": [],
      "retrieval_status": "not_attempted"
    }
    try:
      req = urllib.request.Request(SOURCE, headers={"User-Agent":"LoveBritishTV-Issue46ArchiveResearch/1.0"})
      with urllib.request.urlopen(req, timeout=35) as res:
        body = res.read(3_000_000).decode("utf-8", errors="replace")
      parser = Links()
      parser.feed(body)
      candidates = []
      for target,label in parser.entries:
        url = urllib.parse.urljoin(SOURCE,target)
        info = (label+" "+url).lower()
        if any(x in info for x in ("site extent", "nrhe areas", "nrhe_areas", "polygon", ".zip", "area")):
          if url.startswith("https://") and not url.startswith("javascript:"):
            candidates.append({"label":label[:200],"url":url})
      urls = re.findall(r'https?:[^\s"<>]+(?:NRHE[^\s"<>]*?\.zip|site[^\s"<>]*?\.zip)',body,re.I)
      for u in urls:
        u = html.unescape(u.replace("\\u002F","/").replace("\\/","/"))
        if u.startswith("https://"): candidates.append({"label":"regex_zip_candidate", "url":u[:1500]})
      unique={}
      for x in candidates:
        unique[x["url"]]=x
      data["downloads"]=list(unique.values())[:40]
      data["retrieval_status"]="link_candidates_found" if unique else "html_read_but_no_direct_download_link"
      data["html_characters_read"]=len(body)
    except Exception as e:
      data["retrieval_status"]="source_page_not_readable_in_runner"
      data["error_type"]=type(e).__name__
      data["error_text"]=str(e)[:250]
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(data["retrieval_status"], "links:", len(data["downloads"]))

if __name__ == "__main__": main()
