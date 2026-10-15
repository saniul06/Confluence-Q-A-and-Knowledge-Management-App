import { QuestionService } from "../services/question.service";
import {
  createQuestionSchema,
  getQuestionSchema,
  listQuestionsSchema,
} from "../shared/schemas/question.schemas";
import { ResolverGroup } from "../shared/types";
import { validatePayload, withResponse } from "../utils/helpers";

export function questionResolvers(
  questionService: QuestionService,
): ResolverGroup<"listQuestions" | "createQuestion" | "getQuestion"> {
  return {
    listQuestions: withResponse(async (request) => {
      const input = validatePayload(listQuestionsSchema, request.payload);
      return questionService.listQuestions(input);
    }),

    createQuestion: withResponse(async (request) => {
      const input = validatePayload(createQuestionSchema, request.payload);

      return questionService.createQuestion(input);
    }),

    getQuestion: withResponse(async (request) => {
      const input = validatePayload(getQuestionSchema, request.payload);

      return questionService.getQuestion(input.id);
    }),
  };
}
