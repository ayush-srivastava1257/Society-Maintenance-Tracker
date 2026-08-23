import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { NoticeCard } from '../../components/notice/NoticeCard';
import { EmptyState } from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/Skeleton';
import { api } from '../../services/api';
import { Notice } from '../../types';

export const ResidentNoticeBoard: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    fetchNotices();
  }, []);

  return (
    <Layout title="Notice Board">
      {/* Section 13 Header */}
      <div>
        <h1 className="text-2xl font-black text-cream-warm tracking-tight">
          Community Notice Board
        </h1>
        <p className="text-xs text-txt-muted font-medium mt-0.5">
          "Important updates from your society."
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4 max-w-4xl">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : notices.length === 0 ? (
        <EmptyState
          title="No notices posted yet"
          description="There are currently no active announcements posted by administration."
        />
      ) : (
        <div className="space-y-4 max-w-4xl">
          {notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      )}
    </Layout>
  );
};
