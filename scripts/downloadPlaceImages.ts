import dotenv from "dotenv";
import { topAttractions } from "../src/data/topAttractions";
import { slugify } from "./utils/slug";
import { config } from "./config";
dotenv.config();

console.log("🚀 TripLens Image Downloader Started");
if (!config.googleApiKey) {
  throw new Error("Missing GOOGLE_API_KEY");
}

if (!config.searchEngineId) {
  throw new Error("Missing GOOGLE_SEARCH_ENGINE_ID");
}

console.log("✅ Configuration Loaded");

const cities = Object.keys(topAttractions);

console.log(`Found ${cities.length} destinations:\n`);

for (const city of cities) {
  console.log(`\n📍 ${city.toUpperCase()}`);

  const attractions = topAttractions[city];

  console.log(`Found ${attractions.length} attractions`);

  for (const attraction of attractions) {
    const slug = slugify(attraction.name);

console.log(
  `   • ${attraction.name} → ${slug}.jpg`
);
  }
}