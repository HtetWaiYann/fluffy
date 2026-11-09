import { seededRandom } from "./seededRandom";

// scene 2 ground: blobs at random spots that never overlap.

// blob outlines, drawn inside a 200 x 200 box.
export const BLOB_SHAPES = [
  "M100 10C140 10 165 45 160 85C155 120 180 150 165 180C150 198 95 198 70 185C40 168 25 135 35 100C45 65 55 10 100 10Z",
  "M60 30C95 5 150 20 170 55C190 90 180 130 150 150C125 168 120 195 85 190C50 185 20 160 18 120C15 80 30 50 60 30Z",
  "M95 15C125 0 160 25 155 60C152 85 185 100 180 135C175 175 130 190 100 175C75 165 55 195 30 175C5 155 20 120 35 100C50 80 60 30 95 15Z",
] as const;

export const BLOB_COLORS = ["mint", "lemon", "lilac"] as const;
export type BlobColor = (typeof BLOB_COLORS)[number];

/** One blob. x/y: its centre (0–1 of the screen). size: 0–1 of the screen's short side. */
export type Blob = {
  shape: number;
  color: BlobColor;
  x: number;
  y: number;
  size: number;
  rotate: number;
};

// blob size range and the space between blobs (share of the screen's short side).
const SIZE_MIN = 0.22;
const SIZE_MAX = 0.34;
const GAP = 0.03;
// how many random spots to try. more tries = a few more blobs.
const TRIES = 2000;

// how far the outline reaches from the centre of its box (share of the box).
// a turned blob always stays inside this circle.
const reach = (path: string) => {
  const points = (path.match(/\d+/g) ?? []).map(Number);
  let max = 0;
  for (let i = 0; i < points.length; i += 2) {
    max = Math.max(max, Math.hypot(points[i] - 100, points[i + 1] - 100));
  }
  return max / 200;
};

// try random spots on a 1 x 1 square. keep a blob only if its circle doesn't
// touch another one. a real screen is this square stretched wider or taller,
// which only moves blobs further apart, so they never overlap on any screen.
// top and bottom count as touching, because the flow repeats top to bottom.
function placeBlobs(): Blob[] {
  const random = seededRandom(3);
  const blobs: (Blob & { radius: number })[] = [];

  for (let i = 0; i < TRIES; i++) {
    const shape = Math.floor(random() * BLOB_SHAPES.length);
    const size = SIZE_MIN + random() * (SIZE_MAX - SIZE_MIN);
    const radius = reach(BLOB_SHAPES[shape]) * size;
    const x = random();
    const y = random();

    const isFree = blobs.every((other) => {
      const dy = Math.abs(other.y - y);
      const distance = Math.hypot(other.x - x, Math.min(dy, 1 - dy));
      return distance >= other.radius + radius + GAP;
    });
    if (!isFree) continue;

    blobs.push({
      shape,
      color: BLOB_COLORS[blobs.length % BLOB_COLORS.length],
      x,
      y,
      size,
      rotate: Math.round(random() * 360),
      radius,
    });
  }
  return blobs;
}

export const GROUND_BLOBS: readonly Blob[] = placeBlobs();
