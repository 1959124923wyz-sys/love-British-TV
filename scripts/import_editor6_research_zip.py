#!/usr/bin/env python3
"""Safe import of an Editor6 cumulative seventeenth-century research ZIP.

Stages ONLY research files, never the published atlas or story indexes.
Usage: python scripts/import_editor6_research_zip.py /path/to/Editor6-17C-R05-FULL.zip
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import stat
import sys
import zipfile

ALLOWED_ROOTS = {"source_A", "source_B", "source_C", "INTEGRATED", "ARCHIVES", "AGENT_TASKS", "EDITORIAL"}
ALLOWED_SUFFIXES = {".md", ".csv", ".json", ".geojson", ".txt", ".py", ".yml", ".yaml"}
MAX_FILES = 1000
MAX_UNPACKED_BYTES = 60 * 1024 * 1024
MAX_MEMBER_BYTES = 8 * 1024 * 1024
DESTINATION = Path("research/periods/1600-1699/editor6-integrated-pack")


def valid_name(name: str) -> bool:
    if not name or "\\" in name or name.startswith("/") or "\x00" in name:
        return False
    parts = name.split("/")
    if any(p in {"", ".", ".."} for p in parts):
        return False
    if parts[0] not in ALLOWED_ROOTS:
        return False
    suffix = Path(name).suffix.lower()
    if parts[0] == 'ARCHIVES':
        return suffix == '.zip'
    return suffix in ALLOWED_SUFFIXES
    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("archive", type=Path)
    parser.add_argument("--commit-files", action="store_true", help="write files (default: dry-run)")
    parser.add_argument("--replace", action="store_true", help="replace staged files; source originals remain in git history")
    args = parser.parse_args()

    if not args.archive.is_file():
        parser.error(f"archive not found: {args.archive}")
    if not (Path.cwd() / ".git").exists():
        parser.error("run at repository root; no files written outside research staging")
    manifest = []
    with zipfile.ZipFile(args.archive, "r") as z:
        bad = z.testzip()
        if bad:
            parser.error("ZIP CRC check failed: " + bad)
        candidates = []
        names = set()
        total = 0
        for info in z.infolist():
            if info.is_dir():
                continue
            # ZIP external mode can indicate symlinks; never follow or import those.
            ftype = (info.external_attr >> 16) & 0o170000
            if ftype == stat.S_IFLNK:
                parser.error("symlink rejected: " + info.filename)
            n = info.filename
            if not valid_name(n):
                if n.startswith(tuple(ALLOWED_ROOTS)):
                    parser.error("unsafe research member: " + n)
                continue  # README/manifests outside the four research folders are metadata.
            if n in names:
                parser.error("duplicate archive path: " + n)
            names.add(n)
            if info.file_size > MAX_MEMBER_BYTES:
                parser.error("individual file exceeds cap: " + n)
            total += info.file_size
            if total > MAX_UNPACKED_BYTES:
                parser.error("uncompressed size exceeds limit")
            candidates.append(info)
        if len(candidates) > MAX_FILES:
            parser.error("too many files")
        if len(candidates) < 50:
            parser.error("cumulative pack unexpectedly small: expected >50 research members")
        for info in sorted(candidates, key=lambda x: x.filename):
            content = z.read(info)
            if not info.filename.startswith('ARCHIVES/'):
                try:
                    content.decode("utf-8-sig")
                except UnicodeDecodeError:
                    parser.error("non-UTF-8 research source: " + info.filename)
            elif not zipfile.is_zipfile(__import__('io').BytesIO(content)):
                parser.error('original archive is not a valid nested ZIP: ' + info.filename)
            sha = hashlib.sha256(content).hexdigest()
            dest = DESTINATION / info.filename
            if args.commit_files:
                if dest.exists() and dest.read_bytes() != content and not args.replace:
                    parser.error("staging collision; use --replace for a reviewed upgrade: " + str(dest))
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_bytes(content)
            manifest.append({"path": str(dest).replace("\\", "/"), "sha256": sha, "size": len(content)})
    print(f"Verified {len(manifest)} research files, {total} decompressed bytes.")
    if args.commit_files:
        out = DESTINATION / "RESEARCH_IMPORT_MANIFEST.json"
        out.write_text(json.dumps({"schema": "editor6-git-research-import-v1",
              "archive": args.archive.name, "status": "research_only",
              "files": manifest}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("RESEARCH ONLY, ready for git add + PR:", DESTINATION)
    else:
        print("DRY-RUN: nothing written. Re-run with --commit-files after review.")


if __name__ == "__main__":
    main()
