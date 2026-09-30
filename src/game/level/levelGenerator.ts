/**
 * GEAR RUSH - Level Generator
 * Clear climbing path with Extra-Large Platform Gears (much bigger platforms),
 * Medium and Small cogs, and open vertical space.
 */

import { Gear, GearType, Collectible, CollectibleType, ZoneConfig, VIEW_WIDTH } from '../types';

export const ZONES: ZoneConfig[] = [
  {
    zoneIndex: 1,
    name: 'Zona 1: Fábrica Inferior',
    subtitle: 'Aprende los saltos, el agarre y el rebote en pared',
    startY: 0,
    endY: -5000,
    bgColorTop: '#1e110a',
    bgColorBottom: '#381608',
    ambientLight: 'rgba(249, 115, 22, 0.15)',
    gearSpeedMult: 0.65,
    explosiveChance: 0.0,
    smallGearChance: 0.1,
    electricChance: 0.0,
    lavaRiseSpeed: 13
  },
  {
    zoneIndex: 2,
    name: 'Zona 2: Maquinaria Pesada',
    subtitle: 'Cambios de giro y engranajes rápidos',
    startY: -5000,
    endY: -10000,
    bgColorTop: '#14121a',
    bgColorBottom: '#261b17',
    ambientLight: 'rgba(234, 179, 8, 0.12)',
    gearSpeedMult: 0.8,
    explosiveChance: 0.08,
    smallGearChance: 0.2,
    electricChance: 0.0,
    lavaRiseSpeed: 16
  },
  {
    zoneIndex: 3,
    name: 'Zona 3: Zona Eléctrica',
    subtitle: 'Engranajes electrificados y sobrecarga',
    startY: -10000,
    endY: -17500,
    bgColorTop: '#081726',
    bgColorBottom: '#0e1f33',
    ambientLight: 'rgba(56, 189, 248, 0.18)',
    gearSpeedMult: 0.95,
    explosiveChance: 0.12,
    smallGearChance: 0.25,
    electricChance: 0.25,
    lavaRiseSpeed: 19
  },
  {
    zoneIndex: 4,
    name: 'Zona 4: Torre Superior',
    subtitle: 'Engranajes explosivos con mecha de 5s',
    startY: -17500,
    endY: -25000,
    bgColorTop: '#1f0d1a',
    bgColorBottom: '#2d1424',
    ambientLight: 'rgba(236, 72, 153, 0.15)',
    gearSpeedMult: 1.1,
    explosiveChance: 0.25,
    smallGearChance: 0.3,
    electricChance: 0.2,
    lavaRiseSpeed: 22
  },
  {
    zoneIndex: 5,
    name: 'Zona 5: Caldera Extrema',
    subtitle: 'Calor intenso y engranajes veloces',
    startY: -25000,
    endY: -32500,
    bgColorTop: '#2a0505',
    bgColorBottom: '#450a0a',
    ambientLight: 'rgba(239, 68, 68, 0.25)',
    gearSpeedMult: 1.25,
    explosiveChance: 0.3,
    smallGearChance: 0.35,
    electricChance: 0.25,
    lavaRiseSpeed: 25
  },
  {
    zoneIndex: 6,
    name: 'Zona 6: Abismo de Vapor',
    subtitle: 'Vapor cegador y ascenso continuo',
    startY: -32500,
    endY: -40000,
    bgColorTop: '#334155',
    bgColorBottom: '#1e293b',
    ambientLight: 'rgba(148, 163, 184, 0.2)',
    gearSpeedMult: 1.4,
    explosiveChance: 0.2,
    smallGearChance: 0.4,
    electricChance: 0.15,
    lavaRiseSpeed: 28
  },
  {
    zoneIndex: 7,
    name: 'Zona 7: Cumbres Nevadas',
    subtitle: 'Engranajes congelados y vientos gélidos',
    startY: -40000,
    endY: -50000,
    bgColorTop: '#e0f2fe',
    bgColorBottom: '#7dd3fc',
    ambientLight: 'rgba(186, 230, 253, 0.2)',
    gearSpeedMult: 1.5,
    explosiveChance: 0.15,
    smallGearChance: 0.45,
    electricChance: 0.1,
    lavaRiseSpeed: 32
  },
  {
    zoneIndex: 8,
    name: 'Zona 8: Cúspide de Cristal',
    subtitle: 'El límite del mundo, el cielo se abre',
    startY: -50000,
    endY: -60000,
    bgColorTop: '#f8fafc',
    bgColorBottom: '#bae6fd',
    ambientLight: 'rgba(255, 255, 255, 0.3)',
    gearSpeedMult: 1.7,
    explosiveChance: 0.2,
    smallGearChance: 0.5,
    electricChance: 0.15,
    lavaRiseSpeed: 35
  },
  {
    zoneIndex: 9,
    name: 'Zona 9: Núcleo Estelar',
    subtitle: 'El ascenso entre las estrellas',
    startY: -60000,
    endY: -70000,
    bgColorTop: '#020617',
    bgColorBottom: '#1e1b4b',
    ambientLight: 'rgba(99, 102, 241, 0.15)',
    gearSpeedMult: 1.9,
    explosiveChance: 0.25,
    smallGearChance: 0.6,
    electricChance: 0.2,
    lavaRiseSpeed: 38
  },
  {
    zoneIndex: 10,
    name: 'Zona 10: Tormenta de Metal',
    subtitle: '¡La lluvia comienza a caer!',
    startY: -70000,
    endY: -77500,
    bgColorTop: '#0f172a',
    bgColorBottom: '#1e1b4b',
    ambientLight: 'rgba(56, 189, 248, 0.1)',
    gearSpeedMult: 2.1,
    explosiveChance: 0.25,
    smallGearChance: 0.65,
    electricChance: 0.2,
    lavaRiseSpeed: 42,
    hasRain: true
  },
  {
    zoneIndex: 11,
    name: 'Zona 11: Cascadas de Aceite',
    subtitle: '¡Cuidado! Todo está resbaladizo',
    startY: -77500,
    endY: -85000,
    bgColorTop: '#1e1b4b',
    bgColorBottom: '#020617',
    ambientLight: 'rgba(99, 102, 241, 0.15)',
    gearSpeedMult: 2.3,
    explosiveChance: 0.3,
    smallGearChance: 0.7,
    electricChance: 0.25,
    lavaRiseSpeed: 48,
    hasRain: true,
    isSlippery: true
  },
  {
    zoneIndex: 12,
    name: 'Zona 12: El Olvido Final',
    subtitle: 'El desafío definitivo bajo la tormenta',
    startY: -85000,
    endY: -90000,
    bgColorTop: '#000000',
    bgColorBottom: '#020617',
    ambientLight: 'rgba(239, 68, 68, 0.1)',
    gearSpeedMult: 2.6,
    explosiveChance: 0.4,
    smallGearChance: 0.8,
    electricChance: 0.3,
    lavaRiseSpeed: 55,
    hasRain: true,
    isSlippery: true
  }
];

