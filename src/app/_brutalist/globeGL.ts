import { COASTLINE } from "./coastline";
import { LANDGRID } from "./landgrid";
import { LANDFILL } from "./landfill";

/**
 * Shared WebGL globe core. Pure - no DOM / window access - so it can run on the
 * main thread OR inside a Web Worker (OffscreenCanvas). The ~140KB of Natural
 * Earth geo data is imported here, so whichever bundle pulls this in (the worker
 * bundle, or the lazy main-thread fallback chunk) is where that parse happens.
 */

const VERT = `
attribute vec3 a_pos;
uniform mat4 u_rot;
uniform float u_scale;
varying float v_z;
void main() {
  vec4 p = u_rot * vec4(a_pos, 1.0);
  v_z = p.z;
  gl_Position = vec4(p.x * u_scale, p.y * u_scale, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying float v_z;
uniform float u_white; // 1.0 = white fill, 0.0 = black line
uniform float u_cull;  // 1.0 = discard back-facing (front-only)
void main() {
  if (u_cull > 0.5 && v_z < 0.0) discard;
  vec3 c = mix(vec3(0.0), vec3(1.0), u_white);
  gl_FragColor = vec4(c, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

function buildSphere() {
  const v: number[] = [];
  const STEPS = 30;
  const P = (lat: number, lon: number): [number, number, number] => [
    Math.cos(lat) * Math.sin(lon),
    Math.sin(lat),
    Math.cos(lat) * Math.cos(lon),
  ];
  for (let k = 1; k < 12; k++) {
    const lat = -Math.PI / 2 + (k * Math.PI) / 12;
    for (let i = 0; i < STEPS; i++) {
      v.push(...P(lat, (i / STEPS) * 2 * Math.PI), ...P(lat, ((i + 1) / STEPS) * 2 * Math.PI));
    }
  }
  for (let j = 0; j < 18; j++) {
    const lon = (j * Math.PI) / 9;
    for (let i = 0; i < STEPS; i++) {
      v.push(
        ...P(-Math.PI / 2 + (i / STEPS) * Math.PI, lon),
        ...P(-Math.PI / 2 + ((i + 1) / STEPS) * Math.PI, lon),
      );
    }
  }
  return new Float32Array(v);
}

function buildLimb() {
  const v: number[] = [];
  const STEPS = 72;
  for (let i = 0; i < STEPS; i++) {
    const a = (i / STEPS) * 2 * Math.PI;
    const b = ((i + 1) / STEPS) * 2 * Math.PI;
    v.push(Math.cos(a), Math.sin(a), 0, Math.cos(b), Math.sin(b), 0);
  }
  return new Float32Array(v);
}

function buildDisc() {
  const v: number[] = [0, 0, 0];
  const STEPS = 72;
  for (let i = 0; i <= STEPS; i++) {
    const a = (i / STEPS) * 2 * Math.PI;
    v.push(Math.cos(a), Math.sin(a), 0);
  }
  return new Float32Array(v);
}

const toXYZ = (latDeg: number, lonDeg: number): [number, number, number] => {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
};

function buildCoast() {
  const v: number[] = [];
  for (const line of COASTLINE) {
    for (let i = 0; i + 3 < line.length; i += 2) {
      v.push(...toXYZ(line[i + 1], line[i]));
      v.push(...toXYZ(line[i + 3], line[i + 2]));
    }
  }
  return new Float32Array(v);
}

function buildLandGrid() {
  const v: number[] = [];
  for (let i = 0; i + 3 < LANDGRID.length; i += 4) {
    v.push(...toXYZ(LANDGRID[i + 1], LANDGRID[i]));
    v.push(...toXYZ(LANDGRID[i + 3], LANDGRID[i + 2]));
  }
  return new Float32Array(v);
}

function buildLandFill() {
  const v: number[] = [];
  for (let i = 0; i + 5 < LANDFILL.length; i += 6) {
    v.push(...toXYZ(LANDFILL[i + 1], LANDFILL[i]));
    v.push(...toXYZ(LANDFILL[i + 3], LANDFILL[i + 2]));
    v.push(...toXYZ(LANDFILL[i + 5], LANDFILL[i + 4]));
  }
  return new Float32Array(v);
}

export type GlobeParams = {
  size: number;
  dpr: number;
  tilt?: number;
  speed?: number;
  reduce?: boolean;
};

export type GlobeController = {
  tick: () => void;
  dragBy: (dTheta: number) => void;
  setDragging: (on: boolean) => void;
  fling: (vel: number) => void;
  dispose: () => void;
  reduce: boolean;
};

// drag-to-spin feel: MAX_VEL caps how fast a fling can spin (kept low so it never
// whips into a cartoonish free-spin); RETURN_EASE is how quickly it settles back
// to the gentle auto-spin after you let go (higher = settles sooner)
const MAX_VEL = 0.009;
const RETURN_EASE = 0.025;

/**
 * Sets up the globe on an already-obtained GL context and returns a controller.
 * The caller owns the animation loop (rAF on the main thread, setTimeout in a
 * worker) and calls tick(now) each frame; reverse(now) flips the spin.
 */
export function createGlobeController(gl: WebGLRenderingContext, p: GlobeParams): GlobeController {
  const size = p.size;
  const dpr = p.dpr;
  const tilt = p.tilt ?? 0.5;
  const speed = p.speed ?? 0.00243;
  const reduce = !!p.reduce;

  const cvs = gl.canvas as HTMLCanvasElement | OffscreenCanvas;
  cvs.width = size * dpr;
  cvs.height = size * dpr;
  gl.viewport(0, 0, cvs.width, cvs.height);

  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const sphere = buildSphere();
  const limb = buildLimb();
  const disc = buildDisc();
  const coast = buildCoast();
  const land = buildLandGrid();
  const fill = buildLandFill();
  const mk = (data: Float32Array) => {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return b;
  };
  const sphereBuf = mk(sphere);
  const limbBuf = mk(limb);
  const discBuf = mk(disc);
  const coastBuf = mk(coast);
  const landBuf = mk(land);
  const fillBuf = mk(fill);

  const a_pos = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(a_pos);
  const u_rot = gl.getUniformLocation(prog, "u_rot");
  const u_scale = gl.getUniformLocation(prog, "u_scale");
  const u_white = gl.getUniformLocation(prog, "u_white");
  const u_cull = gl.getUniformLocation(prog, "u_cull");
  gl.uniform1f(u_scale, 0.82);
  gl.disable(gl.BLEND);
  gl.lineWidth(1);

  const cosT = Math.cos(tilt);
  const sinT = Math.sin(tilt);
  const IDENT = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

  const bind = (buf: WebGLBuffer | null) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.vertexAttribPointer(a_pos, 3, gl.FLOAT, false, 0, 0);
  };

  let spin = 0;
  let autoDir = -1; // gentle auto-spin direction (starts clockwise); follows drags
  let vel = autoDir * speed;
  let dragging = false;

  // grab the globe: rotate it directly by the drag delta (radians)
  function dragBy(dTheta: number) {
    spin += dTheta;
  }
  function setDragging(on: boolean) {
    dragging = on;
  }
  // let go: carry a capped bit of momentum, and remember the direction thrown so
  // the gentle auto-spin continues that way
  function fling(v: number) {
    vel = Math.max(-MAX_VEL, Math.min(MAX_VEL, v));
    if (Math.abs(vel) > 0.0005) autoDir = vel < 0 ? -1 : 1;
  }

  function drawFrame() {
    const cs = Math.cos(spin);
    const sn = Math.sin(spin);
    const M = new Float32Array([
      cs, sinT * sn, -cosT * sn, 0,
      0, cosT, sinT, 0,
      sn, -sinT * cs, cosT * cs, 0,
      0, 0, 0, 1,
    ]);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(u_white, 1);
    gl.uniform1f(u_cull, 0);
    gl.uniformMatrix4fv(u_rot, false, IDENT);
    bind(discBuf);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, disc.length / 3);

    gl.uniform1f(u_white, 0.32);
    gl.uniform1f(u_cull, 1);
    gl.uniformMatrix4fv(u_rot, false, M);
    bind(sphereBuf);
    gl.drawArrays(gl.LINES, 0, sphere.length / 3);

    gl.uniform1f(u_white, 1);
    bind(fillBuf);
    gl.drawArrays(gl.TRIANGLES, 0, fill.length / 3);

    gl.uniform1f(u_white, 0.52);
    bind(landBuf);
    gl.drawArrays(gl.LINES, 0, land.length / 3);

    gl.uniform1f(u_white, 0);
    bind(coastBuf);
    gl.drawArrays(gl.LINES, 0, coast.length / 3);

    gl.uniform1f(u_cull, 0);
    gl.uniformMatrix4fv(u_rot, false, IDENT);
    bind(limbBuf);
    gl.drawArrays(gl.LINES, 0, limb.length / 3);
  }

  function tick() {
    // while dragging, spin is moved directly by dragBy(); otherwise ease the
    // velocity back toward the gentle auto-spin (a slow, heavy glide after a fling)
    if (!dragging && !reduce) {
      vel += (autoDir * speed - vel) * RETURN_EASE;
      spin += vel;
    }
    drawFrame();
  }

  function dispose() {
    gl.deleteBuffer(sphereBuf);
    gl.deleteBuffer(limbBuf);
    gl.deleteBuffer(discBuf);
    gl.deleteBuffer(coastBuf);
    gl.deleteBuffer(landBuf);
    gl.deleteBuffer(fillBuf);
    gl.deleteProgram(prog);
  }

  return { tick, dragBy, setDragging, fling, dispose, reduce };
}
