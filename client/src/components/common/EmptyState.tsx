import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Inbox className="w-10 h-10 text-[#E88D38]" />,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="glass-card glass-card-hover rounded-3xl p-8 text-center flex flex-col items-center justify-center space-y-4 my-4 shadow-2xl">
      <div className="p-4 rounded-2xl bg-[#121E2C]/80 border border-[#E88D38]/30 shadow-md">
        {icon}
      </div>
      <div>
        <h3 className="font-serif text-xl font-normal text-[#E9E3D2] mb-1">{title}</h3>
        <p className="text-xs text-[#A7B1B5] max-w-sm mx-auto font-medium leading-relaxed">
          {description}
        </p>
      </div>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary" className="mt-2">
          {actionText}
        </Button>
      )}
    </div>
  );
};
