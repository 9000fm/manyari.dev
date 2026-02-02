'use client';

import React, { useState, useEffect } from 'react';

type ClockMode = 'analog' | 'digital';

// 7-segment digit patterns for LCD display
const SEGMENTS: Record<string, boolean[]> = {
  '0': [true, true, true, true, true, true, false],
  '1': [false, true, true, false, false, false, false],
  '2': [true, true, false, true, true, false, true],
  '3': [true, true, true, true, false, false, true],
  '4': [false, true, true, false, false, true, true],
  '5': [true, false, true, true, false, true, true],
  '6': [true, false, true, true, true, true, true],
  '7': [true, true, true, false, false, false, false],
  '8': [true, true, true, true, true, true, true],
  '9': [true, true, true, true, false, true, true],
};

// 7-segment digit component
function SevenSegmentDigit({ digit, size = 24, color = '#00FF00' }: { digit: string; size?: number; color?: string }) {
  const segments = SEGMENTS[digit] || SEGMENTS['0'];
  const w = size;
  const h = size * 1.8;
  const t = size / 8; // segment thickness
  const gap = 1;

  // Segment positions: [a, b, c, d, e, f, g] (standard 7-segment layout)
  // a = top, b = top-right, c = bottom-right, d = bottom, e = bottom-left, f = top-left, g = middle
  const off = 'rgba(0,40,0,0.3)';

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {/* Segment A - Top */}
      <polygon
        points={`${gap + t},${gap} ${w - gap - t},${gap} ${w - gap - t * 2},${t + gap} ${gap + t * 2},${t + gap}`}
        fill={segments[0] ? color : off}
      />
      {/* Segment B - Top Right */}
      <polygon
        points={`${w - gap},${gap + t} ${w - gap},${h / 2 - gap} ${w - gap - t},${h / 2 - t} ${w - gap - t},${gap + t * 2}`}
        fill={segments[1] ? color : off}
      />
      {/* Segment C - Bottom Right */}
      <polygon
        points={`${w - gap},${h / 2 + gap} ${w - gap},${h - gap - t} ${w - gap - t},${h - gap - t * 2} ${w - gap - t},${h / 2 + t}`}
        fill={segments[2] ? color : off}
      />
      {/* Segment D - Bottom */}
      <polygon
        points={`${gap + t},${h - gap} ${w - gap - t},${h - gap} ${w - gap - t * 2},${h - t - gap} ${gap + t * 2},${h - t - gap}`}
        fill={segments[3] ? color : off}
      />
      {/* Segment E - Bottom Left */}
      <polygon
        points={`${gap},${h / 2 + gap} ${gap + t},${h / 2 + t} ${gap + t},${h - gap - t * 2} ${gap},${h - gap - t}`}
        fill={segments[4] ? color : off}
      />
      {/* Segment F - Top Left */}
      <polygon
        points={`${gap},${gap + t} ${gap + t},${gap + t * 2} ${gap + t},${h / 2 - t} ${gap},${h / 2 - gap}`}
        fill={segments[5] ? color : off}
      />
      {/* Segment G - Middle */}
      <polygon
        points={`${gap + t * 1.5},${h / 2} ${gap + t * 2},${h / 2 - t / 2} ${w - gap - t * 2},${h / 2 - t / 2} ${w - gap - t * 1.5},${h / 2} ${w - gap - t * 2},${h / 2 + t / 2} ${gap + t * 2},${h / 2 + t / 2}`}
        fill={segments[6] ? color : off}
      />
    </svg>
  );
}

