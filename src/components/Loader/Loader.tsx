"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useLoader } from "@/components/providers/LoaderProvider";
import { HERO_IMAGE_SRCS, LOADER_PEEPS, PEEP_SIZE } from "@/data/images";
import { useAssetsReady } from "@/hooks/useAssetsReady";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  EASE_OUT,
  LOADER_COUNTER_DURATION,
  LOADER_EXIT_DURATION,
  LOADER_EXIT_DURATION_REDUCED,
} from "@/lib/motion";
import styles from "./Loader.module.scss";

export function Loader() {
  const { markLoaded } = useLoader();
  const { progress, isReady } = useAssetsReady(HERO_IMAGE_SRCS);
  const [isGone, setIsGone] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const counter = useRef({ value: 0 });

  useGSAP(
    () => {
      gsap.to(counter.current, {
        value: progress * 100,
        duration: LOADER_COUNTER_DURATION,
        ease: EASE_OUT,
        overwrite: true,
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.textContent = String(
              Math.round(counter.current.value),
            );
          }
        },
      });
    },
    { dependencies: [progress] },
  );

  // assets ready: fade out. markLoaded() at the start of the fade, so the hero
  // entrance begins while the loader still covers it (no flash of the hero).
  // removed from the page only when the fade ends.
  useGSAP(
    () => {
      if (!isReady) return;
      const isReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      gsap.to(loaderRef.current, {
        autoAlpha: 0,
        duration: isReduced
          ? LOADER_EXIT_DURATION_REDUCED
          : LOADER_EXIT_DURATION,
        ease: EASE_OUT,
        onStart: markLoaded,
        onComplete: () => setIsGone(true),
      });
    },
    { dependencies: [isReady, markLoaded] },
  );

  if (isGone) return null;

  return (
    <div ref={loaderRef} className={styles.loader} data-loader role="status">
      {/* 
          this is an edge case. if js is disabled on broswer, the loading doesn't work 
          so, we hide it so that user can access the main content
      */}
      <noscript>
        <style>{"[data-loader] { display: none; }"}</style>
      </noscript>
      <div className={styles.peeps}>
        {LOADER_PEEPS.map((src, index) => (
          <Image
            key={index}
            className={styles.peep}
            src={src}
            alt=""
            width={PEEP_SIZE.width}
            height={PEEP_SIZE.height}
            loading="eager" // these are first paint images so we need them immediately
          />
        ))}
      </div>
      <p className={styles.count} aria-hidden="true">
        <span className={styles.number} ref={numberRef}>
          0
        </span>
        %
      </p>
      <p className={styles.label}>Loading</p>
    </div>
  );
}
