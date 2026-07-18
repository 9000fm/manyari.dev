"use client";
import { useRef, useEffect } from "react";

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

// Simplified world coastlines as [lon, lat] polylines (degrees), drawn over
// the grid so the globe reads as Earth. Rough on purpose - compact + no fetch.
const COAST: number[][][] = [
  // Africa
  [[-17,14],[-16,21],[-10,28],[0,36],[11,37],[24,32],[33,31],[36,22],[43,12],[51,12],[43,-1],[40,-14],[33,-26],[20,-35],[14,-23],[9,-1],[9,4],[-4,5],[-13,9],[-17,14]],
  // South America
  [[-79,9],[-71,11],[-60,6],[-50,0],[-35,-6],[-39,-14],[-48,-25],[-58,-34],[-67,-46],[-72,-53],[-74,-44],[-73,-30],[-77,-15],[-81,-5],[-80,2],[-79,9]],
  // North America
  [[-166,66],[-158,71],[-140,70],[-120,70],[-95,69],[-82,73],[-70,62],[-64,60],[-70,47],[-67,45],[-71,42],[-75,40],[-81,31],[-80,25],[-90,29],[-97,26],[-97,21],[-105,20],[-96,16],[-84,10],[-95,17],[-110,24],[-117,32],[-123,40],[-124,48],[-133,55],[-150,59],[-166,66]],
  // Eurasia
  [[-9,38],[-9,43],[-1,49],[3,52],[8,54],[6,58],[11,64],[26,71],[45,68],[60,70],[75,73],[100,76],[130,72],[160,69],[162,60],[152,59],[141,53],[132,43],[127,38],[122,31],[120,24],[109,21],[105,10],[100,7],[98,16],[90,22],[80,9],[77,8],[73,20],[66,25],[56,26],[47,30],[36,36],[28,41],[19,40],[12,45],[3,43],[-9,38]],
  // Australia
  [[114,-22],[123,-17],[131,-12],[137,-12],[143,-11],[146,-19],[153,-28],[150,-38],[141,-38],[130,-32],[123,-34],[115,-34],[114,-22]],
  // Greenland
  [[-45,60],[-52,64],[-52,70],[-42,76],[-30,78],[-22,70],[-32,64],[-45,60]],
  // Japan
  [[130,31],[135,34],[140,38],[142,42],[140,36],[137,35],[132,33],[130,31]],
  // British Isles
  [[-6,50],[-5,54],[-7,58],[-2,58],[0,53],[-2,51],[-6,50]],
];

function buildCoast() {
  const v: number[] = [];
  const STEPS = 3; // subdivide each segment so it hugs the sphere + culls cleanly
  const P = (latDeg: number, lonDeg: number): [number, number, number] => {
    const lat = (latDeg * Math.PI) / 180;
    const lon = (lonDeg * Math.PI) / 180;
    return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
  };
  for (const line of COAST) {
    for (let i = 0; i < line.length - 1; i++) {
      const [lo1, la1] = line[i];
      const [lo2, la2] = line[i + 1];
      for (let s = 0; s < STEPS; s++) {
        const t0 = s / STEPS;
        const t1 = (s + 1) / STEPS;
        v.push(...P(la1 + (la2 - la1) * t0, lo1 + (lo2 - lo1) * t0));
        v.push(...P(la1 + (la2 - la1) * t1, lo1 + (lo2 - lo1) * t1));
      }
    }
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