// Colon separator for digital clock
function Colon({ size = 24, color = '#00FF00', blink = false }: { size?: number; color?: string; blink?: boolean }) {
  const h = size * 1.8;
  const dotSize = size / 5;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: h,
        width: size / 2,
        opacity: blink ? 1 : 0.3,
      }}
    >
      <div
        style={{
          width: dotSize,
          height: dotSize,
          backgroundColor: color,
          borderRadius: '2px',
        }}
      />
      <div
        style={{
          width: dotSize,
          height: dotSize,
          backgroundColor: color,
          borderRadius: '2px',
        }}
      />
    </div>
  );
}

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState<ClockMode>('analog');
  const [blinkColon, setBlinkColon] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setBlinkColon(prev => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Calculate hand angles
  const secondAngle = (seconds / 60) * 360;
  const minuteAngle = ((minutes + seconds / 60) / 60) * 360;
  const hourAngle = ((hours % 12 + minutes / 60) / 12) * 360;

  const size = 140;
  const center = size / 2;
  const radius = size / 2 - 10;

  // Clock hand helper
  const getHandCoords = (angle: number, length: number) => {
    const radians = ((angle - 90) * Math.PI) / 180;
    return {
      x: center + length * Math.cos(radians),
      y: center + length * Math.sin(radians),
    };
  };

  // Format time for digital display
  const formatDigit = (n: number): string => n.toString().padStart(2, '0');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        height: '100%',
        backgroundColor: '#C0C0C0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Mode toggle button - single click to switch */}
      <button
        onClick={() => setMode(mode === 'analog' ? 'digital' : 'analog')}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          padding: '2px 8px',
          backgroundColor: '#C0C0C0',
          border: '1px solid #000000',
          cursor: 'pointer',
          fontFamily: '"MS Sans Serif", Arial, sans-serif',
          fontSize: '10px',
        }}
      >
        {mode === 'analog' ? 'Digital' : 'Analog'}
      </button>

      {mode === 'analog' ? (
        <>
          {/* Analog Clock - Win3.1 style with square dot markers */}
          <svg width={size} height={size}>
            {/* Clock face - dotted circle outline */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="2"
              strokeDasharray="2 2"
            />

            {/* Hour markers - square dots (12 positions) */}
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i / 12) * 360;
              const pos = getHandCoords(angle, radius - 8);
              const isMainHour = i % 3 === 0;
              const dotSize = isMainHour ? 6 : 4;
              return (
                <rect
                  key={i}
                  x={pos.x - dotSize / 2}
                  y={pos.y - dotSize / 2}
                  width={dotSize}
                  height={dotSize}
                  fill={isMainHour ? '#000000' : '#808080'}
                />
              );
            })}

            {/* Hour hand */}
            <line
              x1={center}
              y1={center}
              x2={getHandCoords(hourAngle, radius * 0.45).x}
              y2={getHandCoords(hourAngle, radius * 0.45).y}
              stroke="#000000"
              strokeWidth="4"
            />

            {/* Minute hand */}
            <line
              x1={center}
              y1={center}
              x2={getHandCoords(minuteAngle, radius * 0.65).x}
              y2={getHandCoords(minuteAngle, radius * 0.65).y}
              stroke="#000000"
              strokeWidth="2"
            />

            {/* Second hand */}
            <line
              x1={center}
              y1={center}
              x2={getHandCoords(secondAngle, radius * 0.75).x}
              y2={getHandCoords(secondAngle, radius * 0.75).y}
              stroke="#FF0000"
              strokeWidth="1"
            />

            {/* Center dot - square */}
            <rect
              x={center - 3}
              y={center - 3}
              width={6}
              height={6}
              fill="#000000"
            />
          </svg>

          {/* Digital time display below analog */}
          <div
            style={{
              marginTop: '8px',
              fontFamily: '"MS Sans Serif", Arial, sans-serif',
              fontSize: '12px',
              color: '#000000',
            }}
          >
            {time.toLocaleTimeString()}
          </div>
        </>
      ) : (
        /* Digital LCD Clock */
        <div
          style={{
            backgroundColor: '#1a1a1a',
            padding: '12px 16px',
            borderRadius: '4px',
            border: '2px inset #808080',
            maxHeight: '100px',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Hours */}
            <SevenSegmentDigit digit={formatDigit(hours)[0]} />
            <SevenSegmentDigit digit={formatDigit(hours)[1]} />
            <Colon blink={blinkColon} />
            {/* Minutes */}
            <SevenSegmentDigit digit={formatDigit(minutes)[0]} />
            <SevenSegmentDigit digit={formatDigit(minutes)[1]} />
            <Colon blink={blinkColon} />
            {/* Seconds */}
            <SevenSegmentDigit digit={formatDigit(seconds)[0]} />
            <SevenSegmentDigit digit={formatDigit(seconds)[1]} />
          </div>
        </div>
      )}

      {/* Date display */}
      <div
        style={{
          marginTop: '12px',
          fontFamily: '"MS Sans Serif", Arial, sans-serif',
          fontSize: '11px',
          color: '#000000',
        }}
      >
        {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
}
