'use client';

import React, { useState, useRef, useEffect } from 'react';
import { WIN31 } from '../../constants';

type Win31WindowProps = {
  id: string;
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onRestore: () => void;
  onFocus: () => void;
  onMove: (position: { x: number; y: number }) => void;
  minWidth?: number;
  minHeight?: number;
  canMaximize?: boolean;
};

export default function Win31Window({
  title,
  children,
  isOpen,
  isMinimized,
  isMaximized,
  position,
  size,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onRestore,
  onFocus,
  onMove,
  minWidth = 200,
  minHeight = 100,
  canMaximize = false,
}: Win31WindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isOpening, setIsOpening] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  // Opening animation
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setIsOpening(true);
      setIsClosing(false);
      const timer = setTimeout(() => setIsOpening(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized]);

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 150);
  };

  // Handle minimize with animation
  const handleMinimize = () => {
    setIsMinimizing(true);
    setTimeout(onMinimize, 200);
  };

  // Handle dragging (mouse + touch)
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isMaximized) return;
    onFocus();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    setDragOffset({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      onMove({
        x: Math.max(0, clientX - dragOffset.x),
        y: Math.max(0, clientY - dragOffset.y),
      });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragOffset, onMove]);

  if (!isOpen || isMinimized) return null;

  const windowStyle: React.CSSProperties = isMaximized
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex,
      }
    : {
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: Math.max(size.width, minWidth),
        height: Math.max(size.height, minHeight),
        zIndex,
      };

  return (
    <div
      ref={windowRef}
      onClick={onFocus}
      style={{
        ...windowStyle,
        backgroundColor: WIN31.windowBg,
        border: '1px solid #000000',
        display: 'flex',
        flexDirection: 'column',
        transform: isMinimizing
          ? 'scale(0.1) translateY(100vh)'
          : isOpening || isClosing
          ? 'scale(0.85)'
          : 'scale(1)',
        opacity: isOpening || isClosing || isMinimizing ? 0 : 1,
        transition: isMinimizing
          ? 'transform 0.2s ease-in, opacity 0.2s ease-in'
          : 'transform 0.15s ease-out, opacity 0.15s ease-out',
      }}
    >
      {/* Titlebar */}
      <div
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        style={{
          backgroundColor: WIN31.titlebar,
          padding: '3px 4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: isMaximized ? 'default' : isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
      >
        <span
          style={{
            color: WIN31.titlebarText,
            fontFamily: '"MS Sans Serif", Arial, sans-serif',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {title}
        </span>
        <div style={{ display: 'flex', gap: '2px' }}>
          <ControlButton icon="−" onClick={handleMinimize} />
          <ControlButton
            icon={isMaximized ? '❐' : '□'}
            onClick={canMaximize ? (isMaximized ? onRestore : onMaximize) : undefined}
            disabled={!canMaximize}
          />
          <ControlButton icon="×" onClick={handleClose} />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: WIN31.contentBg,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Control button for window titlebar - FLAT 1985 style
function ControlButton({ icon, onClick, disabled }: { icon: string; onClick?: () => void; disabled?: boolean }) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onClick?.();
      }}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        width: '16px',
        height: '14px',
        backgroundColor: pressed && !disabled ? '#808080' : '#C0C0C0',
        border: '1px solid #000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"MS Sans Serif", Arial, sans-serif',
        fontSize: '10px',
        fontWeight: 'bold',
        cursor: disabled ? 'default' : 'pointer',
        padding: 0,
        lineHeight: 1,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon}
    </button>
  );
}
