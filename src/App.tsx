/**
 * GEAR RUSH - Main Application
 * (Comercial Jarros) - En honor a Violenti
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { VIEW_WIDTH, VIEW_HEIGHT, GameScreen, GameScoreState } from './game/types';
import { GameEngine } from './game/core/gameEngine';
import { soundManager } from './game/audio/soundManager';
import { HUD } from './components/HUD';
import { MenuScreen } from './components/MenuScreen';
import { HowToPlayModal } from './components/HowToPlayModal';
import { HighScoreModal } from './components/HighScoreModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { PauseModal } from './components/PauseModal';
import { ContactModal } from './components/ContactModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { logVisit } from './game/firebase';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [screenState, setScreenState] = useState<GameScreen>('MENU');
  const [scoreState, setScoreState] = useState<GameScoreState>({
    score: 0,
    height: 0,
    maxHeight: 0,
    highScore: 0,
    hearts: 6,
    combo: 0,
    comboTimer: 0,
    zone: 1,
    jumpsCount: 0,
    raysCollected: 0,
    activeMagnetTimer: 0,
    activeSlowMoTimer: 0
  });

  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showHighScore, setShowHighScore] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Log visit & Check hidden /admin route on boot
  useEffect(() => {
    logVisit();

    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('admin') || hash.includes('admin')) {
        setShowAdminDashboard(true);
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);

    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  // Initialize Canvas & Game Engine
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = VIEW_WIDTH;
    canvas.height = VIEW_HEIGHT;

    const engine = new GameEngine(canvas, (newScoreState, newScreenState) => {
      setScoreState(newScoreState);
      setScreenState(newScreenState);
    });

    engineRef.current = engine;
    engine.startLoop();

    return () => {
      engine.stopLoop();
    };
  }, []);

  // Keyboard controls for testing / desktop accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!engineRef.current) return;
      const engine = engineRef.current;

      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (engine.screenState === 'PLAYING') {
          engine.pauseGame();
        } else if (engine.screenState === 'PAUSED') {
          engine.resumeGame();
        }
        return;
      }

      if (engine.screenState === 'PLAYING') {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'KeyQ') {
          engine.triggerJump('UP_LEFT');
        } else if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
          engine.triggerJump('UP');
        } else if (e.code === 'ArrowRight' || e.code === 'KeyD' || e.code === 'KeyE') {
          engine.triggerJump('UP_RIGHT');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Pointer event handlers for swipe gesture on Canvas
  const getCanvasCoords = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = VIEW_WIDTH / rect.width;
    const scaleY = VIEW_HEIGHT / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const { x, y } = getCanvasCoords(e);
    engineRef.current?.handlePointerDown(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);
    engineRef.current?.handlePointerMove(x, y);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture release fails
    }
    engineRef.current?.handlePointerUp();
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
  };

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-stone-950 overflow-hidden relative font-chakra select-none">
      {/* Background Ambience / Industrial Gradient Frame */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(68,30,15,0.3)_0%,rgba(12,10,9,1)_100%)] pointer-events-none" />

      {/* Main Vertical Game Frame (480x800 logical viewport) */}
      <div className="relative w-full h-full max-w-[480px] max-h-[800px] aspect-[480/800] bg-stone-900 shadow-[0_0_50px_rgba(0,0,0,0.9)] border-0 md:border-4 md:border-stone-800 md:rounded-2xl overflow-hidden flex flex-col justify-center items-center">
        
        {/* Game Canvas */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full object-contain cursor-grab active:cursor-grabbing touch-none select-none"
        />

        {/* In-Game HUD */}
        {screenState === 'PLAYING' && (
          <HUD
            scoreState={scoreState}
            onPause={() => {
              soundManager.playButtonClick();
              engineRef.current?.pauseGame();
            }}
          />
        )}

        {/* Main Menu */}
        {screenState === 'MENU' && (
          <MenuScreen
            onPlay={() => engineRef.current?.startGame()}
            onHowToPlay={() => setShowHowToPlay(true)}
            onHighScore={() => setShowHighScore(true)}
            onLeaderboard={() => setShowLeaderboard(true)}
            onContact={() => setShowContact(true)}
            isMuted={isMuted}
            onToggleMute={toggleMute}
          />
        )}

        {/* Pause Screen */}
        {screenState === 'PAUSED' && (
          <PauseModal
            onResume={() => engineRef.current?.resumeGame()}
            onRestart={() => engineRef.current?.startGame()}
            onMenu={() => engineRef.current?.goToMenu()}
            isMuted={isMuted}
            onToggleMute={toggleMute}
          />
        )}

        {/* Game Over Screen */}
        {screenState === 'GAME_OVER' && (
          <GameOverModal
            score={scoreState.score}
            height={scoreState.height}
            highScore={scoreState.highScore}
            isNewRecord={engineRef.current?.isNewRecord || false}
            onPlayAgain={() => engineRef.current?.startGame()}
            onMenu={() => engineRef.current?.goToMenu()}
            onShowLeaderboard={() => setShowLeaderboard(true)}
          />
        )}

        {/* Victory Screen */}
        {screenState === 'VICTORY' && (
          <VictoryModal
            score={scoreState.score}
            height={scoreState.height}
            onContinue={() => engineRef.current?.resumeGame()}
            onPlayAgain={() => engineRef.current?.startGame()}
            onMenu={() => engineRef.current?.goToMenu()}
          />
        )}

        {/* How To Play Modal */}
        {showHowToPlay && (
          <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
        )}

        {/* High Score Modal */}
        {showHighScore && (
          <HighScoreModal
            highScore={scoreState.highScore}
            maxHeight={scoreState.maxHeight}
            onClose={() => setShowHighScore(false)}
          />
        )}

        {/* Contact Modal */}
        {showContact && (
          <ContactModal onClose={() => setShowContact(false)} />
        )}

        {/* Top 50 Leaderboard Modal */}
        {showLeaderboard && (
          <LeaderboardModal
            currentScore={scoreState.score}
            onClose={() => setShowLeaderboard(false)}
          />
        )}

        {/* Hidden Admin Dashboard Modal (/admin or #admin) */}
        {showAdminDashboard && (
          <AdminDashboardModal
            onClose={() => setShowAdminDashboard(false)}
          />
        )}
      </div>
    </main>
  );
}
