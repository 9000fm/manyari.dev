// Pointer drag handling for the globe, shared by the worker path and the
// main-thread fallback. Converts horizontal drag into rotation and, on release,
// a capped bit of momentum. Runs on the main thread only (never imported by the
// worker). Tuned for an elegant, weighty feel - not a twitchy/cartoonish fling.

// radians of spin per pixel dragged (lower = heavier / harder to turn). Tuned
// deliberately stiff so it feels weighty, not a light toy you can whip around.
const DRAG_SENS = 0.0052;
// how much of the drag speed carries into the release glide (rest is "friction").
// Low, so letting go doesn't launch a cartoonish free-spin - it settles quickly.
const FLING_DAMP = 0.3;

export function createDragHandler(
  canvas: HTMLCanvasElement,
  cbs: {
    onDragStart: () => void;
    onDrag: (dTheta: number) => void;
    onDragEnd: (flingVel: number) => void;
  },
): () => void {
  let dragging = false;
  let lastX = 0;
  let velTheta = 0; // smoothed rotation-per-frame during the drag

  const onDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    velTheta = 0;
    canvas.setPointerCapture?.(e.pointerId);
    canvas.style.cursor = "grabbing";
    cbs.onDragStart();
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dTheta = (e.clientX - lastX) * DRAG_SENS;
    lastX = e.clientX;
    velTheta = velTheta * 0.6 + dTheta * 0.4; // EMA for a stable release velocity
    cbs.onDrag(dTheta);
  };
  const onUp = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    canvas.releasePointerCapture?.(e.pointerId);
    canvas.style.cursor = "grab";
    cbs.onDragEnd(velTheta * FLING_DAMP);
  };

  canvas.style.cursor = "grab";
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);

  return () => {
    canvas.removeEventListener("pointerdown", onDown);
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerup", onUp);
    canvas.removeEventListener("pointercancel", onUp);
  };
}
