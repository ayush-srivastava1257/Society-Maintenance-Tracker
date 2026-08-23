import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { OverdueInfo } from '../../types';

interface OverdueBadgeProps {
  overdueInfo?: OverdueInfo;
}

export const OverdueBadge: React.FC<OverdueBadgeProps> = ({ overdueInfo }) => {
  if (!overdueInfo) return null;

  if (overdueInfo.isOverdue) {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold bg-rose-950/50 text-semantic-danger border border-semantic-danger/50 animate-pulse">
        <AlertTriangle className="w-3 h-3 text-semantic-danger" />
        <span>{overdueInfo.formattedText}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-navy-midnight text-faded-blue border border-cream-border">
      <Clock className="w-3 h-3" />
      <span>{overdueInfo.formattedText}</span>
    </span>
  );
};
