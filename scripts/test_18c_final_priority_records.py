"""Verify the closure of the priority crosswalk and its public story links."""
import json
import re
from pathlib import Path

from audit_18c_1126_coverage import audit

serial = Path(__file__).resolve().parents[1] / 'data/stories/serial'
def load(name):
    return json.loads((serial / name).read_text(encoding='utf-8'))

coverage = audit()
assert coverage['coverage']['selected_candidate_status'] == {'exact_original_id_event': 315}
assert coverage['coverage']['group_status'] == {'event_group_link': 162}
assert len(coverage['deferred_16_originals']) == 16
rows = {row['original_id']: row for row in coverage['all_1126_originals']}
assert rows['C-F06-004']['linked_event_ids'] == ['E18C-CAR-1798-HOSPITAL', 'E18C-IRL-1798-SCULLABOGUE']

supplement = load('chronology-preview-final-priority-records-1700-1798.json')
assert len(supplement['events']) == 8
assert not supplement['routes']
assert sum(e['lat'] is not None for e in supplement['events']) == 2
datasets = [supplement, *(load(name) for name in (
    'chronology-preview-ireland-1700-1799.json',
    'chronology-preview-scotland-1700-1799.json',
    'chronology-preview-t09-tuscarora-yamasee-1702-1732.json',
    'chronology-preview-archive-gaps-1719-1798.json',
))]
events = {e['id']: e for d in datasets for e in d['events']}
originals = {
    'C2-F09-002': 'E18C-DAR-1700-MAR15-WARNING',
    'C5-F09-002': 'E18C-DAR-1700-APR01-VEITCH',
    'C-F01-001': 'E18C-PL-1703-COMMONS-BILL',
    'C4-F01-003': 'E18C-PL-1705-URBAN-DEPARTURE',
    'C7-IRL-1798-MCCRACKEN': 'E18C-IR-1798-JUL17-MCCRACKEN',
    'E18A2-TUS-FEBTREATY': 'E18C-T09-1715-FEB11-COREE-PEACE',
}
for original, event_id in originals.items():
    assert rows[original]['linked_event_ids'] == [event_id], original
    assert events[event_id]['show_dossier_sources']
assert events['E18C-SCT-1700-DARIEN-SURRENDER']['date_label'].startswith('1700年4月11日')
assert '苏格兰旧历3月21日' in events[originals['C5-F09-002']]['date_label']
assert '科里人及其他交战者' in events[originals['E18A2-TUS-FEBTREATY']]['description']
index = {story['id']: story for story in load('preview-18c-index.json')['stories']}
seen = set()
for topic_id in (
    'E18-T31-DARIEN-SIEGE-CAPITULATION-1700',
    'E18-T29-IRISH-PENAL-BILL-RESIDENCE-1703-1705',
    'E18-T30-IRISH-REBELLION-PRISONERS-REPRISALS-1798',
):
    story = load(Path(index[topic_id]['file']).name)
    source_ids = {source['id'] for source in story['sources']}
    links = []
    for section in story['sections']:
        assert set(section['source_keys']) <= source_ids
        for text in section['paragraphs']:
            for event_id in re.findall(r'\[\[([^|]+)\|', text):
                event = events[event_id]
                assert section['period_start_year'] <= event['year'] <= section['period_end_year']
                assert set(event['source_ids']) <= set(section['source_keys'])
                links.append(event_id)
                seen.add(event_id)
    assert links == story['related_event_ids'] == index[topic_id]['event_ids']
assert {e['id'] for e in supplement['events']} <= seen
print('PASS all 315 priority candidates, final three readers, and separately preserved deferred records')
