# A2A Agent Route Usage Example

## Overview
This custom route wraps your Mastra agents with the A2A (Agent-to-Agent) protocol format, producing valid JSON-RPC 2.0 responses with proper artifacts structure.

## Endpoint
```
POST /a2a/agent/:agentId
```

## Request Format

The route supports both A2A protocol formats:

### Format 1: A2A `message/send` (Recommended for A2A clients)
```json
{
  "jsonrpc": "2.0",
  "id": "75d53d9705054a60b1cb2d2d1887c242",
  "method": "message/send",
  "params": {
    "message": {
      "kind": "message",
      "role": "user",
      "parts": [
        {
          "kind": "text",
          "text": "Lagos"
        }
      ],
      "metadata": {
        "telex_user_id": "0192142c-02cc-7a41-b8bf-d0b7dc73d91b",
        "telex_channel_id": "019778c7-2eed-7546-8a03-a56f7faa8992",
        "org_id": "0192143b-1ab8-7a42-85eb-82b2dd86f08e"
      },
      "messageId": "db84ba2b62a0422e968d56591b9bb01a",
      "taskId": "db84ba2b62a0422e968d56591b9bb01a"
    },
    "configuration": {
      "acceptedOutputModes": [
        "text/plain",
        "image/png",
        "image/jpg"
      ],
      "pushNotificationConfig": {
        "url": "https://your-webhook.com/callback",
        "token": null,
        "authentication": {
          "schemes": ["TelexApiKey"],
          "credentials": "your-api-key"
        }
      },
      "blocking": true
    }
  }
}
```

### Format 2: Simple `execute` (Simplified for testing)
```json
{
  "jsonrpc": "2.0",
  "id": "28ced04f-6cd8-4a42-8764-6ae4f702a3ca",
  "method": "execute",
  "params": {
    "contextId": "7bc5199a-30ae-47ea-8e6c-d2c833046709",
    "taskId": "db84ba2b62a0422e968d56591b9bb01a",
    "messages": [
      {
        "role": "user",
        "parts": [
          {
            "kind": "text",
            "text": "Lagos"
          }
        ],
        "messageId": "msg-001",
        "metadata": {
          "telex_user_id": "0192142c-02cc-7a41-b8bf-d0b7dc73d91b",
          "telex_channel_id": "019778c7-2eed-7546-8a03-a56f7faa8992",
          "org_id": "0192143b-1ab8-7a42-85eb-82b2dd86f08e"
        }
      }
    ]
  }
}
```

## Response Format

### Successful Response
```json
{
  "jsonrpc": "2.0",
  "id": "28ced04f-6cd8-4a42-8764-6ae4f702a3ca",
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
            "text": "The current weather in Lagos is thunderstorm..."
          }
        ],
        "kind": "message"
      }
    },
    "artifacts": [
      {
        "artifactId": "c5e0382f-b57f-4da7-87d8-b85171fad17c",
        "name": "weatherAgentResponse",
        "parts": [
          {
            "kind": "text",
            "text": "The current weather in Lagos is thunderstorm..."
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
            "text": "Lagos"
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
            "text": "The current weather in Lagos is thunderstorm..."
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

## Usage Examples

### Using A2A message/send format (Standard)
```bash
curl -X POST http://localhost:4111/a2a/agent/weatherAgent \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "request-001",
    "method": "message/send",
    "params": {
      "message": {
        "kind": "message",
        "role": "user",
        "parts": [
          {
            "kind": "text",
            "text": "Lagos"
          }
        ],
        "messageId": "msg-001",
        "taskId": "task-001"
      },
      "configuration": {
        "blocking": true
      }
    }
  }'
```

### Using simplified execute format (Testing)
```bash
curl -X POST http://localhost:4111/a2a/agent/weatherAgent \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "request-001",
    "method": "execute",
    "params": {
      "messages": [
        {
          "role": "user",
          "parts": [
            {
              "kind": "text",
              "text": "What is the weather in New York?"
            }
          ]
        }
      ]
    }
  }'
```

### Multi-turn Conversation
```bash
curl -X POST http://localhost:4111/a2a/agent/weatherAgent \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "request-002",
    "method": "execute",
    "params": {
      "contextId": "existing-context-id",
      "taskId": "existing-task-id",
      "messages": [
        {
          "role": "user",
          "parts": [
            {
              "kind": "text",
              "text": "What about tomorrow?"
            }
          ]
        }
      ]
    }
  }'
```

## Key Features

### 1. **Proper Artifacts Structure**
The route automatically wraps agent responses in the `artifacts` array with:
- Unique `artifactId` for each artifact
- Descriptive `name` field
- Proper `parts` array with `kind` and content

### 2. **History Management**
- Prevents duplicate messages (generates unique IDs)
- Maintains conversation context
- Includes both user and agent messages

### 3. **JSON-RPC 2.0 Compliance**
- Validates `jsonrpc: "2.0"` field
- Requires `id` field matching
- Proper error responses with standard error codes

### 4. **Tool Results as Artifacts**
If your agent uses tools, their results are automatically included as separate data artifacts:
```json
{
  "artifactId": "tool-results-uuid",
  "name": "ToolResults",
  "parts": [
    {
      "kind": "data",
      "data": {
        "temperature": 29.1,
        "location": "Lagos"
      }
    }
  ]
}
```

## Error Responses

### Invalid Request
```json
{
  "jsonrpc": "2.0",
  "id": "request-001",
  "error": {
    "code": -32600,
    "message": "Invalid Request: jsonrpc must be \"2.0\" and id is required"
  }
}
```

### Agent Not Found
```json
{
  "jsonrpc": "2.0",
  "id": "request-001",
  "error": {
    "code": -32602,
    "message": "Agent 'unknownAgent' not found"
  }
}
```

## What's Fixed

Compared to your original response:

1. ✅ **Empty artifacts array** - Now properly populated with agent output
2. ✅ **Duplicate messages in history** - Each message gets unique messageId
3. ✅ **Proper artifact structure** - Includes artifactId, name, and parts
4. ✅ **Tool results** - Automatically added as data artifacts

## Next Steps

1. Start your Mastra server: `pnpm run dev`
2. Test the endpoint with curl or Postman
3. Integrate with your A2A client application
4. Customize the route for your specific needs (add authentication, validation, etc.)
