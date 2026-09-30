/**
 * GEAR RUSH - Menu Screen
 * Dedicado a Violenti
 * Clean, compact arcade layout with official emblem logo
 */

import React from 'react';
import { Play, BookOpen, Trophy, Volume2, VolumeX, Heart } from 'lucide-react';
import { soundManager } from '../game/audio/soundManager';
import { logoImg } from '../assets';

interface MenuScreenProps {
  onPlay: () => void;
  onHowToPlay: () => void;
  onHighScore: () => void;
  onTribute: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  onPlay,
  onHowToPlay,
  onHighScore,
  onTribute,
  isMuted,
  onToggleMute
}) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-between p-3.5 bg-gradient-to-b from-stone-950/90 via-stone-900/80 to-amber-950/90 backdrop-blur-[2px] select-none">
      {/* Top Bar with Audio & Tribute */}
      <div className="w-full flex items-center justify-between z-10 px-1">
        <button
          onClick={() => {
            soundManager.playButtonClick();
            onTribute();
          }}
          className="flex items-center gap-1 bg-stone-900/90 hover:bg-stone-800 border border-amber-600/70 text-amber-300 text-[11px] px-2.5 py-1 rounded-lg shadow transition-transform active:scale-95 cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 text-red-400 fill-red-500/40 animate-pulse" />
          <span className="font-chakra font-bold tracking-wide">HOMENAJE</span>
        </button>

        <button
          onClick={() => {
            soundManager.playButtonClick();
            onToggleMute();
          }}
          className="bg-stone-900/90 hover:bg-stone-800 border border-stone-700 text-stone-300 p-1.5 rounded-lg shadow transition-transform active:scale-95 cursor-pointer"
          title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* Main Logo & Emblem Artwork */}
      <div className="flex flex-col items-center text-center my-auto z-10 max-w-[280px]">
        {/* Official GEAR RUSH Emblem Logo */}
        <div className="relative mb-2 flex items-center justify-center">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full border-2 border-amber-500/80 bg-stone-950/90 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.6)] overflow-hidden p-1">
            <img
              src={logoImg}
              alt="GEAR RUSH Logo"
              className="w-full h-full object-contain rounded-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] transition-transform hover:scale-105 duration-300"
            />
          </div>
        </div>

        {/* LOGO TITLE */}
        <h1 className="text-4xl md:text-5xl font-black tracking-wider uppercase font-teko text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-400 to-red-600 drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] leading-none">
          GEAR RUSH
        </h1>
      </div>

      {/* Main Action Buttons */}
      <div className="w-full max-w-[230px] flex flex-col gap-2.5 mb-2 z-10">
        {/* PLAY BUTTON */}
        <button
          onClick={() => {
            soundManager.playButtonClick();
            onPlay();
          }}
          className="gear-btn gear-btn-green py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-base font-black font-chakra tracking-wider cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>JUGAR</span>
        </button>

        {/* HOW TO PLAY BUTTON */}
        <button
          onClick={() => {
            soundManager.playButtonClick();
            onHowToPlay();
          }}
          className="gear-btn gear-btn-blue py-2 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-black font-chakra tracking-wide cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>CÓMO JUGAR</span>
        </button>

        {/* HIGH SCORE BUTTON */}
        <button
          onClick={() => {
            soundManager.playButtonClick();
            onHighScore();
          }}
          className="gear-btn gear-btn-purple py-2 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-black font-chakra tracking-wide cursor-pointer"
        >
          <Trophy className="w-4 h-4 text-amber-300" />
          <span>MAYOR PUNTAJE</span>
        </button>
      </div>

      {/* Footer Subtitle: Dedicado a Violenti */}
      <div className="text-[11px] text-amber-400 font-chakra font-bold tracking-wider text-center z-10 border-t border-stone-800/80 pt-1.5 w-full">
        Dedicado a Violenti
      </div>
    </div>
  );
};
