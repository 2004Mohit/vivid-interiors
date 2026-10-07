import { useRef } from "react";
import useReveal from "../../hooks/useReveal";
import Accent from "../ui/Accent";
import Room3D from "./Room3D";
import "./intro.css";

function Intro() {
  const sectionRef = useRef<HTMLElement>(null);

  // enter / exit animation for every [data-reveal] element in this section
  useReveal(sectionRef);

  return (
    <section ref={sectionRef} id="about" className="vivid-intro">
      <div className="vivid-intro__grid">
        <div className="vivid-intro__heading">
          <p className="vivid-intro__eyebrow" data-reveal="right">
            <span>01</span>
            The Studio
          </p>

          <h2 data-reveal="up" data-reveal-delay="0.1">
            Vivid Interiors
            <br />
            <Accent>&amp; The Studio Velvet</Accent>
          </h2>

          <div className="vivid-intro__accent" data-reveal="right" data-reveal-delay="0.3" />
        </div>

        <div className="vivid-intro__copy" data-reveal="stagger" data-reveal-delay="0.15">
          <p>
            Since two decades,{" "}
            <Accent>Vivid Interiors</Accent>{" "}
            &amp; The Studio Velvet has believed in creating original spaces.
          </p>

          <p>
            Versatility, unique ideas and customisable designs shape the way we
            approach every project. Every space is designed around the people
            who live, work and experience it.
          </p>

          <p>
            We believe interiors should not simply look beautiful. They should
            feel personal, purposeful and unmistakably yours.
          </p>
        </div>
      </div>

      <div className="vivid-intro__visual">
        <div className="vivid-intro__image-frame" data-reveal="mask" data-reveal-duration="1.4">
          <div className="vivid-intro__scene">
            <Room3D />
          </div>

          <div className="vivid-intro__image-overlay" />

          <p className="vivid-intro__image-hint">
            <span className="vivid-intro__image-hint-dot" />
            Drag to rotate · Tap the furniture
          </p>

          <p className="vivid-intro__image-label">
            YOUR ROOM, YOUR RULES
            <span>PLAY / REDECORATE</span>
          </p>
        </div>
      </div>

      <div className="vivid-intro__statement-wrap">
        <p className="vivid-intro__statement" data-reveal="up">
          We are here to <Accent>Create a Space Called Yours.</Accent>
        </p>
      </div>
      <div className="vivid-intro__stats" data-reveal="stagger">
        <div className="vivid-intro__stat">
          <span className="vivid-intro__stat-value">2016</span>
          <span className="vivid-intro__stat-label">Established</span>
        </div>

        <div className="vivid-intro__stat">
          <span className="vivid-intro__stat-value">15+</span>
          <span className="vivid-intro__stat-label">Years Experience</span>
        </div>

        <div className="vivid-intro__stat">
          <span className="vivid-intro__stat-value">500+</span>
          <span className="vivid-intro__stat-label">Projects Delivered</span>
        </div>

        <div className="vivid-intro__stat">
          <span className="vivid-intro__stat-value">1M+</span>
          <span className="vivid-intro__stat-label">Sq. Ft. Delivered</span>
        </div>

        <div className="vivid-intro__stat">
          <span className="vivid-intro__stat-value">30+</span>
          <span className="vivid-intro__stat-label">Cities Reached</span>
        </div>
      </div>
    </section>
  );
}

export default Intro;
