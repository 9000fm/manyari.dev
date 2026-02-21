"use client";

import { useRef, useEffect, useCallback } from "react";

interface MouseTarget {
  x: number;
  y: number;
}

export function useMouseRotation() {
  const target = useRef<MouseTarget>({ x: 0, y: 0 });
  const current = useRef<MouseTarget>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Normalize to -1..1
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const lerp = useCallback((delta: number) => {
    const factor = 1 - Math.pow(0.05, delta);
    current.current.x += (target.current.x - current.current.x) * factor;
    current.current.y += (target.current.y - current.current.y) * factor;
    return current.current;
  }, []);

  return { lerp, target, current };
}
