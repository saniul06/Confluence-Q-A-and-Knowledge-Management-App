import { ConfluenceGateway } from "../repositories/confluence/confluence.repository";
import { ConfluenceUser, Expert } from "../shared/types";

export class ConfluenceService {
  constructor(private readonly confluenceGateway: ConfluenceGateway) {}

  async findConfluenceUsers(start: number): Promise<ConfluenceUser[]> {
    return await this.confluenceGateway.findConfluenceUsers(start);
  }

  async getCurrentUser() {
    return await this.confluenceGateway.getCurrentUser();
  }

   async isUserAdmin(accountId: string) {
    return await this.confluenceGateway.isAdmin(accountId);
  }
}
