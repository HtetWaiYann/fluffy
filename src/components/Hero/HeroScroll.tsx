"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useLoader } from "@/components/providers/LoaderProvider";
import { gsap, Observer, useGSAP } from "@/lib/gsap";
import { HERO_GESTURE_TOLERANCE, HERO_RESIZE_SETTLE } from "@/lib/motion";
import { buildHeroScene } from "./buildHeroScene";
import { useHeroEntrance } from "./useHeroEntrance";

type HeroScrollProps = {
  className: string;
  children: ReactNode;
};

/**
 * Hero section + its scroll animation. Only this part runs in the browser.
 * The page doesn't scroll: each scroll gesture flips the scene instead.
 * @param className hero styles
 * @param children hero markup (finds parts by their data-hero-* attributes)
 */
export function HeroScroll({ className, children }: HeroScrollProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { isLoaded } = useLoader();
  // a ref, so the gesture handlers (made once) see the latest value.
  const isLoadedRef = useRef(isLoaded);
  useHeroEntrance(sectionRef);

  useEffect(() => {
    isLoadedRef.current = isLoaded;
  }, [isLoaded]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // both queries listed: GSAP only runs this when one of them matches.
      // rebuilds if the reduced motion setting flips.
      const motionQueries = {
        isReduced: "(prefers-reduced-motion: reduce)",
        isFull: "(prefers-reduced-motion: no-preference)",
      };
      mm.add(motionQueries, (context) => {
        const section = sectionRef.current;
        const center =
          section?.querySelector<HTMLElement>("[data-hero-center]");
        const body = center?.querySelector<HTMLElement>("[data-hero-body]");
        const crowd = section?.querySelector<HTMLElement>("[data-hero-crowd]");
        const title = section?.querySelector<HTMLElement>("[data-hero-title]");
        const ground =
          section?.querySelector<HTMLElement>("[data-hero-ground]");
        if (!section || !center || !body || !crowd || !title || !ground) return;

        // CSS uses this to pause whatever is hidden: "1", "2" or "change".
        const setScene = (value: string) => (section.dataset.scene = value);

        const scene = buildHeroScene(
          { section, center, body, crowd, title, ground },
          {
            isReduced: context.conditions?.isReduced ?? false,
            onComplete: () => setScene("2"),
            onReverseComplete: () => setScene("1"),
          },
        );

        let isPlayed = false;

        // go to scene 2 (play) or scene 1 (reverse). one change at a time:
        // gestures during a change are ignored, or a long swipe would flip
        // it back and forth.
        const show = (isScene2: boolean) => {
          if (!isLoadedRef.current || scene.isActive()) return;
          if (isScene2 === isPlayed) return;
          isPlayed = isScene2;
          setScene("change");
          if (isScene2) scene.play();
          else scene.reverse();
        };

        // On scroll: down flips to the other scene (a loop: 1 -> 2 -> 1 ...),
        // up goes back to scene 1. Observer reads wheel and touch swipes
        // without the page scrolling, so there's no scroll position to fight.
        // Reference: https://gsap.com/docs/v3/Plugins/Observer/
        Observer.create({
          target: window,
          type: "wheel,touch",
          // wheel and touch give "scroll down" opposite signs. -1 flips the
          // wheel, so both call onUp. (same as GSAP's full-screen demo.)
          wheelSpeed: -1,
          tolerance: HERO_GESTURE_TOLERANCE,
          // stops iOS rubber-banding and pull-to-refresh on a swipe.
          preventDefault: true,
          onUp: () => show(!isPlayed),
          onDown: () => show(false),
        });

        // on resize: measure again once it settles, stay on the same scene.
        // (debounced: re-measuring reads layout, so not on every resize event.)
        const relayout = gsap
          .delayedCall(HERO_RESIZE_SETTLE, () => {
            // back to the start first, or GSAP takes scene 2 as the start.
            scene.progress(0).invalidate();
            // end and back: measure now, not on the next change.
            // edge case: mid-change, this jumps it to the end.
            scene.progress(1).progress(isPlayed ? 1 : 0);
            setScene(isPlayed ? "2" : "1");
          })
          .pause();
        const onResize = () => relayout.restart(true);
        window.addEventListener("resize", onResize);

        return () => window.removeEventListener("resize", onResize);
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={className} data-scene="1">
      {children}
    </section>
  );
}
