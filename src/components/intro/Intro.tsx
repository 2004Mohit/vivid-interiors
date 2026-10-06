import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Room3D from "./Room3D";
import "./intro.css";

gsap.registerPlugin(ScrollTrigger);

function Intro() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const eyebrow = eyebrowRef.current;
    const title = titleRef.current;
    const copy = copyRef.current;
    const imageFrame = imageFrameRef.current;
    const scene = sceneRef.current;
    const statement = statementRef.current;

    if (
      !section ||
      !eyebrow ||
      !title ||
      !copy ||
      !imageFrame ||
      !scene ||
      !statement
    ) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([eyebrow, title, copy, imageFrame, scene, statement], {
          clearProps: "all",
        });

        return;
      }

      gsap.set(eyebrow, { opacity: 0, y: 30 });
      gsap.set(title, { opacity: 0, y: 55 });
      gsap.set(copy, { opacity: 0, y: 40 });
      gsap.set(statement, { opacity: 0, y: 35 });
      gsap.set(imageFrame, { clipPath: "inset(12% 12% 12% 12%)" });
      gsap.set(scene, { scale: 1.16 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            once: true,
          },
          defaults: {
            ease: "power4.out",
          },
        })
        .to(eyebrow, { opacity: 1, y: 0, duration: 0.8 })
        .to(title, { opacity: 1, y: 0, duration: 1 }, "-=0.45")
        .to(copy, { opacity: 1, y: 0, duration: 0.9 }, "-=0.55")
        .to(
          imageFrame,
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4 },
          "-=0.8",
        )
        .to(scene, { scale: 1, duration: 1.8 }, "<")
        .to(statement, { opacity: 1, y: 0, duration: 1 }, "-=0.8");

      gsap.to(title, {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.utils
        .toArray<HTMLElement>(".vivid-intro__accent")
        .forEach((element) => {
          gsap.fromTo(
            element,
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: "left center",
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 85%",
                once: true,
              },
            },
          );
        });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="vivid-intro">
      <div className="vivid-intro__grid">
        <div className="vivid-intro__heading">
          <p ref={eyebrowRef} className="vivid-intro__eyebrow">
            <span>01</span>
            The Studio
          </p>

          <h2 ref={titleRef}>
            Vivid Interiors
            <br />
            <span>
              <b>R</b>&amp; The Studio Velvet
            </span>
          </h2>

          <div className="vivid-intro__accent" />
        </div>

        <div ref={copyRef} className="vivid-intro__copy">
          <p>
            Since two decades,{" "}
            <span className="vivid-word vivid-word--red">V</span>
            <span className="vivid-word vivid-word--pista">
              ivid Interiors
            </span>{" "}
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
        <div ref={imageFrameRef} className="vivid-intro__image-frame">
          <div ref={sceneRef} className="vivid-intro__scene">
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
        <p ref={statementRef} className="vivid-intro__statement">
          We are here to{" "}
          <span>
            <b>C</b>reate a Space Called Yours.
          </span>
        </p>
      </div>
      <div className="vivid-intro__stats">
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
