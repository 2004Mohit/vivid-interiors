import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const locationRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const image = imageRef.current;
    const imageFrame = imageFrameRef.current;
    const eyebrow = eyebrowRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const location = locationRef.current;
    const scroll = scrollRef.current;

    if (
      !hero ||
      !image ||
      !imageFrame ||
      !eyebrow ||
      !title ||
      !subtitle ||
      !location ||
      !scroll
    ) {
      return;
    }

    const context = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(imageFrame, {
          clipPath: "inset(0% 0% 0% 0%)",
        });

        gsap.set(image, {
          scale: 1,
          yPercent: 0,
        });

        gsap.set([eyebrow, title, subtitle, location, scroll], {
          opacity: 1,
          y: 0,
        });

        return;
      }

      const entrance = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      entrance
        .fromTo(
          imageFrame,
          {
            clipPath: "inset(12% 8% 12% 8%)",
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.8,
            delay: 0.15,
          },
        )
        .fromTo(
          image,
          {
            scale: 1.18,
          },
          {
            scale: 1,
            duration: 2,
          },
          "<",
        )
        .fromTo(
          eyebrow,
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.9",
        )
        .fromTo(
          title,
          {
            opacity: 0,
            y: 45,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
          },
          "-=0.65",
        )
        .fromTo(
          subtitle,
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.65",
        )
        .fromTo(
          location,
          {
            opacity: 0,
            y: 15,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.45",
        )
        .fromTo(
          scroll,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.6,
          },
          "-=0.25",
        );

      const isMobile = window.matchMedia("(max-width: 700px)").matches;

      gsap.to(image, {
        yPercent: isMobile ? 5 : 12,
        scale: isMobile ? 1.03 : 1.08,
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
    <section ref={heroRef} id="home" className="vivid-hero">
      <div ref={imageFrameRef} className="vivid-hero__image-frame">
        <img
          ref={imageRef}
          src="/images/01_Emirus_801/01_07_emirus_801_baner_pune_p010.jpeg"
          alt="Emirus 801 interior designed by Vivid Interiors"
          className="vivid-hero__image"
        />

        <div className="vivid-hero__overlay" />
      </div>

      <div className="vivid-hero__content">
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

        <p ref={locationRef} className="vivid-hero__location">
          EMIRUS 801 <span>/</span> PUNE
        </p>
      </div>

      <div ref={scrollRef} className="vivid-hero__scroll">
        <span>Scroll to explore</span>
        <i />
      </div>
    </section>
  );
}

export default Hero;
