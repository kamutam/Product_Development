import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider, AIServiceOptions } from './aiProvider';
import { env } from '../../config/env';
import { logger } from '../../config/logger';

export class GeminiProvider implements AIProvider {
  name = 'Google Gemini 2.0 Flash';
  private genAI: GoogleGenerativeAI | null = null;
  private modelName: string;

  constructor(apiKey?: string, modelName?: string) {
    const key = apiKey || env.AI_API_KEY;
    this.modelName = modelName || env.AI_MODEL || 'gemini-2.0-flash';
    if (key) {
      this.genAI = new GoogleGenerativeAI(key);
    }
  }

  async generateText(prompt: string, options?: AIServiceOptions): Promise<string> {
    if (!this.genAI) {
      throw new Error('Gemini API key is not configured.');
    }
    const model = this.genAI.getGenerativeModel({ model: this.modelName });
    const response = await model.generateContent(prompt);
    return response.response.text();
  }

  async generateStructuredJSON<T = any>(prompt: string, schemaDescription?: string): Promise<T> {
    if (!this.genAI) {
      throw new Error('Gemini API key is not configured.');
    }
    const systemPrompt = `${prompt}\n\nIMPORTANT: Return strictly valid JSON adhering to the requirement. Do NOT enclose in markdown backticks or commentary.\n${schemaDescription ? `Schema: ${schemaDescription}` : ''}`;
    const raw = await this.generateText(systemPrompt);
    const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.genAI) {
      return new Array(768).fill(0).map(() => Math.random());
    }
    try {
      const model = this.genAI.getGenerativeModel({ model: env.EMBEDDING_MODEL || 'text-embedding-004' });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (e: any) {
      logger.warn(`Embedding generation fallback: ${e.message}`);
      return new Array(768).fill(0).map(() => Math.random());
    }
  }
}
