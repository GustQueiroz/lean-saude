import { Injectable } from "@nestjs/common";

@Injectable()
export class SqsService {
  sendMessage(message: any) {
    console.log("📤 Simulando envio de mensagem para SQS:");
    console.log(JSON.stringify(message, null, 2));
  }
}
