"use client";

import { CSSProperties, useState } from "react";

const cues = [
  { name: "Color", symbol: "col", description: "Mean colors in CIELAB space: larger perceptual differences reduce affinity." },
  { name: "PCA angle", symbol: "angle", description: "Alignment of the dominant color-variation axes, with a penalty conditioned on their lengths." },
  { name: "PCA length", symbol: "len", description: "A factor based on the ratio between the smaller and larger color-variation lengths." },
  { name: "Boundary", symbol: "grad", description: "Canny edge evidence along the shared boundary: strong edges discourage merging." },
];
const presets = [[.85, .9, .75, .9], [.85, .9, .75, .06], [.1, .55, .75, .9]];

export default function MergeEnergy() {
  const [factors, setFactors] = useState(presets[0]);
  const affinity = factors.reduce((product, factor) => product * factor, 1);
  const cost = -Math.log(affinity + 1e-8);
  const merge = cost < 2.8;
  return <section className="merge-lab" aria-labelledby="merge-title">
    <div className="merge-intro"><div><span className="eyebrow">Inside the method / §3.2.5</span><h3 id="merge-title">When should two regions<br /><em>become one?</em></h3></div><p>Four cues contribute to a shared affinity. A single weak factor can make a merge too costly. Adjust the factors to explore the decision.</p></div>
    <div className="merge-equation" aria-label="Affinity equals the product of angle, length, color, and gradient factors. Cost equals negative logarithm of affinity plus epsilon."><span>Aff(u, v) = F<sub>angle</sub> · F<sub>len</sub> · F<sub>col</sub> · F<sub>grad</sub></span><span>Cost = −log(Aff + ε)</span></div>
    <div className="merge-cues">{cues.map((cue, i) => <div className="merge-cue" key={cue.symbol}>
      <svg viewBox="0 0 160 68" aria-hidden="true">
        {i === 0 ? <><circle cx="59" cy="34" r="23" fill="var(--accent)" /><circle cx="101" cy="34" r="23" fill={`hsl(calc(var(--live-hue) + ${(1-factors[i])*170}) var(--live-chroma) var(--live-light))`} /></> : i === 1 ? <><ellipse cx="57" cy="34" rx="32" ry="15" fill="var(--method-neutral-fill)" /><path d="M26 34H88" stroke="var(--method-secondary)" strokeWidth="2" /><g transform={`rotate(${(1-factors[i])*85} 108 34)`}><ellipse cx="108" cy="34" rx="30" ry="15" fill="var(--method-fill)" /><path d="M78 34H138" stroke="var(--accent)" strokeWidth="2" /></g></> : i === 2 ? <><path d="M28 24H130" stroke="var(--method-secondary)" strokeWidth="3" /><path d={`M28 46H${40+factors[i]*90}`} stroke="var(--accent)" strokeWidth="3" /><circle cx="28" cy="24" r="4" fill="var(--method-secondary)" /><circle cx="28" cy="46" r="4" fill="var(--accent)" /></> : <><rect x="30" y="10" width="50" height="48" rx="8" fill="var(--method-neutral-fill)" /><rect x="80" y="10" width="50" height="48" rx="8" fill="var(--method-fill)" /><path d="M80 8V60" stroke="var(--ink)" strokeWidth={1+(1-factors[i])*5} strokeDasharray={factors[i]>.5 ? "3 4" : undefined} /></>}
      </svg>
      <label><span>{cue.name}<output>{factors[i].toFixed(2)}</output></span><input aria-label={`${cue.name} affinity factor`} type="range" min=".05" max="1" step=".01" value={factors[i]} style={{ "--fill": `${((factors[i] - 0.05) / 0.95) * 100}%` } as CSSProperties} onChange={e => setFactors(previous => previous.map((f, index) => index === i ? Number(e.target.value) : f))} /></label><p>{cue.description}</p>
    </div>)}</div>
    <div className="merge-bottom"><div className="merge-presets"><span>Try a pair</span>{["Compatible regions", "Strong boundary", "Different colors"].map((name, i) => <button type="button" key={name} aria-pressed={factors.every((factor, index) => factor === presets[i][index])} onClick={() => setFactors(presets[i])}>{name}</button>)}</div>
      <div className={`merge-result ${merge ? "accepted" : "rejected"}`} aria-live="polite"><svg viewBox="0 0 90 48" aria-hidden="true"><rect x="5" y="5" width={merge ? 80 : 37} height="38" rx="12" fill="var(--method-secondary)" />{!merge && <rect x="48" y="5" width="37" height="38" rx="12" fill="var(--accent)" />}</svg><div><strong>{merge ? "Merge the pair" : "Keep the boundary"}</strong><span>Cost {cost.toFixed(2)} {merge ? "<" : "≥"} 2.80 · Affinity {affinity.toFixed(3)}</span></div></div>
    </div>
    <p className="merge-note">Illustrative factor values, not a live image segmentation. The product and log-cost follow the thesis; 2.80 is one example threshold. After each accepted merge, region features and neighboring graph costs are recomputed.</p>
  </section>;
}
