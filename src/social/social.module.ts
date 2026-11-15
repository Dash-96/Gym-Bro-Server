import { Module } from '@nestjs/common';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/Friend';
import { WorkoutModule } from 'src/workout/workout.module';
import { PushNotificationsModule } from 'src/pushNotifications/pushNotifications.module';
import { DataSource } from 'typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Friend , DataSource]) , WorkoutModule , UserModule , PushNotificationsModule],
  controllers: [SocialController],
  providers: [SocialService]
})
export class SocialModule {}
