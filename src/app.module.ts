import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkoutController } from './workout/workout.controller';
import { WorkoutModule } from './workout/workout.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from './workout/entities/Workout';
import { ExerciseController } from './exercise/exercise.controller';
import { ExerciseModule } from './exercise/exercise.module';
import { Exercise } from './exercise/entities/Exercise';
import { SetModule } from './set/set.module';
import { User } from './user/entities/User';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { SocialModule } from './social/social.module';
import { SocailEventsModule } from './websocket/social/socialEvents.module';

@Module({
  controllers: [AppController, ExerciseController],
  providers: [AppService , {provide:APP_GUARD , useClass:AuthGuard}],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'david17796',
      database: 'GymBroDB',
      entities: [Workout, User],
      synchronize: false,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({isGlobal:true}),
    WorkoutModule,
    ExerciseModule,
    SetModule,
    UserModule,
    AuthModule,
    SocialModule,
    SocailEventsModule
  ],
})
export class AppModule {}
