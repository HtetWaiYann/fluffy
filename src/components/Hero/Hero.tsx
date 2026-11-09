import Image from "next/image";
import { CROWD_PEEP, HERO_CENTER, PEEP_SIZE } from "@/data/images";
import { CENTER_TIMING, CROWD, type JumpTiming } from "@/data/heroScene";
import styles from "./Hero.module.scss";

const jumpStyle = ({ delay, duration }: JumpTiming) => ({
  animationDelay: `${delay}s`,
  animationDuration: `${duration}s`,
});

export function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className="visually-hidden">Fluffy Peeps</h1>
      <p className={styles.wordmark} aria-hidden="true">
        Fluffy Peeps
      </p>

      {/* Decorative: hidden from screen readers. */}
      <div className={styles.crowd} aria-hidden="true">
        {CROWD.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((timing, colIndex) => (
              <Image
                key={colIndex}
                className={styles.character}
                style={jumpStyle(timing)}
                src={CROWD_PEEP}
                alt=""
                width={PEEP_SIZE.width}
                height={PEEP_SIZE.height}
                loading="eager"
              />
            ))}
          </div>
        ))}
      </div>

      <Image
        className={styles.center}
        style={jumpStyle(CENTER_TIMING)}
        src={HERO_CENTER.src}
        alt=""
        width={HERO_CENTER.width}
        height={HERO_CENTER.height}
        loading="eager"
      />
    </section>
  );
}
