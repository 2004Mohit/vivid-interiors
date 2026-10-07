import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { setLenis } from "../lib/lenis";

/**
 * Smooth scrolling driven by GSAP's ticker so Lenis and ScrollTrigger always
 * agree on the scroll position (no jitter, one rAF loop for everything).
 */
function useLenis() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      smoothWheel: true,
    });

    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // stop page scrolling while the full-screen menu is open
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains("menu-open")) lenis.stop();
      else lenis.start();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
}

export default useLenis;
