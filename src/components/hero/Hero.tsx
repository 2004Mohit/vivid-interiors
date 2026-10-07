import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroScene3D from "./HeroScene3D";

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const content = contentRef.current;
    const eyebrow = eyebrowRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const hint = hintRef.current;
    const scroll = scrollRef.current;

    if (
      !hero ||
      !content ||
      !eyebrow ||
      !title ||
      !subtitle ||
      !hint ||
      !scroll
    ) {
      return;
    }

    const context = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set([eyebrow, title, subtitle, hint, scroll], {
          opacity: 1,
          y: 0,
        });

        return;
      }

      gsap
        .timeline({ defaults: { ease: "power4.out" }, delay: 0.2 })
        .fromTo(
          eyebrow,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8 },
        )
        .fromTo(
          title,
          { opacity: 0, y: 45 },
          { opacity: 1, y: 0, duration: 1 },
          "-=0.55",
        )
        .fromTo(
          subtitle,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.65",
        )
        .fromTo(hint, { opacity: 0 }, { opacity: 1, duration: 0.6 }, "+=2.6")
        .fromTo(scroll, { opacity: 0 }, { opacity: 1, duration: 0.6 }, "<");

      gsap.to(content, {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="vivid-hero"
      data-nav-theme="light"
    >
      <HeroScene3D />

      <div ref={contentRef} className="vivid-hero__content">
        <p ref={eyebrowRef} className="vivid-hero__eyebrow">
          Vivid Interiors <span>&</span> The Studio Velvet
        </p>

        <h1 ref={titleRef}>
          Spaces
          <br />
          <span>Called Yours.</span>
        </h1>

        <p ref={subtitleRef} className="vivid-hero__subtitle">
          Interior architecture shaped around
          <br />
          personality, material and light.
        </p>
      </div>

      <p ref={hintRef} className="vivid-hero__hint">
        Click the room to rebuild
      </p>

      <div ref={scrollRef} className="vivid-hero__scroll">
        <span>Scroll to explore</span>
        <i />
      </div>
    </section>
  );
}

export default Hero;
