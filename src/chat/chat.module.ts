import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { OpenaiModule } from 'src/openai/openai.module';

@Module({
  providers: [ChatGateway],
  imports: [OpenaiModule],
})
export class ChatModule {}
