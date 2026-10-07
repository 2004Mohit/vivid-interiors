import { useEffect, useRef, useState } from "react";
import useReveal from "../../hooks/useReveal";
import { scrollToTarget } from "../../lib/lenis";
import Accent from "../ui/Accent";
import { services, type Service } from "../../data/services";
import { projects } from "../../data/projects";
import "./services.css";

const expertiseImages = projects
  .flatMap((project) => project.images)
  .slice(0, services.length);

function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  const [activeService, setActiveService] = useState(0);
  const [transitionKey, setTransitionKey] = useState(0);

  const service = services[activeService];
  const currentImage = expertiseImages[activeService] ?? "";

  // enter / exit animation for every [data-reveal] element in this section
  useReveal(sectionRef);

  /*
   * Keep the active expertise item visible inside
   * the horizontal trail.
   */
  useEffect(() => {
    const trail = trailRef.current;

    if (!trail) {
      return;
    }

    const activeButton = trail.querySelector<HTMLButtonElement>(
      `[data-expertise-index="${activeService}"]`,
    );

    if (!activeButton) {
      return;
    }

    // Scroll ONLY the trail. scrollIntoView also scrolls page ancestors.
    const trailBounds = trail.getBoundingClientRect();
    const buttonBounds = activeButton.getBoundingClientRect();
    const left =
      trail.scrollLeft +
      buttonBounds.left -
      trailBounds.left -
      (trail.clientWidth - buttonBounds.width) / 2;

    trail.scrollTo({
      left: Math.max(0, Math.min(left, trail.scrollWidth - trail.clientWidth)),
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [activeService]);

  /*
   * Convert vertical mouse-wheel movement into horizontal
   * trail movement on desktop.
   *
   * A native non-passive listener is used so preventDefault()
   * is valid and does not produce browser console errors.
   *
   * Mobile touch scrolling remains completely native.
   */
  useEffect(() => {
    const trail = trailRef.current;

    if (!trail) {
      return;
    }

    const handleWheel = (event: globalThis.WheelEvent) => {
      if (
        Math.abs(event.deltaY) <= Math.abs(event.deltaX) ||
        window.innerWidth <= 700
      ) {
        return;
      }

      event.preventDefault();

      trail.scrollLeft += event.deltaY;
    };

    trail.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      trail.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const changeService = (nextIndex: number) => {
    if (services.length === 0) return;
    const normalizedIndex =
      ((nextIndex % services.length) + services.length) % services.length;

    if (normalizedIndex === activeService) {
      return;
    }

    setActiveService(normalizedIndex);

    /*
     * Changing this key forces the liquid image
     * transition to replay for every expertise change.
     */
    setTransitionKey((value) => value + 1);
  };

  const selectService = (index: number) => {
    changeService(index);
  };

  const scrollToProjects = () => {
    const target = document.getElementById("projects");

    if (!target) {
      return;
    }

    scrollToTarget("#projects");

    window.setTimeout(() => {
      const targetTop = target.getBoundingClientRect().top + window.scrollY;

      const currentScroll = window.scrollY;

      if (Math.abs(targetTop - currentScroll) > 10) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const renderDetail = (
    item: Service,
    variant: "desktop" | "mobile",
    reserve = false,
  ) => (
    <div
      key={`${reserve ? "reserve" : "active"}-${variant}-${item.id}`}
      className={`vivid-services__detail-copy vivid-services__detail-copy--${variant}${reserve ? " vivid-services__detail-reserve" : ""}`}
      aria-hidden={reserve ? true : undefined}
      inert={reserve ? true : undefined}
    >
      <p className="vivid-services__counter">
        <span>{item.number}</span>
        <span>/ {String(services.length).padStart(2, "0")}</span>
      </p>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <button
        type="button"
        className="vivid-services__portfolio-link"
        onClick={scrollToProjects}
        tabIndex={reserve ? -1 : undefined}
      >
        <span>Explore portfolio</span>
        <span aria-hidden="true">↗</span>
      </button>
    </div>
  );

  // Invisible, inert copies share one grid cell and reserve the tallest
  // service at the current width/font. Navigation cannot change page height.
  const renderDetailSlot = (variant: "desktop" | "mobile") => (
    <div
      className={`vivid-services__detail-slot vivid-services__detail-slot--${variant}`}
    >
      {services.map((item) => renderDetail(item, variant, true))}
      {service ? renderDetail(service, variant) : null}
    </div>
  );

  if (!service) return null;

  return (
    <section ref={sectionRef} id="services" className="vivid-services">
      <div className="vivid-services__background" />

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="vivid-services__header vivid-services__hero-copy">
        <div className="vivid-services__eyebrow" data-reveal="right">
          <span>03</span>
          <p>Expertise</p>
        </div>

        <h2 data-reveal="up" data-reveal-delay="0.1">
          The work
          <br />
          <Accent>behind the space.</Accent>
        </h2>

        <p
          className="vivid-services__intro"
          data-reveal="up"
          data-reveal-delay="0.2"
        >
          VIVID&apos;s documented expertise brings planning, project execution,
          building systems and customised work together around the needs of each
          interior project.
        </p>
      </div>

      {/* =========================================================
          MAIN EXPERIENCE
      ========================================================= */}

      <div className="vivid-services__experience">
        {/* ---------------------------------------------------------
            LARGE IMAGE
        --------------------------------------------------------- */}

        <div
          className="vivid-services__visual-wrap"
          data-reveal="mask"
          data-reveal-duration="1.3"
        >
          <div className="vivid-services__visual">
            <div key={transitionKey} className="vivid-services__image-layer">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={service.imageAlt ?? `${service.title} — Vivid Interiors`}
                  className="vivid-services__image"
                />
              ) : null}
            </div>

            <div
              key={`glow-${transitionKey}`}
              className="vivid-services__liquid-glow"
            />

            <div className="vivid-services__visual-overlay" />

            <div className="vivid-services__visual-meta">
              <span>DOCUMENTED EXPERTISE</span>
              <span>VIVID INTERIORS / PUNE</span>
            </div>

            <div className="vivid-services__visual-index">
              <span>{service.number}</span>
              <span>/ {String(services.length).padStart(2, "0")}</span>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------
            ACTIVE EXPERTISE CONTENT
        --------------------------------------------------------- */}

        <div
          className="vivid-services__detail"
          data-reveal="right"
          data-reveal-delay="0.15"
        >
          <div className="vivid-services__detail-topline">
            <span>VIVID / EXPERTISE</span>

            <span>
              {service.number} / {String(services.length).padStart(2, "0")}
            </span>
          </div>

          {/* =========================================================
      DESKTOP DETAIL COPY
      Stays exactly where it currently is on laptop/desktop.
  ========================================================= */}

          {renderDetailSlot("desktop")}

          {/* =========================================================
      PREVIOUS / NEXT CONTROLS
  ========================================================= */}

          <div className="vivid-services__controls">
            <button
              type="button"
              className="vivid-services__arrow"
              onClick={() => changeService(activeService - 1)}
              aria-label="Previous expertise"
            >
              <span aria-hidden="true">←</span>
            </button>

            <div className="vivid-services__progress-label">
              <span>{service.number}</span>
              <span>—</span>
              <span>{String(services.length).padStart(2, "0")}</span>
            </div>

            <button
              type="button"
              className="vivid-services__arrow"
              onClick={() => changeService(activeService + 1)}
              aria-label="Next expertise"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          HORIZONTAL EXPERTISE TRAIL
      ========================================================= */}

      <div className="vivid-services__trail-shell" data-reveal="up">
        <div className="vivid-services__trail-header">
          <span>EXPLORE ALL EXPERTISE</span>

          <span>
            {service.number} / {String(services.length).padStart(2, "0")}
          </span>
        </div>

        <div
          ref={trailRef}
          className="vivid-services__trail"
          data-lenis-prevent-wheel
          aria-label="Expertise navigation"
        >
          <div className="vivid-services__trail-track">
            {services.map((item, index) => (
              <button
                key={item.id}
                type="button"
                data-expertise-index={index}
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
      {/* =========================================================
          MOBILE DETAIL COPY
          
          This exists after the expertise trail only on mobile.
          It is hidden on laptop/desktop.
      ========================================================= */}

      {renderDetailSlot("mobile")}
    </section>
  );
}

export default Services;
