# Telex Summarizer Agent

This project provides a powerful text summarization service built using the Mastra framework. It exposes a `summarizerAgent` that leverages Google's Gemini models to distill text into a concise summary, including a main idea and key points.

The service is accessible via an Agent-to-Agent (A2A) compliant JSON-RPC 2.0 API, making it easy to integrate with other agents or services.

## Features

- **Expert Summarization**: The agent is specifically prompted to provide high-quality summaries with a core thesis and supporting bullet points.
- **Mastra Framework**: Built on the robust and extensible Mastra agent framework.
- **A2A Compliant API**: Implements a custom `a2a/agent/:agentId` route that adheres to the JSON-RPC 2.0 specification for seamless agent interoperability.
- **API Documentation**: Automatically generates OpenAPI (Swagger) documentation for the API.
- **Persistent Memory**: Uses LibSQL (`file:../mastra.db`) to maintain conversation history and context across sessions.
- **Configurable**: Easily configured through `src/mastra/index.ts`.

## Getting Started

### Prerequisites

- Node.js
- pnpm (or your preferred package manager)

### Installation

```bash
pnpm install
```

### Running the Development Server

This command starts the server and makes the API available at `http://localhost:4111`.

```bash
pnpm run dev
```

Once running, you can access the Mastra Studio UI to test your agent interactively at `http://localhost:4111`.

## API Usage

The primary way to interact with the summarizer is through the A2A endpoint.

**Endpoint**: `POST /a2a/agent/summarizerAgent`

The `agentId` for the summarizer is `summarizerAgent`.

### Request Example

You can send a text to be summarized using a `curl` command. The following example uses the simplified `execute` method for testing.

```bash
curl -X POST http://localhost:4111/a2a/agent/summarizerAgent \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "request-summarize-001",
    "method": "execute",
    "params": {
      "messages": [
        {
          "role": "user",
          "parts": [
            {
              "kind": "text",
              "text": "The James Webb Space Telescope (JWST) is a space telescope designed primarily to conduct infrared astronomy. As the largest optical telescope in space, its high resolution and sensitivity allow it to view objects too old, distant, or faint for the Hubble Space Telescope. This enables investigations across many fields of astronomy and cosmology, such as observation of the first stars and the formation of the first galaxies, and detailed atmospheric characterization of potentially habitable exoplanets."
            }
          ]
        }
      ]
    }
  }'
```

### Expected Response

The API will return a JSON-RPC 2.0 response containing the summary in the `artifacts` and `history`.

```json
{
  "jsonrpc": "2.0",
  "id": "request-summarize-001",
  "result": {
    "id": "db84ba2b62a0422e968d56591b9bb01a",
    "contextId": "7bc5199a-30ae-47ea-8e6c-d2c833046709",
    "status": {
      "state": "completed",
      "timestamp": "2025-10-23T14:49:26.945Z",
      "message": {
        "messageId": "d8204b25-c6f8-41fb-8440-c41770afe5ec",
        "role": "agent",
        "parts": [
          {
            "kind": "text",
            "text": "Main Idea: The James Webb Space Telescope is a powerful infrared space telescope that allows astronomers to observe ancient and distant cosmic objects beyond the reach of the Hubble.\n\nKey Points:\n- It is the largest optical telescope in space, offering superior resolution and sensitivity.\n- Its capabilities enable the study of the first stars, early galaxy formation, and the atmospheres of exoplanets."
          }
        ],
        "kind": "message"
      }
    },
    "artifacts": [
      {
        "artifactId": "c5e0382f-b57f-4da7-87d8-b85171fad17c",
        "name": "summarizerAgentResponse",
        "parts": [
          {
            "kind": "text",
            "text": "Main Idea: The James Webb Space Telescope is a powerful infrared space telescope that allows astronomers to observe ancient and distant cosmic objects beyond the reach of the Hubble.\n\nKey Points:\n- It is the largest optical telescope in space, offering superior resolution and sensitivity.\n- Its capabilities enable the study of the first stars, early galaxy formation, and the atmospheres of exoplanets."
          }
        ]
      }
    ],
    "history": [
      {
        "kind": "message",
        "role": "user",
        "parts": [
          {
            "kind": "text",
            "text": "The James Webb Space Telescope (JWST) is a space telescope designed primarily to conduct infrared astronomy. As the largest optical telescope in space, its high resolution and sensitivity allow it to view objects too old, distant, or faint for the Hubble Space Telescope. This enables investigations across many fields of astronomy and cosmology, such as observation of the first stars and the formation of the first galaxies, and detailed atmospheric characterization of potentially habitable exoplanets."
          }
        ],
        "messageId": "msg-001",
        "taskId": "db84ba2b62a0422e968d56591b9bb01a"
      },
      {
        "kind": "message",
        "role": "agent",
        "parts": [
          {
            "kind": "text",
            "text": "Main Idea: The James Webb Space Telescope is a powerful infrared space telescope that allows astronomers to observe ancient and distant cosmic objects beyond the reach of the Hubble.\n\nKey Points:\n- It is the largest optical telescope in space, offering superior resolution and sensitivity.\n- Its capabilities enable the study of the first stars, early galaxy formation, and the atmospheres of exoplanets."
          }
        ],
        "messageId": "d8204b25-c6f8-41fb-8440-c41770afe5ec",
        "taskId": "db84ba2b62a0422e968d56591b9bb01a"
      }
    ],
    "kind": "task"
  }
}
```

