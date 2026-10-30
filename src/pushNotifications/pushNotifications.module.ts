import { Module } from '@nestjs/common';
import { PushNotificationsService } from './pushNotification.service';
import { PushNotificationsController } from './pushNotifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPushNotification } from './entities/UserPushNotification';
import { User } from 'src/user/entities/User';
import { ExpoService } from './expoServer.service';
@Module({
    providers:[PushNotificationsService , ExpoService],
    controllers:[PushNotificationsController],
    imports: [TypeOrmModule.forFeature([UserPushNotification , User])],
    exports:[PushNotificationsService]
})
export class PushNotificationsModule{}