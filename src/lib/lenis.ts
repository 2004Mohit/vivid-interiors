import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

export const getLenis = () => instance;

/** Smooth-scroll to a selector/element, using Lenis when it is running. */
export function scrollToTarget(target: string | HTMLElement, offset = 0) {
  const element =
    typeof target === "string"
      ? document.querySelector<HTMLElement>(target)
      : target;

  if (!element) return;

  if (instance) {
    instance.scrollTo(element, { offset, duration: 1.4 });
  } else {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
