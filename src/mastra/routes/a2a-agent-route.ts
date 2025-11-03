import { registerApiRoute } from "@mastra/core/server";
import { randomUUID } from "crypto";

/**
 * Custom A2A (Agent-to-Agent) API Route
 *
 * This route wraps Mastra agent responses in A2A protocol format
 * following JSON-RPC 2.0 specification with proper artifacts structure.
 *
 * It expects an A2A message with:
 * - parts[0] (text): The user's query/system summary.
 * - parts[1] (data): The conversation history (last 20 messages).
 */
export const a2aAgentRoute = registerApiRoute("/a2a/agent/:agentId", {
  method: "POST",
  handler: async (c) => {
    const mastra = c.get("mastra");
    let requestId: string | null = null;

    try {
      const agentId = c.req.param("agentId");

      const body = await c.req.json();
      const { jsonrpc, id, method, params } = body;
      requestId = id || null;

      if (jsonrpc !== "2.0" || !requestId) {
        return c.json(
          {
            jsonrpc: "2.0",
            id: requestId,
            error: {
              code: -32600,
              message:
                'Invalid Request: jsonrpc must be "2.0" and id is required',
            },
          },
          400
        );
      }

      const agent = mastra.getAgent(agentId);
      if (!agent) {
        return c.json(
          {
            jsonrpc: "2.0",
            id: requestId,
            error: {
              code: -32602,
              message: `Agent '${agentId}' not found`,
            },
          },
          404
        );
      }

      const { message, contextId, taskId, metadata, configuration } =
        params || {};

      if (
        !message ||
        !message.parts ||
        !Array.isArray(message.parts) ||
        message.parts.length < 2
      ) {
        return c.json(
          {
            jsonrpc: "2.0",
            id: requestId,
            error: {
              code: -32602,
              message:
                "Invalid params: message must have at least two parts (text and data)",
            },
          },
          400
        );
      }

      const textPart = message.parts[0];
      const dataPart = message.parts[1];

      if (textPart.kind !== "text" || dataPart.kind !== "data") {
        return c.json(
          {
            jsonrpc: "2.0",
            id: requestId,
            error: {
              code: -32602,
              message:
                'Invalid params: message.parts[0] must be "text" and message.parts[1] must be "data"',
            },
          },
          400
        );
      }

      const historyMessages: any[] = dataPart.data || [];
      const currentUserMessage = {
        role: "user",
        parts: [{ kind: "text", text: textPart.text }],
      };

      const mastraMessages = [...historyMessages, currentUserMessage];

      const response = await agent.generate(mastraMessages);

      const agentText = response.text || "";
      const conversationContext = contextId || randomUUID();
      const currentTaskId = taskId || randomUUID();
      const messageMetadata = metadata || message.metadata;

      const artifacts = [
        {
          artifactId: randomUUID(),
          name: `${agentId}TextResponse`,
          parts: [
            {
              kind: "text",
              text: agentText,
            },
          ],
        },
      ];

      if (response.toolResults && response.toolResults.length > 0) {
        artifacts.push({
          artifactId: randomUUID(),
          name: "ToolResults",
          // @ts-expect-error We expect toolResults to be serializable
          parts: response.toolResults.map((result: any) => ({
            kind: "data",
            data: result,
          })),
        });
      }

      const responseMessageId = randomUUID();
      const history = [
        ...historyMessages.map((msg: any) => ({
          kind: "message",
          role: msg.role,
          parts: msg.parts,
          messageId: msg.messageId || randomUUID(),
          taskId: msg.taskId || currentTaskId,
          metadata: msg.metadata || messageMetadata,
        })),
        {
          kind: "message",
          role: currentUserMessage.role,
          parts: currentUserMessage.parts,
          messageId: message.messageId || randomUUID(),
          taskId: currentTaskId,
          metadata: messageMetadata,
        },
        {
          kind: "message",
          role: "agent",
          parts: [
            {
              kind: "text",
              text: agentText,
            },
          ],
          messageId: responseMessageId,
          taskId: currentTaskId,
          metadata: messageMetadata,
        },
      ];

      const a2aResponse = {
        jsonrpc: "2.0",
        id: requestId,
        result: {
          id: currentTaskId,
          contextId: conversationContext,
          status: {
            state: "completed",
            timestamp: new Date().toISOString(),
            message: {
              messageId: responseMessageId,
              role: "agent",
              parts: [
                {
                  kind: "text",
                  text: agentText,
                },
              ],
              kind: "message",
            },
          },
          artifacts,
          history,
          kind: "task",
        },
      };

      // Handle non-blocking/webhook
      if (
        configuration?.blocking === false &&
        configuration?.pushNotificationConfig?.url
      ) {
        // TODO: Implement async processing with webhook callback
        console.log(
          "Non-blocking request with webhook:",
          configuration.pushNotificationConfig.url
        );
      }

      return c.json(a2aResponse);
    } catch (error: any) {
      console.error("A2A Agent Route Error:", error);
      return c.json(
        {
          jsonrpc: "2.0",
          id: requestId || null,
          error: {
            code: -32603,
            message: "Internal error",
            data: {
              details: error.message,
              stack: error.stack,
            },
          },
        },
        500
      );
    }
  },
});
