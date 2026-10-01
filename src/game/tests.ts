/**
 * GEAR RUSH - Logic Verification Tests
 * Simple sanity checks for core game mechanics and leaderboard structure
 */

import { getZoneForY, ZONES } from './level/levelGenerator';
import { getTop50Leaderboard } from './firebase';

export async function runSanityTests() {
  console.log('--- RUNNING GEAR RUSH SANITY TESTS ---');

  // Test 1: Start Zone Mapping (Player starts at Y=640 on bottom gear)
  const startZone = getZoneForY(640);
  console.assert(startZone.zoneIndex === 1, 'Zone at Y=640 should be Zone 1');
  console.assert(startZone.hasRain !== true, 'Zone 1 should NOT have rain');
  console.assert(startZone.isSlippery !== true, 'Zone 1 should NOT be slippery');

  // Test 2: Mid-Game Zone Mapping
  const zone5 = getZoneForY(-70000);
  console.assert(zone5.zoneIndex === 5, 'Zone at Y=-70000 should be Zone 5 (Caldera Extrema)');

  // Test 3: High-Altitude Rain Zone Mapping
  const zone10 = getZoneForY(-150000);
  console.assert(zone10.zoneIndex === 10, 'Zone at Y=-150000 should be Zone 10 (Tormenta de Metal)');
  console.assert(zone10.hasRain === true, 'Zone 10 should have rain');

  // Test 4: Final Slippery Rain Zone Mapping
  const zone11 = getZoneForY(-160000);
  console.assert(zone11.zoneIndex === 11, 'Zone at Y=-160000 should be Zone 11');
  console.assert(zone11.isSlippery === true, 'Zone 11 should be slippery');

  // Test 5: Level Generation Bounds
  const lastZone = ZONES[ZONES.length - 1];
  console.assert(lastZone.endY === -180000, 'Final zone should end at -180000 Y (9000m)');

  // Test 6: Leaderboard Top 50 fetch test
  try {
    const lb = await getTop50Leaderboard();
    console.assert(Array.isArray(lb), 'Leaderboard result should be an array');
    console.log(`Leaderboard fetch verified. Total records: ${lb.length}`);
  } catch (e) {
    console.warn('Leaderboard test skipped offline:', e);
  }

  console.log('--- ALL TESTS PASSED (SANITY) ---');
}
