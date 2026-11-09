import { SOCIAL_ICONS } from "@/data/socialIcons";
import styles from "./HeroCtas.module.scss";

const CTA_BLOB_VIEWBOX = "0 0 254.73 221.92";
const CTA_BLOB =
  "m225.68,15.74c-25.47-21.39-54.72-22.72-79.62,6.86-24.91,29.57-40.17,54.92-72.67,49.26-32.5-5.66-62.08,14.2-71.32,44.78-9.24,30.58,13.36,75.03,52.18,90.3,38.81,15.27,72.91,24.12,122.72.19,49.81-23.93,68.79-79.19,75.51-108.95,6.71-29.76-1.32-61.04-26.79-82.44Z";

export function HeroCtas() {
  return (
    <div className={styles.ctas}>
      <div className={styles.socials}>
        {SOCIAL_ICONS.map(({ label, name, path, scale }) => (
          // type="button" + aria-label: the brief says these don't go anywhere,
          // and the icon has no text, so screen readers need the name.
          <button
            key={name}
            type="button"
            className={styles.social}
            aria-label={label}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle
                cx="12"
                cy="12"
                r="12"
                style={{ fill: `var(--color-${name})` }}
              />
              {/* shrink the glyph around the centre of the circle */}
              <path
                d={path}
                className={styles.glyph}
                transform={`translate(12 12) scale(${scale}) translate(-12 -12)`}
              />
            </svg>
          </button>
        ))}
      </div>

      <button type="button" className={styles.collection}>
        <svg viewBox={CTA_BLOB_VIEWBOX} aria-hidden="true">
          <path d={CTA_BLOB} />
        </svg>
        <span className={styles.collectionLabel}>View collection</span>
      </button>
    </div>
  );
}
