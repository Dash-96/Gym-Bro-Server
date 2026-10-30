import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type UserNotificationType = 'friend-request' | 'workout' | 'PR';

@Entity({ name: 'user_push_notifications' })
export class UserPushNotification {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'sender_id' })
  sendeId: number;
  @Column({ name: 'reciver_id' })
  reciverId: number;
  @Column({ name: 'is_approved' })
  isApproved: boolean;
  @Column({name:"type"})
  notificationType: UserNotificationType;
}
