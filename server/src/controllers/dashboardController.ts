import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';
import { AnalyticsService } from '../services/analyticsService';
import { OverdueService } from '../services/overdueService';

export const getAdminDashboard = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await AnalyticsService.getAdminDashboardData();
    res.status(200).json(data);
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch admin dashboard analytics' });
  }
};

export const getResidentDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const thresholdDays = await OverdueService.getOverdueThresholdDays();

    const [myComplaints, latestNotices] = await Promise.all([
      prisma.complaint.findMany({
        where: { residentId: req.user.id },
        include: {
          history: {
            include: { actor: { select: { id: true, name: true, role: true } } },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notice.findMany({
        take: 3,
        orderBy: [{ isImportant: 'desc' }, { createdAt: 'desc' }],
        include: { author: { select: { name: true } } },
      }),
    ]);

    let activeCount = 0;
    let openCount = 0;
    let inProgressCount = 0;
    let resolvedCount = 0;
    let overdueCount = 0;

    const now = new Date();

    const enrichedComplaints = myComplaints.map((c) => {
      if (c.status === 'OPEN') {
        openCount++;
        activeCount++;
      } else if (c.status === 'IN_PROGRESS') {
        inProgressCount++;
        activeCount++;
      } else if (c.status === 'RESOLVED') {
        resolvedCount++;
      }

      const overdueInfo = OverdueService.computeOverdueStatus(
        c.createdAt,
        c.status as any,
        thresholdDays,
        now
      );
      if (overdueInfo.isOverdue) {
        overdueCount++;
      }

      return {
        ...c,
        overdueInfo,
      };
    });

    res.status(200).json({
      kpis: {
        activeCount,
        openCount,
        inProgressCount,
        resolvedCount,
        overdueCount,
        totalSubmitted: myComplaints.length,
      },
      recentComplaints: enrichedComplaints.slice(0, 5),
      latestNotices,
    });
  } catch (error) {
    console.error('Resident dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch resident dashboard data' });
  }
};
