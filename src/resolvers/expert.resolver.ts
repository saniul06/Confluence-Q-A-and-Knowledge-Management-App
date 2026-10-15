import { ExpertService } from "../services/expert.service";
import {
  assignExpertSchema,
  fetchExpertsSchema,
  removeExpertSchema,
  searchUsersSchema,
} from "../shared/schemas/expert.schema";
import { ResolverGroup } from "../shared/types";
import { validatePayload, withResponse } from "../utils/helpers";

export function expertResolvers(
  expertService: ExpertService,
): ResolverGroup<
  "fetchExperts" | "findUsers" | "assignExpert" | "removeExpert"
> {
  return {
    fetchExperts: withResponse(async (request) => {
      const payload = validatePayload(fetchExpertsSchema, request.payload);

      return expertService.getExperts(payload.topicId);
    }),

    findUsers: withResponse(async (request) => {
      const payload = validatePayload(searchUsersSchema, request.payload);

      return expertService.findConfluenceUsers(payload.start);
    }),

    assignExpert: withResponse(async (request) => {
      const payload = validatePayload(assignExpertSchema, request.payload);

      return expertService.assignExpert(payload);
    }),

    removeExpert: withResponse(async (request) => {
      const payload = validatePayload(removeExpertSchema, request.payload);

      return await expertService.removeExpert(payload.id);
    }),
  };
}
