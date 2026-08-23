import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';
import { OverdueService } from '../services/overdueService';

export const getSettings = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const overdueThresholdDays = await OverdueService.getOverdueThresholdDays();
    const settings = await prisma.setting.findMany();

    const settingsMap: Record<string, string> = {
      overdueThresholdDays: overdueThresholdDays.toString(),
      emailNotificationsEnabled: 'true',
      importantNoticeEmailEnabled: 'true',
    };

    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    res.status(200).json({ settings: settingsMap });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Forbidden: Admin access required' });
      return;
    }

    const { overdueThresholdDays, emailNotificationsEnabled, importantNoticeEmailEnabled } = req.body;

    if (overdueThresholdDays !== undefined) {
      const days = parseInt(overdueThresholdDays, 10);
      if (isNaN(days) || days <= 0) {
        res.status(400).json({ message: 'Overdue threshold days must be a positive integer.' });
        return;
      }

      await prisma.setting.upsert({
        where: { key: 'overdueThresholdDays' },
        update: { value: days.toString() },
        create: { key: 'overdueThresholdDays', value: days.toString() },
      });
    }

    if (emailNotificationsEnabled !== undefined) {
      await prisma.setting.upsert({
        where: { key: 'emailNotificationsEnabled' },
        update: { value: String(Boolean(emailNotificationsEnabled)) },
        create: { key: 'emailNotificationsEnabled', value: String(Boolean(emailNotificationsEnabled)) },
      });
    }

    if (importantNoticeEmailEnabled !== undefined) {
      await prisma.setting.upsert({
        where: { key: 'importantNoticeEmailEnabled' },
        update: { value: String(Boolean(importantNoticeEmailEnabled)) },
        create: { key: 'importantNoticeEmailEnabled', value: String(Boolean(importantNoticeEmailEnabled)) },
      });
    }

    const updatedThreshold = await OverdueService.getOverdueThresholdDays();

    res.status(200).json({
      message: 'Settings updated successfully',
      settings: {
        overdueThresholdDays: updatedThreshold.toString(),
        emailNotificationsEnabled: String(emailNotificationsEnabled ?? true),
        importantNoticeEmailEnabled: String(importantNoticeEmailEnabled ?? true),
      },
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
};
