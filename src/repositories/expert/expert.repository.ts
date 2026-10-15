import { Expert } from "../../shared/types";

export interface ExpertRepository {
  findByTopicId(topicId: string): Promise<Expert[]>;

  findByTopicAndAccount(
    topicId: string,
    accountId: string,
  ): Promise<Expert | null>;

  findByTopicIds(topicIds: string[]): Promise<Expert[]>;

  findById(id: string): Promise<Expert | null>;

  create(input: Expert): Promise<Expert>;

  delete(id: string): Promise<number>;

  deleteByTopic(topicId: string): Promise<number> 
}
