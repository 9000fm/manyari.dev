import { createGlobeController, type GlobeController } from "./globeGL";

/**
 * Renders the globe inside a Web Worker via OffscreenCanvas, so the ~140KB geo
 * parse + all WebGL work stay off the main thread. Workers have no
 * requestAnimationFrame, so the loop is a self-scheduled setTimeout at ~60fps.
 *
 * Messages in: 'init' (start), 'dragStart' / 'drag' {dTheta} / 'dragEnd' {vel}
 * (drag-to-spin, driven by the main thread's pointer events). Posts 'ready' on
 * success or 'fail' (main thread then falls back to a main-thread render).
 */

const ctx = self as unknown as {
  onmessage: ((e: MessageEvent) => void) | null;
  postMessage: (msg: unknown) => void;
};

let ctrl: GlobeController | null = null;
let dragging = false;
let looping = false;

function loop() {
  if (!ctrl) {
    looping = false;
    return;
  }
  ctrl.tick();
  // keep looping while it auto-spins, or while a drag is in progress; in
  // reduced-motion it draws once and idles until the next drag
  if (!ctrl.reduce || dragging) {
    setTimeout(loop, 16);
  } else {
    looping = false;
  }
}
function ensureLoop() {
  if (!looping && ctrl) {
    looping = true;
    loop();
  }
}

ctx.onmessage = (e: MessageEvent) => {
  const data = e.data as {
    type: string;
    canvas?: OffscreenCanvas;
    size?: number;
    dpr?: number;
    tilt?: number;
    speed?: number;
    reduce?: boolean;
    dTheta?: number;
    vel?: number;
  };

  if (data.type === "init" && data.canvas) {
    try {
      const gl = data.canvas.getContext("webgl", {
        antialias: false,
        alpha: true,
        premultipliedAlpha: false,
      }) as WebGLRenderingContext | null;
      if (!gl) {
        ctx.postMessage({ type: "fail" });
        return;
      }
      ctrl = createGlobeController(gl, {
        size: data.size ?? 160,
        dpr: data.dpr ?? 1,
        tilt: data.tilt,
        speed: data.speed,
        reduce: data.reduce,
      });
      ctx.postMessage({ type: "ready" });
      ensureLoop();
    } catch {
      ctx.postMessage({ type: "fail" });
    }
  } else if (data.type === "dragStart") {
    dragging = true;
    ctrl?.setDragging(true);
    ensureLoop();
  } else if (data.type === "drag") {
    ctrl?.dragBy(data.dTheta ?? 0);
  } else if (data.type === "dragEnd") {
    dragging = false;
    ctrl?.setDragging(false);
    ctrl?.fling(data.vel ?? 0);
    ensureLoop();
  }
};
