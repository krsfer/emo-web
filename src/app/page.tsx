'use client';

import React, { useState, useCallback } from 'react';
import PatternCanvas from '@/components/PatternCanvas';
import EmojiPaletteCarousel from '@/components/EmojiPaletteCarousel';
import { PatternGenerator } from '@/lib/utils/pattern-generator';
import { EMOJI_PALETTES, getDefaultPalette } from '@/lib/constants/emoji-palettes';
import { PatternState, GridCell, PatternMode } from '@/types/pattern';

export default function HomePage() {
  // Pattern state
  const [patternState, setPatternState] = useState<PatternState>(() => 
    PatternGenerator.createPatternState([], PatternMode.CONCENTRIC)
  );
  
  // UI state
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [activePalette, setActivePalette] = useState(getDefaultPalette().id);
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const [undoStack, setUndoStack] = useState<PatternState[]>([]);
  const [redoStack, setRedoStack] = useState<PatternState[]>([]);

  // Generate current pattern grid
  const currentPattern: GridCell[][] = PatternGenerator.generateConcentricPattern(patternState.sequence);

  /**
   * Handles emoji selection from palette
   */
  const handleEmojiSelect = useCallback((emoji: string) => {
    setSelectedEmoji(emoji);
    
    // Save current state to undo stack
    setUndoStack(prev => [...prev, patternState]);
    setRedoStack([]); // Clear redo stack on new action
    
    // Add emoji to pattern sequence (append to end for new outer layer)
    setPatternState(prev => {
      const newSequence = [...prev.sequence];
      // In concentric mode, always append to end to create new outer layer
      newSequence.push(emoji);
      
      return PatternGenerator.createPatternState(newSequence, prev.patternMode);
    });

    // Announce change for screen readers
    const announcer = document.getElementById('aria-live-announcer');
    if (announcer) {
      announcer.textContent = `Added ${emoji} to pattern. Pattern now has ${patternState.sequence.length + 1} emojis.`;
    }
  }, [patternState]);

  /**
   * Handles canvas click interactions
   */
  const handleCanvasClick = useCallback((row: number, col: number) => {
    if (!selectedEmoji) {
      // Announce that user needs to select an emoji first
      const announcer = document.getElementById('aria-live-announcer-assertive');
      if (announcer) {
        announcer.textContent = 'Please select an emoji from the palette first.';
      }
      return;
    }

    // For now, just add the selected emoji to the sequence
    handleEmojiSelect(selectedEmoji);
  }, [selectedEmoji, handleEmojiSelect]);

  /**
   * Clears the current pattern
   */
  const handleClearPattern = useCallback(() => {
    setUndoStack(prev => [...prev, patternState]);
    setRedoStack([]);
    setPatternState(PatternGenerator.createPatternState([], PatternMode.CONCENTRIC));
    setSelectedEmoji('');
    
    const announcer = document.getElementById('aria-live-announcer');
    if (announcer) {
      announcer.textContent = 'Pattern cleared. Canvas is now empty.';
    }
  }, [patternState]);

  /**
   * Undo last action
   */
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;

    const previousState = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, patternState]);
    setPatternState(previousState);

    const announcer = document.getElementById('aria-live-announcer');
    if (announcer) {
      announcer.textContent = `Undo successful. Pattern now has ${previousState.sequence.length} emojis.`;
    }
  }, [undoStack, patternState]);

  /**
   * Redo last undone action
   */
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, patternState]);
    setPatternState(nextState);

    const announcer = document.getElementById('aria-live-announcer');
    if (announcer) {
      announcer.textContent = `Redo successful. Pattern now has ${nextState.sequence.length} emojis.`;
    }
  }, [redoStack, patternState]);

  /**
   * Share pattern (placeholder)
   */
  const handleShare = useCallback(() => {
    // Placeholder for share functionality
    const announcer = document.getElementById('aria-live-announcer');
    if (announcer) {
      announcer.textContent = 'Share feature coming soon!';
    }
  }, []);

  /**
   * Generate AI pattern (placeholder)
   */
  const handleAIGenerate = useCallback(() => {
    // Placeholder for AI generation
    const announcer = document.getElementById('aria-live-announcer');
    if (announcer) {
      announcer.textContent = 'AI pattern generation coming soon!';
    }
  }, []);

  /**
   * Toggle language
   */
  const handleLanguageToggle = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  }, []);

  return (
    <div className="mobile-app-container">
      {/* Top Navigation Bar */}
      <nav className="top-nav" role="navigation" aria-label="Main navigation">
        <div className="nav-left">
          <button 
            className="nav-button"
            onClick={handleLanguageToggle}
            aria-label={`Switch to ${language === 'en' ? 'French' : 'English'}`}
            type="button"
          >
            {language === 'en' ? '🇬🇧' : '🇫🇷'}
          </button>
          <button 
            className="nav-button"
            aria-label="Search patterns"
            type="button"
          >
            🔍
          </button>
          <button 
            className="nav-button"
            aria-label="Open menu"
            type="button"
          >
            ☰
          </button>
        </div>
        <div className="nav-right">
          <button 
            className="nav-button"
            aria-label="Favorites"
            type="button"
          >
            🧡
          </button>
          <button 
            className="nav-button"
            onClick={handleAIGenerate}
            aria-label="Generate AI pattern"
            type="button"
          >
            ✨
          </button>
          <button 
            className="nav-button"
            onClick={handleClearPattern}
            aria-label="Clear pattern"
            disabled={patternState.sequence.length === 0}
            type="button"
          >
            ❌
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="main-content">
        <div className="canvas-section">
          <div className="canvas-wrapper">
            {patternState.sequence.length === 0 ? (
              <div className="empty-canvas">
                <div className="empty-canvas-icon">🎨</div>
                <div className="empty-canvas-text">
                  Select emojis from below to create your pattern
                </div>
              </div>
            ) : (
              <PatternCanvas
                pattern={currentPattern}
                onCellClick={handleCanvasClick}
                readonly={false}
                cellSize={30}
                animationEnabled={true}
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="bottom-panel">
        {/* Emoji Palette */}
        <div className="emoji-palette-section">
          <EmojiPaletteCarousel
            palettes={EMOJI_PALETTES}
            activePalette={activePalette}
            onPaletteChange={setActivePalette}
            onEmojiSelect={handleEmojiSelect}
            selectedEmoji={selectedEmoji}
            language={language}
          />
        </div>

        {/* Bottom Toolbar */}
        <div className="bottom-toolbar">
          <div className="toolbar-group">
            <button
              className="toolbar-button"
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              aria-label="Undo last action"
              type="button"
            >
              ↶
            </button>
            <button
              className="toolbar-button"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              aria-label="Redo last action"
              type="button"
            >
              ↷
            </button>
          </div>

          <div className="toolbar-group">
            <button
              className="toolbar-button"
              onClick={handleShare}
              aria-label="Share pattern"
              type="button"
            >
              📤
            </button>
            <div className="counter-badge">
              {patternState.sequence.length}
            </div>
            <button
              className="toolbar-button primary"
              onClick={() => handleEmojiSelect(selectedEmoji)}
              disabled={!selectedEmoji}
              aria-label="Add selected emoji"
              type="button"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}