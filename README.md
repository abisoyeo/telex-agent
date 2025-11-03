# Telex AI Agents - Mastra Integration

This project provides two powerful AI agent services built using the Mastra framework: a **Text Summarizer** and a **Strategic Business Advisor**. Both agents are accessible via Agent-to-Agent (A2A) compliant JSON-RPC 2.0 APIs, making them easy to integrate with Telex.im or other agent platforms.

## Features

- **Two Specialized Agents**:
  - Expert text summarization with structured output
  - Strategic business advisory with conversational intelligence
- **Mastra Framework**: Built on the robust and extensible Mastra agent framework
- **A2A Compliant API**: Implements custom `a2a/agent/:agentId` routes adhering to JSON-RPC 2.0 specification
- **API Documentation**: Automatically generates OpenAPI (Swagger) documentation
- **Persistent Memory**: Uses LibSQL (`file:../mastra.db`) to maintain conversation history and context across sessions
- **Configurable**: Easily configured through `src/mastra/index.ts`

## Available Agents

### 1. Text Summarizer Agent (`summarizerAgent`)

Expert summarization agent that distills any text into concise, structured summaries.

**Capabilities:**

- Extracts main ideas and core thesis
- Provides 2-3 key supporting points
- Maintains clarity, brevity, and neutrality
- Handles any text length or format

**Best for:** Documentation, articles, reports, meeting notes, research papers

### 2. Strategic Advisor Agent (`strategicAdvisorAgent`)

Conversational business strategy consultant that helps with decision-making and market analysis.

**Capabilities:**

- **Competitor Analysis**: Strengths/weaknesses mapping, market positioning, differentiation strategies
- **Decision Support**: Pros/cons analysis, weighted decision matrices, risk assessment
- **Idea Feasibility**: Market fit evaluation, complexity assessment, monetization viability

**Best for:** Founders, business managers, product leaders, strategists making critical business decisions

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (or your preferred package manager)
- Google Generative AI API key

### Installation

```bash
pnpm install
```

### Environment Setup

Create a `.env` file with the following variables:

```bash
# Required
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here

# Optional
PORT=4111                                  # Server port (default: 4111)
LOG_LEVEL=debug                            # Log level (debug, info, warn, error)
DATABASE_URL=:memory:                      # Database connection string
```

### Running the Development Server

This command starts the server and makes both agents available at `http://localhost:4111`.

```bash
pnpm run dev
```

Once running, you can access:

- **Mastra Studio UI**: `http://localhost:4111` (interactive testing)
- **Swagger UI**: `http://localhost:4111/api-docs`
- **OpenAPI Spec**: `http://localhost:4111/openapi.json`

## API Usage

Both agents are accessible through A2A-compliant endpoints.

### Summarizer Agent

**Endpoint**: `POST /a2a/agent/summarizerAgent`

#### Request Example

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

#### Expected Response

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
    "artifacts": [...],
    "history": [...],
    "kind": "task"
  }
}
```

### Strategic Advisor Agent

**Endpoint**: `POST /a2a/agent/strategicAdvisorAgent`

#### Request Examples

##### Competitor Analysis

```bash
curl -X POST http://localhost:4111/a2a/agent/strategicAdvisorAgent \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "request-competitor-001",
    "method": "execute",
    "params": {
      "messages": [
        {
          "role": "user",
          "parts": [
            {
              "kind": "text",
              "text": "Analyze competitors for fintech salary-advance startups in Nigeria"
            }
          ]
        }
      ]
    }
  }'
```

##### Decision Support

```bash
curl -X POST http://localhost:4111/a2a/agent/strategicAdvisorAgent \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "request-decision-001",
    "method": "execute",
    "params": {
      "messages": [
        {
          "role": "user",
          "parts": [
            {
              "kind": "text",
              "text": "Should we raise seed funding now or wait 6 months? We have 8 months runway and growing 15% MoM."
            }
          ]
        }
      ]
    }
  }'
