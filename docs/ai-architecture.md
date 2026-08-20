# AI Architecture & Multi-Agent Orchestration

## 1. Provider-Agnostic AI Layer

The platform is designed with an extensible `AIProvider` interface:

```typescript
export interface AIProvider {
  name: string;
  generateText(prompt: string, options?: AIServiceOptions): Promise<string>;
  generateStructuredJSON<T = any>(prompt: string, schemaDescription?: string): Promise<T>;
  generateEmbedding(text: string): Promise<number[]>;
}
```

- **Production Provider**: `GeminiProvider` utilizing `@google/generative-ai` (`gemini-2.0-flash` & `text-embedding-004`).
- **Offline / Development Provider**: `MockDevProvider` with zero-credential fallback.

## 2. Multi-Agent System
- **ProductAgent**: Evaluates candidate product technical specs against tender mandates and generates Form-4 deviation remarks.
- **TenderAgent**: Processes 345+ page multi-volume RFPs (GeM + ATC + BoQ) and extracts 14 statutory fields with `{ pageNumber, section, clauseNo, snippet }` citations.
- **CompetitorAgent**: Synthesizes market SWOT matrix and competitive price comparisons.
- **VendorAgent**: Drafts formal B2B Procurement RFQ letters and evaluates vendor compliance scores.
- **AIOrchestrator**: Routes user queries from `AIChatbotWidget.jsx` to the appropriate specialized agent.
