import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { NoticeCard } from '../../components/notice/NoticeCard';
import { NoticeModal } from '../../components/notice/NoticeModal';
import { EmptyState } from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/Skeleton';
import { api } from '../../services/api';
import { Notice } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminNoticeBoard: React.FC = () => {
  const { showToast } = useToast();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  const fetchNotices = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAllNotices();
      setNotices(res.notices);
    } catch (err) {
      console.error('Failed to fetch notices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreateNew = () => {
    setEditingNotice(null);
    setIsModalOpen(true);
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;

    try {
      await api.deleteNotice(id);
      showToast('success', 'Notice deleted successfully.');
      fetchNotices();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete notice.');
    }
  };

  return (
    <Layout title="Notice Board Management">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#E9E3D2] tracking-tight">
            Society Announcements & Notices
          </h1>
          <p className="text-xs text-[#A7B1B5] font-medium mt-0.5">
            Post official circulars and broadcast pinned important notices to all residents.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-5 py-3 rounded-xl bg-[#E88D38] hover:bg-[#F09B48] text-[#0D1A28] font-extrabold text-xs shadow-lg hover:shadow-[0_0_25px_rgba(232,141,56,0.4)] transition-all flex items-center space-x-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Notice</span>
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4 max-w-4xl">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : notices.length === 0 ? (
        <EmptyState
          title="No notices posted yet"
          description="Click 'Post New Notice' above to publish the first society announcement."
        />
      ) : (
        <div className="space-y-4 max-w-4xl">
          {notices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              isAdmin={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Notice Create/Edit Modal */}
      <NoticeModal
        isOpen={isModalOpen}
        notice={editingNotice}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNotice(null);
        }}
        onSuccess={fetchNotices}
      />
    </Layout>
  );
};
