import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';

export interface AnalyticsStatSet {
  totalLeads: number;
  qualifiedLeads: number;
  lostLeads: number;
  conversionRate: number;
}

export interface AnalyticsChartItem {
  name: string;
  value: number;
}

export interface AnalyticsMonthItem {
  month: string;
  value: number;
}

export interface AnalyticsActivityItem {
  id: string;
  leadId: string;
  leadName: string;
  action: string;
  timestamp: string;
  performedBy: string;
}

export interface AnalyticsOverviewResponse {
  stats: AnalyticsStatSet;
  charts: {
    leadsBySource: AnalyticsChartItem[];
    leadsByStatus: AnalyticsChartItem[];
    monthlyGrowth: AnalyticsMonthItem[];
  };
  recentActivities: AnalyticsActivityItem[];
}

const fetchAnalyticsOverview = async (): Promise<AnalyticsOverviewResponse> => {
  const response = await api.get('/analytics/overview');
  return response.data.data;
};

export const useAnalyticsOverview = () => {
  return useQuery({
    queryKey: ['analytics-overview'],
    queryFn: fetchAnalyticsOverview,
  });
};