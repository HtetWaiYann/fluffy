"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLoader } from "./LoaderProvider";

type LenisRef = RefObject<Lenis | null>;

const LenisContext = createContext<LenisRef | null>(null);

/**
 * Smooth scrolling (Lenis). Runs on GSAP's clock, so scrolling and scroll
 * animations update together. Off for reduced motion (normal scroll).
 * Reference: https://github.com/darkroomengineering/lenis#gsap-scrolltrigger
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const { isLoaded } = useLoader();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({ autoRaf: false });
    instance.stop();
    instance.on("scroll", ScrollTrigger.update);
    // gsap.ticker gives seconds; Lenis wants milliseconds.
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    lenisRef.current = instance;

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenisRef.current = null;
    };
  }, []);

  // no scrolling while the loader is showing, or the scene plays behind it.
  useEffect(() => {
    if (isLoaded) lenisRef.current?.start();
  }, [isLoaded]);

  return <LenisContext value={lenisRef}>{children}</LenisContext>;
}

/**
 * Gives access to Lenis (e.g. to auto-scroll).
 * @returns a ref; `.current` is null before load and for reduced motion.
 */
export function useLenis() {
  const context = useContext(LenisContext);
  if (!context) {
    throw new Error("useLenis must be used inside <SmoothScroll>.");
  }
  return context;
}
