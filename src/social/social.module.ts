import { Module } from '@nestjs/common';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/Friend';
import { WorkoutModule } from 'src/workout/workout.module';

@Module({
  imports:[TypeOrmModule.forFeature([Friend]) , WorkoutModule , UserModule],
  controllers: [SocialController],
  providers: [SocialService]
})
export class SocialModule {}
