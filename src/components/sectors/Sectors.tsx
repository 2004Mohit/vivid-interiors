import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./sectors.css";

gsap.registerPlugin(ScrollTrigger);

type Sector = {
  number: string;
  title: string;
  description: string;
  image: string;
};

const sectors: Sector[] = [
  {
    number: "01",
    title: "Residential",
    description:
      "Personal interiors shaped around everyday living, comfort, material and light.",
    image: "/images/01_Emirus_801/01_07_emirus_801_baner_pune_p010.jpeg",
  },
  {
    number: "02",
    title: "Bungalows",
    description:
      "Distinctive homes where architecture, interiors and personality come together.",
    image: "/images/01_Emirus_801/01_05_emirus_801_baner_pune_p009.jpeg",
  },
  {
    number: "03",
    title: "Studio Apartments",
    description:
      "Thoughtful compact spaces designed to feel open, functional and refined.",
    image: "/images/01_Emirus_801/01_06_emirus_801_baner_pune_p009.jpeg",
  },
  {
    number: "04",
    title: "Commercial Spaces",
    description:
      "Purposeful environments designed around identity, experience and function.",
    image: "/images/01_Emirus_801/01_08_emirus_801_baner_pune_p011.jpeg",
  },
  {
    number: "05",
    title: "Jewellery Shops",
    description:
      "Elegant retail environments where display, lighting and brand identity meet.",
    image: "/images/01_Emirus_801/01_11_emirus_801_baner_pune_p013.jpeg",
  },
  {
    number: "06",
    title: "IT Offices",
    description:
      "Contemporary workspaces balancing collaboration, productivity and character.",
    image: "/images/01_Emirus_801/01_12_emirus_801_baner_pune_p014.jpeg",
  },
  {
    number: "07",
    title: "Hospitality",
    description:
      "Atmospheric spaces created to make every arrival, stay and experience memorable.",
    image: "/images/01_Emirus_801/01_13_emirus_801_baner_pune_p015.jpeg",
  },
];

function Sectors() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const imageFrame = imageFrameRef.current;
    const number = numberRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;
    const progress = progressRef.current;

    if (
      !section ||
      !image ||
      !imageFrame ||
      !number ||
      !title ||
      !description ||
      !progress
    ) {
      return;
    }

    const context = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        return;
      }

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      intro
        .fromTo(
          imageFrame,
          {
            clipPath: "inset(12% 10% 12% 10%)",
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "power4.out",
          },
        )
        .fromTo(
          [number, title, description],
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.8",
        );

      gsap.fromTo(
        image,
        {
          scale: 1.12,
        },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: imageFrame,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        progress,
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          },
        },
      );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="vivid-sectors">
      <div className="vivid-sectors__header">
        <div className="vivid-sectors__eyebrow">
          <span>02</span>
          <p>Sectors</p>
        </div>

        <h2>
          Spaces for
          <br />
          <span>every way of living.</span>
        </h2>

        <p className="vivid-sectors__intro">
          From private residences to workspaces and hospitality environments,
          every project is approached as an individual expression of its people,
          purpose and place.
        </p>
      </div>

      <div className="vivid-sectors__stage">
        <div ref={imageFrameRef} className="vivid-sectors__image-frame">
          <img
            ref={imageRef}
            src={sectors[0].image}
            alt={`${sectors[0].title} interior designed by Vivid Interiors`}
            className="vivid-sectors__image"
          />

          <div className="vivid-sectors__image-overlay" />

          <div className="vivid-sectors__image-meta">
            <span>VIVID INTERIORS</span>
            <span>PUNE / INDIA</span>
          </div>
        </div>

        <div className="vivid-sectors__content">
          <div className="vivid-sectors__counter">
            <span ref={numberRef}>{sectors[0].number}</span>
            <span>/ {String(sectors.length).padStart(2, "0")}</span>
          </div>

          <h3 ref={titleRef}>{sectors[0].title}</h3>

          <p ref={descriptionRef}>{sectors[0].description}</p>

          <div className="vivid-sectors__categories">
            {sectors.map((sector, index) => (
              <button
                key={sector.number}
                type="button"
                className={index === 0 ? "is-active" : ""}
              >
                <span>{sector.number}</span>
                <strong>{sector.title}</strong>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="vivid-sectors__progress">
        <div ref={progressRef} />
      </div>
    </section>
  );
}

export default Sectors;
