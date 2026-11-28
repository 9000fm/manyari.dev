"use client";

import { useLang } from "./useLang";

const BADGES = [
  { file: "html", alt: "HTML", width: 207, height: 66 },
  { file: "css", alt: "CSS", width: 209, height: 69 },
  { file: "javascript", alt: "JavaScript", width: 507, height: 153 },
  { file: "typescript", alt: "TypeScript", width: 506, height: 163 },
  { file: "react", alt: "React", width: 509, height: 164 },
  { file: "world-wide-web", alt: "World Wide Web", width: 504, height: 163 },
  { file: "always-in-progress", alt: "Always in Progress", width: 506, height: 162, es: { file: "always-in-progress-es", alt: "Siempre en desarrollo", width: 504, height: 162 } },
  { file: "learn-from-everyone", alt: "Learn from everyone", width: 504, height: 162, es: { file: "learn-from-everyone-es", alt: "Aprende de todos", width: 504, height: 162 } },
] as const;

/** Decorative badges are part of the closing signature, not navigation. */
export default function BadgeGrid() {
  const lang = useLang();
  return (
    <div className="brutBadges">
      {BADGES.map(badge => {
        const image = lang === "es" && "es" in badge ? badge.es : badge;
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={badge.file} src={`/badges/${image.file}.png`} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
        );
      })}
    </div>
  );
}
