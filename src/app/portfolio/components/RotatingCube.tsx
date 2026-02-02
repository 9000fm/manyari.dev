'use client';

import React, { useState, useEffect } from 'react';

interface RotatingCubeProps {
  show: boolean;
  delay?: number;
}

export default function RotatingCube({ show, delay = 0 }: RotatingCubeProps) {
  const [visible, setVisible] = useState(false);
  const [angleY, setAngleY] = useState(0);
  const [angleX, setAngleX] = useState(0);

  useEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [show, delay]);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setAngleY(a => (a + 1.5) % 360);
      setAngleX(a => (a + 0.8) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  // 3D cube vertices (centered at origin, size 1)
  const vertices3D = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], // back face
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],     // front face
  ];

  // Edges connecting vertices
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 0], // back face
    [4, 5], [5, 6], [6, 7], [7, 4], // front face
    [0, 4], [1, 5], [2, 6], [3, 7], // connecting edges
  ];

  // Rotation matrices
  const radY = (angleY * Math.PI) / 180;
  const radX = (angleX * Math.PI) / 180;
  const cosY = Math.cos(radY), sinY = Math.sin(radY);
  const cosX = Math.cos(radX), sinX = Math.sin(radX);

  // Project 3D to 2D with rotation
  const size = 28;
  const cx = 50, cy = 50;
  const project = (v: number[]) => {
    // Rotate around Y axis
    const x = v[0] * cosY - v[2] * sinY;
    const z = v[0] * sinY + v[2] * cosY;
    const y = v[1];
    // Rotate around X axis
    const y2 = y * cosX - z * sinX;
    const z2 = y * sinX + z * cosX;
    // Simple perspective projection
    const scale = 2.5 / (3 + z2);
    return { x: cx + x * size * scale, y: cy + y2 * size * scale, z: z2 };
  };

  const projected = vertices3D.map(v => project(v));

  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      {edges.map(([i, j], idx) => (
        <line
          key={idx}
          x1={projected[i].x}
          y1={projected[i].y}
          x2={projected[j].x}
          y2={projected[j].y}
          stroke="rgba(0,0,0,0.5)"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}
