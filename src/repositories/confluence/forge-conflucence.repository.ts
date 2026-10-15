import api, { route } from "@forge/api";
import {
  ConfluenceUser,
  ConfluenceUserSearchResponse,
} from "../../shared/types";
import { ConfluenceGateway } from "./confluence.repository";
import { LIMIT } from "../../shared/constants";

export class ForgeConfluenceGateway implements ConfluenceGateway {
  async findConfluenceUsers(start: number): Promise<ConfluenceUser[]> {
    const response = await api
      .asApp()
      .requestConfluence(
        route`/wiki/rest/api/search/user?cql=type=user&start=${start}&limit=${LIMIT}`,
      );

    if (!response.ok) {
      throw new Error(`Confluence user search failed: ${response.status}`);
    }

    const data = (await response.json()) as ConfluenceUserSearchResponse;

    return data.results.map((result) => ({
      accountId: result.user.accountId,
      displayName: result.user.displayName,
    }));
  }

  async getCurrentUser(): Promise<ConfluenceUser & { isAdmin: boolean }> {
    const response = await api
      .asUser()
      .requestConfluence(route`/wiki/rest/api/user/current`);

    if (!response.ok) {
      throw new Error(`Failed to get current user: ${response.status}`);
    }

    const user = await response.json();

    return {
      accountId: user.accountId,
      displayName: user.displayName,
      isAdmin: true,
    };
  }

  async isAdmin(accountId: string): Promise<boolean> {
    const response = await api
      .asUser()
      .requestConfluence(
        route`/wiki/rest/api/user/memberof?accountId=${accountId}`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

    if (!response.ok) {
      console.error("Failed to fetch user group memberships");
      return false;
    }

    const data = await response.json();
    const groups: { name: string }[] = data.results || [];

    const isAdmin = groups.some(
      (group) =>
        group.name === "confluence-administrators" ||
        group.name === "site-admins",
    );

    return isAdmin;
  }
}
