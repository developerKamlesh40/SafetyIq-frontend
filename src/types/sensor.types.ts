export type SensorType = 'gas' | 'temperature' | 'humidity' | 'pressure' | 'smoke' | 'vibration' | 'voltage' | 'current' | 'flow_rate';
export type SensorStatus = 'normal' | 'warning' | 'danger' | 'critical';

export interface SensorReading {
  id: number;
  zone_id: number;
  sensor_type: SensorType;
  sensor_id: string;
  value: number;
  unit: string;
  threshold_min?: number;
  threshold_max?: number;
  is_alarm: number;
  status: SensorStatus;
  reading_timestamp: string;
  created_at?: string;
}

export interface SensorThreshold {
  sensorType: SensorType;
  min: number;
  max: number;
  warning: number;
  danger: number;
  unit: string;
}
