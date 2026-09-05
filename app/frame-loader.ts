"use client";

// Gallery frames ship as pre-generated derivatives (scripts/prepare-frames.py),
// so the browser can pick a width instead of always pulling the largest file.
const WIDTHS = [640, 1280];

export default function frameLoader({ src, width }: { src: string; width: number }) {
  const frame = /^\/frames\/(\d+)\.webp$/.exec(src);
  if (!frame) return src;
  return `/frames/w${WIDTHS.find((candidate) => candidate >= width) ?? WIDTHS.at(-1)}/${frame[1]}.webp`;
}
