export type HeroAnimal = {
  name: string;
  src: string;
};

// Shared by the loader (preloads) and the hero (renders), so they never drift apart.
export const HERO_ANIMALS: readonly HeroAnimal[] = [
  "giraffe",
  "frog",
  "hippo",
  "pig",
  "panda",
  "parrot",
  "penguin",
  "chick",
  "monkey",
].map((name) => ({ name, src: `/images/animals/${name}.svg` }));

// Created once, so hooks receive the same array every render.
export const HERO_IMAGE_SRCS: readonly string[] = HERO_ANIMALS.map(
  (animal) => animal.src,
);
