import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import useReveal from "../../hooks/useReveal";
import Accent from "../ui/Accent";
import { sectors } from "../../data/sectors";
import { createPortal } from "react-dom";
import "./sectors.css";

function Sectors() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeSector, setActiveSector] = useState(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"next" | "previous">(
    "next",
  );

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useReveal(sectionRef);

  const totalSectors = sectors.length;
  const sector = sectors[activeSector];

  const goToSector = (index: number) => {
    if (totalSectors === 0) return;
    setActiveSector((index + totalSectors) % totalSectors);
  };

  const nextSector = () => {
    setSlideDirection("next");
    goToSector(activeSector + 1);
  };
  const previousSector = () => {
    setSlideDirection("previous");
    goToSector(activeSector - 1);
  };

  useEffect(() => {
    if (!isImageViewerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsImageViewerOpen(false);
      }

      if (event.key === "ArrowRight") {
        setActiveSector((current) => (current + 1) % totalSectors);
      }

      if (event.key === "ArrowLeft") {
        setActiveSector(
          (current) => (current - 1 + totalSectors) % totalSectors,
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isImageViewerOpen, totalSectors]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    touchStartY.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) {
      return;
    }

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const endY = event.changedTouches[0]?.clientY ?? touchStartY.current;

    const deltaX = endX - touchStartX.current;
    const deltaY = endY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0) {
      nextSector();
    } else {
      previousSector();
    }
  };

  if (!sector) return null;

  return (
    <section ref={sectionRef} id="sectors" className="vivid-sectors">
      <div className="vivid-sectors__background" />

      <div className="vivid-sectors__header">
        <div className="vivid-sectors__eyebrow" data-reveal="right">
          <span>03</span>
          <p>Sectors</p>
        </div>

        <h2 data-reveal="up" data-reveal-delay="0.1">
          Spaces for
          <br />
          <Accent>every way of living.</Accent>
        </h2>

        <p
          className="vivid-sectors__intro"
          data-reveal="up"
          data-reveal-delay="0.2"
        >
          From personal homes to distinctive workplaces and memorable
          hospitality spaces, VIVID creates interiors shaped around purpose,
          personality and the people who experience them.
        </p>
      </div>

      <div
        className="vivid-sectors__experience"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          touchStartX.current = null;
          touchStartY.current = null;
        }}
        tabIndex={0}
        role="region"
        aria-label="Sector carousel"
        aria-roledescription="carousel"
        onKeyDown={(event) => {
          if (
            event.target instanceof HTMLElement &&
            event.target.closest("button")
          ) {
            return;
          }

          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            goToSector(activeSector + (event.key === "ArrowRight" ? 1 : -1));
          }
        }}
      >
        <div
          className="vivid-sectors__visual"
          data-reveal="mask"
          data-reveal-duration="1.3"
        >
          <div className="vivid-sectors__image-frame">
            <ul className="vivid-sectors__slider" aria-label="Sector images">
              {sectors.map((item, index) => {
                let position = "hidden";

                if (index === activeSector) {
                  position = "active";
                } else if (
                  index ===
                  (activeSector - 1 + totalSectors) % totalSectors
                ) {
                  position = "previous";
                } else if (index === (activeSector + 1) % totalSectors) {
                  position = "next";
                }

                return (
                  <li
                    key={item.id}
                    className={`vivid-sectors__slide vivid-sectors__slide--${position}`}
                    aria-hidden={position !== "active"}
                  >
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="vivid-sectors__image"
                      draggable={false}
                      decoding="async"
                    />
                  </li>
                );
              })}
            </ul>

            <div className="vivid-sectors__image-overlay" />

            {/* Sector information displayed over the active image */}
            <div className="vivid-sectors__image-content" aria-live="polite">
              <div className="vivid-sectors__image-counter">
                <span>{sector.number}</span>
                <span>/ {String(totalSectors).padStart(2, "0")}</span>
              </div>

              <h3 key={`title-${sector.id}`}>{sector.title}</h3>

              <p key={`description-${sector.id}`}>{sector.description}</p>

              {/* Full-screen image viewer control */}
              <button
                type="button"
                className="vivid-sectors__expand"
                onClick={() => setIsImageViewerOpen(true)}
                aria-label={`Open ${sector.title} image in full screen`}
                title="View image in full screen"
              >
                <Expand aria-hidden="true" />
                <span>View image</span>
              </button>
            </div>

            {/* Previous and next controls positioned on image edges */}
            <button
              key={`arrow-prev-${activeSector}`}
              type="button"
              className={`vivid-sectors__image-arrow vivid-sectors__image-arrow--previous vivid-sectors__image-arrow--slide-${slideDirection}`}
              onClick={previousSector}
              aria-label="Previous sector"
            >
              <ArrowLeft aria-hidden="true" />
            </button>

            <button
              key={`arrow-next-${activeSector}`}
              type="button"
              className={`vivid-sectors__image-arrow vivid-sectors__image-arrow--next vivid-sectors__image-arrow--slide-${slideDirection}`}
              onClick={nextSector}
              aria-label="Next sector"
            >
              <ArrowRight aria-hidden="true" />
            </button>

            {/* Existing VIVID branding */}
            <div className="vivid-sectors__image-meta">
              <span>
                <Accent>VIVID INTERIORS</Accent>
              </span>
              <span>{sector.title}</span>
            </div>
          </div>

          {/* Existing sector pagination */}
          <div
            className="vivid-sectors__pagination"
            aria-label="Choose a sector"
          >
            {sectors.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={
                  index === activeSector
                    ? "vivid-sectors__dot vivid-sectors__dot--active"
                    : "vivid-sectors__dot"
                }
                onClick={() => goToSector(index)}
                aria-label={`Go to ${item.title}`}
                aria-current={index === activeSector ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Full-screen image viewer */}
      {isImageViewerOpen &&
        createPortal(
          <div
            className="vivid-sectors__lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${sector.title} project image`}
            onClick={() => setIsImageViewerOpen(false)}
          >
            <button
              type="button"
              className="vivid-sectors__lightbox-close"
              onClick={() => setIsImageViewerOpen(false)}
              aria-label="Close image viewer"
              autoFocus
            >
              <X aria-hidden="true" />
            </button>

            <button
              type="button"
              className="vivid-sectors__lightbox-arrow vivid-sectors__lightbox-arrow--previous"
              onClick={(event) => {
                event.stopPropagation();
                previousSector();
              }}
              aria-label="Previous sector image"
            >
              <ArrowLeft aria-hidden="true" />
            </button>

            <figure
              className="vivid-sectors__lightbox-figure"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                key={sector.id}
                src={sector.image}
                alt={sector.imageAlt}
                className="vivid-sectors__lightbox-image"
              />

              <figcaption>
                <span>{sector.title}</span>
                <span>
                  {sector.number} / {String(totalSectors).padStart(2, "0")}
                </span>
              </figcaption>
            </figure>

            <button
              type="button"
              className="vivid-sectors__lightbox-arrow vivid-sectors__lightbox-arrow--next"
              onClick={(event) => {
                event.stopPropagation();
                nextSector();
              }}
              aria-label="Next sector image"
            >
              <ArrowRight aria-hidden="true" />
            </button>
          </div>,
          document.body,
        )}
    </section>
  );
}

export default Sectors;
