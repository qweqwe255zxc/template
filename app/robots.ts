import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /qa-audit — внутренний стенд вариантов, он не часть сайта клиента
        // и удаляется перед сдачей; пока он есть, поисковику там делать нечего.
        disallow: ["/api/", "/qa-audit"],
      },
    ],
    sitemap: `${siteConfig.seo.siteUrl}/sitemap.xml`,
    host: siteConfig.seo.siteUrl,
  };
}
