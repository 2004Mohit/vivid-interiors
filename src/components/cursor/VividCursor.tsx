import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";

function VividCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    if (!isFinePointer) {
      return;
    }

    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) {
      return;
    }

    // quickTo reuses a single tween per axis: no tween spam on every mousemove
    const cursorX = gsap.quickTo(cursor, "x", { duration: 0.08, ease: "power2.out" });
    const cursorY = gsap.quickTo(cursor, "y", { duration: 0.08, ease: "power2.out" });
    const followerX = gsap.quickTo(follower, "x", { duration: 0.5, ease: "power3.out" });
    const followerY = gsap.quickTo(follower, "y", { duration: 0.5, ease: "power3.out" });

    const moveCursor = (event: MouseEvent) => {
      cursorX(event.clientX);
      cursorY(event.clientY);
      followerX(event.clientX);
      followerY(event.clientY);
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <>
      <div ref={followerRef} className="vivid-cursor-follower" />
      <div ref={cursorRef} className="vivid-cursor">
        <span />
      </div>
    </>
  );
}

export default VividCursor;
