import { EXPERT_NOTIFICATION_CHANNEL } from "../../shared/constants";
import type { AssignedExpertNotification } from "../../types/notification.types";
import { NotificationGateway } from "./notification.gateway";

import {
  publishGlobal,
  signRealtimeToken,
} from "@forge/realtime";


export class ForgeNotificationGateway
  implements NotificationGateway
{
  async notifyAssignedExpert(
    notification: AssignedExpertNotification,
  ): Promise<void> {
    const claims = {
      allowedUsers: [notification.expertAccountId],
    };

    const { token, errors } = await signRealtimeToken(
      EXPERT_NOTIFICATION_CHANNEL,
      claims,
      ["publish"],
    );

    if (errors?.length || !token) {
      throw new Error("Failed to authorize expert notification.");
    }

    const result = await publishGlobal(
      EXPERT_NOTIFICATION_CHANNEL,
      {
        type: "QUESTION_ASSIGNED",
        questionId: notification.questionId,
        questionTitle: notification.questionTitle,
        spaceKey: notification.spaceKey,
      },
      { token },
    );

    if (result.errors?.length) {
      throw new Error("Failed to publish expert notification.");
    }
  }
}