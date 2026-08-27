// Pointer drag handling for the globe, shared by the worker path and the
// main-thread fallback. Runs on the main thread only (never imported by the
// worker).
//
// Slingshot model: the globe does NOT track the cursor 1:1. Drag accumulates
// "pull", and what the globe actually shows is a tanh-compressed fraction of it,
// so the first few degrees follow your hand almost exactly and then the globe
// starts falling behind, harder the further you go. That growing lag IS the
// tension readout - no gauge, no hint text, nothing to draw.
//
// On release we hand the globe two numbers (see globeGL's release()): the angle
// it is visibly wound to, and the tension stored PAST the visible ceiling. The
// second is what makes hauling further keep mattering after the globe has
// stopped visibly moving, which is how a nearly-maxed rubber band feels.
//
// Nothing here reverses anything. The spring on the other side unwinds through
// centre and out the far side on its own.

// radians of pull per pixel dragged.
const DRAG_SENS = 0.0052;
// radians the visible rotation asymptotes toward, no matter how far you pull.
// Reached at roughly 120px of drag; past that the globe is visibly straining.
const TENSION = 0.62;

export function createDragHandler(
  canvas: HTMLCanvasElement,
  cbs: {
    onDragStart: () => void;
    onDrag: (dTheta: number) => void;
    onDragEnd: (windUp: number, excess: number) => void;
  },
): () => void {
  let dragging = false;
  let lastX = 0;
  let pull = 0;    // total accumulated drag, in radians (the "stretch")
  let shown = 0;   // how much rotation we have actually handed to the globe

  // rising resistance: ~1:1 while pull is small, asymptotes to TENSION after.
  const tension = (p: number) => TENSION * Math.tanh(p / TENSION);

  const onDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    pull = 0;
    shown = 0;
    canvas.setPointerCapture?.(e.pointerId);
    canvas.style.cursor = "grabbing";
    cbs.onDragStart();
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    pull += (e.clientX - lastX) * DRAG_SENS;
    lastX = e.clientX;
    const next = tension(pull);
    cbs.onDrag(next - shown); // feed only the delta; the lag is the difference
    shown = next;
  };
  const onUp = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    canvas.releasePointerCapture?.(e.pointerId);
    canvas.style.cursor = "grab";
    // shown = where it visibly sits; pull - shown = what the tanh swallowed
    cbs.onDragEnd(shown, pull - shown);
    pull = 0;
    shown = 0;
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
