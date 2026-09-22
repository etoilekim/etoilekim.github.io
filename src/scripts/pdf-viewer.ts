import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { EventBus, PDFLinkService, PDFViewer } from "pdfjs-dist/web/pdf_viewer.mjs";

GlobalWorkerOptions.workerSrc = workerUrl;

export function setupPdfViewer(): (() => void) | undefined {
  const reader = document.querySelector<HTMLElement>(".cv-reader");
  const container = document.querySelector<HTMLDivElement>("#pdf-container");
  if (!reader || !container) return;

  const status = reader.querySelector<HTMLElement>("#pdf-page-status")!;
  const zoomLevel = reader.querySelector<HTMLOutputElement>("#pdf-zoom-level")!;
  const zoomOut = reader.querySelector<HTMLButtonElement>("#pdf-zoom-out")!;
  const zoomIn = reader.querySelector<HTMLButtonElement>("#pdf-zoom-in")!;
  const fitWidth = reader.querySelector<HTMLButtonElement>("#pdf-fit-width")!;
  const events = new AbortController();
  const eventBus = new EventBus();
  const linkService = new PDFLinkService({ eventBus, externalLinkTarget: 2, externalLinkRel: "noopener noreferrer" });
  const viewer = new PDFViewer({ container, eventBus, linkService });
  linkService.setViewer(viewer);

  let disposed = false;
  let fitting = true;
  let loaded = false;
  const updateZoom = () => {
    zoomLevel.value = `${Math.round(viewer.currentScale * 100)}%`;
    zoomOut.disabled = viewer.currentScale <= 0.25;
    zoomIn.disabled = viewer.currentScale >= 3;
  };
  const fit = () => {
    fitting = true;
    viewer.currentScaleValue = "page-width";
  };
  const zoom = (factor: number) => {
    fitting = false;
    viewer.currentScale = Math.min(3, Math.max(0.25, viewer.currentScale * factor));
  };
  zoomOut.addEventListener("click", () => zoom(1 / 1.2), { signal: events.signal });
  zoomIn.addEventListener("click", () => zoom(1.2), { signal: events.signal });
  fitWidth.addEventListener("click", fit, { signal: events.signal });

  eventBus.on("pagesinit", () => {
    loaded = true;
    fit();
    fitWidth.disabled = false;
    updateZoom();
    status.textContent = `Page 1 of ${viewer.pagesCount}`;
  });
  eventBus.on("pagechanging", ({ pageNumber }: { pageNumber: number }) => {
    status.textContent = `Page ${pageNumber} of ${viewer.pagesCount}`;
  });
  eventBus.on("scalechanging", updateZoom);

  let previousWidth = 0;
  const resize = new ResizeObserver(([entry]) => {
    const width = entry.contentRect.width;
    if (width !== previousWidth && loaded && fitting) fit();
    previousWidth = width;
  });
  resize.observe(container);

  const loadingTask = getDocument({ url: reader.dataset.pdfUrl! });
  loadingTask.promise.then(pdf => {
    if (disposed) return;
    viewer.setDocument(pdf);
    linkService.setDocument(pdf);
  }).catch(error => {
    if (disposed) return;
    status.textContent = "Unable to load the preview. Use Open PDF above.";
    console.error("CV preview failed", error);
  });

  return () => {
    disposed = true;
    events.abort();
    resize.disconnect();
    // PDF.js supports null for teardown; its published type omits that case.
    (viewer.setDocument as (pdf: PDFDocumentProxy | null) => void)(null);
    linkService.setDocument(null);
    void loadingTask.destroy();
  };
}
