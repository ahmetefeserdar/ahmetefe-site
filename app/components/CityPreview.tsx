"use client";

import { useEffect, useRef, useState } from "react";

const cities = [
  { name: "Zürich", country: "Switzerland", lat: 47.3769, lon: 8.5417, coordinates: "47.3769° N · 8.5417° E" },
  { name: "Istanbul", country: "Türkiye", lat: 41.0082, lon: 28.9784, coordinates: "41.0082° N · 28.9784° E" },
];

export default function CityPreview() {
  const [active, setActive] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const dismiss = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setActive(null); };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  return <div ref={root} className="availability city-preview" onPointerLeave={() => setActive(null)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setActive(null); }} onKeyDown={e => { if (e.key === "Escape") { setActive(null); e.stopPropagation(); } }}>
    <i aria-hidden="true" />
    {cities.map((city, index) => <span key={city.name}>{index > 0 && <span className="city-separator" aria-hidden="true">·</span>}<button type="button" aria-expanded={active === index} aria-controls="city-map-preview" onPointerEnter={e => { if (e.pointerType === "mouse") setActive(index); }} onFocus={() => setActive(index)} onClick={() => setActive(index)}>{city.name}</button></span>)}
    {active !== null && <div className="city-map-card" id="city-map-preview" role="region" aria-label={`${cities[active].name}, ${cities[active].country} map`}>
      <div className="city-map-heading"><span>Two places, one perspective</span><span aria-hidden="true">↗</span></div>
      <svg viewBox="0 0 342 270" role="img" aria-label={`Map of Europe highlighting ${cities[active].name} in ${cities[active].country}`}>
        <image href="/europe-map.svg" width="342" height="270" />
        <text x="66" y="86" className="map-region-label">EUROPE</text>
        <text x="114" y="242" className="map-sea-label">Mediterranean Sea</text>
        <path d="M135.3 131.6 Q195 102 257.9 188.9" className="map-route" />
        {cities.map((city, i) => { const x = (city.lon + 14) * 6, y = (62 - city.lat) * 9; return <g key={city.name} className={active === i ? "map-city selected" : "map-city"}><circle className="map-halo" cx={x} cy={y} r={12} /><circle cx={x} cy={y} r={3.5} /><text x={x} y={y - 18} textAnchor="middle">{city.name}</text></g>; })}
      </svg>
      <div className="city-map-footer"><strong>{cities[active].name}<small>{cities[active].country}</small></strong><span>{cities[active].coordinates}</span></div>
    </div>}
  </div>;
}
