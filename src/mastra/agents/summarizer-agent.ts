import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

export const weatherAgent = new Agent({
  name: "Text Summarizer",
  instructions: `
  You are a helpful summarization assistant.
  Summarize the user's input text clearly and concisely.
  Keep it under 3-4 sentences unless otherwise asked.
`,
  model: "google/gemini-2.5-flash",
  tools: {},
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db", // path is relative to the .mastra/output directory
    }),
  }),
});
