#!/usr/bin/env python3
"""Read a *versioned, locally available* SlaveVoyages CSV without inventing totals.

Direct official download is performed by GitHub Actions; no dataset is checked into
the repository. This diagnostic deliberately does not interpret resistance codes
until the corresponding versioned official codebook is inspected.
"""
import argparse
import collections
import csv
import hashlib
import json
from pathlib import Path

INTERESTING_IDS = {9706, 20127, 20173, 99002}
FIELDS = ("VOYAGEID", "YEARAM", "YEARDEP", "SHIPNAME", "CAPTAIN", "RESIST", "NATINIMP", "SLAMIMP")

def maybe_int(value):
    try:
        return int(float(value)) if str(value).strip() else None
    except (TypeError, ValueError):
        return None

def analyze(p):
    digest = hashlib.sha256(p.read_bytes()).hexdigest()
    with p.open("r", encoding="utf-8-sig", newline="", errors="replace") as f:
        reader = csv.DictReader(f)
        names = list(reader.fieldnames or [])
        upper = {x.upper().strip(): x for x in names}
        id_field = upper.get("VOYAGEID") or upper.get("VOYAGE_ID")
        year_field = upper.get("YEARAM") or upper.get("YEARDEP")
        resistance_keys = [x for x in names if any(k in x.upper() for k in ("RESIST", "REBELL", "INSURR"))]
        indicative_names = [x for x in names if any(k in x.upper() for k in ("SHIP", "CAPTAIN", "VOYAGE", "YEAR", "NATIN", "EMBARK", "DISEMBARK", "RESIST", "SLAM"))]
        if not id_field or not year_field:
            raise ValueError("Critical named columns absent; schema must be reviewed, never silently inferred")
        sample = []
        num_17c = 0
        year_counts = collections.Counter()
        resist_values = collections.Counter()
        for row in reader:
            year = maybe_int(row.get(year_field))
            vid = maybe_int(row.get(id_field))
            if vid in INTERESTING_IDS:
                sample.append({k: row.get(k) for k in indicative_names if row.get(k) not in ("", None)})
            if year is not None and 1600 <= year <= 1699:
                num_17c += 1
                year_counts[str(year)] += 1
                for field in resistance_keys:
                    raw = (row.get(field) or "").strip()
                    if raw:
                        resist_values[field + ":" + raw] += 1
    return {
        "source": "SlaveVoyages 2019 expanded CSV snapshot, not the continuously updated live database",
        "sha256": digest,
        "n_columns": len(names),
        "column_candidates": indicative_names,
        "id_field": id_field, "year_field": year_field,
        "resistance_fields": resistance_keys,
        "recorded_rows_with_selected_year_1600_1699": num_17c,
        "year_window_semantics": "Based on YEARAM if present; not all departures and arrivals within 1600-1699",
        "resistance_field_value_frequencies_uninterpreted": dict(resist_values),
        "specific_voyage_rows": sample,
        "disclaimer": "NOT a census of all crossings, NOT mortality, NOT verified insurrection counts. Missing and coded values require codebook."
    }

def main():
    a = argparse.ArgumentParser()
    a.add_argument("--csv", required=True)
    a.add_argument("--output", required=True)
    args = a.parse_args()
    result = analyze(Path(args.csv))
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    Path(args.output).write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
