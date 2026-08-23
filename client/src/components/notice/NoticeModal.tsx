import React, { useState, useEffect } from 'react';
import { X, Pin, AlertCircle, BellRing, Bell } from 'lucide-react';
import { api } from '../../services/api';
import { Notice } from '../../types';
import { useToast } from '../../context/ToastContext';

interface NoticeModalProps {
  isOpen: boolean;
  notice?: Notice | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({
  isOpen,
  notice,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (notice) {
      setTitle(notice.title);
      setContent(notice.content);
      setIsImportant(notice.isImportant);
    } else {
      setTitle('');
      setContent('');
      setIsImportant(false);
    }
  }, [notice, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError('Please provide both title and description.');
      return;
    }

    setIsLoading(true);

    try {
      if (notice) {
        await api.updateNotice(notice.id, {
          title: title.trim(),
          content: content.trim(),
          isImportant,
        });
        showToast('success', 'Notice updated successfully!');
      } else {
        await api.createNotice({
          title: title.trim(),
          content: content.trim(),
          isImportant,
        });
        showToast('success', 'Notice published successfully!');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save notice.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative animate-page-enter">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#A7B1B5] hover:text-[#E9E3D2] p-1.5 rounded-xl hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#E88D38]/20 border border-[#E88D38]/40 flex items-center justify-center text-[#E88D38]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#E9E3D2]">
              {notice ? 'Edit Notice' : 'Post Community Notice'}
            </h2>
            <p className="text-xs text-[#A7B1B5]">
              Broadcast official circulars and maintenance updates to residents.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-[#C96A6A]/15 border border-[#C96A6A]/40 rounded-xl flex items-center space-x-2.5 text-[#C96A6A] text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-extrabold text-[#E9E3D2] uppercase tracking-wider mb-1">
              NOTICE TITLE *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Overhead Water Tank Cleaning Schedule"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E88D38]/25 bg-[#121E2C] text-[#F3F0E8] focus:outline-none focus:border-[#E88D38] text-xs font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-[#E9E3D2] uppercase tracking-wider mb-1">
              NOTICE DESCRIPTION *
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide complete details, dates, timings, and resident action required..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#E88D38]/25 bg-[#121E2C] text-[#F3F0E8] focus:outline-none focus:border-[#E88D38] text-xs font-medium resize-none"
              required
            />
          </div>

          {/* Important Notice Toggle */}
          <div className="p-4 bg-[#121E2C]/90 rounded-2xl border border-[#E88D38]/30 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-xs font-extrabold text-[#E9E3D2] cursor-pointer select-none">
                <Pin className="w-4 h-4 text-[#E88D38]" />
                <span>Mark as Important Notice?</span>
              </label>

              <button
                type="button"
                onClick={() => setIsImportant(!isImportant)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  isImportant ? 'bg-[#E88D38]' : 'bg-white/20'
                }`}
                role="switch"
                aria-checked={isImportant}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isImportant ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {isImportant && (
              <p className="text-[11px] text-[#A7B1B5] font-medium leading-relaxed flex items-start space-x-1.5 pt-1">
                <BellRing className="w-3.5 h-3.5 text-[#E88D38] shrink-0 mt-0.5" />
                <span>
                  Important notices will be pinned to the top and residents will receive an email notification.
                </span>
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E88D38]/30 text-xs font-bold text-[#A7B1B5] hover:text-[#E9E3D2]"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-[#E88D38] hover:bg-[#F09B48] text-[#0D1A28] font-extrabold text-xs shadow-md transition-all disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : notice ? 'Update Notice' : 'Publish Notice →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
