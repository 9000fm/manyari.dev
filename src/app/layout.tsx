import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flavio Manyari — Portfolio",
  description: "Web developer & graphic designer based in Lima, PE.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
