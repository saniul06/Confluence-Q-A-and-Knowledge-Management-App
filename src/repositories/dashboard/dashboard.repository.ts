import type { DashboardData } from "../../shared/types/dashboard.type";

export interface DashboardRepository {
  getDashboardData(): Promise<DashboardData>;
}
