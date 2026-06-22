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
      url: "https://guessxi.app/about"
    },
    {
      url: "https://guessxi.app/how-to-play"
    },
    {
      url: "https://guessxi.app/clue-guide"
    },
    {
      url: "https://guessxi.app/faq"
    },
    {
      url: "https://guessxi.app/privacy"
    },
    {
      url: "https://guessxi.app/contact"
    }
  ];
}
