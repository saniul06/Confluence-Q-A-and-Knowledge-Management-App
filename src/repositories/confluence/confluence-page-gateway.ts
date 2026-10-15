import api, { route } from "@forge/api";

export type CreatedConfluencePage = {
  id: string;
  title: string;
  url: string | null;
};

type CreatePageResponse = {
  id: string;
  title: string;
  _links?: {
    webui?: string;
    base?: string;
  };
};

export interface ConfluencePageGateway {
  createPage(input: {
    spaceId: string;
    title: string;
    storageBody: string;
  }): Promise<CreatedConfluencePage>;
}

function buildPageUrl(
  base: string | undefined,
  webui: string | undefined,
): string | null {
  if (!webui) return null;

  if (/^https?:\/\//i.test(webui)) {
    return webui;
  }

  if (!base) return null;

  return `${base.replace(/\/$/, "")}/${webui.replace(/^\//, "")}`;
}

export class ForgeConfluencePageGateway implements ConfluencePageGateway {
  async createPage(input: {
    spaceId: string;
    title: string;
    storageBody: string;
  }): Promise<CreatedConfluencePage> {
    const response = await api
      .asApp()
      .requestConfluence(route`/wiki/api/v2/pages`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spaceId: input.spaceId,
          status: "current",
          title: input.title,
          body: {
            representation: "storage",
            value: input.storageBody,
          },
        }),
      });

    if (!response.ok) {
      throw new Error(`Confluence page creation failed (${response.status}).`);
    }

    const page = (await response.json()) as CreatePageResponse;

    return {
      id: page.id,
      title: page.title,
      url: buildPageUrl(page._links?.base, page._links?.webui),
    };
  }
}
