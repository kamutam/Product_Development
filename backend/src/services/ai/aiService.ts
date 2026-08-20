import { AIProvider } from './aiProvider';
import { GeminiProvider } from './geminiProvider';
import { MockDevProvider } from './mockProvider';
import { env } from '../../config/env';
import { logger } from '../../config/logger';

class CentralAIService {
  private provider: AIProvider;

  constructor() {
    if (env.AI_API_KEY && env.AI_API_KEY.trim() !== '') {
      this.provider = new GeminiProvider(env.AI_API_KEY, env.AI_MODEL);
      logger.info(`✓ AI Service initialized with Google Gemini (${env.AI_MODEL})`);
    } else {
      this.provider = new MockDevProvider();
      logger.info('✓ AI Service initialized with development fallback provider (no external key supplied)');
    }
  }

  setProvider(customProvider: AIProvider) {
    this.provider = customProvider;
  }

  async generateText(prompt: string): Promise<string> {
    return this.provider.generateText(prompt);
  }

  async structuredExtraction<T = any>(prompt: string, schemaDescription?: string): Promise<T> {
    return this.provider.generateStructuredJSON<T>(prompt, schemaDescription);
  }

  async generateEmbedding(text: string): Promise<number[]> {
    return this.provider.generateEmbedding(text);
  }
}

export const aiService = new CentralAIService();
