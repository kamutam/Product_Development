export interface AIServiceOptions {
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json';
}

export interface AIProvider {
  name: string;
  generateText(prompt: string, options?: AIServiceOptions): Promise<string>;
  generateStructuredJSON<T = any>(prompt: string, schemaDescription?: string): Promise<T>;
  generateEmbedding(text: string): Promise<number[]>;
}
