/**
 * GEAR RUSH - Game Over Screen
 * Shows run results, high score comparisons, record fanfare, Top 50 Qualification check & submission
 */

import React, { useEffect, useState } from 'react';
import { RotateCcw, Home, Trophy, Sparkles, Send, Check, Loader2 } from 'lucide-react';
import { soundManager } from '../game/audio/soundManager';
import confetti from 'canvas-confetti';
import { checkIfQualifiesForTop50, submitLeaderboardScore } from '../game/firebase';

interface GameOverModalProps {
  score: number;
  height: number;
  highScore: number;
  isNewRecord: boolean;
  onPlayAgain: () => void;
  onMenu: () => void;
  onShowLeaderboard?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  height,
  highScore,
  isNewRecord,
  onPlayAgain,
  onMenu,
  onShowLeaderboard
}) => {
  const [qualifiesTop50, setQualifiesTop50] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (isNewRecord || score >= highScore) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Check if score enters Top 50
    let mounted = true;
    checkIfQualifiesForTop50(score).then(qualifies => {
      if (mounted) {
        setQualifiesTop50(qualifies);
        if (qualifies) {
          soundManager.playMilestone();
        }
      }
    });

    return () => {
      mounted = false;
    };
  }, [score, highScore, isNewRecord]);

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || isSubmitting || submitted) return;

    setIsSubmitting(true);
    soundManager.playButtonClick();

    const success = await submitLeaderboardScore(playerName, score, height);
    setIsSubmitting(false);

    if (success) {
      setSubmitted(true);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-3 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="bg-stone-900 border-2 border-red-700/80 rounded-2xl w-full max-w-[380px] flex flex-col shadow-[0_0_35px_rgba(220,38,38,0.4)] overflow-hidden text-stone-200">
        
        {/* Header */}
        <div className="bg-gradient-to-b from-red-950 to-stone-950 p-3.5 border-b border-red-900/60 text-center">
          {isNewRecord || score > highScore ? (
            <div className="flex flex-col items-center">
              <span className="text-2xl animate-bounce">👑</span>
              <h2 className="text-xl font-black font-chakra text-amber-300 uppercase tracking-widest drop-shadow">
                ¡NUEVO RÉCORD!
              </h2>
              <span className="text-[10px] text-amber-400 font-pixel mt-0.5">¡FELICIDADES!</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-0.5">💀</span>
              <h2 className="text-2xl font-black font-teko text-red-500 uppercase tracking-widest">
                GAME OVER
              </h2>
              <span className="text-[10px] text-stone-400 font-chakra">Fin de la escalada</span>
            </div>
          )}
        </div>

        {/* Results Card */}
        <div className="p-4 space-y-3 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-2.5">
            {/* Score */}
            <div className="bg-stone-950 p-2.5 rounded-xl border border-amber-500/40 flex flex-col items-center">
              <span className="text-[9px] font-pixel text-amber-400 uppercase">PUNTAJE</span>
              <span className="text-xl font-black font-chakra text-amber-300 mt-0.5">
                {score.toLocaleString()}
              </span>
            </div>

            {/* Height */}
            <div className="bg-stone-950 p-2.5 rounded-xl border border-cyan-500/40 flex flex-col items-center">
              <span className="text-[9px] font-pixel text-cyan-400 uppercase">ALTURA</span>
              <span className="text-xl font-black font-chakra text-cyan-300 mt-0.5">
                {height} m
              </span>
            </div>
          </div>

          {/* Top 50 Qualification Box */}
          {qualifiesTop50 && (
            <div className="bg-amber-950/40 border-2 border-amber-500/80 rounded-xl p-3 text-center space-y-2 animate-in zoom-in duration-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <div className="flex items-center justify-center gap-1.5 text-amber-400">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span className="text-xs font-black font-chakra uppercase tracking-wide">
                  ¡Estás dentro del Top 50!
                </span>
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmitScore} className="space-y-2">
                  <p className="text-[11px] text-stone-300 font-chakra">
                    Agrega tu nombre para registrar tu marca en la tabla global:
                  </p>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      maxLength={20}
                      value={playerName}
                      onChange={e => setPlayerName(e.target.value)}
                      placeholder="Tu Nombre / Apodo"
                      required
                      className="bg-stone-950 border border-stone-700 text-amber-300 px-3 py-1.5 rounded-lg text-xs font-chakra font-bold w-full focus:outline-none focus:border-amber-500 placeholder:text-stone-600"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || !playerName.trim()}
                      className="gear-btn gear-btn-green py-1.5 px-3 rounded-lg flex items-center gap-1 text-xs font-bold font-chakra shrink-0 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>GUARDAR</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-emerald-950/60 border border-emerald-500/80 rounded-lg p-2 flex items-center justify-center gap-2 text-emerald-300">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold font-chakra">¡Récord guardado con éxito!</span>
                </div>
              )}
            </div>
          )}

          {/* High Score Banner & Leaderboard Access */}
          <div className="bg-stone-950/80 p-2.5 rounded-xl border border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-stone-300 font-chakra">MEJOR PUNTAJE:</span>
            </div>
            <span className="text-sm font-black text-amber-400 font-chakra">
              {Math.max(score, highScore).toLocaleString()}
            </span>
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-1">
            {onShowLeaderboard && (
              <button
                onClick={() => {
                  soundManager.playButtonClick();
                  onShowLeaderboard();
                }}
                className="bg-amber-950/80 hover:bg-amber-900 border border-amber-600/80 text-amber-300 w-full py-2 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-black font-chakra tracking-wide cursor-pointer transition-colors"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>VER TABLA TOP 50</span>
              </button>
            )}

            <button
              onClick={() => {
                soundManager.playButtonClick();
                onPlayAgain();
              }}
              className="gear-btn gear-btn-green w-full py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 text-sm font-black font-chakra tracking-wide cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>JUGAR DE NUEVO</span>
            </button>

            <button
              onClick={() => {
                soundManager.playButtonClick();
                onMenu();
              }}
              className="gear-btn gear-btn-blue w-full py-2 px-6 rounded-xl flex items-center justify-center gap-2 text-xs font-black font-chakra tracking-wide cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>MENÚ PRINCIPAL</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-950 py-1.5 px-4 text-center border-t border-stone-800 text-[10px] text-amber-400/80 font-chakra font-semibold tracking-wide">
          GEAR RUSH • Comercial Jarros
        </div>
      </div>
    </div>
  );
};
