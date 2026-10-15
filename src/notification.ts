import { Queue } from "@forge/events";
import { AssignedExpertNotificationJob } from "./types/notification.types";

export const notificationQueue = new Queue<AssignedExpertNotificationJob>({
  key: "knowledgeflow-expert-notifications",
});
