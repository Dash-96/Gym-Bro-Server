import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { argon2id, hash, verify } from 'argon2';
import { User } from 'src/user/entities/User';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/signIn.dto';
import {  CreateUserDto } from 'src/user/dto/createUser.dto';
import { jwtPayload } from './dto/jwtPayload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject() private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { displayName: signInDto.displayName },
    });
    if (!user) {
      throw new UnauthorizedException('Incorect username or password');
    }
    // console.log(user.password , signInDto.password);
    const isPasswordCorrect = await this.verifyPassword(
      user.password,
      signInDto.password,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Incorect username or password');
    }
    const accessTokenInterval = Date.now() / 1000 + 60 * 60; /// 1 hour
    const refreshTokenInterval = Date.now() / 1000 + 60 * 60 * 24 * 30; /// 1 month
    const accessPayload: jwtPayload = {
      sub: user.id,
      username: user.displayName,
      exp: accessTokenInterval,
    };
    const refreshPayload: jwtPayload = {
      sub: user.id,
      username: user.displayName,
      exp: refreshTokenInterval,
    };
    return {
      accessToken: await this.jwtService.signAsync(accessPayload),
      refreshToken: await this.jwtService.signAsync(refreshPayload),
    };
  }

  async signUp(signUpDetails: CreateUserDto) {
    const hashedPassword = await this.hashPassword(signUpDetails.password);
    const createdUser = this.userRepository.create({
      ...signUpDetails , password: hashedPassword
    });
    const savedUser = await this.userRepository.save(createdUser);
    return savedUser;
  }

  //= Genreates a new access token if the refresh token is still valid
  async refreshAccess(user: jwtPayload) {
    this.checkTokenExp(user.exp)
    const accessTokenInterval = Date.now() / 1000 + 60 * 60;
    return await this.jwtService.signAsync({ ...user, exp: accessTokenInterval });
  }

  async quicksignIn(user: jwtPayload) {
    this.checkTokenExp(user.exp);
    return "authorized"
  }

  private async hashPassword(password: string) {
    return hash(password, { type: argon2id });
  }

  private async verifyPassword(hash: string, password: string) {
    return await verify(hash, password);
  }

  private checkTokenExp(tokenExp: number) {
    const now = Date.now() / 1000;
    if (now > tokenExp) {
      throw new UnauthorizedException();
    }
  }
}
