import { Controller, Get, Injectable, Query, Req } from "@nestjs/common";
import { InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { User } from "./entities/User";
import { UserService } from "./user.service";
import { ReadUserDetailsDto } from "./dto/readUserDetailsDto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { type AuthenticatedRequest } from "src/auth/auth.guard";

@ApiBearerAuth()
@Controller('user')
export class UserController{
    constructor(private userServise: UserService){}

    @Get("user-details")
    async getUserDetails(@Req() req: AuthenticatedRequest): Promise<ReadUserDetailsDto>{
            const details = await this.userServise.getUserDetails(req.user.sub);
            return details
    }
}