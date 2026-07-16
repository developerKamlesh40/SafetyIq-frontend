export const RISK_COLORS = {
  low: '#00c853',
  medium: '#ff9500',
  high: '#ff3b3b',
  critical: '#d50000',
} as const;

export const SENSOR_ICONS: Record<string, string> = {
  gas: 'FlaskConical',
  temperature: 'Thermometer',
  humidity: 'Droplets',
  pressure: 'Gauge',
  smoke: 'Cloud',
  vibration: 'Activity',
  voltage: 'Zap',
  current: 'Battery',
  flow_rate: 'Droplet',
};

export const ZONE_NAMES: Record<string, string> = {
  ZONE_A: 'Boiler House',
  ZONE_B: 'Chemical Storage',
  ZONE_C: 'Tank Farm',
  ZONE_D: 'Control Room',
  ZONE_E: 'Main Pipeline',
  ZONE_F: 'Chemical Processing',
  ZONE_G: 'Loading Bay',
  ZONE_H: 'Maintenance Workshop',
};
