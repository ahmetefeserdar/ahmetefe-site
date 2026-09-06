"use client";

import { useEffect, useRef, useState } from "react";

export default function ProfileField({ hue }: { hue: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueRef = useRef(hue);
  const [paused, setPaused] = useState(false);
  useEffect(() => { hueRef.current = hue; }, [hue]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !section || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, frame = 0, visible = true;
    let pointer = { x: -1000, y: -1000 };
    let ripples: { x: number; y: number; time: number }[] = [];
    let points: { x: number; y: number; dx: number; dy: number; vx: number; vy: number }[] = [];
    function draw(time: number) {
      frame = 0;
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      const animate = !paused && !reduced.matches;
      ripples = ripples.filter(r => time - r.time < 1600);
      for (const p of points) {
        let fx = 0, fy = 0;
        const distance = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        if (animate && distance < 180) {
          const force = (1 - distance / 180) * 30;
          fx += (p.x - pointer.x) / Math.max(distance, 1) * force;
          fy += (p.y - pointer.y) / Math.max(distance, 1) * force;
        }
        if (animate) for (const r of ripples) {
          const d = Math.hypot(p.x - r.x, p.y - r.y);
          const age = (time - r.time) / 1000;
          const force = Math.exp(-Math.pow((d - age * 330) / 48, 2)) * 35 * (1 - age / 1.6);
          fx += (p.x - r.x) / Math.max(d, 1) * force;
          fy += (p.y - r.y) / Math.max(d, 1) * force;
        }
        p.vx = (p.vx + (fx - p.dx) * .065) * .79;
        p.vy = (p.vy + (fy - p.dy) * .065) * .79;
        p.dx = animate ? p.dx + p.vx : 0;
        p.dy = animate ? p.dy + p.vy : 0;
        const lift = Math.min(1, Math.hypot(p.dx, p.dy) / 20);
        ctx.fillStyle = `hsla(${hueRef.current}, 62%, 43%, ${.17 + lift * .4})`;
        ctx.beginPath();
        ctx.arc(p.x + p.dx, p.y + p.dy, 1 + lift * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      if (animate && visible && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function start() { cancelAnimationFrame(frame); frame = requestAnimationFrame(draw); }
    function resize() {
      if (!canvas || !section || !ctx) return;
      width = section.clientWidth; height = section.clientHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width * dpr; canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      points = [];
      for (let y = 16; y < height; y += 28) for (let x = 16; x < width; x += 28)
        points.push({ x, y, dx: 0, dy: 0, vx: 0, vy: 0 });
      start();
    }
    function move(e: PointerEvent) {
      const rect = section!.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function leave() { pointer = { x: -1000, y: -1000 }; }
    function click(e: PointerEvent) {
      if ((e.target as HTMLElement).closest("a,button,input") || paused || reduced.matches) return;
      move(e); ripples.push({ ...pointer, time: performance.now() }); ripples = ripples.slice(-6);
    }
    const observer = new ResizeObserver(resize);
    observer.observe(section);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); else cancelAnimationFrame(frame); });
    intersection.observe(section);
    section.addEventListener("pointermove", move, { passive: true });
    section.addEventListener("pointerleave", leave);
    section.addEventListener("pointerdown", click, { passive: true });
    reduced.addEventListener("change", start);
    document.addEventListener("visibilitychange", start);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect();
      section.removeEventListener("pointermove", move); section.removeEventListener("pointerleave", leave);
      section.removeEventListener("pointerdown", click); reduced.removeEventListener("change", start);
      document.removeEventListener("visibilitychange", start);
    };
  }, [paused]);

  return <><canvas ref={canvasRef} className="profile-field" aria-hidden="true" /><div className="field-caption"><span>Move to bend · click to ripple</span><button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Resume motion ↗" : "Pause motion Ⅱ"}</button></div></>;
}
