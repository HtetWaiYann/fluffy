import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

/**
 * sitemap.xml: one page, so one entry.
 * @returns the sitemap entries
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL }];
}
