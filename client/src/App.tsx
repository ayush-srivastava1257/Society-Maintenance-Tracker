import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ResidentDashboard } from './pages/resident/ResidentDashboard';
import { MyComplaints } from './pages/resident/MyComplaints';
import { ResidentComplaintDetail } from './pages/resident/ResidentComplaintDetail';
import { ResidentNoticeBoard } from './pages/resident/ResidentNoticeBoard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminComplaints } from './pages/admin/AdminComplaints';
import { AdminComplaintDetail } from './pages/admin/AdminComplaintDetail';
import { AdminNoticeBoard } from './pages/admin/AdminNoticeBoard';
import { AdminSettings } from './pages/admin/AdminSettings';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole?: 'ADMIN' | 'RESIDENT' }> = ({
  children,
  allowedRole,
}) => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/resident/dashboard'} replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Resident Protected Routes */}
              <Route
                path="/resident/dashboard"
                element={
                  <ProtectedRoute allowedRole="RESIDENT">
                    <ResidentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resident/complaints"
                element={
                  <ProtectedRoute allowedRole="RESIDENT">
                    <MyComplaints />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resident/complaints/:id"
                element={
                  <ProtectedRoute allowedRole="RESIDENT">
                    <ResidentComplaintDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resident/notices"
                element={
                  <ProtectedRoute allowedRole="RESIDENT">
                    <ResidentNoticeBoard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRole="ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/complaints"
                element={
                  <ProtectedRoute allowedRole="ADMIN">
                    <AdminComplaints />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/complaints/:id"
                element={
                  <ProtectedRoute allowedRole="ADMIN">
                    <AdminComplaintDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/notices"
                element={
                  <ProtectedRoute allowedRole="ADMIN">
                    <AdminNoticeBoard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute allowedRole="ADMIN">
                    <AdminSettings />
                  </ProtectedRoute>
                }
              />

              {/* Default Redirect */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
export default App;
