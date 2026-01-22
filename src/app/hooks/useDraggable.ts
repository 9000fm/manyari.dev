import { useState, useCallback } from 'react';
import { Position } from '../types';

interface UseDraggableReturn {
  welcomePos: Position;
  aboutPos: Position;
  shopPos: Position;
  isDragging: string | null;
  setWelcomePos: (pos: Position) => void;
  setAboutPos: (pos: Position) => void;
  setShopPos: (pos: Position) => void;
  handleDragStart: (e: React.MouseEvent | React.TouchEvent, popupId: string) => void;
  resetPosition: (popupId: string) => void;
}

export function useDraggable(): UseDraggableReturn {
  const [welcomePos, setWelcomePos] = useState<Position>({ x: 0, y: 0 });
  const [aboutPos, setAboutPos] = useState<Position>({ x: 0, y: 0 });
  const [shopPos, setShopPos] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<string | null>(null);

  const resetPosition = useCallback((popupId: string) => {
    if (popupId === 'welcome') {
      setWelcomePos({ x: 0, y: 0 });
    } else if (popupId === 'about') {
      setAboutPos({ x: 0, y: 0 });
    } else if (popupId === 'shop') {
      setShopPos({ x: 0, y: 0 });
    }
  }, []);

  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent, popupId: string) => {
      e.preventDefault();

      const popup = (e.target as HTMLElement).closest('.popup-window');
      const rect = popup?.getBoundingClientRect();
      if (rect) {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        // If popup is centered (position is 0,0), convert to absolute position first
        const currentPos =
          popupId === 'welcome' ? welcomePos : popupId === 'shop' ? shopPos : aboutPos;
        if (currentPos.x === 0 && currentPos.y === 0) {
          const initialPos = { x: rect.left, y: rect.top };
          if (popupId === 'welcome') {
            setWelcomePos(initialPos);
          } else if (popupId === 'about') {
            setAboutPos(initialPos);
          } else if (popupId === 'shop') {
            setShopPos(initialPos);
          }
        }

        const offsetX = clientX - rect.left;
        const offsetY = clientY - rect.top;

        const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
          if ('touches' in moveEvent) {
            moveEvent.preventDefault();
            if (!moveEvent.touches[0]) return;
          }
          const moveX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
          const moveY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;

          const newPos = { x: moveX - offsetX, y: moveY - offsetY };
          if (popupId === 'welcome') {
            setWelcomePos(newPos);
          } else if (popupId === 'about') {
            setAboutPos(newPos);
          } else if (popupId === 'shop') {
            setShopPos(newPos);
          }
        };

        const handleEnd = () => {
          document.removeEventListener('mousemove', handleMove);
          document.removeEventListener('mouseup', handleEnd);
          document.removeEventListener('touchmove', handleMove);
          document.removeEventListener('touchend', handleEnd);
          document.removeEventListener('touchcancel', handleEnd);
          setIsDragging(null);
        };

        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('touchend', handleEnd);
        document.addEventListener('touchcancel', handleEnd);

        setIsDragging(popupId);
      }
    },
    [welcomePos, aboutPos, shopPos]
  );

  return {
    welcomePos,
    aboutPos,
    shopPos,
    isDragging,
    setWelcomePos,
    setAboutPos,
    setShopPos,
    handleDragStart,
    resetPosition,
  };
}
