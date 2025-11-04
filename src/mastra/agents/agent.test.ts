import { it, expect, describe } from "vitest";
import { summarizerAgent } from "./summarizer-agent";
import { strategicAdvisorAgent } from "./strategic-advisor-agent";

describe("Summarizer Agent", () => {
  it("should be defined and have correct configuration", () => {
    expect(summarizerAgent).toBeDefined();
    expect(summarizerAgent.name).toBe("Text Summarizer");
    expect(summarizerAgent.model).toBe("google/gemini-2.5-flash");
  });

  it("should summarize a simple text", async () => {
    const testText =
      "The James Webb Space Telescope (JWST) is a space telescope designed primarily to conduct infrared astronomy. " +
      "As the largest optical telescope in space, its high resolution and sensitivity allow it to view objects too old, " +
      "distant, or faint for the Hubble Space Telescope. This enables investigations across many fields of astronomy and cosmology.";

    const response = await summarizerAgent.generate([
      {
        role: "user",
        content: testText,
      },
    ]);

    expect(response).toBeDefined();
    expect(response.text).toBeDefined();
    expect(response.text).toContain("Main Idea:");
    expect(response.text).toContain("Key Points:");
  });

  it("should handle short text appropriately", async () => {
    const shortText = "AI agents are transforming how we work.";

    const response = await summarizerAgent.generate([
      {
        role: "user",
        content: shortText,
      },
    ]);

    expect(response).toBeDefined();
    expect(response.text).toBeDefined();
    expect(response.text.length).toBeGreaterThan(0);
  });

  it("should maintain conversation context with memory", async () => {
    const resourceId = "test-user-123";
    const threadId = "test-thread-summarizer";

    // First message
    const firstResponse = await summarizerAgent.generate(
      [
        {
          role: "user",
          content:
            "Summarize this: React is a JavaScript library for building user interfaces.",
        },
      ],
      {
        resourceId,
        threadId,
      }
    );

    expect(firstResponse.text).toBeDefined();

    // Second message in same context
    const secondResponse = await summarizerAgent.generate(
      [
        {
          role: "user",
          content: "Can you make it shorter?",
        },
      ],
      {
        resourceId,
        threadId,
      }
    );

    expect(secondResponse.text).toBeDefined();
    // Agent should understand "it" refers to previous summary
    expect(secondResponse.text.length).toBeGreaterThan(0);
  });
});

describe("Strategic Advisor Agent", () => {
  it("should be defined and have correct configuration", () => {
    expect(strategicAdvisorAgent).toBeDefined();
    expect(strategicAdvisorAgent.name).toBe("Strategic Advisor");
    expect(strategicAdvisorAgent.model).toBe("google/gemini-2.5-flash");
  });

  it("should respond to competitor analysis request", async () => {
    const response = await strategicAdvisorAgent.generate([
      {
        role: "user",
        content: "Analyze competitors for fintech startups in Nigeria",
      },
    ]);

    expect(response).toBeDefined();
    expect(response.text).toBeDefined();
    // Should ask clarifying questions
    expect(
      response.text.toLowerCase().includes("competitor") ||
        response.text.includes("?")
    ).toBe(true);
  });

  it("should respond to decision support request", async () => {
    const response = await strategicAdvisorAgent.generate([
      {
        role: "user",
        content: "Should we raise seed funding now or wait 6 months?",
      },
    ]);

    expect(response).toBeDefined();
    expect(response.text).toBeDefined();
    // Should ask about priorities or factors
    expect(
      response.text.toLowerCase().includes("factor") ||
        response.text.toLowerCase().includes("matter") ||
        response.text.includes("?")
    ).toBe(true);
  });

  it("should respond to idea feasibility request", async () => {
    const response = await strategicAdvisorAgent.generate([
      {
        role: "user",
        content: "Evaluate this idea: A WhatsApp bot for team feedback",
      },
    ]);

    expect(response).toBeDefined();
    expect(response.text).toBeDefined();
    // Should ask discovery questions
    expect(
      response.text.toLowerCase().includes("customer") ||
        response.text.toLowerCase().includes("target") ||
        response.text.includes("?")
    ).toBe(true);
  });

  it("should maintain multi-turn conversation context", async () => {
    const resourceId = "test-user-456";
    const threadId = "test-thread-advisor";

    // First message - ask about decision
    const firstResponse = await strategicAdvisorAgent.generate(
      [
        {
          role: "user",
          content:
            "Help me decide: should I build in-house analytics or use a third-party tool?",
        },
      ],
      {
        resourceId,
        threadId,
      }
    );

    expect(firstResponse.text).toBeDefined();

    // Second message - provide context (don't pass messages array, memory handles history)
    const secondResponse = await strategicAdvisorAgent.generate(
      [
        {
          role: "user",
          content:
            "We have 2 engineers, need custom event tracking, budget is $500/month",
        },
      ],
      {
        resourceId,
        threadId,
      }
    );

    expect(secondResponse.text).toBeDefined();
    // Should reference the decision from first message
    expect(secondResponse.text.length).toBeGreaterThan(50);
  });

  it("should handle different capability requests in same conversation", async () => {
    const resourceId = "test-user-789";
    const threadId = "test-thread-multi-capability";

    // Competitor analysis
    const competitorResponse = await strategicAdvisorAgent.generate(
      [
        {
          role: "user",
          content: "What are key differentiators for SaaS products?",
        },
      ],
      {
        resourceId,
        threadId,
      }
    );

    expect(competitorResponse.text).toBeDefined();

    // Idea feasibility in same context
    const feasibilityResponse = await strategicAdvisorAgent.generate(
      [
        {
          role: "user",
          content: "Is it feasible to build a no-code tool for this?",
        },
      ],
      {
        resourceId,
        threadId,
      }
    );

    expect(feasibilityResponse.text).toBeDefined();
  });
});

describe("Agent Integration", () => {
  it("both agents should use the same model", () => {
    expect(summarizerAgent.model).toBe(strategicAdvisorAgent.model);
  });

  it("agents should handle empty input gracefully", async () => {
    const response = await summarizerAgent.generate([
      {
        role: "user",
        content: " ", // whitespace
      },
    ]);

    // Should still return a response
    expect(response).toBeDefined();
    expect(response.text).toBeDefined();
  });

  it.skip("should handle very long text", async () => {
    // Skipped due to rate limits on free tier
    // Enable when using paid API

    const longText = "Lorem ipsum dolor sit amet. ".repeat(500); // ~14,000 characters

    const response = await summarizerAgent.generate([
      {
        role: "user",
        content: longText,
      },
    ]);

    expect(response).toBeDefined();
    expect(response.text).toBeDefined();
    // Summary should be much shorter than input
    expect(response.text.length).toBeLessThan(longText.length / 2);
  });
});
