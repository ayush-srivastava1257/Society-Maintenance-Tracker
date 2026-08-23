import { prisma } from '../utils/prisma';
import { OverdueService } from './overdueService';

export class AnalyticsService {
  public static async getAdminDashboardData() {
    const thresholdDays = await OverdueService.getOverdueThresholdDays();
    const now = new Date();

    const [allComplaints, totalNotices] = await Promise.all([
      prisma.complaint.findMany({
        include: {
          resident: {
            select: { id: true, name: true, apartmentNo: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notice.count(),
    ]);

    const totalComplaints = allComplaints.length;
    let openCount = 0;
    let inProgressCount = 0;
    let resolvedCount = 0;
    let overdueCount = 0;

    const categoryMap: Record<string, number> = {
      Plumbing: 0,
      Electrical: 0,
      Cleaning: 0,
      Maintenance: 0,
      Security: 0,
      Other: 0,
    };

    const priorityMap: Record<string, number> = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
    };

    const overdueQueue: any[] = [];
    const resolvedDurations: number[] = [];

    // Recurring issue detection structure (apartment/block cluster)
    const apartmentClusters: Record<string, { count: number; categories: Record<string, number> }> = {};

    allComplaints.forEach((c) => {
      // Status counting
      if (c.status === 'OPEN') openCount++;
      else if (c.status === 'IN_PROGRESS') inProgressCount++;
      else if (c.status === 'RESOLVED') resolvedCount++;

      // Category & Priority
      if (categoryMap[c.category] !== undefined) {
        categoryMap[c.category]++;
      } else {
        categoryMap[c.category] = 1;
      }
      if (priorityMap[c.priority] !== undefined) {
        priorityMap[c.priority]++;
      }

      // Overdue check
      const overdueInfo = OverdueService.computeOverdueStatus(
        c.createdAt,
        c.status as any,
        thresholdDays,
        now
      );
      if (overdueInfo.isOverdue) {
        overdueCount++;
        overdueQueue.push({
          id: c.id,
          title: c.title,
          category: c.category,
          priority: c.priority,
          status: c.status,
          residentName: c.resident.name,
          apartmentNo: c.resident.apartmentNo || 'N/A',
          createdAt: c.createdAt,
          formattedOverdue: overdueInfo.formattedText,
        });
      }

      // Resolution time
      if (c.status === 'RESOLVED' && c.resolvedAt) {
        const diffMs = new Date(c.resolvedAt).getTime() - new Date(c.createdAt).getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        resolvedDurations.push(diffHours);
      }

      // Apartment cluster tracking
      const apt = c.resident.apartmentNo || 'General';
      if (!apartmentClusters[apt]) {
        apartmentClusters[apt] = { count: 0, categories: {} };
      }
      apartmentClusters[apt].count++;
      apartmentClusters[apt].categories[c.category] = (apartmentClusters[apt].categories[c.category] || 0) + 1;
    });

    // Calculate Average Resolution Time
    const avgResolutionHours =
      resolvedDurations.length > 0
        ? Math.round((resolvedDurations.reduce((a, b) => a + b, 0) / resolvedDurations.length) * 10) / 10
        : 0;

    // Derived Maintenance Insights (Real Database Data Driven)
    const insights: string[] = [];

    // Find top category
    const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];
    if (topCategory && topCategory[1] > 0) {
      const percentage = Math.round((topCategory[1] / (totalComplaints || 1)) * 100);
      insights.push(`**${topCategory[0]}** is the highest reported issue category (${percentage}% of total complaints).`);
    }

    // Find recurring apartment cluster
    const topApartment = Object.entries(apartmentClusters).sort((a, b) => b[1].count - a[1].count)[0];
    if (topApartment && topApartment[1].count >= 2) {
      insights.push(`Recurring complaints detected in **Apartment/Block ${topApartment[0]}** (${topApartment[1].count} issues reported).`);
    }

    if (overdueCount > 0) {
      insights.push(`**${overdueCount} complaint${overdueCount > 1 ? 's' : ''}** currently exceed the ${thresholdDays}-day resolution threshold.`);
    } else {
      insights.push(`All unresolved complaints are currently within the ${thresholdDays}-day SLA threshold.`);
    }

    if (avgResolutionHours > 0) {
      insights.push(`Average complaint resolution time is **${avgResolutionHours} hours**.`);
    }

    return {
      kpis: {
        totalComplaints,
        openCount,
        inProgressCount,
        resolvedCount,
        overdueCount,
        totalNotices,
        avgResolutionHours,
      },
      categoryDistribution: Object.entries(categoryMap).map(([name, count]) => ({ name, count })),
      priorityDistribution: Object.entries(priorityMap).map(([name, count]) => ({ name, count })),
      overdueQueue: overdueQueue.slice(0, 5), // top 5 overdue
      insights,
      overdueThresholdDays: thresholdDays,
    };
  }
}
