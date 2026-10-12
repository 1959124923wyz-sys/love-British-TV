#!/usr/bin/env python3
"""Guard the user-approved v0.9 map UI contract against accidental regressions.

This is a static contract check; also review the actual browser when changing layout.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
app = (ROOT / "app.js").read_text(encoding="utf-8")
css = (ROOT / "css/dark-atlas-v2.css").read_text(encoding="utf-8")
html = (ROOT / "index.html").read_text(encoding="utf-8")
spec = (ROOT / "docs/APPROVED_MAP_INTERACTION_STANDARD.md").read_text(encoding="utf-8")

def require(test, description):
    if not test:
        raise AssertionError("Approved UI contract regression: " + description)

require("已批准的地图交互模式" in spec and "基线 v0.9" in spec,
        "canonical standard is absent")
require("function expandCluster(group,pin=false)" in app,
        "open-on-demand multi-event cluster")
require("atlas-aggregate" in app and "groups.clusterExpanded.clearLayers()" in app,
        "compact count hub and mutually exclusive expansion")
require(".on('mouseover',()=>{if(!expandedPinned" in app
        and ".on('click',()=>expandCluster(g,true))" in app,
        "hover/click expansion from group hub")
require("map.on('click',()=>{if(activeClusterKey)closeCluster()})" in app,
        "click outside closes flyout")
require("otherPoints=clusterObstacles" in app
        and "overflow*250+occlusion*5" in app,
        "avoid nearby markers and viewport bounds")
require("['right','above','left','below']" in app,
        "four-direction flyout selection")
require("map.latLngToContainerPoint" in app
        and "map.containerPointToLatLng" in app,
        "temporary screen offsets instead of rewriting original coordinates")

# A parent count bubble must not attach the old opaque title-card tooltip.
parent_hub = app.split("L.marker(g.latlng,{icon:ico", 1)
require(len(parent_hub) == 2, "aggregate count marker")
parent_hub = parent_hub[1].split(".addTo(groups.cluster);", 1)[0]
require(".bindTooltip" not in parent_hub, "parent hub gained a blocking hover card")
require("atlas-flyout-icon" in app
        and "expanded-event" in app
        and "bubblingMouseEvents:false" in app,
        "transparent individual SVG flyout markers")
require("marker.closeTooltip();openDossier(item,record.type)" in app,
        "close short tooltip when opening a full event")
require("uncertain-badge" not in app, "separate question-mark bubble returned")

require("map.createPane('eventTooltipPane')" in app
        and "map.getPane('eventTooltipPane').style.zIndex='820'" in app
        and "pane:'eventTooltipPane'" in app,
        "topmost hover-text layer")
require(".leaflet-tooltip-pane{" in css
        and "z-index:820!important" in css,
        "CSS must not demote hover cards below map markers")
require(".leaflet-marker-icon.atlas-flyout-icon" in css
        and "background:transparent!important" in css
        and "border:0!important" in css,
        "flyout introduced a blocking background")
require(".leaflet-tooltip.atlas-hover{" in css,
        "compact historical-tooltip style")

require('id="yearRange"' in html
        and 'id="chapterOne"' in html
        and 'id="chapterTwo"' in html,
        "chapter navigation and year timeline")
require("renderEventList();renderTerritories();renderControlAreas();renderPoliticalRelationAreas();renderPoints();renderHypotheses();renderMilestones()" in app,
        "chapter-long events plus persistent state updates")
require("observed_through_year" in app, "evidence-limited state persistence")
require("controlAreaPane" in app and "toggleControlAreas" in html, "map-first urban territorial layer with separate control")
require("renderPoliticalRelationAreas()" in app and "togglePoliticalRelations" in html, "patterned secondary political relationships")
require("renderTerritories()" in app and "territoryPane" in app and "toggleTerritorialFootprints" in html,
        "historically sourced territorial footprints and permanent Calais spatial continuity")
require("year>=1502?'1502':'—'" in app and "year>=1513?'1513':'—'" in app, "future-year chapter cards stay hidden")
require("y<=year" in app and "y>=1497&&y<=year" in app,
        "milestone dots only appear on or after the current year")
require("!occurredByYear(e,year)" in app and "fullArchive||occurredByYear(e,year)" in app and "showFullChapterArchive" in html, "chronological events with explicitly accessible chapter archive")
require("data/historical-detail-notes.json" in app
        and "历史文献与详细考证" in app,
        "two-level primary narrative and supporting archive")
require("renderHypotheses()" in app
        and "推定范围" in spec
        and "dashArray:'7 5'" in app
        and "f.properties?.fill_authorized===false" in app,
        "hypothetical cartography stays distinct as dashed reference")

print("OK: user-approved compact hubs, transparent flyouts, tooltip priority and historic layers")
