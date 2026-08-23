import React from 'react';
import { Complaint } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { OverdueBadge } from '../common/OverdueBadge';
import { Calendar, ArrowRight } from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
  onClick?: () => void;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onClick }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      onClick={onClick}
      className="glass-card glass-card-hover rounded-2xl p-5 cursor-pointer space-y-4 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1 mb-1">
            <StatusBadge status={complaint.status} size="sm" />
            <PriorityBadge priority={complaint.priority} size="sm" />
            {complaint.overdueInfo && <OverdueBadge overdueInfo={complaint.overdueInfo} />}
          </div>

          <h3 className="font-serif text-lg font-normal text-[#E9E3D2] group-hover:text-[#E88D38] transition-colors leading-snug">
            {complaint.title}
          </h3>
        </div>

        {complaint.photoUrl && (
          <div className="w-12 h-12 rounded-xl bg-[#121E2C] border border-[#E88D38]/30 overflow-hidden shrink-0 flex items-center justify-center">
            <img
              src={complaint.photoUrl}
              alt="Evidence"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
      </div>

      <p className="text-xs text-[#A7B1B5] font-medium line-clamp-2 leading-relaxed">
        {complaint.description}
      </p>

      <div className="pt-3 border-t border-[#E88D38]/15 flex items-center justify-between text-xs text-[#A7B1B5]">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-[#E9E3D2]">{complaint.category}</span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-[#E88D38]" />
            <span>{formatDate(complaint.createdAt)}</span>
          </span>
        </div>

        <span className="text-[#E88D38] font-bold flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
