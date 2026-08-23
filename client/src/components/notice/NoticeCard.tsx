import React from 'react';
import { Pin, Calendar, User, Trash2, Edit3 } from 'lucide-react';
import { Notice } from '../../types';

interface NoticeCardProps {
  notice: Notice;
  onEdit?: (notice: Notice) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onEdit, onDelete, isAdmin }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      className={`glass-card glass-card-hover rounded-2xl p-5 ${
        notice.isImportant
          ? 'border-[#E88D38]/60 shadow-[0_0_25px_rgba(232,141,56,0.2)]'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2">
            {notice.isImportant && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-[#E88D38]/20 text-[#E88D38] border border-[#E88D38]/40">
                <Pin className="w-3 h-3" />
                <span>PINNED IMPORTANT</span>
              </span>
            )}
            <span className="text-[11px] text-[#A7B1B5] font-semibold flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-[#E88D38]" />
              <span>{formatDate(notice.createdAt)}</span>
            </span>
          </div>

          <h3 className="font-serif text-lg font-normal text-[#E9E3D2] leading-snug">
            {notice.title}
          </h3>

          <p className="text-xs text-[#A7B1B5] font-medium leading-relaxed whitespace-pre-line">
            {notice.content}
          </p>

          {notice.author && (
            <div className="pt-2 flex items-center space-x-1.5 text-[11px] text-[#A7B1B5] font-semibold">
              <User className="w-3 h-3 text-[#E88D38]" />
              <span>Posted by {notice.author.name}</span>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="flex items-center space-x-1 shrink-0">
            {onEdit && (
              <button
                onClick={() => onEdit(notice)}
                className="p-2 rounded-xl text-[#A7B1B5] hover:text-[#E88D38] hover:bg-white/5 transition-colors"
                title="Edit Notice"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(notice.id)}
                className="p-2 rounded-xl text-[#A7B1B5] hover:text-semantic-danger hover:bg-semantic-danger/15 transition-colors"
                title="Delete Notice"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
