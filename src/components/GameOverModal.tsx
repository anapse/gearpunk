/**
 * GEAR RUSH - Game Over Screen
 * Shows run results, high score comparisons, record fanfare, and quick retry
 */

import React, { useEffect } from 'react';
import { RotateCcw, Home, Trophy, Sparkles } from 'lucide-react';
import { soundManager } from '../game/audio/soundManager';
import confetti from 'canvas-confetti';

interface GameOverModalProps {
  score: number;
  height: number;
  highScore: number;
  isNewRecord: boolean;
  onPlayAgain: () => void;
  onMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  height,
  highScore,
  isNewRecord,
  onPlayAgain,
  onMenu
}) => {
  useEffect(() => {
    if (isNewRecord || score >= highScore) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isNewRecord, score, highScore]);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-900 border-2 border-red-700/80 rounded-2xl w-full max-w-[380px] flex flex-col shadow-[0_0_35px_rgba(220,38,38,0.4)] overflow-hidden text-stone-200">
        {/* Header */}
        <div className="bg-gradient-to-b from-red-950 to-stone-950 p-4 border-b border-red-900/60 text-center">
          {isNewRecord || score > highScore ? (
            <div className="flex flex-col items-center">
              <span className="text-3xl animate-bounce">👑</span>
              <h2 className="text-2xl font-black font-chakra text-amber-300 uppercase tracking-widest drop-shadow">
                ¡NUEVO RÉCORD!
              </h2>
              <span className="text-xs text-amber-400 font-pixel mt-0.5">¡FELICIDADES!</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-1">💀</span>
              <h2 className="text-2xl font-black font-teko text-red-500 uppercase tracking-widest text-3xl">
                GAME OVER
              </h2>
              <span className="text-xs text-stone-400 font-chakra">Fin de la escalada</span>
            </div>
          )}
        </div>

        {/* Results Card */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Score */}
            <div className="bg-stone-950 p-3 rounded-xl border border-amber-500/40 flex flex-col items-center">
              <span className="text-[10px] font-pixel text-amber-400 uppercase">PUNTAJE</span>
              <span className="text-2xl font-black font-chakra text-amber-300 mt-1">
                {score.toLocaleString()}
              </span>
            </div>

            {/* Height */}
            <div className="bg-stone-950 p-3 rounded-xl border border-cyan-500/40 flex flex-col items-center">
              <span className="text-[10px] font-pixel text-cyan-400 uppercase">ALTURA</span>
              <span className="text-2xl font-black font-chakra text-cyan-300 mt-1">
                {height} m
              </span>
            </div>
          </div>

          {/* High Score Banner */}
          <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-stone-300 font-chakra">MEJOR PUNTAJE:</span>
            </div>
            <span className="text-base font-black text-amber-400 font-chakra">
              {Math.max(score, highScore).toLocaleString()}
            </span>
          </div>

          {/* Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={() => {
                soundManager.playButtonClick();
                onPlayAgain();
              }}
              className="gear-btn gear-btn-green w-full py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-base font-black font-chakra tracking-wide cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>JUGAR DE NUEVO</span>
            </button>

            <button
              onClick={() => {
                soundManager.playButtonClick();
                onMenu();
              }}
              className="gear-btn gear-btn-blue w-full py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 text-sm font-black font-chakra tracking-wide cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>MENÚ PRINCIPAL</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-950 py-2 px-4 text-center border-t border-stone-800 text-[11px] text-amber-400 font-chakra font-semibold tracking-wide">
          GEAR RUSH • Dedicado a Violenti
        </div>
      </div>
    </div>
  );
};
