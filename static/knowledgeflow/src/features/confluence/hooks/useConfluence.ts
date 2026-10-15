import { useApiRequest } from "../../../hooks/useApiRequest";
import { confluenceApi } from "../api/confluenceApi";

export function useConfluence() {
  const getCurrentUser = useApiRequest(confluenceApi.getCurrentUser);

  return {
    getCurrentUser,
  };
}
