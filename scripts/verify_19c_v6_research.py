"""Validate the cumulative 19th-century research handoff and its crosswalks."""
import csv
import json
from collections import Counter
from pathlib import Path

directory = Path(__file__).resolve().parents[1] / 'data/research/19c/v6'
manifest = json.loads((directory / 'manifest.json').read_text(encoding='utf-8'))


def load(name):
    entry = manifest['tables'][name]
    rows = []
    for filename in entry['files']:
        with (directory / filename).open(encoding='utf-8-sig', newline='') as stream:
            rows.extend(csv.DictReader(stream))
    assert len(rows) == entry['rows'], name
    return rows


def index(rows, column):
    result = {row[column]: row for row in rows}
    assert len(result) == len(rows) and '' not in result, column
    return result


def references(value):
    return filter(None, value.split(';'))


def validate():
    tables = {name: load(name) for name in manifest['tables']}
    events = index(tables['events'], 'event_id')
    topics = index(tables['topics'], 'topic_id')
    originals = index(tables['v4-original-evidence'], 'original_node_id')
    evidence = index(tables['research-evidence'], 'evidence_id')
    sources = index(tables['source-provenance'], 'input_id')
    documents = index(tables['source-documents'], 'document_id')
    completion = index(tables['c-completion-71-103'], 'event_id')
    received = Counter(row['assistant'] for row in events.values()
                       if row['record_role'] != '新增研究候选' and row['submission_status'] == '已收研究')
    assert received == manifest['returned_by_assistant'] == {'A': 123, 'B': 161, 'C': 201}
    assert len(events) == 487 and len(topics) == 83 and len(originals) == 1339
    assert len(evidence) == 1773 and len(completion) == 33
    assert {int(row['task_order']) for row in completion.values()} == set(range(71, 104))
    assert sum(row['display_event_id'] == key for key, row in events.items()) == 482
    assert all(row['geometry'] == '' and row['publication_status'] == 'research_only' for row in events.values())
    assert all(row['display_event_id'] in events and row['topic_id'] in topics for row in events.values())
    assert all(row['publication_geometry'] == '' for row in tables['geography-review'])
    assert all(row['geometry'] == '' for row in tables['research-stages'])
    assert all(row['document_id'] in documents for row in sources.values())
    for row in originals.values():
        assert row['v4_event_id'] in events and row['v5_editorial_event_id'] in events
        assert all('V4|' + key in sources for key in references(row['source_ids']))
    for row in evidence.values():
        assert row['submitted_event_id'] in events and row['editorial_event_id'] in events
        assert all(row['assistant']+'|'+key in sources or 'V4|'+key in sources for key in references(row['source_ids']))
    assert all(row['from_event_id'] in events and row['to_event_id'] in events for row in tables['event-relations'])
    completed_nodes = set()
    for event_id, row in completion.items():
        for key in references(row['original_node_ids']):
            assert originals[key]['v4_event_id'] == event_id
            completed_nodes.add(key)
        for key in references(row['research_observation_ids']):
            assert evidence[key]['editorial_event_id'] == event_id
    assert len(completed_nodes) == 57
    assert sum(key.startswith('C-V6-') for key in evidence) == 66
    assert sum(key.startswith('C|C:V6:') for key in sources) == 64
    print('V6 validated: 485 returned groups, 33 C completions, 1,339 original nodes, 1,773 evidence records, zero release geometry.')


if __name__ == '__main__':
    validate()
