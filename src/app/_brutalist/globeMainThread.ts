import { createGlobeController, type GlobeController, type LaunchTuning } from "./globeGL";
import { createDragHandler } from "./globeDrag";

/**
 * Main-thread globe render, driven by requestAnimationFrame. This is the sole
 * render path: it runs eagerly on mount so the globe shows reliably on every
 * load / reload. Sets up the WebGL globe (via globeGL) and drag-to-spin (via
 * globeDrag). Returns a cleanup function.
 */
export function renderMainThread(
  canvas: HTMLCanvasElement,
  opts: {
    size: number;
    tilt?: number;
    speed?: number;
    launch?: Partial<LaunchTuning>;
    /** hands the controller back so a tuning page can adjust the launch live.
     *  Unused in production. */
    onController?: (ctrl: GlobeController) => void;
  },
): () => void {
  const gl = canvas.getContext("webgl", {
    antialias: false,
    alpha: true,
    premultipliedAlpha: false,
  });
  if (!gl) return () => {};

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctrl = createGlobeController(gl, {
    size: opts.size,
    dpr,
    tilt: opts.tilt,
    speed: opts.speed,
    reduce,
    launch: opts.launch,
  });
  opts.onController?.(ctrl);

  let raf = 0;
  let dragging = false;
  let onScreen = true; // IntersectionObserver flips this; off-screen = no draws
  const frame = () => {
    ctrl.tick();
    // keep animating while visible and auto-spinning, or mid-drag; idle otherwise
    raf = (onScreen && !reduce) || dragging ? requestAnimationFrame(frame) : 0;
  };
  const ensureFrame = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };
  frame();

  // pause the whole loop while the canvas is scrolled off-screen - on mobile
  // the globe lives in the header, and drawing it under the fold burns battery
  const io =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          onScreen = entry.isIntersecting;
          if (onScreen) ensureFrame();
        });
  io?.observe(canvas);

  // drag to spin
  const detach = createDragHandler(canvas, {
    onDragStart: () => {
      dragging = true;
      ctrl.setDragging(true);
      ensureFrame();
    },
    onDrag: (dTheta) => ctrl.dragBy(dTheta),
    onDragEnd: (windUp, excess) => {
      dragging = false;
      ctrl.setDragging(false);
      ctrl.release(windUp, excess);
      ensureFrame();
    },
  });

  return () => {
    detach();
    io?.disconnect();
    cancelAnimationFrame(raf);
    ctrl.dispose();
  };
}
