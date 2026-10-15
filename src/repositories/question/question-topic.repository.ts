import { QuestionTopic } from "../../shared/types/question.type";

export interface QuestionTopicRepository {
  createMany(questionId: string, topicIds: string[]): Promise<void>;

  findTopics(questionId: string): Promise<QuestionTopic[]>;

  findAll(): Promise<void>;

  isTopicUsed(topicId: string): Promise<boolean>;
}
