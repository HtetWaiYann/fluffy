"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import {
  EASE_IN_OUT,
  HERO_LIE_FIT,
  HERO_LIE_ROTATION,
  HERO_PIN_LENGTH,
  HERO_SCENE_DURATION,
  HERO_TITLE_FIT,
  HERO_TITLE_LIFT,
  HERO_LIE_DROP,
} from "@/lib/motion";
import { useLenis } from "@/components/providers/SmoothScroll";

type HeroScrollProps = { className: string; children: ReactNode };

/**
 * Hero section + its scroll animation. Only this part runs in the browser.
 * @param className hero styles
 * @param children hero markup (finds parts by their data-hero-* attributes)
 */
export function HeroScroll({ className, children }: HeroScrollProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const lenisRef = useLenis();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // reduced motion: skip all of this, hero stays still.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const section = sectionRef.current;
        const center =
          section?.querySelector<HTMLElement>("[data-hero-center]");
        const body = center?.querySelector<HTMLElement>("[data-hero-body]");
        const crowd = section?.querySelector<HTMLElement>("[data-hero-crowd]");
        const title = section?.querySelector<HTMLElement>("[data-hero-title]");
        if (!section || !center || !body || !crowd || !title) return;

        // how much to grow the title so it fills HERO_TITLE_FIT of the screen width.
        const titleScale = () =>
          (section.offsetWidth * HERO_TITLE_FIT) / title.offsetWidth;

        // scene 1 -> 2: crowd shrinks away, nurse lies down, title grows.
        // all start together. plays by time (not by scroll), so it never stops halfway.
        const scene = gsap
          .timeline({
            paused: true,
            defaults: { duration: HERO_SCENE_DURATION, ease: EASE_IN_OUT },
          })
          // animate each row, not the whole crowd. animating the whole crowd
          // breaks z-index, and the nurse jumps in front of the front row.
          // every row shrinks into the bottom-right corner.
          .to(crowd.children, {
            scale: 0,
            autoAlpha: 0,
            transformOrigin: (_index: number, row: HTMLElement) =>
              `100% ${crowd.offsetHeight - row.offsetTop}px`,
          })
          // turn the image, not its hopping wrapper, so she still hops up and down.
          .to(
            body,
            {
              rotation: HERO_LIE_ROTATION,
              // offsetTop/offsetHeight = her original spot (not moved by animations).
              // move her to the middle of the screen, then HERO_LIE_DROP lower.
              y: () =>
                section.offsetHeight / 2 -
                (center.offsetTop + center.offsetHeight / 2) +
                section.offsetHeight * HERO_LIE_DROP,
              // shrink her so she lies within HERO_LIE_FIT of the screen width.
              scale: () =>
                Math.min(
                  1,
                  (section.offsetWidth * HERO_LIE_FIT) / center.offsetHeight,
                ),
            },
            0,
          )
          // title moves from the corner to the middle, just above her.
          // z-index keeps it behind her.
          .to(
            title,
            {
              x: () =>
                section.offsetWidth / 2 -
                (title.offsetLeft + title.offsetWidth / 2),
              y: () =>
                section.offsetHeight / 2 -
                (title.offsetTop + title.offsetHeight / 2) -
                title.offsetHeight * titleScale() * HERO_TITLE_LIFT,
              scale: titleScale,
            },
            0,
          );

        let isPlayed = false;

        // first scroll down: play the scene and auto-scroll to the end.
        // first scroll up: play it backwards and auto-scroll to the top.
        // lock: the user can't scroll while it auto-scrolls.
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${HERO_PIN_LENGTH}%`,
          pin: true,
          onUpdate: (self) => {
            const isForward = self.direction === 1;
            // onUpdate also runs once on page load, with no scroll at all.
            // so only react when the page really moved (whole pixels, to
            // ignore tiny rounding errors like 0.000001).
            const scrolled = Math.round(self.scroll());
            const hasMoved = isForward
              ? scrolled > Math.round(self.start)
              : scrolled < Math.round(self.end);
            if (!hasMoved || isForward === isPlayed) return;
            isPlayed = isForward;

            if (isForward) scene.play();
            else scene.reverse();
            lenisRef.current?.scrollTo(isForward ? self.end : self.start, {
              duration: HERO_SCENE_DURATION,
              lock: true,
            });
          },
          // on resize: recalculate sizes and positions, stay on the same scene.
          onRefresh: () => {
            scene.invalidate();
            scene.progress(isPlayed ? 1 : 0);
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={className}>
      {children}
    </section>
  );
}
