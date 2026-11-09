/**
 * Random-looking numbers (0–1) that are the same on every run, so the server
 * and the browser render the same HTML (Math.random() would not).
 * Algorithm: mulberry32.
 * @param seed same seed = same numbers
 * @returns a function that gives the next number
 */
export function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
