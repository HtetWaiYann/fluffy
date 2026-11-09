"use client";

import { useEffect } from "react";
import { useLoader } from "@/components/providers/LoaderProvider";
import { HERO_IMAGE_SRCS } from "@/data/heroAnimals";
import { useAssetsReady } from "@/hooks/useAssetsReady";

/** Loading screen. Logic only for now: shows a percentage, then hides. */
export function Loader() {
  const { isLoaded, markLoaded } = useLoader();
  const { progress, isReady } = useAssetsReady(HERO_IMAGE_SRCS);

  useEffect(() => {
    if (isReady) markLoaded();
  }, [isReady, markLoaded]);

  if (isLoaded) return null;

  return <div role="status">Loading {Math.round(progress * 100)}%</div>;
}
