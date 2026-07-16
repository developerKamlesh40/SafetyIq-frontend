import { Bell, Search, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="h-14 border-b border-safety-border bg-safety-darker/50 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-safety-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 bg-safety-card border border-safety-border rounded-lg pl-9 pr-3 py-1.5 text-sm text-safety-text placeholder-safety-muted focus:outline-none focus:border-safety-cyan/50"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-safety-muted hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-safety-red rounded-full" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-safety-cyan/20 flex items-center justify-center">
            <User className="w-4 h-4 text-safety-cyan" />
          </div>
          <div className="text-sm">
            <p className="text-white">{user.full_name || 'User'}</p>
            <p className="text-safety-muted text-xs">{user.role || 'operator'}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 text-safety-muted hover:text-safety-red transition-colors">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
