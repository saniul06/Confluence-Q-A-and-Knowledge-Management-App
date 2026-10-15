import { z } from "zod";
import { uuidv7 } from "uuidv7";
import { FaqPageRepository } from "../repositories/faq/faq.repository";
import { ConfigRepository } from "../repositories/config/config.repository";
import { ConfluenceSpaceGateway } from "../repositories/confluence/confluence-space-gateway";
import { ConfluencePageGateway } from "../repositories/confluence/confluence-page-gateway";
import { DEFAULT_FAQ_SPACE_KEY } from "../types/config.types";
import { buildFaqStorageBody } from "../utils/helpers";
import { QuestionRepository } from "../repositories/question/question.repository";
import { ConfluenceService } from "./confluence.service";
import { QUESTION_STATUS } from "../shared/constants";
import { ConflictError } from "../utils/error";

const publishFaqSchema = z.object({
  questionId: z.string().min(1),
});

export interface FaqPublisherAuthorization {
  isAdmin(accountId: string): Promise<boolean>;
}

export interface IdGenerator {
  next(): string;
}

export class FaqService {
  constructor(
    private readonly questions: QuestionRepository,
    private readonly faqPages: FaqPageRepository,
    private readonly config: ConfigRepository,
    private readonly spaces: ConfluenceSpaceGateway,
    private readonly pages: ConfluencePageGateway,
    private readonly confluenceService: ConfluenceService,
  ) {}

  async publish(input: { questionId: string; actorAccountId: string }) {
    const { questionId } = input;
    const question = await this.questions.findForFaqPublishing(questionId);

    if (!question) {
      throw new Error("Question not found.");
    }

    if (!question.acceptedAnswer) {
      throw new Error("Accept an answer before publishing this FAQ.");
    }

    if (question.status === QUESTION_STATUS.faq_published) {
      throw new ConflictError("FAQ already published");
    }

    const isAuthor = question.authorAccountId === input.actorAccountId;

    if (!isAuthor) {
      const isAdmin = await this.confluenceService.isUserAdmin(
        input.actorAccountId,
      );

      if (!isAdmin) {
        throw new Error("You are not allowed to publish this FAQ.");
      }
    }

    const config = await this.config.get(DEFAULT_FAQ_SPACE_KEY);
    if (!config?.value) {
      throw new Error("The default FAQ space has not been configured.");
    }

    // Prevent ordinary repeated clicks from creating duplicate pages.
    const existing = await this.faqPages.findByQuestionAndSpace(
      question.id,
      config.value,
    );

    if (existing) {
      return existing;
    }

    const space = await this.spaces.findByKey(config.value);

    if (!space) {
      throw new Error("The configured FAQ space no longer exists.");
    }

    const page = await this.pages.createPage({
      spaceId: space.id,
      title: question.title,
      storageBody: buildFaqStorageBody(
        question.body,
        question.acceptedAnswer.body,
      ),
    });

    if (!page) {
      throw new Error("Page creation failed");
    }

    await this.faqPages.create({
      id: uuidv7(),
      questionId: question.id,
      answerId: question.acceptedAnswer.id,
      confluencePageId: page.id,
      confluencePageUrl: page.url,
      spaceKey: space.key,
      title: question.title,
    });

    await this.questions.markFaqPublished(question.id);

    return {
      id: page.id,
      confluencePageId: page.id,
      confluencePageUrl: page.url,
      spaceKey: space.key,
      title: question.title,
    };
  }
}
