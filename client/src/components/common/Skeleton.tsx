import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="glass-card rounded-2xl p-5 border border-[#E88D38]/30 shadow-card animate-pulse space-y-4">
    <div className="h-4 bg-[#121E2C] rounded w-1/3"></div>
    <div className="h-6 bg-[#121E2C] rounded w-2/3"></div>
    <div className="h-4 bg-[#121E2C] rounded w-1/2"></div>
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="glass-card rounded-2xl border border-[#E88D38]/30 p-4 animate-pulse space-y-4">
    <div className="h-8 bg-[#121E2C] rounded w-full"></div>
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="h-12 bg-[#121E2C]/60 rounded w-full"></div>
    ))}
  </div>
);
