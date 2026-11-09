// All durations are in seconds (GSAP's unit).

/** Minimum loader time, so it never just flickers. */
export const LOADER_MIN_DURATION = 1.2;

/** Maximum loader time, so a slow network never traps the user. */
export const LOADER_MAX_DURATION = 8;

/** How long the loader's number takes to catch up with the real progress. */
export const LOADER_COUNTER_DURATION = 0.6;

/** Fast start, gentle stop: the default feel for things settling into place. */
export const EASE_OUT = "power2.out";
