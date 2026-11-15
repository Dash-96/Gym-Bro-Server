import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { argon2id, hash, verify } from 'argon2';
import { User } from 'src/user/entities/User';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/signIn.dto';
import {  CreateUserDto } from 'src/user/dto/createUser.dto';
import { JwtPayload } from './dto/jwtPayload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject() private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { userName: signInDto.userName },
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
    return {
      accessToken: await this.genreateJwtToken(user.id , user.userName , "access"),
      refreshToken: await this.genreateJwtToken(user.id , user.userName , "refresh"),
    };
  }

  async signUp(signUpDetails: CreateUserDto) {
    const hashedPassword = await this.hashPassword(signUpDetails.password);
    const createdUser = this.userRepository.create({
      ...signUpDetails , password: hashedPassword
    });
    
    const savedUser = await this.userRepository.save(createdUser);
     return {
      accessToken: await this.genreateJwtToken(savedUser.id , savedUser.userName , "access"),
      refreshToken: await this.genreateJwtToken(savedUser.id , savedUser.userName , "refresh"),
    };
  }

  //= Genreates a new access token if the refresh token is still valid
  async refreshAccess(user: JwtPayload) {
    try{
      console.log(user.exp)
      this.checkTokenExp(user.exp)
      const accessTokenInterval = Date.now() / 1000 + 60 * 60;
      return await this.jwtService.signAsync({ ...user, exp: accessTokenInterval });
    }catch(err){
      console.error(err);
      throw err;
    }
  }

  async quicksignIn(user: JwtPayload) {
    this.checkTokenExp(user.exp);
    return "authorized"
  }


  //.Auth util functions 
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

  private async genreateJwtToken(userId: number , userName: string , type: "access" | "refresh"){
    const interval = Date.now() / 1000 + 60 * 60;
    const tokenInterval = type === "access" ? interval : interval * 24 * 30;
      

     const jwtPayload: JwtPayload = {
      sub: userId,
      username: userName,
      exp: tokenInterval,
    };

   return await this.jwtService.signAsync(jwtPayload)
  }
}

