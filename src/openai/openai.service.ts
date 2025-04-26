import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private readonly openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({
      baseURL: process.env.OPENAI_API_BASE_URL,
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  async getAnswer(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error fetching response from OpenAI:', error);
      throw new Error('Failed to fetch response from OpenAI');
    }
  }
}
