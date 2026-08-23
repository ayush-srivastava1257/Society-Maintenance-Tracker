import React from 'react';
import { Status } from '../../types';
import { Clock, Wrench, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-xs',
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'OPEN':
        return {
          label: 'OPEN',
          icon: <Clock className="w-3 h-3 mr-1" />,
          classes: 'bg-navy-midnight text-cream-warm border border-cream-border font-bold',
        };
      case 'IN_PROGRESS':
        return {
          label: 'IN PROGRESS',
          icon: <Wrench className="w-3 h-3 mr-1" />,
          classes: 'bg-amber-950/40 text-semantic-warning border border-semantic-warning/40 font-bold',
        };
      case 'RESOLVED':
        return {
          label: 'RESOLVED',
          icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
          classes: 'bg-teal-muted/15 text-semantic-success border border-semantic-success/40 font-bold',
        };
      default:
        return {
          label: status,
          icon: null,
          classes: 'bg-surface-dark text-txt-muted border border-cream-border',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center font-extrabold rounded-lg tracking-wider uppercase ${sizeClasses[size]} ${config.classes}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};
