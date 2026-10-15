import { useApiRequest } from "../../../hooks/useApiRequest";
import { faqApi } from "../api/faqApi";

export function useFaq() {
  const getDefaultKey = useApiRequest(faqApi.getDefaultFaqSpaceKey);
  const sedDefaultKey = useApiRequest(faqApi.setDefaultFaqSpaceKey);
  const getAllSpaceKeys = useApiRequest(faqApi.getAllSpaceKeys);
  const publishFaq = useApiRequest(faqApi.publishFaq);

  return {
    getDefaultKey,
    sedDefaultKey,
    getAllSpaceKeys,
    publishFaq,
  };
}
