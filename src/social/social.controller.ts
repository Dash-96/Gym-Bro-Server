import { BadRequestException, Body, Controller, Get, Inject, Param, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { AuthenticatedRequest } from 'src/auth/auth.guard';
import { CompetitionDataDto } from './dtos/competitonData.dto';
import { SocialService } from './social.service';
import { Friend } from './entities/Friend';

@ApiBearerAuth()
@Controller('social')
export class SocialController {
    constructor(@Inject() private socialService : SocialService){}

    //! TODO: Possibly limit the authorized users to rivals: cuurently friends is sufficent
    @Get('weight-volume/:rivalId')
    async getWeightLiftedVolume( @Req() req: AuthenticatedRequest, @Param('rivalId') rivalId:number){
        try{
            req.user;
            const mockId = 42;
            console.log("rival id: " , typeof rivalId)
            const data:CompetitionDataDto = await this.socialService.getCompetitionData(mockId , Number(rivalId));
            console.log("data: " , data)
            return data;
        }catch(error){
            // return new Error("Request failed: " + error);
            if(error instanceof Error)
            return {"error": error.message}
        }
    }

    @Get("friends")
    async getFriendsList(@Req() req:AuthenticatedRequest){
       const result = await this.socialService.getFriendsList(req.user.sub);
       return result;
    }

    @Get("search")
    async getAllUsersWithPrefix(@Query('prefix') prefix:string){
        const result = await this.socialService.getAllUsers(prefix);
        console.log("user list: " , result)
        return result;
    }

    @Get("friend-requests")
    async getFriendRequestsByUserId(@Req() req: AuthenticatedRequest){
        const data = await this.socialService.getFriendRequestsForUser(req.user.sub);
        return data;
      
    }

    //social/accept-friend-request?friendId=
    @Post("accept-friend-request")
    async acceptFriendRequest(@Req() req: AuthenticatedRequest , @Body() dto: {friendId: number}){
            const response = await this.socialService.acceptFriendRequest(req.user.sub , dto.friendId)
            if(response){
                return {status: "success"}
            }
            else{
                throw new BadRequestException("Could not accept request");
            }
    }
}
