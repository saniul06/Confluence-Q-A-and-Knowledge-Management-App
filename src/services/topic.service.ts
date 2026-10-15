import { uuidv7 } from "uuidv7";

import { ConflictError, NotFoundError } from "../utils/error";

import type { PaginatedTopics, Topic } from "../shared/types";

import type {
  CreateTopicInput,
  fetchTopicByCursorQuery,
  fetchTopicsQuery,
  UpdateTopicInput,
} from "../shared/schemas/topic.schema";

import type { TopicRepository } from "../repositories/topic/topic.repository";
import { QuestionTopicRepository } from "../repositories/question/question-topic.repository";
import { ExpertRepository } from "../repositories/expert/expert.repository";

export class TopicService {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly questionTopicRepository: QuestionTopicRepository,
    private readonly expertRepository: ExpertRepository,
  ) {}

  async createTopic(input: CreateTopicInput): Promise<Topic> {
    const existingTopic = await this.topicRepository.findByName(input.name);

    if (existingTopic) {
      throw new ConflictError("A topic with this name already exists");
    }

    const payload: Topic = {
      ...input,
      id: uuidv7(),
      createdAt: new Date().toISOString(),
    };

    return await this.topicRepository.create(payload);
  }

  async fetchTopics(query: fetchTopicsQuery): Promise<PaginatedTopics> {
    const { items, total } = await this.topicRepository.findAll({
      lastId: query.lastId,
      direction: query.direction,
    });
    return { items, total };
  }

  async fetchTopicsByCursor(query: fetchTopicByCursorQuery): Promise<Topic[]> {
    return await this.topicRepository.findByCursor({ lastId: query.lastId });
  }

  async updateTopic(input: UpdateTopicInput): Promise<boolean> {
    const ret = await this.topicRepository.update(input);
    if (!ret) throw new NotFoundError("Topic not found");
    return true;
  }

  async deleteTopic(id: string): Promise<boolean> {
    const isUsed = await this.questionTopicRepository.isTopicUsed(id);
    if (isUsed) {
      throw new ConflictError("Topic is already in use");
    }
    const ret = await this.topicRepository.delete(id);
    if (!ret) throw new NotFoundError("Topic not found");
    await this.expertRepository.deleteByTopic(id);
    return true;
  }

  async existsByIds(ids: string[]): Promise<boolean> {
    return await this.topicRepository.existsByIds(ids);
  }
}
