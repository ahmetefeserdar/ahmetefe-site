import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found — Ahmet Efe Serdar",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="not-found-kicker"><span>404 / Not found</span><span>ahmetefe.dev</span></p>
      <h1>Out of <em>frame.</em></h1>
      <p className="not-found-copy">This page doesn&apos;t exist, or it has moved. Everything on the site lives on the homepage.</p>
      <Link className="not-found-link" href="/">Back to the homepage <span aria-hidden="true">↗</span></Link>
    </main>
  );
}
