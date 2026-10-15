import { ConfluenceService } from "../services/confluence.service";

import { ResolverGroup } from "../shared/types";
import { withResponse } from "../utils/helpers";

export function confluenceResolvers(
  answerService: ConfluenceService,
): ResolverGroup<"getCurrentUser"> {
  return {
    getCurrentUser: withResponse(async (request) => {
      const isAdmin = await answerService.isUserAdmin(
        request.context.accountId,
      );
      return {
        accountId: request.context.accountId,
        isAdmin,
      };
    }),
  };
}
