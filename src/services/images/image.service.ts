import { apiFetch } from "../shared/api";

interface WikipediaImageResponse {
  originalimage?: {
    source: string;
  };

  thumbnail?: {
    source: string;
  };
}
const imageCache = new Map<string, string>();
export async function getWikipediaImage(
  title: string
): Promise<string | null> {
 const key = title.trim().toLowerCase();

if (imageCache.has(key)) {
  return imageCache.get(key)!;
}

  try {
    const data =
      await apiFetch<WikipediaImageResponse>(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          title
        )}`
      );

    const image =
  data.originalimage?.source ??
  data.thumbnail?.source ??
  null;

if (image) {
  imageCache.set(key, image);
}

return image;
  } catch {
    return null;
  }
}
export async function testWikipediaImage() {
  const image = await getWikipediaImage("Charminar");

  console.log("Wikipedia Image:", image);

  return image;
}