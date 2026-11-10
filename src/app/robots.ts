import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

/**
 * robots.txt: every crawler may index the whole site, and is told where the sitemap is.
 * @returns the robots rules
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
