"use client";

import Image from "next/image";
import { CSSProperties, useEffect, useMemo, useState } from "react";

type Photo = {
  id: number;
  src: string;
  fullSrc?: string;
  alt: string;
  width: number;
  height: number;
  aperture: string;
  shutter: string;
  iso: number;
  focalLength: string;
  captured: string;
  camera: string;
  location: string;
};

const photos: Photo[] = [
  { id: 1, src: "/photography/01.webp", alt: "An autumn valley unfolding beneath the Jungfrau massif", width: 1650, height: 2200, aperture: "ƒ/2.2", shutter: "1/110", iso: 40, focalLength: "14mm", captured: "19 Oct 2025", camera: "iPhone 14 Pro Max", location: "Jungfrau, Switzerland" },
  { id: 2, src: "/photography/02.webp", alt: "Golden larches scattered across an alpine slope", width: 1650, height: 2200, aperture: "ƒ/1.8", shutter: "1/480", iso: 80, focalLength: "24mm", captured: "19 Oct 2025", camera: "iPhone 14 Pro Max", location: "Jungfrau, Switzerland" },
  { id: 3, src: "/photography/03.webp", alt: "Mountain meadows and a village seen from above", width: 2200, height: 1650, aperture: "ƒ/1.8", shutter: "1/560", iso: 80, focalLength: "24mm", captured: "19 Oct 2025", camera: "iPhone 14 Pro Max", location: "Jungfrau, Switzerland" },
  { id: 4, src: "/photography/04.webp", alt: "A blue crevasse cutting through snow and ice", width: 1650, height: 2200, aperture: "ƒ/2.8", shutter: "1/3400", iso: 32, focalLength: "77mm", captured: "19 Oct 2025", camera: "iPhone 14 Pro Max", location: "Jungfrau, Switzerland" },
  { id: 5, src: "/photography/05.webp", alt: "A bird crossing the high alpine sky", width: 1650, height: 2200, aperture: "ƒ/2.8", shutter: "1/1200", iso: 32, focalLength: "77mm", captured: "19 Oct 2025", camera: "iPhone 14 Pro Max", location: "Jungfrau, Switzerland" },
  { id: 6, src: "/photography/06.webp", alt: "An alpine chough balanced on a cable", width: 1650, height: 2200, aperture: "ƒ/2.8", shutter: "1/1500", iso: 32, focalLength: "77mm", captured: "19 Oct 2025", camera: "iPhone 14 Pro Max", location: "Jungfrau, Switzerland" },
  { id: 7, src: "/photography/07.webp", alt: "A black bird resting above the snow line", width: 1650, height: 2200, aperture: "ƒ/2.8", shutter: "1/1250", iso: 32, focalLength: "77mm", captured: "19 Oct 2025", camera: "iPhone 14 Pro Max", location: "Jungfrau, Switzerland" },
  { id: 8, src: "/photography/08.webp", alt: "Glacial ice gathered between dark rock faces", width: 1650, height: 2200, aperture: "ƒ/2.8", shutter: "1/3400", iso: 32, focalLength: "77mm", captured: "19 Oct 2025", camera: "iPhone 14 Pro Max", location: "Jungfrau, Switzerland" },
  { id: 9, src: "/photography/09.webp", alt: "Wind-shaped snow climbing toward distant peaks", width: 1650, height: 2200, aperture: "ƒ/2.8", shutter: "1/3500", iso: 25, focalLength: "77mm", captured: "19 Oct 2025", camera: "iPhone 14 Pro Max", location: "Jungfrau, Switzerland" },
  { id: 10, src: "/photography/10.webp", alt: "A mountain hut set against a wall of ice", width: 1650, height: 2200, aperture: "ƒ/2.8", shutter: "1/1800", iso: 32, focalLength: "77mm", captured: "19 Oct 2025", camera: "iPhone 14 Pro Max", location: "Jungfrau, Switzerland" },
  { id: 11, src: "/photography/11.webp", alt: "A jagged summit beneath fast-moving cloud", width: 1704, height: 2200, aperture: "ƒ/2.2", shutter: "1/8400", iso: 40, focalLength: "14mm", captured: "19 Oct 2025", camera: "iPhone 14 Pro Max", location: "Jungfrau, Switzerland" },
  { id: 12, src: "/photography/12.webp", alt: "The Sphinx observatory isolated on a snowy ridge", width: 1650, height: 2200, aperture: "ƒ/2.8", shutter: "1/3000", iso: 32, focalLength: "77mm", captured: "19 Oct 2025", camera: "iPhone 14 Pro Max", location: "Jungfrau, Switzerland" },
  { id: 13, src: "/photography/13.webp", alt: "Grindelwald gathered below a steep rock face", width: 1650, height: 2200, aperture: "ƒ/2.8", shutter: "1/240", iso: 32, focalLength: "77mm", captured: "19 Oct 2025", camera: "iPhone 14 Pro Max", location: "Jungfrau, Switzerland" },
  { id: 14, src: "/photography/14.webp", alt: "Red geraniums catching late-afternoon light", width: 1650, height: 2200, aperture: "ƒ/1.8", shutter: "1/3700", iso: 64, focalLength: "24mm", captured: "20 Sep 2025", camera: "iPhone 14 Pro Max", location: "Stein am Rhein, Switzerland" },
  { id: 15, src: "/photography/15.webp", alt: "A yellow vintage Mercedes parked beside flowers", width: 1650, height: 2200, aperture: "ƒ/1.8", shutter: "1/2500", iso: 64, focalLength: "24mm", captured: "20 Sep 2025", camera: "iPhone 14 Pro Max", location: "Stein am Rhein, Switzerland" },
  { id: 16, src: "/photography/16.webp", alt: "A white facade framed by a dense green canopy", width: 1650, height: 2200, aperture: "ƒ/2.8", shutter: "1/100", iso: 80, focalLength: "77mm", captured: "22 May 2025", camera: "iPhone 14 Pro Max", location: "Zug, Switzerland" },
  { id: 17, src: "/photography/17.webp", alt: "Colorful old houses lining the edge of a lawn", width: 2200, height: 1650, aperture: "ƒ/2.8", shutter: "1/100", iso: 32, focalLength: "77mm", captured: "22 May 2025", camera: "iPhone 14 Pro Max", location: "Zug, Switzerland" },
  { id: 18, src: "/photography/18.webp", alt: "A pale blue sports car in profile", width: 2200, height: 2200, aperture: "ƒ/1.8", shutter: "1/1250", iso: 64, focalLength: "24mm", captured: "22 May 2025", camera: "iPhone 14 Pro Max", location: "Zug, Switzerland" },
  { id: 19, src: "/photography/19.webp", alt: "A purple allium aligned with an approaching bus", width: 1650, height: 2200, aperture: "ƒ/1.8", shutter: "1/125", iso: 64, focalLength: "24mm", captured: "22 May 2025", camera: "iPhone 14 Pro Max", location: "Zug, Switzerland" },
  { id: 20, src: "/photography/20.webp", alt: "A corner house slowly overtaken by green vines", width: 1650, height: 2200, aperture: "ƒ/2.8", shutter: "1/100", iso: 125, focalLength: "77mm", captured: "22 May 2025", camera: "iPhone 14 Pro Max", location: "Zug, Switzerland" },
  { id: 21, src: "/photography/21.webp", alt: "An SBB station sign seen through leaves", width: 1650, height: 2200, aperture: "ƒ/2.8", shutter: "1/100", iso: 80, focalLength: "77mm", captured: "22 May 2025", camera: "iPhone 14 Pro Max", location: "Zug, Switzerland" },
  { id: 22, src: "/photography/22.webp", alt: "Railway lettering layered behind green branches", width: 1650, height: 2200, aperture: "ƒ/2.8", shutter: "1/100", iso: 80, focalLength: "77mm", captured: "22 May 2025", camera: "iPhone 14 Pro Max", location: "Zug, Switzerland" },
  { id: 23, src: "/photography/23.webp", alt: "The Bosphorus suspension bridge crossing a blue sky", width: 2200, height: 2200, aperture: "ƒ/2.8", shutter: "1/900", iso: 32, focalLength: "77mm", captured: "05 Jun 2025", camera: "iPhone 14 Pro Max", location: "Istanbul, Türkiye" },
  { id: 24, src: "/photography/24.webp", alt: "Looking upward along a Bosphorus bridge tower", width: 1650, height: 2200, aperture: "ƒ/1.8", shutter: "1/3000", iso: 64, focalLength: "24mm", captured: "05 Jun 2025", camera: "iPhone 14 Pro Max", location: "Istanbul, Türkiye" },
  { id: 25, src: "/photography/25.webp", alt: "A weathered stone figure beneath a pale winter sky", width: 1467, height: 2200, aperture: "ƒ/10", shutter: "1/20", iso: 1600, focalLength: "60mm", captured: "02 Dec 2025", camera: "Sony A7C", location: "Winterthur, Switzerland" },
  { id: 26, src: "/photography/26.webp", alt: "A red train waiting beneath the station wires", width: 2200, height: 1467, aperture: "ƒ/10", shutter: "1/40", iso: 1600, focalLength: "60mm", captured: "02 Dec 2025", camera: "Sony A7C", location: "Winterthur, Switzerland" },
  { id: 27, src: "/photography/27.webp", alt: "A rounded corner facade illuminated at dusk", width: 1467, height: 2200, aperture: "ƒ/10", shutter: "1/25", iso: 1600, focalLength: "42mm", captured: "02 Dec 2025", camera: "Sony A7C", location: "Winterthur, Switzerland" },
  { id: 28, src: "/photography/28.webp", alt: "Red typography cutting across a modern facade", width: 2200, height: 1467, aperture: "ƒ/13", shutter: "1/13", iso: 640, focalLength: "60mm", captured: "02 Dec 2025", camera: "Sony A7C", location: "Winterthur, Switzerland" },
  { id: 29, src: "/photography/29.webp", alt: "A Santa figure above a Christmas-market stall", width: 1467, height: 2200, aperture: "ƒ/5.6", shutter: "1/60", iso: 800, focalLength: "60mm", captured: "02 Dec 2025", camera: "Sony A7C", location: "Winterthur, Switzerland" },
  { id: 30, src: "/photography/30.webp", alt: "A miniature sleigh surrounded by market lights", width: 1467, height: 2200, aperture: "ƒ/5.6", shutter: "1/60", iso: 2500, focalLength: "60mm", captured: "02 Dec 2025", camera: "Sony A7C", location: "Winterthur, Switzerland" },
  { id: 31, src: "/photography/31.webp", alt: "A glass ornament reflecting the Christmas market", width: 1467, height: 2200, aperture: "ƒ/5", shutter: "1/40", iso: 1600, focalLength: "35mm", captured: "02 Dec 2025", camera: "Sony A7C", location: "Winterthur, Switzerland" },
  { id: 32, src: "/photography/32.webp", alt: "Stained-glass lamps glowing above a market stall", width: 1467, height: 2200, aperture: "ƒ/6.3", shutter: "1/25", iso: 250, focalLength: "35mm", captured: "02 Dec 2025", camera: "Sony A7C", location: "Winterthur, Switzerland" },
  { id: 33, src: "/photography/33.webp", alt: "A painted carousel roof against the blue hour", width: 1467, height: 2200, aperture: "ƒ/7.1", shutter: "1/40", iso: 640, focalLength: "59mm", captured: "02 Dec 2025", camera: "Sony A7C", location: "Winterthur, Switzerland" },
  { id: 34, src: "/photography/34.webp", alt: "A wooden market roof crowned with a bright star", width: 1467, height: 2200, aperture: "ƒ/5", shutter: "1/40", iso: 320, focalLength: "36mm", captured: "02 Dec 2025", camera: "Sony A7C", location: "Winterthur, Switzerland" },
  { id: 35, src: "/photography/35.webp", alt: "A town clock threaded between hanging stars", width: 1479, height: 2200, aperture: "ƒ/5.6", shutter: "1/60", iso: 1600, focalLength: "60mm", captured: "02 Dec 2025", camera: "Sony A7C", location: "Winterthur, Switzerland" },
  { id: 36, src: "/photography/36.webp", alt: "A confectioner clock beneath a deep blue sky", width: 1481, height: 2200, aperture: "ƒ/5.6", shutter: "1/60", iso: 1600, focalLength: "60mm", captured: "02 Dec 2025", camera: "Sony A7C", location: "Winterthur, Switzerland" },
  { id: 37, src: "/photography/37.webp", alt: "A blue elephant decoration inside a narrow passage", width: 1467, height: 2200, aperture: "ƒ/5.6", shutter: "1/60", iso: 5000, focalLength: "60mm", captured: "02 Dec 2025", camera: "Sony A7C", location: "Winterthur, Switzerland" },
  { id: 38, src: "/photography/38.webp", alt: "Narrow facades leaning into a cobalt sky", width: 2200, height: 1467, aperture: "ƒ/4", shutter: "1/30", iso: 1250, focalLength: "28mm", captured: "02 Dec 2025", camera: "Sony A7C", location: "Winterthur, Switzerland" },
  { id: 39, src: "/photography/39.webp", alt: "Star-shaped lights dissolving into soft bokeh", width: 1467, height: 2200, aperture: "ƒ/5.6", shutter: "1/60", iso: 1600, focalLength: "60mm", captured: "02 Dec 2025", camera: "Sony A7C", location: "Winterthur, Switzerland" },
  { id: 40, src: "/photography/40.webp", alt: "A station clock and star against the winter sky", width: 1467, height: 2200, aperture: "ƒ/5.6", shutter: "1/60", iso: 4000, focalLength: "60mm", captured: "02 Dec 2025", camera: "Sony A7C", location: "Winterthur, Switzerland" },
  { id: 41, src: "/photography/41.webp", alt: "Zürich spread beneath a low silver sky", width: 2200, height: 1467, aperture: "ƒ/5.6", shutter: "1/80", iso: 100, focalLength: "60mm", captured: "04 Dec 2025", camera: "Sony A7C", location: "Zürich, Switzerland" },
  { id: 42, src: "/photography/42.webp", alt: "Church spires layered between autumn branches", width: 1467, height: 2200, aperture: "ƒ/5.6", shutter: "1/160", iso: 100, focalLength: "60mm", captured: "04 Dec 2025", camera: "Sony A7C", location: "Zürich, Switzerland" },
  { id: 43, src: "/photography/43.webp", alt: "A turquoise church spire above the rooftops", width: 1467, height: 2200, aperture: "ƒ/5.6", shutter: "1/200", iso: 100, focalLength: "60mm", captured: "04 Dec 2025", camera: "Sony A7C", location: "Zürich, Switzerland" },
  { id: 44, src: "/photography/44.webp", alt: "The Predigerkirche spire framed by bare trees", width: 1467, height: 2200, aperture: "ƒ/5.6", shutter: "1/60", iso: 125, focalLength: "60mm", captured: "04 Dec 2025", camera: "Sony A7C", location: "Zürich, Switzerland" },
  { id: 45, src: "/photography/45.webp", alt: "A minaret drawn sharply against a cloudless sky", width: 1650, height: 2200, aperture: "ƒ/2.8", shutter: "1/1000", iso: 32, focalLength: "77mm", captured: "28 May 2025", camera: "iPhone 14 Pro Max", location: "Çamlıca, Istanbul" },
  { id: 46, src: "/photography/46.webp", alt: "Blue and gold geometry inside the mosque dome", width: 2200, height: 2200, aperture: "ƒ/1.8", shutter: "1/530", iso: 80, focalLength: "24mm", captured: "28 May 2025", camera: "iPhone 14 Pro Max", location: "Çamlıca, Istanbul" },
  { id: 47, src: "/photography/47.webp", alt: "The mosque courtyard opening beneath scattered cloud", width: 2200, height: 2200, aperture: "ƒ/2.2", shutter: "1/1800", iso: 40, focalLength: "14mm", captured: "28 May 2025", camera: "iPhone 14 Pro Max", location: "Çamlıca, Istanbul" },
  { id: 48, src: "/photography/48.webp", alt: "Layered domes and stone lattice in afternoon light", width: 2200, height: 2200, aperture: "ƒ/1.8", shutter: "1/4200", iso: 64, focalLength: "24mm", captured: "28 May 2025", camera: "iPhone 14 Pro Max", location: "Çamlıca, Istanbul" },
  { id: 49, src: "/photography/49.webp", alt: "A centered view of the grand Çamlıca dome", width: 1650, height: 2200, aperture: "ƒ/2.8", shutter: "1/850", iso: 32, focalLength: "77mm", captured: "28 May 2025", camera: "iPhone 14 Pro Max", location: "Çamlıca, Istanbul" },
]
  .filter((photo) => photo.id !== 22)
  .map((photo, index) => ({
    ...photo,
    id: index + 1,
    src: photo.src.replace("/photography/", "/frames/"),
    fullSrc: `/frames/full/${String(photo.id).padStart(2, "0")}.jpg`,
  }));

