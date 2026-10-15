import { Answer } from "../../shared/types/answer.type";

export interface AnswerRepository {
  create(input: Answer): Promise<Answer>;

  findById(id: string): Promise<Answer | null>;

  findByQuestionId(questionId: string): Promise<Answer[]>;

  unacceptAll(questionId: string): Promise<boolean>;

  markAccepted(answerId: string): Promise<boolean>;
}