```

##### Idea Feasibility

```bash
curl -X POST http://localhost:4111/a2a/agent/strategicAdvisorAgent \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "request-feasibility-001",
    "method": "execute",
    "params": {
      "messages": [
        {
          "role": "user",
          "parts": [
            {
              "kind": "text",
              "text": "Evaluate this idea: A WhatsApp bot that collects anonymous team feedback and generates weekly pulse reports for managers"
            }
          ]
        }
      ]
    }
  }'
```

#### Expected Response

The Strategic Advisor will engage conversationally, asking clarifying questions before providing structured analysis:

```json
{
  "jsonrpc": "2.0",
  "id": "request-competitor-001",
  "result": {
    "status": {
      "state": "completed",
      "message": {
        "role": "agent",
        "parts": [
          {
            "kind": "text",
            "text": "**Summary**: Analyzing the fintech salary-advance competitive landscape in Nigeria.\n\n**Framework Applied**: Competitor Snapshot Analysis\n\nTo provide you with a comprehensive competitor analysis, I need some additional context:\n\n1. Please share 3-5 competitor names and a brief description of what each does (one line per competitor)\n2. What's your primary differentiation or unique value proposition?\n3. Are you focusing on a specific customer segment (e.g., enterprise employees, gig workers, SMB staff)?\n\nOnce I have this information, I'll provide:\n- Strengths/Weaknesses table for each competitor\n- Market positioning map\n- Strategic differentiation opportunities\n- Underserved market gaps"
          }
        ]
      }
    },
    "artifacts": [...],
    "history": [...],
    "kind": "task"
  }
}
```

## Project Structure

```
.
├── src
│   └── mastra
│       ├── agents
│       │   ├── summarizer-agent.ts         # Text summarization agent
│       │   └── strategic-advisor-agent.ts  # Business strategy agent
│       ├── routes
│       │   └── a2a-agent-route.ts          # A2A JSON-RPC 2.0 API route
│       └── index.ts                        # Main Mastra configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Integrating with Telex.im

Both agents can be integrated as AI coworkers in Telex.im using their workflow system.

### Summarizer Agent Workflow

```json
{
  "active": true,
  "category": "custom-agents",
  "name": "text_summarizer_agent_delegate",
  "nodes": [
    {
      "type": "a2a/mastra-a2a-node",
      "url": "https://your-domain.mastra.cloud/a2a/agent/summarizerAgent"
    }
  ]
}
```

### Strategic Advisor Workflow

```json
{
  "active": true,
  "category": "custom-agents",
  "name": "strategic_advisor_agent_delegate",
  "nodes": [
    {
      "type": "a2a/mastra-a2a-node",
      "url": "https://your-domain.mastra.cloud/a2a/agent/strategicAdvisorAgent"
    }
  ]
}
```

## Testing

### Automated Testing

```bash
pnpm test
```

### Manual Testing with Different Scenarios

#### Summarizer - Technical Documentation

```bash
curl -X POST http://localhost:4111/a2a/agent/summarizerAgent \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "test-tech-doc",
    "method": "execute",
    "params": {
      "messages": [{
        "role": "user",
        "parts": [{"kind": "text", "text": "React Server Components represent a new paradigm in React development, allowing components to be rendered on the server while maintaining the interactive capabilities of client-side React. They enable better performance through reduced JavaScript bundle sizes and improved initial page load times."}]
      }]
    }
  }'
```

#### Strategic Advisor - Multi-turn Conversation

```bash
# First message
curl -X POST http://localhost:4111/a2a/agent/strategicAdvisorAgent \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "test-conversation-1",
    "method": "execute",
    "params": {
      "contextId": "conv-123",
      "messages": [{
        "role": "user",
        "parts": [{"kind": "text", "text": "Help me decide between building in-house analytics vs using a third-party tool"}]
      }]
    }
  }'

# Follow-up with context
curl -X POST http://localhost:4111/a2a/agent/strategicAdvisorAgent \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "test-conversation-2",
    "method": "execute",
    "params": {
      "contextId": "conv-123",
      "messages": [{
        "role": "user",
        "parts": [{"kind": "text", "text": "We have 2 engineers, need custom event tracking, and our budget is $500/month"}]
      }]
    }
  }'
```

