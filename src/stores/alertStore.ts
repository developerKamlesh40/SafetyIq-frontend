import { create } from 'zustand';

export interface Alert {
  id: number;
  severity: string;
  title: string;
  message: string;
  zone_name?: string;
  created_at: string;
}

interface AlertState {
  alerts: Alert[];
  unreadCount: number;
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  removeAlert: (id: number) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  unreadCount: 0,
  setAlerts: (alerts) => set({ alerts, unreadCount: alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length }),
  addAlert: (alert) => set((state) => ({
    alerts: [alert, ...state.alerts].slice(0, 100),
    unreadCount: state.unreadCount + (alert.severity === 'critical' || alert.severity === 'high' ? 1 : 0),
  })),
  removeAlert: (id) => set((state) => ({
    alerts: state.alerts.filter(a => a.id !== id),
  })),
}));
