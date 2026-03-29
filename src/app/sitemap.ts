import type { MetadataRoute } from "next";

const LAST_MODIFIED = "2026-03-29";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://picker.guardclaw.dev/",
      lastModified: LAST_MODIFIED,
    },
    {
      url: "https://picker.guardclaw.dev/pick",
      lastModified: LAST_MODIFIED,
    },
  ];
}
