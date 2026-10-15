import { DashboardRepository } from "../repositories/dashboard/dashboard.repository";


export class DashboardService {
  constructor(
    private readonly dashboardRepository: DashboardRepository,
  ) {}

  async getDashboardData() {
    return await this.dashboardRepository.getDashboardData();
  }
}