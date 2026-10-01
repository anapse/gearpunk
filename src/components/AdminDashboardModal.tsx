/**
 * GEAR RUSH - Hidden Admin Dashboard (/admin)
 * Protected with username "anapse" and password "16546203".
 * Displays real-time analytics: daily visits, games played, player rankings & metrics.
 */

import React, { useEffect, useState } from 'react';
import {
  X,
  Lock,
  LogOut,
  Users,
  Gamepad2,
  Trophy,
  Activity,
  BarChart3,
  Calendar,
  RefreshCw,
  Search,
  ShieldAlert
} from 'lucide-react';
import { soundManager } from '../game/audio/soundManager';
import { getAnalyticsData, LeaderboardRecord } from '../game/firebase';

interface AdminDashboardModalProps {
  onClose: () => void;
}

const ADMIN_USER = 'anapse';
const ADMIN_PASS = '16546203';
const ADMIN_SESSION_KEY = 'gearrush_admin_auth';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'RANKING' | 'DAILY' | 'PLAYERS'>('OVERVIEW');
  const [searchQuery, setSearchSearchQuery] = useState<string>('');

  const [analytics, setAnalytics] = useState<{
    totalVisits: number;
    totalGames: number;
    totalPoints: number;
    avgScore: number;
    avgHeight: number;
    dailyVisits: { date: string; count: number }[];
    dailyGames: { date: string; count: number }[];
    playerStats: { name: string; gamesCount: number; maxScore: number; maxHeight: number }[];
    leaderboard: LeaderboardRecord[];
  }>({
    totalVisits: 0,
    totalGames: 0,
    totalPoints: 0,
    avgScore: 0,
    avgHeight: 0,
    dailyVisits: [],
    dailyGames: [],
    playerStats: [],
    leaderboard: []
  });

  // Check saved admin session
  useEffect(() => {
    const savedSession = localStorage.getItem(ADMIN_SESSION_KEY);
    if (savedSession === 'true') {
      setIsAuthenticated(true);
      fetchAnalytics();
    }
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    const data = await getAnalyticsData();
    setAnalytics(data);
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (usernameInput.trim() === ADMIN_USER && passwordInput.trim() === ADMIN_PASS) {
      soundManager.playMilestone();
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setIsAuthenticated(true);
      fetchAnalytics();
    } else {
      soundManager.playDamage();
      setLoginError('Usuario o contraseña incorrectos.');
    }
  };

  const handleLogout = () => {
    soundManager.playButtonClick();
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none">
        <div className="bg-stone-900 border-2 border-amber-600/80 rounded-2xl w-full max-w-[360px] p-5 shadow-[0_0_50px_rgba(245,158,11,0.3)] text-stone-200 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mb-2">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="text-xl font-black font-chakra text-amber-400 uppercase tracking-widest">
              PANEL ADMINISTRATIVO
            </h2>
            <p className="text-xs text-stone-400 font-mono mt-1">
              Ruta protegida /admin • Comercial Jarros
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-bold font-chakra text-stone-300 uppercase block mb-1">
                Usuario
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                placeholder="Ingresa usuario"
                required
                className="bg-stone-950 border border-stone-700 focus:border-amber-500 text-amber-300 px-3 py-2 rounded-xl text-xs font-mono w-full outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold font-chakra text-stone-300 uppercase block mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-stone-950 border border-stone-700 focus:border-amber-500 text-amber-300 px-3 py-2 rounded-xl text-xs font-mono w-full outline-none"
              />
            </div>

            {loginError && (
              <div className="bg-red-950/80 border border-red-500 text-red-300 text-xs p-2 rounded-lg flex items-center gap-1.5 font-chakra">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="gear-btn gear-btn-green w-full py-2.5 rounded-xl font-black font-chakra text-sm uppercase tracking-wider mt-2 cursor-pointer"
            >
              INGRESAR AL DASHBOARD
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered Leaderboard
  const filteredLeaderboard = analytics.leaderboard.filter(item =>
    item.playerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-2.5 bg-black/90 backdrop-blur-md select-none">
      <div className="bg-stone-900 border-2 border-amber-600/80 rounded-2xl w-full max-w-[460px] max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(245,158,11,0.3)] text-stone-200 overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-stone-950 p-3 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/60 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-black font-chakra text-amber-400 uppercase tracking-wider leading-none">
                DASHBOARD ADMIN
              </h2>
              <span className="text-[10px] text-stone-400 font-mono">Usuario: anapse</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundManager.playButtonClick();
                fetchAnalytics();
              }}
              disabled={loading}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-400 transition-colors"
              title="Actualizar datos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700/80 text-red-300 text-xs font-bold flex items-center gap-1"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                soundManager.playButtonClick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-stone-950/80 px-2 py-1.5 border-b border-stone-800 flex items-center justify-between gap-1 text-[11px] font-chakra font-bold">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'OVERVIEW' ? 'bg-amber-600 text-stone-950 font-black' : 'text-stone-400 hover:bg-stone-800'
            }`}
          >
            <Activity className="w-3 h-3" /> RESUMEN
          </button>

          <button
            onClick={() => setActiveTab('RANKING')}
            className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'RANKING' ? 'bg-amber-600 text-stone-950 font-black' : 'text-stone-400 hover:bg-stone-800'
            }`}
          >
            <Trophy className="w-3 h-3" /> RANKING
          </button>

          <button
            onClick={() => setActiveTab('DAILY')}
            className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'DAILY' ? 'bg-amber-600 text-stone-950 font-black' : 'text-stone-400 hover:bg-stone-800'
            }`}
          >
            <Calendar className="w-3 h-3" /> VISITAS
          </button>

          <button
            onClick={() => setActiveTab('PLAYERS')}
            className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'PLAYERS' ? 'bg-amber-600 text-stone-950 font-black' : 'text-stone-400 hover:bg-stone-800'
            }`}
          >
            <Users className="w-3 h-3" /> JUGADORES
          </button>
        </div>

        {/* Dashboard Body */}
        <div className="p-3 overflow-y-auto flex-1 custom-scrollbar space-y-3">
          
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-3">
              {/* Metric Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-stone-950 p-2.5 rounded-xl border border-sky-500/50 flex flex-col">
                  <div className="flex items-center gap-1.5 text-sky-400 mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-pixel uppercase">Visitas Totales</span>
                  </div>
                  <span className="text-xl font-black font-chakra text-sky-300">
                    {analytics.totalVisits.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-stone-500 font-mono">Sesiones registradas</span>
                </div>

                <div className="bg-stone-950 p-2.5 rounded-xl border border-emerald-500/50 flex flex-col">
                  <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-pixel uppercase">Partidas Jugadas</span>
                  </div>
                  <span className="text-xl font-black font-chakra text-emerald-300">
                    {analytics.totalGames.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-stone-500 font-mono">Partidas completadas</span>
                </div>

                <div className="bg-stone-950 p-2.5 rounded-xl border border-amber-500/50 flex flex-col">
                  <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                    <Trophy className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-pixel uppercase">Puntos Totales</span>
                  </div>
                  <span className="text-xl font-black font-chakra text-amber-300">
                    {analytics.totalPoints.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-stone-500 font-mono">Puntos acumulados</span>
                </div>

                <div className="bg-stone-950 p-2.5 rounded-xl border border-purple-500/50 flex flex-col">
                  <div className="flex items-center gap-1.5 text-purple-400 mb-1">
                    <Activity className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-pixel uppercase">Promedio Puntaje</span>
                  </div>
                  <span className="text-xl font-black font-chakra text-purple-300">
                    {analytics.avgScore.toLocaleString()} pts
                  </span>
                  <span className="text-[9px] text-stone-500 font-mono">Altura prom: {analytics.avgHeight}m</span>
                </div>
              </div>

              {/* Quick Summary Box */}
              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-1.5">
                <h3 className="text-xs font-black font-chakra text-amber-400 uppercase tracking-wide">
                  ESTADO DE REGISTRO
                </h3>
                <div className="text-xs text-stone-300 space-y-1 font-chakra">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Total Jugadores Únicos en Ranking:</span>
                    <span className="font-bold text-white">{analytics.playerStats.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Récord Máximo Registrado:</span>
                    <span className="font-bold text-amber-400">
                      {analytics.leaderboard[0] ? `${analytics.leaderboard[0].score.toLocaleString()} pts (${analytics.leaderboard[0].playerName})` : 'Ninguno'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FULL RANKING LIST */}
          {activeTab === 'RANKING' && (
            <div className="space-y-2">
              <div className="flex gap-1.5">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchSearchQuery(e.target.value)}
                    placeholder="Buscar jugador..."
                    className="bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-200 text-xs px-8 py-1.5 rounded-lg w-full outline-none font-chakra"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                {filteredLeaderboard.length === 0 ? (
                  <p className="text-xs text-stone-500 text-center py-6 font-chakra">No hay resultados.</p>
                ) : (
                  filteredLeaderboard.map((item, idx) => (
                    <div
                      key={`admin-rank-${item.id || 'item'}-${idx}`}
                      className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 rounded bg-stone-800 text-amber-400 font-black text-xs font-chakra flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate font-chakra uppercase">
                            {item.playerName}
                          </p>
                          <p className="text-[10px] text-stone-400 font-mono">
                            {item.height}m
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-amber-300 font-chakra">
                          {item.score.toLocaleString()} pts
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DAILY VISITS */}
          {activeTab === 'DAILY' && (
            <div className="space-y-2">
              <h3 className="text-xs font-black font-chakra text-amber-400 uppercase tracking-wide">
                VISITAS POR DÍA
              </h3>
              {analytics.dailyVisits.length === 0 ? (
                <p className="text-xs text-stone-500 text-center py-6 font-chakra">Sin registros de visitas aún.</p>
              ) : (
                analytics.dailyVisits.map((item, idx) => (
                  <div
                    key={`visit-${idx}-${item.date}`}
                    className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 flex items-center justify-between text-xs font-chakra"
                  >
                    <span className="text-stone-300 font-mono">{item.date}</span>
                    <span className="font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-600/50">
                      {item.count} visitas
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: PLAYER STATS */}
          {activeTab === 'PLAYERS' && (
            <div className="space-y-2">
              <h3 className="text-xs font-black font-chakra text-amber-400 uppercase tracking-wide">
                DESGLOSE POR JUGADOR
              </h3>
              {analytics.playerStats.length === 0 ? (
                <p className="text-xs text-stone-500 text-center py-6 font-chakra">Sin jugadores registrados.</p>
              ) : (
                analytics.playerStats.map((item, idx) => (
                  <div
                    key={`player-stat-${idx}-${item.name}`}
                    className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 flex items-center justify-between text-xs font-chakra"
                  >
                    <div>
                      <p className="font-bold text-white uppercase">{item.name}</p>
                      <p className="text-[10px] text-stone-400 font-mono">
                        Máx. Altura: {item.maxHeight}m
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-black text-amber-400">{item.maxScore.toLocaleString()} pts</p>
                      <p className="text-[10px] text-emerald-400 font-bold">{item.gamesCount} récord(s)</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-950 p-2.5 border-t border-stone-800 flex justify-between items-center text-xs">
          <span className="text-[10px] text-stone-500 font-mono">Acceso Administrador anapse</span>
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onClose();
            }}
            className="gear-btn gear-btn-green py-1 px-4 rounded-lg font-bold font-chakra text-xs"
          >
            SALIR
          </button>
        </div>
      </div>
    </div>
  );
};
