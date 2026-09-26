import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ahmetefe.dev"),
  title: "Ahmet Efe Serdar — Graphics, Vision & Software",
  description:
    "Ahmet Efe Serdar is a Software Engineer at Midas and an ETH Zürich computer science M.Sc. student focused on computer graphics, vision, AI, and photography.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Ahmet Efe Serdar — Graphics, Vision & Software",
    description:
      "Computer graphics, vision, AI, backend engineering, and photography.",
    url: "/",
    siteName: "Ahmet Efe Serdar",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Ahmet Efe Serdar — Software Engineer, Visual Computing, Photography" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmet Efe Serdar — Graphics, Vision & Software",
    description: "Computer graphics, vision, AI, backend engineering, and photography.",
    images: ["/og.jpg"],
  },
};

// Structured data so search engines can recognise the site as one person's profile.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ahmet Efe Serdar",
  url: "https://ahmetefe.dev",
  image: "https://ahmetefe.dev/og.jpg",
  email: "mailto:hello@ahmetefe.dev",
  jobTitle: "Software Engineer",
  worksFor: { "@type": "Organization", name: "Midas" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "ETH Zürich", url: "https://ethz.ch" },
  knowsAbout: ["Computer graphics", "Computer vision", "Visual computing", "Backend engineering", "Photography"],
  sameAs: ["https://github.com/ahmetefeserdar", "https://www.linkedin.com/in/ahmetefeserdar/"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('portfolio-theme');document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}})()` }} /></head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}
