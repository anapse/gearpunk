/**
 * GEAR RUSH - In-Game HUD
 * 3 Hearts (6 half-hearts), Climb/Jump Counter, Score, Altitude (m), Powerup timers, Pause button
 * Clean, minimal interface without on-screen buttons (Pure touch/mouse gesture control)
 */

import React from 'react';
import { GameScoreState } from '../game/types';
import { Pause, ArrowUpCircle } from 'lucide-react';

interface HUDProps {
  scoreState: GameScoreState;
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({ scoreState, onPause }) => {
  // Render 3 hearts from scoreState.hearts (0 to 6 half-hearts)
  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < 3; i++) {
      const heartValue = scoreState.hearts - i * 2;
      if (heartValue >= 2) {
        // Full heart ❤️
        hearts.push(
          <span key={i} className="text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.9)] text-lg md:text-xl animate-pulse">
            ❤️
          </span>
        );
      } else if (heartValue === 1) {
        // Half heart 💔
        hearts.push(
          <div key={i} className="relative inline-block text-lg md:text-xl">
            <span className="text-zinc-800 opacity-90">🖤</span>
            <span className="absolute left-0 top-0 overflow-hidden w-[50%] text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.9)]">
              ❤️
            </span>
          </div>
        );
      } else {
        // Empty heart 🖤
        hearts.push(
          <span key={i} className="text-zinc-800 opacity-50 text-lg md:text-xl">
            🖤
          </span>
        );
      }
    }
    return hearts;
  };

  return (
    <div className="absolute top-0 left-0 right-0 p-2.5 flex flex-col gap-1.5 z-20 pointer-events-none select-none">
      {/* Top Main Bar: Hearts | Subidas | Puntaje | Altura | Pausa */}
      <div className="flex items-center justify-between gap-1.5 w-full">
        {/* Hearts Container */}
        <div className="bg-stone-900/95 border border-red-700/80 rounded-xl px-2 py-1 flex items-center gap-1 shadow-lg backdrop-blur-md pointer-events-auto">
          {renderHearts()}
        </div>

        {/* Counter of times climbed */}
        <div className="bg-stone-900/95 border border-emerald-600/80 rounded-xl px-2.5 py-0.5 flex flex-col items-center shadow-lg backdrop-blur-md">
          <span className="text-[8px] uppercase font-bold tracking-wider text-emerald-400 font-pixel flex items-center gap-0.5">
            <ArrowUpCircle className="w-2.5 h-2.5" /> SUBIDAS
          </span>
          <span className="text-sm font-black text-emerald-300 font-chakra leading-tight">
            {scoreState.jumpsCount}
          </span>
        </div>

        {/* Score Panel */}
        <div className="bg-stone-900/95 border border-amber-600/80 rounded-xl px-2.5 py-0.5 flex flex-col items-center shadow-lg backdrop-blur-md">
          <span className="text-[8px] uppercase font-bold tracking-wider text-amber-400 font-pixel">PUNTAJE</span>
          <span className="text-sm font-black text-amber-300 font-chakra leading-tight">
            {scoreState.score.toLocaleString()}
          </span>
        </div>

        {/* Height Panel */}
        <div className="bg-stone-900/95 border border-cyan-600/80 rounded-xl px-2.5 py-0.5 flex flex-col items-center shadow-lg backdrop-blur-md">
          <span className="text-[8px] uppercase font-bold tracking-wider text-cyan-400 font-pixel">ALTURA</span>
          <span className="text-sm font-black text-cyan-300 font-chakra leading-tight">
            {scoreState.height}m
          </span>
        </div>

        {/* Pause Button */}
        <button
          onClick={onPause}
          className="bg-stone-800/95 hover:bg-stone-700 active:bg-stone-900 border border-stone-600 text-stone-200 p-1.5 rounded-xl shadow-md pointer-events-auto transition-transform active:scale-95 cursor-pointer"
          title="Pausar juego"
        >
          <Pause className="w-4 h-4" />
        </button>
      </div>

      {/* Active Powerup Badges */}
      <div className="flex items-center gap-2 px-1">
        {scoreState.activeMagnetTimer > 0 && (
          <div className="bg-sky-950/90 border border-sky-400 text-sky-200 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md animate-bounce">
            <span>🧲 IMÁN</span>
            <span className="font-bold">{scoreState.activeMagnetTimer.toFixed(1)}s</span>
          </div>
        )}
        {scoreState.activeSlowMoTimer > 0 && (
          <div className="bg-amber-950/90 border border-amber-400 text-amber-200 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md animate-pulse">
            <span>⏱ RELOJ</span>
            <span className="font-bold">{scoreState.activeSlowMoTimer.toFixed(1)}s</span>
          </div>
        )}
      </div>
    </div>
  );
};
