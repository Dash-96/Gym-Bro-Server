import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { User } from "./entities/User";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReadUserDetailsDto } from "./dto/readUserDetailsDto";

@Injectable()
export class UserService{
    constructor(@InjectRepository(User) private userRepositiry: Repository<User>){}

    async getUserDetails(userId: number): Promise<ReadUserDetailsDto>{
        try{
            const user = await this.userRepositiry.findOne({where:{id: userId}})
            if(user){
                return { userId:user.id, userName: user.displayName , fullName: user.fullName , age: 30 , email:user.email , height: 178 , weight: user.weight , profileImage: user.profileImage ?? undefined};
            }
            else{
                throw new NotFoundException("User Not Found")
            }
        }catch(err){
            throw err;
        }
    }

}