import api, { route } from "@forge/api";

export type ConfluenceSpace = {
  id: string;
  key: string;
  name: string;
};

type SpacesResponse = {
  results: ConfluenceSpace[];
};

export interface ConfluenceSpaceGateway {
  findByKey(key: string): Promise<ConfluenceSpace | null>;
  findAllKeys(): Promise<string[]>;
}

export class ForgeConfluenceSpaceGateway implements ConfluenceSpaceGateway {
  async findByKey(key: string): Promise<ConfluenceSpace | null> {
    const response = await api
      .asApp()
      .requestConfluence(route`/wiki/api/v2/spaces?keys=${key}&limit=1`, {
        headers: { Accept: "application/json" },
      });

    if (!response.ok) {
      throw new Error(
        `Failed to look up Confluence space (${response.status}).`,
      );
    }

    const data = (await response.json()) as SpacesResponse;

    return data.results.find((space) => space.key === key) ?? null;
  }

  async findAllKeys(): Promise<string[]> {
    const response = await api
      .asApp()
      .requestConfluence(route`/wiki/api/v2/spaces`, {
        headers: { Accept: "application/json" },
      });

    if (!response.ok) {
      throw new Error(
        `Failed to look up Confluence space (${response.status}).`,
      );
    }

    const data = (await response.json()) as SpacesResponse;

    const keys = data.results.map((i) => i.key);
    return keys;
  }
}
