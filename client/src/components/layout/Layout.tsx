import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { RaiseComplaintModal } from '../complaint/RaiseComplaintModal';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onComplaintCreated?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, onComplaintCreated }) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleOpenModal = () => setIsReportModalOpen(true);
  const handleCloseModal = () => setIsReportModalOpen(false);

  return (
    <div className="min-h-screen bg-[#050B14] text-[#F3F0E8] font-sans flex relative overflow-x-hidden selection:bg-[#E88D38] selection:text-[#0D1A28]">
      {/* Background Image Asset: bg_image.jpg with Darker Blackish Filter */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 pointer-events-none transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('/bg_image.jpg')`,
          filter: 'brightness(0.42) contrast(1.15) saturate(0.9)',
        }}
      />

      {/* Deep Blackish Dark Tint Overlay across entire App Shell */}
      <div className="fixed inset-0 bg-gradient-to-r from-black/92 via-black/78 to-black/88 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-[#E88D38]/5 pointer-events-none z-0 mix-blend-color-dodge" />

      {/* Fixed Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Viewport Area with Left Padding for Fixed Sidebar */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative pl-64">
        <Navbar title={title} onOpenReportModal={handleOpenModal} />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 animate-page-enter">
          {children}
        </main>
      </div>

      {/* Modal */}
      <RaiseComplaintModal
        isOpen={isReportModalOpen}
        onClose={handleCloseModal}
        onSuccess={() => {
          if (onComplaintCreated) onComplaintCreated();
        }}
      />
    </div>
  );
};
