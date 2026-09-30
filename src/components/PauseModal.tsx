/**
 * GEAR RUSH - Pause Modal
 */

import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../game/audio/soundManager';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onMenu,
  isMuted,
  onToggleMute
}) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-stone-900 border-2 border-stone-700 rounded-2xl w-full max-w-[340px] flex flex-col shadow-2xl overflow-hidden text-stone-200">
        <div className="bg-stone-950 p-4 border-b border-stone-800 text-center">
          <h2 className="text-2xl font-black font-teko text-amber-400 uppercase tracking-widest text-3xl">
            JUEGO PAUSADO
          </h2>
        </div>

        <div className="p-5 space-y-3">
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onResume();
            }}
            className="gear-btn gear-btn-green w-full py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-base font-black font-chakra tracking-wide cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>REANUDAR</span>
          </button>

          <button
            onClick={() => {
              soundManager.playButtonClick();
              onRestart();
            }}
            className="gear-btn gear-btn-orange w-full py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 text-sm font-black font-chakra tracking-wide cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REINICIAR</span>
          </button>

          <button
            onClick={() => {
              soundManager.playButtonClick();
              onToggleMute();
            }}
            className="gear-btn w-full py-2 px-6 rounded-xl flex items-center justify-center gap-2 text-xs font-black font-chakra tracking-wide cursor-pointer border-stone-700 bg-stone-800"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>SONIDO: {isMuted ? 'SILENCIADO' : 'ACTIVADO'}</span>
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
    </div>
  );
};
