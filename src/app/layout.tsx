import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://manyari.dev"),
  title: "Flavio Manyari — Portfolio",
  description: "Web developer and designer. Projects end to end - brand, design, code, deploy.",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
