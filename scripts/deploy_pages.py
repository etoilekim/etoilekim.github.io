#!/usr/bin/env python3
"""Verify and publish this site's static output to its existing Pages branch."""
from pathlib import Path
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent.parent
REMOTE = "https://github.com/etoilekim/etoilekim.github.io.git"


def run(*args, cwd=ROOT, capture=False):
    return subprocess.run(args, cwd=cwd, check=True, text=True,
                          stdout=subprocess.PIPE if capture else None).stdout


def main():
    if run("git", "status", "--porcelain", capture=True).strip():
        raise SystemExit("Commit your source changes before publishing.")
    run("git", "pull", "--ff-only", "origin", "main")
    run("pnpm", "verify")
    staging = ROOT / ".deploy"
    staging.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="pages-", dir=staging) as directory:
        checkout = Path(directory)
        exists = run("git", "ls-remote", "--heads", REMOTE, "gh-pages", capture=True).strip()
        if exists:
            run("git", "clone", "--depth", "1", "--branch", "gh-pages", REMOTE, directory)
            run("git", "rm", "-r", "--ignore-unmatch", ".", cwd=checkout, capture=True)
        else:
            run("git", "init", "-b", "gh-pages", cwd=checkout)
            run("git", "remote", "add", "origin", REMOTE, cwd=checkout)
        run("git", "config", "user.name", "Namhoon Kim", cwd=checkout)
        run("git", "config", "user.email", "63270534+etoilekim@users.noreply.github.com", cwd=checkout)
        shutil.copytree(ROOT / "dist", checkout, dirs_exist_ok=True)
        (checkout / ".nojekyll").touch()
        run("git", "add", "--all", cwd=checkout)
        if not run("git", "status", "--porcelain", cwd=checkout, capture=True).strip():
            print("Published output is already current.")
            return
        run("git", "commit", "-m", "Deploy academic website", cwd=checkout)
        run("git", "push", "origin", "HEAD:gh-pages", cwd=checkout)
    print("Published to gh-pages. GitHub Pages deployment will follow.")


if __name__ == "__main__":
    main()
