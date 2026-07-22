import type { MetadataRoute } from "next";

// Keep the design-experiment routes (/v01-swiss ... /v12-cassette, /v11a-b-c)
// out of search engines - they're internal look-and-feel drafts, not content.
// "/v0" and "/v1" are prefix rules that cover every /v* route; the real site
// lives at "/" only.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/v0", "/v1"],
    },
    sitemap: "https://manyari.dev/sitemap.xml",
  };
}
