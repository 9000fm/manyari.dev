'use client';

import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'win31-notepad-content';

export default function Notepad() {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('Untitled');
  const [isModified, setIsModified] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setContent(data.content || '');
        setFileName(data.fileName || 'Untitled');
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsModified(true);
  };

  const handleNew = () => {
    if (isModified && !confirm('Current file has unsaved changes. Create new file?')) {
      return;
    }
    setContent('');
    setFileName('Untitled');
    setIsModified(false);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ content, fileName }));
    setIsModified(false);
  };

  const handleCopy = () => {
    const textarea = document.querySelector('#notepad-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
      if (selectedText) {
        navigator.clipboard.writeText(selectedText);
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const textarea = document.querySelector('#notepad-textarea') as HTMLTextAreaElement;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = content.substring(0, start) + text + content.substring(end);
        setContent(newContent);
        setIsModified(true);
      }
    } catch {
      // Clipboard access denied
    }
  };

  const handleCut = () => {
    handleCopy();
    const textarea = document.querySelector('#notepad-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start !== end) {
        const newContent = content.substring(0, start) + content.substring(end);
        setContent(newContent);
        setIsModified(true);
      }
    }
  };

  const handleSelectAll = () => {
    const textarea = document.querySelector('#notepad-textarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.select();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#C0C0C0',
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
        <MenuDropdown label="File">
          <NotepadMenuItem label="New" onClick={handleNew} shortcut="Ctrl+N" />
          <NotepadMenuItem label="Save" onClick={handleSave} shortcut="Ctrl+S" />
        </MenuDropdown>
        <MenuDropdown label="Edit">
          <NotepadMenuItem label="Cut" onClick={handleCut} shortcut="Ctrl+X" />
          <NotepadMenuItem label="Copy" onClick={handleCopy} shortcut="Ctrl+C" />
          <NotepadMenuItem label="Paste" onClick={handlePaste} shortcut="Ctrl+V" />
          <div style={{ height: '1px', backgroundColor: '#808080', margin: '4px 2px' }} />
          <NotepadMenuItem label="Select All" onClick={handleSelectAll} shortcut="Ctrl+A" />
        </MenuDropdown>
      </div>

      {/* Text Area */}
      <textarea
        id="notepad-textarea"
        value={content}
        onChange={handleChange}
        placeholder="Type here..."
        style={{
          flex: 1,
          resize: 'none',
          border: '2px inset #808080',
          margin: '4px',
          padding: '4px',
          fontFamily: 'Fixedsys, Consolas, monospace',
          fontSize: '13px',
          lineHeight: 1.4,
          backgroundColor: '#FFFFFF',
          color: '#000000',
          outline: 'none',
        }}
      />

      {/* Status Bar */}
      <div
        style={{
          backgroundColor: '#C0C0C0',
          borderTop: '1px solid #808080',
          padding: '2px 6px',
          fontFamily: '"MS Sans Serif", Arial, sans-serif',
          fontSize: '11px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>{fileName}{isModified ? ' *' : ''}</span>
        <span>{content.length} chars</span>
      </div>
    </div>
  );
}

// Menu Dropdown
function MenuDropdown({ label, children }: { label: string; children: React.ReactNode }) {
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
            minWidth: '150px',
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
function NotepadMenuItem({
  label,
  onClick,
  shortcut,
}: {
  label: string;
  onClick?: () => void;
  shortcut?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => {
        onClick?.();
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '2px 20px 2px 8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: '"MS Sans Serif", Arial, sans-serif',
        fontSize: '12px',
        cursor: 'pointer',
        backgroundColor: hovered ? '#000080' : 'transparent',
        color: hovered ? '#FFFFFF' : '#000000',
        whiteSpace: 'nowrap',
      }}
    >
      <span>
        <span style={{ textDecoration: 'underline' }}>{label[0]}</span>
        {label.slice(1)}
      </span>
      {shortcut && <span style={{ marginLeft: '20px', opacity: 0.7 }}>{shortcut}</span>}
    </div>
  );
}
