'use client';

import React, { useState, useEffect } from 'react';
import { WIN31 } from '../../constants';

interface DesktopIconProps {
  label: string;
  onClick?: () => void;
  icon: React.ReactNode;
  show?: boolean;
  delay?: number;
}

export default function DesktopIcon({
  label,
  onClick,
  icon,
  show = true,
  delay = 0,
}: DesktopIconProps) {
  const [selected, setSelected] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  // Staggered appearance
  useEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [show, delay]);

  // Inverted colors on hover
  const isActive = selected || hovered;

  return (
    <div
      onClick={onClick}
      onMouseDown={() => setSelected(true)}
      onMouseUp={() => setTimeout(() => setSelected(false), 200)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        padding: '10px',
        userSelect: 'none',
        minWidth: '80px',
        transition: 'transform 0.1s ease, opacity 0.3s ease',
        transform: selected ? 'scale(0.95)' : 'scale(1)',
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          backgroundColor: isActive ? WIN31.border : 'transparent',
          color: isActive ? '#FFFFFF' : WIN31.border,
          border: '1px solid transparent',
          transition: 'background-color 0.15s ease, color 0.15s ease',
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontFamily: '"MS Sans Serif", Arial, sans-serif',
          fontSize: '13px',
          backgroundColor: isActive ? WIN31.border : 'transparent',
          color: isActive ? '#FFFFFF' : WIN31.border,
          padding: '2px 6px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          transition: 'background-color 0.15s ease, color 0.15s ease',
        }}
      >
        {label}
      </span>
    </div>
  );
}
