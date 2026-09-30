/**
 * GEAR RUSH - Victory / Stage Complete Screen
 * Honors completion of the 5 demo zones with an option for endless master climbing
 */

import React, { useEffect } from 'react';
import { Trophy, RotateCcw, Home, Sparkles } from 'lucide-react';
import { soundManager } from '../game/audio/soundManager';
import confetti from 'canvas-confetti';

interface VictoryModalProps {
  score: number;
  height: number;
  onContinue: () => void;
  onPlayAgain: () => void;
  onMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  score,
  height,
  onContinue,
  onPlayAgain,
  onMenu
}) => {
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 }
    });
  }, []);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-stone-900 border-2 border-amber-500 rounded-2xl w-full max-w-[390px] flex flex-col shadow-[0_0_40px_rgba(245,158,11,0.5)] overflow-hidden text-stone-200">
        {/* Header */}
        <div className="bg-gradient-to-b from-amber-950 via-stone-900 to-stone-950 p-5 border-b border-amber-700/60 text-center">
          <span className="text-4xl animate-bounce">🏆</span>
          <h2 className="text-3xl font-black font-teko text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-orange-400 uppercase tracking-wider mt-1">
            ¡VICTORIA TOTAL!
          </h2>
          <span className="text-xs text-amber-300 font-pixel">
            ¡HAS CONQUISTADO LAS 12 ZONAS!
          </span>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-stone-300 text-center leading-relaxed">
            Eres un auténtico maestro. Has superado tormentas eléctricas, lluvia torrencial y superficies resbaladizas hasta alcanzar la cima del mundo.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-950 p-3 rounded-xl border border-amber-500/40 flex flex-col items-center">
              <span className="text-[10px] font-pixel text-amber-400 uppercase">PUNTAJE</span>
              <span className="text-2xl font-black font-chakra text-amber-300 mt-1">
                {score.toLocaleString()}
              </span>
            </div>

            <div className="bg-stone-950 p-3 rounded-xl border border-cyan-500/40 flex flex-col items-center">
              <span className="text-[10px] font-pixel text-cyan-400 uppercase">ALTURA</span>
              <span className="text-2xl font-black font-chakra text-cyan-300 mt-1">
                {height} m
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                soundManager.playButtonClick();
                onContinue();
              }}
              className="gear-btn gear-btn-green w-full py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-sm font-black font-chakra tracking-wide cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>CONTINUAR EN MODO INFINITO</span>
            </button>

            <button
              onClick={() => {
                soundManager.playButtonClick();
                onPlayAgain();
              }}
              className="gear-btn gear-btn-orange w-full py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 text-sm font-black font-chakra tracking-wide cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REINICIAR DESDE ZONA 1</span>
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
        <div className="bg-stone-950 py-2.5 px-4 text-center border-t border-stone-800 text-[11px] text-amber-400 font-chakra font-semibold tracking-wide">
          GEAR RUSH • Dedicado a Violenti
        </div>
      </div>
    </div>
  );
};
