import { createGlobeController } from "./globeGL";
import { createDragHandler } from "./globeDrag";

/**
 * Main-thread globe render, driven by requestAnimationFrame. This is the sole
 * render path: it runs eagerly on mount so the globe shows reliably on every
 * load / reload. Sets up the WebGL globe (via globeGL) and drag-to-spin (via
 * globeDrag). Returns a cleanup function.
 */
export function renderMainThread(
  canvas: HTMLCanvasElement,
  opts: { size: number; tilt?: number; speed?: number },
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
  });

  let raf = 0;
  let dragging = false;
  const frame = () => {
    ctrl.tick();
    // keep animating while auto-spinning or mid-drag; idle otherwise (reduced-motion)
    raf = !reduce || dragging ? requestAnimationFrame(frame) : 0;
  };
  const ensureFrame = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };
  frame();

  // drag to spin
  const detach = createDragHandler(canvas, {
    onDragStart: () => {
      dragging = true;
      ctrl.setDragging(true);
      ensureFrame();
    },
    onDrag: (dTheta) => ctrl.dragBy(dTheta),
    onDragEnd: (flingVel) => {
      dragging = false;
      ctrl.setDragging(false);
      ctrl.fling(flingVel);
      ensureFrame();
    },
  });

  return () => {
    detach();
    cancelAnimationFrame(raf);
    ctrl.dispose();
  };
}
