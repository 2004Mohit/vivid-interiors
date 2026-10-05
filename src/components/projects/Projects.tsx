import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./projects.css";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  number: string;
  title: string;
  location: string;
  year: string;
  category: string;
  image: string;
};

const projects: Project[] = [
  {
    number: "01",
    title: "Emirus 801",
    location: "Pune",
    year: "2026",
    category: "Residential",
    image: "/images/01_Emirus_801/01_07_emirus_801_baner_pune_p010.jpeg",
  },
  {
    number: "02",
    title: "Emirus 801",
    location: "Pune",
    year: "2026",
    category: "Living Spaces",
    image: "/images/01_Emirus_801/01_05_emirus_801_baner_pune_p009.jpeg",
  },
  {
    number: "03",
    title: "Emirus 801",
    location: "Pune",
    year: "2026",
    category: "Interior Architecture",
    image: "/images/01_Emirus_801/01_06_emirus_801_baner_pune_p009.jpeg",
  },
];

function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const projectRefs = useRef<(HTMLElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const context = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        return;
      }

      projectRefs.current.forEach((project) => {
        if (!project) {
          return;
        }

        const image = project.querySelector(
          ".vivid-project__image",
        ) as HTMLElement | null;

        const frame = project.querySelector(
          ".vivid-project__image-frame",
        ) as HTMLElement | null;

        const meta = project.querySelector(
          ".vivid-project__meta",
        ) as HTMLElement | null;

        const title = project.querySelector(
          ".vivid-project__title",
        ) as HTMLElement | null;

        if (!image || !frame || !meta || !title) {
          return;
        }

        const entrance = gsap.timeline({
          scrollTrigger: {
            trigger: project,
            start: "top 78%",
            once: true,
          },
        });

        entrance
          .fromTo(
            frame,
            {
              clipPath: "inset(10% 8% 10% 8%)",
            },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.4,
              ease: "power4.out",
            },
          )
          .fromTo(
            [meta, title],
            {
              opacity: 0,
              y: 30,
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
              trigger: frame,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="vivid-projects">
      <div className="vivid-projects__header">
        <div className="vivid-projects__eyebrow">
          <span>03</span>
          <p>Selected Projects</p>
        </div>

        <h2>
          Spaces
          <br />
          <span>we have shaped.</span>
        </h2>

        <p className="vivid-projects__intro">
          A selection of spaces where material, light and personality come
          together to create interiors that feel unmistakably personal.
        </p>
      </div>

      <div className="vivid-projects__list">
        {projects.map((project, index) => (
          <article
            key={`${project.number}-${project.title}-${index}`}
            ref={(element) => {
              projectRefs.current[index] = element;
            }}
            className={`vivid-project vivid-project--${index + 1}`}
          >
            <div className="vivid-project__image-frame">
              <img
                src={project.image}
                alt={`${project.title} interior designed by Vivid Interiors`}
                className="vivid-project__image"
              />

              <div className="vivid-project__overlay" />

              <div className="vivid-project__number">{project.number}</div>
            </div>

            <div className="vivid-project__details">
              <div className="vivid-project__meta">
                <span>{project.category}</span>
                <span>
                  {project.location} / {project.year}
                </span>
              </div>

              <h3 className="vivid-project__title">{project.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Projects;
