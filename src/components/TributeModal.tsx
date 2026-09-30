/**
 * GEAR RUSH - Tribute Modal
 * Special memorial & tribute acknowledging Violenti and Comercial Jarros
 */

import React from 'react';
import { X, Heart, Sparkles, Flame } from 'lucide-react';
import { soundManager } from '../game/audio/soundManager';

interface TributeModalProps {
  onClose: () => void;
}

export const TributeModal: React.FC<TributeModalProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-stone-900 border-2 border-amber-500/80 rounded-2xl w-full max-w-[390px] flex flex-col shadow-[0_0_35px_rgba(245,158,11,0.35)] overflow-hidden text-stone-200">
        {/* Header */}
        <div className="bg-gradient-to-b from-amber-950/90 to-stone-950 p-4 border-b border-amber-600/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400 fill-red-500/30" />
            <h2 className="text-base font-black font-chakra text-amber-300 uppercase tracking-wider">
              HOMENAJE & DEDICATORIA
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
        <div className="p-5 space-y-4 text-center">
          <div className="inline-flex p-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Flame className="w-8 h-8 animate-pulse text-orange-400" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black font-teko text-amber-300 uppercase tracking-wider text-2xl">
              EN HONOR A VIOLENTI
            </h3>
            <p className="text-xs font-bold text-amber-400 font-chakra">
              Dedicado a Violenti
            </p>
          </div>

          <div className="bg-stone-950/90 p-4 rounded-xl border border-stone-800 text-xs text-stone-300 leading-relaxed text-left space-y-2.5">
            <p>
              Este videojuego, <strong className="text-amber-300">GEAR RUSH</strong>, ha sido creado con profunda admiración y respeto como tributo al legado imborrable de un creador excepcional.
            </p>
            <p className="text-stone-400 text-[11px] italic border-l-2 border-amber-500 pl-2">
              "Por la pasión, la chispa rebelde del punk y el arte de construir mundos inolvidables paso a paso, salto a salto."
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-950 p-3.5 border-t border-stone-800 flex justify-center">
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onClose();
            }}
            className="gear-btn gear-btn-green py-2 px-8 rounded-lg font-bold font-chakra text-sm"
          >
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
};
