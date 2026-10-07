import { useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import useReveal from "../../hooks/useReveal";
import Accent from "../ui/Accent";
import { projects } from "../../data/projects";
import "./projects.css";

const getRelativePosition = (
  index: number,
  activeIndex: number,
  total: number,
) => {
  let difference = index - activeIndex;

  if (difference > total / 2) {
    difference -= total;
  }

  if (difference < -total / 2) {
    difference += total;
  }

  return difference;
};

function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [activeProject, setActiveProject] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  const project = projects[activeProject] ?? projects[0];

  // enter / exit animation for every [data-reveal] element in this section
  useReveal(sectionRef);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;

    if (!section || !cards) {
      return;
    }

    const context = gsap.context(() => {
      if (prefersReducedMotion()) {
        return;
      }

      const handlePointerMove = (event: PointerEvent) => {
        if (window.innerWidth <= 700) {
          return;
        }

        const rect = cards.getBoundingClientRect();

        if (!rect.width || !rect.height) {
          return;
        }

        const x = (event.clientX - rect.left) / rect.width - 0.5;

        const y = (event.clientY - rect.top) / rect.height - 0.5;

        gsap.to(cards, {
          rotateY: x * 7,
          rotateX: -y * 5,
          duration: 0.7,
          ease: "power3.out",
          overwrite: true,
        });
      };

      const handlePointerLeave = () => {
        gsap.to(cards, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      };

      cards.addEventListener("pointermove", handlePointerMove);

      cards.addEventListener("pointerleave", handlePointerLeave);

      return () => {
        cards.removeEventListener("pointermove", handlePointerMove);

        cards.removeEventListener("pointerleave", handlePointerLeave);
      };
    }, section);

    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    const cards = cardsRef.current;

    if (!cards || !project) {
      return;
    }

    const cardElements = Array.from(
      cards.querySelectorAll<HTMLElement>(".vivid-projects__card"),
    );

    if (cardElements.length === 0) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const total = project.images.length;

    cardElements.forEach((card, index) => {
      const position = getRelativePosition(index, activeImage, total);

      const absolutePosition = Math.abs(position);

      let positionValues: {
        xPercent: number;
        z: number;
        rotateY: number;
        scale: number;
        opacity: number;
        zIndex: number;
      };

      if (position === 0) {
        positionValues = {
          xPercent: 0,
          z: 80,
          rotateY: 0,
          scale: 1,
          opacity: 1,
          zIndex: 50,
        };
      } else if (position === -1) {
        positionValues = {
          xPercent: -48,
          z: -110,
          rotateY: 16,
          scale: 0.78,
          opacity: 0.72,
          zIndex: 40,
        };
      } else if (position === 1) {
        positionValues = {
          xPercent: 48,
          z: -110,
          rotateY: -16,
          scale: 0.78,
          opacity: 0.72,
          zIndex: 40,
        };
      } else if (position === -2) {
        positionValues = {
          xPercent: -82,
          z: -240,
          rotateY: 24,
          scale: 0.58,
          opacity: 0.34,
          zIndex: 30,
        };
      } else if (position === 2) {
        positionValues = {
          xPercent: 82,
          z: -240,
          rotateY: -24,
          scale: 0.58,
          opacity: 0.34,
          zIndex: 30,
        };
      } else {
        positionValues = {
          xPercent: position < 0 ? -105 : 105,
          z: -350,
          rotateY: position < 0 ? 30 : -30,
          scale: 0.45,
          opacity: 0,
          zIndex: 10,
        };
      }

      const { xPercent, z, rotateY, scale, opacity, zIndex } = positionValues;

      const animation = {
        xPercent,
        z,
        rotateY,
        rotateZ: position === 0 ? 0 : position < 0 ? -1.5 : 1.5,
        scale,
        opacity,
        zIndex,
      };

      if (prefersReducedMotion) {
        gsap.set(card, animation);
      } else {
        gsap.to(card, {
          ...animation,
          duration: 0.8,
          ease: "power4.out",
          overwrite: true,
        });
      }

      card.style.pointerEvents = position === 0 ? "auto" : "none";

      card.style.visibility = absolutePosition > 2 ? "hidden" : "visible";
    });
  }, [activeImage, project?.id, project]);

  const changeImage = (direction: 1 | -1) => {
    if (!project) {
      return;
    }

    const total = project.images.length;

    setActiveImage(
      (currentIndex) => (currentIndex + direction + total) % total,
    );
  };

  const selectProject = (index: number) => {
    if (index === activeProject) {
      return;
    }

    setActiveProject(index);
    setActiveImage(0);
  };

  if (!project) {
    return null;
  }

  return (
    <section ref={sectionRef} id="projects" className="vivid-projects">
      <div className="vivid-projects__background" />

      <div className="vivid-projects__header">
        <div className="vivid-projects__eyebrow" data-reveal="right">
          <span>05</span>
          <p>Selected Projects</p>
        </div>

        <h2 data-reveal="up" data-reveal-delay="0.1">
          Spaces made
          <br />
          <Accent>to be experienced.</Accent>
        </h2>
      </div>

      <div className="vivid-projects__layout">
        <div
          className="vivid-projects__stage"
          data-reveal="up"
          data-reveal-duration="1.1"
          style={{
            perspective: "1400px",
          }}
        >
          <div className="vivid-projects__project-info">
            <div className="vivid-projects__project-index">
              <span>{project.number}</span>

              <span>/ {String(projects.length).padStart(2, "0")}</span>
            </div>

            <div className="vivid-projects__project-copy">
              <h3>{project.title}</h3>

              <div className="vivid-projects__project-meta">
                <span>{project.location}</span>

                <span>{project.category}</span>
              </div>

              <p>{project.description}</p>
            </div>
          </div>

          <div ref={cardsRef} className="vivid-projects__cards">
            {project.images.map((image, index) => (
              <article
                key={`${project.id}-${image}`}
                className={`vivid-projects__card ${
                  index === activeImage ? "is-active" : ""
                }`}
                aria-hidden={index !== activeImage}
              >
                <img
                  src={image}
                  alt={`${project.title} interior project view ${index + 1}`}
                  draggable={false}
                />

                <div className="vivid-projects__card-overlay" />

                {index === activeImage && (
                  <div className="vivid-projects__card-label">
                    <span>{project.title}</span>

                    <span>{project.location}</span>
                  </div>
                )}
              </article>
            ))}

            <div className="vivid-projects__image-number">
              <span>{String(activeImage + 1).padStart(2, "0")}</span>

              <span>/ {String(project.images.length).padStart(2, "0")}</span>
            </div>
          </div>

          <div className="vivid-projects__controls">
            <button
              type="button"
              aria-label={`Previous image of ${project.title}`}
              onClick={() => changeImage(-1)}
            >
              <span aria-hidden="true">←</span>
            </button>

            <button
              type="button"
              aria-label={`Next image of ${project.title}`}
              onClick={() => changeImage(1)}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <nav
            className="vivid-projects__project-list"
            aria-label="Selected projects"
          >
            {projects.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={index === activeProject ? "is-active" : ""}
                onClick={() => selectProject(index)}
                aria-current={index === activeProject ? "true" : undefined}
              >
                <span className="vivid-projects__project-list-number">
                  {item.number}
                </span>

                <span className="vivid-projects__project-list-title">
                  {item.title}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}

export default Projects;
