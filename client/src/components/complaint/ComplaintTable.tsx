import React from 'react';
import { Complaint } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { OverdueBadge } from '../common/OverdueBadge';
import { Calendar, User, ArrowRight, Wrench } from 'lucide-react';

interface ComplaintTableProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onOpenStatusModal: (complaint: Complaint) => void;
}

export const ComplaintTable: React.FC<ComplaintTableProps> = ({
  complaints,
  onSelectComplaint,
  onOpenStatusModal,
}) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-[#0A121D]/80 backdrop-blur-2xl rounded-2xl border border-[#E88D38]/30 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#121E2C]/90 text-[#A7B1B5] border-b border-[#E88D38]/20 font-extrabold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Complaint</th>
              <th className="py-3.5 px-4">Resident / Apt</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Status & SLA</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E88D38]/15 text-[#E9E3D2]">
            {complaints.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-white/5 transition-colors cursor-pointer group"
                onClick={() => onSelectComplaint(c)}
              >
                <td className="py-3.5 px-4 font-medium">
                  <div className="font-serif text-sm font-normal text-[#E9E3D2] group-hover:text-[#E88D38] transition-colors">
                    {c.title}
                  </div>
                  <span className="text-[10px] text-[#A7B1B5] block truncate max-w-xs">
                    {c.description}
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#E9E3D2]">
                    {c.resident?.name || 'Resident'}
                  </div>
                  <span className="text-[10px] text-[#E88D38] font-mono">
                    Apt {c.resident?.apartmentNo || 'N/A'}
                  </span>
                </td>

                <td className="py-3.5 px-4 font-semibold text-[#A7B1B5]">{c.category}</td>

                <td className="py-3.5 px-4">
                  <PriorityBadge priority={c.priority} size="sm" />
                </td>

                <td className="py-3.5 px-4 space-y-1">
                  <div>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                  {c.overdueInfo && <div><OverdueBadge overdueInfo={c.overdueInfo} /></div>}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenStatusModal(c);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#E88D38] hover:bg-[#F09B48] text-[#0D1A28] font-extrabold text-[11px] shadow-sm transition-all flex items-center space-x-1 ml-auto"
                  >
                    <Wrench className="w-3 h-3" />
                    <span>Update Status</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
