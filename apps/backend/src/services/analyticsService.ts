import { LeadModel } from '../models/Lead';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const toMonthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const formatMonthLabel = (key: string) => {
  const [year, month] = key.split('-').map(Number);
  return `${MONTH_LABELS[month - 1]} ${year}`;
};

export class AnalyticsService {
  static async getOverview() {
    const leads = await LeadModel.find({})
      .select('name email source status createdAt activityTimeline')
      .sort({ createdAt: -1 })
      .lean();

    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter((lead) => lead.status === 'Qualified').length;
    const lostLeads = leads.filter((lead) => lead.status === 'Lost').length;
    const conversionRate = totalLeads ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

    const sourceMap = new Map<string, number>();
    const statusMap = new Map<string, number>();
    const monthlyMap = new Map<string, number>();

    const activityFeed = leads
      .flatMap((lead) =>
        (lead.activityTimeline || []).map((activity) => ({
          id: `${lead._id}-${activity.timestamp?.toISOString?.() || activity.action}`,
          leadId: String(lead._id),
          leadName: lead.name,
          action: activity.action,
          timestamp: activity.timestamp,
          performedBy: String(activity.performedBy),
        }))
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 6);

    leads.forEach((lead) => {
      sourceMap.set(lead.source, (sourceMap.get(lead.source) || 0) + 1);
      statusMap.set(lead.status, (statusMap.get(lead.status) || 0) + 1);

      if (lead.createdAt) {
        const monthKey = toMonthKey(new Date(lead.createdAt));
        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1);
      }
    });

    const sortedMonthKeys = Array.from(monthlyMap.keys()).sort();
    const monthlyGrowth = sortedMonthKeys.map((key) => ({
      month: formatMonthLabel(key),
      value: monthlyMap.get(key) || 0,
    }));

    return {
      stats: {
        totalLeads,
        qualifiedLeads,
        lostLeads,
        conversionRate,
      },
      charts: {
        leadsBySource: Array.from(sourceMap.entries()).map(([name, value]) => ({ name, value })),
        leadsByStatus: Array.from(statusMap.entries()).map(([name, value]) => ({ name, value })),
        monthlyGrowth,
      },
      recentActivities: activityFeed,
    };
  }
}