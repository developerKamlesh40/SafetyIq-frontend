import { create } from 'zustand';

interface SensorReading {
  zone_id: number;
  sensor_type: string;
  sensor_id: string;
  value: number;
  unit: string;
  status: string;
}

interface SensorState {
  readings: Record<string, SensorReading>;
  updateReading: (reading: SensorReading) => void;
}

export const useSensorStore = create<SensorState>((set) => ({
  readings: {},
  updateReading: (reading) => set((state) => ({
    readings: { ...state.readings, [`${reading.zone_id}-${reading.sensor_type}`]: reading },
  })),
}));
