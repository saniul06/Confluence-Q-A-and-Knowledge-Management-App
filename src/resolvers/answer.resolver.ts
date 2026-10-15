import { AnswerService } from "../services/answer.service";
import {
  acceptAnswerSchema,
  createAnswerSchema,
} from "../shared/schemas/answer.schema";
import { ResolverGroup } from "../shared/types";
import { validatePayload, withResponse } from "../utils/helpers";

export function answerResolvers(
  answerService: AnswerService,
): ResolverGroup<"createAnswer" | "acceptAnswer"> {
  return {
    createAnswer: withResponse(async (request) => {
      const input = validatePayload(createAnswerSchema, request.payload);

      return answerService.createAnswer(input);
    }),

    acceptAnswer: withResponse(async (request) => {
      const input = validatePayload(acceptAnswerSchema, request.payload);

      return answerService.acceptAnswer(input);
    }),
  };
}