export function getZoneForY(y: number): ZoneConfig {
  for (const zone of ZONES) {
    if (y <= zone.startY && y > zone.endY) {
      return zone;
    }
  }
  return ZONES[ZONES.length - 1];
}

export function generateLevel(): { gears: Gear[]; collectibles: Collectible[] } {
  const gears: Gear[] = [];
  const collectibles: Collectible[] = [];

  let gearId = 1;
  let collectibleId = 1;

  // 1. Initial starting platform (EXTRA LARGE GEAR at bottom center: radius 85px)
  const startGear: Gear = {
    id: gearId++,
    x: VIEW_WIDTH / 2, // 240
    y: 640,
    radius: 85,
    type: 'LARGE',
    rotation: 0,
    rotationSpeed: 0.45,
    teethCount: 16,
    hasArrow: true,
    screenIndex: 1
  };
  gears.push(startGear);

  // Climbing pattern with Extra-Large, Medium, and Small gears
  const climbingSteps: Array<{ targetLane: 'LEFT' | 'RIGHT' | 'CENTER'; size: 'LARGE' | 'MEDIUM' | 'SMALL'; dy: number }> = [
    { targetLane: 'LEFT', size: 'LARGE', dy: 155 },
    { targetLane: 'RIGHT', size: 'MEDIUM', dy: 160 },
    { targetLane: 'RIGHT', size: 'LARGE', dy: 155 },
    { targetLane: 'LEFT', size: 'SMALL', dy: 150 },
    { targetLane: 'LEFT', size: 'LARGE', dy: 160 },
    { targetLane: 'RIGHT', size: 'LARGE', dy: 160 },
    { targetLane: 'CENTER', size: 'MEDIUM', dy: 150 },
    { targetLane: 'LEFT', size: 'MEDIUM', dy: 155 },
    { targetLane: 'RIGHT', size: 'LARGE', dy: 160 },
    { targetLane: 'LEFT', size: 'SMALL', dy: 150 },
    { targetLane: 'RIGHT', size: 'LARGE', dy: 160 },
    { targetLane: 'CENTER', size: 'LARGE', dy: 155 }
  ];

  let currentGear = startGear;
  let currentY = startGear.y;
  let stepIdx = 0;

  const totalGearsTarget = 1000;

  while (gears.length < totalGearsTarget && currentY > -90000) {
    const zone = getZoneForY(currentY);
    const step = climbingSteps[stepIdx % climbingSteps.length];
    stepIdx++;

    let targetX = 240;
    if (step.targetLane === 'LEFT') {
      targetX = 125 + (Math.random() * 10 - 5);
    } else if (step.targetLane === 'RIGHT') {
      targetX = 355 + (Math.random() * 10 - 5);
    } else {
      targetX = 240 + (Math.random() * 14 - 7);
    }

    const targetY = currentGear.y - step.dy;

    // Radius specifications:
    // LARGE: 80px to 92px (Very big, safe platform to stand and rotate)
    // MEDIUM: 50px to 56px
    // SMALL: 36px to 40px
    let radius = 52;
    if (step.size === 'LARGE') {
      radius = 80 + Math.floor(Math.random() * 12);
    } else if (step.size === 'SMALL') {
      radius = 36 + Math.floor(Math.random() * 4);
    } else {
      radius = 52 + Math.floor(Math.random() * 5);
    }

    // Type determination
    let type: GearType = (stepIdx % 2 === 0) ? 'NORMAL_CW' : 'NORMAL_CCW';

    if (step.size === 'LARGE') {
      type = 'LARGE';
    } else if (step.size === 'SMALL') {
      type = 'SMALL';
    }

    if (zone.zoneIndex >= 6 && Math.random() < 0.4) {
      type = 'FROZEN';
    } else if (zone.zoneIndex >= 4 && Math.random() < zone.explosiveChance) {
      type = 'EXPLOSIVE';
    } else if (zone.zoneIndex >= 3 && Math.random() < zone.electricChance) {
      type = 'ELECTRIC';
    } else if (Math.random() < 0.1) {
      type = 'FAST';
    } else if (Math.random() < 0.04) {
      type = 'STATIC';
    }

    const baseSpeed = (0.6 + Math.random() * 0.45) * zone.gearSpeedMult;
    const dir = (type === 'NORMAL_CCW' || (stepIdx % 2 === 1)) ? -1 : 1;
    const rotationSpeed = type === 'STATIC' ? 0 : (type === 'FAST' ? dir * baseSpeed * 1.5 : dir * baseSpeed);

    const teethCount = Math.max(8, Math.round(radius / 4.8));

    const newGear: Gear = {
      id: gearId++,
      x: targetX,
      y: targetY,
      radius: radius,
      type: type,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: rotationSpeed,
      teethCount: teethCount,
      hasArrow: type !== 'STATIC',
      screenIndex: zone.zoneIndex,
      fuseTimer: type === 'EXPLOSIVE' ? 5.0 : undefined,
      isArmed: false,
      isExploded: false
    };

    gears.push(newGear);

    // Collectibles placed along jump arc
    if (Math.random() < 0.75) {
      const midX = (currentGear.x + newGear.x) / 2;
      const midY = (currentGear.y + newGear.y) / 2 - 25;
      collectibles.push({
        id: collectibleId++,
        x: midX,
        y: midY,
        type: 'LIGHTNING',
        baseY: midY,
        floatOffset: Math.random() * Math.PI * 2,
        collected: false
      });
    }

    // Powerups & special bonuses
    if (Math.random() < 0.32) {
      const roll = Math.random();
      let specialType: CollectibleType = 'DIAMOND';
      
      if (zone.zoneIndex >= 8 && roll < 0.3) {
        specialType = 'RUBY';
      } else if (roll < 0.25) {
        specialType = 'HEART';
      } else if (roll < 0.45) {
        specialType = 'MAGNET';
      } else if (roll < 0.65) {
        specialType = 'CLOCK';
      } else if (roll < 0.85) {
        specialType = 'STAR';
      }

      collectibles.push({
        id: collectibleId++,
        x: newGear.x,
        y: newGear.y - newGear.radius - 26,
        type: specialType,
        baseY: newGear.y - newGear.radius - 26,
        floatOffset: Math.random() * Math.PI * 2,
        collected: false
      });
    }

    currentGear = newGear;
    currentY = newGear.y;
  }

  return { gears, collectibles };
}
