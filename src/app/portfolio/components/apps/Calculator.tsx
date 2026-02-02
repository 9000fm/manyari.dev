'use client';

import React, { useState } from 'react';

// FLAT 1985 style buttons
const buttonStyle: React.CSSProperties = {
  width: '40px',
  height: '30px',
  backgroundColor: '#C0C0C0',
  border: '1px solid #000000',
  fontFamily: '"MS Sans Serif", Arial, sans-serif',
  fontSize: '12px',
  cursor: 'pointer',
  touchAction: 'manipulation',
};

const pressedStyle: React.CSSProperties = {
  backgroundColor: '#808080',
};

// CalcButton defined OUTSIDE the main component to prevent re-creation on each render
function CalcButton({ label, onClick, wide }: { label: string; onClick: () => void; wide?: boolean }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        ...buttonStyle,
        ...(pressed ? pressedStyle : {}),
        ...(wide ? { width: '84px' } : {}),
      }}
    >
      {label}
    </button>
  );
}

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result: number;

      switch (operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '*':
          result = currentValue * inputValue;
          break;
        case '/':
          result = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        default:
          result = inputValue;
      }

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    if (operation && previousValue !== null) {
      performOperation('=');
      setOperation(null);
      setPreviousValue(null);
    }
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  const percentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const sqrt = () => {
    const value = parseFloat(display);
    setDisplay(String(Math.sqrt(value)));
  };

  const memoryClear = () => setMemory(0);
  const memoryRecall = () => setDisplay(String(memory));
  const memoryAdd = () => setMemory(memory + parseFloat(display));
  const memorySubtract = () => setMemory(memory - parseFloat(display));

  return (
    <div
      style={{
        padding: '8px',
        backgroundColor: '#C0C0C0',
        height: '100%',
      }}
    >
      {/* Display */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '2px inset #808080',
          padding: '4px 8px',
          marginBottom: '8px',
          textAlign: 'right',
          fontFamily: '"MS Sans Serif", Arial, sans-serif',
          fontSize: '18px',
          minHeight: '24px',
          overflow: 'hidden',
          color: '#000000',
        }}
      >
        {display}
      </div>

      {/* Button grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Row 1: Memory */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <CalcButton label="MC" onClick={memoryClear} />
          <CalcButton label="MR" onClick={memoryRecall} />
          <CalcButton label="M+" onClick={memoryAdd} />
          <CalcButton label="M-" onClick={memorySubtract} />
        </div>

        {/* Row 2: Clear and operations */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <CalcButton label="C" onClick={clear} />
          <CalcButton label="CE" onClick={clearEntry} />
          <CalcButton label="%" onClick={percentage} />
          <CalcButton label="sqrt" onClick={sqrt} />
        </div>

        {/* Row 3 */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <CalcButton label="7" onClick={() => inputDigit('7')} />
          <CalcButton label="8" onClick={() => inputDigit('8')} />
          <CalcButton label="9" onClick={() => inputDigit('9')} />
          <CalcButton label="/" onClick={() => performOperation('/')} />
        </div>

        {/* Row 4 */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <CalcButton label="4" onClick={() => inputDigit('4')} />
          <CalcButton label="5" onClick={() => inputDigit('5')} />
          <CalcButton label="6" onClick={() => inputDigit('6')} />
          <CalcButton label="*" onClick={() => performOperation('*')} />
        </div>

        {/* Row 5 */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <CalcButton label="1" onClick={() => inputDigit('1')} />
          <CalcButton label="2" onClick={() => inputDigit('2')} />
          <CalcButton label="3" onClick={() => inputDigit('3')} />
          <CalcButton label="-" onClick={() => performOperation('-')} />
        </div>

        {/* Row 6 */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <CalcButton label="0" onClick={() => inputDigit('0')} wide />
          <CalcButton label="." onClick={inputDecimal} />
          <CalcButton label="+" onClick={() => performOperation('+')} />
        </div>

        {/* Row 7 */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <CalcButton label="+/-" onClick={toggleSign} />
          <CalcButton label="=" onClick={calculate} wide />
          <div style={{ width: '40px' }} />
        </div>
      </div>
    </div>
  );
}
