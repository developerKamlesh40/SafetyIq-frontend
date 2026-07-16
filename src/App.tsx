import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './config/queryClient';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ToastContainer } from './components/ui/toast';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';
import Dashboard from './pages/Dashboard/Dashboard';
import PlantMap from './pages/PlantMap/PlantMap';
import Sensors from './pages/Sensors/Sensors';
import Workers from './pages/Workers/Workers';
import Permits from './pages/Permits/Permits';
import Maintenance from './pages/Maintenance/Maintenance';
import Incidents from './pages/Incidents/Incidents';
import Compliance from './pages/Compliance/Compliance';
import Reports from './pages/Reports/Reports';
import AICopilot from './pages/AICopilot/AICopilot';
import Settings from './pages/Settings/Settings';
import AgentLogs from './pages/AgentLogs/AgentLogs';
import Login from './pages/Auth/Login';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/plant-map" element={<PlantMap />} />
                <Route path="/sensors" element={<Sensors />} />
                <Route path="/workers" element={<Workers />} />
                <Route path="/permits" element={<Permits />} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/incidents" element={<Incidents />} />
                <Route path="/compliance" element={<Compliance />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/copilot" element={<AICopilot />} />
                <Route path="/agent-logs" element={<AgentLogs />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
