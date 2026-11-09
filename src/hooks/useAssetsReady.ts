import { useEffect, useState } from "react";
import { LOADER_MAX_DURATION, LOADER_MIN_DURATION } from "@/lib/motion";

/** Resolves when the image is downloaded and decoded; rejects if it's broken. */
function loadImage(src: string): Promise<void> {
  const image = new Image();
  image.src = src;
  return image.decode();
}

/**
 * Tracks fonts and images for the loader.
 * @param imageSrcs - Must be a module-level array, or loading restarts every render.
 * @returns `progress` (0–1) and `isReady`.
 */
export function useAssetsReady(imageSrcs: readonly string[]) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const timerIds: number[] = [];
    const wait = (seconds: number) =>
      new Promise<void>((resolve) => {
        timerIds.push(window.setTimeout(resolve, seconds * 1000));
      });

    const tasks = [document.fonts.ready, ...imageSrcs.map(loadImage)];
    let finishedCount = 0;
    const trackedTasks = tasks.map((task) =>
      task.finally(() => {
        finishedCount += 1;
        if (!isCancelled) setProgress(finishedCount / tasks.length);
      }),
    );

    // allSettled: a broken image counts as done instead of blocking the loader.
    const assetsAndMinimumTime = Promise.all([
      Promise.allSettled(trackedTasks),
      wait(LOADER_MIN_DURATION),
    ]);
    // Whichever comes first: everything ready, or the max timeout.
    Promise.race([assetsAndMinimumTime, wait(LOADER_MAX_DURATION)]).then(() => {
      if (!isCancelled) setIsReady(true);
    });

    // Clean up everything on unmount
    return () => {
      isCancelled = true;
      timerIds.forEach((id) => window.clearTimeout(id));
    };
  }, [imageSrcs]);

  return { progress, isReady };
}
