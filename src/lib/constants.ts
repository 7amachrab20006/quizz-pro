export const LEVEL_THRESHOLDS = [0, 50, 120, 200, 400, 700, 1100, 1600, 2200, 3000, 10000];

export function getLevel(xp: number): number {
  let level = 1;
  while (level < LEVEL_THRESHOLDS.length && xp >= LEVEL_THRESHOLDS[level]) {
    level++;
  }
  return level;
}
