import { DashboardService } from "../services/dashboard.service";

import { ResolverGroup } from "../shared/types";
import {withResponse } from "../utils/helpers";

export function dashboardResolvers(
  dashboardService: DashboardService,
): ResolverGroup<"getDashboardData"> {
  return {
    getDashboardData: withResponse(async (request) => {
      return dashboardService.getDashboardData();
    }),
  };
}
