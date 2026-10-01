/**
 * GEAR RUSH - Top 50 Leaderboard Modal
 * Displays real-time Top 50 scores from Firebase Firestore with touch/drag and wheel scrolling support
 */

import React, { useEffect, useState, useRef } from 'react';
import { X, Trophy, Medal, Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import { soundManager } from '../game/audio/soundManager';
import { getTop50Leaderboard, LeaderboardRecord } from '../game/firebase';

interface LeaderboardModalProps {
  onClose: () => void;
  currentScore?: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose, currentScore }) => {
  const [records, setRecords] = useState<LeaderboardRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const fetchScores = async () => {
    setLoading(true);
    const data = await getTop50Leaderboard();
    setRecords(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchScores();
  }, []);

  // Mouse drag scrolling handlers for desktop
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartY(e.clientY);
    setScrollTop(scrollRef.current.scrollTop);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const deltaY = e.clientY - startY;
    scrollRef.current.scrollTop = scrollTop - deltaY;
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm select-none">
      <div className="bg-stone-900 border-2 border-amber-600/80 rounded-2xl w-full max-w-[420px] max-h-[85vh] flex flex-col shadow-[0_0_40px_rgba(217,119,6,0.3)] overflow-hidden text-stone-200">
        
        {/* Header */}
        <div className="bg-stone-950 p-3.5 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black font-chakra text-amber-400 uppercase tracking-wider leading-none">
                TOP 50 JUGADORES
              </h2>
              <span className="text-[10px] text-stone-400 font-mono">Tabla de Clasificación Global</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundManager.playButtonClick();
                fetchScores();
              }}
              disabled={loading}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-stone-300 hover:text-amber-400 transition-colors disabled:opacity-50"
              title="Actualizar clasificaciones"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => {
                soundManager.playButtonClick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content List with Scrollable View, Touch Pan & Mouse Drag Support */}
        <div 
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="p-3 overflow-y-auto flex-1 max-h-[55vh] space-y-1.5 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-auto cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
        >
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-stone-400">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <span className="text-xs font-chakra font-bold">Cargando clasificaciones globales...</span>
            </div>
          ) : records.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-amber-500/50 mx-auto" />
              <p className="text-xs text-stone-400 font-chakra">¡Aún no hay puntuaciones registradas en el Top 50!</p>
              <p className="text-[11px] text-amber-400 font-bold">¡Juega ahora y sé el primero en entrar a la historia!</p>
            </div>
          ) : (
            records.map((item, index) => {
              const rank = index + 1;
              const isTop1 = rank === 1;
              const isTop2 = rank === 2;
              const isTop3 = rank === 3;
              const isHighlight = currentScore && item.score === currentScore;

              return (
                <div
                  key={item.id || index}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors select-none ${
                    isTop1
                      ? 'bg-amber-950/40 border-amber-500/80 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : isTop2
                      ? 'bg-slate-900/80 border-slate-400/60'
                      : isTop3
                      ? 'bg-amber-900/20 border-amber-800/60'
                      : isHighlight
                      ? 'bg-emerald-950/50 border-emerald-500'
                      : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  {/* Rank & Name */}
                  <div className="flex items-center gap-2.5 min-w-0 pointer-events-none">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs font-chakra shrink-0 ${
                        isTop1
                          ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-md'
                          : isTop2
                          ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-black'
                          : isTop3
                          ? 'bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {isTop1 ? <Medal className="w-4 h-4 text-black" /> : `#${rank}`}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate font-chakra uppercase tracking-wide">
                        {item.playerName}
                      </p>
                      <p className="text-[10px] text-stone-400 font-mono">
                        Altura: <span className="text-cyan-400 font-bold">{item.height}m</span>
                      </p>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right shrink-0 pointer-events-none">
                    <span className="text-sm font-black font-chakra text-amber-400">
                      {item.score.toLocaleString()}
                    </span>
                    <span className="text-[9px] block text-stone-500 font-pixel">PTS</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-950 p-2.5 border-t border-stone-800 flex justify-between items-center text-xs shrink-0">
          <span className="text-[10px] text-stone-500 font-mono">Mostrando Top 50 mundial</span>
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onClose();
            }}
            className="gear-btn gear-btn-green py-1.5 px-4 rounded-lg font-bold font-chakra text-xs cursor-pointer"
          >
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
};
