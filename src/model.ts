import {Model} from './types';

export interface OpenAIModelOptions {
  model: 'gpt-3.5-turbo' | 'gpt-4';
  apiKey: string;
}

export class OpenAIChatCompletionModel implements Model {
  public constructor(public options: OpenAIModelOptions) {}

  public predict(
    input: string
  ): Promise<{output: string; cost: {inputTokens: string; outputTokens: string}}> {
    throw new Error('Method not implemented.');
  }
}

export const GPT_3_5_TURBO = new OpenAIChatCompletionModel({
  model: 'gpt-3.5-turbo',
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const DEFAULT_MODEL = GPT_3_5_TURBO;
