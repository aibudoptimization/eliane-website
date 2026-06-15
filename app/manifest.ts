import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
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
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
