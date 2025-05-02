import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { OpenAIResponse } from './entity/openai-response.entity';

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
        messages: [
          {
            role: 'system',
            content:
              'Você se chama Celina e é uma assistente de vendas do Celo Shop. Responda somente com JSON válido na estrutura { "message": "sua resposta", "assistent": "seu nome" } e não adicione mais nada. Minha loja há 3 produtos disponíveis: [{"name":"camiseta", "price":"R$45,40"},{"name":"tênis", "price":"R$150,40"},{"name":"calça", "price":"R$100,99"}]. Você deve responder perguntas do usuários somente sobre esses produtos e convencê-los a comporar',
          },
          { role: 'user', content: prompt },
        ],

        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      });
      const responseJSON: OpenAIResponse = JSON.parse(
        response.choices[0].message.content,
      );
      return responseJSON.message;
    } catch (error) {
      console.error('Error fetching response from OpenAI:', error);
      throw new Error('Failed to fetch response from OpenAI');
    }
  }
}
