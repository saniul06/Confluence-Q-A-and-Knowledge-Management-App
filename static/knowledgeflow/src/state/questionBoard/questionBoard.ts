import type { QuestionStatus } from "../../../../../src/shared/types/question.type";

export type QuestionFilterStatus =
  | "all"
  | QuestionStatus;

export type QuestionBoardState = {
  status: QuestionFilterStatus;
  topicId: string | null;
  selectedQuestionId: string | null;
  isAskFormOpen: boolean;
};

export type QuestionBoardAction =
  | {
      type: "SET_STATUS";
      payload: QuestionFilterStatus;
    }
  | {
      type: "SET_TOPIC";
      payload: string | null;
    }
  | {
      type: "OPEN_QUESTION";
      payload: string;
    }
  | {
      type: "CLOSE_QUESTION";
    }
  | {
      type: "OPEN_ASK_FORM";
    }
  | {
      type: "CLOSE_ASK_FORM";
    };