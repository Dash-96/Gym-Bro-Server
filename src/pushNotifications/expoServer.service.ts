import { Injectable } from '@nestjs/common';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import { PushNotification } from './types/notificationTypes';

@Injectable()
export class ExpoService {
  private expo = new Expo();

  // constructor() {}

  async sendNotification( targetPushToken: string[] ,message: string) {
    const messages: ExpoPushMessage[] = targetPushToken.map((pushToken) => {
      if (!Expo.isExpoPushToken(pushToken)) {
        throw new Error(
          `Push token ${pushToken} is not a valid Expo push token`,
        );
      }

      return {
        to: pushToken,
        title:"בקשת חברות",
        body: message,
        badge: 2,
        data: { withSome: 'data' },
      };
    });

    const chunks = this.expo.chunkPushNotifications(messages);
    let tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        console.log('result of sending push messages to Expo:', ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
