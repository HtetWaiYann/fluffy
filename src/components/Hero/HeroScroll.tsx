"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { HERO_SCENE_DURATION } from "@/lib/motion";
import { useLenis } from "@/components/providers/SmoothScroll";
import { buildHeroScene } from "./buildHeroScene";
import { useHeroEntrance } from "./useHeroEntrance";

type HeroScrollProps = {
  className: string;
  trackClassName: string;
  children: ReactNode;
};

/**
 * Hero section + its scroll animation. Only this part runs in the browser.
 * @param className hero styles
 * @param trackClassName the tall box the hero sticks inside while scrolling
 * @param children hero markup (finds parts by their data-hero-* attributes)
 */
export function HeroScroll({
  className,
  trackClassName,
  children,
}: HeroScrollProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const lenisRef = useLenis();
  useHeroEntrance(sectionRef);

  useGSAP(
    () => {
      // reload always starts at scene 1 (the browser would restore the scroll).
      // Reference: https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.clearScrollMemory()
      ScrollTrigger.clearScrollMemory("manual");
      window.scrollTo(0, 0);

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

        // resizing moves the scroll by itself. ignore it until GSAP re-measures.
        // width only: phone address bars change the height, and GSAP doesn't
        // re-measure for those, so the flag would never clear.
        let isResizing = false;
        let lastWidth = window.innerWidth;
        const onResize = () => {
          if (window.innerWidth === lastWidth) return;
          lastWidth = window.innerWidth;
          isResizing = true;
        };
        const onRefreshDone = () => (isResizing = false);
        window.addEventListener("resize", onResize);
        ScrollTrigger.addEventListener("refresh", onRefreshDone);

        // scroll down: play the scene and auto-scroll to the end.
        // scroll up: play it backwards and auto-scroll to the top.
        ScrollTrigger.create({
          trigger: trackRef.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            if (isResizing) return;
            const isForward = self.direction === 1;
            // also runs on load with no scroll, so check the page really moved.
            const scrolled = Math.round(self.scroll());
            const hasMoved = isForward
              ? scrolled > Math.round(self.start)
              : scrolled < Math.round(self.end);
            if (!hasMoved || isForward === isPlayed) return;
            isPlayed = isForward;

            setScene("change");
            if (isForward) scene.play();
            else scene.reverse();
            // lock: no scrolling while it auto-scrolls.
            // (no Lenis in reduced motion: the page just scrolls normally.)
            lenisRef.current?.scrollTo(isForward ? self.end : self.start, {
              duration: HERO_SCENE_DURATION,
              lock: true,
            });
          },
          // on load and resize: measure again, stay on the same scene.
          onRefresh: (self) => {
            // back to the start first, or GSAP takes scene 2 as the start.
            scene.progress(0).invalidate();
            // end and back: measure now, not on the first scroll frame.
            scene.progress(1).progress(isPlayed ? 1 : 0);
            setScene(isPlayed ? "2" : "1");
            // the page changed height, so put the scroll back on this scene.
            lenisRef.current?.scrollTo(isPlayed ? self.end : self.start, {
              immediate: true,
              force: true,
            });
          },
        });

        return () => {
          window.removeEventListener("resize", onResize);
          ScrollTrigger.removeEventListener("refresh", onRefreshDone);
        };
      });
    },
    { scope: sectionRef },
  );

  return (
    <div ref={trackRef} className={trackClassName}>
      <section ref={sectionRef} className={className} data-scene="1">
        {children}
      </section>
    </div>
  );
}
