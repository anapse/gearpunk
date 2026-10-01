import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocFromServer,
  Timestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

// Test connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or connecting...');
    }
  }
}
testConnection();

export interface LeaderboardRecord {
  id?: string;
  playerName: string;
  score: number;
  height: number;
  createdAt?: Timestamp | Date | string;
}

export interface VisitRecord {
  id?: string;
  date: string;
  timestamp?: Timestamp | Date | string;
  userAgent?: string;
}

export interface GameSessionRecord {
  id?: string;
  date: string;
  score: number;
  height: number;
  timestamp?: Timestamp | Date | string;
}

const LEADERBOARD_COLLECTION = 'leaderboard';
const VISITS_COLLECTION = 'analytics_visits';
const GAMES_COLLECTION = 'analytics_games';

/**
 * Fetch Top 50 high scores ordered by score descending (auto-seeds demo entries if < 10)
 */
export async function getTop50Leaderboard(): Promise<LeaderboardRecord[]> {
  try {
    const q = query(
      collection(db, LEADERBOARD_COLLECTION),
      orderBy('score', 'desc'),
      limit(50)
    );
    const snapshot = await getDocs(q);
    let records = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        playerName: data.playerName || 'Jugador',
        score: Number(data.score) || 0,
        height: Number(data.height) || 0,
        createdAt: data.createdAt
      };
    });

    // If fewer than 10 records, auto-seed sample entries to populate scrollable view
    if (records.length < 10) {
      const sampleNames = [
        'Violenti', 'El Herrero', 'CyberMech', 'GearMaster', 'Steampunk99',
        'IronJumper', 'BoltRunner', 'CogsKing', 'TitanGear', 'RustQueen',
        'AlloyHero', 'MetalClimber', 'SteamPunk', 'TurboCog', 'NeonForge'
      ];
      for (let i = 0; i < sampleNames.length; i++) {
        const score = 15000 - i * 750;
        const height = Math.round(score / 20);
        await submitLeaderboardScore(sampleNames[i], score, height);
      }
      const res = await getDocs(q);
      records = res.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          playerName: data.playerName || 'Jugador',
          score: Number(data.score) || 0,
          height: Number(data.height) || 0,
          createdAt: data.createdAt
        };
      });
    }

    return records;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, LEADERBOARD_COLLECTION);
    return [];
  }
}

/**
 * Fetch ALL leaderboard entries (for admin ranking view)
 */
export async function getAllLeaderboardEntries(): Promise<LeaderboardRecord[]> {
  try {
    const q = query(
      collection(db, LEADERBOARD_COLLECTION),
      orderBy('score', 'desc'),
      limit(200)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        playerName: data.playerName || 'Jugador',
        score: Number(data.score) || 0,
        height: Number(data.height) || 0,
        createdAt: data.createdAt
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, LEADERBOARD_COLLECTION);
    return [];
  }
}

/**
 * Delete a leaderboard entry (Admin action)
 */
export async function deleteLeaderboardEntry(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, LEADERBOARD_COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Delete leaderboard error:', error);
    return false;
  }
}

/**
 * Check if a given score qualifies for the Top 50 leaderboard.
 */
export async function checkIfQualifiesForTop50(score: number): Promise<boolean> {
  if (score <= 0) return false;
  try {
    const top50 = await getTop50Leaderboard();
    if (top50.length < 50) {
      return true;
    }
    const lowestScoreInTop50 = top50[top50.length - 1].score;
    return score > lowestScoreInTop50;
  } catch (error) {
    console.error('Failed to check Top 50 qualification:', error);
    return false;
  }
}

/**
 * Save a new high score entry into the Top 50 leaderboard
 */
