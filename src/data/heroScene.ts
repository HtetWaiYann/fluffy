// Enough rows to cover a tall phone; extra rows overflow off the top and are clipped.
const ROWS = 8;
// Enough per row for a 21:9 ultra-wide screen (needs 19 at 65% overlap);
// phones and tablets hide the extras.
const COLS = 20;

/** Timing for one character's jump, in seconds. */
export type JumpTiming = { delay: number; duration: number };

// Seeded pseudo-random numbers (mulberry32): they look random but are the same on
// every run, so the server and the browser render identical HTML. Math.random()
// would differ between the two and cause a hydration mismatch.
function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = seededRandom(7);

// every jump takes 1.2s, but starts at a random time (0–2.4s), so they don't jump together.
const randomTiming = (): JumpTiming => ({
  delay: +(random() * 2.4).toFixed(2),
  duration: 1.2,
});

export const CROWD: readonly (readonly JumpTiming[])[] = Array.from(
  { length: ROWS },
  () => Array.from({ length: COLS }, randomTiming),
);

export const CENTER_TIMING: JumpTiming = randomTiming();
