import { NotificationService } from "../services/notification.service";

import { ResolverGroup } from "../shared/types";
import { withResponse } from "../utils/helpers";

export function notificationResolvers(
  notificationService: NotificationService,
): ResolverGroup<"getExpertNotificationToken"> {
  return {
    getExpertNotificationToken: withResponse(async (request) => {
      const accountId = request.context.accountId;

      if (!accountId) {
        throw new Error("Unable to identify the current user.");
      }

      return notificationService.getExpertNotificationToken(accountId)
    }),
  };
}
