import { useState, useEffect, useCallback, useRef } from 'react';
import { Phase, Language } from '../types';
import { SCRAMBLE_CHARS } from '../constants';

interface UseMainEntranceProps {
  phase: Phase;
  language: Language;
  skipMode: boolean;
  replayTrigger: number;
  onSkipModeComplete: () => void;
  onShowWelcomePopup: () => void;
}

interface UseMainEntranceReturn {
  showFrame: boolean;
  showTitlePrompt: boolean;
  typedTitle: string;
  showTitleCursor: boolean;
  showFooter: boolean;
  burgerVisible: boolean;
  handleReplayEntrance: () => void;
  resetEntranceState: () => void;
}

export function useMainEntrance({
  phase,
  language,
  skipMode,
  replayTrigger,
  onSkipModeComplete,
  onShowWelcomePopup,
}: UseMainEntranceProps): UseMainEntranceReturn {
  const scrambleChars = language === 'JP' ? SCRAMBLE_CHARS.japanese : SCRAMBLE_CHARS.base;

  const [showFrame, setShowFrame] = useState(false);
  const [showTitlePrompt, setShowTitlePrompt] = useState(false);
  const [typedTitle, setTypedTitle] = useState('');
  const [showTitleCursor, setShowTitleCursor] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [burgerVisible, setBurgerVisible] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);

  const resetEntranceState = useCallback(() => {
    setShowFrame(false);
    setShowTitlePrompt(false);
    setTypedTitle('');
    setShowTitleCursor(false);
    setShowFooter(false);
    setBurgerVisible(false);
  }, []);

  const handleReplayEntrance = useCallback(() => {
    setIsReplaying(true);
    resetEntranceState();

    // Wait briefly for elements to hide, then restart entrance
    setTimeout(() => {
      setIsReplaying(false);
    }, 150);
  }, [resetEntranceState]);

  // Main content entrance sequence
  useEffect(() => {
    if (phase === 'main') {
      const titleText = 'superself';
      let scrambleFrame = 0;
      let scrambleInterval: NodeJS.Timeout | null = null;

      // Timings depend on skip mode
      const timings = skipMode
        ? { frame: 300, title: 800, footer: 1500, burger: 2000, popup: 12000 }
        : { frame: 800, title: 1500, footer: 3500, burger: 5000, popup: 18000 + Math.random() * 4000 };

      // Step 1: Show frame first
      const frameTimer = setTimeout(() => {
        setShowFrame(true);
      }, timings.frame);

      // Step 2: Start title scramble after frame is visible
      const titleTimer = setTimeout(() => {
        setShowTitlePrompt(true);
        setShowTitleCursor(true);

        // Per-character lock frame targets (randomized for organic feel)
        const lockMultiplier = skipMode ? 8 : 14;
        const lockTargets = titleText.split('').map((_, i) => {
          const baseDelay = (i + 1) * lockMultiplier;
          const randomVariation = Math.floor(Math.random() * 8) - 4;
          return baseDelay + randomVariation;
        });
        const isLocked = new Array(titleText.length).fill(false);

        // Scramble animation
        const scrambleSpeed = skipMode ? 30 : 55;
        scrambleInterval = setInterval(() => {
          scrambleFrame++;

          let display = '';
          let allLocked = true;

          for (let i = 0; i < titleText.length; i++) {
            if (!isLocked[i] && scrambleFrame >= lockTargets[i]) {
              isLocked[i] = true;
            }

            if (isLocked[i]) {
              display += titleText[i];
            } else {
              display += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
              allLocked = false;
            }
          }
          setTypedTitle(display);

          if (allLocked) {
            setTypedTitle(titleText);
            if (scrambleInterval) clearInterval(scrambleInterval);
            // Reset skip mode after entrance complete
            if (skipMode) onSkipModeComplete();
          }
        }, scrambleSpeed);
      }, timings.title);

      // Step 3: Show ASCII background
      const bgTimer = setTimeout(() => {
        setShowFooter(true);
      }, timings.footer);

      // Step 4: Show burger (icons and language)
      const burgerTimer = setTimeout(() => {
        setBurgerVisible(true);
      }, timings.burger);

      // Step 5: Show welcome popup
      const welcomeTimer = setTimeout(() => {
        onShowWelcomePopup();
      }, timings.popup);

      return () => {
        if (scrambleInterval) clearInterval(scrambleInterval);
        clearTimeout(frameTimer);
        clearTimeout(titleTimer);
        clearTimeout(bgTimer);
        clearTimeout(burgerTimer);
        clearTimeout(welcomeTimer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, replayTrigger]);

  return {
    showFrame,
    showTitlePrompt,
    typedTitle,
    showTitleCursor,
    showFooter,
    burgerVisible,
    handleReplayEntrance,
    resetEntranceState,
  };
}
