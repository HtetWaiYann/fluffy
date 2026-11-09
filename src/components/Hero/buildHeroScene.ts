import { gsap } from "@/lib/gsap";
import {
  EASE_IN_OUT,
  HERO_LIE_DROP,
  HERO_LIE_FIT,
  HERO_LIE_FIT_PORTRAIT,
  HERO_LIE_ROTATION,
  HERO_SCENE_DURATION,
  HERO_SCENE_FADE_DURATION,
  HERO_TITLE_FIT,
  HERO_TITLE_LIFT,
} from "@/lib/motion";

/** The hero parts the scene moves. */
export type HeroParts = {
  section: HTMLElement;
  center: HTMLElement;
  body: HTMLElement;
  crowd: HTMLElement;
  title: HTMLElement;
  ground: HTMLElement;
};

type SceneOptions = {
  isReduced: boolean;
  onComplete: () => void;
  onReverseComplete: () => void;
};

/**
 * Scene 1 -> 2 as a paused timeline.
 * Normal: crowd shrinks away, nurse lies down, title grows, blobs fade in.
 * Reduced motion: scene 1 fades out, scene 2 fades in. nothing travels.
 * @param parts the hero elements
 * @param options reduced motion flag + end callbacks
 * @returns the paused timeline
 */
export function buildHeroScene(
  { section, center, body, crowd, title, ground }: HeroParts,
  { isReduced, onComplete, onReverseComplete }: SceneOptions,
) {
  // grow the title to HERO_TITLE_FIT of the screen width.
  const titleScale = () =>
    (section.offsetWidth * HERO_TITLE_FIT) / title.offsetWidth;

  // scene 2 pose: lying in the middle, a little lower.
  const lying = {
    rotation: HERO_LIE_ROTATION,
    y: () =>
      section.offsetHeight / 2 -
      (center.offsetTop + center.offsetHeight / 2) +
      section.offsetHeight * HERO_LIE_DROP,
    // lying down, she fills this much of the screen width.
    scale: () => {
      const isPortrait = section.offsetHeight > section.offsetWidth;
      const fit = isPortrait ? HERO_LIE_FIT_PORTRAIT : HERO_LIE_FIT;
      return Math.min(1, (section.offsetWidth * fit) / center.offsetHeight);
    },
  };

  // scene 2 title: from the corner to the middle, just above her.
  const titleCentered = {
    x: () =>
      section.offsetWidth / 2 - (title.offsetLeft + title.offsetWidth / 2),
    y: () =>
      section.offsetHeight / 2 -
      (title.offsetTop + title.offsetHeight / 2) -
      title.offsetHeight * titleScale() * HERO_TITLE_LIFT,
    scale: titleScale,
    "--pill-opacity": 0,
  };

  const scene = gsap.timeline({
    paused: true,
    defaults: { duration: HERO_SCENE_DURATION, ease: EASE_IN_OUT },
    onComplete,
    onReverseComplete,
  });

  if (isReduced) {
    // fade out, swap places while hidden, fade in.
    return scene
      .to([...crowd.children, body, title], {
        autoAlpha: 0,
        duration: HERO_SCENE_FADE_DURATION,
      })
      .set(body, lying)
      .set(title, titleCentered)
      .to([ground, body, title], {
        autoAlpha: 1,
        duration: HERO_SCENE_FADE_DURATION,
      });
  }

  // all at once. turn the image, not its wrapper, so she keeps hopping.
  return (
    scene
      // rows, not the whole crowd: otherwise the nurse jumps in front.
      // every row shrinks into the bottom-right corner.
      .to(crowd.children, {
        scale: 0,
        autoAlpha: 0,
        transformOrigin: (_index: number, row: HTMLElement) =>
          `100% ${crowd.offsetHeight - row.offsetTop}px`,
      })
      .to(body, lying, 0)
      .to(title, titleCentered, 0)
      .to(ground, { autoAlpha: 1 }, 0)
  );
}
