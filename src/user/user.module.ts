import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/User";

@Module({
    providers:[UserService],
    controllers:[UserController],
    imports:[TypeOrmModule.forFeature([User])],
    exports:[TypeOrmModule]
})

export class UserModule{

}