import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  colorScheme?: 'emerald' | 'teal' | 'amber' | 'rose' | 'slate';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
}) => {
  return (
    <div className="glass-card glass-card-hover rounded-2xl p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E9E3D2]">
          {title}
        </span>
        {icon && <div className="text-[#E88D38]">{icon}</div>}
      </div>

      <div className="mt-2">
        <div className="font-serif text-3xl font-normal text-[#E9E3D2] tracking-tight">
          {value}
        </div>
        {subtitle && (
          <p className="text-[11px] text-[#D8D1BF] font-semibold mt-1 leading-snug">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
