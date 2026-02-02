'use client';

import { useState, useCallback } from 'react';

export type WindowState = {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  icon?: string;
  minimizedAt?: number;
};

export type WindowAction =
  | { type: 'OPEN'; id: string; title: string; icon?: string }
  | { type: 'CLOSE'; id: string }
  | { type: 'MINIMIZE'; id: string }
  | { type: 'MAXIMIZE'; id: string }
  | { type: 'RESTORE'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'MOVE'; id: string; position: { x: number; y: number } }
  | { type: 'RESIZE'; id: string; size: { width: number; height: number } };

const DEFAULT_WINDOW_SIZE = { width: 400, height: 300 };
const DEFAULT_POSITION = { x: 50, y: 50 };
const POSITION_OFFSET = 30;

export function useWindowManager() {
  const [windows, setWindows] = useState<Map<string, WindowState>>(new Map());
  const [topZIndex, setTopZIndex] = useState(100);

  const getNextPosition = useCallback(() => {
    const windowCount = Array.from(windows.values()).filter(w => w.isOpen && !w.isMinimized).length;
    return {
      x: DEFAULT_POSITION.x + (windowCount * POSITION_OFFSET) % 200,
      y: DEFAULT_POSITION.y + (windowCount * POSITION_OFFSET) % 150,
    };
  }, [windows]);

  const dispatch = useCallback((action: WindowAction) => {
    setWindows(prev => {
      const newWindows = new Map(prev);

      switch (action.type) {
        case 'OPEN': {
          const existing = newWindows.get(action.id);
          if (existing) {
            // Window exists - restore and focus
            newWindows.set(action.id, {
              ...existing,
              isOpen: true,
              isMinimized: false,
              zIndex: topZIndex + 1,
            });
            setTopZIndex(z => z + 1);
          } else {
            // Create new window
            const position = getNextPosition();
            newWindows.set(action.id, {
              id: action.id,
              title: action.title,
              isOpen: true,
              isMinimized: false,
              isMaximized: false,
              position,
              size: DEFAULT_WINDOW_SIZE,
              zIndex: topZIndex + 1,
              icon: action.icon,
            });
            setTopZIndex(z => z + 1);
          }
          break;
        }

        case 'CLOSE': {
          newWindows.delete(action.id);
          break;
        }

        case 'MINIMIZE': {
          const win = newWindows.get(action.id);
          if (win) {
            newWindows.set(action.id, { ...win, isMinimized: true, minimizedAt: Date.now() });
          }
          break;
        }

        case 'MAXIMIZE': {
          const win = newWindows.get(action.id);
          if (win) {
            newWindows.set(action.id, { ...win, isMaximized: true, zIndex: topZIndex + 1 });
            setTopZIndex(z => z + 1);
          }
          break;
        }

        case 'RESTORE': {
          const win = newWindows.get(action.id);
          if (win) {
            newWindows.set(action.id, {
              ...win,
              isMinimized: false,
              isMaximized: false,
              zIndex: topZIndex + 1,
            });
            setTopZIndex(z => z + 1);
          }
          break;
        }

        case 'FOCUS': {
          const win = newWindows.get(action.id);
          if (win && !win.isMinimized) {
            newWindows.set(action.id, { ...win, zIndex: topZIndex + 1 });
            setTopZIndex(z => z + 1);
          }
          break;
        }

        case 'MOVE': {
          const win = newWindows.get(action.id);
          if (win) {
            newWindows.set(action.id, { ...win, position: action.position });
          }
          break;
        }

        case 'RESIZE': {
          const win = newWindows.get(action.id);
          if (win) {
            newWindows.set(action.id, { ...win, size: action.size });
          }
          break;
        }
      }

      return newWindows;
    });
  }, [topZIndex, getNextPosition]);

  const openWindow = useCallback((id: string, title: string, icon?: string) => {
    dispatch({ type: 'OPEN', id, title, icon });
  }, [dispatch]);

  const closeWindow = useCallback((id: string) => {
    dispatch({ type: 'CLOSE', id });
  }, [dispatch]);

  const minimizeWindow = useCallback((id: string) => {
    dispatch({ type: 'MINIMIZE', id });
  }, [dispatch]);

  const maximizeWindow = useCallback((id: string) => {
    dispatch({ type: 'MAXIMIZE', id });
  }, [dispatch]);

  const restoreWindow = useCallback((id: string) => {
    dispatch({ type: 'RESTORE', id });
  }, [dispatch]);

  const focusWindow = useCallback((id: string) => {
    dispatch({ type: 'FOCUS', id });
  }, [dispatch]);

  const moveWindow = useCallback((id: string, position: { x: number; y: number }) => {
    dispatch({ type: 'MOVE', id, position });
  }, [dispatch]);

  const getWindow = useCallback((id: string) => {
    return windows.get(id);
  }, [windows]);

  const getOpenWindows = useCallback(() => {
    return Array.from(windows.values()).filter(w => w.isOpen && !w.isMinimized);
  }, [windows]);

  const getMinimizedWindows = useCallback(() => {
    return Array.from(windows.values())
      .filter(w => w.isOpen && w.isMinimized)
      .sort((a, b) => (a.minimizedAt || 0) - (b.minimizedAt || 0));
  }, [windows]);

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    moveWindow,
    getWindow,
    getOpenWindows,
    getMinimizedWindows,
  };
}
