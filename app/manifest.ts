import type { MetadataRoute } from "next";

import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: "Flea Finder",
    description: APP_DESCRIPTION,
    start_url: "/da",
    display: "standalone",
    background_color: "#f3ecdd",
    theme_color: "#1b3c34",
    lang: "da",
    orientation: "portrait",
    categories: ["lifestyle", "travel", "events"],
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  };
}
