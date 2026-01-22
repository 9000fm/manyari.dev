'use client';

import React from 'react';
import { Language, ConfirmOption } from '../types';
import { translations, getDotChar } from '../translations';
import { WIN_FONT } from '../constants';

interface ConfirmScreenProps {
  language: Language;
  typedWelcome: string;
  welcomeDots: string;
  typedConfirm: string;
  typedYes: string;
  typedNo: string;
  showSelector: boolean;
  showConfirmCursor: boolean;
  selectedOption: ConfirmOption;
  showLoadingDots: boolean;
  loadingDots: string;
  onSelect: (option: ConfirmOption) => void;
}

export function ConfirmScreen({
  language,
  typedWelcome,
  welcomeDots,
  typedConfirm,
  typedYes,
  typedNo,
  showSelector,
  showConfirmCursor,
  selectedOption,
  showLoadingDots,
  loadingDots,
  onSelect,
}: ConfirmScreenProps) {
  const winFont = WIN_FONT;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: winFont,
        color: 'white',
        textAlign: 'left',
        width: 'clamp(280px, 70vw, 450px)',
      }}
    >
      {/* Loading dots - shown after YES is clicked */}
      {showLoadingDots ? (
        <div
          style={{
            fontSize: 'clamp(1.4rem, 5vw, 2.2rem)',
            letterSpacing: '0.2em',
          }}
        >
          {loadingDots}
        </div>
      ) : (
        <>
          {/* WELCOME line - disappears when question starts */}
          <div
            style={{
              fontSize: 'clamp(1.4rem, 5vw, 2.2rem)',
              marginBottom: '1rem',
              letterSpacing: '0.05em',
              display: typedConfirm ? 'none' : 'block',
            }}
          >
            {typedWelcome}
            {welcomeDots}
            <span
              className={showConfirmCursor && !welcomeDots ? 'blink' : ''}
              style={{ opacity: showConfirmCursor && welcomeDots.length < 3 ? 1 : 0 }}
            >
              _
            </span>
          </div>

          {/* Question line - appears after welcome disappears */}
          <div
            style={{
              fontSize: 'clamp(1.4rem, 5vw, 2.2rem)',
              marginBottom: '1.5rem',
              letterSpacing: '0.05em',
              display: typedConfirm ? 'block' : 'none',
            }}
          >
            {typedConfirm}
            <span
              className={typedConfirm && !typedYes ? 'blink' : ''}
              style={{ opacity: typedConfirm && !typedYes ? 1 : 0 }}
            >
              _
            </span>
          </div>

          <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', marginLeft: '1rem' }}>
            {/* YES option */}
            <div
              onClick={() => showSelector && onSelect('yes')}
              style={{
                cursor: showSelector ? 'pointer' : 'default',
                marginBottom: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                visibility: typedYes ? 'visible' : 'hidden',
              }}
            >
              <span
                className={showSelector && selectedOption === 'yes' ? 'blink-slow' : ''}
                style={{ opacity: showSelector && selectedOption === 'yes' ? 1 : 0 }}
              >
                ▶
              </span>
              <span>{typedYes}</span>
            </div>

            {/* NO option */}
            <div
              onClick={() => showSelector && onSelect('no')}
              style={{
                cursor: showSelector ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                visibility: typedNo ? 'visible' : 'hidden',
              }}
            >
              <span
                className={showSelector && selectedOption === 'no' ? 'blink-slow' : ''}
                style={{ opacity: showSelector && selectedOption === 'no' ? 1 : 0 }}
              >
                ▶
              </span>
              <span>{typedNo}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
