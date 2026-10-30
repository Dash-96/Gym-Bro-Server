import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPushNotification } from './entities/UserPushNotification';
import { Repository } from 'typeorm';
import { CreatePushNotification } from './dtos/createPushNotification.dto';
import { User } from 'src/user/entities/User';
import { ExpoService } from './expoServer.service';

@Injectable()

export class PushNotificationsService {
  constructor(
    @InjectRepository(UserPushNotification)
    private notificationRepository: Repository<UserPushNotification>,
    @InjectRepository(User) private userRepository: Repository<User>,
     private expoService : ExpoService
  ) {}

  async registerPushToken(userId: number, expoToken: string) {
    await this.userRepository
      .createQueryBuilder()
      .update()
      .set({
        userMeta: () =>
          `jsonb_set(COALESCE(user_meta, '{}'::jsonb), '{expoToken}', to_jsonb(CAST(:expoToken AS text)))`,
      })
      .where('id = :userId', { userId })
      .setParameters({ expoToken })
      .execute();
  }



  async createPushNotification(notification: CreatePushNotification) {
    try {
      const targetId = notification.reciverId;
      const targetUserMeta = await this.userRepository.findOne({where:{id: targetId} , select:{userMeta:true}})
      const pushToken = targetUserMeta?.userMeta.expoToken ?? "";
      this.expoService.sendNotification([pushToken] , "קיבלת בקשת חברות");
      const result = await this.notificationRepository.insert(notification);
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
