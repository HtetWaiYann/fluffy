import { seededRandom } from "./seededRandom";

// Enough rows to cover a tall phone; extra rows overflow off the top and are clipped.
const ROWS = 8;
// Enough per row for a 21:9 ultra-wide screen (needs 19 at 65% overlap);
// phones and tablets hide the extras.
const COLS = 20;

/** Timing for one character's jump, in seconds. */
export type JumpTiming = { delay: number; duration: number };

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
