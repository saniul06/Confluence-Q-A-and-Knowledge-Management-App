import { questionApi } from "../api/questionApi";
import { useApiRequest } from "../../../hooks/useApiRequest";

export function useQuestions() {
  const fetch = useApiRequest(questionApi.list);

  const create = useApiRequest(questionApi.create);

  const get = useApiRequest(questionApi.get);

  const createAnswer = useApiRequest(questionApi.createAnswer);

  const acceptAnswer = useApiRequest(questionApi.acceptAnswer);

  return {
    fetch,
    create,
    get,
    createAnswer,
    acceptAnswer,
  };
}
