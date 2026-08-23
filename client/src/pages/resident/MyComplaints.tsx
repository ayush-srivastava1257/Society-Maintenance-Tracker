import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { ComplaintCard } from '../../components/complaint/ComplaintCard';
import { EmptyState } from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/Skeleton';
import { api } from '../../services/api';
import { Complaint } from '../../types';

export const MyComplaints: React.FC = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const res = await api.getMyComplaints();
      setComplaints(res.complaints);
      setFilteredComplaints(res.complaints);
    } catch (err) {
      console.error('Failed to fetch my complaints:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    let result = [...complaints];

    if (statusFilter !== 'ALL') {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    setFilteredComplaints(result);
  }, [search, statusFilter, complaints]);

  return (
    <Layout title="My Complaints" onComplaintCreated={fetchComplaints}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-normal text-[#E9E3D2] tracking-tight">
            My Maintenance Complaints
          </h1>
          <p className="text-xs text-[#A7B1B5] font-medium mt-0.5">
            Track status updates and history for your reported issues.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0A121D] rounded-2xl border border-[#E88D38]/20 p-4 shadow-card flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#A7B1B5] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search complaints..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E88D38]/25 bg-[#121E2C] text-[#F3F0E8] focus:outline-none focus:border-[#E88D38] text-xs font-medium"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-[#E88D38]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E88D38]/25 bg-[#121E2C] text-[#F3F0E8] focus:outline-none focus:border-[#E88D38] text-xs font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredComplaints.length === 0 ? (
        <EmptyState
          title="No complaints found"
          description="You haven't reported any issues matching your search criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onClick={() => navigate(`/resident/complaints/${complaint.id}`)}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};