_(Note: The actual summary text may vary slightly based on the model's output.)_

## Project Structure

A brief overview of the important files and directories.

```
.
├── src
│   └── mastra
│       ├── agents
│       │   └── summarizer-agent.ts   # Defines the core summarizer agent logic and prompts.
│       ├── routes
│       │   └── a2a-agent-route.ts    # The A2A JSON-RPC 2.0 API route wrapper.
│       └── index.ts                  # Main Mastra application configuration and entry point.
├── package.json
└── tsconfig.json
```

# Environment Variables & API Documentation

## Environment Variables

Create a `.env` file with the following variables:

```bash
# Required
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here

# Optional
PORT=4111                                  # Server port (default: 4111)
LOG_LEVEL=debug                            # Log level (debug, info, warn, error)
DATABASE_URL=:memory:                      # Database connection string
```

## API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI:** `http://localhost:4111/api-docs`
- **OpenAPI Spec:** `http://localhost:4111/openapi.json`

The Swagger UI provides:

- Complete API endpoint documentation
- Request/response schemas
- Interactive API testing
- Example requests and responses

## Testing

### Manual Testing

Test the summarizer agent with various queries:

#### Simple Summarization

```bash
curl -X POST http://localhost:4111/a2a/agent/summarizerAgent \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "test-1",
    "method": "execute",
    "params": {
      "messages": [
        {
          "role": "user",
          "parts": [{"kind": "text", "text": "Summarize the article about climate change and its global impact."}]
        }
      ]
    }
  }'
```

#### Non-English Summarization

```bash
curl -X POST http://localhost:4111/a2a/agent/summarizerAgent \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "test-2",
    "method": "execute",
    "params": {
      "messages": [
        {
          "role": "user",
          "parts": [{"kind": "text", "text": "Résume cet article sur les effets du changement climatique."}]
        }
      ]
    }
  }'
```

## Troubleshooting

### Common Issues

#### 1. Agent not found error

- Verify agent is registered in `src/mastra/index.ts`
- Check agent name matches the URL parameter

#### 2. API key errors

- Ensure `GOOGLE_GENERATIVE_AI_API_KEY` is set in `.env`
- Verify the API key is valid and has proper permissions

#### 3. Summarization not returning results

- Check internet connection
- Ensure Mastra agent endpoint is accessible
- Review prompt and input format

#### 4. Database errors

- Check `.mastra/` directory permissions
- Verify LibSQL is properly installed

#### 5. Port already in use

- Change port in `.env` file
- Kill existing process on port 4111

## License

ISC License - see LICENSE file for details

## Acknowledgments

- **Mastra Framework** - AI agent framework
- **Google Generative AI** - Gemini models

Built with Mastra and powered by Google Gemini 2.0 Flash
