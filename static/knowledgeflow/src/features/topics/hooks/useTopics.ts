import { useApiRequest } from "../../../hooks/useApiRequest";
import { topicApi } from "../api/topicApi";

export function useTopics() {
  const fetch = useApiRequest(topicApi.fetchTopics);
  const create = useApiRequest(topicApi.createTopic);
  const update = useApiRequest(topicApi.updateTopic);
  const remove = useApiRequest(topicApi.deleteTopic);
  const cursor = useApiRequest(topicApi.fetchTopicsByCursor);

  return {
    fetch,
    create,
    update,
    remove,
    cursor,

    topics: fetch.data?.items ?? [],
    total: fetch.data?.total ?? 0,
  };
}
