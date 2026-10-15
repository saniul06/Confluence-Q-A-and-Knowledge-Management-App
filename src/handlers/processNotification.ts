import type { AsyncEvent } from "@forge/events";

import { publishGlobal, signRealtimeToken } from "@forge/realtime";

import {
  EXPERT_NOTIFICATION_CHANNEL,
  EXPERT_NOTIFICATION_TYPE,
} from "../shared/constants";
import { AssignedExpertNotificationJob } from "../types/notification.types";

export async function handler(
  event: AsyncEvent<AssignedExpertNotificationJob>,
) {
  const { questionId, questionTitle, expertAccountId, spaceKey } = event.body;

  const { token, errors } = await signRealtimeToken(
    EXPERT_NOTIFICATION_CHANNEL,
    { allowedUsers: [expertAccountId] },
    ["publish"],
  );

  if (errors?.length || !token) {
    throw new Error("Could not authorize expert notification.");
  }

  const result = await publishGlobal(
    EXPERT_NOTIFICATION_CHANNEL,
    {
      type: EXPERT_NOTIFICATION_TYPE,
      questionId,
      questionTitle,
      spaceKey,
    },
    { token },
  );

  if (result.errors?.length) {
    throw new Error("Could not publish expert notification.");
  }
}
