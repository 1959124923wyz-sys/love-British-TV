#!/usr/bin/env python3
"""Extract all *existing* editor-15 T34/T35 source records from the unchanged consolidated ZIP.
Source-first audit, fail if a candidate C source key is absent; never create fake sources."""
import json,zipfile,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
base=root/'research/18c/consolidated'
groups=[g for t in ('T34','T35') for g in json.loads((base/f'series/{t}.json').read_text())['groups']]
keys={key for group in groups for sub in group['candidate_subevents'] for key in sub.get('source_keys',[]) if key.startswith('C:')}
with zipfile.ZipFile(base/'18C_Consolidated_Research_Handoff_20261108.zip') as z:
    data=json.loads(z.read('18c_consolidation/SOURCES_C.json'))['sources']
    if isinstance(data,dict):
        all_sources={k:(dict(v,id=k) if isinstance(v,dict) else {'id':k,'value':v}) for k,v in data.items()}
    else:
        all_sources={s['id']:s for s in data}
    used={key.removeprefix('C:') for key in keys}
    missing=used-set(all_sources)
    assert not missing,f'Unknown assistant C source codes: {sorted(missing)}'
    print('PASS T34/T35 retained original group count',len(groups),'C source references',len(used),
          'all source registry C keys resolved')
    for key in sorted(used):
        print('T34T35_C_SOURCE',key,json.dumps(all_sources[key],ensure_ascii=False))
