import type { Metadata } from "next";
import "./site-v3.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ahmetefe.dev"),
  title: "Ahmet Efe Serdar — Graphics, Vision & Software",
  description:
    "Ahmet Efe Serdar is a Software Engineer at Midas and an ETH Zürich computer science M.Sc. student focused on computer graphics, vision, AI, and photography.",
  openGraph: {
    title: "Ahmet Efe Serdar — Graphics, Vision & Software",
    description:
      "Computer graphics, vision, AI, backend engineering, and photography.",
    url: "/",
    siteName: "Ahmet Efe Serdar",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Ahmet Efe Serdar — Software Engineer, Visual Computing, Photography" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmet Efe Serdar — Graphics, Vision & Software",
    description: "Computer graphics, vision, AI, backend engineering, and photography.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
