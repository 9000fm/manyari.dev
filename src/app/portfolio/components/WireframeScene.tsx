'use client';

import React, { useEffect, useRef } from 'react';

// 3D Vector math helpers
interface Vec3 {
  x: number;
  y: number;
  z: number;
}

function rotateY(v: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: v.x * cos - v.z * sin,
    y: v.y,
    z: v.x * sin + v.z * cos,
  };
}

function rotateX(v: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: v.x,
    y: v.y * cos - v.z * sin,
    z: v.y * sin + v.z * cos,
  };
}

function project(v: Vec3, fov: number, viewDist: number): { x: number; y: number } {
  const factor = fov / (viewDist + v.z);
  return {
    x: v.x * factor,
    y: v.y * factor,
  };
}

// Cube vertices (8 corners)
const CUBE_SIZE = 40;
const cubeVertices: Vec3[] = [
  { x: -1, y: -1, z: -1 },
  { x: 1, y: -1, z: -1 },
  { x: 1, y: 1, z: -1 },
  { x: -1, y: 1, z: -1 },
  { x: -1, y: -1, z: 1 },
  { x: 1, y: -1, z: 1 },
  { x: 1, y: 1, z: 1 },
  { x: -1, y: 1, z: 1 },
].map(v => ({ x: v.x * CUBE_SIZE, y: v.y * CUBE_SIZE, z: v.z * CUBE_SIZE }));

// Cube edges (12 edges connecting vertices)
const cubeEdges: [number, number][] = [
  // Back face
  [0, 1], [1, 2], [2, 3], [3, 0],
  // Front face
  [4, 5], [5, 6], [6, 7], [7, 4],
  // Connecting edges
  [0, 4], [1, 5], [2, 6], [3, 7],
];

// Generate sphere wireframe (latitude/longitude)
function generateSphereLines(radius: number, latSegments: number, lonSegments: number): Vec3[][] {
  const lines: Vec3[][] = [];

  // Latitude circles
  for (let lat = 1; lat < latSegments; lat++) {
    const theta = (lat / latSegments) * Math.PI;
    const y = radius * Math.cos(theta);
    const r = radius * Math.sin(theta);
    const circle: Vec3[] = [];
    for (let lon = 0; lon <= lonSegments; lon++) {
      const phi = (lon / lonSegments) * Math.PI * 2;
      circle.push({
        x: r * Math.cos(phi),
        y: y,
        z: r * Math.sin(phi),
      });
    }
    lines.push(circle);
  }

  // Longitude lines
  for (let lon = 0; lon < lonSegments; lon++) {
    const phi = (lon / lonSegments) * Math.PI * 2;
    const line: Vec3[] = [];
    for (let lat = 0; lat <= latSegments; lat++) {
      const theta = (lat / latSegments) * Math.PI;
      const y = radius * Math.cos(theta);
      const r = radius * Math.sin(theta);
      line.push({
        x: r * Math.cos(phi),
        y: y,
        z: r * Math.sin(phi),
      });
    }
    lines.push(line);
  }

  return lines;
}

const SPHERE_RADIUS = 50;
const sphereLines = generateSphereLines(SPHERE_RADIUS, 6, 8);

interface WireframeSceneProps {
  show: boolean;
}

export default function WireframeScene({ show }: WireframeSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const angleRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!show) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Pastel blue/cyan color for wireframes
      ctx.strokeStyle = 'rgba(0, 0, 139, 0.4)';
      ctx.lineWidth = 1;

      const angleY = angleRef.current.y;
      const angleX = angleRef.current.x;

      // Sphere position (left side)
      const sphereCenterX = canvas.width * 0.3;
      const sphereCenterY = canvas.height * 0.4;

      // Draw sphere
      for (const line of sphereLines) {
        ctx.beginPath();
        for (let i = 0; i < line.length; i++) {
          let v = line[i];
          v = rotateY(v, angleY);
          v = rotateX(v, angleX * 0.5);
          const p = project(v, 200, 300);
          if (i === 0) {
            ctx.moveTo(sphereCenterX + p.x, sphereCenterY + p.y);
          } else {
            ctx.lineTo(sphereCenterX + p.x, sphereCenterY + p.y);
          }
        }
        ctx.stroke();
      }

      // Cube position (right side)
      const cubeCenterX = canvas.width * 0.7;
      const cubeCenterY = canvas.height * 0.6;

      // Draw cube
      for (const [i1, i2] of cubeEdges) {
        let v1 = cubeVertices[i1];
        let v2 = cubeVertices[i2];

        // Rotate
        v1 = rotateY(v1, angleY * 0.8);
        v1 = rotateX(v1, angleX * 0.6);
        v2 = rotateY(v2, angleY * 0.8);
        v2 = rotateX(v2, angleX * 0.6);

        // Project to 2D
        const p1 = project(v1, 200, 300);
        const p2 = project(v2, 200, 300);

        ctx.beginPath();
        ctx.moveTo(cubeCenterX + p1.x, cubeCenterY + p1.y);
        ctx.lineTo(cubeCenterX + p2.x, cubeCenterY + p2.y);
        ctx.stroke();
      }

      // Update angles for rotation
      angleRef.current.y += 0.008;
      angleRef.current.x += 0.004;

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [show]);

  if (!show) return null;

  return (
    <>
      {/* Wireframe canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* Retro CRT scanlines overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.04,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />
    </>
  );
}
