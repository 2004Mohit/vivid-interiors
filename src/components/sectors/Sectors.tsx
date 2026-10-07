import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useReveal from "../../hooks/useReveal";
import Accent from "../ui/Accent";
import { sectors } from "../../data/sectors";
import "./sectors.css";

function Sectors() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeSector, setActiveSector] = useState(0);

  // enter / exit animation for every [data-reveal] element in this section
  useReveal(sectionRef);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const sector = sectors[activeSector];

  // Keep each image mounted with a stable key. Changing its list position
  // animates its geometry, matching the original append/prepend carousel.
  const carouselSectors = sectors.map(
    (_, position) =>
      sectors[(activeSector - 1 + position + sectors.length) % sectors.length],
  );

  const totalSectors = sectors.length;

  const goToSector = (index: number) => {
    if (totalSectors === 0) return;
    const nextIndex = (index + totalSectors) % totalSectors;

    setActiveSector(nextIndex);
  };

  const nextSector = () => {
    goToSector(activeSector + 1);
  };

  const previousSector = () => {
    goToSector(activeSector - 1);
  };

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

    /*
     * Only treat the gesture as a sector swipe when
     * horizontal movement is clearly greater than vertical movement.
     */
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
          <span>04</span>
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
          VIVID&apos;s documented work spans residential, commercial, jewellery
          shops, studio apartments, sample flats, IT offices and hospitality.
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
              {carouselSectors.map((item) => {
                if (!item) return null;
                return (
                  <li
                    key={item.id}
                    className="vivid-sectors__slide"
                    aria-hidden={item.id !== sector.id}
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

            <div className="vivid-sectors__image-meta">
              <span>VIVID INTERIORS</span>

              <span>{sector.title}</span>
            </div>
          </div>
        </div>

        <div
          className="vivid-sectors__content"
          data-reveal="right"
          data-reveal-delay="0.15"
        >
          <div className="vivid-sectors__navigation">
            <button
              type="button"
              onClick={previousSector}
              aria-label="Previous sector"
            >
              <ArrowLeft aria-hidden="true" />
            </button>

            <button type="button" onClick={nextSector} aria-label="Next sector">
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
          <div className="vivid-sectors__counter">
            <span>{sector.number}</span>

            <span>/ {String(totalSectors).padStart(2, "0")}</span>
          </div>

          <h3 key={`title-${sector.id}`}>{sector.title}</h3>

          <p key={`description-${sector.id}`}>{sector.description}</p>
        </div>
      </div>
    </section>
  );
}

export default Sectors;
