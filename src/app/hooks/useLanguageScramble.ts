import { useState, useEffect, useRef } from 'react';
import { Phase, Language } from '../types';
import { translations } from '../translations';
import { SCRAMBLE_CHARS } from '../constants';

interface UseLanguageScrambleProps {
  phase: Phase;
  language: Language;
}

interface ScrambledTexts {
  about: string;
  shop: string;
  message: string;
  copyright: string;
  welcomeMsg: string;
  aboutText: string;
  shopMsg: string;
  close: string;
  cancel: string;
  ok: string;
  confirm: string;
  subscribePrompt: string;
}

interface UseLanguageScrambleReturn {
  scrambled: ScrambledTexts;
}

const emptyScrambled: ScrambledTexts = {
  about: '',
  shop: '',
  message: '',
  copyright: '',
  welcomeMsg: '',
  aboutText: '',
  shopMsg: '',
  close: '',
  cancel: '',
  ok: '',
  confirm: '',
  subscribePrompt: '',
};

export function useLanguageScramble({
  phase,
  language,
}: UseLanguageScrambleProps): UseLanguageScrambleReturn {
  const t = translations[language];
  const scrambleChars = language === 'JP' ? SCRAMBLE_CHARS.japanese : SCRAMBLE_CHARS.base;

  const [scrambled, setScrambled] = useState<ScrambledTexts>(emptyScrambled);
  const isScrambling = useRef(false);
  const prevLangRef = useRef<Language>(language);

  useEffect(() => {
    if (phase !== 'main' || isScrambling.current) return;

    if (prevLangRef.current !== language) {
      prevLangRef.current = language;
      isScrambling.current = true;

      // Get new texts
      const newTexts = {
        about: t.about,
        shop: t.shop,
        message: t.message,
        copyright: t.allRightsReserved,
        welcomeMsg: t.welcomeMessage,
        aboutText: t.aboutText,
        shopMsg: t.shopMessage,
        close: t.close,
        cancel: t.cancel,
        ok: t.ok,
        confirm: t.confirm,
        subscribePrompt: t.subscribePrompt,
      };

      let frame = 0;
      const maxFrames = 18;

      const scrambleInterval = setInterval(() => {
        frame++;

        // Progressive reveal for each text (preserves spaces to prevent overflow)
        const scrambleText = (newText: string) => {
          const locked = Math.floor((frame / maxFrames) * newText.length);
          let result = '';
          for (let i = 0; i < newText.length; i++) {
            if (i < locked) {
              result += newText[i];
            } else if (newText[i] === ' ' || newText[i] === '\n') {
              result += newText[i];
            } else {
              result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            }
          }
          return result;
        };

        setScrambled({
          about: scrambleText(newTexts.about),
          shop: scrambleText(newTexts.shop),
          message: scrambleText(newTexts.message),
          copyright: scrambleText(newTexts.copyright),
          welcomeMsg: scrambleText(newTexts.welcomeMsg),
          aboutText: scrambleText(newTexts.aboutText),
          shopMsg: scrambleText(newTexts.shopMsg),
          close: scrambleText(newTexts.close),
          cancel: scrambleText(newTexts.cancel),
          ok: scrambleText(newTexts.ok),
          confirm: scrambleText(newTexts.confirm),
          subscribePrompt: scrambleText(newTexts.subscribePrompt),
        });

        if (frame >= maxFrames) {
          // Clear scrambled states to show actual translations
          setScrambled(emptyScrambled);
          clearInterval(scrambleInterval);
          isScrambling.current = false;
        }
      }, 40);

      return () => {
        clearInterval(scrambleInterval);
        setScrambled(emptyScrambled);
        isScrambling.current = false;
      };
    }
  }, [language, phase, t, scrambleChars]);

  return { scrambled };
}
