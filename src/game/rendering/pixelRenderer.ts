/**
 * GEAR RUSH - High-Fidelity Pixel Art Canvas Renderer
 * Steampunk punk aesthetics, crisp pixel sprites, animated hazards, and atmospheric zones
 */

import { PlayerState, Gear, Collectible, Particle, FloatingText, ZoneConfig, VIEW_WIDTH, VIEW_HEIGHT } from '../types';
import { playerSpritesheetImg } from '../../assets';

export class PixelRenderer {
  private ctx: CanvasRenderingContext2D;
  private animTimer: number = 0;
  private spriteSheet: HTMLImageElement | null = null;
  private isSpriteLoaded: boolean = false;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.loadSpriteSheet();
  }

  private loadSpriteSheet() {
    if (typeof Image !== 'undefined') {
      const img = new Image();
      img.src = playerSpritesheetImg;
      img.onload = () => {
        this.spriteSheet = img;
        this.isSpriteLoaded = true;
      };
    }
  }

  public updateTime(dt: number) {
    this.animTimer += dt;
  }

  // Clear background with zone styling
  public renderBackground(zone: ZoneConfig, cameraY: number) {
    const ctx = this.ctx;

    // Base background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
    bgGrad.addColorStop(0, zone.bgColorTop);
    bgGrad.addColorStop(1, zone.bgColorBottom);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

    // Parallax Layer 1: Distant pipes and structures
    ctx.save();
    const p1Offset = (cameraY * 0.15) % 200;
    ctx.strokeStyle = 'rgba(28, 25, 23, 0.6)';
    ctx.lineWidth = 14;

    // Vertical structural columns
    for (let x = 40; x < VIEW_WIDTH; x += 110) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, VIEW_HEIGHT);
      ctx.stroke();

      // Rivets along columns
      ctx.fillStyle = 'rgba(40, 36, 33, 0.8)';
      for (let y = -p1Offset; y < VIEW_HEIGHT; y += 40) {
        ctx.fillRect(x - 4, y, 8, 4);
      }
    }

    // Diagonal support girders
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(44, 38, 34, 0.4)';
    for (let y = -p1Offset - 200; y < VIEW_HEIGHT + 200; y += 160) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(VIEW_WIDTH, y + 100);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(VIEW_WIDTH, y);
      ctx.lineTo(0, y + 100);
      ctx.stroke();
    }
    ctx.restore();

    // Parallax Layer 2: Hanging chains & giant background silhouette gears
    ctx.save();
    const p2Offset = (cameraY * 0.3) % 400;
    
    // Silhouette background gear
    const bgGearAngle = this.animTimer * 0.2;
    this.renderSilhouetteGear(100, 250 - p2Offset, 90, bgGearAngle);
    this.renderSilhouetteGear(380, 550 - p2Offset, 120, -bgGearAngle * 0.8);
    this.renderSilhouetteGear(200, 750 - p2Offset, 80, bgGearAngle * 1.1);

    // Hanging chains
    for (const chainX of [85, 230, 400]) {
      this.renderChain(chainX, 0, VIEW_HEIGHT, cameraY * 0.4);
    }
    ctx.restore();

    // Ambient zone lighting overlay
    ctx.fillStyle = zone.ambientLight;
    ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

    // Snow particles for Zone 7 and 8 (High Peaks)
    if (zone.zoneIndex === 7 || zone.zoneIndex === 8) {
      this.renderSnow(cameraY);
    }

    // Star field for Zone 8, 9, 10, 11, 12 (Atmosphere & Space)
    if (zone.zoneIndex >= 8) {
      this.renderStars(cameraY);
    }

    // Rain for Zones 10, 11, 12
    if (zone.hasRain) {
      this.renderRain();
    }
  }

  private renderRain() {
    const ctx = this.ctx;
    ctx.save();
    const dropCount = 50;
    const time = this.animTimer * 2;
    
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
    ctx.lineWidth = 1.5;
    
    for (let i = 0; i < dropCount; i++) {
      const x = (i * 47.3 + time * 150) % VIEW_WIDTH;
      const y = (i * 89.1 + time * 800) % VIEW_HEIGHT;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 4, y + 12);
      ctx.stroke();
    }
    ctx.restore();
  }

  private renderStars(cameraY: number) {
    const ctx = this.ctx;
    ctx.save();
    const starCount = 60;
    for (let i = 0; i < starCount; i++) {
      const x = (i * 137.5) % VIEW_WIDTH;
      const y = (i * 123.4 - cameraY * 0.2) % VIEW_HEIGHT;
      const size = 1 + (i % 2);
      const alpha = 0.4 + Math.sin(this.animTimer * 2 + i) * 0.3;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(x, y, size, size);
    }
    ctx.restore();
  }

  private renderSnow(cameraY: number) {
    const ctx = this.ctx;
    ctx.save();
    const snowCount = 40;
    const time = this.animTimer * 1.5;
    
    for (let i = 0; i < snowCount; i++) {
      const x = (Math.sin(i * 123.45 + time) * 100 + i * 20) % VIEW_WIDTH;
      const y = (i * 25 + time * 100 - cameraY * 0.5) % VIEW_HEIGHT;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(x, y, 1.5 + Math.sin(i + time) * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private renderSilhouetteGear(cx: number, cy: number, radius: number, angle: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.fillStyle = 'rgba(20, 18, 16, 0.45)';
    
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Silhouette teeth
    const teeth = 12;
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2;
      const tx = Math.cos(a) * (radius + 12);
      const ty = Math.sin(a) * (radius + 12);
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(a);
      ctx.fillRect(-8, -8, 16, 16);
      ctx.restore();
    }

    // Inner hole
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
  }

  private renderChain(x: number, startY: number, endY: number, offset: number) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(50, 45, 40, 0.5)';
    ctx.strokeStyle = 'rgba(25, 22, 20, 0.7)';
    ctx.lineWidth = 1.5;

    const linkH = 14;
    const start = startY - ((offset % linkH) + linkH);
    for (let y = start; y < endY + linkH; y += linkH) {
      ctx.beginPath();
      ctx.roundRect(x - 3, y, 6, 12, 3);
      ctx.fill();
      ctx.stroke();
    }
  }

  // --- RENDER GEARS ---

  public renderGear(gear: Gear, cameraY: number) {
    const ctx = this.ctx;
    const screenY = gear.y - cameraY;

    // Offscreen culling
    if (screenY < -gear.radius * 2 || screenY > VIEW_HEIGHT + gear.radius * 2) {
      return;
    }

    ctx.save();
    ctx.translate(gear.x, screenY);
    ctx.rotate(gear.rotation);

    const r = gear.radius;

    // Gear base palette depending on type
    let outerColor = '#78716c';
    let innerColor = '#44403c';
    let rimColor = '#292524';
    let toothColor = '#a8a29e';
    let highlightColor = '#d6d3d1';

    if (gear.type === 'EXPLOSIVE') {
      outerColor = '#dc2626';
      innerColor = '#7f1d1d';
      toothColor = '#ef4444';
      highlightColor = '#fca5a5';
    } else if (gear.type === 'ELECTRIC') {
      outerColor = '#0284c7';
      innerColor = '#0c4a6e';
      toothColor = '#38bdf8';
      highlightColor = '#bae6fd';
    } else if (gear.type === 'FAST') {
      outerColor = '#d97706';
      innerColor = '#78350f';
      toothColor = '#f59e0b';
      highlightColor = '#fde68a';
    } else if (gear.type === 'STATIC') {
      outerColor = '#52525b';
      innerColor = '#27272a';
      toothColor = '#71717a';
      highlightColor = '#a1a1aa';
    } else if (gear.type === 'FROZEN') {
      outerColor = '#bae6fd';
      innerColor = '#0c4a6e';
      toothColor = '#f0f9ff';
      highlightColor = '#ffffff';
    }

    // 1. Teeth drawing
    const teeth = gear.teethCount;
    const toothWidth = Math.max(10, r * 0.32);
    const toothHeight = Math.max(8, Math.min(16, r * 0.18));

    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2;
      ctx.save();
      ctx.rotate(a);
      
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(-toothWidth / 2 - 1, -r - toothHeight, toothWidth + 2, toothHeight + 2);
      
      ctx.fillStyle = toothColor;
      ctx.fillRect(-toothWidth / 2, -r - toothHeight + 1, toothWidth, toothHeight);

      ctx.fillStyle = highlightColor;
      ctx.fillRect(-toothWidth / 2 + 1, -r - toothHeight + 1, toothWidth - 2, 3);
      ctx.restore();
    }

    // 2. Main Outer Rim
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = outerColor;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = rimColor;
    ctx.stroke();

    // Rim 3D Bevel
    ctx.beginPath();
    ctx.arc(0, 0, r - 3, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = highlightColor;
    ctx.stroke();

    // 3. Inner recessed plate
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = innerColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1c1917';
    ctx.stroke();

    // 4. Rivets on inner ring
    const rivets = Math.min(10, Math.max(6, Math.floor(r / 10)));
    for (let i = 0; i < rivets; i++) {
      const a = (i / rivets) * Math.PI * 2;
      const rx = Math.cos(a) * (r * 0.52);
      const ry = Math.sin(a) * (r * 0.52);
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(rx - 2, ry - 2, 4, 4);
      ctx.fillStyle = highlightColor;
      ctx.fillRect(rx - 1, ry - 1, 2, 2);
    }

    // 5. Center Hub / Axle
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2);
    ctx.fillStyle = '#292524';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#78716c';
    ctx.stroke();

    // 6. Directional Arrow (↻ / ↺)
    if (gear.hasArrow && gear.rotationSpeed !== 0) {
      const isCW = gear.rotationSpeed > 0;
      ctx.save();
      ctx.strokeStyle = isCW ? '#f59e0b' : '#38bdf8';
      ctx.fillStyle = isCW ? '#fbbf24' : '#7dd3fc';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      const arrowRadius = r * 0.46;
      if (isCW) {
        ctx.arc(0, 0, arrowRadius, -Math.PI * 0.7, Math.PI * 0.5, false);
      } else {
        ctx.arc(0, 0, arrowRadius, Math.PI * 0.7, -Math.PI * 0.5, true);
      }
      ctx.stroke();

      const headAngle = isCW ? Math.PI * 0.5 : -Math.PI * 0.5;
      const hx = Math.cos(headAngle) * arrowRadius;
      const hy = Math.sin(headAngle) * arrowRadius;
      
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(headAngle + (isCW ? Math.PI / 2 : -Math.PI / 2));
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(6, 4);
      ctx.lineTo(-6, 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.restore();
    }

    // 7. Electric special effects
    if (gear.type === 'ELECTRIC') {
      const sparkCount = 5;
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 3;
      for (let s = 0; s < sparkCount; s++) {
        const sa = Math.random() * Math.PI * 2;
        const sr1 = r * 0.6;
        const sr2 = r + 15;
        ctx.beginPath();
        ctx.moveTo(Math.cos(sa) * sr1, Math.sin(sa) * sr1);
        ctx.lineTo(Math.cos(sa + 0.25) * (sr1 + sr2) * 0.5, Math.sin(sa + 0.25) * (sr1 + sr2) * 0.5);
        ctx.lineTo(Math.cos(sa - 0.15) * sr2, Math.sin(sa - 0.15) * sr2);
        ctx.stroke();
      }
    }

    ctx.restore();

    // 8. Explosive Gear Countdown
    if (gear.type === 'EXPLOSIVE') {
      const timer = gear.fuseTimer !== undefined ? gear.fuseTimer : 5.0;
      const isArmed = !!gear.isArmed;

      ctx.save();
      ctx.translate(gear.x, screenY);
      
      // Larger bomb body
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.quadraticCurveTo(8, -28, 12, -32);
      ctx.stroke();

      const sparkTime = this.animTimer * 20;
      const sparkRadius = 5 + Math.sin(sparkTime) * 3;
      ctx.fillStyle = (Math.floor(sparkTime) % 2 === 0) ? '#fef08a' : '#f97316';
      ctx.beginPath();
      ctx.arc(12, -32, sparkRadius, 0, Math.PI * 2);
      ctx.fill();

      if (isArmed) {
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(-24, -gear.radius - 32, 48, 22);
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 2;
        ctx.strokeRect(-24, -gear.radius - 32, 48, 22);

        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${timer.toFixed(1)}s`, 0, -gear.radius - 21);
      } else {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(-20, -gear.radius - 24, 40, 18);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💣 5s', 0, -gear.radius - 15);
      }

      ctx.restore();
    }
  }

  // --- RENDER COLLECTIBLES ---

  public renderCollectible(item: Collectible, cameraY: number) {
    if (item.collected) return;
    const ctx = this.ctx;
    const floatY = Math.sin(this.animTimer * 4 + item.floatOffset) * 4;
    const screenY = item.y + floatY - cameraY;

    if (screenY < -40 || screenY > VIEW_HEIGHT + 40) return;

    ctx.save();
    ctx.translate(item.x, screenY);

    const baseScale = 1.6;
    const pulse = baseScale + Math.sin(this.animTimer * 6 + item.floatOffset) * 0.15;

    // GLOW EFFECT for Dopamine
    const glowRadius = 25 * pulse;
    const itemColor = this.getCollectibleColor(item.type);
    const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
    glowGrad.addColorStop(0, itemColor.replace('1)', '0.4)'));
    glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.scale(pulse, pulse);

    switch (item.type) {
      case 'LIGHTNING':
        ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(2, -12);
        ctx.lineTo(-8, 0);
        ctx.lineTo(-1, 0);
        ctx.lineTo(-4, 12);
        ctx.lineTo(8, -1);
        ctx.lineTo(1, -1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      case 'HEART':
        ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ef4444';
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 8);
        ctx.bezierCurveTo(-8, 0, -10, -8, -4, -10);
        ctx.bezierCurveTo(0, -10, 0, -5, 0, -5);
        ctx.bezierCurveTo(0, -5, 0, -10, 4, -10);
        ctx.bezierCurveTo(10, -8, 8, 0, 0, 8);
        ctx.fill();
        ctx.stroke();
        break;

      case 'DIAMOND':
        ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -11);
        ctx.lineTo(10, -3);
        ctx.lineTo(0, 11);
        ctx.lineTo(-10, -3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      case 'STAR':
        ctx.fillStyle = 'rgba(234, 179, 8, 0.4)';
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#eab308';
        ctx.strokeStyle = '#a16207';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let s = 0; s < 5; s++) {
          const a1 = (s * 2 * Math.PI) / 5 - Math.PI / 2;
          const a2 = a1 + Math.PI / 5;
          const x1 = Math.cos(a1) * 12;
          const y1 = Math.sin(a1) * 12;
          const x2 = Math.cos(a2) * 5;
          const y2 = Math.sin(a2) * 5;
          if (s === 0) ctx.moveTo(x1, y1);
          else ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      case 'MAGNET':
        ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 5;
        ctx.strokeStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, 0, 9, Math.PI, 0, true);
        ctx.stroke();

        ctx.strokeStyle = '#3b82f6';
        ctx.beginPath();
        ctx.moveTo(-9, -2);
        ctx.lineTo(-9, -8);
        ctx.moveTo(9, -2);
        ctx.lineTo(9, -8);
        ctx.stroke();
        break;

      case 'CLOCK':
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -6);
        ctx.moveTo(0, 0);
        ctx.lineTo(4, 2);
        ctx.stroke();
        break;

      case 'RUBY':
        ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ef4444';
        ctx.strokeStyle = '#7f1d1d';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(10, -4);
        ctx.lineTo(6, 12);
        ctx.lineTo(-6, 12);
        ctx.lineTo(-10, -4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Shiny reflection
        ctx.fillStyle = '#fca5a5';
        ctx.beginPath();
        ctx.moveTo(-4, -6);
        ctx.lineTo(0, -9);
        ctx.lineTo(4, -6);
        ctx.fill();
        break;
    }

    ctx.restore();
  }

  private getCollectibleColor(type: string): string {
    switch (type) {
      case 'LIGHTNING': return 'rgba(250, 204, 21, 1)';
      case 'HEART': return 'rgba(239, 68, 68, 1)';
      case 'DIAMOND': return 'rgba(56, 189, 248, 1)';
      case 'STAR': return 'rgba(234, 179, 8, 1)';
      case 'MAGNET': return 'rgba(239, 68, 68, 1)';
      case 'CLOCK': return 'rgba(245, 158, 11, 1)';
      case 'RUBY': return 'rgba(239, 68, 68, 1)';
      default: return 'rgba(255, 255, 255, 1)';
    }
  }

  // --- RENDER PLAYER SPRITE ---

  public renderPlayer(
    x: number,
    y: number,
    state: PlayerState,
    facing: 1 | -1,
    cameraY: number,
    invincibleTimer: number,
    activeMagnet: boolean,
    activeSlowMo: boolean
  ) {
    const ctx = this.ctx;
    const screenY = y - cameraY;

    if (invincibleTimer > 0 && Math.floor(invincibleTimer * 15) % 2 === 0) {
      return;
    }

    ctx.save();
    ctx.translate(x, screenY);
    ctx.scale(facing, 1);

    if (activeMagnet) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -14, 24 + Math.sin(this.animTimer * 8) * 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (activeSlowMo) {
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -14, 22 + Math.cos(this.animTimer * 8) * 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    this.drawPunkSprite(state);

    ctx.restore();
  }

  private drawPunkSprite(state: PlayerState) {
    const ctx = this.ctx;

    const p = (px: number, py: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(px * 2, py * 2, w * 2, h * 2);
    };

    const cSkin = '#fed7aa';
    const cSkinShadow = '#fb923c';
    const cHairCrimson = '#dc2626';
    const cHairFlame = '#f97316';
    const cHairBlack = '#09090b';
    const cJacket = '#18181b';
    const cJacketHighlight = '#3f3f46';
    const cJacketTrim = '#a1a1aa';
    const cMetalStud = '#e4e4e7';
    const cPants = '#0f172a';
    const cPantsHighlight = '#334155';
    const cBoots = '#020617';
    const cBootsBuckle = '#fbbf24';
    const cEyes = '#020617';

    const breath = Math.sin(this.animTimer * 5) * 0.5;

    switch (state) {
      case PlayerState.IDLE:
      case PlayerState.ON_GEAR:
        p(-5, -3, 4, 3, cBoots);
        p(1, -3, 4, 3, cBoots);
        p(-4, -2, 1, 1, cBootsBuckle);
        p(2, -2, 1, 1, cBootsBuckle);

        p(-4, -8, 3, 5, cPants);
        p(1, -8, 3, 5, cPants);
        p(-4, -8, 1, 4, cPantsHighlight);
        p(1, -8, 1, 4, cPantsHighlight);

        const bodyY = -15 + breath;
        p(-5, bodyY, 10, 7, cJacket);
        p(-5, bodyY, 1, 7, cJacketHighlight);
        p(-1, bodyY, 2, 7, cJacketTrim);
        p(-4, bodyY + 1, 1, 1, cMetalStud);
        p(3, bodyY + 1, 1, 1, cMetalStud);
        p(-4, bodyY + 4, 1, 1, cMetalStud);
        p(3, bodyY + 4, 1, 1, cMetalStud);

        p(-6, bodyY + 1, 2, 6, cJacket);
        p(4, bodyY + 1, 2, 6, cJacket);
        p(-6, bodyY + 5, 2, 1, cMetalStud);
        p(4, bodyY + 5, 2, 1, cMetalStud);
        p(-6, bodyY + 6, 2, 2, cSkin);
        p(4, bodyY + 6, 2, 2, cSkin);

        const headY = bodyY - 8;
        p(-4, headY, 8, 8, cSkin);
        p(-4, headY + 6, 8, 2, cSkinShadow);
        p(1, headY + 3, 2, 2, cEyes);

        p(-3, headY - 6, 6, 3, cHairCrimson);
        p(-2, headY - 4, 5, 2, cHairFlame);
        p(-2, headY - 2, 5, 2, cHairBlack);
        p(-4, headY - 4, 2, 3, cHairCrimson);
        p(3, headY - 5, 2, 3, cHairCrimson);
        break;

      case PlayerState.WALL_SLIDE:
        p(-4, -2, 5, 3, cBoots);
        p(1, -4, 4, 3, cBoots);
        p(-4, -7, 8, 5, cPants);
        p(-5, -14, 9, 7, cJacket);

        p(-7, -13, 3, 3, cSkin);
        p(-8, -12, 2, 2, cHairFlame);

        p(3, -12, 3, 5, cJacket);
        p(4, -8, 2, 2, cSkin);

        p(-4, -21, 8, 7, cSkin);
        p(1, -19, 2, 2, cEyes);
        p(-3, -26, 6, 5, cHairCrimson);
        p(-2, -23, 5, 2, cHairFlame);
        break;

      case PlayerState.CROUCH:
        p(-6, -2, 5, 2, cBoots);
        p(1, -2, 5, 2, cBoots);
        p(-5, -5, 10, 3, cPants);

        p(-5, -11, 10, 6, cJacket);
        p(-1, -11, 2, 6, cJacketTrim);

        p(-7, -9, 3, 4, cJacket);
        p(4, -9, 3, 4, cJacket);
        p(-7, -5, 2, 2, cSkin);
        p(5, -5, 2, 2, cSkin);

        p(-4, -18, 8, 7, cSkin);
        p(1, -16, 2, 2, cEyes);
        p(-3, -23, 6, 5, cHairCrimson);
        p(-2, -20, 5, 2, cHairFlame);
        break;

      case PlayerState.JUMP_UP:
      case PlayerState.JUMP_LEFT:
      case PlayerState.JUMP_RIGHT:
        p(-4, -4, 3, 6, cBoots);
        p(1, -5, 3, 6, cBoots);
        p(-4, -10, 3, 6, cPants);
        p(1, -11, 3, 6, cPants);

        p(-5, -17, 10, 7, cJacket);
        p(-1, -17, 2, 7, cJacketTrim);

        p(-6, -25, 2, 8, cJacket);
        p(4, -25, 2, 8, cJacket);
        p(-6, -27, 2, 3, cSkin);
        p(4, -27, 2, 3, cSkin);

        p(-4, -24, 8, 7, cSkin);
        p(1, -23, 2, 2, cEyes);
        p(-3, -31, 6, 7, cHairCrimson);
        p(-2, -27, 5, 4, cHairFlame);
        break;

      case PlayerState.AIRBORNE:
      case PlayerState.FALLING:
        p(-5, -2, 3, 5, cBoots);
        p(2, -3, 3, 5, cBoots);
        p(-4, -8, 3, 6, cPants);
        p(1, -9, 3, 6, cPants);

        p(-5, -15, 10, 7, cJacket);
        p(-7, -14, 3, 5, cJacket);
        p(4, -14, 3, 5, cJacket);
        p(-8, -10, 2, 2, cSkin);
        p(6, -10, 2, 2, cSkin);

        p(-4, -22, 8, 7, cSkin);
        p(1, -20, 2, 2, cEyes);
        p(-3, -28, 6, 6, cHairCrimson);
        p(-2, -25, 5, 3, cHairFlame);
        break;

      case PlayerState.GRABBING:
      case PlayerState.CLIMBING:
        p(-6, 0, 3, 3, cSkin);
        p(3, 0, 3, 3, cSkin);

        p(-5, 2, 2, 5, cJacket);
        p(3, 2, 2, 5, cJacket);

        p(-4, 3, 8, 7, cSkin);
        p(1, 5, 2, 2, cEyes);
        p(-3, -2, 6, 5, cHairCrimson);

        const hangY = state === PlayerState.GRABBING ? 9 : 4;
        p(-5, hangY, 10, 7, cJacket);
        p(-4, hangY + 7, 3, 6, cPants);
        p(1, hangY + 7, 3, 6, cPants);
        p(-4, hangY + 12, 3, 4, cBoots);
        p(1, hangY + 12, 3, 4, cBoots);
        break;

      case PlayerState.DAMAGED:
      case PlayerState.FALLEN_LAVA:
        p(-6, -4, 4, 4, cBoots);
        p(2, -2, 4, 4, cBoots);
        p(-5, -10, 10, 6, '#dc2626');

        p(-7, -15, 3, 5, cJacket);
        p(4, -16, 3, 5, cJacket);

        p(-4, -22, 8, 7, '#fee2e2');
        p(1, -20, 2, 2, '#ef4444');
        p(-3, -28, 6, 6, '#b91c1c');
        break;

      case PlayerState.VICTORY:
        p(-5, -3, 4, 3, cBoots);
        p(1, -3, 4, 3, cBoots);
        p(-4, -8, 8, 5, cPants);
        p(-5, -15, 10, 7, cJacket);

        p(4, -25, 2, 10, cJacket);
        p(3, -28, 4, 3, cSkin);

        p(-7, -13, 3, 5, cJacket);

        p(-4, -22, 8, 7, cSkin);
        p(1, -20, 2, 2, cEyes);
        p(-3, -28, 6, 6, cHairCrimson);
        break;
    }
  }

  // --- RENDER PARTICLES ---

  public renderParticles(particles: Particle[], cameraY: number) {
    const ctx = this.ctx;
    for (const p of particles) {
      const screenY = p.y - cameraY;
      if (screenY < -20 || screenY > VIEW_HEIGHT + 20) continue;

      const alpha = p.alpha !== undefined ? p.alpha : p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = p.color;

      if (p.type === 'smoke') {
        ctx.beginPath();
        ctx.arc(p.x, screenY, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'star') {
        ctx.fillRect(p.x - p.size / 2, screenY - p.size / 2, p.size, p.size);
      } else if (p.type === 'debris') {
        ctx.fillRect(p.x - p.size / 2, screenY - p.size / 2, p.size, p.size);
      } else if (p.type === 'flare') {
        ctx.beginPath();
        ctx.arc(p.x, screenY, p.size, 0, Math.PI * 2);
        ctx.fill();
        // Inner white core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, screenY, p.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'shockwave') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 3 * alpha;
        ctx.beginPath();
        ctx.arc(p.x, screenY, p.size * (1 - alpha), 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.fillRect(p.x - p.size / 2, screenY - p.size / 2, p.size, p.size);
      }
      ctx.restore();
    }
  }

  public renderFlash(alpha: number) {
    if (alpha <= 0) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    ctx.restore();
  }

  // --- RENDER FLOATING TEXTS ---

  public renderFloatingTexts(texts: FloatingText[], cameraY: number) {
    const ctx = this.ctx;
    for (const t of texts) {
      const screenY = t.y - cameraY;
      if (screenY < -50 || screenY > VIEW_HEIGHT + 50) continue;

      ctx.save();
      ctx.translate(t.x, screenY);
      ctx.scale(t.scale, t.scale);
      ctx.globalAlpha = Math.max(0, Math.min(1, t.alpha));
      ctx.font = 'bold 16px "Chakra Petch", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = t.color;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText(t.text, 0, 0);
      ctx.fillText(t.text, 0, 0);
      ctx.restore();
    }
  }

  // --- RENDER DYNAMIC RISING LAVA ---

  public renderLava(lavaY: number, cameraY: number) {
    const ctx = this.ctx;
    const screenLavaY = lavaY - cameraY;

    if (screenLavaY > VIEW_HEIGHT) return;

    const lavaTop = Math.max(0, screenLavaY);
    const lavaHeight = VIEW_HEIGHT - lavaTop;

    ctx.save();

    // 1. Fiery heat glow above magma surface
    const heatGrad = ctx.createLinearGradient(0, screenLavaY - 60, 0, screenLavaY);
    heatGrad.addColorStop(0, 'rgba(239, 68, 68, 0)');
    heatGrad.addColorStop(1, 'rgba(249, 115, 22, 0.45)');
    ctx.fillStyle = heatGrad;
    ctx.fillRect(0, screenLavaY - 60, VIEW_WIDTH, 60);

    // 2. Animated Magma Waves
    const waveCount = 3;
    const waveColors = ['#f97316', '#dc2626', '#991b1b'];

    for (let w = 0; w < waveCount; w++) {
      ctx.fillStyle = waveColors[w];
      ctx.beginPath();
      ctx.moveTo(0, VIEW_HEIGHT);
      ctx.lineTo(0, screenLavaY + w * 8);

      const waveSpeed = this.animTimer * (3 + w * 1.5);
      const waveFreq = 0.03 + w * 0.01;
      const waveAmp = 6 + w * 3;

      for (let x = 0; x <= VIEW_WIDTH; x += 10) {
        const y = screenLavaY + w * 8 + Math.sin(x * waveFreq + waveSpeed) * waveAmp;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(VIEW_WIDTH, VIEW_HEIGHT);
      ctx.closePath();
      ctx.fill();
    }

    // 3. Boiling magma bubbles
    const bubbleTime = this.animTimer * 2;
    for (let b = 0; b < 6; b++) {
      const bx = ((b * 75 + Math.sin(bubbleTime + b) * 20) % VIEW_WIDTH);
      const by = screenLavaY + 12 + ((bubbleTime * 15 + b * 20) % (lavaHeight + 20));
      const bSize = 3 + (Math.sin(bubbleTime * 3 + b) + 1) * 2;
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(bx, by, bSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Crusty burning lava rocks on bottom
    ctx.fillStyle = '#450a0a';
    for (let x = 0; x < VIEW_WIDTH; x += 30) {
      ctx.fillRect(x, VIEW_HEIGHT - 16, 24, 16);
    }

    ctx.restore();
  }
}
