/**
 * GEAR RUSH - Types & Constants
 * (Comercial Jarros) - En honor a Violenti
 */

export const VIEW_WIDTH = 480;
export const VIEW_HEIGHT = 800;

export type GameScreen = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'VICTORY';

export type JumpDirection = 'UP_LEFT' | 'UP' | 'UP_RIGHT';

export enum PlayerState {
  IDLE = 'IDLE',
  CROUCH = 'CROUCH',
  JUMP_UP = 'JUMP_UP',
  JUMP_LEFT = 'JUMP_LEFT',
  JUMP_RIGHT = 'JUMP_RIGHT',
  AIRBORNE = 'AIRBORNE',
  FALLING = 'FALLING',
  WALL_SLIDE = 'WALL_SLIDE',
  GRABBING = 'GRABBING',
  CLIMBING = 'CLIMBING',
  ON_GEAR = 'ON_GEAR',
  DAMAGED = 'DAMAGED',
  FALLEN_LAVA = 'FALLEN_LAVA',
  VICTORY = 'VICTORY'
}

export type GearType = 
  | 'NORMAL_CW'       // Clockwise rotation ↻
  | 'NORMAL_CCW'      // Counter-clockwise rotation ↺
  | 'LARGE'           // Large safe platform
  | 'SMALL'           // Small challenging gear
  | 'FAST'            // Fast spinning gear
  | 'STATIC'          // Non-rotating platform
  | 'ELECTRIC'        // Electric sparks / hazard
  | 'EXPLOSIVE';      // 5-second countdown bomb

export interface Gear {
  id: number;
  x: number;
  y: number;
  radius: number;
  type: GearType;
  rotation: number;          // Current angle (radians)
  rotationSpeed: number;     // Rad/s (positive = CW, negative = CCW)
  teethCount: number;
  hasArrow: boolean;
  // Explosive properties
  fuseTimer?: number;        // in seconds (e.g. 5.0s)
  isArmed?: boolean;         // triggered when player lands
  isExploded?: boolean;
  // Visual variations
  innerColor?: string;
  metalTint?: string;
  screenIndex: number;       // Stage/screen 1 to 5
}

export type CollectibleType = 
  | 'LIGHTNING'   // +25 pts
  | 'HEART'       // +0.5 heart
  | 'DIAMOND'     // +50 pts
  | 'STAR'        // +100 pts
  | 'MAGNET'      // Attracts rays for 10s
  | 'CLOCK';      // Slow-motion for 8s

export interface Collectible {
  id: number;
  x: number;
  y: number;
  type: CollectibleType;
  baseY: number;
  floatOffset: number;
  collected: boolean;
  orbitGearId?: number;
  orbitAngle?: number;
  orbitDistance?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  gravity?: number;
  alpha?: number;
  type?: 'spark' | 'smoke' | 'fire' | 'bubble' | 'debris' | 'star';
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  alpha: number;
  scale: number;
  life: number;
  maxLife: number;
}

export interface ZoneConfig {
  zoneIndex: number;
  name: string;
  subtitle: string;
  startY: number;
  endY: number;
  bgColorTop: string;
  bgColorBottom: string;
  ambientLight: string;
  gearSpeedMult: number;
  explosiveChance: number;
  smallGearChance: number;
  electricChance: number;
  lavaRiseSpeed: number;
}

export interface GameScoreState {
  score: number;
  height: number;
  maxHeight: number;
  highScore: number;
  hearts: number;         // 0 to 6 (half-hearts; 6 = 3 full hearts)
  combo: number;
  comboTimer: number;
  zone: number;
  jumpsCount: number;
  raysCollected: number;
  activeMagnetTimer: number;
  activeSlowMoTimer: number;
}
