import {
  createTopicSchema,
  fetchTopicByCursorSchema,
  fetchTopicschema,
} from "../shared/schemas/topic.schema";
import { updateTopicSchema } from "../shared/schemas/topic.schema";
import { deleteTopicSchema } from "../shared/schemas/topic.schema";

import { TopicService } from "../services/topic.service";
import { validatePayload, withResponse } from "../utils/helpers";
import { ResolverGroup } from "../shared/types";

export function topicResolvers(
  topicService: TopicService,
): ResolverGroup<
  | "createTopic"
  | "fetchTopics"
  | "updateTopic"
  | "deleteTopic"
  | "fetchTopicsByCursor"
> {
  return {
    createTopic: withResponse(async (request) => {
      const input = createTopicSchema.parse(request.payload);

      return topicService.createTopic(input);
    }),

    fetchTopics: withResponse(async function (request) {
      const query = validatePayload(fetchTopicschema, request.payload);
      return topicService.fetchTopics(query);
    }),

    fetchTopicsByCursor: withResponse(async function (request) {
      const query = validatePayload(fetchTopicByCursorSchema, request.payload);
      return topicService.fetchTopicsByCursor(query);
    }),

    updateTopic: withResponse(async (request) => {
      const payload = validatePayload(updateTopicSchema, request.payload);
      return topicService.updateTopic(payload);
    }),

    deleteTopic: withResponse(async (request) => {
      const payload = validatePayload(deleteTopicSchema, request.payload);
      return topicService.deleteTopic(payload.id);
    }),
  };
}
