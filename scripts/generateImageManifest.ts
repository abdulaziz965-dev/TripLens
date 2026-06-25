import fs from "fs-extra";
import path from "path";

import { topAttractions } from "../src/data/topAttractions";
import { slugify } from "./utils/slug";

const manifest = [];

for (const city of Object.keys(topAttractions)) {
  const attractions = topAttractions[city];

  for (const attraction of attractions) {
    const slug = slugify(attraction.name);

   manifest.push({
  id: slug,
  city,
  name: attraction.name,
  slug,
  assetPath: `src/assets/places/${city}/${slug}.jpg`,
  downloaded: false,
  verified: false,
});
  }
}

fs.writeJsonSync(
  path.join(process.cwd(), "scripts", "image-manifest.json"),
  manifest,
  { spaces: 2 }
);

console.log(`✅ Generated ${manifest.length} image entries.`);