import { createGlobeController } from "./globeGL";
import { createDragHandler } from "./globeDrag";

/**
 * Main-thread globe render - the fallback for browsers without OffscreenCanvas
 * (e.g. Safari < 17) or if the worker reports failure. Same visuals as the
 * worker path; the only difference is it runs on the main thread, driven by
 * requestAnimationFrame. Loaded via dynamic import(), so this + its ~140KB geo
 * data never land in the initial bundle - only supported-less browsers pay it.
 *
 * Returns a cleanup function.
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
