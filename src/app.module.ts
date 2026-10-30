import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { WorkoutModule } from './workout/workout.module';
import { Workout } from './workout/entities/Workout';

import { ExerciseController } from './exercise/exercise.controller';
import { ExerciseModule } from './exercise/exercise.module';
import { SetModule } from './set/set.module';

import { User } from './user/entities/User';
import { UserModule } from './user/user.module';

import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';

import { SocialModule } from './social/social.module';
import { SocailEventsModule } from './websocket/social/socialEvents.module';
import { UserPushNotification } from './pushNotifications/entities/UserPushNotification';
import { PushNotificationsModule } from './pushNotifications/pushNotifications.module';

@Module({
  controllers: [AppController, ExerciseController],

  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],

  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.getOrThrow<string>('DATABASE_URL'),
        entities: [Workout, User , UserPushNotification],
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),

    WorkoutModule,
    ExerciseModule,
    SetModule,
    UserModule,
    AuthModule,
    SocialModule,
    SocailEventsModule,
    PushNotificationsModule
  ],
})
export class AppModule {}