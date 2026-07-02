import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { resolveSiteIconUrls } from "@/lib/site-icons";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { data: siteSettings } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const { manifest192, manifest512 } = resolveSiteIconUrls(siteSettings);

  return {
    name: "Éliane Larre — Entraîneure personnelle",
    short_name: "Éliane Larre",
    description:
      "Entraîneure personnelle privée à Montréal — accompagnement personnalisé en présentiel.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1ea",
    theme_color: "#552772",
    icons: [
      {
        src: manifest192,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: manifest512,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
