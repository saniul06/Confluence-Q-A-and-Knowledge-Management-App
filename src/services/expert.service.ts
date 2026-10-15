import { uuidv7 } from "uuidv7";
import { ConfluenceGateway } from "../repositories/confluence/confluence.repository";
import { ExpertRepository } from "../repositories/expert/expert.repository";
import { AssignExpertInput } from "../shared/schemas/expert.schema";
import { ConfluenceUser, Expert } from "../shared/types";
import { NotFoundError } from "../utils/error";
import { ConfluenceService } from "./confluence.service";

export class ExpertService {
  constructor(
    private readonly expertRepository: ExpertRepository,
    private readonly confluenceService: ConfluenceService,
  ) {}

  async findConfluenceUsers(start: number): Promise<ConfluenceUser[]> {
    return this.confluenceService.findConfluenceUsers(start);
  }

  async getExperts(topicId: string): Promise<Expert[]> {
    return this.expertRepository.findByTopicId(topicId);
  }

  async assignExpert(input: AssignExpertInput): Promise<Expert> {
    return this.expertRepository.create({
      ...input,
      id: uuidv7(),
      createdAt: new Date().toISOString(),
    });
  }

  async removeExpert(id: string): Promise<boolean> {
    const ret = await this.expertRepository.delete(id);
    if (!ret) throw new NotFoundError("Expert not found");
    return true;
  }

  async findByTopicIds(topicIds: string[]): Promise<Expert[]> {
    return await this.expertRepository.findByTopicIds(topicIds);
  }

  async findById(id: string): Promise<Expert | null> {
    return await this.expertRepository.findById(id);
  }
}
