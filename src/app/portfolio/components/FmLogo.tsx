'use client';

import React from 'react';

// FM ASCII OPTIONS

// OPTION B: Filled blocks (larger)
const FM_OPTION_B = [
  '██████╗   ███╗   ███╗',
  '██╔═══╝   ████╗ ████║',
  '█████╗    ██╔████╔██║',
  '██╔══╝    ██║╚██╔╝██║',
  '██║       ██║ ╚═╝ ██║',
  '╚═╝       ╚═╝     ╚═╝',
];

const FM_BIG = FM_OPTION_B;

interface FmLogoProps {
  show: boolean;
}

export default function FmLogo({ show }: FmLogoProps) {
  return (
    <div
      style={{
        fontFamily: '"Courier New", Courier, "Lucida Console", monospace',
        fontSize: 'clamp(0.6rem, 1.5vw, 1rem)',
        lineHeight: 1.0,
        color: '#000000',
        textAlign: 'center',
        marginBottom: '8px',
        opacity: show ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
        whiteSpace: 'pre',
        overflow: 'hidden',
        maxWidth: '100%',
      }}
    >
      {FM_BIG.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
}
