import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";

// Register plugins once here; import gsap from this file everywhere.
gsap.registerPlugin(useGSAP, Observer);

export { gsap, Observer, useGSAP };
