import { topAttractions } from "../data/topAttractions";
export async function getActivities(city: string) {
    const cityKey =
  city.split(",")[0].trim().toLowerCase();

const curated = topAttractions[cityKey] || [];
  const API_KEY = import.meta.env.VITE_GEOAPIFY_KEY;
  
  try {
    // Get city coordinates
    const geoResponse = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        city
      )}&apiKey=${API_KEY}`
    );

    const geoData = await geoResponse.json();

    if (!geoData.features?.length) {
      return [];
    }

    const [lon, lat] =
      geoData.features[0].geometry.coordinates;

    // Find attractions around city
    const placesResponse = await fetch(
      `https://api.geoapify.com/v2/places?categories=tourism.attraction,tourism.sights,entertainment.theme_park,leisure.park&filter=circle:${lon},${lat},25000&limit=50&apiKey=${API_KEY}`
    );

    const placesData = await placesResponse.json();

    const filtered = (placesData.features || [])
      .filter((place: any) => {
        const name =
          place.properties?.name?.toLowerCase() || "";

        if (!name) return false;

        const blockedWords = [
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

        return !blockedWords.some(word =>
          name.includes(word)
        );
      })
      .sort((a: any, b: any) => {
  const getScore = (place: any) => {
    const categories =
      place.properties?.categories || [];

    const name =
      place.properties?.name?.toLowerCase() || "";

    let score =
      place.properties?.rank?.importance || 0;

    // Major tourist attractions
    if (categories.some((c: string) => c.includes("museum")))
      score += 100;

    if (categories.some((c: string) => c.includes("fort")))
      score += 100;

    if (categories.some((c: string) => c.includes("castle")))
      score += 100;

    if (categories.some((c: string) => c.includes("theme_park")))
      score += 90;

    if (categories.some((c: string) => c.includes("zoo")))
      score += 80;

    if (categories.some((c: string) => c.includes("beach")))
      score += 80;

    if (categories.some((c: string) => c.includes("waterfall")))
      score += 80;

    if (categories.some((c: string) => c.includes("park")))
      score += 20;

    // Hyderabad boosts
    if (name.includes("charminar"))
      score += 500;

    if (name.includes("golconda"))
      score += 500;

    if (name.includes("ramoji"))
      score += 500;

    if (name.includes("salar jung"))
      score += 500;

    if (name.includes("hussain sagar"))
      score += 500;

    return score;
  };

  return getScore(b) - getScore(a);
})
      .slice(0, 20);

    console.log("Filtered Places:", filtered);
   
    console.table(
  filtered.map((place: any) => ({
    name: place.properties?.name,
    importance: place.properties?.rank?.importance,
    categories: place.properties?.categories?.[0],
  }))
);

const geoapifyActivities = filtered.map((place: any) => ({
  id:
    place.properties?.place_id ||
    place.properties?.name,

  name:
    place.properties?.name ||
    "Tourist Attraction",

  image:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",

  rating: 4.5,

  price: "Free",

  duration: "Flexible",

  description:
    place.properties?.formatted ||
    "Popular attraction in this destination.",

  category:
    place.properties?.categories?.[0] ||
    "Attraction",
}));

const existingNames = new Set(
  curated.map((a: any) =>
    a.name.toLowerCase()
  )
);

const uniqueGeoapify = geoapifyActivities.filter(
  (a: any) =>
    !existingNames.has(
      a.name.toLowerCase()
    )
);

return [
  ...curated,
  ...uniqueGeoapify,
];
  } catch (error) {
    console.error("Geoapify Error:", error);
    return [];
  }
}