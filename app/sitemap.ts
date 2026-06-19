import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://guessxi.app/"
    },
    {
      url: "https://guessxi.app/versus"
    },
    {
      url: "https://guessxi.app/privacy"
    },
    {
      url: "https://guessxi.app/contact"
    }
  ];
}
