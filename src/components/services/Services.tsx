import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../../data/projects";
import { services } from "../../data/services";
import "./services.css";

gsap.registerPlugin(ScrollTrigger);

function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [activeService, setActiveService] = useState(0);

  const service = services[activeService];
  const portfolioImage = projects[0]?.images[0] ?? "";

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const visual = visualRef.current;
    const image = imageRef.current;

    if (!section || !visual || !image) {
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
        visual,
        {
          clipPath: "inset(10% 8% 10% 8%)",
          opacity: 0,
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 1.2,
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
            trigger: visual,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, section);

    return () => context.revert();
  }, []);

  const selectService = (index: number) => {
    if (index === activeService) {
      return;
    }

    setActiveService(index);
  };

  const scrollToProjects = () => {
    document.querySelector("#projects")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section ref={sectionRef} id="services" className="vivid-services">
      <div className="vivid-services__background" />

      <div className="vivid-services__header">
        <div className="vivid-services__eyebrow">
          <span>03</span>
          <p>Expertise</p>
        </div>

        <h2>
          The work
          <br />
          <span>behind the space.</span>
        </h2>

        <p className="vivid-services__intro">
          VIVID&apos;s documented expertise brings planning, project execution,
          building systems and customised work together around the needs of each
          interior project.
        </p>
      </div>

      <div className="vivid-services__stage">
        <div ref={visualRef} className="vivid-services__visual">
          <img
            ref={imageRef}
            src={portfolioImage}
            alt="Vivid Interiors residential portfolio interior"
            className="vivid-services__image"
          />

          <div className="vivid-services__visual-overlay" />

          <div className="vivid-services__visual-meta">
            <span>DOCUMENTED EXPERTISE</span>
            <span>VIVID INTERIORS / PUNE</span>
          </div>
        </div>

        <div className="vivid-services__content">
          <div className="vivid-services__active">
            <div className="vivid-services__counter">
              <span>{service.number}</span>
              <span>/ {String(services.length).padStart(2, "0")}</span>
            </div>

            <h3>{service.title}</h3>

            <p>{service.description}</p>

            <button
              type="button"
              className="vivid-services__portfolio-link"
              onClick={scrollToProjects}
            >
              <span>Explore portfolio</span>
              <span aria-hidden="true">↗</span>
            </button>
          </div>

          <div className="vivid-services__list" aria-label="Vivid expertise">
            {services.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={index === activeService ? "is-active" : ""}
                onClick={() => selectService(index)}
                aria-current={index === activeService ? "true" : undefined}
              >
                <span>{item.number}</span>
                <strong>{item.title}</strong>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
