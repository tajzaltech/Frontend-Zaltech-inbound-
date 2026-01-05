import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initRealtimeConnection } from './store/realtimeStore';
import { useNotificationStore } from './store/notificationStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/layout/Sidebar';
import { SignIn } from './pages/SignIn/SignIn';
import { SignUp } from './pages/SignUp/SignUp';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
import { Overview } from './pages/Overview/Overview';

import { LiveStream } from './pages/LiveStream/LiveStream';
import { Leads } from './pages/Leads/Leads';
import { LeadDetail } from './pages/LeadDetail/LeadDetail';
import { AppointmentsPage } from './pages/Appointments/AppointmentsPage';
import { Settings } from './pages/Settings/Settings';
import { ToastContainer } from './components/ui/ToastContainer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

function AppLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Realtime (Live Call) connection
    const cleanupRealtime = initRealtimeConnection();
    
    // Initialize Global Notification connection
    const { connect, disconnect } = useNotificationStore.getState();
    connect();

    return () => {
      cleanupRealtime();
      disconnect();
    };
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAFAFA]">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/overview" replace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/overview"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Overview />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/live-stream"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <LiveStream />
                </AppLayout>
              </ProtectedRoute>
            }
          />



          <Route
            path="/leads"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Leads />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/leads/:leadId"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <LeadDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AppointmentsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />


          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
