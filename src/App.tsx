import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/layout/Sidebar';
import { SignIn } from './pages/SignIn/SignIn';
import { CallsLive } from './pages/CallsLive/CallsLive';
import { CallDetail } from './pages/CallDetail/CallDetail';
import { CallHistory } from './pages/CallHistory/CallHistory';
import { Leads } from './pages/Leads/Leads';
import { LeadDetail } from './pages/LeadDetail/LeadDetail';
import { Services } from './pages/Services/Services';
import { Settings } from './pages/Settings/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

function AppLayout({ children }: { children: React.ReactNode }) {
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

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/calls/live" replace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/calls/live"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CallsLive />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/calls/history"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CallHistory />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/calls/:callId"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CallDetail />
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
            path="/services"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Services />
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
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
