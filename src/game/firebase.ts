import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
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
  throw new Error(JSON.stringify(errInfo));
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

const LEADERBOARD_COLLECTION = 'leaderboard';

/**
 * Fetch Top 50 high scores ordered by score descending
 */
export async function getTop50Leaderboard(): Promise<LeaderboardRecord[]> {
  try {
    const q = query(
      collection(db, LEADERBOARD_COLLECTION),
      orderBy('score', 'desc'),
      limit(50)
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
 * Check if a given score qualifies for the Top 50 leaderboard.
 * Returns true if leaderboard has less than 50 entries OR score > 50th score.
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
    const sanitizedName = playerName.trim().substring(0, 20) || 'Anónimo';
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
