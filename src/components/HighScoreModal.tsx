/**
 * GEAR RUSH - High Score Modal
 * Persistent best score, max height, total games played, and stats
 */

import React from 'react';
import { X, Trophy, Flame, Zap, Award } from 'lucide-react';
import { soundManager } from '../game/audio/soundManager';

interface HighScoreModalProps {
  highScore: number;
  maxHeight: number;
  onClose: () => void;
}

export const HighScoreModal: React.FC<HighScoreModalProps> = ({ highScore, maxHeight, onClose }) => {
  const gamesCount = parseInt(localStorage.getItem('gearrush_games_count') || '0', 10);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="bg-stone-900 border-2 border-amber-600/80 rounded-2xl w-full max-w-[380px] flex flex-col shadow-[0_0_30px_rgba(245,158,11,0.3)] overflow-hidden text-stone-200">
        {/* Header */}
        <div className="bg-stone-950 p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400 animate-bounce" />
            <h2 className="text-lg font-black font-chakra text-amber-400 uppercase tracking-wider">
              MAYOR PUNTAJE
            </h2>
          </div>
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onClose();
            }}
            className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {highScore > 0 ? (
            <>
              {/* Record Crown */}
              <div className="bg-gradient-to-b from-amber-950/60 to-stone-950 p-4 rounded-xl border border-amber-500/40 flex flex-col items-center text-center shadow-inner">
                <span className="text-3xl mb-1">👑</span>
                <span className="text-xs uppercase font-pixel text-amber-400 font-bold tracking-wider">
                  RÉCORD HISTÓRICO
                </span>
                <span className="text-4xl font-black font-teko text-amber-300 mt-1">
                  {highScore.toLocaleString()} PTS
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex flex-col items-center">
                  <div className="flex items-center gap-1 text-cyan-400 text-xs font-bold font-chakra mb-1">
                    <Award className="w-4 h-4" />
                    <span>MAYOR ALTURA</span>
                  </div>
                  <span className="text-xl font-black font-chakra text-cyan-300">
                    {maxHeight} m
                  </span>
                </div>

                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex flex-col items-center">
                  <div className="flex items-center gap-1 text-orange-400 text-xs font-bold font-chakra mb-1">
                    <Flame className="w-4 h-4" />
                    <span>PARTIDAS</span>
                  </div>
                  <span className="text-xl font-black font-chakra text-orange-300">
                    {gamesCount}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-stone-950/80 p-6 rounded-xl border border-stone-800 text-center space-y-2">
              <span className="text-3xl">🎮</span>
              <h3 className="font-bold text-stone-300 font-chakra text-sm">AÚN NO HAY RÉCORD</h3>
              <p className="text-xs text-stone-500">
                ¡Juega tu primera partida y escala las 5 zonas de engranajes!
              </p>
            </div>
          )}

          {/* Tribute note in record screen */}
          <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800/80 text-center">
            <span className="text-[11px] text-amber-400 font-chakra font-semibold tracking-wide">
              GEAR RUSH • Dedicado a Violenti
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-950 p-3 border-t border-stone-800 flex justify-center">
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onClose();
            }}
            className="gear-btn gear-btn-purple py-2 px-8 rounded-lg font-bold font-chakra text-sm"
          >
            VOLVER AL MENÚ
          </button>
        </div>
      </div>
    </div>
  );
};
