import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Building, Calendar, Wrench, ShieldCheck } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { OverdueBadge } from '../../components/common/OverdueBadge';
import { ComplaintTimeline } from '../../components/complaint/ComplaintTimeline';
import { StatusUpdateModal } from '../../components/complaint/StatusUpdateModal';
import { CardSkeleton } from '../../components/common/Skeleton';
import { api } from '../../services/api';
import { Complaint } from '../../types';

export const AdminComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const fetchComplaint = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const res = await api.getComplaintById(id);
      setComplaint(res.complaint);
    } catch (err) {
      console.error('Failed to fetch complaint detail:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
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
    <Layout title="Complaint Audit Detail">
      <div className="space-y-6">
        <button
          onClick={() => navigate('/admin/complaints')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#A7B1B5] hover:text-[#E88D38] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to All Complaints</span>
        </button>

        {isLoading ? (
          <CardSkeleton />
        ) : !complaint ? (
          <div className="text-center py-12 text-[#A7B1B5]">Complaint not found.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Floating Glass Complaint Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#0A121D]/80 backdrop-blur-2xl rounded-3xl border border-[#E88D38]/30 p-6 md:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.8)] space-y-6">
                <div className="flex items-start justify-between gap-4 border-b border-[#E88D38]/20 pb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <StatusBadge status={complaint.status} />
                      <PriorityBadge priority={complaint.priority} />
                      {complaint.overdueInfo && <OverdueBadge overdueInfo={complaint.overdueInfo} />}
                    </div>

                    <h1 className="font-serif text-2xl md:text-3xl font-normal text-[#E9E3D2]">
                      {complaint.title}
                    </h1>
                  </div>

                  <button
                    onClick={() => setIsStatusModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#E88D38] hover:bg-[#F09B48] text-[#0D1A28] font-extrabold text-xs shadow-md transition-all flex items-center space-x-1.5 shrink-0"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Update Status</span>
                  </button>
                </div>

                {/* Resident Details */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#121E2C]/80 border border-[#E88D38]/20 text-xs">
                  <div>
                    <span className="text-[#A7B1B5] block mb-0.5 font-medium flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-[#E88D38]" />
                      <span>Resident Name</span>
                    </span>
                    <span className="font-bold text-[#E9E3D2]">
                      {complaint.resident?.name || 'Resident'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#A7B1B5] block mb-0.5 font-medium flex items-center space-x-1">
                      <Building className="w-3.5 h-3.5 text-[#E88D38]" />
                      <span>Apartment Unit</span>
                    </span>
                    <span className="font-bold text-[#E88D38] font-mono">
                      {complaint.resident?.apartmentNo || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xs font-extrabold text-[#E9E3D2] uppercase tracking-wider mb-2">
                    Description & Details
                  </h3>
                  <p className="text-xs text-[#A7B1B5] leading-relaxed whitespace-pre-line font-medium bg-[#121E2C]/50 p-4 rounded-2xl border border-[#E88D38]/15">
                    {complaint.description}
                  </p>
                </div>

                {/* Attached Photo Evidence */}
                {complaint.photoUrl && (
                  <div>
                    <h3 className="text-xs font-extrabold text-[#E9E3D2] uppercase tracking-wider mb-2">
                      Photo Evidence Attachment
                    </h3>
                    <div className="rounded-2xl border border-[#E88D38]/30 overflow-hidden max-w-md max-h-72 bg-black/40">
                      <img
                        src={complaint.photoUrl}
                        alt="Complaint evidence"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Floating Glass Vertical Audit Timeline */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#0A121D]/80 backdrop-blur-2xl rounded-3xl border border-[#E88D38]/30 p-6 md:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.8)] space-y-6">
                <div className="flex items-center space-x-2 border-b border-[#E88D38]/20 pb-3">
                  <ShieldCheck className="w-4 h-4 text-[#E88D38]" />
                  <h2 className="text-xs font-extrabold text-[#E9E3D2] uppercase tracking-wider">
                    Immutable Audit Trail
                  </h2>
                </div>

                <ComplaintTimeline history={complaint.history || []} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {complaint && (
        <StatusUpdateModal
          isOpen={isStatusModalOpen}
          complaint={complaint}
          onClose={() => setIsStatusModalOpen(false)}
          onSuccess={fetchComplaint}
        />
      )}
    </Layout>
  );
};
