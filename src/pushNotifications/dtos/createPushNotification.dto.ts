import { UserNotificationType } from '../entities/UserPushNotification';

//! Remove the senderId , it will be extracred from jwt
export class CreatePushNotification {
  sendeId: number;
  reciverId: number;
  isApproved: boolean;
  notificationType: UserNotificationType;
}
