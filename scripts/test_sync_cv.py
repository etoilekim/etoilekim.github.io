import base64
import unittest
from sync_cv import TARGETS, blob_sha, sync, validate_pdf


class SyncCVTests(unittest.TestCase):
    def fake_api(self, states, fail_branch=None):
        calls = []
        def api(method, endpoint, payload=None):
            if method == "GET":
                branch = endpoint.split("?ref=")[1]
                return {"sha": states[branch]}
            branch = payload["branch"]
            if branch == fail_branch:
                raise RuntimeError("simulated network failure")
            self.assertEqual(payload["sha"], states[branch])
            self.assertTrue(any(endpoint.endswith(path) and branch == b for b, path in TARGETS))
            calls.append((branch, endpoint))
            states[branch] = blob_sha(base64.b64decode(payload["content"]))
            return {"commit": {"html_url": "https://github.com/example/commit/test"}}
        return api, calls

    def test_unchanged_never_writes(self):
        data = b"same content"
        api, calls = self.fake_api({b: blob_sha(data) for b, _ in TARGETS})
        self.assertEqual(sync(data, True, api)["status"], "unchanged")
        self.assertEqual(calls, [])

    def test_dry_run_never_writes(self):
        api, calls = self.fake_api({b: "old" for b, _ in TARGETS})
        self.assertEqual(sync(b"new", False, api)["status"], "would_update")
        self.assertEqual(calls, [])

    def test_changed_pdf_updates_both_paths(self):
        api, calls = self.fake_api({b: "old" for b, _ in TARGETS})
        result = sync(b"new", True, api)
        self.assertEqual(result["status"], "updated")
        self.assertEqual([branch for branch, _ in calls], ["main", "gh-pages"])

    def test_partial_failure_retries_only_missing_branch(self):
        states = {b: "old" for b, _ in TARGETS}
        api, _ = self.fake_api(states, fail_branch="gh-pages")
        with self.assertRaises(RuntimeError):
            sync(b"new", True, api)
        api, calls = self.fake_api(states)
        sync(b"new", True, api)
        self.assertEqual([branch for branch, _ in calls], ["gh-pages"])

    def test_incomplete_pdf_is_rejected(self):
        for data in (b"", b"not a pdf", b"%PDF-1.7\npartial download"):
            with self.assertRaises(ValueError):
                validate_pdf(data)


if __name__ == "__main__":
    unittest.main()
