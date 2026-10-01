/**
 * GEAR RUSH - In-Game HUD
 * Compact layout with Hearts, Score, Altitude, Climb Counter, Powerup Badges & Pause button.
 * Designed strictly to fit inside the 480px viewport without overflow.
 */

import React, { useEffect, useState } from 'react';
import { GameScoreState } from '../game/types';
import { Pause, ArrowUpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HUDProps {
  scoreState: GameScoreState;
  onPause: () => void;
  onShowLeaderboard?: () => void;
}

export const HUD: React.FC<HUDProps> = ({ scoreState, onPause }) => {
  const [prevScore, setPrevScore] = useState(0);
  const [prevHeight, setPrevHeight] = useState(0);

  useEffect(() => {
    setPrevScore(scoreState.score);
  }, [scoreState.score]);

  useEffect(() => {
    setPrevHeight(scoreState.height);
  }, [scoreState.height]);

  // Render 3 hearts from scoreState.hearts (0 to 6 half-hearts)
  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < 3; i++) {
      const heartValue = scoreState.hearts - i * 2;
      if (heartValue >= 2) {
        hearts.push(
          <motion.span 
            key={`heart-full-${i}`} 
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-red-500 drop-shadow-[0_0_4px_rgba(239,68,68,0.8)] text-sm"
          >
            ❤️
          </motion.span>
        );
      } else if (heartValue === 1) {
        hearts.push(
          <div key={`heart-half-${i}`} className="relative inline-block text-sm">
            <span className="text-zinc-800 opacity-90">🖤</span>
            <span className="absolute left-0 top-0 overflow-hidden w-[50%] text-red-500 drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]">
              ❤️
            </span>
          </div>
        );
      } else {
        hearts.push(
          <span key={`heart-empty-${i}`} className="text-zinc-800 opacity-50 text-sm">
            🖤
          </span>
        );
      }
    }
    return hearts;
  };

  return (
    <div className="absolute top-0 left-0 right-0 p-1.5 flex flex-col gap-1 z-20 pointer-events-none select-none max-w-[480px] mx-auto w-full box-border">
      {/* Top Main Bar: Compact, responsive flex grid */}
      <div className="flex items-center justify-between gap-1 w-full px-0.5">
        
        {/* Left Group: Hearts + Subidas */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Hearts Container */}
          <div className="bg-stone-900/95 border border-red-700/80 rounded-lg px-1.5 py-1 flex items-center gap-0.5 shadow-md backdrop-blur-md pointer-events-auto">
            {renderHearts()}
          </div>

          {/* Subidas */}
          <motion.div 
            key={`jumps-${scoreState.jumpsCount}`}
            animate={{ scale: [1, 1.15, 1] }}
            className="bg-stone-900/95 border border-emerald-600/80 rounded-lg px-1.5 py-0.5 flex flex-col items-center shadow-md backdrop-blur-md min-w-[38px]"
          >
            <span className="text-[7px] uppercase font-bold tracking-tight text-emerald-400 font-pixel flex items-center gap-0.5">
              <ArrowUpCircle className="w-2 h-2" /> SUB
            </span>
            <span className="text-xs font-black text-emerald-300 font-chakra leading-tight">
              {scoreState.jumpsCount}
            </span>
          </motion.div>
        </div>

        {/* Center/Right Group: Score + Height */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Score Panel */}
          <motion.div 
            key={`score-${scoreState.score}`}
            animate={{ scale: [1, 1.2, 1] }}
            className="bg-stone-900/95 border border-amber-600/80 rounded-lg px-2 py-0.5 flex flex-col items-center shadow-md backdrop-blur-md min-w-[50px]"
          >
            <span className="text-[7px] uppercase font-bold tracking-tight text-amber-400 font-pixel">PUNTAJE</span>
            <span className="text-xs font-black text-amber-300 font-chakra leading-tight">
              {scoreState.score.toLocaleString()}
            </span>
          </motion.div>

          {/* Height Panel */}
          <motion.div 
            key={`height-${scoreState.height}`}
            animate={{ scale: [1, 1.15, 1] }}
            className="bg-stone-900/95 border border-cyan-600/80 rounded-lg px-1.5 py-0.5 flex flex-col items-center shadow-md backdrop-blur-md min-w-[42px]"
          >
            <span className="text-[7px] uppercase font-bold tracking-tight text-cyan-400 font-pixel">ALTURA</span>
            <span className="text-xs font-black text-cyan-300 font-chakra leading-tight">
              {scoreState.height}m
            </span>
          </motion.div>
        </div>

        {/* Action Button: Pause */}
        <div className="flex items-center gap-1 shrink-0 pointer-events-auto">
          <button
            onClick={onPause}
            className="bg-stone-800/95 hover:bg-stone-700 active:bg-stone-900 border border-stone-600 text-stone-200 p-1.5 rounded-lg shadow-md transition-transform active:scale-95 cursor-pointer flex items-center justify-center"
            title="Pausar juego"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active Powerup Badges */}
      <div className="flex items-center gap-1.5 px-0.5">
        <AnimatePresence>
          {scoreState.activeMagnetTimer > 0 && (
            <motion.div 
              key="badge-magnet"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="bg-sky-950/90 border border-sky-400 text-sky-200 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md"
            >
              <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>🧲 IMÁN</motion.span>
              <span className="font-bold">{scoreState.activeMagnetTimer.toFixed(1)}s</span>
            </motion.div>
          )}
          {scoreState.activeSlowMoTimer > 0 && (
            <motion.div 
              key="badge-slowmo"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="bg-amber-950/90 border border-amber-400 text-amber-200 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md"
            >
              <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1 }}>⏱ RELOJ</motion.span>
              <span className="font-bold">{scoreState.activeSlowMoTimer.toFixed(1)}s</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
