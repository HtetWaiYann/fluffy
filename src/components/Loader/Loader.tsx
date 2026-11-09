"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useLoader } from "@/components/providers/LoaderProvider";
import { HERO_IMAGE_SRCS, LOADER_PEEPS, PEEP_SIZE } from "@/data/images";
import { useAssetsReady } from "@/hooks/useAssetsReady";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE_OUT, LOADER_COUNTER_DURATION } from "@/lib/motion";
import styles from "./Loader.module.scss";

export function Loader() {
  const { isLoaded, markLoaded } = useLoader();
  const { progress, isReady } = useAssetsReady(HERO_IMAGE_SRCS);
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

  useEffect(() => {
    if (isReady) markLoaded();
  }, [isReady, markLoaded]);

  if (isLoaded) return null;

  return (
    <div className={styles.loader} data-loader role="status">
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
