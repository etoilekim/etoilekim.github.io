interface StatcounterConfig {
  projectId: string;
  securityCode: string;
  hostname: string;
}

interface StatcounterApi {
  record_pageview: (...args: unknown[]) => void;
}

declare global {
  interface Window {
    sc_project?: number;
    sc_security?: string;
    sc_invisible?: number;
    _statcounter?: StatcounterApi;
  }
}

/** One tracker per document; the returned handler also handles Astro navigation. */
export function createPageTracker(
  config: StatcounterConfig,
  win: Window = window,
  doc: Document = document,
): () => void {
  let loading = false;
  let lastPage = "";
  const pageKey = () => win.location.pathname + win.location.search;
  const canTrack = () =>
    /^\d+$/.test(config.projectId) &&
    Number(config.projectId) > 0 &&
    /^[a-zA-Z0-9]+$/.test(config.securityCode) &&
    win.location.hostname === config.hostname &&
    win.location.protocol === "https:" &&
    win.navigator.doNotTrack !== "1" &&
    !(win.navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;

  return () => {
    if (!canTrack() || loading) return;

    if (win._statcounter?.record_pageview) {
      win._statcounter.record_pageview();
      return;
    }

    loading = true;
    win.sc_project = Number(config.projectId);
    win.sc_security = config.securityCode;
    win.sc_invisible = 1;

    const script = doc.createElement("script");
    script.src = "https://www.statcounter.com/counter/counter.js";
    script.async = true;
    script.onload = () => {
      loading = false;
      const api = win._statcounter;
      if (!api?.record_pageview) return;

      // The vendor script counts the current page before its load event fires.
      lastPage = pageKey();
      const record = api.record_pageview.bind(api);
      api.record_pageview = (...args) => {
        const page = pageKey();
        if (!canTrack() || page === lastPage) return;
        lastPage = page;
        record(...args);
      };
      // Both Astro and Statcounter can detect navigation. The URL guard keeps
      // those callbacks from counting the same page twice, including anchors.
    };
    script.onerror = () => {
      loading = false;
      script.remove();
    };
    doc.head.append(script);
  };
}
