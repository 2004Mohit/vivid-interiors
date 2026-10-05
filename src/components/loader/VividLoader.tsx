import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

interface VividLoaderProps {
  onComplete?: () => void;
}

function VividLoader({ onComplete }: VividLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const triangleRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const loader = loaderRef.current;
    const mark = markRef.current;
    const triangle = triangleRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const progress = progressRef.current;

    if (!loader || !mark || !triangle || !title || !subtitle || !progress) {
      return;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
        onComplete,
      });

      timeline
        .fromTo(
          mark,
          {
            opacity: 0,
            scale: 0.65,
            rotate: -8,
          },
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 1.1,
          },
        )
        .fromTo(
          triangle,
          {
            opacity: 0,
            scale: 0,
            y: -20,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.55,
            ease: "back.out(2)",
          },
          "-=0.5",
        )
        .fromTo(
          title,
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.2",
        )
        .fromTo(
          subtitle,
          {
            opacity: 0,
            y: 15,
            letterSpacing: "0.05em",
          },
          {
            opacity: 1,
            y: 0,
            letterSpacing: "0.3em",
            duration: 0.7,
          },
          "-=0.4",
        )
        .to(progress, {
          scaleX: 1,
          duration: 1.1,
          ease: "power2.inOut",
        })
        .to(
          mark,
          {
            scale: 0.78,
            opacity: 0,
            duration: 0.6,
          },
          "+=0.15",
        )
        .to(
          title,
          {
            y: -25,
            opacity: 0,
            duration: 0.5,
          },
          "<",
        )
        .to(
          subtitle,
          {
            y: -15,
            opacity: 0,
            duration: 0.4,
          },
          "<",
        )
        .to(loader, {
          clipPath: "inset(0 0 100% 0)",
          duration: 1.15,
          ease: "power4.inOut",
        });

      return () => {
        timeline.kill();
      };
    }, loaderRef);

    return () => context.revert();
  }, [onComplete]);

  return (
    <div ref={loaderRef} className="vivid-loader">
      <div className="vivid-loader__content">
        <div className="vivid-loader__mark" ref={markRef}>
          <div className="vivid-loader__v">V</div>
          <div className="vivid-loader__triangle" ref={triangleRef} />
        </div>

        <h1 ref={titleRef}>Vivid Interiors</h1>

        <p ref={subtitleRef}>The Studio Velvet</p>

        <div className="vivid-loader__progress">
          <div ref={progressRef} />
        </div>
      </div>
    </div>
  );
}

export default VividLoader;
