/**
 * GEAR RUSH - Core Game Engine
 * (Comercial Jarros) - En honor a Violenti
 */

import {
  VIEW_WIDTH,
  VIEW_HEIGHT,
  GameScreen,
  PlayerState,
  JumpDirection,
  Gear,
  Collectible,
  Particle,
  FloatingText,
  GameScoreState
} from '../types';
import { generateLevel, getZoneForY } from '../level/levelGenerator';
import { PixelRenderer } from '../rendering/pixelRenderer';
import { soundManager } from '../audio/soundManager';
import confetti from 'canvas-confetti';

const STORAGE_KEY_HIGH_SCORE = 'gearrush_high_score';
const STORAGE_KEY_MAX_HEIGHT = 'gearrush_max_height';
const STORAGE_KEY_GAMES_COUNT = 'gearrush_games_count';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private renderer: PixelRenderer;

  // Game states
  public screenState: GameScreen = 'MENU';
  private isRunning: boolean = false;
  private lastTime: number = 0;

  // Level & Entities
  private gears: Gear[] = [];
  private collectibles: Collectible[] = [];
  private particles: Particle[] = [];
  private floatingTexts: FloatingText[] = [];

  // Player physics & states
  public playerX: number = VIEW_WIDTH / 2;
  public playerY: number = 600;
  private playerVx: number = 0;
  private playerVy: number = 0;
  public playerState: PlayerState = PlayerState.IDLE;
  public playerFacing: 1 | -1 = 1;
  private currentGearId: number | null = null;
  private currentGearAngleOffset: number = -Math.PI / 2;
  private climbTimer: number = 0;
  private jumpCooldownTimer: number = 0;
  private lastJumpedGearId: number | null = null;
  private invincibleTimer: number = 0;
  private lastSafeGearId: number = 1;

  // Camera & Lava
  public cameraY: number = 0;
  public lavaY: number = 720;
  private screenShake: number = 0;
  private flashTimer: number = 0;

  // Scores & Progression
  public scoreState: GameScoreState = {
    score: 0,
    height: 0,
    maxHeight: 0,
    highScore: 0,
    hearts: 6, // 3 full hearts = 6 half hearts
    combo: 0,
    comboTimer: 0,
    zone: 1,
    jumpsCount: 0,
    raysCollected: 0,
    activeMagnetTimer: 0,
    activeSlowMoTimer: 0
  };

  private milestoneFlags: Set<number> = new Set();
  public isNewRecord: boolean = false;

  // Gesture input tracking (Pure mouse and touch, invisible during play)
  public isDragging: boolean = false;
  public dragStartX: number = 0;
  public dragStartY: number = 0;
  public dragCurrentX: number = 0;
  public dragCurrentY: number = 0;
  public detectedSwipeDir: JumpDirection | null = null;

  // Callback to sync state with React UI
  private onStateChange?: (state: GameScoreState, screen: GameScreen) => void;

  constructor(canvas: HTMLCanvasElement, onStateChange?: (state: GameScoreState, screen: GameScreen) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.renderer = new PixelRenderer(this.ctx);
    this.onStateChange = onStateChange;

    this.loadPersistentData();
    this.setupNewGame();
  }

  public setOnStateChange(cb: (state: GameScoreState, screen: GameScreen) => void) {
    this.onStateChange = cb;
  }

  private loadPersistentData() {
    try {
      const savedHighScore = localStorage.getItem(STORAGE_KEY_HIGH_SCORE);
      const savedMaxHeight = localStorage.getItem(STORAGE_KEY_MAX_HEIGHT);
      if (savedHighScore) this.scoreState.highScore = parseInt(savedHighScore, 10) || 0;
      if (savedMaxHeight) this.scoreState.maxHeight = parseInt(savedMaxHeight, 10) || 0;
    } catch {
      // Ignore localStorage errors
    }
  }

  private savePersistentData() {
    try {
      if (this.scoreState.score > this.scoreState.highScore) {
        this.scoreState.highScore = this.scoreState.score;
        localStorage.setItem(STORAGE_KEY_HIGH_SCORE, this.scoreState.highScore.toString());
      }
      if (this.scoreState.height > this.scoreState.maxHeight) {
        this.scoreState.maxHeight = this.scoreState.height;
        localStorage.setItem(STORAGE_KEY_MAX_HEIGHT, this.scoreState.maxHeight.toString());
      }
      const games = parseInt(localStorage.getItem(STORAGE_KEY_GAMES_COUNT) || '0', 10) + 1;
      localStorage.setItem(STORAGE_KEY_GAMES_COUNT, games.toString());
    } catch {
      // Ignore localStorage errors
    }
  }

  public setupNewGame() {
    const { gears, collectibles } = generateLevel();
    this.gears = gears;
    this.collectibles = collectibles;
    this.particles = [];
    this.floatingTexts = [];
    this.milestoneFlags.clear();
    this.isNewRecord = false;
    this.jumpCooldownTimer = 0;
    this.lastJumpedGearId = null;

    const startGear = gears[0];
    this.currentGearId = startGear.id;
    this.lastSafeGearId = startGear.id;
    this.currentGearAngleOffset = -Math.PI / 2;
    this.playerX = startGear.x + Math.cos(this.currentGearAngleOffset) * (startGear.radius + 2);
    this.playerY = startGear.y + Math.sin(this.currentGearAngleOffset) * (startGear.radius + 2);
    this.playerVx = 0;
    this.playerVy = 0;
    this.playerState = PlayerState.IDLE;
    this.playerFacing = 1;
    this.invincibleTimer = 0;

    this.cameraY = this.playerY - 520;
    this.lavaY = this.playerY + 240;

    this.scoreState = {
      score: 0,
      height: 0,
      maxHeight: this.scoreState.maxHeight,
      highScore: this.scoreState.highScore,
      hearts: 6,
      combo: 0,
      comboTimer: 0,
      zone: 1,
      jumpsCount: 0,
      raysCollected: 0,
      activeMagnetTimer: 0,
      activeSlowMoTimer: 0
    };

    this.notifyUI();
  }

  public startGame() {
    this.setupNewGame();
    this.screenState = 'PLAYING';
    soundManager.startMusic();
    this.notifyUI();
  }

  public resumeGame() {
    this.screenState = 'PLAYING';
    soundManager.startMusic();
    this.notifyUI();
  }

  public pauseGame() {
    if (this.screenState === 'PLAYING') {
      this.screenState = 'PAUSED';
      this.notifyUI();
    }
  }

  public goToMenu() {
    this.screenState = 'MENU';
    this.setupNewGame();
    this.notifyUI();
  }

  private notifyUI() {
    if (this.onStateChange) {
      this.onStateChange({ ...this.scoreState }, this.screenState);
    }
  }

  // --- PURE TOUCH & MOUSE GESTURE CONTROLS ---

  public handlePointerDown(screenX: number, screenY: number) {
    if (this.screenState !== 'PLAYING') return;

    this.isDragging = true;
    this.dragStartX = screenX;
    this.dragStartY = screenY;
    this.dragCurrentX = screenX;
    this.dragCurrentY = screenY;
    this.detectedSwipeDir = null;

    if (this.playerState === PlayerState.IDLE || this.playerState === PlayerState.ON_GEAR) {
      this.playerState = PlayerState.CROUCH;
    }
  }

  public handlePointerMove(screenX: number, screenY: number) {
    if (!this.isDragging || this.screenState !== 'PLAYING') return;

    this.dragCurrentX = screenX;
    this.dragCurrentY = screenY;

    const dx = screenX - this.dragStartX;
    const dy = screenY - this.dragStartY;
    const dist = Math.hypot(dx, dy);

    if (dist > 12) {
      if (dx < -12) {
        this.detectedSwipeDir = 'UP_LEFT';
        this.playerFacing = -1;
      } else if (dx > 12) {
        this.detectedSwipeDir = 'UP_RIGHT';
        this.playerFacing = 1;
      } else if (dy < -8) {
        this.detectedSwipeDir = 'UP';
      }
    }
  }

  public handlePointerUp() {
    if (!this.isDragging || this.screenState !== 'PLAYING') return;
    this.isDragging = false;

    if (this.detectedSwipeDir) {
      this.triggerJump(this.detectedSwipeDir);
    } else {
      // If wall sliding or on gear, direct tap triggers directional jump
      if (this.playerState === PlayerState.WALL_SLIDE) {
        if (this.playerX <= 35) {
          this.triggerJump('UP_RIGHT'); // Wall jump right
        } else {
          this.triggerJump('UP_LEFT'); // Wall jump left
        }
      } else {
        if (this.dragStartX < VIEW_WIDTH * 0.4) {
          this.triggerJump('UP_LEFT');
        } else if (this.dragStartX > VIEW_WIDTH * 0.6) {
          this.triggerJump('UP_RIGHT');
        } else {
          if (this.playerFacing === -1) {
            this.triggerJump('UP_LEFT');
          } else {
            this.triggerJump('UP_RIGHT');
          }
        }
      }
    }
    this.detectedSwipeDir = null;
  }

  public triggerJump(dir: JumpDirection) {
    // Allow jumping from gear, idle, crouch OR from WALL_SLIDE (Wall-Jump)
    const isWallSliding = this.playerState === PlayerState.WALL_SLIDE;
    
    if (
      this.playerState !== PlayerState.IDLE &&
      this.playerState !== PlayerState.ON_GEAR &&
      this.playerState !== PlayerState.CROUCH &&
      !isWallSliding
    ) {
      return;
    }

    if (isWallSliding) {
      soundManager.playWallBounce();
      this.addFloatingText('★ REBOTE DE PARED! ★', this.playerX, this.playerY - 25, '#38bdf8');
      
      // If touching left wall, rebound strongly to the right
      if (this.playerX <= 35) {
        this.playerVx = 10.8;
        this.playerVy = -17.5;
        this.playerFacing = 1;
        this.playerState = PlayerState.JUMP_RIGHT;
      } else {
        // Touching right wall, rebound strongly to the left
        this.playerVx = -10.8;
        this.playerVy = -17.5;
        this.playerFacing = -1;
        this.playerState = PlayerState.JUMP_LEFT;
      }

      // Wall jump spark burst
      for (let i = 0; i < 10; i++) {
        this.particles.push({
          x: this.playerX,
          y: this.playerY - 10,
          vx: (this.playerX <= 35 ? 1 : -1) * (Math.random() * 5 + 2),
          vy: (Math.random() - 0.5) * 6,
          color: '#38bdf8',
          size: 3,
          life: 0.25,
          maxLife: 0.25,
          type: 'spark'
        });
      }
      return;
    }

    soundManager.playJump();

    this.lastJumpedGearId = this.currentGearId;
    this.jumpCooldownTimer = 0.22;
    this.currentGearId = null;
    
    // JUICE: Small shake on jump
    this.screenShake = Math.max(this.screenShake, 5);

    // High energy, large soar jumps calibrated for climbing between gears
    if (dir === 'UP_LEFT') {
      this.playerVx = -9.8;
      this.playerVy = -17.5;
      this.playerState = PlayerState.JUMP_LEFT;
      this.playerFacing = -1;
    } else if (dir === 'UP_RIGHT') {
      this.playerVx = 9.8;
      this.playerVy = -17.5;
      this.playerState = PlayerState.JUMP_RIGHT;
      this.playerFacing = 1;
    } else {
      // UP
      this.playerVx = 0;
      this.playerVy = -18.5;
      this.playerState = PlayerState.JUMP_UP;
    }

    // Spawn jump dust particles
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: this.playerX + (Math.random() * 16 - 8),
        y: this.playerY + 2,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 2,
        color: '#e7e5e4',
        size: 3 + Math.random() * 2,
        life: 0.25,
        maxLife: 0.25,
        type: 'smoke'
      });
    }
  }

  // --- MAIN LOOP ---

  public startLoop() {
    this.isRunning = true;
    this.lastTime = performance.now();
    const frame = (now: number) => {
      if (!this.isRunning) return;
      const dt = Math.min((now - this.lastTime) / 1000, 0.05);
      this.lastTime = now;

      if (this.screenState === 'PLAYING') {
        this.update(dt);
      }
      this.render();

      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  public stopLoop() {
    this.isRunning = false;
  }

  // --- UPDATE SIMULATION ---

  private update(dt: number) {
    const speedScale = this.scoreState.activeSlowMoTimer > 0 ? 0.55 : 1.0;
    const simDt = dt * speedScale;

    if (this.jumpCooldownTimer > 0) {
      this.jumpCooldownTimer -= dt;
    }

    if (this.scoreState.activeSlowMoTimer > 0) {
      this.scoreState.activeSlowMoTimer -= dt;
    }
    if (this.scoreState.activeMagnetTimer > 0) {
      this.scoreState.activeMagnetTimer -= dt;
    }

    this.renderer.updateTime(dt);

    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= dt;
    }

    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 30);
    }

    if (this.flashTimer > 0) {
      this.flashTimer -= dt;
    }

    // 1. Update Gears
    this.updateGears(simDt);

    // 2. Update Player Physics, Wall Mechanics & Gear Rotation
    this.updatePlayer(simDt);

    // 3. Update Collectibles & Magnet
    this.updateCollectibles(simDt);

    // 4. Update Camera & Lava
    this.updateCameraAndLava(simDt);

    // 5. Update Particles & Text
    this.updateParticles(simDt);

    // 6. Check Milestones & Zone
    this.checkProgression();
  }

  private updateGears(dt: number) {
    for (const gear of this.gears) {
      if (gear.isExploded) continue;

      const rotSpeed = gear.type === 'FROZEN' ? gear.rotationSpeed * 1.2 : gear.rotationSpeed;
      gear.rotation += rotSpeed * dt;

      if (gear.type === 'EXPLOSIVE' && gear.isArmed && gear.fuseTimer !== undefined) {
        const prevSec = Math.floor(gear.fuseTimer);
        gear.fuseTimer -= dt;

        if (Math.floor(gear.fuseTimer) !== prevSec && gear.fuseTimer > 0) {
          soundManager.playFuseTick();
        }

        if (Math.random() < 0.4) {
          this.particles.push({
            x: gear.x + (Math.random() * 12 - 6),
            y: gear.y - 20,
            vx: (Math.random() - 0.5) * 3,
            vy: -Math.random() * 3,
            color: '#f97316',
            size: 2 + Math.random() * 2,
            life: 0.3,
            maxLife: 0.3,
            type: 'spark'
          });
        }

        if (gear.fuseTimer <= 0) {
          this.detonateGear(gear);
        }
      }
    }
  }

  private detonateGear(gear: Gear) {
    gear.isExploded = true;
    soundManager.playExplosion();
    this.screenShake = 16;

    for (let i = 0; i < 30; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      this.particles.push({
        x: gear.x,
        y: gear.y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        color: i % 2 === 0 ? '#ef4444' : '#f59e0b',
        size: 4 + Math.random() * 6,
        life: 0.5 + Math.random() * 0.3,
        maxLife: 0.8,
        type: 'fire'
      });
    }

    const distToPlayer = Math.hypot(this.playerX - gear.x, this.playerY - gear.y);
    if (distToPlayer < gear.radius + 35) {
      this.applyDamage('¡EXPLOSIÓN!');
      this.playerVx = (this.playerX - gear.x) * 0.15;
      this.playerVy = -8;
      this.playerState = PlayerState.DAMAGED;

      // JUICE: Extra shockwave on player hit
      this.particles.push({
        x: this.playerX,
        y: this.playerY,
        vx: 0, vy: 0,
        color: '#ef4444',
        size: 150,
        life: 0.4,
        maxLife: 0.4,
        type: 'shockwave'
      });
    }
  }

  private updatePlayer(dt: number) {
    const zone = getZoneForY(this.playerY);
    // --- 1. PLAYER ON GEAR (CONTINUOUS ROTATION ON HUGE RIM) ---
    if (this.currentGearId !== null) {
      const gear = this.gears.find(g => g.id === this.currentGearId);
      if (gear && !gear.isExploded) {
        if (this.playerState === PlayerState.CLIMBING) {
          this.climbTimer += dt;
          if (this.climbTimer > 0.1) {
            this.playerState = PlayerState.ON_GEAR;
            this.climbTimer = 0;
          }
        }

        // Active continuous rotation along the gear rim
        this.currentGearAngleOffset += gear.rotationSpeed * dt;

        // SLIPPERY MECHANIC: Slide towards bottom in slippery zones
        if (zone.isSlippery) {
          // Gravity effect on angle: try to move towards Math.PI / 2 (down)
          const targetSlide = Math.PI / 2;
          let diff = targetSlide - this.currentGearAngleOffset;
          // Normalize diff
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          
          this.currentGearAngleOffset += diff * 1.5 * dt;

          if (Math.random() < 0.2) {
            this.particles.push({
              x: this.playerX,
              y: this.playerY,
              vx: (Math.random() - 0.5) * 2,
              vy: Math.random() * 2,
              color: '#38bdf8',
              size: 2,
              life: 0.15,
              maxLife: 0.15,
              type: 'bubble'
            });
          }
        }

        this.playerFacing = gear.rotationSpeed >= 0 ? 1 : -1;

        this.playerX = gear.x + Math.cos(this.currentGearAngleOffset) * (gear.radius + 2);
        this.playerY = gear.y + Math.sin(this.currentGearAngleOffset) * (gear.radius + 2);
        this.playerVx = 0;
        this.playerVy = 0;

        // Slide off if rotated past bottom underside
        if (Math.sin(this.currentGearAngleOffset) > 0.88) {
          this.lastJumpedGearId = gear.id;
          this.jumpCooldownTimer = 0.25;
          this.currentGearId = null;
          this.playerState = PlayerState.FALLING;
          this.playerVx = gear.rotationSpeed > 0 ? 3 : -3;
          this.playerVy = 2;
        }
        return;
      } else {
        this.currentGearId = null;
        this.playerState = PlayerState.FALLING;
      }
    }

    // --- 2. PLAYER IN FLIGHT & WALL MECHANICS ---
    const gravity = 17; // Floaty, soaring gravity
    this.playerVy += gravity * dt * 1.5;
    this.playerX += this.playerVx;
    this.playerY += this.playerVy;

    this.playerVx *= 0.99;

    // LEFT WALL INTERACTION & SLIDE
    if (this.playerX <= 26) {
      this.playerX = 26;
      this.playerFacing = 1;

      if (this.playerState !== PlayerState.DAMAGED) {
        this.playerState = PlayerState.WALL_SLIDE;
        this.playerVy = Math.min(this.playerVy, 3.8); // Wall slide friction

        if (Math.random() < 0.35) {
          this.particles.push({
            x: 26,
            y: this.playerY - 8,
            vx: Math.random() * 3 + 1,
            vy: -Math.random() * 2,
            color: '#f97316',
            size: 2,
            life: 0.2,
            maxLife: 0.2,
            type: 'spark'
          });
        }
      }
    }
    // RIGHT WALL INTERACTION & SLIDE
    else if (this.playerX >= VIEW_WIDTH - 26) {
      this.playerX = VIEW_WIDTH - 26;
      this.playerFacing = -1;

      if (this.playerState !== PlayerState.DAMAGED) {
        this.playerState = PlayerState.WALL_SLIDE;
        this.playerVy = Math.min(this.playerVy, 3.8); // Wall slide friction

        if (Math.random() < 0.35) {
          this.particles.push({
            x: VIEW_WIDTH - 26,
            y: this.playerY - 8,
            vx: -(Math.random() * 3 + 1),
            vy: -Math.random() * 2,
            color: '#f97316',
            size: 2,
            life: 0.2,
            maxLife: 0.2,
            type: 'spark'
          });
        }
      }
    } else {
      // Normal mid-air states
      if (this.playerVy > 1.5 && this.playerState !== PlayerState.DAMAGED && this.playerState !== PlayerState.WALL_SLIDE) {
        this.playerState = PlayerState.FALLING;
      } else if (this.playerVy < -1.5 && this.playerState !== PlayerState.DAMAGED && this.playerState !== PlayerState.WALL_SLIDE) {
        this.playerState = PlayerState.AIRBORNE;
      }
    }

    // Check automatic grab & landing on gears
    this.checkGearCollisions();
  }

  private checkGearCollisions() {
    for (const gear of this.gears) {
      if (gear.isExploded) continue;

      if (gear.id === this.lastJumpedGearId && this.jumpCooldownTimer > 0) {
        continue;
      }

      const dx = this.playerX - gear.x;
      const dy = this.playerY - gear.y;
      const dist = Math.hypot(dx, dy);

      // Automatic Grab on gear outer rim (Supports Extra Large, Medium and Small gears)
      if (dist <= gear.radius + 24 && dist >= gear.radius - 36) {
        this.currentGearId = gear.id;
        this.lastSafeGearId = gear.id;
        this.currentGearAngleOffset = Math.atan2(dy, dx);
        this.playerVx = 0;
        this.playerVy = 0;

        soundManager.playGrab();
        setTimeout(() => soundManager.playClimb(), 40);

        this.playerState = PlayerState.CLIMBING;
        this.climbTimer = 0;

        this.scoreState.jumpsCount++;
        this.addScore(10, gear.x, gear.y - gear.radius - 20, '#fef08a', '+10');

        if (gear.type === 'EXPLOSIVE' && !gear.isArmed) {
          gear.isArmed = true;
          gear.fuseTimer = 5.0;
        }

        for (let i = 0; i < 8; i++) {
          this.particles.push({
            x: this.playerX + (Math.random() * 10 - 5),
            y: this.playerY,
            vx: (Math.random() - 0.5) * 5,
            vy: -Math.random() * 4,
            color: '#fbbf24',
            size: 2 + Math.random() * 2,
            life: 0.25,
            maxLife: 0.25,
            type: 'spark'
          });
        }
        break;
      }
    }
  }

  private updateCollectibles(dt: number) {
    const isMagnetActive = this.scoreState.activeMagnetTimer > 0;

    for (const item of this.collectibles) {
      if (item.collected) continue;

      if (isMagnetActive && (item.type === 'LIGHTNING' || item.type === 'DIAMOND')) {
        const dx = this.playerX - item.x;
        const dy = (this.playerY - 14) - item.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 180) {
          item.x += (dx / dist) * 320 * dt;
          item.y += (dy / dist) * 320 * dt;
        }
      }

      const pDist = Math.hypot(this.playerX - item.x, (this.playerY - 14) - item.y);
      if (pDist < 42) {
        this.collectItem(item);
      }
    }
  }

  private collectItem(item: Collectible) {
    item.collected = true;
    soundManager.playCollect(item.type);
    
    // JUICE: Screen shake and flash
    this.screenShake = 8;
    this.flashTimer = 0.08;

    switch (item.type) {
      case 'LIGHTNING':
        this.scoreState.raysCollected++;
        this.addScore(25, item.x, item.y, '#fde047', '+25 ⚡');
        break;
      case 'DIAMOND':
        this.addScore(50, item.x, item.y, '#38bdf8', '+50 💎');
        break;
      case 'STAR':
        this.addScore(100, item.x, item.y, '#f59e0b', '+100 ⭐');
        break;
      case 'HEART':
        if (this.scoreState.hearts < 6) {
          this.scoreState.hearts = Math.min(6, this.scoreState.hearts + 1);
          this.addFloatingText('+0.5 ❤️', item.x, item.y, '#ef4444');
          this.notifyUI();
        } else {
          this.addScore(50, item.x, item.y, '#ef4444', '+50 MAX');
        }
        break;
      case 'MAGNET':
        this.scoreState.activeMagnetTimer = 10.0;
        this.addFloatingText('🧲 ¡IMÁN ACTIVADO!', item.x, item.y, '#38bdf8');
        break;
      case 'CLOCK':
        this.scoreState.activeSlowMoTimer = 8.0;
        this.addFloatingText('⏱ ¡SLOW MOTION!', item.x, item.y, '#fbbf24');
        break;
      case 'RUBY':
        this.addScore(250, item.x, item.y, '#ef4444', '+250 🧧');
        break;
    }

    for (let i = 0; i < 20; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 2.0 + Math.random() * 6;
      const color = this.getCollectibleHex(item.type);
      this.particles.push({
        x: item.x,
        y: item.y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        color: color,
        size: 4 + Math.random() * 4,
        life: 0.4,
        maxLife: 0.4,
        type: 'flare'
      });
    }

    // Add shockwave
    this.particles.push({
      x: item.x,
      y: item.y,
      vx: 0,
      vy: 0,
      color: 'rgba(255, 255, 255, 0.6)',
      size: 100,
      life: 0.3,
      maxLife: 0.3,
      type: 'shockwave'
    });
  }

  private getCollectibleHex(type: string): string {
    switch (type) {
      case 'LIGHTNING': return '#fde047';
      case 'HEART': return '#ef4444';
      case 'DIAMOND': return '#38bdf8';
      case 'STAR': return '#f59e0b';
      case 'MAGNET': return '#38bdf8';
      case 'CLOCK': return '#fbbf24';
      case 'RUBY': return '#dc2626';
      default: return '#ffffff';
    }
  }

  private addScore(pts: number, x: number, y: number, color: string, text: string) {
    this.scoreState.score += pts;
    this.addFloatingText(text, x, y, color);
    
    // JUICE: Tiny shake on score
    this.screenShake = Math.max(this.screenShake, 3);

    if (this.scoreState.score > this.scoreState.highScore) {
      if (!this.isNewRecord && this.scoreState.highScore > 0) {
        this.isNewRecord = true;
        this.addFloatingText('👑 ¡NUEVO RÉCORD!', VIEW_WIDTH / 2, this.cameraY + 200, '#fbbf24');
      }
    }
    this.notifyUI();
  }

  private addFloatingText(text: string, x: number, y: number, color: string) {
    this.floatingTexts.push({
      id: Math.random(),
      text: text,
      x: x,
      y: y,
      color: color,
      alpha: 1.0,
      scale: 1.5, // Start large for "pop"
      life: 0.8,
      maxLife: 0.8
    });
  }

  private updateCameraAndLava(dt: number) {
    const zone = getZoneForY(this.playerY);

    const targetCamY = this.playerY - 500;
    if (targetCamY < this.cameraY) {
      this.cameraY += (targetCamY - this.cameraY) * 6 * dt;
    }

    const currentMeters = Math.max(0, Math.floor((650 - this.playerY) / 20));
    if (currentMeters > this.scoreState.height) {
      this.scoreState.height = currentMeters;
      if (this.scoreState.height > this.scoreState.maxHeight) {
        this.scoreState.maxHeight = this.scoreState.height;
      }
      this.notifyUI();
    }

    const lavaMinScreenY = this.cameraY + VIEW_HEIGHT - 65;
    this.lavaY -= zone.lavaRiseSpeed * dt;

    if (this.lavaY > lavaMinScreenY + 120) {
      this.lavaY = lavaMinScreenY + 120;
    }

    if (this.playerY >= this.lavaY - 10 || this.playerY > this.cameraY + VIEW_HEIGHT + 50) {
      this.handleLavaFall();
    }
  }

  private handleLavaFall() {
    if (this.invincibleTimer > 0) return;

    soundManager.playDamage();
    this.applyDamage('¡CAÍDA EN LAVA!');

    if (this.scoreState.hearts <= 0) {
      return;
    }

    const safeGear = this.gears.find(g => g.id === this.lastSafeGearId && !g.isExploded) || this.gears[0];
    this.currentGearId = safeGear.id;
    this.currentGearAngleOffset = -Math.PI / 2;
    this.playerX = safeGear.x + Math.cos(this.currentGearAngleOffset) * (safeGear.radius + 2);
    this.playerY = safeGear.y + Math.sin(this.currentGearAngleOffset) * (safeGear.radius + 2);
    this.playerVx = 0;
    this.playerVy = 0;
    this.playerState = PlayerState.ON_GEAR;
    this.invincibleTimer = 2.0;

    this.lavaY = this.playerY + 240;
  }

  public applyDamage(reason: string) {
    if (this.invincibleTimer > 0 && this.scoreState.hearts > 0) return;

    this.scoreState.hearts = Math.max(0, this.scoreState.hearts - 1);
    this.screenShake = 12;
    this.invincibleTimer = 1.6;

    this.addFloatingText(`-0.5 ❤️ ${reason}`, this.playerX, this.playerY - 20, '#ef4444');
    this.notifyUI();

    // JUICE: Hit particles
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        x: this.playerX,
        y: this.playerY,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        color: '#ffffff',
        size: 3 + Math.random() * 3,
        life: 0.3,
        maxLife: 0.3,
        type: 'spark'
      });
    }

    if (this.scoreState.hearts <= 0) {
      this.triggerGameOver();
    }
  }

  private triggerGameOver() {
    this.screenState = 'GAME_OVER';
    soundManager.stopMusic();
    soundManager.playGameOver();
    this.savePersistentData();
    this.notifyUI();
  }

  public triggerVictory() {
    this.screenState = 'VICTORY';
    soundManager.playMilestone();
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    this.savePersistentData();
    this.notifyUI();
  }

  private checkProgression() {
    const zone = getZoneForY(this.playerY);
    if (zone.zoneIndex !== this.scoreState.zone) {
      this.scoreState.zone = zone.zoneIndex;
      this.addFloatingText(`★ ${zone.name.toUpperCase()} ★`, VIEW_WIDTH / 2, this.cameraY + 240, '#38bdf8');
      soundManager.playMilestone();
      this.notifyUI();
    }

    const milestones = [50, 100, 250, 500, 1000, 1500];
    for (const m of milestones) {
      if (this.scoreState.height >= m && !this.milestoneFlags.has(m)) {
        this.milestoneFlags.add(m);
        soundManager.playMilestone();
        this.addFloatingText(`🎉 ¡HITO ${m} METROS!`, VIEW_WIDTH / 2, this.cameraY + 180, '#fbbf24');
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.4 } });
      }
    }

    if (this.scoreState.height >= 9000 && this.screenState === 'PLAYING') {
      this.triggerVictory();
    }
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx;
      p.y += p.vy;
      if (p.gravity) p.vy += p.gravity * dt;
    }

    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.life -= dt;
      if (t.life <= 0) {
        this.floatingTexts.splice(i, 1);
        continue;
      }
      t.y -= 35 * dt;
      t.alpha = t.life / t.maxLife;
      // "Pop" animation: scale down to 1.0 quickly
      if (t.scale > 1.0) {
        t.scale -= 2 * dt;
        if (t.scale < 1.0) t.scale = 1.0;
      }
    }
  }

  // --- RENDER SCENE ---

  public render() {
    const ctx = this.ctx;
    const zone = getZoneForY(this.playerY);

    ctx.save();

    if (this.screenShake > 0) {
      const sx = (Math.random() - 0.5) * this.screenShake;
      const sy = (Math.random() - 0.5) * this.screenShake;
      ctx.translate(sx, sy);
    }

    // 1. Background
    this.renderer.renderBackground(zone, this.cameraY);

    // 2. Gears
    for (const gear of this.gears) {
      this.renderer.renderGear(gear, this.cameraY);
    }

    // 3. Collectibles
    for (const item of this.collectibles) {
      this.renderer.renderCollectible(item, this.cameraY);
    }

    // 4. Particles
    this.renderer.renderParticles(this.particles, this.cameraY);

    // 5. Player Sprite
    this.renderer.renderPlayer(
      this.playerX,
      this.playerY,
      this.playerState,
      this.playerFacing,
      this.cameraY,
      this.invincibleTimer,
      this.scoreState.activeMagnetTimer > 0,
      this.scoreState.activeSlowMoTimer > 0
    );

    // 6. Lava at bottom
    this.renderer.renderLava(this.lavaY, this.cameraY);

    // 7. Flash effect
    this.renderer.renderFlash(this.flashTimer * 4);

    // 8. Floating Texts
    this.renderer.renderFloatingTexts(this.floatingTexts, this.cameraY);

    ctx.restore();
  }
}
