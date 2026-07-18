import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://manyari.dev"),
  title: "Flavio Manyari — Portfolio",
  description: "Web developer and designer. Projects end to end - brand, design, code, deploy.",
  // stop Chrome/Google offering to translate the page (the bar covers content
  // and breaks in-page anchor jumps on mobile)
  other: { google: "notranslate" },
  openGraph: {
    title: "Flavio Manyari — index of /",
    description: "Web developer and designer. Projects end to end - brand, design, code, deploy.",
    url: "https://manyari.dev",
    siteName: "Flavio Manyari",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flavio Manyari — index of /",
    description: "Web developer and designer. Projects end to end - brand, design, code, deploy.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" translate="no">
      <body>{children}</body>
    </html>
  );
}
