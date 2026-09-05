"use client";

import Image from "next/image";
import { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";

import frameLoader from "../frame-loader";
import SensorField from "./SensorField";
import CityPreview from "./CityPreview";
import MergeEnergy from "./MergeEnergy";
import GearDisplay from "./GearDisplay";

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
    fullSrc: `/frames/view/${String(photo.id).padStart(2, "0")}.webp`,
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
    detail: "I build backend systems for Global Trade at Midas, supporting US and EU markets with Java, Spring, and GraphQL. The stack spans event-driven messaging with Kafka, Redis, and Kubernetes deployments through ArgoCD. I joined as an intern and moved into a Software Engineer role in September, continuing part-time alongside my M.Sc.",
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
    detail: "My focus is Visual & Interactive Computing: how images are formed, how visual information is interpreted, and how shapes and motion can be represented computationally. Coursework spans computer graphics and vision, shape modeling and geometry processing, computational models of motion, and computational intelligence. Big Data adds a complementary perspective on processing information at scale.",
    tags: ["Computer graphics", "Computer vision", "Geometry processing", "Motion modeling", "Computational intelligence", "Big data"],
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
    detail: "I tutored two Kantonsschule students, primarily in mathematics, with additional support in physics, chemistry, and biology. Sessions centered on breaking down difficult concepts and working through problems step by step, adapting the explanation to each student and connecting abstract ideas to concrete examples.",
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
    detail: "I developed and evaluated prompts for AI chatbots, focusing on mathematical reasoning, accuracy, and model safety. The work involved assessing how models approached mathematical problems and collaborating with cross-functional teams to improve the quality of their reasoning and responses.",
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
    detail: "I maintained and improved internal software at HABEE Solutions and built tools to automate repetitive workflows. The internship combined work in existing codebases with practical automation, turning manual processing steps into software-supported workflows and reducing the time spent on routine tasks.",
    tags: ["Workflow automation", "Software maintenance", "Product engineering"],
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
    detail: "A broad foundation in computer science, from algorithms, probability, and numerical methods to systems programming, computer architecture, networks, and databases. I explored compiler design and rigorous software engineering alongside machine learning, visual computing, human–computer interaction, and information retrieval. Work in web engineering and FPGA design connected these ideas to software and hardware; my thesis brought the visual side together in a computational embroidery pipeline.",
    tags: ["Algorithms", "Systems programming", "Databases", "Compiler design", "Machine learning", "Visual computing", "HCI", "FPGA design"],
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

function OrganizationLogo({ id }: { id: string }) {
  const organization = id === "masters" || id === "bachelors" ? "eth" : id;
  if (organization === "tutoring") return <span className="organization-logo tutoring-mark" aria-hidden="true">∑</span>;
  if (organization === "outlier" || organization === "habee") return <span className={`organization-logo organization-wordmark organization-${organization}`}><Image src={`/organizations/${organization}-wordmark.svg`} alt="" width={organization === "habee" ? 180 : 160} height={80} unoptimized /></span>;
  const extension = organization === "eth" || organization === "outlier" ? "svg" : "png";
  return <span className={`organization-logo organization-${organization}`}><Image src={`/organizations/${organization}.${extension}`} alt="" width={organization === "eth" ? 120 : 40} height={organization === "eth" ? 20 : 40} unoptimized /></span>;
}

// WCAG relative luminance of an hsl() colour, so the palette can be checked
// against the paper before it reaches the page.
function hslLuminance(hue: number, saturation: number, lightness: number) {
  const chroma = (saturation / 100) * Math.min(lightness / 100, 1 - lightness / 100);
  const channel = (offset: number) => {
    const k = (offset + hue / 30) % 12;
    const value = lightness / 100 - chroma * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(8) + 0.0722 * channel(4);
}

// The lightest — so the most vivid — lightness that still clears `target`
// against the paper. Amber and Forest at full brightness reach barely 1.5:1
// unaided, which is why the accent is graded rather than used raw for text.
function readableLightness(hue: number, saturation: number, paperLuminance: number, target: number) {
  let low = 0;
  let high = 100;
  for (let step = 0; step < 18; step += 1) {
    const mid = (low + high) / 2;
    if ((paperLuminance + 0.05) / (hslLuminance(hue, saturation, mid) + 0.05) >= target) low = mid;
    else high = mid;
  }
  return Math.floor(low);
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

function ColorLab({
  hue,
  chroma,
  light,
  setHue,
  setChroma,
  setLight,
  setGamut,
}: {
  hue: number;
  chroma: number;
  light: number;
  setHue: (value: number) => void;
  setChroma: (value: number) => void;
  setLight: (value: number) => void;
  setGamut: (value: "P3" | "sRGB") => void;
}) {
  const [mode, setMode] = useState<"Simple" | "P3" | "sRGB">("Simple");
  const palettes = [
    { name: "Terracotta", hue: 12, chroma: 88 },
    { name: "Amber", hue: 36, chroma: 78 },
    { name: "Forest", hue: 150, chroma: 48 },
    { name: "Ocean", hue: 202, chroma: 72 },
    { name: "Violet", hue: 265, chroma: 58 },
    { name: "Rose", hue: 338, chroma: 64 },
  ];
  return (
    <details className="color-lab" open aria-label="Interactive color laboratory">
      <summary className="lab-head">
        <div>
          <p className="eyebrow">Grade this page</p>
          <p className="lab-status"><i /> Make it feel like you</p>
        </div>
        <span className="live-swatch" aria-hidden="true" />
      </summary>

      <div className="gamut-switch color-mode-switch" aria-label="Site color character">
        {(["Simple", "P3", "sRGB"] as const).map((item) => (
          <button
            key={item}
            type="button"
            className={mode === item ? "active" : ""}
            onClick={() => { setMode(item); setGamut(item === "Simple" ? "P3" : item); }}
            aria-pressed={mode === item}
          >
            {item === "Simple" ? "Simple" : item === "P3" ? "Vivid / P3" : "Quiet / sRGB"}
          </button>
        ))}
      </div>

      {mode === "Simple" ? <div className="simple-color-controls">
        <p>Pick an accent</p>
        <div className="palette-options" role="group" aria-label="Accent palette">{palettes.map(palette => <button key={palette.name} type="button" aria-pressed={hue === palette.hue && chroma === palette.chroma} onClick={() => { setHue(palette.hue); setChroma(palette.chroma); }}><span style={{ background: `hsl(${palette.hue} ${palette.chroma}% 58%)` }} aria-hidden="true" /><span>{palette.name}</span></button>)}</div>
        <label className="simple-brightness"><span>Page brightness</span><input aria-label="Page brightness" type="range" min="42" max="72" value={light} onChange={event => setLight(Number(event.target.value))} /><span aria-hidden="true">☀</span></label>
        <button className="reset-palette" type="button" onClick={() => { setHue(12); setChroma(88); setLight(58); }}>Reset to original ↺</button>
      </div> : <div className="lab-controls">
        <label>
          <span><b>Accent hue</b><em>{hue}°</em></span>
          <input aria-label="Accent hue" type="range" min="0" max="360" value={hue} onInput={(event) => setHue(Number(event.currentTarget.value))} />
        </label>
        <label>
          <span><b>Accent chroma</b><em>{chroma}%</em></span>
          <input aria-label="Accent chroma" type="range" min="0" max="100" value={chroma} onInput={(event) => setChroma(Number(event.currentTarget.value))} />
        </label>
        <label>
          <span><b>Exposure</b><em>{light > 58 ? "+" : ""}{((light - 58) / 10).toFixed(1)} EV</em></span>
          <input aria-label="Site exposure" type="range" min="42" max="72" value={light} onInput={(event) => setLight(Number(event.currentTarget.value))} />
        </label>
      </div>}

      <p className="lab-readout">{mode === "Simple" ? "Your palette, across the page. Photos stay original." : <>H {hue}° · C {chroma} · {light > 58 ? "+" : ""}{((light - 58) / 10).toFixed(1)} EV</>}</p>
    </details>
  );
}

function Lightbox({ photo, neighbours, onClose, onNavigate, position, total }: { photo: Photo; neighbours: string[]; onClose: () => void; onNavigate: (direction: number) => void; position: number; total: number }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{x:number;y:number} | null>(null);
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    closeRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") { event.preventDefault(); onNavigate(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); onNavigate(-1); }
      if (event.key === "Tab") {
        const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
        const index = controls.indexOf(document.activeElement as HTMLButtonElement);
        event.preventDefault();
        controls[(index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length]?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose, onNavigate]);

  return (
    <div ref={dialogRef} className="lightbox" role="dialog" aria-modal="true" aria-label={`Photograph ${position} of ${total}`} onClick={onClose}>
      <button ref={closeRef} type="button" onClick={onClose} aria-label="Close photograph">Close ×</button>
      <div className="lightbox-frame" onClick={(event) => event.stopPropagation()}>
        <div className="lightbox-image" onTouchStart={event => { touchStart.current = {x:event.touches[0].clientX,y:event.touches[0].clientY}; }} onTouchEnd={event => { const start=touchStart.current; touchStart.current=null; if (!start) return; const dx=event.changedTouches[0].clientX-start.x,dy=event.changedTouches[0].clientY-start.y; if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.5) onNavigate(dx<0?1:-1); }} onContextMenu={(event) => event.preventDefault()}>
          <div className="lightbox-media" style={{ "--media-ratio": photo.width / photo.height } as CSSProperties}>
            <Image src={photo.fullSrc ?? photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="75vw" loading="eager" unoptimized draggable={false} />
            {neighbours.map(neighbour => <link key={neighbour} rel="preload" as="image" href={neighbour} />)}
            <span className="photo-watermark">© Ahmet Efe Serdar</span>
            <span className="image-shield" aria-hidden="true" />
          </div>
        </div>
        <div className="lightbox-caption">
          <div className="lightbox-navigation"><button type="button" onClick={()=>onNavigate(-1)} aria-label="Previous photograph">←</button><span aria-live="polite">{position} / {total}</span><button type="button" onClick={()=>onNavigate(1)} aria-label="Next photograph">→</button></div>
          <p><span>Frame {String(photo.id).padStart(2, "0")}</span>{photo.alt}</p>
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
  // The blocking script in the layout stamps data-theme before the first paint,
  // so the button reads the document instead of holding its own copy of the
  // theme: no wrong icon on the first frame, and nothing to re-sync on hydration.
  const toggleTheme = () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("portfolio-theme", next); } catch {}
  };
  const [hue, setHue] = useState(12);
  const [chroma, setChroma] = useState(88);
  const [light, setLight] = useState(58);
  const [gamut, setGamut] = useState<"P3" | "sRGB">("P3");
  const [temperature, setTemperature] = useState<"warm" | "cool">("warm");
  const [gallery, setGallery] = useState<"editorial" | "contact-sheet">("editorial");
  const [photoCollection, setPhotoCollection] = useState("All frames");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [activeJourney, setActiveJourney] = useState("midas");
  const [activeSection, setActiveSection] = useState("profile");
  const [activeSub, setActiveSub] = useState("portfolio");
  const navRef = useRef<HTMLElement>(null);
  const [marker, setMarker] = useState<{ left: number; top: number; width: number } | null>(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const closeLightbox = useCallback(() => setSelectedPhoto(null), []);
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section[id]"));
    const subsections = Array.from(document.querySelectorAll<HTMLElement>("#portfolio, #gear"));
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const offset = (document.querySelector(".topbar")?.getBoundingClientRect().height ?? 72) + 70;
        const passed = (element: HTMLElement) => element.getBoundingClientRect().top <= offset;
        // The final section never reaches the detection line, so the end of the
        // page counts as arriving at it.
        const grounded = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        setActiveSection((grounded ? sections.at(-1) : sections.filter(passed).at(-1))?.id ?? "profile");
        setActiveSub(subsections.filter(passed).at(-1)?.id ?? "portfolio");
      });
    };
    update(); window.addEventListener("scroll", update, {passive:true});
    return () => { window.removeEventListener("scroll", update); cancelAnimationFrame(frame); };
  }, []);

  // One indicator slides between the primary links rather than five separate
  // dots blinking on and off, so the header reads as a single moving mark.
  useEffect(() => {
    const nav = navRef.current;
    const current = nav?.querySelector<HTMLElement>("[data-primary][aria-current]");
    if (!nav || !current) { setMarker(null); return; }
    const measure = () => {
      const link = current.getBoundingClientRect();
      const frame = nav.getBoundingClientRect();
      setMarker({ left: link.left - frame.left, top: link.bottom - frame.top, width: link.width });
    };
    measure();
    window.addEventListener("resize", measure);
    const fonts = document.fonts;
    fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [activeSection]);

  const theme = useMemo(() => {
    const paperLight = Math.round(88 + (light - 42) * 0.27);
    const imageSaturation = (0.25 + chroma / 100 * (gamut === "P3" ? 1.25 : 0.72)).toFixed(2);
    const imageBrightness = (0.84 + (light - 42) * 0.012).toFixed(2);
    const accentChroma = Math.round(Math.max(18, chroma * (gamut === "P3" ? 1 : 0.62)));
    const warm = temperature === "warm";
    // Grade the accent down only as far as legibility needs: 3:1 behind display
    // type, 4.5:1 behind running text. A palette that already passes is left alone.
    const paperLuminance = hslLuminance(42, 24, paperLight);
    const darkChroma = Math.max(28, accentChroma - 10);
    const displayLight = Math.min(light, readableLightness(hue, accentChroma, paperLuminance, 3.05));
    const textLight = Math.min(light, readableLightness(hue, accentChroma, paperLuminance, 4.6));
    return {
      "--live-hue": hue,
      "--live-chroma": `${Math.max(30, chroma)}%`,
      "--live-light": `${light}%`,
      "--accent": `hsl(${hue} ${accentChroma}% ${light}%)`,
      "--accent-soft": `hsl(${hue} ${Math.max(24, accentChroma - 24)}% ${Math.min(94, light + 27)}%)`,
      "--accent-dark": `hsl(${hue} ${darkChroma}% ${Math.min(Math.max(16, light - 34), readableLightness(hue, darkChroma, paperLuminance, 4.6))}%)`,
      "--accent-display": `hsl(${hue} ${accentChroma}% ${displayLight}%)`,
      "--accent-text": `hsl(${hue} ${accentChroma}% ${textLight}%)`,
      "--muted": `hsl(45 7% ${readableLightness(45, 7, paperLuminance, 4.6)}%)`,
      "--paper": `hsl(${warm ? 42 : 198} 24% ${paperLight}%)`,
      "--ink": `hsl(${warm ? 55 : 202} 14% ${Math.max(7, 18 - (light - 42) * 0.23)}%)`,
      // Near-black leaves almost no room for chroma, so the dark theme is lifted
      // a little and carries more saturation; the tint then also reaches the ink,
      // the rules and every color-mix surface built on the paper.
      "--night-paper": `hsl(${warm ? 26 : 210} ${warm ? 17 : 19}% ${(5 + (light - 58) * 0.08).toFixed(2)}%)`,
      "--night-ink": `hsl(${warm ? 40 : 208} ${warm ? 24 : 20}% 93%)`,
      "--night-muted": `hsl(${warm ? 36 : 214} ${warm ? 11 : 13}% 68%)`,
      "--night-line": warm ? "hsl(34 40% 82% / .22)" : "hsl(206 40% 84% / .22)",
      "--photo-saturation": imageSaturation,
      "--photo-brightness": imageBrightness,
      "--photo-warmth": warm ? "sepia(.08)" : "hue-rotate(8deg)",
      "--gamut-force": gamut === "P3" ? "1" : ".76",
    } as CSSProperties;
  }, [hue, chroma, light, gamut, temperature]);

  const visiblePhotos = useMemo(() => photos.filter(photo => photoCollection === "All frames" || (photoCollection === "The Alps" ? photo.location.includes("Jungfrau") : photoCollection === "Istanbul" ? /Istanbul/.test(photo.location) : !/Jungfrau|Istanbul/.test(photo.location))), [photoCollection]);
  const featuredFrames = [1, 4, 8, 12, 17, 22, 26, 30, 35, 40, 44, 48];
  const displayedPhotos = showAllPhotos ? visiblePhotos : photoCollection === "All frames" ? visiblePhotos.filter(photo => featuredFrames.includes(photo.id)) : visiblePhotos.slice(0, 12);
  const neighbouringFrames = useMemo(() => {
    const index = visiblePhotos.findIndex(photo => photo.id === selectedPhoto?.id);
    if (index < 0) return [];
    return [1, -1].map(direction => visiblePhotos[(index + direction + visiblePhotos.length) % visiblePhotos.length])
      .filter(photo => photo && photo.id !== selectedPhoto?.id)
      .map(photo => photo.fullSrc ?? photo.src);
  }, [visiblePhotos, selectedPhoto]);
  const navigatePhoto = useCallback((direction: number) => setSelectedPhoto(current => {
    const index = visiblePhotos.findIndex(photo => photo.id === current?.id);
    return visiblePhotos[(index + direction + visiblePhotos.length) % visiblePhotos.length];
  }), [visiblePhotos]);

  return (
    <div className={`site-shell gamut-${gamut.toLowerCase()}`} style={theme}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="topbar">
        <a className="wordmark" href="#profile" aria-label="Ahmet Efe Serdar, home">
          <Image className="wordmark-mark" src="/brand-mark-camera-illustrated.png" alt="" width={76} height={43} loading="eager" unoptimized aria-hidden="true" />
          <span className="wordmark-name"><b>Ahmet Efe</b> <em>Serdar</em></span>
        </a>
        <nav aria-label="Primary navigation" ref={navRef}>
          {marker && <span className="nav-marker" aria-hidden="true" style={{ "--marker-left": `${marker.left}px`, "--marker-top": `${marker.top}px`, "--marker-width": `${marker.width}px` } as CSSProperties} />}
          {[["profile", "Profile"], ["journey", "Journey"], ["thesis", "Thesis"]].map(([id, label]) =>
            <a key={id} href={`#${id}`} data-primary aria-current={activeSection === id ? "location" : undefined}>{label}</a>)}
          <div className="nav-group">
            <a href="#photography" data-primary aria-current={activeSection === "photography" ? "location" : undefined}>Photography</a>
            <div className="nav-submenu">
              <a href="#portfolio" aria-current={activeSection === "photography" && activeSub === "portfolio" ? "location" : undefined}>Portfolio</a>
              <a href="#gear" aria-current={activeSection === "photography" && activeSub === "gear" ? "location" : undefined}>Gear</a>
            </div>
          </div>
          <a href="#contact" data-primary aria-current={activeSection === "contact" ? "location" : undefined}>Contact</a>
        </nav>
        <div className="header-contacts"><button className="kelvin-toggle" type="button" onClick={() => setTemperature(temperature === "warm" ? "cool" : "warm")} aria-label={`Page white balance is ${temperature === "warm" ? "3200 Kelvin, warm" : "5600 Kelvin, cool"}. Switch to ${temperature === "warm" ? "cool" : "warm"}.`} title={temperature === "warm" ? "Warm page · 3200K" : "Cool page · 5600K"}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" stroke="none" /></svg>
          <span>{temperature === "warm" ? "3200K" : "5600K"}</span>
        </button><button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Switch between light and dark mode" title="Switch theme">
          <svg className="theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></svg>
          <svg className="theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z" /></svg>
        </button><div className="social-links" aria-label="Social profiles">
          <div className="social-profile-menu" onKeyDown={event => { if (event.key === "Escape") { event.currentTarget.classList.add("dismissed"); } }} onMouseEnter={event => event.currentTarget.classList.remove("dismissed")} onFocus={event => event.currentTarget.classList.remove("dismissed")}>
          <a href="https://www.linkedin.com/in/ahmetefeserdar/" target="_blank" rel="noreferrer" aria-label="LinkedIn profile" title="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3.5 9h3v12h-3V9ZM10 9h3v1.6c.8-1.2 1.9-1.9 3.5-1.9 3 0 4 1.9 4 5V21h-3v-6.4c0-1.8-.5-2.9-2-2.9-1.7 0-2.5 1.2-2.5 3V21h-3V9Z" /></svg></a>
            <div className="social-profile-card compact-social-card">
              <div className="social-card-identity"><span className="social-brand social-brand-linkedin"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3.5 9h3v12h-3V9ZM10 9h3v1.6c.8-1.2 1.9-1.9 3.5-1.9 3 0 4 1.9 4 5V21h-3v-6.4c0-1.8-.5-2.9-2-2.9-1.7 0-2.5 1.2-2.5 3V21h-3V9Z" /></svg></span><div><span className="social-card-network">LinkedIn</span><strong>ahmetefeserdar</strong></div></div>
              <a href="https://www.linkedin.com/in/ahmetefeserdar/" target="_blank" rel="noreferrer">View profile <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="social-profile-menu" onKeyDown={event => { if (event.key === "Escape") { event.currentTarget.classList.add("dismissed"); } }} onMouseEnter={event => event.currentTarget.classList.remove("dismissed")} onFocus={event => event.currentTarget.classList.remove("dismissed")}>
          <a href="https://github.com/ahmetefeserdar" target="_blank" rel="noreferrer" aria-label="GitHub profile" title="GitHub"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.83c.85 0 1.71.11 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg></a>
            <div className="social-profile-card compact-social-card">
              <div className="social-card-identity"><span className="social-brand social-brand-github"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.83c.85 0 1.71.11 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg></span><div><span className="social-card-network">GitHub</span><strong>ahmetefeserdar</strong></div></div>
              <a href="https://github.com/ahmetefeserdar" target="_blank" rel="noreferrer">View profile <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="social-profile-menu email-menu" onKeyDown={event => { if (event.key === "Escape") event.currentTarget.classList.add("dismissed"); }} onMouseEnter={event => event.currentTarget.classList.remove("dismissed")} onFocus={event => event.currentTarget.classList.remove("dismissed")}>
          <a href="mailto:hello@ahmetefe.dev" aria-label="Email Ahmet Efe" title="Email"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></svg></a>
            <div className="social-profile-card email-card">
              <span className="social-card-network">A note, an idea, a hello</span>
              <strong>Let’s talk.</strong>
              <a className="email-address" href="mailto:hello@ahmetefe.dev">hello@ahmetefe.dev</a>
              <a href="mailto:hello@ahmetefe.dev">Write an email <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div><CityPreview /></div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="hero profile-hero profile-camera profile-simple" id="profile">
          <SensorField />
          <div className="hero-kicker"><span>01 / Profile</span><span>Computer graphics · vision · AI</span></div>
          <div className="hero-copy">
            <div className="identity-block">
              <p className="identity-label">Ahmet Efe</p>
              <h1><span>Ahmet Efe</span><em>Serdar.</em></h1>
              <p className="profile-lede">Building systems.<br />Thinking in images.</p>
            </div>
            <div className="hero-bottom profile-statement">
              <p>I&apos;m a software engineer and an M.Sc. student at ETH Zürich, focused on computer graphics and visual computing. I like understanding how things work—from the systems behind a product to the geometry and light behind an image.</p>
              <p>At Midas, I build backend systems for global markets. Away from the keyboard, I explore Zürich, Istanbul, and the places between them with a camera.</p>
            </div>
            <div className="profile-links"><a href="#journey">Explore my work <Arrow diagonal /></a><a href="#photography">Through my lens <Arrow diagonal /></a></div>
          </div>

          <div className="profile-console">
            <ColorLab
              hue={hue}
              chroma={chroma}
              light={light}
              setHue={setHue}
              setChroma={setChroma}
              setLight={setLight}
              setGamut={setGamut}
            />
            <dl className="profile-facts">

              <div><dt>Between</dt><dd>Zürich & Istanbul</dd></div>

              <div><dt>Now</dt><dd>Software Engineer · Midas</dd></div>
              <div><dt>Studying</dt><dd>Computer Science M.Sc. · ETH Zürich</dd></div>
              <div><dt>Languages</dt><dd>Turkish · English · German</dd></div>
            </dl>
          </div>
        </section>

        <section className="journey section-grid" id="journey">
          <div className="section-marker"><span>02</span><p>Journey</p></div>
          <div className="journey-main">
            <div className="journey-intro">
              <h2>Some chapters run<br /><em>at the same time.</em></h2>
              <p>A shared timeline of study and practice. Follow the overlaps, then explore the chapters behind them.</p>
            </div>
            <div className="journey-timeline" aria-label="Education and work timeline from September 2021 to September 2026">
              <div className="journey-board-head"><div><span className="eyebrow">A view through time</span><h3>Learning. Building. Overlapping.</h3></div><span className="journey-range">2021 — 2026</span></div>
              <div className="journey-axis" aria-hidden="true">
                {timelineTicks.map(tick => <span key={tick.label} style={{ left: `${tick.position}%` }}>{tick.label}</span>)}
              </div>
              {["education", "work"].map(kind => <div className="journey-lane" key={kind}>
                <p className="journey-lane-title"><span className={`lane-dot ${kind}`} />{kind === "education" ? "Education" : "Work & practice"}<span>{kind === "education" ? "The foundations" : "Putting it into practice"}</span></p>
                {journeyItems.filter(item => item.kind === kind).sort((a, b) => a.start - b.start).map(item => <button
                  key={item.id} type="button"
                  className={`journey-track ${item.kind} ${activeJourney === item.id ? "active" : ""}`}
                  onMouseEnter={() => setActiveJourney(item.id)} onFocus={() => setActiveJourney(item.id)}
                  onClick={() => { setActiveJourney(item.id); document.getElementById(`chapter-${item.id}`)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "center" }); }}
                  aria-label={`${item.short}, ${item.period}. View details`} aria-controls={`chapter-${item.id}`}>
                  <span className="journey-track-label"><b>{item.short}</b><small>{item.period}</small></span>
                  <span className="journey-track-plot" aria-hidden="true">
                    {timelineTicks.map(tick => <i className="journey-guide" key={tick.label} style={{ left: `${tick.position}%` }} />)}
                    <span className="journey-bar" style={{ left: `${item.start}%`, width: `${item.end - item.start}%` }}>
                      {item.id === "bachelors" && <span className="journey-thesis" style={{ left: `${thesisInsetStart}%`, width: `${thesisInsetWidth}%` }}>Thesis</span>}
                      {item.period.includes("now") && <i className="journey-now" />}
                    </span>
                  </span>
                </button>)}
              </div>)}
              <div className="journey-board-foot"><span>Explore a chapter to see the details ↓</span><span>Earlier years compressed · more detail from Sep 2024</span></div>
            </div>
            <div className="journey-chapters-heading"><h3>The chapters so far.</h3><span>06 chapters · 02 ongoing</span></div>
            <div className="journey-chapters">
              {journeyItems.map((item, index) => (
                <article id={`chapter-${item.id}`} key={item.id} className={`journey-chapter ${item.kind} ${activeJourney === item.id ? "active" : ""}`} onMouseEnter={() => setActiveJourney(item.id)}>
                  <div className="chapter-top"><span className="chapter-number">{String(index + 1).padStart(2, "0")} / {item.kind === "education" ? "Education" : "Experience"}</span>{item.period.includes("now") && <span className="chapter-current"><i />Ongoing</span>}</div>
                  <div className="chapter-organization"><OrganizationLogo id={item.id} /><p className="chapter-place">{item.place}</p></div>
                  <h3>{item.title}</h3>
                  <p className="chapter-period">{item.period}</p>
                  <p className="chapter-detail">{item.detail}</p>
                  <ul>{item.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="thesis thesis-reflow" id="thesis">
          <div className="section-heading thesis-heading">
            <div className="section-marker light"><span>03</span><p>Bachelor thesis</p></div>
            <h2>Embroidery-aware<br /><em>segmentation.</em></h2>
            <p>Computational Design Lab, ETH Zürich · 2024–2025. Image segmentation for directionality-aware embroidery.</p>
          </div>

          <div className="thesis-feature thesis-feature-real">
            <div className="thesis-overview">
              <div><span>01 / Problem</span><h3>Images aren’t stitch plans.</h3><p>Tiny color islands and fragmented regions interrupt the direction and flow of embroidery.</p></div>
              <div><span>02 / Approach</span><h3>Merge with structure.</h3><p>Combine neighboring superpixels using color variation and boundary evidence, then organize the regions into a hierarchy.</p></div>
              <div><span>03 / Result</span><h3>Regions ready for thread.</h3><p>Export layered polygons and direction hints for the next stage of the embroidery pipeline.</p></div>
            </div>
            <div className="stitch-stage" aria-label="From an input image to segmented regions and an embroidery preview">
              <Image className="stitch-image" src="/thesis/teaser.png" alt="A bird transformed from a flat image through superpixel segmentation into a direction-aware embroidered rendering" width={2798} height={840} sizes="94vw" loading="lazy" unoptimized />
            </div>
            <div className="stitch-labels" aria-hidden="true"><span>01 · Source image</span><span>02 · Segmented regions</span><span>03 · Embroidery preview</span></div>
            <div className="thesis-copy thesis-copy-grid">
              <p className="thesis-lede">A computer-graphics pipeline that prepares images to become directional thread.</p>
              <div>
                <p>
                  A region that looks plausible on screen is not necessarily a good
                  region to stitch. Fragmented color islands create unwanted jumps;
                  too many tiny regions break up smooth flow. My thesis explores how
                  segmentation can preserve boundaries, internal color variation,
                  and nested detail for two-tone, directional embroidery.
                </p>
              </div>
              <div>
                <p>
                  Starting with SLIC superpixels, I greedily merge neighboring regions
                  using perceptual color, PCA-based color variation, and boundary
                  evidence. The resulting polygons form a containment hierarchy,
                  exported as one LabelMe JSON per depth with automatic direction
                  hints for the downstream embroidery system of Liu et al.
                </p>
                <a className="text-link" href="https://github.com/ahmetefeserdar/Embroidery" target="_blank" rel="noreferrer">
                  Explore the thesis on GitHub <Arrow diagonal />
                </a>
              </div>
            </div>
          </div>
          <MergeEnergy />
          <div className="thesis-findings">
            <div><span className="eyebrow">From regions to thread</span><h3>A hierarchy, not just a mask.</h3><p>Cleaned polygons are organized by containment, so background regions can be stitched before their nested details. Shape-derived inner chords provide initial direction hints, connecting image segmentation to the next stage of pattern generation.</p></div>
            <div><span className="eyebrow">What the comparisons showed</span><h3>Coherence matters.</h3><p>Qualitative comparisons with K-means, raw SLIC, and simulated detector masks showed more cohesive regions and smoother stitch-flow previews. Fine textures, image-dependent thresholds, and robust polygon conversion remain challenges; automatic direction hints can still benefit from manual refinement.</p></div>
          </div>
        </section>

        <section className={`photography photo-room-${temperature}`} id="photography">
          <div className="photography-head">
            <div className="section-marker"><span>04</span><p>Photography</p></div>
            <div>
              <h2>Light, place,<br /><em>and attention.</em></h2>
              <p>Small observations from mountain paths and city streets. A collection of light, architecture, and everyday details, photographed with my Sony A7C and iPhone.</p>
            </div>
            <div className="photo-controls">
              <div className="view-toggle" aria-label="Gallery layout">
                <button type="button" className={gallery === "editorial" ? "active" : ""} onClick={() => setGallery("editorial")} aria-pressed={gallery === "editorial"}>Editorial</button>
                <button type="button" className={gallery === "contact-sheet" ? "active" : ""} onClick={() => setGallery("contact-sheet")} aria-pressed={gallery === "contact-sheet"}>Contact sheet</button>
              </div>
            </div>
          </div>

          <div className="gallery-toolbar"><div className="collection-filters" role="group" aria-label="Photo collection">{["All frames", "The Alps", "Swiss cities", "Istanbul"].map(collection => <button type="button" key={collection} aria-pressed={photoCollection === collection} onClick={() => setPhotoCollection(collection)}>{collection}</button>)}</div><p aria-live="polite">{String(visiblePhotos.length).padStart(2,"0")} frames <span>· Original edits</span></p></div>

          <div className={`photo-grid ${gallery}`} id="portfolio">
            {displayedPhotos.map((photo) => (
              <button className="photo-card" type="button" key={photo.id} onClick={() => setSelectedPhoto(photo)} onContextMenu={(event) => event.preventDefault()} aria-label={`Open frame ${photo.id}: ${photo.alt}`}>
                <span>{String(photo.id).padStart(2, "0")}</span>
                <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes={gallery === "contact-sheet" ? "(max-width: 700px) 50vw, 25vw" : "(max-width: 700px) 100vw, 40vw"} loader={frameLoader} loading="lazy" draggable={false} />
                <small className="photo-place">{photo.location} · {photo.captured}</small>
                <small className="photo-exif"><b>{photo.focalLength}</b><b>{photo.aperture}</b><b>{photo.shutter}s</b><b>ISO {photo.iso}</b></small>
                <small className="view-frame">View frame ↗</small>
              </button>
            ))}
          </div>
          {visiblePhotos.length > 12 && <div className="gallery-expansion"><p>{displayedPhotos.length} of {visiblePhotos.length} photographs</p><button type="button" aria-expanded={showAllPhotos} onClick={() => { setShowAllPhotos(!showAllPhotos); if(showAllPhotos) document.getElementById("photography")?.scrollIntoView({behavior:"instant"}); }}>{showAllPhotos ? "Back to selected frames" : `Show all ${visiblePhotos.length} photographs`}</button></div>}
          <GearDisplay />


        </section>

        <section className="contact section-grid" id="contact">
          <div className="section-marker light"><span>05</span><p>Contact</p></div>
          <div className="contact-copy">
            <p>Have a problem worth looking at twice?</p>
            <a href="mailto:hello@ahmetefe.dev">Let&apos;s talk.<Arrow diagonal /></a>
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

      {selectedPhoto && <Lightbox photo={selectedPhoto} neighbours={neighbouringFrames} onClose={closeLightbox} onNavigate={navigatePhoto} position={visiblePhotos.findIndex(photo => photo.id === selectedPhoto.id) + 1} total={visiblePhotos.length} />}
    </div>
  );
}
