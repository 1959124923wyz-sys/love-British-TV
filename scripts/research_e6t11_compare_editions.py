#!/usr/bin/env python3
"""Compare official 2019 CSV with official 2020 SPSS *edited database snapshots*.

Only records with YEARAM in 1600..1699 are in the study population. It is
NOT the number of voyages that occurred / all actual resistances. Source
metadata, reproducible checksums, and changes in documented coding retained.
"""
import argparse, csv, json, hashlib, math, collections
from pathlib import Path
import pyreadstat

FIELDS = ("VOYAGEID","YEARAM","YEARAF","YEARDEP","SHIPNAME","CAPTAINA","NATIONAL","NATINIMP","RESISTANCE","SLAXIMP","SLAMIMP","VYMRTIMP","SOURCEA","SOURCEB","SOURCEC")
def val(x):
    if x is None: return None
    try:
        if math.isnan(x): return None
    except (TypeError, ValueError): pass
    s=str(x).strip()
    if not s or s.casefold() in ("nan","none"): return None
    try:
        f=float(s)
        if math.isfinite(f) and f.is_integer(): return int(f)
    except ValueError: pass
    return s
def read_2019(p):
    with p.open(newline="",encoding="utf-8-sig",errors="replace") as f:
        rd=csv.DictReader(f)
        if not set(("VOYAGEID","YEARAM","RESISTANCE","NATINIMP"))<=set(rd.fieldnames): raise ValueError("2019 schema mismatch")
        return [{k:val(row.get(k)) for k in FIELDS} for row in rd]
def read_2020(p):
    df,meta=pyreadstat.read_sav(str(p),apply_value_formats=False)
    if not set(("VOYAGEID","YEARAM","RESISTANCE","NATINIMP"))<=set(df.columns): raise ValueError("2020 schema mismatch "+str(list(df.columns)[:50]))
    cols=[k for k in FIELDS if k in df.columns]
    return [{k:val(row.get(k)) for k in FIELDS} for row in df[cols].to_dict("records")],{"rows":len(df),"columns":len(df.columns),"metadata":meta.file_label}
def scope(rows):
    sub=[r for r in rows if isinstance(r["YEARAM"],int) and 1600<=r["YEARAM"]<=1699]
    counts=collections.Counter(r["RESISTANCE"] for r in sub if isinstance(r["RESISTANCE"],int))
    brit=[r for r in sub if r["NATINIMP"]==7]
    bcnt=collections.Counter(r["RESISTANCE"] for r in brit if isinstance(r["RESISTANCE"],int))
    return {"rows":len(sub),"british_imputed_flag_rows":len(brit),"all_resistance_coded":dict(sorted(counts.items())),"british_resistance_coded":dict(sorted(bcnt.items())),"with_resistance":[r for r in sub if isinstance(r["RESISTANCE"],int)]}
def clean(r):
    return {k:r.get(k) for k in FIELDS if r.get(k) is not None}
def main():
    a=argparse.ArgumentParser()
    a.add_argument("--old",required=True)
    a.add_argument("--new",required=True)
    a.add_argument("--out",required=True)
    opts=a.parse_args()
    files={y:Path(p) for y,p in [("2019",opts.old),("2020",opts.new)]}
    sums={y:hashlib.sha256(p.read_bytes()).hexdigest() for y,p in files.items()}
    old=read_2019(files["2019"])
    new,metadata=read_2020(files["2020"])
    x=scope(old);y=scope(new)
    orig={r["VOYAGEID"]:r for r in x["with_resistance"]}
    next_={r["VOYAGEID"]:r for r in y["with_resistance"]}
    if len(orig)!=len(x["with_resistance"]) or len(next_)!=len(y["with_resistance"]): raise RuntimeError("Duplicate voyage IDs in coded resistance case")
    gained=sorted(set(next_)-set(orig))
    lost=sorted(set(orig)-set(next_))
    both=sorted(set(next_)&set(orig))
    changed=[{"id":i,"old":clean(orig[i]),"new":clean(next_[i]),"changed_fields":{k:{"2019":orig[i].get(k),"2020":next_[i].get(k)} for k in FIELDS if orig[i].get(k)!=next_[i].get(k)}} for i in both if any(orig[i].get(k)!=next_[i].get(k) for k in FIELDS)]
    out={"schema":"e6t11-official-2019-vs-2020-snapshot-v1","dataset_urls":{"2019":"https://legacy.slavevoyages.org/documents/download/tastdb-exp-2019.csv","2020":"https://legacy.slavevoyages.org/documents/download/tastdb-exp-2020.sav"},"source_sha256":sums,"source_2020_metadata":metadata,
         "scope":{"year":"YEARAM 1600..1699 inclusive, possibly imputed","british_flag":"NATINIMP 7 (imputed, not every 17th-century British voyage)","resistance":"nonblank RESISTANCE, code 1=onboard insurrection; 2=ship attacked from shore; 3=ship boat attacked from shore","no_code":"Unknown, NOT proof of no resistance"},
         "edition_2019":{k:v for k,v in x.items() if k!="with_resistance"},"edition_2020":{k:v for k,v in y.items() if k!="with_resistance"},
         "coded_case_changes":{"new_2020":len(gained),"removed_from_scope_2020":len(lost),"still_coded":len(both),"common_changed_any_field":len(changed),"new_cases":[clean(next_[i]) for i in gained],"lost_cases":[clean(orig[i]) for i in lost],"changed_cases":changed},
         "all_coded_2020":[clean(r) for r in y["with_resistance"]],
         "interpretation":"This is an edition comparison for recorded voyage rows, NOT total historical crossings or prevalence. Changes may reflect corrected voyage identity, data incompleteness, reclassification, or date/flag imputation; inspect codebook and original sources before publishing individual casualties or precise geography."}
    Path(opts.out).parent.mkdir(parents=True,exist_ok=True)
    Path(opts.out).write_text(json.dumps(out,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("SUMMARY_JSON="+json.dumps({k:v for k,v in out.items() if k in ["edition_2019","edition_2020","coded_case_changes","source_sha256"]},ensure_ascii=False,default=str)[:3500])
    print("SUCCESS wrote",opts.out,"bytes",Path(opts.out).stat().st_size)
if __name__=="__main__": main()
