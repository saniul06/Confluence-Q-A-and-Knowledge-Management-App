import type { QuestionBoardAction, QuestionBoardState } from "./questionBoard";

export const initialQuestionBoardState: QuestionBoardState = {
  status: "all",
  topicId: null,
  selectedQuestionId: null,
  isAskFormOpen: false,
};

export function questionBoardReducer(
  state: QuestionBoardState,
  action: QuestionBoardAction         ,
): QuestionBoardState {
  switch (action.type) {
    case "SET_STATUS":
      return {
        ...state,
        status: action.payload,
      };

    case "SET_TOPIC":
      return {
        ...state,
        topicId: action.payload,
      };

    case "OPEN_QUESTION":
      return {
        ...state,
        selectedQuestionId: action.payload,
      };

    case "CLOSE_QUESTION":
      return {
        ...state,
        selectedQuestionId: null,
      };

    case "OPEN_ASK_FORM":
      return {
        ...state,
        isAskFormOpen: true,
      };

    case "CLOSE_ASK_FORM":
      return {
        ...state,
        isAskFormOpen: false,
      };

    default:
      return state;
  }
}