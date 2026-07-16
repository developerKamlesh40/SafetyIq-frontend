import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Map, Radio, Users, FileText,
  Wrench, AlertTriangle, Shield, FileBarChart,
  Bot, Settings, ChevronLeft, ChevronRight, Brain,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/plant-map', icon: Map, label: 'Plant Map' },
  { to: '/sensors', icon: Radio, label: 'Sensors' },
  { to: '/workers', icon: Users, label: 'Workers' },
  { to: '/permits', icon: FileText, label: 'Permits' },
  { to: '/maintenance', icon: Wrench, label: 'Maintenance' },
  { to: '/incidents', icon: AlertTriangle, label: 'Incidents' },
  { to: '/compliance', icon: Shield, label: 'Compliance' },
  { to: '/reports', icon: FileBarChart, label: 'Reports' },
  { to: '/copilot', icon: Bot, label: 'AI Copilot' },
  { to: '/agent-logs', icon: Brain, label: 'Agent Logs' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-56'} transition-all duration-300 bg-safety-darker border-r border-safety-border flex flex-col`}>
      <div className="p-4 border-b border-safety-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-safety-cyan/20 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-safety-cyan" />
        </div>
        {!collapsed && <span className="font-bold text-lg text-white">SafetyIQ</span>}
      </div>
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-safety-cyan/10 text-safety-cyan border border-safety-cyan/20'
                  : 'text-safety-muted hover:text-white hover:bg-safety-card'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-safety-border text-safety-muted hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4 mx-auto" /> : <ChevronLeft className="w-4 h-4 mx-auto" />}
      </button>
    </aside>
  );
}
