import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Image as ImageIcon, Building } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { OverdueBadge } from '../../components/common/OverdueBadge';
import { ComplaintTimeline } from '../../components/complaint/ComplaintTimeline';
import { CardSkeleton } from '../../components/common/Skeleton';
import { api } from '../../services/api';
import { Complaint } from '../../types';

export const ResidentComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const res = await api.getComplaintById(id);
        setComplaint(res.complaint);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch complaint details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Layout title="Complaint Progress Detail">
      {/* Back Link */}
      <button
        onClick={() => navigate('/resident/complaints')}
        className="inline-flex items-center space-x-2 text-xs font-bold text-faded-blue hover:text-teal-muted transition-colors mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>← Back to My Complaints</span>
      </button>

      {isLoading ? (
        <CardSkeleton />
      ) : error || !complaint ? (
        <div className="bg-surface-dark rounded-2xl p-8 text-center text-semantic-danger border border-semantic-danger/30">
          {error || 'Complaint not found.'}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-surface-dark rounded-2xl border border-cream-border p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2.5 mb-2">
                <span className="text-xs font-mono font-bold text-txt-muted">
                  #{complaint.id.substring(0, 8)}
                </span>
                <OverdueBadge overdueInfo={complaint.overdueInfo} />
                <PriorityBadge priority={complaint.priority} />
              </div>
              <h1 className="text-2xl font-black text-cream-warm leading-tight">
                {complaint.title}
              </h1>
            </div>

            <StatusBadge status={complaint.status} size="lg" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Side: Photo & Metadata */}
            <div className="lg:col-span-5 space-y-6">
              {complaint.photoUrl && (
                <div className="bg-surface-dark rounded-2xl border border-cream-border p-5 shadow-card space-y-3">
                  <h3 className="text-xs font-extrabold text-cream-warm uppercase tracking-wider flex items-center space-x-1.5">
                    <ImageIcon className="w-4 h-4 text-teal-muted" />
                    <span>Attached Photo Evidence</span>
                  </h3>
                  <div className="rounded-xl overflow-hidden border border-cream-border bg-navy-midnight">
                    <img
                      src={complaint.photoUrl}
                      alt="Complaint Evidence"
                      className="w-full h-auto object-cover max-h-72"
                    />
                  </div>
                </div>
              )}

              <div className="bg-surface-dark rounded-2xl border border-cream-border p-6 shadow-card space-y-4">
                <h3 className="text-xs font-extrabold text-cream-warm uppercase tracking-wider border-b border-cream-border pb-2">
                  Complaint Details
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-txt-muted block mb-0.5 font-medium">Category</span>
                    <span className="font-bold text-teal-muted flex items-center space-x-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{complaint.category}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-txt-muted block mb-0.5 font-medium">Apartment</span>
                    <span className="font-bold text-cream-warm flex items-center space-x-1">
                      <Building className="w-3.5 h-3.5" />
                      <span>Apt {complaint.resident?.apartmentNo || 'A-402'}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-txt-muted block mb-0.5 font-medium">Reported Date</span>
                    <span className="font-medium text-txt-main flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(complaint.createdAt)}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-txt-muted block mb-0.5 font-medium">Urgency</span>
                    <PriorityBadge priority={complaint.priority} />
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-extrabold text-cream-warm uppercase tracking-wider block mb-1.5">
                    Description
                  </span>
                  <p className="text-xs text-txt-main leading-relaxed bg-navy-midnight p-4 rounded-xl border border-cream-border whitespace-pre-line font-medium">
                    {complaint.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: Section 11 Vertical Timeline Stepper */}
            <div className="lg:col-span-7">
              <div className="bg-surface-dark rounded-2xl border border-cream-border p-6 shadow-card">
                <h2 className="text-base font-extrabold text-cream-warm mb-6 pb-3 border-b border-cream-border uppercase tracking-wider">
                  PROGRESS TIMELINE
                </h2>
                <ComplaintTimeline history={complaint.history || []} />
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
