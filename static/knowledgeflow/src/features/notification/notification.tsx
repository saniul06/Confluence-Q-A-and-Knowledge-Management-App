import { useEffect } from "react";
import { realtime, showFlag, router } from "@forge/bridge";

// Replace this with your existing typed API client.
import { EXPERT_NOTIFICATION_CHANNEL } from "../../../../../src/shared/constants";
import { notificationApi } from "./notificationApi";

type QuestionAssignedEvent = {
  type: "QUESTION_ASSIGNED";
  questionId: string;
  questionTitle: string;
  spaceKey: string;
};

function isQuestionAssignedEvent(
  payload: unknown,
): payload is QuestionAssignedEvent {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const event = payload as Record<string, unknown>;

  return (
    event.type === "QUESTION_ASSIGNED" &&
    typeof event.questionId === "string" &&
    typeof event.questionTitle === "string" &&
    typeof event.spaceKey === "string"
  );
}

export function useExpertNotifications() {
  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => Promise<void>) | undefined;

    async function subscribe() {
      const result = await notificationApi.getExpertNotificationToken();

      if (!result.success || cancelled) {
        return;
      }

      const subscription = await realtime.subscribeGlobal(
        EXPERT_NOTIFICATION_CHANNEL,
        (payload) => {
          if (!isQuestionAssignedEvent(payload)) {
            return;
          }

          showFlag({
            id: `question-assigned-${payload.questionId}`,
            title: "New question assigned",
            description: payload.questionTitle,
            type: "info",
            isAutoDismiss: true,
            actions: [
              {
                text: "View questions",
                onClick: () => {
                  void router.navigate({
                    target: "module",
                    moduleKey: "knowledgeflow-space-page",
                    spaceKey: payload.spaceKey,
                  });
                },
              },
            ],
          });
        },
        { token: result.data.token },
      );

      if (cancelled) {
        await subscription.unsubscribe();
        return;
      }

      unsubscribe = () => subscription.unsubscribe();
    }

    void subscribe().catch((error: unknown) => {
      console.error("Unable to subscribe to notifications:", error);
    });

    return () => {
      cancelled = true;
      void unsubscribe?.();
    };
  }, []);
}
