import {
  BLOB_COLORS,
  BLOB_SHAPES,
  GROUND_BLOBS,
  type Blob,
} from "@/data/groundBlobs";
import styles from "./Hero.module.scss";

// same blobs 3 times: above, on and below the screen. the flow moves up one
// copy and repeats. the copy above shows blobs that hang over its bottom edge.
const COPIES = [-100, 0, 100];

// x/y: % of the screen. size: cqmin (% of the screen's short side).
const blobStyle = ({ x, y, size, rotate }: Blob) => ({
  left: `${x * 100}%`,
  top: `${y * 100}%`,
  width: `${size * 100}cqmin`,
  rotate: `${rotate}deg`,
});

/** Scene 2 background: pastel blobs flowing up forever. */
export function Ground() {
  return (
    <div className={styles.ground} aria-hidden="true" data-hero-ground>
      {/* gradient colours, made once and used by every blob */}
      <svg className={styles.groundDefs}>
        <defs>
          {BLOB_COLORS.map((color) => (
            <linearGradient key={color} id={`blob-${color}`} x2="1" y2="1">
              <stop style={{ stopColor: `var(--color-blob-${color}-from)` }} />
              <stop
                offset="1"
                style={{ stopColor: `var(--color-blob-${color}-to)` }}
              />
            </linearGradient>
          ))}
        </defs>
      </svg>

      <div className={styles.groundFlow}>
        {COPIES.map((top) => (
          <div
            key={top}
            className={styles.groundCopy}
            style={{ top: `${top}%` }}
          >
            {GROUND_BLOBS.map((blob, index) => (
              <svg
                key={index}
                className={styles.blob}
                viewBox="0 0 200 200"
                style={blobStyle(blob)}
              >
                <path
                  d={BLOB_SHAPES[blob.shape]}
                  fill={`url(#blob-${blob.color})`}
                />
              </svg>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
