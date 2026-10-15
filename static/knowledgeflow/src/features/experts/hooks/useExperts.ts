import { useApiRequest } from "../../../hooks/useApiRequest";
import { expertApi } from "../api/expertApi";

export function useExperts() {
  const assign = useApiRequest(expertApi.assignExpert);
  const fetch = useApiRequest(expertApi.fetchExperts);
  const findUsers = useApiRequest(expertApi.findUsers);
  const remove = useApiRequest(expertApi.removeExpert);

  return {
    assign,
    fetch,
    findUsers,
    remove,
  };
}