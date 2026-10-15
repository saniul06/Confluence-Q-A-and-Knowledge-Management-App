import { ConfluenceUser, ConfluenceUserCheck } from "../../shared/types";

export interface ConfluenceGateway {
  findConfluenceUsers(start: number): Promise<ConfluenceUser[]>;

  getCurrentUser(): Promise<ConfluenceUser>;

  isAdmin(accountId: string): Promise<boolean>;
}
