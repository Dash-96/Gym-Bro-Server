import { Body, Controller, Injectable, Post , Req } from "@nestjs/common";
import { CreatePushNotification } from "./dtos/createPushNotification.dto";
import { Public } from "src/decorators/public.decorator";
import { PushNotificationsService } from "./pushNotification.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import type{ AuthenticatedRequest } from "src/auth/auth.guard";
import { RegisterExpoToken } from "./dtos/registerExpoToken.dto";

@Controller("push")
@ApiBearerAuth()
export class PushNotificationsController{
    constructor(private notificationService : PushNotificationsService){}
    
    @Post("register-expo-token")
    async registerExpoPushToken(@Req() req : AuthenticatedRequest , @Body() payload: RegisterExpoToken){
        const {user} = req
        this.notificationService.registerPushToken(user.sub , payload.token)
    }
    @Post("friend-request-notification")
    async createPushNotification( @Req() req: AuthenticatedRequest, @Body() dto :CreatePushNotification){
        try{
            const response = await this.notificationService.createPushNotification(dto);
            return {status:"success" , response}
        }catch(err){
            console.error(err);
            return {status : "error" , response: err}
        }
    }
}