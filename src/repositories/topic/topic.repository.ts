import type { PaginatedTopics, Topic } from "../../shared/types";

import type {
  fetchTopicByCursorQuery,
  fetchTopicsQuery,
  UpdateTopicInput,
} from "../../shared/schemas/topic.schema";

export interface TopicRepository {
  create(input: Topic): Promise<Topic>;

  findAll(query: fetchTopicsQuery): Promise<PaginatedTopics>;

  findById(id: string): Promise<Topic | null>;

  findByName(name: string): Promise<Topic | null>;

  update(input: UpdateTopicInput): Promise<number>;

  delete(id: string): Promise<number>;

  findByCursor(input: fetchTopicByCursorQuery): Promise<Topic[]>;

  existsByIds(ids: string[]): Promise<boolean>;
}
