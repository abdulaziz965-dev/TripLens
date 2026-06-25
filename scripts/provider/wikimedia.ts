import axios from "axios";
import type { ImageProvider } from "./provider";

export class WikimediaProvider implements ImageProvider {
  async getImageUrl(
    place: string,
    city: string
  ): Promise<string | null> {
    try {
      const search = `${place} ${city}`;

      const response = await axios.get(
        "https://commons.wikimedia.org/w/api.php",
        {
          params: {
            action: "query",
            generator: "search",
            gsrsearch: search,
            gsrlimit: 1,
            prop: "imageinfo",
            iiprop: "url",
            format: "json",
          },
        }
      );

      const pages = response.data.query?.pages;

      if (!pages) {
        return null;
      }

      const page = Object.values(pages)[0] as any;

      return page.imageinfo?.[0]?.url ?? null;
    } catch {
      return null;
    }
  }
}