import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core/services/reflector.service';

import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { jwtPayload } from './dto/jwtPayload';
import { WsException } from '@nestjs/websockets';

export interface WSAuthenticatedRequest extends Socket {
  user: jwtPayload;
}

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToWs().getClient<Socket>();
    const token = request.handshake.auth?.token;

    if (!token) {
      throw new WsException("Unathorized WS connection...");
    }

    try {
      const payload = await this.jwtService.verifyAsync<jwtPayload>(token);
      (request as WSAuthenticatedRequest).user = payload;
    } catch {
      throw new WsException("Unathorized WS connection...");
    }
    return true;
  }
}
