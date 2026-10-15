import { useApiRequest } from "../../../hooks/useApiRequest";
import { dashboardApi } from "../api/dashboardApi";

export function useDashboard() {
  const fetch = useApiRequest(dashboardApi.getDashboardData);

  return {
    fetch,
  };
}
