import api from "@/lib/api";
import { DashboardAnalytics } from "@/types";

export const analyticsService = {
  async getDashboard(): Promise<DashboardAnalytics> {
    const response = await api.get<DashboardAnalytics>("/analytics/dashboard");

    return response.data;
  }
};
