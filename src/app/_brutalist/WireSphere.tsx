"use client";
import { useRef, useEffect } from "react";
import { COASTLINE } from "./coastline";
import { LANDGRID } from "./landgrid";

/**
 * GPU-rendered rotating wireframe globe. Raw WebGL, no libraries.
 * Opaque: a white disc fills the silhouette and back-facing grid lines are
 * culled, so nothing behind shows through. Front lines are solid black.
 * Faceted + aliased on purpose to match the raw Times aesthetic. Client island.
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
  const STEPS = 30; // lower = more faceted / cruder curves
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

// Flat circle (line loop) for the crisp silhouette.
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

// Filled disc (triangle fan) that makes the globe opaque.
function buildDisc() {
  const v: number[] = [0, 0, 0];
  const STEPS = 72;
  for (let i = 0; i <= STEPS; i++) {
    const a = (i / STEPS) * 2 * Math.PI;
    v.push(Math.cos(a), Math.sin(a), 0);
  }
  return new Float32Array(v);
}

// Real coastlines from Natural Earth 110m (see coastline.ts). Each polyline is
// a flat [lon, lat, lon, lat, ...] in degrees, projected onto the sphere as
// front-facing line segments.
function buildCoast() {
  const v: number[] = [];
  const P = (latDeg: number, lonDeg: number): [number, number, number] => {
    const lat = (latDeg * Math.PI) / 180;
    const lon = (lonDeg * Math.PI) / 180;
    return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
  };
  for (const line of COASTLINE) {
    for (let i = 0; i + 3 < line.length; i += 2) {
      v.push(...P(line[i + 1], line[i]));
      v.push(...P(line[i + 3], line[i + 2]));
    }
  }
  return new Float32Array(v);
}

// Finer land-only graticule (see landgrid.ts), projected to sphere segments.
function buildLandGrid() {
  const v: number[] = [];
  const P = (latDeg: number, lonDeg: number): [number, number, number] => {
    const lat = (latDeg * Math.PI) / 180;
    const lon = (lonDeg * Math.PI) / 180;
    return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
  };
  for (let i = 0; i + 3 < LANDGRID.length; i += 4) {
    v.push(...P(LANDGRID[i + 1], LANDGRID[i]));
    v.push(...P(LANDGRID[i + 3], LANDGRID[i + 2]));
  }
  return new Float32Array(v);
}

export default function WireSphere({
  size = 160,
  tilt = 0.5, // polar-axis incline (radians) - Wikipedia-style view from above
  lean = -14, // CSS roll in degrees - the Wikipedia globe's leftward lean
  speed = 0.00276,
}: {
  size?: number;
  tilt?: number;
  lean?: number;
  speed?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);

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
    let raf = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const frame = () => {
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

      // 1. opaque white fill (hides page + back lines)
      gl.uniform1f(u_white, 1);
      gl.uniform1f(u_cull, 0);
      gl.uniformMatrix4fv(u_rot, false, IDENT);
      bind(discBuf);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, disc.length / 3);

      // 2. graticule grid (front-facing only), dark grey - keeps weight, lets black coasts read
      gl.uniform1f(u_white, 0.32);
      gl.uniform1f(u_cull, 1);
      gl.uniformMatrix4fv(u_rot, false, M);
      bind(sphereBuf);
      gl.drawArrays(gl.LINES, 0, sphere.length / 3);

      // 2a. finer land-only graticule, medium grey
      gl.uniform1f(u_white, 0.52);
      bind(landBuf);
      gl.drawArrays(gl.LINES, 0, land.length / 3);

      // 2b. coastlines (front-facing only), black
      gl.uniform1f(u_white, 0);
      bind(coastBuf);
      gl.drawArrays(gl.LINES, 0, coast.length / 3);

      // 3. crisp silhouette
      gl.uniform1f(u_cull, 0);
      gl.uniformMatrix4fv(u_rot, false, IDENT);
      bind(limbBuf);
      gl.drawArrays(gl.LINES, 0, limb.length / 3);

      if (!reduce) {
        spin += speed;
        raf = requestAnimationFrame(frame);
      }
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      gl.deleteBuffer(sphereBuf);
      gl.deleteBuffer(limbBuf);
      gl.deleteBuffer(discBuf);
      gl.deleteBuffer(coastBuf);
      gl.deleteBuffer(landBuf);
      gl.deleteProgram(prog);
    };
  }, [size, tilt, speed]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ width: size, height: size, display: "block", transform: `rotate(${lean}deg)` }}
    />
  );
}
