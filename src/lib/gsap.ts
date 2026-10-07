import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Register GSAP plugins exactly once for the whole app. */
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
