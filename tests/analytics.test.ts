import { describe, expect, it, vi } from "vitest";
import { createPageTracker } from "../src/scripts/analytics";

const config = { projectId: "123456", securityCode: "abc12345", hostname: "etoilekim.github.io" };

function browser() {
  const scripts: HTMLScriptElement[] = [];
  const win = {
    location: new URL("https://etoilekim.github.io/"),
    navigator: { doNotTrack: "0", globalPrivacyControl: false },
  } as unknown as Window;
  const doc = {
    createElement: () => ({ remove: vi.fn() }),
    head: { append: (script: HTMLScriptElement) => scripts.push(script) },
  } as unknown as Document;
  const views: string[] = [];
  const record = () => views.push(win.location.pathname);
  const finishLoading = () => {
    win._statcounter = { record_pageview: record };
    record(); // Statcounter's standard snippet records its initial page itself.
    scripts.at(-1)!.onload?.call(scripts.at(-1)!, new Event("load"));
  };
  return { win, doc, scripts, views, finishLoading };
}

describe("visitor analytics", () => {
  it("counts Home, Projects, CV and a return visit once, despite duplicate callbacks", () => {
    const b = browser();
    const track = createPageTracker(config, b.win, b.doc);
    track();
    track();
    expect(b.scripts).toHaveLength(1);
    b.finishLoading();
    track();
    for (const path of ["/projects/", "/cv/", "/"]) {
      b.win.location.pathname = path;
      track();
      b.win._statcounter!.record_pageview(); // Vendor's automatic navigation detector.
      track();
    }
    b.win.location.hash = "selected-projects";
    track();
    expect(b.views).toEqual(["/", "/projects/", "/cv/", "/"]);
  });

  it("does not double-count the current page when the script loads after navigation", () => {
    const b = browser();
    const track = createPageTracker(config, b.win, b.doc);
    track();
    b.win.location.pathname = "/projects/";
    track();
    b.finishLoading();
    track();
    expect(b.views).toEqual(["/projects/"]);
    expect(b.scripts).toHaveLength(1);
  });

  it("never sends preview visits or visits before a project is configured", () => {
    const b = browser();
    createPageTracker({ ...config, projectId: "", securityCode: "" }, b.win, b.doc)();
    b.win.location.hostname = "localhost";
    createPageTracker(config, b.win, b.doc)();
    b.win.location.hostname = "etoilekim.github.io.preview.test";
    createPageTracker(config, b.win, b.doc)();
    expect(b.scripts).toHaveLength(0);
  });

  it("honors browser tracking preferences before contacting the provider", () => {
    for (const navigator of [{ doNotTrack: "1" }, { globalPrivacyControl: true }]) {
      const b = browser();
      Object.assign(b.win.navigator, navigator);
      createPageTracker(config, b.win, b.doc)();
      expect(b.scripts).toHaveLength(0);
    }
  });

  it("allows a later navigation to retry a failed script request", () => {
    const b = browser();
    const track = createPageTracker(config, b.win, b.doc);
    track();
    b.scripts[0].onerror?.call(b.scripts[0], new Event("error"));
    b.win.location.pathname = "/cv/";
    track();
    b.finishLoading();
    expect(b.scripts).toHaveLength(2);
    expect(b.views).toEqual(["/cv/"]);
  });
});
