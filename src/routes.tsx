import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load components
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const OnboardingShell = React.lazy(() => import('./pages/Onboarding/OnboardingShell'));
const VerificationShell = React.lazy(() => import('./pages/Verification/VerificationShell'));
const UploadValidate = React.lazy(() => import('./pages/UploadValidate'));
const Credentials = React.lazy(() => import('./pages/Credentials'));
const ListsIndex = React.lazy(() => import('./pages/Lists/ListsIndex'));
const SettingsIndex = React.lazy(() => import('./pages/Settings/Index'));

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route
          path="/login"
          element={
            user ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="onboarding/*" element={<OnboardingShell />} />
                  <Route path="verification/*" element={<VerificationShell />} />
                  <Route path="upload-validate" element={<UploadValidate />} />
                  <Route path="upload-validate/:jobId" element={<UploadValidate />} />
                  <Route path="credentials" element={<Credentials />} />
                  <Route path="lists/*" element={<ListsIndex />} />
                  <Route path="settings" element={<SettingsIndex />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}