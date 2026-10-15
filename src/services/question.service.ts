import { uuidv7 } from "uuidv7";
import { NotFoundError } from "../utils/error";
import { QuestionRepository } from "../repositories/question/question.repository";
import { QuestionTopicRepository } from "../repositories/question/question-topic.repository";
import {
  CreateQuestionInput,
  ListQuestionsInput,
} from "../shared/schemas/question.schemas";
import {
  PaginatedQuestions,
  Question,
  QuestionDetails,
} from "../shared/types/question.type";
import { AnswerRepository } from "../repositories/question/answer.repository";
import { ConfluenceService } from "./confluence.service";
import { ExpertService } from "./expert.service";
import { TopicService } from "./topic.service";
import { notificationQueue } from "../notification";
import { QUESTION_STATUS } from "../shared/constants";

export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly questionTopicRepository: QuestionTopicRepository,
    private readonly expertService: ExpertService,
    private readonly confluenceService: ConfluenceService,
    private readonly answerRepository: AnswerRepository,
    private readonly topicrService: TopicService,
  ) {}

  async createQuestion(input: CreateQuestionInput): Promise<Question> {
    const user = await this.confluenceService.getCurrentUser();

    const uniqTopicsIds = [...new Set(input.topicIds)];

    const isTopicsExists = await this.topicrService.existsByIds(uniqTopicsIds);

    if (!isTopicsExists) {
      throw new NotFoundError("Topics not found");
    }

    const experts = await this.expertService.findByTopicIds(uniqTopicsIds);

    const uniqueExperts = Array.from(
      new Map(experts.map((expert) => [expert.accountId, expert])).values(),
    );

    const responsibleExpert = uniqueExperts[0] ?? null;

    const questionId = uuidv7();

    const creationTime = new Date().toISOString();

    const payload = {
      id: questionId,
      spaceKey: input.spaceKey,
      title: input.title,
      body: input.body ?? null,
      authorAccountId: user.accountId,
      authorDisplayName: user.displayName,
      assignedExpertId: responsibleExpert?.id ?? null,
      createdAt: creationTime,
      updatedAt: creationTime,
      status: QUESTION_STATUS.open,
    };

    await this.questionRepository.create(payload);
    await this.questionTopicRepository.createMany(questionId, uniqTopicsIds);

    if (uniqueExperts.length) {
      await notificationQueue.push(
        uniqueExperts.map((expert) => ({
          body: {
            questionId,
            questionTitle: payload.title,
            expertAccountId: expert.accountId,
            spaceKey: input.spaceKey,
          },
        })),
      );
    }
    return payload;
  }

  async listQuestions(input: ListQuestionsInput): Promise<PaginatedQuestions> {
    return await this.questionRepository.listByCursor(input);
  }

  async getQuestion(id: string): Promise<QuestionDetails> {
    const question = await this.questionRepository.findById(id);

    if (!question) {
      throw new NotFoundError("Question not found");
    }

    const [topics, answers] = await Promise.all([
      this.questionTopicRepository.findTopics(id),
      this.answerRepository.findByQuestionId(id),
    ]);

    return {
      ...question,
      topics,
      answers,
    };
  }
}
