import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../../data/projects";
import { sectors } from "../../data/sectors";
import "./sectors.css";

gsap.registerPlugin(ScrollTrigger);

type SectorsProps = {
  onSelectSector: (sectorId: string | null) => void;
};

function Sectors({ onSelectSector }: SectorsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [activeSector, setActiveSector] = useState(0);

  const sector = sectors[activeSector];

  const representativeProject = projects.find(
    (project) => project.id === sector.imageProjectId,
  );

  const relatedProjects = useMemo(
    () =>
      sector.projectIds
        .map((projectId) =>
          projects.find((project) => project.id === projectId),
        )
        .filter((project): project is (typeof projects)[number] =>
          Boolean(project),
        ),
    [sector],
  );

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const imageFrame = imageFrameRef.current;
    const number = numberRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;
    const portfolio = portfolioRef.current;

    if (
      !section ||
      !image ||
      !imageFrame ||
      !number ||
      !title ||
      !description ||
      !portfolio
    ) {
      return;
    }

    const context = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set([number, title, description, portfolio], {
          clearProps: "all",
        });

        return;
      }

      gsap
        .timeline()
        .fromTo(
          image,
          {
            scale: 1.04,
          },
          {
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
          },
        )
        .fromTo(
          [number, title, description, portfolio],
          {
            opacity: 0,
            y: 18,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.65",
        );
    }, section);

    return () => context.revert();
  }, [activeSector]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const imageFrame = imageFrameRef.current;
    const progress = progressRef.current;

    if (!section || !image || !imageFrame || !progress) {
      return;
    }

    const context = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        return;
      }

      gsap.fromTo(
        imageFrame,
        {
          clipPath: "inset(12% 10% 12% 10%)",
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.3,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        },
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

  const selectSector = (index: number) => {
    if (index === activeSector) {
      return;
    }

    setActiveSector(index);
  };

  const exploreSector = () => {
    onSelectSector(relatedProjects.length > 0 ? sector.id : null);

    window.setTimeout(() => {
      document.querySelector("#projects")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  return (
    <section ref={sectionRef} id="sectors" className="vivid-sectors">
      <div className="vivid-sectors__background" />

      <div className="vivid-sectors__header">
        <div className="vivid-sectors__eyebrow">
          <span>04</span>
          <p>Sectors</p>
        </div>

        <h2>
          Spaces for
          <br />
          <span>every way of living.</span>
        </h2>

        <p className="vivid-sectors__intro">
          VIVID&apos;s documented work spans residential, commercial, jewellery
          shops, studio apartments, sample flats, IT offices and hospitality.
        </p>
      </div>

      <div className="vivid-sectors__stage">
        <div ref={imageFrameRef} className="vivid-sectors__image-frame">
          {representativeProject && (
            <img
              ref={imageRef}
              key={representativeProject.id}
              src={representativeProject.images[0]}
              alt={`${representativeProject.title} interior portfolio view`}
              className="vivid-sectors__image"
            />
          )}

          <div className="vivid-sectors__image-overlay" />

          <div className="vivid-sectors__image-meta">
            <span>VIVID INTERIORS</span>

            <span>
              {representativeProject?.title ?? "PORTFOLIO"}

              {representativeProject?.location
                ? ` / ${representativeProject.location}`
                : ""}
            </span>
          </div>
        </div>

        <div className="vivid-sectors__content">
          <div className="vivid-sectors__counter">
            <span ref={numberRef}>{sector.number}</span>

            <span>/ {String(sectors.length).padStart(2, "0")}</span>
          </div>

          <h3 ref={titleRef}>{sector.title}</h3>

          <p ref={descriptionRef}>{sector.description}</p>

          <div ref={portfolioRef} className="vivid-sectors__portfolio">
            <div className="vivid-sectors__portfolio-heading">
              <span>Portfolio connection</span>

              <span>{relatedProjects.length.toString().padStart(2, "0")}</span>
            </div>

            {relatedProjects.length > 0 ? (
              <div className="vivid-sectors__portfolio-list">
                {relatedProjects.slice(0, 3).map((project) => (
                  <span key={project.id}>{project.title}</span>
                ))}
              </div>
            ) : (
              <p className="vivid-sectors__portfolio-empty">
                No featured project is currently mapped to this sector. The
                sector remains available for future documented portfolio work.
              </p>
            )}

            <button type="button" onClick={exploreSector}>
              <span>
                {relatedProjects.length > 0
                  ? "View related projects"
                  : "View all projects"}
              </span>

              <span aria-hidden="true">↗</span>
            </button>
          </div>

          <div className="vivid-sectors__categories" aria-label="Vivid sectors">
            {sectors.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={index === activeSector ? "is-active" : ""}
                onClick={() => selectSector(index)}
                aria-current={index === activeSector ? "true" : undefined}
              >
                <span>{item.number}</span>
                <strong>{item.title}</strong>
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
