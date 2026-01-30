'use client';

import React, { useState, useEffect, useRef } from 'react';
import { COLORS, WIN_FONT, SCRAMBLE_CHARS } from '../constants';

// Simple scramble hook for text reveal
function useScrambleReveal(text: string, trigger: boolean, speed: number = 40) {
  const [displayed, setDisplayed] = useState('');
  const chars = SCRAMBLE_CHARS.base;

  useEffect(() => {
    if (!trigger) return;

    let frame = 0;
    const maxFrames = Math.max(text.length * 2, 20);

    const interval = setInterval(() => {
      frame++;
      const locked = Math.floor((frame / maxFrames) * text.length);

      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (i < locked) {
          result += text[i];
        } else if (text[i] === ' ') {
          result += ' ';
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setDisplayed(result);

      if (frame >= maxFrames) {
        setDisplayed(text);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, trigger, speed, chars]);

  return displayed;
}

export default function PortfolioPage() {
  const [mounted, setMounted] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Scramble reveals
  const name = useScrambleReveal('flavio manyari', showName, 50);
  const tagline = useScrambleReveal('code + sound', showTagline, 40);

  useEffect(() => {
    setMounted(true);
    // Staggered reveals
    const nameTimer = setTimeout(() => setShowName(true), 300);
    const taglineTimer = setTimeout(() => setShowTagline(true), 1200);

    return () => {
      clearTimeout(nameTimer);
      clearTimeout(taglineTimer);
    };
  }, []);

  // Track mouse for subtle effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!mounted) return null;

  // Subtle gradient shift based on mouse position
  const gradientAngle = 135 + (mousePos.x - 0.5) * 30;

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100dvh',
        backgroundColor: COLORS.black,
        color: COLORS.secondary,
        fontFamily: WIN_FONT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle gradient overlay that follows mouse */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(${gradientAngle}deg, 
            rgba(0, 0, 255, 0.03) 0%, 
            transparent 50%, 
            rgba(0, 0, 255, 0.02) 100%)`,
          pointerEvents: 'none',
          transition: 'background 0.3s ease-out',
        }}
      />

      {/* Frame border (matching superself style) */}
      <div
        style={{
          position: 'absolute',
          inset: 'clamp(20px, 4vw, 50px)',
          border: `1px solid ${COLORS.secondary}`,
          pointerEvents: 'none',
          opacity: 0.4,
        }}
      />

      {/* Main content */}
      <main
        style={{
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        {/* Name */}
        <h1
          style={{
            fontSize: 'clamp(2rem, 8vw, 5rem)',
            fontWeight: 400,
            letterSpacing: '0.1em',
            marginBottom: '0.5em',
            color: COLORS.secondary,
            textTransform: 'lowercase',
            opacity: showName ? 1 : 0,
            transition: 'opacity 0.6s ease-out',
          }}
        >
          {name || '\u00A0'}
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
            letterSpacing: '0.3em',
            color: COLORS.primary,
            textTransform: 'lowercase',
            opacity: showTagline ? 1 : 0,
            transition: 'opacity 0.6s ease-out',
          }}
        >
          {tagline || '\u00A0'}
        </p>
      </main>

      {/* Bottom nav hint */}
      <nav
        style={{
          position: 'absolute',
          bottom: 'clamp(30px, 5vw, 60px)',
          display: 'flex',
          gap: '2rem',
          fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
          letterSpacing: '0.2em',
          textTransform: 'lowercase',
          opacity: showTagline ? 0.5 : 0,
          transition: 'opacity 0.6s ease-out 0.3s',
        }}
      >
        <span style={{ cursor: 'pointer' }}>work</span>
        <span style={{ cursor: 'pointer' }}>lab</span>
        <span style={{ cursor: 'pointer' }}>about</span>
      </nav>

      {/* Back to superself link */}
      <a
        href="/"
        style={{
          position: 'absolute',
          top: 'clamp(30px, 5vw, 60px)',
          left: 'clamp(30px, 5vw, 60px)',
          fontSize: '0.8rem',
          letterSpacing: '0.1em',
          color: COLORS.secondary,
          textDecoration: 'none',
          opacity: 0.4,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.4')}
      >
        ← superself
      </a>
    </div>
  );
}
