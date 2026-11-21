"""Check published atlas records on either side of the eighteenth century."""
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MASS = 'data/eighteenth-century-mass-schematic-zones-1700-1799.json'
EARLY = 'research/continuity/1700-1709'
LATE = 'research/continuity/1800-1819'
DYNAMIC = 'data/eighteenth-century-dynamic-spatial-1700-1799.json'


def read(path):
    return json.loads((ROOT / path).read_text(encoding='utf-8'))


def active(record, year):
    return not record.get('superseded_by') and any(
        p['start_year'] <= year <= p['end_year'] for p in record['periods']
    )


def indexed(path, groups):
    data = read(path)
    return {r['id']: r for group in groups for r in data.get(group, [])}


def active_dated_feature(feature, year):
    props = feature['properties']
    return (
        not props.get('superseded_by')
        and props['start_year'] <= year <= props['end_year']
        and (not props.get('year_stages') or any(
            stage['start_year'] <= year <= stage['end_year'] for stage in props['year_stages']
        ))
    )


def check_early_seam():
    area_handoff = read(f'{EARLY}/1699_1700_PUBLIC_LAYER_HANDOFF.json')
    claims = {f['id']: f for f in read(area_handoff['source_claims'])['features']}
    old_ids = {key for key, f in claims.items() if active_dated_feature(f, 1699)}
    assert {row['previous_id'] for row in area_handoff['records']} == old_ids
    assert len(area_handoff['records']) == len(old_ids)
    assert area_handoff['counts'] == Counter(row['display_at_1700'] for row in area_handoff['records'])
    lookup = {
        MASS: indexed(MASS, ('zones', 'regional_zones', 'regional_sites')),
        DYNAMIC: indexed(DYNAMIC, ('area_references',)),
        'data/eighteenth-century-b37-india-ocean.json': indexed(
            'data/eighteenth-century-b37-india-ocean.json', ('zones',)
        ),
    }
    for row in area_handoff['records']:
        assert bool(row['records_at_1700']) == (row['display_at_1700'] != 'no_area_inherited')
        for link in row['records_at_1700']:
            path, key = link['source_dataset'], link['id']
            if path in lookup:
                if path == MASS and key == 'CAROLINA_PROPRIETORS':
                    # The original 1699->1700 crosswalk remains a historical archive:
                    # 5AH retains the old charter and source, but its imprecise giant
                    # rectangle is now retired in favour of a year-1700 named port.
                    old_claim = lookup[path][key]
                    assert old_claim['superseded_by'] == 'CAROLINA_CHARLESTOWN_1700_1711'
                    assert old_claim['periods'] == [{'start_year': 1700, 'end_year': 1711}]
                    assert old_claim['bbox'] == [-83.8, 31.3, -75.5, 36.7]
                    assert old_claim['source_urls']
                    assert active(lookup[MASS][old_claim['superseded_by']], 1700)
                else:
                    assert active(lookup[path][key], 1700), key
                if row['display_at_1700'] == 'legacy_geometry_retained' and path == DYNAMIC:
                    assert lookup[path][key]['geometry_key'] == claims[row['previous_id']]['properties']['name']
            else:
                assert any(f['id'] == key and active_dated_feature(f, 1700) for f in read(path)['features']), key

    crosswalk = read(f'{EARLY}/OLD_1699_SPATIAL_POINTS_CROSSWALK.json')
    points_1699 = {f['id']: f for f in read(crosswalk['source_file'])['features']
                   if f['properties']['display_through_year'] == 1699}
    points_1700 = lookup[MASS]
    published = crosswalk['publication_seam_5c']
    wren_1699 = points_1699[published['same_coordinate_new_capital']]
    wren_1700 = points_1700[crosswalk['separate_1699_control_change']['published_1700_feature_id']]
    assert wren_1699['geometry'] == wren_1700['geometry']
    assert wren_1699['properties']['stable_id'] == wren_1700['stable_id']
    assert wren_1699['properties']['start_year'] == 1699
    assert wren_1699['properties']['source_only'] and not wren_1699['properties']['related_event_ids']
    assert '1699年殖民首府迁往威廉斯堡' in points_1699['jamestown-governance-1607']['properties']['description']
    point_refs = read(f'{EARLY}/REFERENCE_CONTROL_CORES_1700_1709.geojson')['features']
    points_1700 |= {
        f['id']: dict(superseded_by=f['properties'].get('superseded_by'), periods=[f['properties']])
        for f in point_refs
    }
    earlier_points = {row['previous_id'] for row in published['records']}
    dated_events = {row['previous_point_id'] for row in crosswalk['old_point_dispositions']
                    if row['continuance_category'] == 'dated_1699_event_not_political_control_territory'}
    assert earlier_points.isdisjoint(dated_events)
    assert earlier_points | dated_events | {wren_1699['id']} == set(points_1699)
    assert len(dated_events) == published['dated_events_stop_in_1699']
    for row in published['records']:
        assert active(points_1700[row['current_id']], 1700), row


