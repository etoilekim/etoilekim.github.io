#!/usr/bin/env python3
"""Publish the designated iCloud CV to the source and live Pages branches.

Requires pypdf and an authenticated GitHub CLI. No credentials are stored here.
Only the two PDF paths in TARGETS can be written.
"""
import argparse
import base64
import hashlib
import io
import json
from pathlib import Path
import shutil
import subprocess
import sys
import time

from pypdf import PdfReader
from pypdf.errors import PdfReadError

REPOSITORY = "etoilekim/etoilekim.github.io"
TARGETS = (("main", "public/files/CV_Namhoon_Kim.pdf"),
           ("gh-pages", "files/CV_Namhoon_Kim.pdf"))


def blob_sha(data):
    return hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()


def validate_pdf(data):
    if not data.startswith(b"%PDF-") or b"%%EOF" not in data[-4096:]:
        raise ValueError("The iCloud file is not a complete PDF; nothing was uploaded.")
    pdf = PdfReader(io.BytesIO(data))
    if pdf.is_encrypted or not len(pdf.pages):
        raise ValueError("The CV must be an unencrypted PDF with at least one page.")
    # Resolve each page before publishing, so incomplete cross-reference data fails here.
    for page in pdf.pages:
        _ = page.mediabox


def read_stable_pdf(path):
    before = path.stat()
    if time.time() - before.st_mtime < 30:
        raise ValueError("The iCloud file was just modified; retry on the next check.")
    data = path.read_bytes()
    after = path.stat()
    if (before.st_size, before.st_mtime_ns) != (after.st_size, after.st_mtime_ns):
        raise ValueError("The iCloud file changed while being read; retry later.")
    validate_pdf(data)
    return data


def github_api(method, endpoint, payload=None):
    gh = shutil.which("gh") or "/opt/homebrew/bin/gh"
    command = [gh, "api", "--method", method, endpoint]
    if payload is not None:
        command.extend(["--input", "-"])
    result = subprocess.run(command, input=json.dumps(payload) if payload else None,
                            capture_output=True, text=True, timeout=90)
    if result.returncode:
        raise RuntimeError(f"GitHub {method} failed: {result.stderr.strip()}")
    return json.loads(result.stdout)


def sync(data, apply=False, api=github_api):
    expected = blob_sha(data)
    updates = []
    for branch, path in TARGETS:
        endpoint = f"repos/{REPOSITORY}/contents/{path}"
        current = api("GET", f"{endpoint}?ref={branch}")
        if current["sha"] == expected:
            continue
        update = {"branch": branch, "path": path}
        if apply:
            result = api("PUT", endpoint, {
                "branch": branch,
                "sha": current["sha"],
                "message": "Update CV from iCloud",
                "content": base64.b64encode(data).decode(),
            })
            # GitHub's expected previous SHA prevents overwriting a concurrent edit.
            if api("GET", f"{endpoint}?ref={branch}")["sha"] != expected:
                raise RuntimeError(f"CV verification failed on {branch}; retry later.")
            update["commit"] = result["commit"]["html_url"]
        updates.append(update)
    return {"status": ("updated" if apply else "would_update") if updates else "unchanged",
            "sha256": hashlib.sha256(data).hexdigest(), "updates": updates}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--apply", action="store_true", help="Upload changed PDFs; otherwise check only")
    args = parser.parse_args()
    try:
        result = sync(read_stable_pdf(args.source), apply=args.apply)
        print(json.dumps(result))
    except (OSError, ValueError, RuntimeError, PdfReadError, subprocess.TimeoutExpired) as error:
        print(json.dumps({"status": "error", "message": str(error)}), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
