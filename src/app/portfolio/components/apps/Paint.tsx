'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

// Win3.1 color palette (16 colors)
const COLORS = [
  '#000000', '#808080', '#800000', '#808000',
  '#008000', '#008080', '#000080', '#800080',
  '#FFFFFF', '#C0C0C0', '#FF0000', '#FFFF00',
  '#00FF00', '#00FFFF', '#0000FF', '#FF00FF',
];

type Tool = 'pencil' | 'brush' | 'eraser' | 'fill' | 'line' | 'rect' | 'ellipse' | 'spray' | 'text' | 'eyedropper';

export default function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [tool, setTool] = useState<Tool>('pencil');
  const [brushSize, setBrushSize] = useState(2);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [canvasSnapshot, setCanvasSnapshot] = useState<ImageData | null>(null);
  const [textInput, setTextInput] = useState('');
  const [showTextDialog, setShowTextDialog] = useState(false);
  const [textPos, setTextPos] = useState<{ x: number; y: number } | null>(null);

  // Initialize canvas with white background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCanvasCoords = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const drawLine = useCallback((ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }) => {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }, []);

  // Spray paint helper
  const sprayPaint = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, density: number) => {
    ctx.fillStyle = color;
    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      const px = x + r * Math.cos(angle);
      const py = y + r * Math.sin(angle);
      ctx.fillRect(px, py, 1, 1);
    }
  }, [color]);

  // Eyedropper helper
  const pickColor = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(v => v.toString(16).padStart(2, '0')).join('');
    setColor(hex);
    setTool('pencil'); // Switch back to pencil after picking
  }, []);

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getCanvasCoords(e);
    setIsDrawing(true);
    setLastPos(pos);
    setStartPos(pos);

    // Save canvas state for shapes
    if (['line', 'rect', 'ellipse'].includes(tool)) {
      setCanvasSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }

    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.lineWidth = tool === 'brush' ? brushSize * 2 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Tool-specific start actions
    if (tool === 'fill') {
      floodFill(ctx, Math.floor(pos.x), Math.floor(pos.y), color, canvas.width, canvas.height);
      setIsDrawing(false);
    } else if (tool === 'eyedropper') {
      pickColor(ctx, pos.x, pos.y);
      setIsDrawing(false);
    } else if (tool === 'text') {
      setTextPos(pos);
      setShowTextDialog(true);
      setIsDrawing(false);
    } else if (tool === 'spray') {
      sprayPaint(ctx, pos.x, pos.y, brushSize * 4, brushSize * 3);
    }
  }, [getCanvasCoords, tool, color, brushSize, pickColor, sprayPaint]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getCanvasCoords(e);

    if (['pencil', 'brush', 'eraser'].includes(tool)) {
      if (lastPos) {
        drawLine(ctx, lastPos, pos);
      }
      setLastPos(pos);
    } else if (tool === 'spray') {
      sprayPaint(ctx, pos.x, pos.y, brushSize * 4, brushSize * 2);
    } else if (['line', 'rect', 'ellipse'].includes(tool) && startPos && canvasSnapshot) {
      // Restore canvas and draw preview
      ctx.putImageData(canvasSnapshot, 0, 0);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;

      if (tool === 'line') {
        drawLine(ctx, startPos, pos);
      } else if (tool === 'rect') {
        ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else if (tool === 'ellipse') {
        const centerX = (startPos.x + pos.x) / 2;
        const centerY = (startPos.y + pos.y) / 2;
        const radiusX = Math.abs(pos.x - startPos.x) / 2;
        const radiusY = Math.abs(pos.y - startPos.y) / 2;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }, [isDrawing, lastPos, startPos, tool, color, brushSize, canvasSnapshot, getCanvasCoords, drawLine, sprayPaint]);

  const handleEnd = useCallback(() => {
    setIsDrawing(false);
    setLastPos(null);
    setStartPos(null);
    setCanvasSnapshot(null);
  }, []);

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Place text on canvas
  const placeText = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !textPos || !textInput) return;

    ctx.fillStyle = color;
    ctx.font = `${brushSize * 6 + 10}px "MS Sans Serif", Arial, sans-serif`;
    ctx.fillText(textInput, textPos.x, textPos.y);

    setShowTextDialog(false);
    setTextInput('');
    setTextPos(null);
  }, [textPos, textInput, color, brushSize]);

  // Simple flood fill implementation
  const floodFill = (ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: string, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const targetColor = getPixelColor(data, startX, startY, width);
    const fill = hexToRgb(fillColor);

    if (!fill || colorsMatch(targetColor, fill)) return;

    const stack: [number, number][] = [[startX, startY]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const key = `${x},${y}`;

      if (visited.has(key) || x < 0 || x >= width || y < 0 || y >= height) continue;

      const currentColor = getPixelColor(data, x, y, width);
      if (!colorsMatch(currentColor, targetColor)) continue;

      visited.add(key);
      setPixelColor(data, x, y, width, fill);

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const getPixelColor = (data: Uint8ClampedArray, x: number, y: number, width: number) => {
    const i = (y * width + x) * 4;
    return { r: data[i], g: data[i + 1], b: data[i + 2] };
  };

  const setPixelColor = (data: Uint8ClampedArray, x: number, y: number, width: number, color: { r: number; g: number; b: number }) => {
    const i = (y * width + x) * 4;
    data[i] = color.r;
    data[i + 1] = color.g;
    data[i + 2] = color.b;
    data[i + 3] = 255;
  };

  const colorsMatch = (a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) => {
    return Math.abs(a.r - b.r) < 10 && Math.abs(a.g - b.g) < 10 && Math.abs(a.b - b.b) < 10;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#C0C0C0',
        userSelect: 'none',
      }}
    >
      {/* Menu Bar */}
      <div
        style={{
          backgroundColor: '#C0C0C0',
          borderBottom: '1px solid #808080',
          padding: '2px 0',
          display: 'flex',
        }}
      >
        <PaintMenuDropdown label="File">
          <PaintMenuItem label="New" onClick={handleClear} />
        </PaintMenuDropdown>
        <PaintMenuDropdown label="Edit">
          <PaintMenuItem label="Clear All" onClick={handleClear} />
        </PaintMenuDropdown>
      </div>

      {/* Tool Bar */}
      <div
        style={{
          display: 'flex',
          gap: '2px',
          padding: '4px',
          borderBottom: '1px solid #808080',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <ToolButton active={tool === 'pencil'} onClick={() => setTool('pencil')} title="Pencil">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5z"/>
          </svg>
        </ToolButton>
        <ToolButton active={tool === 'brush'} onClick={() => setTool('brush')} title="Brush">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04z"/>
          </svg>
        </ToolButton>
        <ToolButton active={tool === 'eraser'} onClick={() => setTool('eraser')} title="Eraser">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"/>
          </svg>
        </ToolButton>
        <ToolButton active={tool === 'fill'} onClick={() => setTool('fill')} title="Fill">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M7.21.8C7.69.295 8 0 8 0c.109.363.234.708.371 1.038.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8zm.413 1.021A31.25 31.25 0 0 0 5.171 4.86a9.04 9.04 0 0 0-.718.932C3.615 6.935 3 8.266 3 10a5 5 0 0 0 10 0c0-1.33-.68-2.457-1.772-3.758-.23-.275-.536-.607-.882-.99a11.48 11.48 0 0 1-.934-.984 10.559 10.559 0 0 1-.5-.549 7.43 7.43 0 0 1-.27-.322z"/>
          </svg>
        </ToolButton>
        <ToolButton active={tool === 'spray'} onClick={() => setTool('spray')} title="Spray Can">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6zm1 0v8h10V6H3z"/>
            <path d="M5 6V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3h-1V3H6v3H5z"/>
            <circle cx="4" cy="2" r="0.8"/>
            <circle cx="6" cy="1" r="0.8"/>
            <circle cx="8" cy="0.5" r="0.8"/>
            <circle cx="10" cy="1" r="0.8"/>
            <circle cx="12" cy="2" r="0.8"/>
          </svg>
        </ToolButton>
        <ToolButton active={tool === 'text'} onClick={() => setTool('text')} title="Text">
          <span style={{ fontWeight: 'bold', fontSize: '12px' }}>A</span>
        </ToolButton>
        <ToolButton active={tool === 'eyedropper'} onClick={() => setTool('eyedropper')} title="Eyedropper">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.708L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2z"/>
          </svg>
        </ToolButton>
        <div style={{ width: '1px', height: '20px', backgroundColor: '#808080', margin: '0 4px' }} />
        <ToolButton active={tool === 'line'} onClick={() => setTool('line')} title="Line">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="2" y1="14" x2="14" y2="2" />
          </svg>
        </ToolButton>
        <ToolButton active={tool === 'rect'} onClick={() => setTool('rect')} title="Rectangle">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="3" width="12" height="10" />
          </svg>
        </ToolButton>
        <ToolButton active={tool === 'ellipse'} onClick={() => setTool('ellipse')} title="Ellipse">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <ellipse cx="8" cy="8" rx="6" ry="4" />
          </svg>
        </ToolButton>
        <div style={{ width: '1px', height: '20px', backgroundColor: '#808080', margin: '0 4px' }} />
        {/* Clear All - Trash can icon */}
        <ToolButton active={false} onClick={handleClear} title="Clear All">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </ToolButton>
        <div style={{ width: '1px', height: '20px', backgroundColor: '#808080', margin: '0 4px' }} />
        <select
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          style={{
            fontFamily: '"MS Sans Serif", Arial, sans-serif',
            fontSize: '11px',
            padding: '2px 4px',
            border: '1px solid #000000',
            backgroundColor: '#C0C0C0',
          }}
        >
          <option value={1}>1px</option>
          <option value={2}>2px</option>
          <option value={4}>4px</option>
          <option value={8}>8px</option>
        </select>
      </div>

      {/* Main area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Canvas Area */}
        <div
          style={{
            flex: 1,
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#808080',
          }}
        >
          <canvas
            ref={canvasRef}
            width={420}
            height={280}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            style={{
              border: '2px inset #808080',
              cursor: 'crosshair',
              touchAction: 'none',
              backgroundColor: '#FFFFFF',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        </div>

        {/* Color Palette */}
        <div
          style={{
            width: '50px',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            borderLeft: '1px solid #808080',
          }}
        >
          {/* Current colors */}
          <div style={{ position: 'relative', width: '32px', height: '32px', marginBottom: '8px' }}>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '20px',
                height: '20px',
                backgroundColor: bgColor,
                border: '1px solid #808080',
              }}
              onClick={() => {
                const temp = color;
                setColor(bgColor);
                setBgColor(temp);
              }}
              title="Background color (click to swap)"
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '20px',
                height: '20px',
                backgroundColor: color,
                border: '1px solid #000',
                boxShadow: '1px 1px 0 rgba(0,0,0,0.3)',
              }}
              title="Foreground color"
            />
          </div>

          {/* Color grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '2px',
            }}
          >
            {COLORS.map((c) => (
              <div
                key={c}
                onClick={() => setColor(c)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setBgColor(c);
                }}
                style={{
                  width: '14px',
                  height: '14px',
                  backgroundColor: c,
                  border: color === c ? '2px solid #000' : '1px solid #808080',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
                title={`Left: foreground\nRight: background`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div
        style={{
          backgroundColor: '#C0C0C0',
          borderTop: '1px solid #808080',
          padding: '2px 6px',
          fontFamily: '"MS Sans Serif", Arial, sans-serif',
          fontSize: '11px',
        }}
      >
        {tool.charAt(0).toUpperCase() + tool.slice(1)} | Size: {brushSize}px
      </div>

      {/* Text Input Dialog */}
      {showTextDialog && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#C0C0C0',
            border: '1px solid #000000',
            padding: '8px',
            zIndex: 100,
          }}
        >
          <div
            style={{
              backgroundColor: '#000080',
              color: '#FFFFFF',
              padding: '2px 6px',
              marginBottom: '8px',
              fontFamily: '"MS Sans Serif", Arial, sans-serif',
              fontSize: '11px',
            }}
          >
            Enter Text
          </div>
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            autoFocus
            style={{
              width: '150px',
              padding: '2px 4px',
              border: '2px inset #808080',
              fontFamily: '"MS Sans Serif", Arial, sans-serif',
              fontSize: '12px',
              marginBottom: '8px',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') placeText();
              if (e.key === 'Escape') {
                setShowTextDialog(false);
                setTextInput('');
                setTextPos(null);
              }
            }}
          />
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
            <button
              onClick={placeText}
              style={{
                padding: '2px 12px',
                backgroundColor: '#C0C0C0',
                border: '1px solid #000000',
                fontFamily: '"MS Sans Serif", Arial, sans-serif',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              OK
            </button>
            <button
              onClick={() => {
                setShowTextDialog(false);
                setTextInput('');
                setTextPos(null);
              }}
              style={{
                padding: '2px 12px',
                backgroundColor: '#C0C0C0',
                border: '1px solid #000000',
                fontFamily: '"MS Sans Serif", Arial, sans-serif',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Tool Button - FLAT 1985 style
function ToolButton({
  children,
  active,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: '26px',
        height: '26px',
        backgroundColor: active ? '#808080' : '#C0C0C0',
        border: '1px solid #000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0,
        color: '#000000',
      }}
    >
      {children}
    </button>
  );
}

// Menu Dropdown
function PaintMenuDropdown({ label, children }: { label: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '2px 10px',
          fontFamily: '"MS Sans Serif", Arial, sans-serif',
          fontSize: '12px',
          cursor: 'pointer',
          backgroundColor: isOpen ? '#000080' : 'transparent',
          color: isOpen ? '#FFFFFF' : '#000000',
        }}
      >
        <span style={{ textDecoration: 'underline' }}>{label[0]}</span>
        {label.slice(1)}
      </div>
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            backgroundColor: '#FFFFFF',
            border: '1px solid #000000',
            zIndex: 100,
            minWidth: '120px',
          }}
          onMouseLeave={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// Menu Item
function PaintMenuItem({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onClick?.()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '2px 20px 2px 8px',
        fontFamily: '"MS Sans Serif", Arial, sans-serif',
        fontSize: '12px',
        cursor: 'pointer',
        backgroundColor: hovered ? '#000080' : 'transparent',
        color: hovered ? '#FFFFFF' : '#000000',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ textDecoration: 'underline' }}>{label[0]}</span>
      {label.slice(1)}
    </div>
  );
}
