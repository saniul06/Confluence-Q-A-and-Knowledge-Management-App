import { ListQuestionsInput } from "../../shared/schemas/question.schemas";
import {
  PaginatedQuestions,
  Question,
  QuestionCursor,
  QuestionDetails,
  QuestionExpert,
  QuestionStatus,
} from "../../shared/types/question.type";
import { QuestionForFaqPublishing } from "../../types/faq.types";

export interface QuestionRepository {
  create(input: Question): Promise<number>;

  findById(id: string): Promise<Omit<QuestionDetails, 'topics' | 'answers'> | null>;

  listBySpace(input: {
    spaceKey: string;
    status?: QuestionStatus;
    topicId?: string;
    cursor?: QuestionCursor;
    limit: number;
  }): Promise<PaginatedQuestions>;

  listByCursor(input: ListQuestionsInput): Promise<PaginatedQuestions>;

  updateStatus(id: string, status: QuestionStatus): Promise<boolean>;

  findForFaqPublishing(questionId: string): Promise<QuestionForFaqPublishing | null>;

  markFaqPublished(questionId: string): Promise<void>;
}
