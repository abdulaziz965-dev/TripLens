import type {
  GeoapifyGeocodeResponse,
  GeoapifyPlacesResponse,
  GeoapifyPlace,
} from "../../types/api/geoapify";
import { topAttractions } from "../../data/topAttractions";
import { getCityKey } from "../../utils/location";
import { apiFetch } from "../shared/api";
const BLOCKED_WORDS = [
          "atm",
          "office",
          "parking",
          "bus stop",
          "fuel",
          "petrol",
          "bank",
          "memorial",
          "statue",
          "junction",
          "crossroad",
          "hospital",
          "clinic",
          "school",
          "college",
          "university",
          "apartment",
          "residency",
        ];

export async function getActivities(city: string) {
    const cityKey = getCityKey(city);

const curated = (topAttractions[cityKey] || []).map(activity => ({
  ...activity,
  image:
    activity.image ??
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",
}));
  const API_KEY = import.meta.env.VITE_GEOAPIFY_KEY;
  if (!API_KEY) {
  throw new Error("Missing VITE_GEOAPIFY_KEY");
}

  
  try {
    // Get city coordinates
   const geoData = await apiFetch<GeoapifyGeocodeResponse>(
  `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    city
  )}&apiKey=${API_KEY}`
);

    if (!geoData.features?.length) {
      return [];
    }

    const [lon, lat] =
      geoData.features[0].geometry.coordinates;

    // Find attractions around city
const placesData = await apiFetch<GeoapifyPlacesResponse>(
  `https://api.geoapify.com/v2/places?categories=tourism.attraction,tourism.sights,entertainment.theme_park,leisure.park&filter=circle:${lon},${lat},50000&limit=50&apiKey=${API_KEY}`
);

    const filtered = (placesData.features || [])
      .filter((place: GeoapifyPlace) => {
        const name =
          place.properties?.name?.toLowerCase() || "";

        if (!name) return false;

       
      return !BLOCKED_WORDS.some(word =>
          name.includes(word)
        );
      })
      .sort(
  (a: GeoapifyPlace, b: GeoapifyPlace) =>
    (b.properties?.rank?.importance || 0) -
    (a.properties?.rank?.importance || 0)
)
      .slice(0, 30);

    if (import.meta.env.DEV) {
  console.log("Filtered Places:", filtered);

  console.table(
    filtered.map((place: GeoapifyPlace) => ({
      name: place.properties?.name,
      importance: place.properties?.rank?.importance,
      categories: place.properties?.categories?.[0],
    }))
  );
}

const geoapifyActivities = filtered.map((place: GeoapifyPlace) => ({
  id:
  place.properties?.place_id ??
  place.properties?.name ??
  crypto.randomUUID(),

  name:
    place.properties?.name ||
    "Tourist Attraction",

  image:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",

  rating: undefined,

  price: undefined,

  duration: undefined,

  description:
    place.properties?.formatted ||
    "Popular attraction in this destination.",

  category:
    place.properties?.categories?.[0] ||
    "Attraction",
}));

const normalize = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const existingNames = new Set(
  curated.map((a: any) => normalize(a.name))
);

const uniqueGeoapify = geoapifyActivities.filter(
  (a: any) =>
    !existingNames.has(
      normalize(a.name)
    )
);



return [
  ...curated,
  ...uniqueGeoapify.slice(
    0,
    Math.max(0, 20 - curated.length)
  ),
];
  } catch (error) {
    console.error("Geoapify Error:", error);
    return [];
  }
}