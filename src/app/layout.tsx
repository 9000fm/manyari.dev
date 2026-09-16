import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ME } from "../content";

// Titles and descriptions read ME so they stay in step with the page and the
// share card (opengraph-image.tsx); the lowercase social title is deliberate.
const description = `${ME.role}. ${ME.tagline}`;
const socialTitle = `${ME.name} - ${ME.role}`.toLowerCase();

export const metadata: Metadata = {
  metadataBase: new URL("https://manyari.dev"),
  title: ME.siteTitle,
  description,
  // stop Chrome/Google offering to translate the page (the bar covers content
  // and breaks in-page anchor jumps on mobile)
  other: { google: "notranslate" },
  // icon.svg and favicon.ico stay in app/ (file convention). The 512px PNG lives in
  // public/ on purpose: as app/icon.png it trips a Turbopack panic in next build
  // ("Dependency tracking is disabled"), seen locally and on Vercel, Sep 2026.
  icons: { apple: "/icon-512.png" },
  openGraph: {
    title: socialTitle,
    description,
    url: "https://manyari.dev",
    siteName: ME.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" translate="no">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
