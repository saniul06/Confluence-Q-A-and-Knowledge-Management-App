import { uuidv7 } from "uuidv7";
import { ConfluenceGateway } from "../repositories/confluence/confluence.repository";
import { AnswerRepository } from "../repositories/question/answer.repository";
import { QuestionRepository } from "../repositories/question/question.repository";
import {
  AcceptAnswerInput,
  CreateAnswerInput,
} from "../shared/schemas/answer.schema";
import { Answer } from "../shared/types/answer.type";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../utils/error";
import sql from "@forge/sql";
import { QUESTION_STATUS } from "../shared/constants";

export class AnswerService {
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly confluenceGateway: ConfluenceGateway,
  ) {}

  async createAnswer(input: CreateAnswerInput): Promise<Answer> {
    const question = await this.questionRepository.findById(input.questionId);

    if (!question) {
      throw new NotFoundError("Question not found");
    }

    const user = await this.confluenceGateway.getCurrentUser();

    const answer = {
      id: uuidv7(),

      questionId: input.questionId,

      body: input.body,

      authorAccountId: user.accountId,

      authorDisplayName: user.displayName,

      createdAt: new Date().toISOString(),

      isAccepted: 0 as const,
    };

    await this.answerRepository.create(answer);

    return answer;
  }

  async acceptAnswer(input: AcceptAnswerInput): Promise<boolean> {
    const question = await this.questionRepository.findById(input.questionId);

    if (!question) {
      throw new NotFoundError("Question not found");
    }

    if (question.status === QUESTION_STATUS.faq_published) {
      throw new ConflictError("FAQ is already created");
    }

    const answer = await this.answerRepository.findById(input.answerId);

    if (!answer) {
      throw new NotFoundError("Answer not found");
    }

    if (answer.questionId !== question.id) {
      throw new ValidationError("Answer does not belong to this question");
    }

    const user = await this.confluenceGateway.getCurrentUser();

    if (user.accountId !== question.authorAccountId) {
      throw new ForbiddenError("Only the question author can accept an answer");
    }

    await this.answerRepository.unacceptAll(question.id);

    const [accpeted] = await Promise.all([
      this.answerRepository.markAccepted(answer.id),
      this.questionRepository.updateStatus(question.id, QUESTION_STATUS.answered),
    ]);
    return accpeted;
  }
}
