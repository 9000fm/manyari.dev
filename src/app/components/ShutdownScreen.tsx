'use client';

import React from 'react';
import { WIN_FONT } from '../constants';

interface ShutdownScreenProps {
  shutdownText: string;
  shutdownDots: string;
}

export function ShutdownScreen({ shutdownText, shutdownDots }: ShutdownScreenProps) {
  const winFont = WIN_FONT;

  return (
    <div
      style={{
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: winFont,
        color: 'white',
        fontSize: 'clamp(1.4rem, 5vw, 2.2rem)',
        textAlign: 'left',
        width: 'clamp(280px, 70vw, 450px)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}
    >
      {shutdownText}
      {shutdownDots}
      <span className="blink">_</span>
    </div>
  );
}
