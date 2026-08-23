import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { ComplaintTable } from '../../components/complaint/ComplaintTable';
import { StatusUpdateModal } from '../../components/complaint/StatusUpdateModal';
import { EmptyState } from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/Skeleton';
import { api } from '../../services/api';
import { Complaint } from '../../types';

export const AdminComplaints: React.FC = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const filters: any = {};
      if (statusFilter !== 'ALL') filters.status = statusFilter;
      if (categoryFilter !== 'ALL') filters.category = categoryFilter;
      if (priorityFilter !== 'ALL') filters.priority = priorityFilter;
      if (search.trim()) filters.search = search.trim();

      const res = await api.getAllComplaints(filters);
      setComplaints(res.complaints);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, categoryFilter, priorityFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchComplaints();
  };

  return (
    <Layout title="All Complaints Management" onComplaintCreated={fetchComplaints}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#E9E3D2] tracking-tight">
            Society Complaints Queue
          </h1>
          <p className="text-xs text-[#A7B1B5] font-medium mt-0.5">
            Review, prioritize, assign, and update resolution progress.
          </p>
        </div>

        <button
          onClick={fetchComplaints}
          className="px-4 py-2.5 rounded-xl bg-[#0A121D]/80 backdrop-blur-xl border border-[#E88D38]/30 hover:bg-[#121E2C] text-[#E9E3D2] font-bold text-xs shadow-sm transition-all flex items-center space-x-2 shrink-0 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#E88D38]" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Floating Glass Filter Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-[#0A121D]/80 backdrop-blur-2xl rounded-2xl border border-[#E88D38]/30 p-4 shadow-card flex flex-col md:flex-row gap-3 items-center justify-between"
      >
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#A7B1B5] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, resident, apt..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E88D38]/25 bg-[#121E2C] text-[#F3F0E8] focus:outline-none focus:border-[#E88D38] text-xs font-medium"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto flex-wrap gap-y-2 justify-end">
          <div className="flex items-center space-x-1.5 text-xs text-[#A7B1B5]">
            <Filter className="w-4 h-4 text-[#E88D38]" />
            <span>Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E88D38]/25 bg-[#121E2C] text-[#F3F0E8] focus:outline-none focus:border-[#E88D38] text-xs font-medium"
          >
            <option value="ALL">Status: All</option>
            <option value="OPEN">Status: Open</option>
            <option value="IN_PROGRESS">Status: In Progress</option>
            <option value="RESOLVED">Status: Resolved</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E88D38]/25 bg-[#121E2C] text-[#F3F0E8] focus:outline-none focus:border-[#E88D38] text-xs font-medium"
          >
            <option value="ALL">Category: All</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E88D38]/25 bg-[#121E2C] text-[#F3F0E8] focus:outline-none focus:border-[#E88D38] text-xs font-medium"
          >
            <option value="ALL">Priority: All</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </form>

      {/* Floating Glass Complaints Table */}
      {isLoading ? (
        <CardSkeleton />
      ) : complaints.length === 0 ? (
        <EmptyState
          title="No complaints in queue"
          description="There are currently no reported issues matching your filter selection."
        />
      ) : (
        <ComplaintTable
          complaints={complaints}
          onSelectComplaint={(c) => navigate(`/admin/complaints/${c.id}`)}
          onOpenStatusModal={(c) => {
            setSelectedComplaint(c);
            setIsStatusModalOpen(true);
          }}
        />
      )}

      {/* Status Update Modal */}
      {selectedComplaint && (
        <StatusUpdateModal
          isOpen={isStatusModalOpen}
          complaint={selectedComplaint}
          onClose={() => {
            setIsStatusModalOpen(false);
            setSelectedComplaint(null);
          }}
          onSuccess={fetchComplaints}
        />
      )}
    </Layout>
  );
};
