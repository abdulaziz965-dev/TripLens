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
export async function getPlaceImage(
  placeName: string,
  destination?: string
): Promise<string | null> {
const searchQuery = destination
  ? `${placeName} ${destination}`
  : placeName;

const key = searchQuery.trim().toLowerCase();

if (imageCache.has(key)) {
  return imageCache.get(key)!;
}

  try {
    const data =
      await apiFetch<WikipediaImageResponse>(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          searchQuery
        )}`
      );

   const image =
  data.originalimage?.source ??
  data.thumbnail?.source ??
  `https://source.unsplash.com/1200x800/?${encodeURIComponent(searchQuery)}`;

imageCache.set(key, image);

return image;


  } catch {
    return null;
  }
}
