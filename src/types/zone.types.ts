export type ZoneType = 'boiler' | 'storage' | 'tank_farm' | 'control_room' | 'pipeline' | 'chemical_area' | 'loading_bay' | 'maintenance_workshop';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Zone {
  id: number;
  name: string;
  code: string;
  description?: string;
  zone_type: ZoneType;
  capacity: number;
  coordinates_x: number;
  coordinates_y: number;
  width?: number;
  height?: number;
  risk_level: RiskLevel;
  current_risk_score: number;
  is_restricted: number;
  is_active: number;
  color_code: string;
  created_at?: string;
  updated_at?: string;
  worker_count?: number;
}

export interface ZoneDetail extends Zone {
  workers: any[];
  sensors: any[];
  activePermits: any[];
  recentEvents: any[];
}