const monthNumber = (date: string) => {
  const [year, month] = date.split("-").map(Number);
  return year * 12 + month - 1;
};

const timelineStart = monthNumber("2021-09");
const timelinePivot = monthNumber("2024-09");
const timelineEnd = monthNumber("2026-09");

// Earlier years are compressed to leave more room for the overlapping recent work.
const timelinePosition = (date: string) => {
  const month = monthNumber(date);

  if (month <= timelinePivot) {
    return ((month - timelineStart) / (timelinePivot - timelineStart)) * 42;
  }

  return 42 + ((month - timelinePivot) / (timelineEnd - timelinePivot)) * 58;
};

const journeyItems = [
  {
    id: "midas",
    period: "Jun 2026 — now",
    place: "Midas · Global Trade",
    title: "Software Engineer",
    detail: "Backend engineering for US and EU markets. Joined as an intern, moved into the Software Engineer title in September, and continues part-time alongside the M.Sc.",
    tags: ["Java", "Spring", "GraphQL", "Kafka", "Redis", "Kubernetes", "ArgoCD"],
    current: true,
    kind: "work",
    startDate: "2026-06",
    endDate: "2026-09",
    row: 3,
    short: "Midas",
  },
  {
    id: "masters",
    period: "2025 — now",
    place: "ETH Zürich",
    title: "M.Sc. Computer Science",
    detail: "Visual & Interactive Computing, with the center of gravity in computer graphics, computer vision, algorithms, and machine learning.",
    tags: ["Graphics", "Vision", "AI"],
    kind: "education",
    startDate: "2025-09",
    endDate: "2026-09",
    row: 1,
    short: "ETH M.Sc.",
  },
  {
    id: "tutoring",
    period: "Jan 2025 — Jun 2026",
    place: "Private tutoring · Zürich",
    title: "STEM Tutor",
    detail: "Tutored two Kanti students, mainly in mathematics, with physics, chemistry, and biology when needed.",
    tags: ["Mathematics", "Physics", "Chemistry", "Biology"],
    kind: "work",
    startDate: "2025-01",
    endDate: "2026-06",
    row: 1,
    short: "Tutoring",
  },
  {
    id: "outlier",
    period: "Dec 2024 — Jun 2026",
    place: "Outlier AI · Remote",
    title: "Mathematics Consultant",
    detail: "Developing and evaluating prompts around mathematical reasoning, accuracy, and model safety.",
    tags: ["AI evaluation", "Reasoning"],
    kind: "work",
    startDate: "2024-12",
    endDate: "2026-06",
    row: 2,
    short: "Outlier AI",
  },
  {
    id: "habee",
    period: "May — Jul 2025",
    place: "HABEE Solutions · Zug",
    title: "Software Engineering Intern",
    detail: "Maintained internal codebases and built automation that reduced manual workflow processing time by 40%.",
    tags: ["Automation", "Product engineering"],
    kind: "work",
    startDate: "2025-05",
    endDate: "2025-07",
    row: 0,
    short: "HABEE",
  },
  {
    id: "bachelors",
    period: "2021 — 2025",
    place: "ETH Zürich",
    title: "B.Sc. Computer Science",
    detail: "GPA 5.0/6.0. Bachelor thesis in the Computational Design Lab, graded 5.75/6.0.",
    tags: ["Computer science", "Computational design"],
    kind: "education",
    startDate: "2021-09",
    endDate: "2025-09",
    row: 0,
    short: "ETH B.Sc.",
  },
].map((item) => ({
  ...item,
  start: timelinePosition(item.startDate),
  end: timelinePosition(item.endDate),
}));

