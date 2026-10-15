import { ConfigRepository } from "../repositories/config/config.repository";
import { ConfluenceSpaceGateway } from "../repositories/confluence/confluence-space-gateway";
import { DEFAULT_FAQ_SPACE_KEY } from "../types/config.types";
import { SetDefaultFaqSpaceInput } from "../shared/schemas/config.schema";
import { NotFoundError } from "../utils/error";

export class ConfigService {
  constructor(
    private readonly configRepository: ConfigRepository,
    private readonly confluenceSpaceGateway: ConfluenceSpaceGateway,
  ) {}

  async getAllKeys(): Promise<string[]> {
    return await this.confluenceSpaceGateway.findAllKeys();
  }

  async getDefaultFaqSpaceKey(): Promise<string | null> {
    const entry = await this.configRepository.get(DEFAULT_FAQ_SPACE_KEY);

    return entry?.value ?? null;
  }

  async setDefaultFaqSpaceKey(
    input: SetDefaultFaqSpaceInput,
  ): Promise<boolean> {
    const { spaceKey } = input;

    const space = await this.confluenceSpaceGateway.findByKey(spaceKey);

    if (!space) {
      throw new NotFoundError(`Confluence space "${spaceKey}" was not found.`);
    }

    return !!(await this.configRepository.set(
      DEFAULT_FAQ_SPACE_KEY,
      space.key,
    ));
  }
}
