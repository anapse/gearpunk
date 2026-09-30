/**
 * GEAR RUSH - How To Play Modal
 * Clear instructions on swipe controls, gear types, bomb timers, and collectibles
 */

import React, { useState } from 'react';
import { X, ArrowUpLeft, ArrowUp, ArrowUpRight, ShieldAlert, Sparkles, Flame } from 'lucide-react';
import { soundManager } from '../game/audio/soundManager';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  const [tab, setTab] = useState<'CONTROLS' | 'GEARS' | 'ITEMS'>('CONTROLS');

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="bg-stone-900 border-2 border-stone-700 rounded-2xl w-full max-w-[420px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-stone-200">
        {/* Modal Header */}
        <div className="bg-stone-950 p-3.5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <h2 className="text-lg font-black font-chakra text-amber-400 uppercase tracking-wider">
              CÓMO JUGAR
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

        {/* Tab Selector */}
        <div className="flex border-b border-stone-800 bg-stone-950/60 p-1 gap-1">
          <button
            onClick={() => {
              soundManager.playButtonClick();
              setTab('CONTROLS');
            }}
            className={`flex-1 py-1.5 text-xs font-bold font-chakra rounded-lg transition-colors ${
              tab === 'CONTROLS' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:bg-stone-800'
            }`}
          >
            CONTROLES
          </button>
          <button
            onClick={() => {
              soundManager.playButtonClick();
              setTab('GEARS');
            }}
            className={`flex-1 py-1.5 text-xs font-bold font-chakra rounded-lg transition-colors ${
              tab === 'GEARS' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:bg-stone-800'
            }`}
          >
            ENGRANAJES
          </button>
          <button
            onClick={() => {
              soundManager.playButtonClick();
              setTab('ITEMS');
            }}
            className={`flex-1 py-1.5 text-xs font-bold font-chakra rounded-lg transition-colors ${
              tab === 'ITEMS' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:bg-stone-800'
            }`}
          >
            OBJETOS
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs leading-relaxed">
          {tab === 'CONTROLS' && (
            <div className="space-y-4">
              {/* Swipe Direction Cards */}
              <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800">
                <h3 className="font-bold text-amber-300 font-chakra mb-2 text-center uppercase">
                  Gesto de Swipe o Arrastre con Mouse
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-stone-900 p-2 rounded-lg border border-sky-600/40 flex flex-col items-center">
                    <ArrowUpLeft className="w-6 h-6 text-sky-400 mb-1" />
                    <span className="font-bold text-sky-300 font-chakra">SALTA IZQ</span>
                    <span className="text-[10px] text-stone-400 mt-0.5">↖ Arriba-Izq</span>
                  </div>
                  <div className="bg-stone-900 p-2 rounded-lg border border-emerald-600/40 flex flex-col items-center">
                    <ArrowUp className="w-6 h-6 text-emerald-400 mb-1" />
                    <span className="font-bold text-emerald-300 font-chakra">SALTA ARRIBA</span>
                    <span className="text-[10px] text-stone-400 mt-0.5">↑ Vertical</span>
                  </div>
                  <div className="bg-stone-900 p-2 rounded-lg border border-purple-600/40 flex flex-col items-center">
                    <ArrowUpRight className="w-6 h-6 text-purple-400 mb-1" />
                    <span className="font-bold text-purple-300 font-chakra">SALTA DER</span>
                    <span className="text-[10px] text-stone-400 mt-0.5">↗ Arriba-Der</span>
                  </div>
                </div>
              </div>

              {/* Grab & Climb Sequence */}
              <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold font-chakra">
                  <Sparkles className="w-4 h-4" />
                  <span>AGARRE Y SUBIDA AUTOMÁTICA</span>
                </div>
                <p className="text-stone-300 text-[11px]">
                  Cuando tu personaje salta y toca el borde superior de un engranaje,{' '}
                  <strong className="text-amber-300">se agarra automáticamente con las manos</strong> y trepa a la superficie.
                </p>
                <div className="bg-stone-900 p-2 rounded border border-stone-800 text-[10px] text-stone-400 flex justify-around">
                  <span>1. Salto 🚀</span>
                  <span>➜</span>
                  <span>2. Agarre ✊</span>
                  <span>➜</span>
                  <span>3. Subida 🧗</span>
                  <span>➜</span>
                  <span>4. De Pie 🧍</span>
                </div>
              </div>

              {/* Lava Alert */}
              <div className="bg-red-950/40 p-3 rounded-xl border border-red-800/60 flex items-start gap-2.5">
                <Flame className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="font-bold text-red-400 font-chakra uppercase">La Lava Siempre Sube</h4>
                  <p className="text-[11px] text-red-200/90 mt-0.5">
                    El magma asciende constantemente por la fábrica. Tienes 3 corazones (6 medios corazones). Si caes en lava, pierdes 0.5 ❤️ y reapareces en el último engranaje seguro.
                  </p>
                </div>
              </div>
            </div>
          )}

          {tab === 'GEARS' && (
            <div className="space-y-3">
              <div className="bg-stone-950/80 p-2.5 rounded-xl border border-stone-800 flex items-center gap-3">
                <span className="text-2xl">⚙️</span>
                <div>
                  <h4 className="font-bold text-stone-200 font-chakra">Engranaje Normal (↻ / ↺)</h4>
                  <p className="text-[11px] text-stone-400">Gira en sentido horario o antihorario con flecha visible.</p>
                </div>
              </div>

              <div className="bg-stone-950/80 p-2.5 rounded-xl border border-blue-400/60 flex items-center gap-3">
                <span className="text-2xl">❄️</span>
                <div>
                  <h4 className="font-bold text-blue-300 font-chakra">Engranaje Congelado</h4>
                  <p className="text-[11px] text-stone-400">¡Resbaladizo! Gira un 20% más rápido que los normales.</p>
                </div>
              </div>

              <div className="bg-stone-950/80 p-2.5 rounded-xl border border-stone-800 flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h4 className="font-bold text-cyan-300 font-chakra">Engranaje Eléctrico</h4>
                  <p className="text-[11px] text-stone-400">Emite pulsos de chispas de alto voltaje.</p>
                </div>
              </div>

              <div className="bg-stone-950/80 p-2.5 rounded-xl border border-red-800/80 flex items-center gap-3">
                <span className="text-2xl">💣</span>
                <div>
                  <h4 className="font-bold text-red-400 font-chakra uppercase">Engranaje Bomba (Daño: -0.5 ❤️)</h4>
                  <p className="text-[11px] text-stone-300">
                    Al aterrizar, inicia una cuenta de 5s. ¡Salta antes de que detone o recibirás daño!
                  </p>
                </div>
              </div>

              <div className="bg-stone-950/80 p-2.5 rounded-xl border border-blue-400/60 flex items-center gap-3">
                <span className="text-2xl">🌧️</span>
                <div>
                  <h4 className="font-bold text-blue-300 font-chakra uppercase">Lluvia y Aceite</h4>
                  <p className="text-[11px] text-stone-300">En zonas altas, la lluvia hace que te resbales hacia abajo si no saltas rápido.</p>
                </div>
              </div>

              <div className="bg-stone-950/80 p-2.5 rounded-xl border border-cyan-400/60 flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h4 className="font-bold text-cyan-300 font-chakra uppercase">Alto Voltaje (Daño: -0.5 ❤️)</h4>
                  <p className="text-[11px] text-stone-300">Las chispas azules te electrocutan. ¡Calcula bien tu salto!</p>
                </div>
              </div>

              <div className="bg-red-950/40 p-2.5 rounded-xl border border-red-600/60 flex items-center gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <h4 className="font-bold text-red-500 font-chakra uppercase">Lava (Daño: -0.5 ❤️)</h4>
                  <p className="text-[11px] text-stone-300">Si la lava te alcanza, pierdes vida y regresas al último punto seguro.</p>
                </div>
              </div>
            </div>
          )}

          {tab === 'ITEMS' && (
            <div className="space-y-3">
              <div className="bg-stone-950/80 p-2.5 rounded-xl border border-amber-500/40 flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h4 className="font-bold text-amber-300 font-chakra">Rayo de Energía (+10 pts)</h4>
                  <p className="text-[11px] text-stone-400">Coleccionable básico repartido por toda la fábrica.</p>
                </div>
              </div>

              <div className="bg-stone-950/80 p-2.5 rounded-xl border border-red-500/40 flex items-center gap-3">
                <span className="text-2xl">❤️</span>
                <div>
                  <h4 className="font-bold text-red-400 font-chakra">Corazón Vital (+1 ❤️ Completo)</h4>
                  <p className="text-[11px] text-stone-400">Restaura 1 corazón de salud (2 medios corazones).</p>
                </div>
              </div>

              <div className="bg-stone-950/80 p-2.5 rounded-xl border border-sky-500/40 flex items-center gap-3">
                <span className="text-2xl">💎</span>
                <div>
                  <h4 className="font-bold text-sky-400 font-chakra">Diamante (+50 pts)</h4>
                  <p className="text-[11px] text-stone-400">Gemas raras industriales de gran valor.</p>
                </div>
              </div>

              <div className="bg-stone-950/80 p-2.5 rounded-xl border border-amber-400/40 flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <h4 className="font-bold text-amber-300 font-chakra">Estrella (+100 pts)</h4>
                  <p className="text-[11px] text-stone-400">Bonificación legendaria en rutas difíciles.</p>
                </div>
              </div>

              <div className="bg-stone-950/80 p-2.5 rounded-xl border border-sky-500/40 flex items-center gap-3">
                <span className="text-2xl">🧲</span>
                <div>
                  <h4 className="font-bold text-sky-300 font-chakra">Imán Temporal</h4>
                  <p className="text-[11px] text-stone-400">Atrae automáticamente todos los rayos cercanos por 10s.</p>
                </div>
              </div>

              <div className="bg-stone-950/80 p-2.5 rounded-xl border border-amber-500/40 flex items-center gap-3">
                <span className="text-2xl">⏱</span>
                <div>
                  <h4 className="font-bold text-amber-300 font-chakra">Reloj (Slow Motion)</h4>
                  <p className="text-[11px] text-stone-400">Ralentiza las trampas y engranajes peligrosos por 8s.</p>
                </div>
              </div>

              <div className="bg-stone-950/80 p-2.5 rounded-xl border border-red-600/60 flex items-center gap-3">
                <span className="text-2xl">🧧</span>
                <div>
                  <h4 className="font-bold text-red-500 font-chakra">Rubí Legendario (+250 pts)</h4>
                  <p className="text-[11px] text-stone-400">Solo aparece en las zonas finales más peligrosas.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-950 p-3 border-t border-stone-800 flex justify-end">
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onClose();
            }}
            className="gear-btn gear-btn-green py-2 px-6 rounded-lg font-bold font-chakra text-sm"
          >
            ¡ENTENDIDO!
          </button>
        </div>
      </div>
    </div>
  );
};
