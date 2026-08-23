import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Bell,
  Settings,
  LogOut,
  Building2,
  Shield,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const residentNavItems = [
    { label: 'Dashboard', path: '/resident/dashboard', icon: LayoutDashboard },
    { label: 'My Complaints', path: '/resident/complaints', icon: ClipboardList },
    { label: 'Notice Board', path: '/resident/notices', icon: Bell },
  ];

  const adminNavItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'All Complaints', path: '/admin/complaints', icon: ClipboardList },
    { label: 'Notice Board', path: '/admin/notices', icon: Bell },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const navItems = isAdmin ? adminNavItems : residentNavItems;

  return (
    <aside className="w-64 fixed left-0 top-0 h-screen bg-[#0A121D]/90 backdrop-blur-2xl border-r border-[#E88D38]/30 shadow-[0_25px_80px_rgba(0,0,0,0.85)] flex flex-col justify-between z-30 select-none">
      <div>
        {/* Brand Logo Header */}
        <div className="p-6 border-b border-[#E88D38]/20 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#E88D38]/20 border border-[#E88D38]/40 backdrop-blur-md flex items-center justify-center text-[#E88D38] shadow-lg shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#E9E3D2] tracking-tight">NestGrid</h1>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E88D38] block">
              {isAdmin ? 'ADMIN PORTAL' : 'RESIDENT HUB'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl font-extrabold text-xs transition-all duration-300 ${
                    isActive
                      ? 'bg-[#E88D38] text-[#0D1A28] shadow-[0_0_25px_rgba(232,141,56,0.4)] hover:scale-[1.01]'
                      : 'text-[#A7B1B5] hover:bg-white/5 hover:text-[#E9E3D2]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer Widget */}
      <div className="p-4 border-t border-[#E88D38]/20 space-y-3">
        <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-[#121E2C]/80 backdrop-blur-md border border-[#E88D38]/30">
          <div className="w-8 h-8 rounded-lg bg-[#E88D38]/20 text-[#E88D38] flex items-center justify-center font-bold text-xs shrink-0 border border-[#E88D38]/40">
            {isAdmin ? <Shield className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-xs font-bold text-[#E9E3D2] truncate">{user?.name}</p>
            <p className="text-[10px] text-[#A7B1B5] truncate">{user?.apartmentNo || user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#C96A6A]/20 text-[#A7B1B5] hover:text-[#C96A6A] border border-[#E88D38]/20 hover:border-[#C96A6A]/40 text-xs font-bold transition-all duration-300"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
