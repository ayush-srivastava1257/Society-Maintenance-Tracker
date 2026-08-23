import React from 'react';
import { ComplaintHistory } from '../../types';
import { User, Clock, CheckCircle2, AlertCircle, Wrench } from 'lucide-react';

interface ComplaintTimelineProps {
  history: ComplaintHistory[];
}

export const ComplaintTimeline: React.FC<ComplaintTimelineProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="text-xs text-txt-muted font-medium italic">
        No status transitions recorded yet.
      </div>
    );
  }

  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <AlertCircle className="w-4 h-4 text-cream-warm" />;
      case 'IN_PROGRESS':
        return <Wrench className="w-4 h-4 text-semantic-warning" />;
      case 'RESOLVED':
        return <CheckCircle2 className="w-4 h-4 text-semantic-success" />;
      default:
        return <Clock className="w-4 h-4 text-teal-muted" />;
    }
  };

  return (
    <div className="relative pl-6 border-l-2 border-cream-border space-y-6">
      {sortedHistory.map((item, index) => {
        const isLatest = index === sortedHistory.length - 1;
        const actorName = item.actor?.name || 'Facility Admin';
        const actorRole = item.actor?.role || 'ADMIN';

        return (
          <div key={item.id} className="relative group">
            {/* Timeline Circle Bullet */}
            <div
              className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-navy-deep flex items-center justify-center ${
                isLatest
                  ? 'bg-cream-warm ring-4 ring-cream-warm/20'
                  : 'bg-teal-muted'
              }`}
            />

            <div className="bg-navy-midnight rounded-2xl border border-cream-border p-4 shadow-card space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(item.newStatus)}
                  <span className="text-xs font-extrabold text-cream-warm uppercase tracking-wider">
                    {item.newStatus === 'OPEN'
                      ? 'Complaint Submitted'
                      : item.newStatus === 'IN_PROGRESS'
                      ? 'In Progress'
                      : item.newStatus === 'RESOLVED'
                      ? 'Resolved'
                      : item.newStatus}
                  </span>
                </div>

                <span className="text-[11px] text-faded-blue font-mono font-medium shrink-0">
                  {formatDate(item.createdAt)}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs text-txt-muted">
                <User className="w-3.5 h-3.5 text-teal-muted" />
                <span className="font-semibold text-txt-main">
                  By {actorName} ({actorRole})
                </span>
              </div>

              {item.note && (
                <div className="mt-2 text-xs text-cream-warm/90 bg-surface-dark p-3 rounded-xl border border-cream-border/60 leading-relaxed font-medium">
                  "{item.note}"
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
