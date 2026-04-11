import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Skeleton from './components/ui/Skeleton';

// Lazy load pages
const Layout = lazy(() => import('./components/layout/Layout'));
const ProtectedRoute = lazy(() => import('./components/auth/ProtectedRoute'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AdminRegister = lazy(() => import('./pages/AdminRegister'));
const Users = lazy(() => import('./pages/Users'));
const Classes = lazy(() => import('./pages/Classes'));
const Subjects = lazy(() => import('./pages/Subjects'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Assignments = lazy(() => import('./pages/Assignments'));
const Announcements = lazy(() => import('./pages/Announcements'));
const Events = lazy(() => import('./pages/Events'));
const Exams = lazy(() => import('./pages/Exams'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-surface-500">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin-register" element={<AdminRegister />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/" element={<ProtectedRoute />}>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="users" element={<Users />} />
                      <Route path="classes" element={<Classes />} />
                      <Route path="subjects" element={<Subjects />} />
                      <Route path="schedule" element={<Schedule />} />
                      <Route path="exams" element={<Exams />} />
                      <Route path="assignments" element={<Assignments />} />
                      <Route path="announcements" element={<Announcements />} />
                      <Route path="events" element={<Events />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="profile" element={<Profile />} />
                    </Route>
                  </Route>
                </Routes>
              </Suspense>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg, #fff)',
              color: 'var(--toast-text, #1f2937)',
              borderRadius: '0.5rem',
            },
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;