import { UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Namespace, Server, Socket } from "socket.io";
import { WsAuthGuard } from "src/auth/auth.wsGuard";
import { Public } from "src/decorators/public.decorator";

// @Public()
@UseGuards(WsAuthGuard)
@WebSocketGateway({namespace:"social-socket"})
export class SocialGateway{
    @WebSocketServer()
    server : Namespace
    
    @SubscribeMessage("socket-test")
    hanleTestMessage(@ConnectedSocket() client: Socket , @MessageBody() message:string){
        console.log("handler called")
        console.log(message)
    }
}
