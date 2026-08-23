import { prisma } from '../utils/prisma';

export interface OverdueDetails {
  isOverdue: boolean;
  overdueThresholdDays: number;
  hoursElapsed: number;
  thresholdHours: number;
  formattedText: string;
}

export class OverdueService {
  public static async getOverdueThresholdDays(): Promise<number> {
    const setting = await prisma.setting.findUnique({
      where: { key: 'overdueThresholdDays' },
    });

    if (setting && setting.value) {
      const parsed = parseInt(setting.value, 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }

    const envDefault = parseInt(process.env.DEFAULT_OVERDUE_THRESHOLD_DAYS || '3', 10);
    return envDefault > 0 ? envDefault : 3;
  }

  public static computeOverdueStatus(
    createdAt: Date,
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED',
    thresholdDays: number,
    now: Date = new Date()
  ): OverdueDetails {
    if (status === 'RESOLVED') {
      return {
        isOverdue: false,
        overdueThresholdDays: thresholdDays,
        hoursElapsed: 0,
        thresholdHours: thresholdDays * 24,
        formattedText: 'Resolved',
      };
    }

    const elapsedMs = now.getTime() - new Date(createdAt).getTime();
    const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
    const thresholdHours = thresholdDays * 24;

    const isOverdue = elapsedHours > thresholdHours;

    if (isOverdue) {
      const diffHours = elapsedHours - thresholdHours;
      const days = Math.floor(diffHours / 24);
      const hours = diffHours % 24;

      let formattedText = 'Overdue by ';
      if (days > 0) {
        formattedText += `${days} day${days > 1 ? 's' : ''} `;
      }
      formattedText += `${hours} hour${hours !== 1 ? 's' : ''}`;

      return {
        isOverdue: true,
        overdueThresholdDays: thresholdDays,
        hoursElapsed: elapsedHours,
        thresholdHours,
        formattedText: formattedText.trim(),
      };
    } else {
      const remainingHours = thresholdHours - elapsedHours;
      const days = Math.floor(remainingHours / 24);
      const hours = remainingHours % 24;

      let formattedText = 'Due in ';
      if (days > 0) {
        formattedText += `${days} day${days > 1 ? 's' : ''} `;
      }
      formattedText += `${hours} hour${hours !== 1 ? 's' : ''}`;

      return {
        isOverdue: false,
        overdueThresholdDays: thresholdDays,
        hoursElapsed: elapsedHours,
        thresholdHours,
        formattedText: formattedText.trim(),
      };
    }
  }
}
