import React from 'react';
import { Plus, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  title?: string;
  onOpenReportModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ title, onOpenReportModal }) => {
  const { user } = useAuth();
  const isResident = user?.role === 'RESIDENT';

  return (
    <header className="h-16 bg-[#0A121D]/80 backdrop-blur-2xl border-b border-[#E88D38]/30 px-6 flex items-center justify-between sticky top-0 z-20 shrink-0 shadow-md">
      <div>
        <h2 className="text-base font-bold text-[#E9E3D2] tracking-tight">
          {title || 'Overview'}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        {isResident && onOpenReportModal && (
          <button
            onClick={onOpenReportModal}
            className="px-4 py-2 rounded-xl bg-[#E88D38] hover:bg-[#F09B48] text-[#0D1A28] font-extrabold text-xs shadow-md hover:shadow-[0_0_20px_rgba(232,141,56,0.35)] transition-all active:scale-[0.98] flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Report Issue</span>
          </button>
        )}

        <div className="h-6 w-px bg-[#E88D38]/20" />

        <div className="flex items-center space-x-2 text-xs font-bold text-[#E9E3D2]">
          <div className="w-7 h-7 rounded-lg bg-[#E88D38]/20 text-[#E88D38] flex items-center justify-center border border-[#E88D38]/30">
            {user?.role === 'ADMIN' ? <Shield className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
          </div>
          <span className="hidden sm:inline-block">{user?.name}</span>
        </div>
      </div>
    </header>
  );
};
