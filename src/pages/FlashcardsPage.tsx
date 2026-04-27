import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Timer, Lightbulb, Code, ListCheck, BookOpen } from 'lucide-react';
import { FLASHCARDS, Flashcard } from '../data/flashcards';

export const FlashcardsPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [viewedCount, setViewedCount] = useState(0);

  const currentCard = FLASHCARDS[currentIndex];

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % FLASHCARDS.length);
    setTimeLeft(60);
  }, []);

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + FLASHCARDS.length) % FLASHCARDS.length);
    setTimeLeft(60);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && !isActive) {
      setIsActive(true);
    }
  };

  const resetTimer = () => {
    setTimeLeft(60);
    setIsActive(false);
  };

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Load viewed progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('o1knot_flashcards_viewed');
    if (saved) {
      const viewed = JSON.parse(saved);
      if (!viewed.includes(currentCard.id)) {
        const newViewed = [...viewed, currentCard.id];
        localStorage.setItem('o1knot_flashcards_viewed', JSON.stringify(newViewed));
        setViewedCount(newViewed.length);
      } else {
        setViewedCount(viewed.length);
      }
    } else {
      localStorage.setItem('o1knot_flashcards_viewed', JSON.stringify([currentCard.id]));
      setViewedCount(1);
    }
  }, [currentIndex, currentCard.id]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-[var(--c-text)]">Pattern Flashcards</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--c-accent)]/10 text-[var(--c-accent)] font-bold border border-[var(--c-accent)]/20">BETA</span>
          </div>
          <p className="text-[var(--c-text-3)] mt-1">Master core patterns in 60 seconds each</p>
        </div>
        
        <div className="flex items-center space-x-6 bg-[var(--c-panel)] px-6 py-3 rounded-2xl border border-[var(--c-border)] shadow-sm">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-[var(--c-text-3)] font-bold mb-1">Progress</span>
            <span className="text-lg font-mono font-bold text-[var(--c-accent)]">{viewedCount}/{FLASHCARDS.length}</span>
          </div>
          <div className="w-px h-8 bg-[var(--c-border)]" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-[var(--c-text-3)] font-bold mb-1">Card Timer</span>
            <div className={`flex items-center space-x-2 ${timeLeft <= 10 ? 'text-[var(--c-danger)] animate-pulse' : 'text-[var(--c-text)]'}`}>
              <Timer size={18} />
              <span className="text-lg font-mono font-bold">{timeLeft}s</span>
            </div>
          </div>
          <button 
            onClick={resetTimer}
            className="p-2 hover:bg-[var(--c-surface)] rounded-lg transition-colors text-[var(--c-text-3)] hover:text-[var(--c-text)]"
            title="Reset Timer"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Main Flashcard Container */}
      <div className="relative h-[450px] w-full perspective-1000 mb-10 group">
        <div 
          className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={toggleFlip}
        >
          {/* Front Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-[var(--c-panel)] rounded-3xl border-2 border-[var(--c-border)] shadow-xl flex flex-col p-8 md:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--c-accent)] opacity-[0.03] rounded-full -mr-16 -mt-16" />
            
            <div className="mb-auto">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[var(--c-accent)]/10 text-[var(--c-accent)] mb-4">
                Pattern {currentIndex + 1}
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-[var(--c-text)] leading-tight mb-6">
                {currentCard.name}
              </h2>
              <p className="text-xl text-[var(--c-text-2)] leading-relaxed">
                {currentCard.definition}
              </p>
            </div>
            
            <div className="flex items-center justify-center text-[var(--c-text-3)] font-medium text-sm animate-bounce">
              <RotateCcw size={14} className="mr-2" />
              Click to reveal details
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-[var(--c-panel)] rounded-3xl border-2 border-[var(--c-accent)]/30 shadow-2xl rotate-y-180 flex flex-col p-8 overflow-y-auto custom-scrollbar">
            <div className="space-y-8">
              <section>
                <h3 className="flex items-center text-sm font-bold uppercase tracking-widest text-[var(--c-accent)] mb-3">
                  <Lightbulb size={16} className="mr-2" />
                  When to Use
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentCard.whenToUse.map((item, i) => (
                    <li key={i} className="flex items-start bg-[var(--c-surface)] p-3 rounded-xl border border-[var(--c-border)] text-sm text-[var(--c-text-2)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-accent)] mt-1.5 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="flex items-center text-sm font-bold uppercase tracking-widest text-[var(--c-accent)] mb-3">
                  <Code size={16} className="mr-2" />
                  Code Template
                </h3>
                <pre className="bg-[#0f1117] text-gray-300 p-5 rounded-xl text-xs font-mono overflow-x-auto border border-white/5">
                  <code>{currentCard.codeTemplate}</code>
                </pre>
              </section>

              <section>
                <h3 className="flex items-center text-sm font-bold uppercase tracking-widest text-[var(--c-accent)] mb-3">
                  <ListCheck size={16} className="mr-2" />
                  Key Problems
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentCard.examples.map((ex, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[var(--c-surface)] text-[var(--c-text-2)] text-xs font-medium rounded-lg border border-[var(--c-border)]">
                      {ex}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <button 
          onClick={handlePrev}
          className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[var(--c-panel)] border border-[var(--c-border)] text-[var(--c-text)] hover:bg-[var(--c-surface)] transition-all font-bold shadow-sm"
        >
          <ChevronLeft size={20} />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-2 text-[var(--c-text-3)] font-mono text-sm">
          <span className="font-bold text-[var(--c-text)]">{currentIndex + 1}</span>
          <span>/</span>
          <span>{FLASHCARDS.length}</span>
        </div>

        <button 
          onClick={handleNext}
          className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[var(--c-accent)] text-white hover:bg-[var(--c-accent-h)] transition-all font-bold shadow-md shadow-indigo-500/20"
        >
          <span>Next Pattern</span>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Keyboard Hint */}
      <p className="text-center mt-12 text-xs text-[var(--c-text-3)] font-medium">
        Use <kbd className="px-2 py-1 bg-[var(--c-surface)] border border-[var(--c-border)] rounded text-[var(--c-text)]">Space</kbd> to flip and <kbd className="px-2 py-1 bg-[var(--c-surface)] border border-[var(--c-border)] rounded text-[var(--c-text)]">←</kbd> <kbd className="px-2 py-1 bg-[var(--c-surface)] border border-[var(--c-border)] rounded text-[var(--c-text)]">→</kbd> keys to navigate.
      </p>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .rotate-y-180-reverse { transform: rotateY(-180deg); }
      `}</style>
    </div>
  );
};
