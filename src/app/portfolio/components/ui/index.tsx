'use client';

import React, { useState } from 'react';
import { WIN31 } from '../../../constants';

// Win3.1 Button
interface Win31ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export function Win31Button({ children, onClick, style, disabled }: Win31ButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={(e) => onClick?.(e)}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        backgroundColor: pressed ? '#808080' : '#C0C0C0',
        border: '1px solid #000000',
        fontFamily: '"MS Sans Serif", Arial, sans-serif',
        fontSize: '11px',
        color: '#000000',
        padding: '4px 16px',
        minWidth: '70px',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// Control Button (minimize, maximize, close)
interface ControlButtonProps {
  icon: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ControlButton({ icon, onClick, disabled }: ControlButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        width: '22px',
        height: '20px',
        backgroundColor: pressed && !disabled ? '#808080' : '#C0C0C0',
        border: '1px solid #000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"MS Sans Serif", Arial, sans-serif',
        fontSize: '14px',
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

// Menu Separator
export function MenuSeparator() {
  return (
    <div
      style={{
        height: '1px',
        backgroundColor: '#808080',
        margin: '4px 2px',
      }}
    />
  );
}

// Menu Item
interface MenuItemProps {
  label: string;
  onClick?: () => void;
  hasSubmenu?: boolean;
  shortcut?: string;
  disabled?: boolean;
}

export function MenuItem({ label, onClick, hasSubmenu, shortcut, disabled }: MenuItemProps) {
  const [hovered, setHovered] = useState(false);

  const firstChar = label[0];
  const rest = label.slice(1);

  return (
    <div
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...WIN31.menuItem,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: '"MS Sans Serif", Arial, sans-serif',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        backgroundColor: hovered && !disabled ? WIN31.titlebar : 'transparent',
        color: disabled ? '#808080' : (hovered ? '#FFFFFF' : '#000000'),
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <span>
        <span style={{ textDecoration: disabled ? 'none' : 'underline' }}>{firstChar}</span>
        {rest}
      </span>
      {hasSubmenu && <span style={{ marginLeft: '20px' }}>▶</span>}
      {shortcut && <span style={{ marginLeft: '20px', opacity: 0.7 }}>{shortcut}</span>}
    </div>
  );
}
