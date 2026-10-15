import { makeInvoke } from "@forge/bridge";

import type { Defs, Input } from "../../../../../../src/shared/types";

const invoke = makeInvoke<Defs>();

export const topicApi = {
  fetchTopics(query: Input<"fetchTopics">) {
    return invoke("fetchTopics", query);
  },

  fetchTopicsByCursor(query: Input<"fetchTopicsByCursor">) {
    return invoke("fetchTopicsByCursor", query);
  },

  createTopic(input: Input<"createTopic">) {
    return invoke("createTopic", input);
  },

  updateTopic(input: Input<"updateTopic">) {
    return invoke("updateTopic", input);
  },

  deleteTopic(input: Input<"deleteTopic">) {
    return invoke("deleteTopic", input);
  },
};