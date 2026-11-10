import type { RefObject } from "react";
import { useLoader } from "@/components/providers/LoaderProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  EASE_OUT,
  EASE_OUT_STRONG,
  EASE_POP,
  HERO_ENTRANCE_DURATION,
  HERO_POP_AT,
  HERO_POP_DURATION,
  HERO_ROW_STAGGER,
  HERO_UI_AT,
  HERO_UI_DURATION,
  LOADER_EXIT_DURATION,
} from "@/lib/motion";

/**
 * On load: once the loader has faded out, the crowd rises in, the nurse pops
 * up, then the wordmark and buttons come in.
 * @param sectionRef the hero section
 */
export function useHeroEntrance(sectionRef: RefObject<HTMLElement | null>) {
  const { isLoaded } = useLoader();

  useGSAP(
    () => {
      if (!isLoaded) return;
      const mm = gsap.matchMedia();
      // reduced motion: no entrance, the hero is just there under the loader.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const section = sectionRef.current;
        const crowd = section?.querySelector("[data-hero-crowd]");
        const body = section?.querySelector("[data-hero-body]");
        const title = section?.querySelector("[data-hero-title]");
        const ctas = section?.querySelector("[data-hero-ctas]");
        if (!section || !crowd || !body || !title || !ctas) return;

        // only props the scroll scene doesn't use (rows: y, nurse: yPercent).
        // sharing a prop would make the scene remember the hidden start
        // value, and scrolling back up would bring back an empty crowd.
        // from(): starts hidden right away, while the loader still covers it.
        // delay: wait for the loader's fade, so the wave rises on a clear
        // screen, not half-done behind a see-through loader.
        gsap
          .timeline({ delay: LOADER_EXIT_DURATION })
          // every row starts just below the screen. front row (last) first.
          // per row, not one screen for all: on phones the back rows sit
          // above the screen, and one screen down only moved them into view.
          .from(crowd.children, {
            y: (_index: number, row: HTMLElement) =>
              section.offsetHeight - row.offsetTop,
            duration: HERO_ENTRANCE_DURATION,
            ease: EASE_OUT_STRONG,
            stagger: { each: HERO_ROW_STAGGER, from: "end" },
          })
          // the image, not its wrapper: the wrapper's CSS hop owns transform.
          .from(
            body,
            { yPercent: 100, duration: HERO_POP_DURATION, ease: EASE_POP },
            HERO_POP_AT,
          )
          // wordmark drops in from above, buttons rise from below.
          .from(
            title,
            {
              autoAlpha: 0,
              // % of its unscaled box, and CSS draws it big then shrinks it.
              // times its scale = half its on-screen height, as before.
              yPercent: () => -50 * Number(gsap.getProperty(title, "scaleY")),
              duration: HERO_UI_DURATION,
              ease: EASE_OUT,
            },
            HERO_UI_AT,
          )
          .from(
            ctas,
            {
              autoAlpha: 0,
              yPercent: 50,
              duration: HERO_UI_DURATION,
              ease: EASE_OUT,
            },
            HERO_UI_AT,
          );
      });
    },
    { dependencies: [isLoaded], scope: sectionRef },
  );
}
