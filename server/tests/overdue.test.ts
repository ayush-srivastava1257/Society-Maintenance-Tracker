import { OverdueService } from '../src/services/overdueService';

describe('Overdue Detection Service', () => {
  const thresholdDays = 3; // 3 days threshold

  it('should flag unresolved complaint created 5 days ago as overdue', () => {
    const now = new Date('2026-08-21T12:00:00Z');
    const createdAt = new Date('2026-08-16T12:00:00Z'); // 5 days (120 hours) ago

    const result = OverdueService.computeOverdueStatus(createdAt, 'OPEN', thresholdDays, now);

    expect(result.isOverdue).toBe(true);
    expect(result.hoursElapsed).toBe(120);
    expect(result.thresholdHours).toBe(72); // 3 * 24 = 72
    expect(result.formattedText).toBe('Overdue by 2 days 0 hours');
  });

  it('should NOT flag resolved complaint as overdue even if created 10 days ago', () => {
    const now = new Date('2026-08-21T12:00:00Z');
    const createdAt = new Date('2026-08-11T12:00:00Z');

    const result = OverdueService.computeOverdueStatus(createdAt, 'RESOLVED', thresholdDays, now);

    expect(result.isOverdue).toBe(false);
    expect(result.formattedText).toBe('Resolved');
  });

  it('should return due time remaining for complaint within threshold', () => {
    const now = new Date('2026-08-21T12:00:00Z');
    const createdAt = new Date('2026-08-20T18:00:00Z'); // 18 hours ago

    const result = OverdueService.computeOverdueStatus(createdAt, 'IN_PROGRESS', thresholdDays, now);

    expect(result.isOverdue).toBe(false);
    // threshold = 72 hrs, elapsed = 18 hrs => remaining = 54 hrs = 2 days 6 hours
    expect(result.formattedText).toBe('Due in 2 days 6 hours');
  });
});
