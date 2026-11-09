"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type LoaderContextValue = {
  isLoaded: boolean;
  markLoaded: () => void;
};

const LoaderContext = createContext<LoaderContextValue | null>(null);

/** Shares "has the loader finished?" with the whole page. */
export function LoaderProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  // Stable function, so effects that depend on it don't re-run.
  const markLoaded = useCallback(() => setIsLoaded(true), []);

  return (
    <LoaderContext value={{ isLoaded, markLoaded }}>{children}</LoaderContext>
  );
}

/** Reads the loader state. Throws if used outside <LoaderProvider>. */
export function useLoader() {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used inside <LoaderProvider>.");
  }
  return context;
}
