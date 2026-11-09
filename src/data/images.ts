// Hero: Open Peeps busts (CC0), black-and-white line art. One bust repeated
// makes the crowd; the centre one is a different peep with coloured skin
// (only its "Background" fill layers recoloured), so she's the one splash of colour.
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

// What the loader waits for besides fonts: the hero's above-the-fold images.
export const HERO_IMAGE_SRCS: readonly string[] = [CROWD_PEEP, CENTER_PEEP];
