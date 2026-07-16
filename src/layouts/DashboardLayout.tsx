import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

export default function DashboardLayout() {
  const location = useLocation();
  const isFullScreen = location.pathname === '/plant-map';

  return (
    <div className="flex h-screen bg-safety-navy">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className={`flex-1 ${isFullScreen ? 'overflow-hidden relative' : 'overflow-y-auto p-6'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
