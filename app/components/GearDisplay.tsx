"use client";

import { CSSProperties, useEffect, useState } from "react";
import Image from "next/image";

// Cutouts are generated at one shared scale, so a file's pixel width divided by
// this is the object's real width in millimetres. Keep in sync with
// scripts/prepare-gear-cutouts.py.
const PX_PER_MM = 4.6;

const kit = [
  { id: "camera", category: "Camera", name: "Sony A7C", detail: "Silver · full-frame mirrorless", width: 899, height: 327 },
  { id: "sony", category: "Zoom lens", name: "Sony FE 28–60mm", detail: "The compact kit zoom", width: 306, height: 305 },
  { id: "viltrox", category: "Prime lens", name: "Viltrox 40mm ƒ/2.5", detail: "A small everyday prime", width: 294, height: 321 },
  { id: "phone", category: "Everyday camera", name: "iPhone 14 Pro Max", detail: "Silver · always within reach", width: 363, height: 739 },
  { id: "strap", category: "Wrist strap", name: "PGYTECH Wrist Strap Air", detail: "Oak Grey", width: 157, height: 943 },
];

const item = (id: string) => kit.find(entry => entry.id === id)!;
const position = (id: string) => kit.findIndex(entry => entry.id === id) + 1;

export default function GearDisplay() {
  const [hovered, setActive] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const active = hovered ?? selected;
  // Phones fold the kit behind a single row (CSS ignores this on wider
  // screens); a link to #gear unfolds it so the jump lands on something.
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const openFromHash = () => { if (window.location.hash === "#gear") setOpen(true); };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  // Every object is laid out from its true size, so the kit reads at the scale
  // it actually has: the body really is three lenses wide.
  const object = (id: string) => {
    const gear = item(id);
    return <button
      key={gear.id} type="button"
      className={`gear-object gear-object-${gear.id} ${active === gear.id ? "is-active" : ""}`}
      style={{ "--object-width": `calc(${(gear.width / PX_PER_MM).toFixed(1)} * var(--gear-mm))` } as CSSProperties}
      onMouseEnter={() => setActive(gear.id)} onMouseLeave={() => setActive(null)}
      onFocus={() => setActive(gear.id)} onBlur={() => setActive(null)}
      onClick={() => setSelected(selected === gear.id ? null : gear.id)}
      aria-label={`Highlight ${gear.name}`} aria-pressed={active === gear.id}
    >
      <Image src={`/gear/${gear.id}-cutout.png`} alt={gear.name} width={gear.width} height={gear.height} unoptimized />
      <span>0{position(gear.id)}</span>
    </button>;
  };

  return <div className={`gear-section gear-display ${open ? "gear-open" : ""}`} id="gear">
    <button type="button" className="gear-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
      <span><small>Camera gear · 5 items</small><strong>What I shoot with</strong></span>
      <span className="toggle-sign" aria-hidden="true" />
    </button>
    <div className="gear-list"><p className="eyebrow">Camera gear</p><h3>A small kit.<br /><em>Plenty to see.</em></h3>
      <div className="gear-items">{kit.map((gear, index) => <button key={gear.id} type="button" className={active === gear.id ? "is-active" : ""} onMouseEnter={() => setActive(gear.id)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(gear.id)} onBlur={() => setActive(null)} onClick={() => setSelected(selected === gear.id ? null : gear.id)} aria-pressed={active === gear.id}>
        <span className="gear-number">0{index + 1}</span><span><small>{gear.category}</small><strong>{gear.name}</strong><span className="gear-detail">{gear.detail}</span></span><i aria-hidden="true" />
      </button>)}</div>
    </div>
    <div className="gear-table" aria-label="Camera equipment product display"><div className="gear-table-label"><span>The everyday kit</span><span>01 — 05</span></div>
      <div className="gear-objects">
        <div className="gear-cluster">
          {object("camera")}
          <div className="gear-cluster-row">{object("sony")}{object("viltrox")}</div>
        </div>
        <div className="gear-cluster-row gear-cluster-tall">{object("phone")}{object("strap")}</div>
      </div>
      <p className="gear-table-note">Shown at true relative size <span>Hover or tap to explore</span></p>
    </div>
  </div>;
}
