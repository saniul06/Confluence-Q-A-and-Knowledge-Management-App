import { NOTIFICATION_CHANNEL } from "../shared/constants";

export type NotificationType = "question_assigned";

export type SignRealtimeToken = {
  token: any | null;
  expiresAt: any | null;
  channel: typeof NOTIFICATION_CHANNEL;
};

export type AssignedExpertNotification = {
  questionId: string;
  questionTitle: string;
  expertAccountId: string;
  spaceKey: string;
};

export type AssignedExpertNotificationJob = {
  questionId: string;
  questionTitle: string;
  expertAccountId: string;
  spaceKey: string;
};