export async function submitLeaderboardScore(playerName: string, score: number, height: number): Promise<boolean> {
  try {
    const sanitizedName = playerName.trim().substring(0, 30) || 'Anónimo';
    await addDoc(collection(db, LEADERBOARD_COLLECTION), {
      playerName: sanitizedName,
      score: Math.max(0, Math.floor(score)),
      height: Math.max(0, Math.floor(height)),
      createdAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, LEADERBOARD_COLLECTION);
    return false;
  }
}

/**
 * Log a user visit (call once per session boot)
 */
export async function logVisit(): Promise<void> {
  try {
    if (sessionStorage.getItem('gearrush_visit_logged')) return;
    sessionStorage.setItem('gearrush_visit_logged', 'true');

    const todayStr = new Date().toISOString().split('T')[0];
    await addDoc(collection(db, VISITS_COLLECTION), {
      date: todayStr,
      timestamp: serverTimestamp(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 100) : 'unknown'
    });
  } catch (error) {
    console.warn('Analytics visit log error:', error);
  }
}

/**
 * Log a completed game session
 */
export async function logGameSession(score: number, height: number): Promise<void> {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    await addDoc(collection(db, GAMES_COLLECTION), {
      date: todayStr,
      score: Math.max(0, Math.floor(score)),
      height: Math.max(0, Math.floor(height)),
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.warn('Analytics game session log error:', error);
  }
}

/**
 * Fetch Analytics data for Admin Dashboard
 */
export async function getAnalyticsData() {
  try {
    const [visitsSnap, gamesSnap, leaderboard] = await Promise.all([
      getDocs(query(collection(db, VISITS_COLLECTION), orderBy('timestamp', 'desc'), limit(500))),
      getDocs(query(collection(db, GAMES_COLLECTION), orderBy('timestamp', 'desc'), limit(500))),
      getAllLeaderboardEntries()
    ]);

    const visits = visitsSnap.docs.map(d => d.data() as VisitRecord);
    const games = gamesSnap.docs.map(d => d.data() as GameSessionRecord);

    const dailyVisitsMap: Record<string, number> = {};
    visits.forEach(v => {
      const d = v.date || 'Desconocido';
      dailyVisitsMap[d] = (dailyVisitsMap[d] || 0) + 1;
    });

    const dailyGamesMap: Record<string, number> = {};
    let totalScoreAllGames = 0;
    let totalHeightAllGames = 0;

    games.forEach(g => {
      const d = g.date || 'Desconocido';
      dailyGamesMap[d] = (dailyGamesMap[d] || 0) + 1;
      totalScoreAllGames += g.score || 0;
      totalHeightAllGames += g.height || 0;
    });

    const playerStatsMap: Record<string, { name: string; gamesCount: number; maxScore: number; maxHeight: number }> = {};
    leaderboard.forEach(entry => {
      const nameKey = entry.playerName.trim().toLowerCase();
      if (!playerStatsMap[nameKey]) {
        playerStatsMap[nameKey] = {
          name: entry.playerName,
          gamesCount: 1,
          maxScore: entry.score,
          maxHeight: entry.height
        };
      } else {
        playerStatsMap[nameKey].gamesCount += 1;
        playerStatsMap[nameKey].maxScore = Math.max(playerStatsMap[nameKey].maxScore, entry.score);
        playerStatsMap[nameKey].maxHeight = Math.max(playerStatsMap[nameKey].maxHeight, entry.height);
      }
    });

    return {
      totalVisits: visits.length,
      totalGames: games.length,
      totalPoints: totalScoreAllGames,
      avgScore: games.length > 0 ? Math.round(totalScoreAllGames / games.length) : 0,
      avgHeight: games.length > 0 ? Math.round(totalHeightAllGames / games.length) : 0,
      dailyVisits: Object.entries(dailyVisitsMap).map(([date, count]) => ({ date, count })),
      dailyGames: Object.entries(dailyGamesMap).map(([date, count]) => ({ date, count })),
      playerStats: Object.values(playerStatsMap).sort((a, b) => b.maxScore - a.maxScore),
      leaderboard
    };
  } catch (error) {
    console.error('Error loading analytics:', error);
    return {
      totalVisits: 0,
      totalGames: 0,
      totalPoints: 0,
      avgScore: 0,
      avgHeight: 0,
      dailyVisits: [],
      dailyGames: [],
      playerStats: [],
      leaderboard: []
    };
  }
}
