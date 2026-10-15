import { signRealtimeToken } from "@forge/realtime";
import { EXPERT_NOTIFICATION_CHANNEL } from "../shared/constants";

export class NotificationService {
  async getExpertNotificationToken(accountId: string) {
    const { token, errors } = await signRealtimeToken(
      EXPERT_NOTIFICATION_CHANNEL,
      { allowedUsers: [accountId] },
      ["subscribe"],
    );

    if (errors?.length || !token) {
      throw new Error("Unable to authorize notifications.");
    }

    return { token };
  }
}
