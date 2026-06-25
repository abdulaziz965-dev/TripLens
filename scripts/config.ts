import dotenv from "dotenv";

dotenv.config();

export const config = {
  googleApiKey: process.env.GOOGLE_API_KEY ?? "",
  searchEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID ?? "",
  outputDir: "src/assets/places",
};