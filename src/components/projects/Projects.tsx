import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../../data/projects";
import "./projects.css";

gsap.registerPlugin(ScrollTrigger);

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
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [activeProject, setActiveProject] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  const project = projects[activeProject];

  /*
   * Section entrance + subtle 3D pointer movement.
   */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const cards = cardsRef.current;

    if (!section || !stage || !cards) {
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
        stage,
        {
          opacity: 0,
          y: 80,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        },
      );

      const handlePointerMove = (event: PointerEvent) => {
        /*
         * Disable 3D tilt on touch-sized layouts.
         */
        if (window.innerWidth <= 700) {
          return;
        }

        const rect = cards.getBoundingClientRect();

        if (!rect.width || !rect.height) {
          return;
        }

        const pointerX = (event.clientX - rect.left) / rect.width - 0.5;
        const pointerY = (event.clientY - rect.top) / rect.height - 0.5;

        gsap.to(cards, {
          rotateY: pointerX * 7,
          rotateX: -pointerY * 5,
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

  /*
   * Animate image cards whenever the active image changes
   * or when switching to another project.
   */
  useLayoutEffect(() => {
    const cards = cardsRef.current;

    if (!cards) {
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
        rotateZ: position === 0 ? 0 : position < 0 ? -1.2 : 1.2,
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
  }, [activeImage, project.images.length]);

  /*
   * Move through images inside the current project.
   */
  const changeImage = (direction: 1 | -1) => {
    const total = project.images.length;

    setActiveImage(
      (currentIndex) => (currentIndex + direction + total) % total,
    );
  };

  /*
   * Switch between the real portfolio projects.
   *
   * Every project starts from its first gallery image.
   */
  const selectProject = (index: number) => {
    if (index === activeProject) {
      return;
    }

    setActiveProject(index);
    setActiveImage(0);
  };

  return (
    <section ref={sectionRef} className="vivid-projects">
      <div className="vivid-projects__background" />

      <div className="vivid-projects__header">
        <div className="vivid-projects__eyebrow">
          <span>03</span>
          <p>Selected Projects</p>
        </div>

        <h2>
          Spaces made
          <br />
          <span>to be experienced.</span>
        </h2>
      </div>

      <div className="vivid-projects__layout">
        <div
          ref={stageRef}
          className="vivid-projects__stage"
          style={{ perspective: "1400px" }}
        >
          <div ref={cardsRef} className="vivid-projects__cards">
            {project.images.map((image, index) => (
              <article
                key={image}
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
          </div>

          <div className="vivid-projects__carousel-footer">
            <div className="vivid-projects__image-number">
              <span>{String(activeImage + 1).padStart(2, "0")}</span>

              <span>/ {String(project.images.length).padStart(2, "0")}</span>
            </div>

            <div className="vivid-projects__controls">
              <button
                type="button"
                aria-label={`Previous image in ${project.title}`}
                onClick={() => changeImage(-1)}
              >
                <span>←</span>
              </button>

              <button
                type="button"
                aria-label={`Next image in ${project.title}`}
                onClick={() => changeImage(1)}
              >
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        <nav
          className="vivid-projects__project-selector"
          aria-label="Selected projects"
        >
          {projects.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={
                index === activeProject
                  ? "vivid-projects__project-button is-active"
                  : "vivid-projects__project-button"
              }
              aria-current={index === activeProject ? "true" : undefined}
              onClick={() => selectProject(index)}
            >
              <span className="vivid-projects__project-number">
                {item.number}
              </span>

              <span className="vivid-projects__project-content">
                <strong>{item.title}</strong>

                <small>
                  {item.category} · {item.location}
                </small>
              </span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}

export default Projects;
