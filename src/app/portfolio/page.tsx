'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WIN31, MSDOS, WIN_FONT, SCRAMBLE_CHARS } from '../constants';
import Toast from '../components/Toast';
import { useWindowManager, WindowState } from './hooks/useWindowManager';
import Win31Window from './components/Win31Window';
import Clock from './components/apps/Clock';
import Calculator from './components/apps/Calculator';
import Notepad from './components/apps/Notepad';
import Minesweeper from './components/apps/Minesweeper';
import Solitaire from './components/apps/Solitaire';
import Paint from './components/apps/Paint';
import WireframeScene from './components/WireframeScene';

// Portfolio translations
const portfolioText = {
  ES: {
    tagline: 'Diseño & Desarrollo',
    work: 'Proyectos',
    lab: 'Lab',
    about: 'Info',
    emailCopied: 'email copiado',
    file: 'Archivo',
    options: 'Opciones',
    window: 'Ventana',
    help: 'Ayuda',
    exit: 'Salir',
    language: 'Idioma',
    aboutMenu: 'Acerca de...',
    // Win3.1 menu items
    restore: 'Restaurar',
    move: 'Mover',
    size: 'Tamano',
    minimize: 'Minimizar',
    maximize: 'Maximizar',
    close: 'Cerrar',
    switchTo: 'Cambiar a...',
    // Apps
    apps: 'Aplicaciones',
    games: 'Juegos',
    accessories: 'Accesorios',
    clock: 'Reloj',
    calculator: 'Calculadora',
    notepad: 'Bloc de notas',
    solitaire: 'Solitario',
    minesweeper: 'Buscaminas',
    tile: 'Mosaico',
    cascade: 'Cascada',
    ready: 'Listo',
    comingSoon: 'Proximamente...',
    emptyFolder: '(Carpeta vacia)',
    paint: 'Paint',
    shutdown: 'CERRANDO SESION',
  },
  EN: {
    tagline: 'Design & Development',
    work: 'Projects',
    lab: 'Lab',
    about: 'Info',
    emailCopied: 'email copied',
    file: 'File',
    options: 'Options',
    window: 'Window',
    help: 'Help',
    exit: 'Exit',
    language: 'Language',
    aboutMenu: 'About...',
    // Win3.1 menu items
    restore: 'Restore',
    move: 'Move',
    size: 'Size',
    minimize: 'Minimize',
    maximize: 'Maximize',
    close: 'Close',
    switchTo: 'Switch To...',
    // Apps
    apps: 'Apps',
    games: 'Games',
    accessories: 'Accessories',
    clock: 'Clock',
    calculator: 'Calculator',
    notepad: 'Notepad',
    solitaire: 'Solitaire',
    minesweeper: 'Minesweeper',
    tile: 'Tile',
    cascade: 'Cascade',
    ready: 'Ready',
    comingSoon: 'Coming soon...',
    emptyFolder: '(Empty folder)',
    paint: 'Paint',
    shutdown: 'CLOSING SESSION',
  },
  JP: {
    tagline: 'デザイン & 開発',
    work: 'プロジェクト',
    lab: 'ラボ',
    about: '情報',
    emailCopied: 'メールをコピー',
    file: 'ファイル',
    options: 'オプション',
    window: 'ウィンドウ',
    help: 'ヘルプ',
    exit: '終了',
    language: '言語',
    aboutMenu: 'について...',
    // Win3.1 menu items
    restore: '元に戻す',
    move: '移動',
    size: 'サイズ',
    minimize: '最小化',
    maximize: '最大化',
    close: '閉じる',
    switchTo: '切り替え...',
    // Apps
    apps: 'アプリ',
    games: 'ゲーム',
    accessories: 'アクセサリ',
    clock: '時計',
    calculator: '電卓',
    notepad: 'メモ帳',
    solitaire: 'ソリティア',
    minesweeper: 'マインスイーパ',
    tile: '並べて表示',
    cascade: '重ねて表示',
    ready: '準備完了',
    comingSoon: '近日公開...',
    emptyFolder: '(空のフォルダ)',
    paint: 'ペイント',
    shutdown: 'セッション終了中',
  },
};

// About section content
const aboutContent = {
  EN: {
    bio: 'Developer and electronic music producer based in Lima. Code, sound, design. Founder of SUPERSELF.',
    skills: ['JavaScript', 'React', 'Next.js', 'Node.js', 'Python', 'HTML/CSS', 'Tailwind', 'Git', 'SQL', 'Ableton Live'],
    status: 'Currently available',
    location: 'Lima, Peru',
    email: 'flavio@superself.online',
  },
  ES: {
    bio: 'Desarrollador y productor de musica electronica basado en Lima. Codigo, sonido, diseno. Fundador de SUPERSELF.',
    skills: ['JavaScript', 'React', 'Next.js', 'Node.js', 'Python', 'HTML/CSS', 'Tailwind', 'Git', 'SQL', 'Ableton Live'],
    status: 'Actualmente disponible',
    location: 'Lima, Peru',
    email: 'flavio@superself.online',
  },
  JP: {
    bio: 'リマのデベロッパー、電子音楽プロデューサー。コード、サウンド、デザイン。SUPERSELF創設者。',
    skills: ['JavaScript', 'React', 'Next.js', 'Node.js', 'Python', 'HTML/CSS', 'Tailwind', 'Git', 'SQL', 'Ableton Live'],
    status: '現在対応可能',
    location: 'リマ、ペルー',
    email: 'flavio@superself.online',
  },
};

type Language = 'EN' | 'ES' | 'JP';
type MenuType = 'file' | 'options' | 'window' | 'help' | null;

// DOS block characters for scramble effect
const SCRAMBLE_GLITCH_CHARS = '█▀▄░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌';

// Scramble reveal hook with optional delay for staggered effects
function useScrambleReveal(text: string, trigger: boolean, speed: number = 40, key: number = 0, frames?: number, glitchOnly?: boolean, delay: number = 0) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const chars = glitchOnly ? SCRAMBLE_GLITCH_CHARS : SCRAMBLE_CHARS.base;

  useEffect(() => {
    if (!trigger) {
      setStarted(false);
      setDisplayed('');
      return;
    }

    // Apply delay before starting
    const delayTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(delayTimeout);
  }, [trigger, delay, key]);

  useEffect(() => {
    if (!started) return;

    let frame = 0;
    const maxFrames = frames ?? 18;

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
  }, [text, started, speed, chars, key, frames]);

  return displayed;
}


// Typewriter hook with optional key for re-triggering
function useTypewriter(text: string, trigger: boolean, baseSpeed: number = 25, key: number = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!trigger) {
      setDisplayed('');
      setDone(false);
      return;
    }

    // Reset on key change (language change)
    setDisplayed('');
    setDone(false);

    let index = 0;
    let timeout: NodeJS.Timeout;

    const typeNext = () => {
      if (index >= text.length) {
        setDone(true);
        return;
      }

      const chunk = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 1;
      index = Math.min(index + chunk, text.length);
      setDisplayed(text.slice(0, index));

      let delay = baseSpeed;
      if (Math.random() > 0.9) delay = baseSpeed * 4;
      else if (Math.random() > 0.7) delay = baseSpeed * 0.5;

      timeout = setTimeout(typeNext, delay);
    };

    timeout = setTimeout(typeNext, baseSpeed);
    return () => clearTimeout(timeout);
  }, [text, trigger, baseSpeed, key]);

  return { displayed, done };
}

