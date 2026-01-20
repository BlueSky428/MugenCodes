import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const routes = [
    "",
    "/team",
    "/how-we-work",
    "/services",
    "/why-choose-us",
    "/contact",
    "/privacy"
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date().toISOString()
  }));
}
