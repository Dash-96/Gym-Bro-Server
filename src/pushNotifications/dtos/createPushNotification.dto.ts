import { UserNotificationType } from '../entities/UserPushNotification';

export class CreatePushNotification {
  reciverId: number;
  isApproved: boolean = false;
  notificationType: UserNotificationType;
}
