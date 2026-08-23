import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  ArrowRight,
  Sparkles,
  ClipboardList,
  Clock,
  Wrench,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { StatCard } from '../../components/dashboard/StatCard';
import { ComplaintCard } from '../../components/complaint/ComplaintCard';
import { NoticeCard } from '../../components/notice/NoticeCard';
import { CardSkeleton } from '../../components/common/Skeleton';
import { api } from '../../services/api';
import { ResidentDashboardData } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const ResidentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<ResidentDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await api.getResidentDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to fetch resident dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const totalCount = data?.kpis.totalSubmitted || 0;
  const openCount = data?.kpis.openCount || 0;
  const inProgressCount = data?.kpis.inProgressCount || 0;
  const resolvedCount = data?.kpis.resolvedCount || 0;

  const importantNotice = data?.latestNotices?.find((n) => n.isImportant);

  return (
    <Layout title="Resident Hub" onComplaintCreated={fetchDashboard}>
      {/* Apartment Hero Banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl border-[#E88D38]/40">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
          style={{ backgroundImage: `url('/bg_image.jpg')`, filter: 'brightness(0.4)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A121D] via-[#0A121D]/95 to-[#0A121D]/80 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-extrabold text-[#E88D38] uppercase tracking-wider">
              <Building className="w-4 h-4" />
              <span>Unit {user?.apartmentNo || 'A-402'} • Resident Portal</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#E9E3D2] tracking-tight">
              Welcome home, {user?.name?.split(' ')[0] || 'Resident'}
            </h1>
            <p className="text-xs text-[#A7B1B5] font-medium max-w-xl">
              Report issues, follow status updates, and stay informed with society announcements.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => navigate('/resident/complaints')}
              className="px-5 py-3 rounded-xl bg-[#E88D38] hover:bg-[#F09B48] text-[#0D1A28] font-extrabold text-xs shadow-lg hover:shadow-[0_0_25px_rgba(232,141,56,0.4)] transition-all active:scale-[0.98] flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Raise Complaint</span>
            </button>
          </div>
        </div>

        {/* 4-Stage Signature Complaint Lifecycle Stepper with High-Contrast Glass Pills */}
        <div className="relative z-10 mt-6 pt-5 border-t border-[#E88D38]/30 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl bg-[#121E2C] border border-[#E88D38]/50 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E88D38] shadow-[0_0_10px_#E88D38] shrink-0" />
            <span className="font-extrabold text-[#E9E3D2]">1. Submitted</span>
          </div>

          <div className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl bg-[#121E2C] border border-[#E88D38]/50 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E88D38] shadow-[0_0_10px_#E88D38] shrink-0" />
            <span className="font-extrabold text-[#E9E3D2]">2. Admin Reviewed</span>
          </div>

          <div className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl bg-[#121E2C] border border-[#E88D38]/50 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E88D38] shadow-[0_0_10px_#E88D38] shrink-0" />
            <span className="font-extrabold text-[#E9E3D2]">3. Work In Progress</span>
          </div>

          <div className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl bg-[#121E2C] border border-[#E88D38]/50 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E88D38] shadow-[0_0_10px_#E88D38] shrink-0" />
            <span className="font-extrabold text-[#E9E3D2]">4. Fully Resolved</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid with Matching Warm Dusk Orange Icons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Requests"
          value={openCount + inProgressCount}
          subtitle={`${openCount} open, ${inProgressCount} in progress`}
          icon={<Clock className="w-4 h-4 text-[#E88D38]" />}
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          subtitle="Assigned & being serviced"
          icon={<Wrench className="w-4 h-4 text-[#E88D38]" />}
        />
        <StatCard
          title="Resolved"
          value={resolvedCount}
          subtitle="Successfully completed"
          icon={<CheckCircle2 className="w-4 h-4 text-[#E88D38]" />}
        />
        <StatCard
          title="Total Submitted"
          value={totalCount}
          subtitle="Lifetime requests"
          icon={<ClipboardList className="w-4 h-4 text-[#E88D38]" />}
        />
      </div>

      {/* Pinned Important Notice Section */}
      {importantNotice && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-[#E9E3D2] uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#E88D38]" />
              <span>Pinned Important Notice</span>
            </h2>
            <button
              onClick={() => navigate('/resident/notices')}
              className="text-xs text-[#E88D38] hover:underline font-bold"
            >
              View All Notices →
            </button>
          </div>
          <NoticeCard notice={importantNotice} />
        </div>
      )}

      {/* Recent Complaints Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-normal text-[#E9E3D2]">Recent Maintenance Requests</h2>
          <button
            onClick={() => navigate('/resident/complaints')}
            className="text-xs font-bold text-[#E88D38] hover:underline flex items-center space-x-1"
          >
            <span>View All My Complaints ({totalCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (data?.recentComplaints || []).length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center space-y-3">
            <ClipboardList className="w-10 h-10 text-[#A7B1B5] mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-[#E9E3D2]">No complaints submitted yet</h3>
            <p className="text-xs text-[#A7B1B5] max-w-sm mx-auto">
              If you have any plumbing, electrical, or maintenance issues in your apartment, raise a request.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data?.recentComplaints || []).map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onClick={() => navigate(`/resident/complaints/${complaint.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
