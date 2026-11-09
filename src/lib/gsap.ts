import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Register plugins once here; import gsap from this file everywhere.
gsap.registerPlugin(useGSAP);

export { gsap, useGSAP };
