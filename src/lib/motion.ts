// All durations are in seconds (GSAP's unit).

/** Minimum loader time, so it never just flickers. */
export const LOADER_MIN_DURATION = 1.2;

/** Maximum loader time, so a slow network never traps the user. */
export const LOADER_MAX_DURATION = 8;

/** How long the loader's number takes to catch up with the real progress. */
export const LOADER_COUNTER_DURATION = 0.6;

/** Fast start, gentle stop: the default feel for things settling into place. */
export const EASE_OUT = "power2.out";

/** How long the hero stays stuck while scrolling, in % of the screen height. */
export const HERO_PIN_LENGTH = 100;

/** Scene 1 -> 2 length. 1.2s: slow enough to see, quick enough to not feel stuck. */
export const HERO_SCENE_DURATION = 1.2;

/** Slow start, slow stop: feels like a smooth glide. */
export const EASE_IN_OUT = "power2.inOut";

/** How much the nurse turns to lie down. -90 = head on the left. */
export const HERO_LIE_ROTATION = -90;

/** How wide she is when lying down, as part of the screen width (0.35 = 35%). */
export const HERO_LIE_FIT = 0.35;

/** How wide the title is in scene 2, as part of the screen width (0.8 = 80%). */
export const HERO_TITLE_FIT = 0.8;

/** How far above the middle the title sits, in title heights. 0.5 = she covers its bottom half. */
export const HERO_TITLE_LIFT = 0.5;

/** How far below the middle she lies, as part of the screen height (0.05 = 5%). */
export const HERO_LIE_DROP = 0.05;

/** Loader fade out. 0.6s: soft, but the hero's entrance starts under it, so no wait. */
export const LOADER_EXIT_DURATION = 0.6;

/** Loader fade out for reduced motion: quick, no entrance after it. */
export const LOADER_EXIT_DURATION_REDUCED = 0.3;

/** How long each crowd row takes to rise in. */
export const HERO_ENTRANCE_DURATION = 1;

/** Gap between rows rising in. 0.06s x 8 rows: reads as one wave, not 8 moves. */
export const HERO_ROW_STAGGER = 0.06;

/** Very fast start, long soft stop: the crowd rushes in, then settles. */
export const EASE_OUT_STRONG = "power3.out";

/** When the nurse pops up: after the front rows, so she lands in a filled crowd. */
export const HERO_POP_AT = 0.35;

/** How long the nurse's pop takes. */
export const HERO_POP_DURATION = 0.8;

/** Goes a little past the end and bounces back: a playful "pop". */
export const EASE_POP = "back.out(1.6)";

/** When the wordmark and buttons come in: last, once the scene is mostly there. */
export const HERO_UI_AT = 0.6;

/** How long the wordmark and buttons take to fade and rise in. */
export const HERO_UI_DURATION = 0.6;