const timelineTicks = [
  { label: "Sep 2021", date: "2021-09" },
  { label: "Sep 2022", date: "2022-09" },
  { label: "Sep 2023", date: "2023-09" },
  { label: "Sep 2024", date: "2024-09" },
  { label: "Sep 2025", date: "2025-09" },
  { label: "Now", date: "2026-09" },
].map((tick) => ({ ...tick, position: timelinePosition(tick.date) }));

const bachelorStart = timelinePosition("2021-09");
const bachelorEnd = timelinePosition("2025-09");
const thesisStart = timelinePosition("2024-10");
const thesisEnd = timelinePosition("2025-05");
const thesisInsetStart = ((thesisStart - bachelorStart) / (bachelorEnd - bachelorStart)) * 100;
const thesisInsetWidth = ((thesisEnd - thesisStart) / (bachelorEnd - bachelorStart)) * 100;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

function ColorLab({
  hue,
  chroma,
  light,
  gamut,
  setHue,
  setChroma,
  setLight,
  setGamut,
}: {
  hue: number;
  chroma: number;
  light: number;
  gamut: "P3" | "sRGB";
  setHue: (value: number) => void;
  setChroma: (value: number) => void;
  setLight: (value: number) => void;
  setGamut: (value: "P3" | "sRGB") => void;
}) {
  return (
    <aside className="color-lab" aria-label="Interactive color laboratory">
      <div className="lab-head">
        <div>
          <p className="eyebrow">Grade this page</p>
          <p className="lab-status"><i /> Live color system</p>
        </div>
        <span className="live-swatch" aria-hidden="true" />
      </div>

      <div className="gamut-switch" aria-label="Site color character">
        {(["P3", "sRGB"] as const).map((item) => (
          <button
            key={item}
            type="button"
            className={gamut === item ? "active" : ""}
            onClick={() => setGamut(item)}
            aria-pressed={gamut === item}
          >
            {item === "P3" ? "Vivid / P3" : "Quiet / sRGB"}
          </button>
        ))}
      </div>

      <div className="lab-controls">
        <label>
          <span><b>Accent hue</b><em>{hue}°</em></span>
          <input aria-label="Accent hue" type="range" min="0" max="360" value={hue} onInput={(event) => setHue(Number(event.currentTarget.value))} />
        </label>
        <label>
          <span><b>Image chroma</b><em>{chroma}%</em></span>
          <input aria-label="Image chroma" type="range" min="0" max="100" value={chroma} onInput={(event) => setChroma(Number(event.currentTarget.value))} />
        </label>
        <label>
          <span><b>Exposure</b><em>{light > 58 ? "+" : ""}{((light - 58) / 10).toFixed(1)} EV</em></span>
          <input aria-label="Site exposure" type="range" min="42" max="72" value={light} onInput={(event) => setLight(Number(event.currentTarget.value))} />
        </label>
      </div>

      <p className="lab-readout">H {hue}° · C {chroma} · {light > 58 ? "+" : ""}{((light - 58) / 10).toFixed(1)} EV</p>
    </aside>
  );
}

function Lightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Photograph ${photo.id}`} onClick={onClose}>
      <button type="button" onClick={onClose} aria-label="Close photograph">Close ×</button>
      <div className="lightbox-frame" onClick={(event) => event.stopPropagation()}>
        <div className="lightbox-image" onContextMenu={(event) => event.preventDefault()}>
          <div className="lightbox-media" style={{ "--media-ratio": photo.width / photo.height } as CSSProperties}>
            <Image src={photo.fullSrc ?? photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="75vw" loading="eager" unoptimized draggable={false} />
            <span className="photo-watermark">© Ahmet Efe Serdar</span>
            <span className="image-shield" aria-hidden="true" />
          </div>
        </div>
        <div className="lightbox-caption">
          <p><span>Frame {String(photo.id).padStart(2, "0")} / {photos.length}</span>{photo.alt}</p>
          <dl>
            <div><dt>Place</dt><dd>{photo.location}</dd></div>
            <div><dt>Lens</dt><dd>{photo.focalLength}</dd></div>
            <div><dt>Aperture</dt><dd>{photo.aperture}</dd></div>
            <div><dt>Shutter</dt><dd>{photo.shutter}s</dd></div>
            <div><dt>ISO</dt><dd>{photo.iso}</dd></div>
            <div><dt>Camera</dt><dd>{photo.camera}</dd></div>
            <div><dt>Captured</dt><dd>{photo.captured}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [hue, setHue] = useState(12);
  const [chroma, setChroma] = useState(88);
  const [light, setLight] = useState(58);
  const [gamut, setGamut] = useState<"P3" | "sRGB">("P3");
  const [temperature, setTemperature] = useState<"warm" | "cool">("warm");
  const [gallery, setGallery] = useState<"editorial" | "contact-sheet">("editorial");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [activeJourney, setActiveJourney] = useState("midas");

  const theme = useMemo(() => {
    const paperLight = Math.round(88 + (light - 42) * 0.27);
    const imageSaturation = (0.25 + chroma / 100 * (gamut === "P3" ? 1.25 : 0.72)).toFixed(2);
    const imageBrightness = (0.84 + (light - 42) * 0.012).toFixed(2);
    const accentChroma = Math.round(Math.max(18, chroma * (gamut === "P3" ? 1 : 0.62)));
    return {
      "--live-hue": hue,
      "--live-chroma": `${Math.max(30, chroma)}%`,
      "--live-light": `${light}%`,
      "--accent": `hsl(${hue} ${accentChroma}% ${light}%)`,
      "--accent-soft": `hsl(${hue} ${Math.max(24, accentChroma - 24)}% ${Math.min(94, light + 27)}%)`,
      "--accent-dark": `hsl(${hue} ${Math.max(28, accentChroma - 10)}% ${Math.max(16, light - 34)}%)`,
      "--paper": `hsl(${temperature === "warm" ? 42 : 198} 24% ${paperLight}%)`,
      "--ink": `hsl(${temperature === "warm" ? 55 : 202} 14% ${Math.max(7, 18 - (light - 42) * 0.23)}%)`,
      "--photo-saturation": imageSaturation,
      "--photo-brightness": imageBrightness,
      "--photo-warmth": temperature === "warm" ? "sepia(.08)" : "hue-rotate(8deg)",
      "--gamut-force": gamut === "P3" ? "1" : ".76",
    } as CSSProperties;
  }, [hue, chroma, light, gamut, temperature]);

  return (
    <div className={`site-shell gamut-${gamut.toLowerCase()}`} style={theme}>
      <header className="topbar">
        <a className="wordmark" href="#profile" aria-label="Ahmet Efe Serdar, home">
          <Image className="wordmark-mark" src="/brand-mark-camera-illustrated.png" alt="" width={76} height={43} loading="eager" aria-hidden="true" />
          <span className="wordmark-name"><b>Ahmet Efe</b> <em>Serdar</em></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#profile">Profile</a>
          <a href="#journey">Journey</a>
          <a href="#thesis">Thesis</a>
          <div className="nav-group">
            <a href="#photography">Photography <span aria-hidden="true">+</span></a>
            <div className="nav-submenu">
              <a href="#gear">Gear</a>
              <a href="#portfolio">Portfolio</a>
            </div>
          </div>
          <a href="#contact">Contact</a>
        </nav>
        <a className="availability" href="mailto:aserdar@ethz.ch"><i /> Zürich · Istanbul</a>
      </header>

      <main>
        <section className="hero profile-hero" id="profile">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span>01 / Profile</span>
              <span>Computer graphics · vision · AI</span>
              <span>Zürich ↔ Istanbul</span>
            </div>
            <div className="identity-block">
              <p className="identity-label">Ahmet Efe</p>
              <h1><span>Ahmet Efe</span><em>Serdar.</em></h1>
              <div className="portrait-lockup">
                <div className="profile-portrait">
                  <Image
                    src="/profile.jpg"
                    alt="Portrait of Ahmet Efe Serdar beside an alpine lake"
                    width={3024}
                    height={4032}
                    sizes="(max-width: 700px) 58vw, 230px"
                    priority
                  />
                </div>
                <p className="identity-role">Computer scientist, software engineer,<br />and hobby photographer.</p>
              </div>
            </div>
            <div className="hero-bottom profile-statement">
              <p>
                I&apos;m pursuing an M.Sc. in Computer Science at ETH Zürich, specializing
                in Visual &amp; Interactive Computing. Computer graphics is my center of
                gravity, with computer vision and AI close beside it.
              </p>
              <p>
                At Midas, I build backend systems for Global Trade across US and EU
                markets. Photography keeps me attentive to light, color, timing, and
                everything a metric can miss.
              </p>
            </div>
          </div>

          <div className="profile-console">
            <ColorLab
              hue={hue}
              chroma={chroma}
              light={light}
              gamut={gamut}
              setHue={setHue}
              setChroma={setChroma}
              setLight={setLight}
              setGamut={setGamut}
            />
            <dl className="profile-facts">
              <div><dt>Name</dt><dd>Ahmet Efe Serdar</dd></div>
              <div><dt>Based</dt><dd>Zürich, Switzerland</dd></div>
              <div><dt>Second base</dt><dd>Istanbul, Türkiye</dd></div>
              <div><dt>Now</dt><dd>Software Engineer · Midas</dd></div>
              <div><dt>Studying</dt><dd>Computer Science M.Sc. · ETH Zürich</dd></div>
              <div><dt>Languages</dt><dd>Turkish · English · German</dd></div>
            </dl>
          </div>
        </section>

        <section className="ticker" aria-label="Areas of practice">
          <div>
            <span>Computer graphics</span><b>✳</b><span>Computer vision</span><b>✳</b>
            <span>AI</span><b>✳</b><span>Backend engineering</span><b>✳</b><span>Photography</span><b>✳</b>
          </div>
        </section>

        <section className="journey section-grid" id="journey">
          <div className="section-marker"><span>02</span><p>Journey</p></div>
          <div className="journey-main">
            <div className="journey-intro">
              <h2>Some chapters run<br /><em>at the same time.</em></h2>
              <p>Education lives above the axis. Work, consulting, and teaching run below it.</p>
            </div>
            <div className="timeline-board" aria-label="Education and work timeline from 2021 to now">
              <div className="timeline-years" aria-hidden="true">
                {timelineTicks.map((tick, index) => (
                  <span
                    key={tick.label}
                    className={index === 0 ? "tick-start" : index === timelineTicks.length - 1 ? "tick-end" : ""}
                    style={{ left: `${tick.position}%` }}
                  >
                    {tick.label}
                  </span>
                ))}
              </div>
              <div className="timeline-plot">
                <span className="lane-label education-label">Education</span>
                <span className="lane-label work-label">Work / practice</span>
                <div className="timeline-guides" aria-hidden="true">
                  {timelineTicks.map((tick) => <i key={tick.label} style={{ left: `${tick.position}%` }} />)}
                </div>
                <div className="timeline-axis" aria-hidden="true"><i /></div>
                {journeyItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`timeline-span ${item.id} ${item.kind} tone-${item.row} ${item.end >= 90 ? "align-end" : ""} ${activeJourney === item.id ? "active" : ""}`}
                    style={{ "--start": `${item.start}%`, "--width": `${item.end - item.start}%`, "--row": item.row } as CSSProperties}
                    onMouseEnter={() => setActiveJourney(item.id)}
                    onFocus={() => setActiveJourney(item.id)}
                    onClick={() => setActiveJourney(item.id)}
                    aria-pressed={activeJourney === item.id}
                  >
                    {item.id === "bachelors" && (
                      <i
                        className="thesis-inset"
                        style={{ "--inset-start": `${thesisInsetStart}%`, "--inset-width": `${thesisInsetWidth}%` } as CSSProperties}
                        aria-hidden="true"
                      >
                        <b>Thesis · Oct 2024–May 2025</b>
                      </i>
                    )}
                    <span>{item.short}</span><small>{item.period}</small>
                  </button>
                ))}
              </div>
            </div>
            <div className="journey-cards">
              {journeyItems.map((item) => (
                <article key={item.id} className={activeJourney === item.id ? "active" : ""} onMouseEnter={() => setActiveJourney(item.id)}>
                  <p><span>{item.period}</span>{item.place}</p>
                  <h3>{item.title}</h3>
                  <small>{item.detail}</small>
                  <ul>{item.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="thesis thesis-reflow" id="thesis">
          <div className="section-heading thesis-heading">
            <div className="section-marker light"><span>03</span><p>Bachelor thesis</p></div>
            <h2>Embroidery-aware<br /><em>segmentation.</em></h2>
            <p>Computational Design Lab, ETH Zürich · 2024–2025 · Grade 5.75/6.0</p>
          </div>

          <div className="thesis-feature thesis-feature-real">
            <div className="stitch-stage" aria-label="Bachelor thesis teaser built up through animated stitch rows">
              <Image className="stitch-image" src="/thesis/teaser.png" alt="A bird transformed from a flat image through superpixel segmentation into a direction-aware embroidered rendering" width={2798} height={840} sizes="94vw" loading="eager" />
            </div>
            <div className="stitch-labels" aria-hidden="true"><span>01 · Image</span><span>02 · Hierarchy</span><span>03 · Stitch field</span></div>
            <div className="thesis-copy thesis-copy-grid">
              <p className="thesis-lede">A computer-graphics pipeline that prepares images to become directional thread.</p>
              <div>
                <p>
                  Generic segmentation gives either disconnected color islands,
                  too many tiny regions, or a single object mask. Embroidery needs
                  coherent shapes, smooth boundaries, nested detail, gradients,
                  and a direction for every layer.
                </p>
              </div>
              <div>
                <p>
                  My pipeline starts with SLIC superpixels, then merges a
                  region-adjacency graph using perceptual CIELAB color, PCA color
                  variation, and Canny edge evidence. It exports hierarchical
                  polygons and direction hints for back-to-front stitching.
                </p>
                <a className="text-link" href="https://github.com/ahmetefeserdar/Embroidery" target="_blank" rel="noreferrer">
                  Explore the thesis on GitHub <Arrow diagonal />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="photography" id="photography">
          <div className="photography-head">
            <div className="section-marker"><span>04</span><p>Photography</p></div>
            <div>
              <h2>Light, place,<br /><em>and attention.</em></h2>
              <p>Forty-eight edited frames from the Alps, Zürich, Winterthur, Zug, Stein am Rhein, and Istanbul—made with the Sony A7C and the camera always in my pocket.</p>
            </div>
            <div className="photo-controls">
              <div className="temperature-toggle" aria-label="Color temperature">
                <button type="button" className={temperature === "warm" ? "active" : ""} onClick={() => setTemperature("warm")} aria-pressed={temperature === "warm"}>Warm / 5200K</button>
                <button type="button" className={temperature === "cool" ? "active" : ""} onClick={() => setTemperature("cool")} aria-pressed={temperature === "cool"}>Cool / 7000K</button>
              </div>
              <div className="view-toggle" aria-label="Gallery layout">
                <button type="button" className={gallery === "editorial" ? "active" : ""} onClick={() => setGallery("editorial")} aria-pressed={gallery === "editorial"}>Editorial</button>
                <button type="button" className={gallery === "contact-sheet" ? "active" : ""} onClick={() => setGallery("contact-sheet")} aria-pressed={gallery === "contact-sheet"}>Contact sheet</button>
              </div>
            </div>
          </div>

          <div className="gear-section" id="gear">
            <div>
              <p className="eyebrow">Camera gear</p>
              <h3>The kit.</h3>
            </div>
            <dl>
              <div><dt>Camera</dt><dd>Sony A7C</dd></div>
              <div><dt>Lenses</dt><dd>Sony 28–60mm kit · Viltrox 40mm ƒ/2.5</dd></div>
              <div><dt>Everyday camera</dt><dd>iPhone 14 Pro Max</dd></div>
              <div><dt>Wrist strap</dt><dd>PGYTECH Camera Wrist Strap Air · Oak Grey</dd></div>
            </dl>
          </div>

          <div className={`photo-grid ${gallery}`} id="portfolio">
            {photos.map((photo) => (
              <button className="photo-card" type="button" key={photo.id} onClick={() => setSelectedPhoto(photo)} onContextMenu={(event) => event.preventDefault()} aria-label={`Open frame ${photo.id}: ${photo.alt}`}>
                <span>{String(photo.id).padStart(2, "0")}</span>
                <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes={gallery === "contact-sheet" ? "(max-width: 700px) 50vw, 25vw" : "(max-width: 700px) 100vw, 40vw"} loading={photo.id === 1 ? "eager" : "lazy"} draggable={false} />
                <small className="photo-place">{photo.location} · {photo.captured}</small>
                <small className="photo-exif"><b>{photo.focalLength}</b><b>{photo.aperture}</b><b>{photo.shutter}s</b><b>ISO {photo.iso}</b></small>
                <small className="view-frame">View frame ↗</small>
              </button>
            ))}
          </div>

        </section>

        <section className="contact section-grid" id="contact">
          <div className="section-marker light"><span>05</span><p>Contact</p></div>
          <div className="contact-copy">
            <p>Have a problem worth looking at twice?</p>
            <a href="mailto:aserdar@ethz.ch">Let&apos;s talk.<Arrow diagonal /></a>
          </div>
          <div className="contact-meta">
            <a href="https://github.com/ahmetefeserdar" target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a>
            <a href="https://www.linkedin.com/in/ahmetefeserdar/" target="_blank" rel="noreferrer">LinkedIn <Arrow diagonal /></a>
            <span>Zürich · Switzerland<br />Istanbul · Türkiye</span>
          </div>
        </section>
      </main>

      <footer>
        <span>© 2026 Ahmet Efe Serdar</span>
        <span>Graphics, systems &amp; photography</span>
        <a href="#profile">Back to top ↑</a>
      </footer>

      {selectedPhoto && <Lightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
    </div>
  );
}
