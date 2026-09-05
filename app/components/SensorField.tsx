"use client";

import { useEffect, useRef } from "react";

export default function SensorField() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = fieldRef.current?.parentElement;
    const hover = hoverRef.current;
    const pulse = pulseRef.current;
    if (!section || !hover || !pulse) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let x = 0, y = 0;
    let animation: Animation | undefined;
    function position(event: PointerEvent) {
      const bounds = section!.getBoundingClientRect();
      x = event.clientX - bounds.left;
      y = event.clientY - bounds.top;
    }
    function move(event: PointerEvent) {
      position(event);
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        hover!.style.transform = `translate3d(${x - 185}px, ${y - 185}px, 0)`;
        hover!.style.backgroundPosition = `${193 - x}px ${193 - y}px`;
        hover!.style.opacity = "1";
      });
    }
    function leave() {
      cancelAnimationFrame(frame); frame = 0;
      hover!.style.opacity = "0";
    }
    function click(event: PointerEvent) {
      if ((event.target as Element).closest("a,button,input,summary") || reduced.matches) return;
      position(event);
      animation?.cancel();
      pulse!.style.left = `${x - 160}px`;
      pulse!.style.top = `${y - 160}px`;
      // Animate only a bounded composited layer, never repaint the whole sensor grid.
      animation = pulse!.animate([
        { transform: "scale(.08)", opacity: .85 },
        { transform: "scale(.9)", opacity: .55, offset: .45 },
        { transform: "scale(2)", opacity: 0 },
      ], { duration: 1100, easing: "cubic-bezier(.16,.6,.35,1)" });
    }
    function stop() { leave(); animation?.cancel(); }
    section.addEventListener("pointermove", move, { passive: true });
    section.addEventListener("pointerleave", leave);
    section.addEventListener("pointerdown", click, { passive: true });
    document.addEventListener("visibilitychange", stop);
    reduced.addEventListener("change", stop);
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) stop(); });
    observer.observe(section);
    return () => {
      stop(); observer.disconnect();
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", leave);
      section.removeEventListener("pointerdown", click);
      document.removeEventListener("visibilitychange", stop);
      reduced.removeEventListener("change", stop);
    };
  }, []);
  return <div ref={fieldRef} className="sensor-surface" aria-hidden="true"><div className="sensor-static" /><div ref={hoverRef} className="sensor-hover" /><div ref={pulseRef} className="sensor-pulse" /></div>;
}
