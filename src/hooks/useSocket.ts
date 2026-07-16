import { useEffect, useRef } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '../config/socket';
import { useAuthStore } from '../stores/authStore';
import { useAlertStore } from '../stores/alertStore';
import { useSensorStore } from '../stores/sensorStore';
import { useRiskStore } from '../stores/riskStore';

export function useSocket() {
  const token = useAuthStore((s) => s.token);
  const addAlert = useAlertStore((s) => s.addAlert);
  const updateReading = useSensorStore((s) => s.updateReading);
  const updateRisk = useRiskStore((s) => s.updateRisk);
  const initialized = useRef(false);

  useEffect(() => {
    if (!token || initialized.current) return;
    initialized.current = true;

    const socket = connectSocket(token);

    socket.on('alert:new', addAlert);
    socket.on('sensor:update', updateReading);
    socket.on('risk:update', (data) => updateRisk(data.zone_id, data.score, data.level));

    return () => {
      socket.off('alert:new');
      socket.off('sensor:update');
      socket.off('risk:update');
      disconnectSocket();
      initialized.current = false;
    };
  }, [token]);

  return { getSocket };
}
