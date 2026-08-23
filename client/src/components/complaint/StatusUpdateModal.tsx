import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Wrench } from 'lucide-react';
import { api } from '../../services/api';
import { Complaint, Status, Priority } from '../../types';
import { useToast } from '../../context/ToastContext';

interface StatusUpdateModalProps {
  isOpen: boolean;
  complaint: Complaint | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  isOpen,
  complaint,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const [status, setStatus] = useState<Status>('OPEN');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status);
      setPriority(complaint.priority);
      setNote('');
    }
  }, [complaint, isOpen]);

  if (!isOpen || !complaint) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (status !== complaint.status || note.trim()) {
        await api.updateComplaintStatus(complaint.id, status, note.trim() || undefined);
      }
      if (priority !== complaint.priority) {
        await api.updateComplaintPriority(complaint.id, priority);
      }

      showToast('success', 'Complaint status & priority updated successfully!');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update complaint status.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative animate-page-enter">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#A7B1B5] hover:text-[#E9E3D2] p-1.5 rounded-xl hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#E88D38]/20 border border-[#E88D38]/40 flex items-center justify-center text-[#E88D38]">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#E9E3D2]">
              Update Complaint Action
            </h2>
            <p className="text-xs text-[#A7B1B5]">
              Issue: <strong className="text-[#E9E3D2]">{complaint.title}</strong>
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
              STATUS TRANSITION *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E88D38]/25 bg-[#121E2C] text-[#F3F0E8] focus:outline-none focus:border-[#E88D38] text-xs font-bold"
            >
              <option value="OPEN" className="bg-[#0A121D]">Open</option>
              <option value="IN_PROGRESS" className="bg-[#0A121D]">In Progress</option>
              <option value="RESOLVED" className="bg-[#0A121D]">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-[#E9E3D2] uppercase tracking-wider mb-1">
              URGENCY / PRIORITY *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['LOW', 'MEDIUM', 'HIGH'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition-all ${
                    priority === p
                      ? 'bg-[#E88D38] text-[#0D1A28] border-[#E88D38] shadow-md'
                      : 'bg-[#121E2C] border-[#E88D38]/25 text-[#A7B1B5] hover:text-[#E9E3D2]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-[#E9E3D2] uppercase tracking-wider mb-1">
              ACTION NOTE
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this status update (e.g. Plumber assigned for inspection)..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#E88D38]/25 bg-[#121E2C] text-[#F3F0E8] focus:outline-none focus:border-[#E88D38] text-xs resize-none font-medium"
            />
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
              className="px-5 py-2.5 rounded-xl bg-[#E88D38] hover:bg-[#F09B48] text-[#0D1A28] font-extrabold text-xs shadow-md transition-all disabled:opacity-50 flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Update Complaint →</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
