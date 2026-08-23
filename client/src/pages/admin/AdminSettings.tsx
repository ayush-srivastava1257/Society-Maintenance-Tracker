import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [thresholdDays, setThresholdDays] = useState<number>(3);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsFetching(true);
        const res = await api.getSettings();
        if (res.settings && res.settings.overdueThresholdDays) {
          setThresholdDays(Number(res.settings.overdueThresholdDays));
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveResolution = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.updateSettings({ overdueThresholdDays: Number(thresholdDays) });
      showToast('success', 'Overdue SLA threshold updated successfully!');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update settings.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="System Preferences">
      <div>
        <h1 className="font-serif text-3xl font-normal text-[#E9E3D2] tracking-tight">
          System Preferences & Settings
        </h1>
        <p className="text-xs text-[#A7B1B5] font-medium mt-0.5">
          System preferences and facility administration configuration.
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Floating Glass Box 1: Complaint Resolution SLA */}
        <div className="bg-[#0A121D]/80 backdrop-blur-2xl rounded-3xl border border-[#E88D38]/30 p-6 md:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.8)] space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#E88D38]/20 pb-3">
            <Clock className="w-4 h-4 text-[#E88D38]" />
            <h2 className="text-xs font-extrabold text-[#E9E3D2] uppercase tracking-wider">
              Complaint Resolution SLA
            </h2>
          </div>

          <form onSubmit={handleSaveResolution} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#E9E3D2] mb-1.5">
                Overdue Threshold (Days)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={thresholdDays}
                  onChange={(e) => setThresholdDays(Number(e.target.value))}
                  className="w-32 px-4 py-2.5 rounded-xl border border-[#E88D38]/25 bg-[#121E2C] text-[#F3F0E8] focus:outline-none focus:border-[#E88D38] text-xs font-extrabold"
                  disabled={isFetching || isLoading}
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="py-2.5 px-5 bg-[#E88D38] hover:bg-[#F09B48] text-[#0D1A28] font-extrabold text-xs"
                  isLoading={isLoading}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Save Threshold
                </Button>
              </div>
              <p className="text-xs text-[#A7B1B5] font-medium mt-2 leading-relaxed">
                Complaints remaining unresolved beyond this period are marked overdue in the admin queue.
              </p>
            </div>
          </form>
        </div>

        {/* Floating Glass Box 2: Administrator Profile */}
        <div className="bg-[#0A121D]/80 backdrop-blur-2xl rounded-3xl border border-[#E88D38]/30 p-6 md:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.8)] space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#E88D38]/20 pb-3">
            <ShieldCheck className="w-4 h-4 text-[#E88D38]" />
            <h2 className="text-xs font-extrabold text-[#E9E3D2] uppercase tracking-wider">
              Administrator Account Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[#A7B1B5] block mb-0.5 font-medium">Administrator Name</span>
              <span className="font-bold text-[#E9E3D2]">{user?.name}</span>
            </div>

            <div>
              <span className="text-[#A7B1B5] block mb-0.5 font-medium">Email Address</span>
              <span className="font-bold text-[#E9E3D2]">{user?.email}</span>
            </div>

            <div>
              <span className="text-[#A7B1B5] block mb-0.5 font-medium">System Role</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold text-[#E88D38] bg-[#E88D38]/15 border border-[#E88D38]/30">
                <ShieldCheck className="w-3 h-3 mr-1" /> {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
