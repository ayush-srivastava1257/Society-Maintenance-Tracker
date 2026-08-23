import React from 'react';
import { Priority } from '../../types';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
  };

  const getPriorityConfig = () => {
    switch (priority) {
      case 'HIGH':
        return {
          label: 'HIGH',
          classes: 'bg-rose-950/40 text-semantic-danger border border-semantic-danger/40 font-extrabold',
        };
      case 'MEDIUM':
        return {
          label: 'MEDIUM',
          classes: 'bg-amber-950/40 text-semantic-warning border border-semantic-warning/40 font-extrabold',
        };
      case 'LOW':
        return {
          label: 'LOW',
          classes: 'bg-navy-midnight text-semantic-info border border-semantic-info/40 font-bold',
        };
      default:
        return {
          label: priority,
          classes: 'bg-surface-dark text-txt-muted border border-cream-border',
        };
    }
  };

  const config = getPriorityConfig();

  return (
    <span
      className={`inline-flex items-center rounded-lg uppercase tracking-wider ${sizeClasses[size]} ${config.classes}`}
    >
      {config.label}
    </span>
  );
};
