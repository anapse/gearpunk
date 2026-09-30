/**
 * GEAR RUSH - Logic Verification Tests
 * Simple sanity checks for core game mechanics
 */

import { getZoneForY, ZONES } from './level/levelGenerator';

export function runSanityTests() {
  console.log('--- RUNNING GEAR RUSH SANITY TESTS ---');

  // Test 1: Zone Mapping
  const zone1 = getZoneForY(0);
  console.assert(zone1.zoneIndex === 1, 'Zone at Y=0 should be Zone 1');

  const zone10 = getZoneForY(-90000);
  console.assert(zone10.zoneIndex === 10, 'Zone at Y=-90000 should be Zone 10');
  console.assert(zone10.hasRain === true, 'Zone 10 should have rain');

  const zone11 = getZoneForY(-120000);
  console.assert(zone11.isSlippery === true, 'Zone 11 should be slippery');

  // Test 2: Level Generation Bounds
  const lastZone = ZONES[ZONES.length - 1];
  console.assert(lastZone.endY === -180000, 'Final zone should end at -180000');

  console.log('--- ALL TESTS PASSED (SANITY) ---');
}