// Win3.1 Button Component - FLAT 1985 style
function Win31Button({
  children,
  onClick,
  style,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  disabled?: boolean;
}) {
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

// Win3.1 Control Button (minimize, maximize, close) - FLAT 1985 style
function ControlButton({ icon, onClick, disabled }: { icon: string; onClick?: () => void; disabled?: boolean }) {
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

// Win3.1 Menu Separator - FLAT 1985 style
function MenuSeparator() {
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

// Win3.1 Menu Item
function MenuItem({
  label,
  onClick,
  hasSubmenu,
  shortcut,
  disabled,
}: {
  label: string;
  onClick?: () => void;
  hasSubmenu?: boolean;
  shortcut?: string;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  // Underline first character
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

// Win3.1 Desktop Icon - bigger for better visibility
function DesktopIcon({
  label,
  onClick,
  icon,
  show = true,
  delay = 0,
}: {
  label: string;
  onClick?: () => void;
  icon: React.ReactNode;
  show?: boolean;
  delay?: number;
}) {
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

// MS-DOS Executive File Item type
type FileItem = {
  name: string;
  extension: string;
  type: 'dir' | 'exe' | 'txt' | 'lnk';
  action: () => void;
};

// MS-DOS Executive File List Item with retro staggered reveal (no fade, just appear)
function FileListItem({
  item,
  isSelected,
  onSelect,
  onOpen,
  delay = 0,
  show,
}: {
  item: FileItem;
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  delay?: number;
  show: boolean;
}) {
  const [lastClickTime, setLastClickTime] = useState(0);
  const [visible, setVisible] = useState(false);

  // Staggered appearance - instant, no fade (retro cold style)
  useEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [show, delay]);

  const handleClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 300) {
      // Double click
      onOpen();
    } else {
      // Single click
      onSelect();
    }
    setLastClickTime(now);
  };

  // Don't render until visible (instant appear, no animation)
  if (!visible) {
    return (
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: '12px',
          padding: '2px 6px',
          visibility: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {item.name}.{item.extension}
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      style={{
        fontFamily: 'monospace',
        fontSize: '12px',
        padding: '2px 6px',
        backgroundColor: isSelected ? '#000000' : 'transparent',
        color: isSelected ? '#FFFFFF' : '#000000',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
    >
      {item.name}.{item.extension}
    </div>
  );
}

// MS-DOS Executive File List Grid with keyboard navigation and staggered reveal
function FileListGrid({
  files,
  selectedIndex,
  onSelect,
  onOpen,
  columns = 3,
  show,
}: {
  files: FileItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onOpen: (index: number) => void;
  columns?: number;
  show: boolean;
}) {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if an input is focused
      if (document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          onSelect(Math.max(0, selectedIndex - columns));
          break;
        case 'ArrowDown':
          e.preventDefault();
          onSelect(Math.min(files.length - 1, selectedIndex + columns));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onSelect(Math.max(0, selectedIndex - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          onSelect(Math.min(files.length - 1, selectedIndex + 1));
          break;
        case 'Enter':
          e.preventDefault();
          onOpen(selectedIndex);
          break;
      }
    };

    if (show) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, files.length, columns, onSelect, onOpen, show]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(120px, 1fr))`, // Responsive columns
        gap: '2px 16px',
        padding: '16px',
        backgroundColor: '#FFFFFF',
        maxWidth: '100%',
      }}
    >
      {files.map((file, index) => (
        <FileListItem
          key={`${file.name}.${file.extension}`}
          item={file}
          isSelected={index === selectedIndex}
          onSelect={() => onSelect(index)}
          onOpen={() => onOpen(index)}
          delay={index * 60} // Stagger each item by 60ms
          show={show}
        />
      ))}
    </div>
  );
}

// About Dialog labels
const aboutLabels = {
  EN: {
    title: 'About Flavio Manyari',
    tagline: 'Design & Development',
    copyright: 'Copyright (c) 2026',
    stack: 'Stack',
    tools: 'Tools',
    status: 'Status',
    availableForProjects: 'Available for projects',
  },
  ES: {
    title: 'Acerca de Flavio Manyari',
    tagline: 'Diseño & Desarrollo',
    copyright: 'Copyright (c) 2026',
    stack: 'Stack',
    tools: 'Herramientas',
    status: 'Estado',
    availableForProjects: 'Disponible para proyectos',
  },
  JP: {
    title: 'Flavio Manyariについて',
    tagline: 'デザイン & 開発',
    copyright: 'Copyright (c) 2026',
    stack: 'スタック',
    tools: 'ツール',
    status: 'ステータス',
    availableForProjects: 'プロジェクト対応可能',
  },
};

// About Dialog Component - Faithful Win3.1 "About Program Manager" style
function AboutDialog({
  isOpen,
  onClose,
  language,
  colorScheme,
}: {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  colorScheme: ColorScheme;
}) {
  const [showEmailCopied, setShowEmailCopied] = useState(false);
  const [emailToastPos, setEmailToastPos] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);

  const content = aboutContent[language];
  const t = portfolioText[language];
  const labels = aboutLabels[language];

  // Reset position when dialog opens
  useEffect(() => {
    if (isOpen) {
      setPosition(null);
    }
  }, [isOpen]);

  // Drag handlers (mouse + touch)
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dialogRef.current) return;
    const rect = dialogRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      setPosition({
        x: clientX - dragOffset.x,
        y: clientY - dragOffset.y,
      });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragOffset]);

  const handleCopyEmail = async (e: React.MouseEvent) => {
    try {
      await navigator.clipboard.writeText(content.email);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = content.email;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setEmailToastPos({ x: e.clientX, y: e.clientY });
    setShowEmailCopied(true);
    setTimeout(() => setShowEmailCopied(false), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // FM ASCII for logo box - compact version
  const FM_MINI = [
    '█▀▀ █▀▄▀█',
    '█▀  █ ▀ █',
    '▀   ▀   ▀',
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        display: position ? 'block' : 'flex',
        alignItems: position ? undefined : 'center',
        justifyContent: position ? undefined : 'center',
        zIndex: 200,
      }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: WIN31.windowBg,
          border: '1px solid #000000',
          width: '440px',
          maxWidth: '95vw',
          ...(position ? {
            position: 'absolute',
            left: position.x,
            top: position.y,
          } : {}),
        }}
      >
        {/* Titlebar with X on right - uses color scheme */}
        <div
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          style={{
            backgroundColor: colorScheme.titlebar,
            padding: '3px 6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            transition: 'background-color 0.3s ease',
          }}
        >
          <span
            style={{
              color: colorScheme.titleText,
              fontFamily: '"MS Sans Serif", Arial, sans-serif',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            {labels.title}
          </span>
          <ControlButton icon="×" onClick={onClose} />
        </div>

        {/* Content - Grey background like Win3.1 About dialogs */}
        <div style={{ padding: '16px', backgroundColor: WIN31.windowBg }}>
          {/* Top section: Logo box + Name/Info + OK button */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
            {/* Logo box - just FM ASCII - FLAT 1985 style */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #000000',
                minWidth: '90px',
              }}
            >
              {/* FM ASCII only */}
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  lineHeight: 1,
                  color: colorScheme.titlebar,
                  whiteSpace: 'pre',
                  transition: 'color 0.3s ease',
                }}
              >
                {FM_MINI.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>

            {/* Name + Tagline + Copyright (right-aligned info) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div
                style={{
                  fontFamily: '"MS Sans Serif", Arial, sans-serif',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#000000',
                  marginBottom: '2px',
                }}
              >
                Flavio Manyari
              </div>
              <div
                style={{
                  fontFamily: '"MS Sans Serif", Arial, sans-serif',
                  fontSize: '11px',
                  color: '#000000',
                  marginBottom: '2px',
                }}
              >
                {labels.tagline}
              </div>
              <div
                style={{
                  fontFamily: '"MS Sans Serif", Arial, sans-serif',
                  fontSize: '11px',
                  color: '#808080',
                }}
              >
                {labels.copyright}
              </div>
            </div>

            {/* OK Button - Top right like Win3.1 */}
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Win31Button onClick={onClose}>
                OK
              </Win31Button>
            </div>
          </div>

          {/* Bio section */}
          <div
            style={{
              fontFamily: '"MS Sans Serif", Arial, sans-serif',
              fontSize: '11px',
              lineHeight: 1.5,
              color: '#000000',
              marginBottom: '12px',
            }}
          >
            {content.bio}
          </div>

          {/* Separator line - FLAT */}
          <div
            style={{
              height: '1px',
              backgroundColor: '#808080',
              marginBottom: '12px',
            }}
          />

          {/* System info style section - table-like alignment */}
          <div style={{ marginBottom: '12px' }}>
            {/* Stack */}
            <div
              style={{
                display: 'flex',
                fontFamily: '"MS Sans Serif", Arial, sans-serif',
                fontSize: '11px',
                marginBottom: '4px',
              }}
            >
              <span style={{ color: '#808080', minWidth: '80px' }}>{labels.stack}:</span>
              <span style={{ color: '#000000' }}>React, Next.js, TypeScript, Node.js, Python, Tailwind</span>
            </div>
            {/* Tools */}
            <div
              style={{
                display: 'flex',
                fontFamily: '"MS Sans Serif", Arial, sans-serif',
                fontSize: '11px',
                marginBottom: '4px',
              }}
            >
              <span style={{ color: '#808080', minWidth: '80px' }}>{labels.tools}:</span>
              <span style={{ color: '#000000' }}>VS Code, Ableton Live, Git, Vercel</span>
            </div>
            {/* Status */}
            <div
              style={{
                display: 'flex',
                fontFamily: '"MS Sans Serif", Arial, sans-serif',
                fontSize: '11px',
              }}
            >
              <span style={{ color: '#808080', minWidth: '80px' }}>{labels.status}:</span>
              <span style={{ color: '#008000' }}>{labels.availableForProjects}</span>
            </div>
          </div>

          {/* Separator line - FLAT */}
          <div
            style={{
              height: '1px',
              backgroundColor: '#808080',
              marginBottom: '12px',
            }}
          />

          {/* Social buttons row */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '12px',
            }}
          >
            <Win31Button
              onClick={() => window.open('https://github.com/9000fm', '_blank')}
              style={{ padding: '4px 12px' }}
            >
              GitHub
            </Win31Button>
            <Win31Button
              onClick={() => window.open('https://www.instagram.com/manyari___/', '_blank')}
              style={{ padding: '4px 12px' }}
            >
              Instagram
            </Win31Button>
            <Win31Button
              onClick={() => window.open('https://soundcloud.com/superselfmusic', '_blank')}
              style={{ padding: '4px 12px' }}
            >
              SoundCloud
            </Win31Button>
          </div>

          {/* Email with Copy button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: '"MS Sans Serif", Arial, sans-serif',
              fontSize: '11px',
            }}
          >
            <span
              style={{ color: WIN31.titlebar, cursor: 'pointer', textDecoration: 'underline' }}
              onClick={handleCopyEmail}
            >
              {content.email}
            </span>
            <Win31Button onClick={handleCopyEmail} style={{ padding: '2px 8px', minWidth: 'auto', fontSize: '10px' }}>
              Copy
            </Win31Button>
          </div>
        </div>
      </div>

      <Toast message={t.emailCopied} position={emailToastPos} visible={showEmailCopied} />
    </div>
  );
}

// Big ASCII Art - FLAVIO MANYARI (your exact ASCII art, properly escaped)
const BIG_ASCII_FLAVIO = [
  '__/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\__/\\\\\\_________________/\\\\\\\\\\\\\\\\\\_____/\\\\\\________/\\\\\\__/\\\\\\\\\\\\\\\\\\\\\\_______/\\\\\\\\\\\\______',
  ' _\\/\\\\\\///////////__\\/\\\\\\_______________/\\\\\\\\\\\\\\\\\\\\\\\\\\\\__\\/\\\\\\_______\\/\\\\\\_\\/////\\\\\\///______/\\\\\\///\\\\\\____',
  '  _\\/\\\\\\_____________\\/\\\\\\______________/\\\\\\/////////\\\\\\__\\//\\\\\\______/\\\\\\______\\/\\\\\\______/\\\\\\/__\\///\\\\\\__',
  '   _\\/\\\\\\\\\\\\\\\\\\\\\\_____\\/\\\\\\_____________\\/\\\\\\_______\\/\\\\\\__\\//\\\\\\____/\\\\\\_______\\/\\\\\\______/\\\\\\______\\//\\\\\\_',
  '    _\\/\\\\\\///////______\\/\\\\\\_____________\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\___\\//\\\\\\__/\\\\\\________\\/\\\\\\_____\\/\\\\\\_______\\/\\\\\\_',
  '     _\\/\\\\\\_____________\\/\\\\\\_____________\\/\\\\\\/////////\\\\\\____\\//\\\\\\/\\\\\\_________\\/\\\\\\_____\\//\\\\\\______/\\\\\\__',
  '      _\\/\\\\\\_____________\\/\\\\\\_____________\\/\\\\\\_______\\/\\\\\\_____\\//\\\\\\\\\\__________\\/\\\\\\______\\///\\\\\\__/\\\\\\____',
  '       _\\/\\\\\\_____________\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\__\\/\\\\\\_______\\/\\\\\\______\\//\\\\\\________/\\\\\\\\\\\\\\\\\\\\\\_____\\///\\\\\\\\\\/_____',
  '        _\\///______________\\///////////////__\\///________\\///________\\///________\\///////////_______\\/////________',
];

const BIG_ASCII_MANYARI = [
  '__/\\\\\\\\____________/\\\\\\\\_____/\\\\\\\\\\\\\\\\\\_____/\\\\\\\\\\_____/\\\\\\__/\\\\\\________/\\\\\\_____/\\\\\\\\\\\\\\\\\\_______/\\\\\\\\\\\\\\\\\\\\______/\\\\\\\\\\\\\\\\\\\\\\_',
  ' _\\/\\\\\\\\\\\\________/\\\\\\\\\\\\___/\\\\\\\\\\\\\\\\\\\\\\\\\\\\__\\/\\\\\\\\\\\\___\\/\\\\\\_\\///\\\\\\____/\\\\\\/____/\\\\\\\\\\\\\\\\\\\\\\\\\\\\___/\\\\\\///////\\\\\\___\\/////\\\\\\///__',
  '  _\\/\\\\\\//\\\\\\____/\\\\\\//\\\\\\__/\\\\\\/////////\\\\\\__\\/\\\\\\/\\\\\\__\\/\\\\\\___\\///\\\\\\/\\\\\\/______/\\\\\\/////////\\\\\\__\\/\\\\\\_____\\/\\\\\\_______\\/\\\\\\_____',
  '   _\\/\\\\\\\\///\\\\\\/\\\\\\/_\\/\\\\\\__\\/\\\\\\_______\\/\\\\\\__\\/\\\\\\//\\\\\\_\\/\\\\\\_____\\///\\\\\\/______\\/\\\\\\_______\\/\\\\\\__\\/\\\\\\\\\\\\\\\\\\\\\\/________\\/\\\\\\_____',
  '    _\\/\\\\\\__\\///\\\\\\/___\\/\\\\\\__\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\__\\/\\\\\\\\//\\\\\\\\/\\\\\\_______\\/\\\\\\_______\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\__\\/\\\\\\//////\\\\\\________\\/\\\\\\_____',
  '     _\\/\\\\\\____\\///_____\\/\\\\\\__\\/\\\\\\/////////\\\\\\__\\/\\\\\\_\\//\\\\\\/\\\\\\_______\\/\\\\\\_______\\/\\\\\\/////////\\\\\\__\\/\\\\\\____\\//\\\\\\_______\\/\\\\\\_____',
  '      _\\/\\\\\\_____________\\/\\\\\\__\\/\\\\\\_______\\/\\\\\\__\\/\\\\\\__\\//\\\\\\\\\\\\_______\\/\\\\\\_______\\/\\\\\\_______\\/\\\\\\__\\/\\\\\\_____\\//\\\\\\______\\/\\\\\\_____',
  '       _\\/\\\\\\_____________\\/\\\\\\__\\/\\\\\\_______\\/\\\\\\__\\/\\\\\\___\\//\\\\\\\\\\_______\\/\\\\\\_______\\/\\\\\\_______\\/\\\\\\__\\/\\\\\\______\\//\\\\\\__/\\\\\\\\\\\\\\\\\\\\\\_',
  '        _\\///______________\\///__\\///________\\///__\\///_____\\/////________\\///________\\///________\\///__\\///________\\///__\\///////////__',
];

// Compact FM ASCII for after intro (SMALL version)
const FM_COMPACT = [
  '█▀▀ █▀▄▀█',
  '█▀  █ ▀ █',
  '▀   ▀   ▀',
];

// FM ASCII OPTIONS - Pick one!

// OPTION A: Block style (medium)
const FM_OPTION_A = [
  '█████  █   █',
  '█      ██ ██',
  '████   █ █ █',
  '█      █   █',
  '█      █   █',
];

// OPTION B: Filled blocks (larger)
const FM_OPTION_B = [
  '██████╗   ███╗   ███╗',
  '██╔═══╝   ████╗ ████║',
  '█████╗    ██╔████╔██║',
  '██╔══╝    ██║╚██╔╝██║',
  '██║       ██║ ╚═╝ ██║',
  '╚═╝       ╚═╝     ╚═╝',
];

// OPTION C: Dotted/Braille style
const FM_OPTION_C = [
  '⣿⣿⣿⣿⣿⣿  ⣿⣿⣿   ⣿⣿⣿',
  '⣿⣿          ⣿⣿⣿⣿ ⣿⣿⣿⣿',
  '⣿⣿⣿⣿⣿    ⣿⣿ ⣿⣿ ⣿⣿',
  '⣿⣿          ⣿⣿  ⣿  ⣿⣿',
  '⣿⣿          ⣿⣿     ⣿⣿',
];

// OPTION D: Simple hash blocks (very readable)
const FM_OPTION_D = [
  '######    ##   ##',
  '##        ### ###',
  '#####     ## # ##',
  '##        ##   ##',
  '##        ##   ##',
];

// OPTION E: Slashes and pipes (more characters, ASCII only)
const FM_OPTION_E = [
  '/======\\    /\\      /\\',
  '||          ||\\\\  //||',
  '||====      || \\\\// ||',
  '||          ||  \\/  ||',
  '||          ||      ||',
];

// CURRENT SELECTION (change this to use different option)
const FM_BIG = FM_OPTION_B;

type AsciiPhase = 'waiting' | 'entering' | 'rainbow' | 'complete' | 'fading' | 'done';

// Rainbow colors for celebration
const RAINBOW_COLORS = [
  '#FF0000', '#FF7F00', '#FFFF00', '#00FF00',
  '#0000FF', '#4B0082', '#9400D3', '#FF1493',
];

function BigAsciiIntro({
  show,
  onComplete,
}: {
  show: boolean;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<AsciiPhase>('waiting');
  const [revealedChars, setRevealedChars] = useState<Set<string>>(new Set());
  const [colorOffset, setColorOffset] = useState(0);

  // Full ASCII combining both lines
  const FULL_ASCII = [...BIG_ASCII_FLAVIO, '', ...BIG_ASCII_MANYARI];

  useEffect(() => {
    if (!show) {
      setPhase('waiting');
      setRevealedChars(new Set());
      setColorOffset(0);
      return;
    }

    // Collect all non-space characters with positions
    const allChars: { line: number; col: number }[] = [];
    FULL_ASCII.forEach((line, lineIdx) => {
      line.split('').forEach((char, colIdx) => {
        if (char !== ' ' && char !== '') {
          allChars.push({ line: lineIdx, col: colIdx });
        }
      });
    });

    // Sort by line (typewriter style - line by line, left to right)
    allChars.sort((a, b) => {
      if (a.line !== b.line) return a.line - b.line;
      return a.col - b.col;
    });

    const timers: NodeJS.Timeout[] = [];
    const intervals: NodeJS.Timeout[] = [];

    // Start entering phase
    const startTimer = setTimeout(() => {
      setPhase('entering');

      // Reveal characters with typewriter timing
      const charDelay = 1;
      allChars.forEach((pos, idx) => {
        const timer = setTimeout(() => {
          setRevealedChars((prev) => {
            const newSet = new Set(prev);
            newSet.add(`${pos.line}-${pos.col}`);
            return newSet;
          });
        }, idx * charDelay);
        timers.push(timer);
      });

      // Let it breathe - pause after typing completes before rainbow
      const rainbowTimer = setTimeout(() => {
        setPhase('rainbow');
        // Cycle colors smoothly
        const colorInterval = setInterval(() => {
          setColorOffset(o => o + 1);
        }, 80); // Faster cycling
        intervals.push(colorInterval);
      }, allChars.length * charDelay + 600);
      timers.push(rainbowTimer);

      // Stay in rainbow longer, then fade while still rainbow (no black phase)
      const fadeTimer = setTimeout(() => {
        setPhase('fading'); // Rainbow continues during fade
      }, allChars.length * charDelay + 5000); // Rainbow for ~4.4 seconds
      timers.push(fadeTimer);

      // Notify parent when done - clear intervals
      const doneTimer = setTimeout(() => {
        intervals.forEach(i => clearInterval(i));
        setPhase('done');
        onComplete();
      }, allChars.length * charDelay + 6500); // 1.5s fade duration
      timers.push(doneTimer);
    }, 300);
    timers.push(startTimer);

    return () => {
      timers.forEach((t) => clearTimeout(t));
      intervals.forEach((i) => clearInterval(i));
    };
  }, [show, onComplete]);

  if (phase === 'done' || !show) return null;

  // Color based on position - creates wave effect during rainbow and fading phases
  const getCharColor = (lineIdx: number, colIdx: number) => {
    if (phase === 'rainbow' || phase === 'fading') {
      const idx = (lineIdx * 3 + colIdx + colorOffset) % RAINBOW_COLORS.length;
      return RAINBOW_COLORS[idx];
    }
    // Black text during typing
    return '#000000';
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: MSDOS.white,  // White background
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        opacity: phase === 'fading' ? 0 : 1,
        transition: 'opacity 1.2s ease-out',
        overflow: 'hidden',
        padding: '20px',
      }}
    >
      <div
        style={{
          fontFamily: '"Courier New", Courier, "Lucida Console", monospace',
          fontSize: 'clamp(0.1rem, 0.38vw, 0.35rem)', // Even smaller for mobile fit
          lineHeight: 1.0,
          textAlign: 'left',
          whiteSpace: 'pre',
          letterSpacing: '-0.03em',
          transform: phase === 'fading' ? 'scale(0.9)' : 'scale(1)',
          transition: 'transform 0.8s ease-out, opacity 1.2s ease-out',
          maxWidth: '98vw',
          overflow: 'hidden',
        }}
      >
        {FULL_ASCII.map((line, lineIndex) => (
          <div key={lineIndex} style={{ height: line === '' ? '0.5em' : 'auto' }}>
            {line.split('').map((char, charIndex) => {
              const isRevealed = char === ' ' || revealedChars.has(`${lineIndex}-${charIndex}`);
              return (
                <span
                  key={charIndex}
                  style={{
                    display: 'inline-block',
                    opacity: isRevealed ? 1 : 0,
                    color: getCharColor(lineIndex, charIndex),
                    transform: isRevealed ? 'scale(1)' : 'scale(0)',
                    transition: phase === 'rainbow' ? 'color 0.05s linear' : 'transform 0.05s ease-out, opacity 0.03s ease-out',
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// FM ASCII logo for main content area - using FM_BIG (Option B)
function FmLogo({ show }: { show: boolean }) {
  return (
    <div
      style={{
        fontFamily: '"Courier New", Courier, "Lucida Console", monospace',
        fontSize: 'clamp(0.6rem, 1.5vw, 1rem)', // Bigger for mobile
        lineHeight: 1.0,
        color: '#000000', // Pure black for code-like aesthetic
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

// Rotating wireframe cube with proper 3D projection
function RotatingCube({ show, delay = 0 }: { show: boolean; delay?: number }) {
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
  const edges = [
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
    let x = v[0] * cosY - v[2] * sinY;
    let z = v[0] * sinY + v[2] * cosY;
    let y = v[1];
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

// Rotating wireframe sphere - simple parallels rotating sideways
function RotatingSphere({ show, delay = 0 }: { show: boolean; delay?: number }) {
  const [visible, setVisible] = useState(false);
  const [angle, setAngle] = useState(0);

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
      setAngle(a => (a + 1) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  const rad = (angle * Math.PI) / 180;
  const cx = 50, cy = 50;
  const radius = 38;

  // Single rotating vertical meridian (gives the spinning effect)
  const meridianRx = Math.abs(Math.cos(rad)) * radius;

  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      {/* Outer circle */}
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" />

      {/* Horizontal parallels (latitude lines) - static */}
      {[-0.6, -0.3, 0, 0.3, 0.6].map((t, i) => {
        const y = cy + t * radius;
        const latRadius = Math.sqrt(1 - t * t) * radius;
        return (
          <ellipse
            key={`lat-${i}`}
            cx={cx}
            cy={y}
            rx={latRadius}
            ry={latRadius * 0.15}
            fill="none"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="1"
          />
        );
      })}

      {/* Single rotating meridian - creates the spinning effect */}
      {meridianRx > 3 && (
        <ellipse
          cx={cx}
          cy={cy}
          rx={meridianRx}
          ry={radius}
          fill="none"
          stroke="rgba(0,0,0,0.4)"
          strokeWidth="1"
        />
      )}

      {/* Center equator ellipse */}
      <ellipse cx={cx} cy={cy} rx={radius} ry={radius * 0.25} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
    </svg>
  );
}

// Main Portfolio Page
// Group Window Component (for Games/Accessories folders)
function GroupWindow({
  title,
  onClose,
  items,
}: {
  title: string;
  onClose: () => void;
  items: { label: string; icon: string; onClick: () => void }[];
}) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Drag handlers (mouse + touch)
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!windowRef.current) return;
    const rect = windowRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      setPosition({
        x: clientX - dragOffset.x,
        y: clientY - dragOffset.y,
      });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        display: position ? 'block' : 'flex',
        alignItems: position ? undefined : 'center',
        justifyContent: position ? undefined : 'center',
        zIndex: 150,
      }}
      onClick={onClose}
    >
      <div
        ref={windowRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: WIN31.windowBg,
          border: '1px solid #000000',
          minWidth: '280px',
          ...(position ? {
            position: 'absolute',
            left: position.x,
            top: position.y,
          } : {}),
        }}
      >
        {/* Titlebar - FLAT 1985 style */}
        <div
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          style={{
            backgroundColor: WIN31.titlebar,
            padding: '2px 4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            borderBottom: '1px solid #000000',
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
          <button
            onClick={onClose}
            style={{
              width: '16px',
              height: '14px',
              backgroundColor: '#C0C0C0',
              border: '1px solid #000000',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            x
          </button>
        </div>

        {/* Content - Icons grid */}
        <div
          style={{
            padding: '20px',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
            maxWidth: '400px',
          }}
        >
          {items.map((item) => (
            <div
              key={item.label}
              onClick={item.onClick}
              className="group-window-item"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '8px',
                width: '64px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#000080';
                // Set all text to white
                const allText = e.currentTarget.querySelectorAll('span, div');
                allText.forEach(el => {
                  (el as HTMLElement).style.color = '#FFFFFF';
                });
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                // Reset text to black
                const allText = e.currentTarget.querySelectorAll('span, div');
                allText.forEach(el => {
                  (el as HTMLElement).style.color = '#000000';
                });
              }}
            >
              <div style={{ fontSize: '24px', lineHeight: 1, color: '#000000' }}>{item.icon}</div>
              <span
                style={{
                  fontFamily: '"MS Sans Serif", Arial, sans-serif',
                  fontSize: '11px',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  color: '#000000',
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Placeholder Window for Projects/Lab (Coming Soon)
function PlaceholderWindow({
  title,
  onClose,
  message,
}: {
  title: string;
  onClose: () => void;
  message: string;
}) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(true);
  const windowRef = useRef<HTMLDivElement>(null);

  // Opening animation
  useEffect(() => {
    const timer = setTimeout(() => setIsOpening(false), 150);
    return () => clearTimeout(timer);
  }, []);

  // Drag handlers (mouse + touch)
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!windowRef.current) return;
    const rect = windowRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      setPosition({
        x: clientX - dragOffset.x,
        y: clientY - dragOffset.y,
      });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragOffset]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 150);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        display: position ? 'block' : 'flex',
        alignItems: position ? undefined : 'center',
        justifyContent: position ? undefined : 'center',
        zIndex: 150,
      }}
      onClick={handleClose}
    >
      <div
        ref={windowRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: WIN31.windowBg,
          border: '1px solid #000000',
          minWidth: '300px',
          transform: isOpening || isClosing ? 'scale(0.8)' : 'scale(1)',
          opacity: isOpening || isClosing ? 0 : 1,
          transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
          ...(position ? {
            position: 'absolute',
            left: position.x,
            top: position.y,
          } : {}),
        }}
      >
        {/* Titlebar - FLAT 1985 style */}
        <div
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          style={{
            backgroundColor: WIN31.titlebar,
            padding: '2px 4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            borderBottom: '1px solid #000000',
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
          <button
            onClick={handleClose}
            style={{
              width: '16px',
              height: '14px',
              backgroundColor: '#C0C0C0',
              border: '1px solid #000000',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            x
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: '40px 30px',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          {/* Folder icon */}
          <div style={{ fontSize: '32px' }}>📁</div>
          <span
            style={{
              fontFamily: '"MS Sans Serif", Arial, sans-serif',
              fontSize: '12px',
              color: '#808080',
              textAlign: 'center',
            }}
          >
            {message}
          </span>
        </div>
      </div>
    </div>
  );
}

// Color scheme type
type ColorScheme = {
  titlebar: string;
  titleText: string;
  menu: string;
  status: string;
  background: string;
};

// MS-DOS Executive inspired color schemes - bold, retro combinations
// Inspired by: #ffb000 (orange), #ff4200 (red), #7da030 (olive), #ff99cc (pink), #1d1d1b (dark), #f2f2e7 (cream)
const COLOR_SCHEMES: ColorScheme[] = [
  // Classic Navy (but rare)
  { titlebar: '#000080', titleText: '#FFFFFF', menu: '#C0C0C0', status: '#C0C0C0', background: '#1d1d1b' },
  // Hot Orange
  { titlebar: '#ff4200', titleText: '#FFFFFF', menu: '#f2f2e7', status: '#f2f2e7', background: '#1d1d1b' },
  // Golden
  { titlebar: '#ffb000', titleText: '#000000', menu: '#f2f2e7', status: '#f2f2e7', background: '#1d1d1b' },
  // Olive Green
  { titlebar: '#7da030', titleText: '#FFFFFF', menu: '#f2f2e7', status: '#f2f2e7', background: '#1d1d1b' },
  // Hot Pink
  { titlebar: '#ff99cc', titleText: '#000000', menu: '#f2f2e7', status: '#f2f2e7', background: '#1d1d1b' },
  // Deep Purple
  { titlebar: '#800080', titleText: '#FFFFFF', menu: '#C0C0C0', status: '#C0C0C0', background: '#1d1d1b' },
  // Burgundy
  { titlebar: '#800000', titleText: '#FFFFFF', menu: '#f2f2e7', status: '#f2f2e7', background: '#1d1d1b' },
  // Crimson
  { titlebar: '#DC143C', titleText: '#FFFFFF', menu: '#f2f2e7', status: '#f2f2e7', background: '#1d1d1b' },
  // Coral
  { titlebar: '#FF6347', titleText: '#000000', menu: '#f2f2e7', status: '#f2f2e7', background: '#1d1d1b' },
  // Amber
  { titlebar: '#FFBF00', titleText: '#000000', menu: '#f2f2e7', status: '#f2f2e7', background: '#1d1d1b' },
  // Forest
  { titlebar: '#228B22', titleText: '#FFFFFF', menu: '#f2f2e7', status: '#f2f2e7', background: '#1d1d1b' },
  // Indigo
  { titlebar: '#4B0082', titleText: '#FFFFFF', menu: '#C0C0C0', status: '#C0C0C0', background: '#1d1d1b' },
  // Slate Dark
  { titlebar: '#1d1d1b', titleText: '#f2f2e7', menu: '#f2f2e7', status: '#f2f2e7', background: '#ffb000' },
  // Inverted Orange
  { titlebar: '#1d1d1b', titleText: '#ffb000', menu: '#f2f2e7', status: '#f2f2e7', background: '#ff4200' },
  // Cream on Pink
  { titlebar: '#ff99cc', titleText: '#1d1d1b', menu: '#f2f2e7', status: '#f2f2e7', background: '#7da030' },
];

// Get a random scheme - avoiding the boring ones (navy, teal, grey) as first picks
function generateRandomScheme(): ColorScheme {
  // Skip index 0 (navy) on first generation to avoid common boring colors
  const startIndex = 1;
  const index = startIndex + Math.floor(Math.random() * (COLOR_SCHEMES.length - startIndex));
  return COLOR_SCHEMES[index];
}

// Initial default scheme
const DEFAULT_SCHEME: ColorScheme = {
  titlebar: '#000080',
  titleText: '#FFFFFF',
  menu: '#C0C0C0',
  status: '#C0C0C0',
  background: '#008080',
};

// App components map
const APP_COMPONENTS: Record<string, React.ComponentType> = {
  clock: Clock,
  calculator: Calculator,
  notepad: Notepad,
  minesweeper: Minesweeper,
  solitaire: Solitaire,
  paint: Paint,
};

// App window sizes
const APP_SIZES: Record<string, { width: number; height: number }> = {
  clock: { width: 220, height: 280 },
  calculator: { width: 200, height: 320 },
  notepad: { width: 450, height: 350 },
  minesweeper: { width: 480, height: 380 },
  solitaire: { width: 520, height: 450 },
  paint: { width: 520, height: 420 },
};

export default function PortfolioPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<Language>('ES');
  const [aboutOpen, setAboutOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);
  const [showLangSubmenu, setShowLangSubmenu] = useState(false);
  const [showBigAscii, setShowBigAscii] = useState(true);
  const [showWindow, setShowWindow] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [scrambleKey, setScrambleKey] = useState(0);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showAppsGroup, setShowAppsGroup] = useState(false);
  const [activeSection, setActiveSection] = useState<'projects' | 'lab' | null>(null);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [shutdownText, setShutdownText] = useState('');
  const [shutdownDots, setShutdownDots] = useState('');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => generateRandomScheme());
  // Window drag state
  const [windowPosition, setWindowPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Window manager for apps
  const windowManager = useWindowManager();

  const t = portfolioText[language];
  const [showRest, setShowRest] = useState(false);

  // Current color scheme
  const currentScheme = colorScheme;

  // Generate random color scheme
  const cycleColorScheme = () => {
    setColorScheme(generateRandomScheme());
  };

  // Open app helper
  const openApp = (appId: string, title: string) => {
    windowManager.openWindow(appId, title);
  };

  // Window drag handlers
  const handleWindowDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!windowRef.current) return;
    const rect = windowRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      setWindowPosition({
        x: clientX - dragOffset.x,
        y: clientY - dragOffset.y,
      });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragOffset]);

  // Status bar text scrambles on language change
  const readyLabel = useScrambleReveal(t.ready, showRest, 30, scrambleKey, 15);

  // Handle language change
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setScrambleKey((k) => k + 1);
    setActiveMenu(null);
    setShowLangSubmenu(false);
    setShowLangDropdown(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
        setShowLangSubmenu(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Callback when big ASCII intro completes
  const handleAsciiComplete = useCallback(() => {
    setShowBigAscii(false);
    // Window appears instantly, then content fades in
    setShowWindow(true);
    setTimeout(() => setShowContent(true), 100);
    setTimeout(() => setShowRest(true), 800);
  }, []);

  // Initial mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle exit - dramatic shutdown animation before navigating to SUPERSELF.ONLINE
  const handleExit = useCallback(() => {
    if (isShuttingDown) return; // Prevent double-click
    setIsShuttingDown(true);
    setShutdownText('');
    setShutdownDots('');

    const text = t.shutdown;
    let charIndex = 0;

    // Type out shutdown text character by character
    const typeInterval = setInterval(() => {
      if (charIndex < text.length) {
        setShutdownText(text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);

        // Animate dots: . .. ... . .. ...
        let dotCount = 0;
        let cycles = 0;
        const dotsInterval = setInterval(() => {
          dotCount++;
          if (dotCount > 3) {
            dotCount = 1;
            cycles++;
          }
          setShutdownDots('.'.repeat(dotCount));
          if (cycles >= 2 && dotCount === 3) {
            clearInterval(dotsInterval);
            // Navigate after animation completes
            setTimeout(() => {
              router.push('/?skip=1');
            }, 500);
          }
        }, 350);
      }
    }, 60);
  }, [isShuttingDown, t.shutdown, router]);

  const handleAboutClose = useCallback(() => {
    setAboutOpen(false);
  }, []);

  // MS-DOS Executive file listing - organized: ABOUT first, then folders, then apps folder, then exit link
  const portfolioFiles: FileItem[] = [
    { name: 'ABOUT', extension: 'TXT', type: 'txt', action: () => setAboutOpen(true) },
    { name: 'PROJECTS', extension: 'DIR', type: 'dir', action: () => setActiveSection('projects') },
    { name: 'LAB', extension: 'DIR', type: 'dir', action: () => setActiveSection('lab') },
    { name: 'APPS', extension: 'DIR', type: 'dir', action: () => setShowAppsGroup(true) },
    { name: 'SUPERSELF', extension: 'ONLINE', type: 'lnk', action: handleExit },
  ];

  if (!mounted) return null;

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: currentScheme.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Big ASCII Intro */}
      <BigAsciiIntro show={showBigAscii} onComplete={handleAsciiComplete} />

      {/* Wireframe 3D Scene on desktop background */}
      <WireframeScene show={showWindow && !showBigAscii} />

      {/* Main Window - FLAT 1985 style - Draggable */}
      <div
        ref={windowRef}
        style={{
          backgroundColor: MSDOS.white,
          border: '1px solid #000000',
          width: '100%',
          maxWidth: '700px',
          opacity: showWindow ? 1 : 0,
          visibility: showWindow ? 'visible' : 'hidden',
          ...(windowPosition ? {
            position: 'absolute',
            left: windowPosition.x,
            top: windowPosition.y,
          } : {}),
        }}
      >
        {/* Titlebar - Uses color scheme - Draggable */}
        <div
          onMouseDown={handleWindowDragStart}
          onTouchStart={handleWindowDragStart}
          style={{
            backgroundColor: currentScheme.titlebar,
            color: currentScheme.titleText,
            borderBottom: '2px solid #000000',
            padding: '6px 8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'background-color 0.3s ease',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Window icon - simple ASCII style */}
            <span style={{
              fontFamily: 'monospace',
              fontSize: '14px',
              fontWeight: 'bold',
              color: currentScheme.titleText,
            }}>
              [=]
            </span>
            <span
              style={{
                color: currentScheme.titleText,
                fontFamily: '"MS Sans Serif", Arial, sans-serif',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              Flavio Manyari
            </span>
          </div>
          <div style={{ display: 'flex', gap: '3px' }}>
            <ControlButton icon="−" disabled />
            <ControlButton icon="□" disabled />
            <ControlButton icon="×" disabled />
          </div>
        </div>

        {/* Menu Bar - Uses color scheme */}
        <div
          ref={menuRef}
          style={{
            backgroundColor: currentScheme.menu,
            borderBottom: '2px solid #000000',
            padding: '4px 0',
            display: 'flex',
            position: 'relative',
            transition: 'background-color 0.3s ease',
          }}
        >
          {/* File Menu */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
              style={{
                padding: '2px 10px',
                fontFamily: '"MS Sans Serif", Arial, sans-serif',
                fontSize: '12px',
                cursor: 'pointer',
                color: '#000000',
                ...(activeMenu === 'file' ? MSDOS.menuSelected : {}),
              }}
            >
              <span style={{ textDecoration: 'underline' }}>{t.file[0]}</span>{t.file.slice(1)}
            </div>
            {activeMenu === 'file' && (
              <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: MSDOS.white, border: '1px solid #000', zIndex: 100 }}>
                <MenuItem label={t.restore} disabled />
                <MenuItem label={t.move} disabled />
                <MenuItem label={t.size} disabled />
                <MenuItem label={t.minimize} disabled />
                <MenuItem label={t.maximize} disabled />
                <MenuSeparator />
                <MenuItem label={t.close} shortcut="Alt+F4" disabled />
                <MenuSeparator />
                <MenuItem label={t.switchTo} shortcut="Ctrl+Esc" disabled />
              </div>
            )}
          </div>

          {/* Options Menu */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => {
                setActiveMenu(activeMenu === 'options' ? null : 'options');
                setShowLangSubmenu(false);
              }}
              style={{
                padding: '2px 10px',
                fontFamily: '"MS Sans Serif", Arial, sans-serif',
                fontSize: '12px',
                cursor: 'pointer',
                color: '#000000',
                ...(activeMenu === 'options' ? MSDOS.menuSelected : {}),
              }}
            >
              <span style={{ textDecoration: 'underline' }}>{t.options[0]}</span>{t.options.slice(1)}
            </div>
            {activeMenu === 'options' && (
              <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: MSDOS.white, border: '1px solid #000', zIndex: 100 }}>
                <div
                  onMouseEnter={() => setShowLangSubmenu(true)}
                  style={{ position: 'relative' }}
                >
                  <MenuItem label={t.language} hasSubmenu />
                  {showLangSubmenu && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '100%',
                        backgroundColor: MSDOS.white,
                        border: '1px solid #000',
                      }}
                    >
                      <MenuItem
                        label={`${language === 'ES' ? '> ' : '  '}Espanol`}
                        onClick={() => handleLanguageChange('ES')}
                      />
                      <MenuItem
                        label={`${language === 'EN' ? '> ' : '  '}English`}
                        onClick={() => handleLanguageChange('EN')}
                      />
                      <MenuItem
                        label={`${language === 'JP' ? '> ' : '  '}日本語`}
                        onClick={() => handleLanguageChange('JP')}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Window Menu */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setActiveMenu(activeMenu === 'window' ? null : 'window')}
              style={{
                padding: '2px 10px',
                fontFamily: '"MS Sans Serif", Arial, sans-serif',
                fontSize: '12px',
                cursor: 'pointer',
                color: '#000000',
                ...(activeMenu === 'window' ? MSDOS.menuSelected : {}),
              }}
            >
              <span style={{ textDecoration: 'underline' }}>{t.window[0]}</span>{t.window.slice(1)}
            </div>
            {activeMenu === 'window' && (
              <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: MSDOS.white, border: '1px solid #000', zIndex: 100 }}>
                <MenuItem label={t.tile} />
                <MenuItem label={t.cascade} />
              </div>
            )}
          </div>

          {/* Help Menu */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setActiveMenu(activeMenu === 'help' ? null : 'help')}
              style={{
                padding: '2px 10px',
                fontFamily: '"MS Sans Serif", Arial, sans-serif',
                fontSize: '12px',
                cursor: 'pointer',
                color: '#000000',
                ...(activeMenu === 'help' ? MSDOS.menuSelected : {}),
              }}
            >
              <span style={{ textDecoration: 'underline' }}>{t.help[0]}</span>{t.help.slice(1)}
            </div>
            {activeMenu === 'help' && (
              <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: MSDOS.white, border: '1px solid #000', zIndex: 100 }}>
                <MenuItem
                  label={t.aboutMenu}
                  onClick={() => {
                    setAboutOpen(true);
                    setActiveMenu(null);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Content Area - No sidebars (MS-DOS Executive style) */}
        <div
          style={{
            backgroundColor: MSDOS.white,
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden', // Keep app windows inside
          }}
        >
          {/* Main Content - File Listing */}
          <div
            style={{
              flex: 1,
              padding: '8px 0',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* FM Logo with rotating cube - left aligned with icons */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: '20px 16px 24px 16px',
              gap: '12px',
            }}>
              <FmLogo show={showContent} />
              <div style={{ transform: 'scale(0.6)', transformOrigin: 'left center' }}>
                <RotatingCube show={showContent} delay={0} />
              </div>
            </div>

            {/* Desktop Icons - ASCII style with staggered appearance */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 'clamp(16px, 4vw, 40px)',
                padding: '16px',
              }}
            >
              <DesktopIcon
                label="ABOUT"
                onClick={() => setAboutOpen(true)}
                icon={<span style={{ fontFamily: 'monospace', fontSize: '22px' }}>[?]</span>}
                show={showRest}
                delay={0}
              />
              <DesktopIcon
                label="PROJECTS"
                onClick={() => setActiveSection('projects')}
                icon={<span style={{ fontFamily: 'monospace', fontSize: '22px' }}>[ ]</span>}
                show={showRest}
                delay={80}
              />
              <DesktopIcon
                label="LAB"
                onClick={() => setActiveSection('lab')}
                icon={<span style={{ fontFamily: 'monospace', fontSize: '22px' }}>&lt;/&gt;</span>}
                show={showRest}
                delay={160}
              />
              <DesktopIcon
                label="APPS"
                onClick={() => setShowAppsGroup(true)}
                icon={<span style={{ fontFamily: 'monospace', fontSize: '22px' }}>:::</span>}
                show={showRest}
                delay={240}
              />
              <DesktopIcon
                label="SUPERSELF"
                onClick={handleExit}
                icon={<span style={{ fontFamily: 'monospace', fontSize: '22px' }}>S_</span>}
                show={showRest}
                delay={320}
              />
              {/* Color scheme button as an icon */}
              <DesktopIcon
                label="COLORS"
                onClick={cycleColorScheme}
                icon={<span style={{ fontFamily: 'monospace', fontSize: '22px' }}>[@]</span>}
                show={showRest}
                delay={400}
              />
            </div>

            {/* App Windows - rendered INSIDE the content area */}
            {Array.from(windowManager.windows.values()).map((win) => {
              const AppComponent = APP_COMPONENTS[win.id];
              if (!AppComponent || !win.isOpen) return null;

              const appSize = APP_SIZES[win.id] || { width: 400, height: 300 };

              return (
                <Win31Window
                  key={win.id}
                  id={win.id}
                  title={win.title}
                  isOpen={win.isOpen}
                  isMinimized={win.isMinimized}
                  isMaximized={win.isMaximized}
                  position={win.position}
                  size={appSize}
                  zIndex={win.zIndex + 50}
                  onClose={() => windowManager.closeWindow(win.id)}
                  onMinimize={() => windowManager.minimizeWindow(win.id)}
                  onMaximize={() => windowManager.maximizeWindow(win.id)}
                  onRestore={() => windowManager.restoreWindow(win.id)}
                  onFocus={() => windowManager.focusWindow(win.id)}
                  onMove={(pos) => windowManager.moveWindow(win.id, pos)}
                >
                  <AppComponent />
                </Win31Window>
              );
            })}
          </div>
        </div>

        {/* Status Bar - Uses color scheme */}
        <div
          style={{
            backgroundColor: currentScheme.status,
            color: '#000000',
            padding: '2px 8px',
            border: '1px solid #000000',
            fontFamily: '"MS Sans Serif", Arial, sans-serif',
            fontSize: '11px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'background-color 0.3s ease',
          }}
        >
          <span style={{ fontFamily: 'monospace' }}>A:\PORTFOLIO\</span>
          {/* Language Dropdown */}
          <div ref={langDropdownRef} style={{ position: 'relative' }}>
            <div
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              style={{
                padding: '1px 6px',
                cursor: 'pointer',
                backgroundColor: showLangDropdown ? MSDOS.selectionBg : MSDOS.white,
                color: showLangDropdown ? MSDOS.textInverse : MSDOS.black,
                border: '1px solid #000',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>{language}</span>
              <span style={{ fontSize: '8px' }}>▼</span>
            </div>
            {showLangDropdown && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  right: 0,
                  marginBottom: '2px',
                  backgroundColor: MSDOS.white,
                  border: '1px solid #000',
                  zIndex: 100,
                }}
              >
                {(['JP', 'EN', 'ES'] as Language[])
                  .filter((lang) => lang !== language)
                  .map((lang) => (
                    <div
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      style={{
                        padding: '4px 12px',
                        cursor: 'pointer',
                        fontFamily: '"MS Sans Serif", Arial, sans-serif',
                        fontSize: '11px',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = MSDOS.blue;
                        e.currentTarget.style.color = MSDOS.white;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = MSDOS.white;
                        e.currentTarget.style.color = MSDOS.black;
                      }}
                    >
                      {lang}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shutdown Overlay */}
      {isShuttingDown && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#000080',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              fontFamily: '"MS Sans Serif", Arial, sans-serif',
              color: '#FFFFFF',
              fontSize: 'clamp(1.4rem, 4vw, 2rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {shutdownText}{shutdownDots}<span className="blink">_</span>
          </div>
        </div>
      )}

      {/* About Dialog */}
      <AboutDialog isOpen={aboutOpen} onClose={handleAboutClose} language={language} colorScheme={currentScheme} />

      {/* Projects Window */}
      {activeSection === 'projects' && (
        <PlaceholderWindow
          title={t.work}
          onClose={() => setActiveSection(null)}
          message={t.comingSoon}
        />
      )}

      {/* Lab Window */}
      {activeSection === 'lab' && (
        <PlaceholderWindow
          title={t.lab}
          onClose={() => setActiveSection(null)}
          message={t.comingSoon}
        />
      )}

      {/* Apps Group Window */}
      {showAppsGroup && (
        <GroupWindow
          title={t.apps}
          onClose={() => setShowAppsGroup(false)}
          items={[
            { label: t.clock, icon: '🕐', onClick: () => { openApp('clock', t.clock); setShowAppsGroup(false); } },
            { label: t.calculator, icon: '🔢', onClick: () => { openApp('calculator', t.calculator); setShowAppsGroup(false); } },
            { label: t.notepad, icon: '📝', onClick: () => { openApp('notepad', t.notepad); setShowAppsGroup(false); } },
            { label: t.paint, icon: '🎨', onClick: () => { openApp('paint', t.paint); setShowAppsGroup(false); } },
            { label: t.solitaire, icon: '🃏', onClick: () => { openApp('solitaire', t.solitaire); setShowAppsGroup(false); } },
            { label: t.minesweeper, icon: '💣', onClick: () => { openApp('minesweeper', t.minesweeper); setShowAppsGroup(false); } },
          ]}
        />
      )}

      {/* App Windows are now rendered inside the main window content area */}

      {/* Minimized Windows (Win 3.1 style desktop icons at bottom) */}
      {windowManager.getMinimizedWindows().length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            zIndex: 1000,
          }}
        >
          {windowManager.getMinimizedWindows().map((win) => {
            // Get icon for each app type
            const getAppIcon = (id: string): string => {
              switch (id) {
                case 'clock': return '🕐';
                case 'calculator': return '🔢';
                case 'notepad': return '📝';
                case 'paint': return '🎨';
                case 'solitaire': return '🃏';
                case 'minesweeper': return '💣';
                default: return '📁';
              }
            };

            return (
              <div
                key={win.id}
                onClick={() => windowManager.restoreWindow(win.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '64px',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                {/* Icon box - FLAT 1985 style */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#C0C0C0',
                    border: '1px solid #000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '4px',
                    fontSize: '18px',
                  }}
                >
                  {getAppIcon(win.id)}
                </div>
                {/* Icon label */}
                <span
                  style={{
                    fontFamily: '"MS Sans Serif", Arial, sans-serif',
                    fontSize: '10px',
                    color: '#000000',
                    textAlign: 'center',
                    maxWidth: '64px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    backgroundColor: '#C0C0C0',
                    padding: '1px 3px',
                  }}
                >
                  {win.title}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <style jsx global>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .blink {
          animation: blink 0.5s infinite;
        }
      `}</style>
    </div>
  );
}
