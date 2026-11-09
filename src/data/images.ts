export const PEEP_SIZE = { width: 240, height: 324 };
export const CROWD_PEEP = "/images/peeps/peep-crowd.svg";
export const CENTER_PEEP = "/images/peeps/peep-center.svg";

// Loader: a mini version of the hero crowd, the coloured peep in the middle.
export const LOADER_PEEPS: readonly string[] = [
  CROWD_PEEP,
  CROWD_PEEP,
  CENTER_PEEP,
  CROWD_PEEP,
  CROWD_PEEP,
];

export const HERO_CENTER = {
  src: "/images/peeps/peep-center-nurse.svg",
  width: 222,
  height: 686,
};

export const HERO_IMAGE_SRCS: readonly string[] = [CROWD_PEEP, HERO_CENTER.src];
