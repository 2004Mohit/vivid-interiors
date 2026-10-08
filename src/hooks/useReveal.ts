import { useLayoutEffect, type RefObject } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";

/**
 * Enter / exit animation for everything marked with  data-reveal  inside a
 * section.
 *
 *   data-reveal="up | down | left | right | fade | scale | mask | stagger"
 *   data-reveal-delay="0.15"       seconds
 *   data-reveal-duration="0.9"     seconds
 *
 * "stagger" animates the element's direct children one after another.
 *
 * The element ARRIVES when it scrolls into view and EXITS (the same motion
 * played backwards) when it leaves, in both scroll directions.
 */

type Variant =
  | "up"
  | "down"
  | "left"
  | "right"
  | "fade"
  | "scale"
  | "mask"
  | "stagger";

const FROM: Record<Variant, gsap.TweenVars> = {
  up: { opacity: 0, y: 56 },
  down: { opacity: 0, y: -56 },
  left: { opacity: 0, x: -72 },
  right: { opacity: 0, x: 72 },
  fade: { opacity: 0 },
  scale: { opacity: 0, scale: 0.9 },
  mask: { opacity: 1, clipPath: "inset(14% 14% 14% 14%)", scale: 1.06 },
  stagger: { opacity: 0, y: 40 },
};

const TO: Record<Variant, gsap.TweenVars> = {
  up: { opacity: 1, y: 0 },
  down: { opacity: 1, y: 0 },
  left: { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  fade: { opacity: 1 },
  scale: { opacity: 1, scale: 1 },
  mask: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", scale: 1 },
  stagger: { opacity: 1, y: 0 },
};

export function useReveal(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = scope.current;

    if (!root || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);

      items.forEach((element) => {
        const variant = (element.dataset.reveal as Variant) || "up";
        const from = FROM[variant] ?? FROM.up;
        const to = TO[variant] ?? TO.up;
        const delay = Number(element.dataset.revealDelay ?? 0);
        const duration = Number(element.dataset.revealDuration ?? 0.9);

        const targets: gsap.TweenTarget =
          variant === "stagger" ? Array.from(element.children) : element;

        const tween = gsap.fromTo(targets, from, {
          ...to,
          duration,
          delay,
          ease: "power3.out",
          stagger: variant === "stagger" ? 0.09 : 0,
          paused: true,
          overwrite: "auto",
        });

        ScrollTrigger.create({
          trigger: element,
          start: "top 88%",
          end: "bottom 8%",
          onEnter: () => tween.timeScale(1).play(),
          onEnterBack: () => tween.timeScale(1).play(),
          // exit: run the arrival motion backwards, a little quicker
          onLeave: () => tween.timeScale(1.6).reverse(),
          onLeaveBack: () => tween.timeScale(1.6).reverse(),
        });
      });
    }, root);

    // images / fonts can shift layout after mount
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      context.revert();
    };
  }, [scope]);
}

export default useReveal;