def check_late_seam():
    layer_paths = [MASS, 'data/eighteenth-century-expansion-batch36-1700-1799.json']
    layer_paths += [str(p.relative_to(ROOT)) for p in sorted((ROOT / 'data').glob('eighteenth-century-b3[789]-*.json'))]
    live_records = {}
    for path in layer_paths:
        records = indexed(path, ('zones', 'regional_zones', 'regional_sites', 'regional_lines', 'coastal_rights'))
        live_records.update({key: (path, r) for key, r in records.items() if active(r, 1799)})
    live_records.update({
        key: (DYNAMIC, r) for key, r in indexed(DYNAMIC, ('area_references',)).items() if active(r, 1799)
    })

    handoff = read(f'{LATE}/1799_1800_SPATIAL_HANDOFF.json')
    rows = {r['prior_id']: r for r in handoff['records']}
    assert len(rows) == len(handoff['records']) == handoff['counts']['1799_prior_records_reviewed']
    assert not (live_records.keys() - rows.keys()), sorted(live_records.keys() - rows.keys())
    assert Counter(row['resolution'] for row in rows.values()) == handoff['counts']['by_disposition']
    assert sum(bool(row['features_at_1800']) for row in rows.values()) == handoff['counts']['linked_to_1800_public_geometry']
    assert sum(bool(row.get('continues_in_source_at_1800')) for row in rows.values()) == handoff['counts']['continue_in_original_public_layer']

    late_paths = sorted((ROOT / 'data').glob('nineteenth-century-territorial-areas*.geojson'))
    late_paths.append(ROOT / 'data/nineteenth-century-spatial-1800-1819.geojson')
    late_features = {
        f['id']: f for path in late_paths for f in read(path)['features'] if active_dated_feature(f, 1800)
    }
    for key, row in rows.items():
        assert set(row['features_at_1800']) <= late_features.keys(), key
    for key, (path, record) in live_records.items():
        row = rows[key]
        assert row['source_dataset'] == path, key
        successor_id = record.get('cross_century_feature_id')
        if successor_id and 'geometry' in record:
            assert successor_id in row['features_at_1800'], key
            assert record['geometry'] == late_features[successor_id]['geometry'], key
            if record.get('stable_id'):
                assert record['stable_id'] == late_features[successor_id]['properties']['stable_id'], key
        if row.get('continues_in_source_at_1800'):
            assert path == MASS and record['kind'] == 'treaty_fishing' and active(record, 1800), key
    for key, year, kind in [
        ('MONTSERRAT_ISLAND_18C', 1783, 'foreign_occupation'),
        ('MONTSERRAT_ISLAND_18C', 1784, 'administration'),
        ('BENCOOLEN_MARLBOROUGH_18C', 1760, 'foreign_occupation'),
        ('BENCOOLEN_MARLBOROUGH_18C', 1763, 'company_post'),
        ('CUDDALORE_FORT_ST_DAVID', 1758, 'foreign_occupation'),
        ('CUDDALORE_FORT_ST_DAVID', 1799, 'historic_ruins'),
    ]:
        record = live_records[key][1]
        stage = next(p for p in record['periods'] if p['start_year'] <= year <= p['end_year'])
        assert stage.get('kind', record['kind']) == kind, (key, year)


if __name__ == '__main__':
    check_early_seam()
    check_late_seam()
    print('PASS atlas handoffs 1699–1700 and 1799–1800')