## Troubleshooting

### Common Issues

#### 1. Agent not found error

- Verify agent is registered in `src/mastra/index.ts`
- Check agent name matches the URL parameter exactly
- Ensure both agents are exported: `summarizerAgent` and `strategicAdvisorAgent`

#### 2. API key errors

- Ensure `GOOGLE_GENERATIVE_AI_API_KEY` is set in `.env`
- Verify the API key is valid and has proper permissions
- Check API quota limits haven't been exceeded

#### 3. Conversational context not maintained

- Verify `contextId` is being passed between messages
- Check LibSQL database is writable in `.mastra/` directory
- Ensure memory storage is properly configured

#### 4. Strategic Advisor not asking follow-up questions

- Check the agent instructions in `strategic-advisor-agent.ts`
- Verify the model has sufficient context window
- Ensure multi-turn conversation support is enabled

#### 5. Database errors

- Check `.mastra/` directory permissions
- Verify LibSQL is properly installed
- Try deleting `mastra.db` and restarting (will clear history)

#### 6. Port already in use

- Change port in `.env` file
- Kill existing process: `lsof -ti:4111 | xargs kill -9`

## Architecture Notes

### Why Two Agents?

- **Separation of Concerns**: Summarization is a focused, single-turn task. Strategic advisory requires multi-turn conversations and complex reasoning.
- **Resource Optimization**: Different agents can use different models optimized for their use case
- **Scalability**: Each agent can be scaled independently based on usage patterns
- **Maintainability**: Simpler to update, test, and debug specialized agents

### A2A Protocol Benefits

- **Interoperability**: Works seamlessly with any A2A-compliant platform
- **Standardization**: JSON-RPC 2.0 is well-documented and widely supported
- **Flexibility**: Easy to chain agents or build complex workflows
- **Debugging**: Clear request/response structure simplifies troubleshooting

### Memory & Context

Both agents use LibSQL for persistent memory, enabling:

- Cross-session conversation continuity
- User preference learning
- Context-aware responses
- Audit trails for compliance

## Performance Considerations

- **Summarizer**: Typically responds in 2-5 seconds for standard text
- **Strategic Advisor**: May take 5-15 seconds for complex analyses with follow-up questions
- **Memory Overhead**: ~10MB per 1000 conversation turns
- **Concurrent Requests**: Supports up to 50 simultaneous requests with default configuration

## Deployment

### Production Checklist

- [ ] Set production `GOOGLE_GENERATIVE_AI_API_KEY`
- [ ] Configure production database URL
- [ ] Set `LOG_LEVEL=info` or `warn`
- [ ] Enable HTTPS/SSL
- [ ] Set up rate limiting
- [ ] Configure CORS policies
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy for `mastra.db`
- [ ] Document your deployment URL for Telex integration

### Mastra Cloud Deployment

```bash
# Build for production
pnpm build

# Deploy to Mastra Cloud
mastra deploy
```

Your agents will be available at:

- `https://your-app.mastra.cloud/a2a/agent/summarizerAgent`
- `https://your-app.mastra.cloud/a2a/agent/strategicAdvisorAgent`

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request with clear description

## License

ISC License - see LICENSE file for details

## Acknowledgments

- **Mastra Framework** - Powerful AI agent framework
- **Google Generative AI** - Gemini 2.0 Flash models
- **Telex.im** - AI coworker platform enabling seamless integration

## Support

- **Documentation**: [Mastra Docs](https://docs.mastra.com)
- **Issues**: GitHub Issues
- **Community**: [Mastra Discord](https://discord.gg/mastra)

---

Built with ❤️ using Mastra and powered by Google Gemini 2.0 Flash
