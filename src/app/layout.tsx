import type { Metadata } from "next";
import { VT323, Space_Mono, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Terminal font - for UI, nav, labels, CLI elements
const vt323 = VT323({
  weight: "400",
  variable: "--font-terminal",
  subsets: ["latin"],
});

// Display font - for hero name, bold headings
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-display",
  subsets: ["latin"],
});

// Body font - for readable text, bios, paragraphs
const ibmPlexMono = IBM_Plex_Mono({
  weight: ["300", "400", "500"],
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "superself",
  description: "...",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${vt323.variable} ${spaceMono.variable} ${ibmPlexMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
