import type { MetadataRoute } from "next";

// Only the real homepage. The /v* design experiments are intentionally excluded
// (and disallowed in robots.ts) so they don't surface in search.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://manyari.dev",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
