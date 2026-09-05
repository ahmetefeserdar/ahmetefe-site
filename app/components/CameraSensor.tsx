"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const exposures = [
  { src: "/frames/41.webp", caption: "Zürich, through my lens", alt: "Zürich rooftops beneath a silver sky" },
  { src: "/frames/23.webp", caption: "Along the Bosphorus", alt: "A suspension bridge over the Bosphorus in Istanbul" },
  { src: "/frames/01.webp", caption: "A little higher up · Jungfrau", alt: "An autumn valley beneath the Jungfrau massif" },
];

export default function CameraSensor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lensRef = useRef<HTMLButtonElement>(null);
  const sensorRef = useRef<HTMLDivElement>(null);
  const trigger = useRef<() => void>(() => {});
  const [shot, setShot] = useState(0);
  const [paused, setPaused] = useState(false);
  const photo = exposures[(Math.max(shot, 1) - 1) % exposures.length];

  useEffect(() => {
    const canvas = canvasRef.current, section = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !section || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, frame = 0, until = 0, visible = true;
    let pointer = { x: -1000, y: -1000 }, origin = { x: 0, y: 0 }, lens = { x: 0, y: 0 };
    let shotAt = -10000;
    let sensor = { x: 0, y: 0 };
    function draw(time: number) {
      frame = 0;
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const motion = !paused && !reduced.matches;
      const age = time - shotAt;
      for (let y = 8, row = 0; y < height; y += 18, row++) {
        for (let x = 8, col = 0; x < width; x += 18, col++) {
          const d = Math.hypot(x - pointer.x, y - pointer.y);
          const glow = motion ? Math.max(0, 1 - d / 160) : 0;
          const hue = row % 2 === 0 ? (col % 2 === 0 ? 12 : 145) : (col % 2 === 0 ? 145 : 215);
          ctx.fillStyle = `hsla(${hue}, 48%, 48%, ${.045 + glow * .24})`;
          ctx.fillRect(x, y, 13, 13);
          if (glow > .3) { ctx.fillStyle = `hsla(${hue},65%,65%,${glow*.32})`; ctx.fillRect(x+3,y+3,7,7); }
        }
      }
      if (motion && age >= 0 && age < 3600) {
        const fade = Math.min(1, (3600 - age) / 900);
        const incoming = Math.min(1, age / 550);
        const outgoing = Math.max(0, Math.min(1, (age - 450) / 650));
        ctx.save();
        ctx.lineCap = "round";
        for (let i = -2; i <= 2; i++) {
          const color = ["255,103,67", "244,153,43", "235,171,55", "65,168,157", "79,143,226"][i+2];
          const entry = { x: lens.x, y: lens.y + i * 27 };
          const start = { x: Math.max(12, lens.x - 180), y: entry.y + (origin.y - lens.y) * .08 };
          ctx.strokeStyle = `rgba(${color},${fade*.95})`;
          ctx.shadowColor = `rgba(${color},${fade*.8})`;
          ctx.shadowBlur = 12;
          ctx.lineWidth = 2.6;
          ctx.beginPath(); ctx.moveTo(start.x,start.y);
          ctx.lineTo(start.x+(entry.x-start.x)*incoming,start.y+(entry.y-start.y)*incoming);
          if (outgoing > 0) { ctx.lineTo(entry.x+(sensor.x-entry.x)*outgoing,entry.y+(sensor.y-entry.y)*outgoing); }
          ctx.stroke();
        }
        if (outgoing > .85) {
          ctx.shadowColor = "#ffc671"; ctx.shadowBlur = 24;
          ctx.fillStyle = `rgba(255,210,123,${fade})`;
          ctx.beginPath(); ctx.arc(sensor.x,sensor.y,5,0,Math.PI*2); ctx.fill();
        }
        ctx.restore();
      }
      if (motion && visible && !document.hidden && time < until) frame = requestAnimationFrame(draw);
    }
    function wake(duration = 80) { until = Math.max(until, performance.now()+duration); if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw); }
    function measure() {
      if (!canvas || !ctx || !section) return;
      width = section.clientWidth; height = section.clientHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width*dpr; canvas.height = height*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
      const bounds = section.getBoundingClientRect(), glass = lensRef.current?.getBoundingClientRect();
      lens = glass ? { x: glass.x-bounds.x+glass.width/2, y: glass.y-bounds.y+glass.height/2 } : { x:width*.75,y:height*.4 };
      const sensorBounds = sensorRef.current?.getBoundingClientRect();
      if (sensorBounds) sensor = { x: sensorBounds.x - bounds.x + sensorBounds.width/2, y: sensorBounds.y - bounds.y + sensorBounds.height/2 };
      wake();
    }
    function move(event: PointerEvent) { const rect = section!.getBoundingClientRect(); pointer = {x:event.clientX-rect.x,y:event.clientY-rect.y}; wake(); }
    function capture() {
      origin = pointer.x < 0 ? {x:width*.3,y:height*.35} : {...pointer};
      shotAt = performance.now(); setShot(value => value + 1); wake(3700);
    }
    function click(event: PointerEvent) { if ((event.target as Element).closest("a,button,input,summary")) return; move(event); capture(); }
    function leave() { pointer = {x:-1000,y:-1000}; wake(); }
    trigger.current = capture;
    const resize = new ResizeObserver(measure); resize.observe(section);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) measure(); else {cancelAnimationFrame(frame);frame=0;} }); intersection.observe(section);
    section.addEventListener("pointermove",move,{passive:true}); section.addEventListener("pointerleave",leave); section.addEventListener("click",click);
    reduced.addEventListener("change",measure); document.addEventListener("visibilitychange",measure);
    return () => {cancelAnimationFrame(frame);resize.disconnect();intersection.disconnect();section.removeEventListener("pointermove",move);section.removeEventListener("pointerleave",leave);section.removeEventListener("click",click);reduced.removeEventListener("change",measure);document.removeEventListener("visibilitychange",measure);trigger.current=()=>{};};
  }, [paused]);

  return <>
    <canvas ref={canvasRef} className="sensor-field" aria-hidden="true" />
    <div className="camera-study">
      <div className="camera-study-heading"><span>Light → color → image</span><span>Interactive study / 01</span></div>
      <div className={`optical-stage ${shot > 0 ? "has-exposure" : ""}`}>
        <div className="optics-axis" aria-hidden="true" />
        <button ref={lensRef} className="glass-lens" type="button" aria-label="Capture a photograph" onClick={() => trigger.current()}><span aria-hidden="true" /></button>
        <div ref={sensorRef} className="sensor-plane" aria-hidden="true"><span /></div>
        <div className="exposure-print" key={shot} data-exposed={shot > 0} data-paused={paused}>
          {shot > 0 ? <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 700px) 140px, 190px" /> : <div className="exposure-empty"><span>01—03</span><p>A moment,<br />waiting for light.</p><span>YOUR NEXT FRAME ↗</span></div>}
        </div>
      </div>
      <div className="camera-caption"><p aria-live="polite">{shot > 0 ? photo.caption : "Move across the sensor. Click to make a frame."}</p><span>{String(shot ? (shot-1)%3+1 : 0).padStart(2,"0")} / 03</span></div>
      <div className="camera-actions"><button type="button" onClick={() => trigger.current()}>Release shutter <span aria-hidden="true">↗</span></button><button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "Resume motion" : "Pause motion"}</button></div>
    </div>
  </>;
}
