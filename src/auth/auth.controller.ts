import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/signIn.dto';
import { AuthService } from './auth.service';
import type {  CreateUserDto } from 'src/user/dto/createUser.dto';
import { JwtService } from '@nestjs/jwt';
import { Public } from 'src/decorators/public.decorator';
import type { AuthenticatedRequest } from './auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(@Inject() private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<
    { accessToken: string; refreshToken: string } | { message: string }
  > {
    try {
      console.log("user tryin login...")
      const response = await this.authService.signIn(signInDto);
      let message = '';
      if (response) {
        message = 'login success';
      } else {
        message = 'failed to login';
      }

      return response;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        return { message: err.message };
      }

      return { message: 'failed to login: ' + err };
    }
  }

  @Public()
  @Post('register')
  async register(
    @Body() registerDetails: CreateUserDto,
  ){
    console.log("called register")
    return await this.authService.signUp(registerDetails);
  }

  @ApiBearerAuth()
  @Post('refresh')
  async refreshAccess(@Req() req: AuthenticatedRequest) {
    const user = req.user;
    const acceesToekn = await this.authService.refreshAccess(user);
    return acceesToekn;
  }

  @ApiBearerAuth()
  @Get()
  async quickSignIn(@Req() req: AuthenticatedRequest) {
    return await this.authService.quicksignIn(req.user);
  }
}
