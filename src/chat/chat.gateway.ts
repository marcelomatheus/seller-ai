import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OpenaiService } from 'src/openai/openai.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(private readonly openai: OpenaiService) {}
  private connection: String[] = [];
  afterInit(server: any) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected:', client.handshake.query.userId as string);
  }
  handleDisconnect(client: Socket) {
    this.connection = this.connection.filter((id) => id !== client.id);
    console.log('Client disconnected:', this.connection);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: any, payload: any): Promise<void> {
    const response = await this.openai.getAnswer(payload);
    this.server.emit('receiveMessage', response);
  }
}
