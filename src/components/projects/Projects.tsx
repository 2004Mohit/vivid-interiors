import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./projects.css";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  number: string;
  title: string;
  location: string;
  sector: string;
  description: string;
  images: string[];
};

const projects: Project[] = [
  {
    number: "01",
    title: "Emirus 801",
    location: "Pune / India",
    sector: "Residential",
    description:
      "A refined residential interior where warm timber, soft textures and considered lighting create a calm contemporary home.",
    images: [
      "/images/01_Emirus_801/01_07_emirus_801_baner_pune_p010.jpeg",
      "/images/01_Emirus_801/01_05_emirus_801_baner_pune_p009.jpeg",
      "/images/01_Emirus_801/01_06_emirus_801_baner_pune_p009.jpeg",
      "/images/01_Emirus_801/01_08_emirus_801_baner_pune_p011.jpeg",
      "/images/01_Emirus_801/01_11_emirus_801_baner_pune_p013.jpeg",
    ],
  },
];

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
         * Disable the 3D tilt on touch-sized layouts.
         * This prevents the mobile carousel from shifting while
         * the user is interacting with it.
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
   * Animate the image cards whenever the active image changes.
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

      let xPercent = 0;
      let z = 0;
      let rotateY = 0;
      let scale = 1;
      let opacity = 1;
      let zIndex = 50;

      /*
       * Center image.
       */
      if (position === 0) {
        xPercent = 0;
        z = 80;
        rotateY = 0;
        scale = 1;
        opacity = 1;
        zIndex = 50;
      } else if (position === -1) {
        /*
         * Immediate left image.
         */
        xPercent = -88;
        z = -100;
        rotateY = 13;
        scale = 0.78;
        opacity = 0.72;
        zIndex = 40;
      } else if (position === 1) {
        /*
         * Immediate right image.
         */
        xPercent = 88;
        z = -100;
        rotateY = -13;
        scale = 0.78;
        opacity = 0.72;
        zIndex = 40;
      } else if (position === -2) {
        /*
         * Far-left image.
         */
        xPercent = -150;
        z = -220;
        rotateY = 22;
        scale = 0.58;
        opacity = 0.32;
        zIndex = 30;
      } else if (position === 2) {
        /*
         * Far-right image.
         */
        xPercent = 150;
        z = -220;
        rotateY = -22;
        scale = 0.58;
        opacity = 0.32;
        zIndex = 30;
      } else {
        /*
         * Remaining images stay hidden behind the carousel.
         */
        xPercent = position < 0 ? -190 : 190;
        z = -320;
        rotateY = position < 0 ? 28 : -28;
        scale = 0.45;
        opacity = 0;
        zIndex = 10;
      }

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

  const changeImage = (direction: 1 | -1) => {
    const total = project.images.length;

    setActiveImage(
      (currentIndex) => (currentIndex + direction + total) % total,
    );
  };

  /*
   * Kept for future projects.
   * Currently there is only one project, so this does not affect
   * the current layout.
   */
  const selectProject = (index: number) => {
    if (index === activeProject) {
      return;
    }

    setActiveProject(index);
    setActiveImage(0);
  };

  void selectProject;

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
                aria-label="Previous project image"
                onClick={() => changeImage(-1)}
              >
                <span>←</span>
              </button>

              <button
                type="button"
                aria-label="Next project image"
                onClick={() => changeImage(1)}
              >
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;
