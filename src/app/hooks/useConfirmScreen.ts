import { useState, useEffect, useRef, useCallback } from 'react';
import { Phase, Language, ConfirmOption } from '../types';
import { translations, getDotChar } from '../translations';
import { SCRAMBLE_CHARS } from '../constants';

interface UseConfirmScreenProps {
  phase: Phase;
  language: Language;
  onSelectYes: () => void;
  onSelectNo: () => void;
}

interface UseConfirmScreenReturn {
  typedWelcome: string;
  welcomeDots: string;
  typedConfirm: string;
  typedYes: string;
  typedNo: string;
  showSelector: boolean;
  showConfirmCursor: boolean;
  selectedOption: ConfirmOption;
  setSelectedOption: (option: ConfirmOption) => void;
  confirmLangVisible: boolean;
  handleConfirmSelect: (option: ConfirmOption) => void;
  loadingDots: string;
  showLoadingDots: boolean;
  scrambledSkip: string;
  resetConfirmState: () => void;
}

export function useConfirmScreen({
  phase,
  language,
  onSelectYes,
  onSelectNo,
}: UseConfirmScreenProps): UseConfirmScreenReturn {
  const t = translations[language];
  const dotChar = getDotChar(language);

  // Typing states
  const [typedWelcome, setTypedWelcome] = useState('');
  const [welcomeDots, setWelcomeDots] = useState('');
  const [typedConfirm, setTypedConfirm] = useState('');
  const [typedYes, setTypedYes] = useState('');
  const [typedNo, setTypedNo] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  const [showConfirmCursor, setShowConfirmCursor] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ConfirmOption>('yes');
  const [confirmLangVisible, setConfirmLangVisible] = useState(false);
  const [isConfirmScrambling, setIsConfirmScrambling] = useState(false);

  // Loading dots for YES transition
  const [loadingDots, setLoadingDots] = useState('');
  const [showLoadingDots, setShowLoadingDots] = useState(false);

  // Skip text scramble on language change
  const [scrambledSkip, setScrambledSkip] = useState('');

  // Track previous language for scramble effect
  const prevLangRef = useRef<Language>(language);

  // Timer tracking for cleanup
  const timersRef = useRef<{ timers: NodeJS.Timeout[]; intervals: NodeJS.Timeout[] }>({
    timers: [],
    intervals: [],
  });

  const addTimer = useCallback((timer: NodeJS.Timeout) => {
    timersRef.current.timers.push(timer);
    return timer;
  }, []);

  const addInterval = useCallback((interval: NodeJS.Timeout) => {
    timersRef.current.intervals.push(interval);
    return interval;
  }, []);

  const clearAllTimers = useCallback(() => {
    timersRef.current.timers.forEach((t) => clearTimeout(t));
    timersRef.current.intervals.forEach((i) => clearInterval(i));
    timersRef.current = { timers: [], intervals: [] };
  }, []);

  const resetConfirmState = useCallback(() => {
    clearAllTimers();
    setTypedWelcome('');
    setWelcomeDots('');
    setTypedConfirm('');
    setTypedYes('');
    setTypedNo('');
    setShowSelector(false);
    setShowConfirmCursor(false);
    setConfirmLangVisible(false);
    setLoadingDots('');
    setShowLoadingDots(false);
  }, [clearAllTimers]);

  // Handle confirm selection
  const handleConfirmSelect = useCallback(
    (option: ConfirmOption) => {
      if (option === 'yes') {
        // Fade out everything first
        setConfirmLangVisible(false);
        setTypedWelcome('');
        setTypedConfirm('');
        setTypedYes('');
        setTypedNo('');

        // Show loading dots animation
        setShowLoadingDots(true);
        const d = dotChar;
        const loadingTimings = [
          { text: d, delay: 300 },
          { text: d + d, delay: 600 },
          { text: d + d + d, delay: 900 },
          { text: '', delay: 1300 },
        ];

        loadingTimings.forEach(({ text, delay }) => {
          addTimer(setTimeout(() => setLoadingDots(text), delay));
        });

        // Then transition to main
        addTimer(
          setTimeout(() => {
            setShowLoadingDots(false);
            onSelectYes();
          }, 1600)
        );
      } else {
        onSelectNo();
      }
    },
    [dotChar, addTimer, onSelectYes, onSelectNo]
  );

  // Reset typing when language changes during confirm phase
  useEffect(() => {
    if (phase !== 'confirm') return;
    if (prevLangRef.current !== language) {
      prevLangRef.current = language;
      clearAllTimers();
      setShowSelector(false);
      setIsConfirmScrambling(false);
      setTypedWelcome('');
      setWelcomeDots('');
      setTypedConfirm('');
      setTypedYes('');
      setTypedNo('');
      setShowConfirmCursor(false);

      // Scramble the skip text
      const scrambleChars = language === 'JP' ? SCRAMBLE_CHARS.japanese : SCRAMBLE_CHARS.base;
      const newSkip = t.skip;
      let frame = 0;
      const maxFrames = 12;

      const skipInterval = setInterval(() => {
        frame++;
        const locked = Math.floor((frame / maxFrames) * newSkip.length);
        let result = '';
        for (let i = 0; i < newSkip.length; i++) {
          if (i < locked) {
            result += newSkip[i];
          } else {
            result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          }
        }
        setScrambledSkip(result);

        if (frame >= maxFrames) {
          setScrambledSkip('');
          clearInterval(skipInterval);
        }
      }, 40);

      return () => {
        clearInterval(skipInterval);
        setScrambledSkip('');
      };
    }
  }, [language, phase, t, clearAllTimers]);

  // Typing effect for confirm screen
  useEffect(() => {
    if (phase === 'confirm' && !showSelector && !isConfirmScrambling) {
      clearAllTimers();

      const welcomeText = t.welcome;
      const confirmText = t.willYouContinue;
      const yesText = t.yes;
      const noText = t.no;
      let welcomeIndex = 0;
      let confirmIndex = 0;
      let yesIndex = 0;
      let noIndex = 0;

      setTypedWelcome('');
      setWelcomeDots('');
      setTypedConfirm('');
      setTypedYes('');
      setTypedNo('');
      setShowSelector(false);
      setShowConfirmCursor(false);

      // First show blinking cursor, then start typing
      addTimer(
        setTimeout(() => {
          setShowConfirmCursor(true);
        }, 300)
      );

      addTimer(
        setTimeout(() => {
          // Type WELCOME first
          const welcomeInterval = addInterval(
            setInterval(() => {
              if (welcomeIndex < welcomeText.length) {
                setTypedWelcome(welcomeText.slice(0, welcomeIndex + 1));
                welcomeIndex++;
              } else {
                clearInterval(welcomeInterval);

                // Animate dots
                let dotCount = 0;
                const dotsInterval = addInterval(
                  setInterval(() => {
                    dotCount++;
                    setWelcomeDots(dotChar.repeat(dotCount));
                    if (dotCount >= 3) {
                      clearInterval(dotsInterval);

                      // Pause after dots, then type the question
                      addTimer(
                        setTimeout(() => {
                          const confirmInterval = addInterval(
                            setInterval(() => {
                              if (confirmIndex < confirmText.length) {
                                setTypedConfirm(confirmText.slice(0, confirmIndex + 1));
                                confirmIndex++;
                              } else {
                                clearInterval(confirmInterval);

                                // Pause, then type YES
                                addTimer(
                                  setTimeout(() => {
                                    const yesInterval = addInterval(
                                      setInterval(() => {
                                        if (yesIndex < yesText.length) {
                                          setTypedYes(yesText.slice(0, yesIndex + 1));
                                          yesIndex++;
                                        } else {
                                          clearInterval(yesInterval);

                                          // Small pause, then type NO
                                          addTimer(
                                            setTimeout(() => {
                                              const noInterval = addInterval(
                                                setInterval(() => {
                                                  if (noIndex < noText.length) {
                                                    setTypedNo(noText.slice(0, noIndex + 1));
                                                    noIndex++;
                                                  } else {
                                                    clearInterval(noInterval);

                                                    // Show selector after everything is typed
                                                    addTimer(
                                                      setTimeout(() => {
                                                        setShowSelector(true);
                                                        setConfirmLangVisible(true);
                                                      }, 400)
                                                    );
                                                  }
                                                }, 80)
                                              );
                                            }, 200)
                                          );
                                        }
                                      }, 80)
                                    );
                                  }, 400)
                                );
                              }
                            }, 50)
                          );
                        }, 600)
                      );
                    }
                  }, 300)
                );
              }
            }, 70)
          );
        }, 1000)
      );

      return () => {
        clearAllTimers();
      };
    }
  }, [phase, t, showSelector, isConfirmScrambling, dotChar, addTimer, addInterval, clearAllTimers]);

  // Keyboard navigation
  useEffect(() => {
    if (phase !== 'confirm' || !showSelector) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        setSelectedOption((prev) => (prev === 'yes' ? 'no' : 'yes'));
      } else if (e.key === 'Enter') {
        handleConfirmSelect(selectedOption);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, selectedOption, showSelector, handleConfirmSelect]);

  return {
    typedWelcome,
    welcomeDots,
    typedConfirm,
    typedYes,
    typedNo,
    showSelector,
    showConfirmCursor,
    selectedOption,
    setSelectedOption,
    confirmLangVisible,
    handleConfirmSelect,
    loadingDots,
    showLoadingDots,
    scrambledSkip,
    resetConfirmState,
  };
}
