import { config } from "dotenv";
import path from "path";

// Load environment variables from .env file for tests
config({ path: path.resolve(__dirname, "../../.env") });

// Verify required environment variables
if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is required for tests");
}
