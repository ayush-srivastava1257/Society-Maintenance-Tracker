import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Clock,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Bell,
  ShieldCheck,
} from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { StatCard } from '../../components/dashboard/StatCard';
import { CategoryChart } from '../../components/dashboard/CategoryChart';
import { PriorityChart } from '../../components/dashboard/PriorityChart';
import { InsightsCard } from '../../components/dashboard/InsightsCard';
import { ComplaintTable } from '../../components/complaint/ComplaintTable';
import { CardSkeleton } from '../../components/common/Skeleton';
import { api } from '../../services/api';
import { AdminDashboardData } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAdminDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to fetch admin dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const overdueCount = data?.kpis.overdueCount || 0;

  return (
    <Layout title="Facility Command Center" onComplaintCreated={fetchDashboard}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#E88D38] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Society Maintenance</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#E9E3D2] tracking-tight">
            Good morning, {user?.name?.split(' ')[0] || 'Rajesh'}
          </h1>
          <p className="text-xs text-[#A7B1B5] font-medium mt-0.5">
            "Here's what needs attention today."
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/admin/settings')}
            className="px-4 py-2.5 rounded-xl glass-card hover:bg-[#121E2C] text-[#E9E3D2] font-bold text-xs shadow-sm transition-all"
          >
            SLA Threshold: {data?.overdueThresholdDays || 3} Days
          </button>
          <button
            onClick={() => navigate('/admin/notices')}
            className="px-4 py-2.5 rounded-xl bg-[#E88D38] hover:bg-[#F09B48] text-[#0D1A28] font-extrabold text-xs shadow-md hover:shadow-[0_0_20px_rgba(232,141,56,0.35)] transition-all flex items-center space-x-2 shrink-0 active:scale-[0.98]"
          >
            <Bell className="w-4 h-4" />
            <span>Post Notice</span>
          </button>
        </div>
      </div>

      {/* Floating Glass HERO Box: ATTENTION REQUIRED (Overdue SLA Queue) */}
      <div className="glass-card rounded-3xl border-2 border-[#C96A6A]/60 p-6 md:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E88D38]/20 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-extrabold text-[#C96A6A] uppercase tracking-widest mb-0.5">
              <AlertTriangle className="w-4 h-4" />
              <span>ATTENTION REQUIRED</span>
            </div>
            <h2 className="font-serif text-xl font-bold text-[#E9E3D2] tracking-tight">
              {overdueCount} complaint{overdueCount === 1 ? '' : 's'} are beyond the resolution threshold
            </h2>
          </div>

          <button
            onClick={() => navigate('/admin/complaints')}
            className="px-4 py-2 rounded-xl bg-[#C96A6A]/20 text-[#C96A6A] border border-[#C96A6A]/40 font-extrabold text-xs hover:bg-[#C96A6A]/30 transition-all flex items-center space-x-1.5 shrink-0 self-start sm:self-auto"
          >
            <span>Review Queue →</span>
          </button>
        </div>

        {isLoading ? (
          <CardSkeleton />
        ) : (
          <ComplaintTable
            complaints={(data?.overdueQueue || []).map((item) => ({
              id: item.id,
              title: item.title,
              category: item.category,
              priority: item.priority,
              status: item.status,
              residentId: item.id,
              description: item.title,
              createdAt: item.createdAt,
              updatedAt: item.createdAt,
              resident: {
                id: item.id,
                email: 'resident@societyos.app',
                name: item.residentName,
                apartmentNo: item.apartmentNo,
              },
              overdueInfo: {
                isOverdue: true,
                overdueThresholdDays: data?.overdueThresholdDays || 3,
                hoursElapsed: 72,
                thresholdHours: 72,
                formattedText: item.formattedOverdue,
              },
            }))}
            onSelectComplaint={(c) => navigate(`/admin/complaints/${c.id}`)}
            onOpenStatusModal={() => {}}
          />
        )}
      </div>

      {/* Floating Glass Compact Metrics Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard
            title="Total"
            value={data?.kpis.totalComplaints || 0}
            icon={<ClipboardList className="w-4 h-4 text-[#E88D38]" />}
          />
          <StatCard
            title="Open"
            value={data?.kpis.openCount || 0}
            icon={<Clock className="w-4 h-4 text-[#E88D38]" />}
          />
          <StatCard
            title="In Progress"
            value={data?.kpis.inProgressCount || 0}
            icon={<Wrench className="w-4 h-4 text-[#E88D38]" />}
          />
          <StatCard
            title="Resolved"
            value={data?.kpis.resolvedCount || 0}
            icon={<CheckCircle2 className="w-4 h-4 text-[#E88D38]" />}
          />
          <StatCard
            title="Overdue"
            value={overdueCount}
            icon={<AlertTriangle className="w-4 h-4 text-[#C96A6A]" />}
          />
        </div>
      )}

      {/* Maintenance Insights Engine Banner */}
      {data?.insights && <InsightsCard insights={data.insights} />}

      {/* Floating Glass Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityChart data={data?.priorityDistribution || []} />
        <CategoryChart data={data?.categoryDistribution || []} />
      </div>
    </Layout>
  );
};
