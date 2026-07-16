export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface Zone {
  id: number;
  name: string;
  code: string;
  description?: string;
  zone_type: string;
  capacity: number;
  risk_level: string;
  current_risk_score: number;
  is_restricted: number;
  is_active: number;
  color_code: string;
  coordinates_x: number;
  coordinates_y: number;
  worker_count?: number;
}

export interface Alert {
  id: number;
  zone_id?: number;
  zone_name?: string;
  alert_type: string;
  severity: string;
  title: string;
  message: string;
  source_type?: string;
  source_id?: number;
  recommended_actions?: string;
  status: string;
  created_at: string;
}

export interface DashboardStats {
  totalWorkers: number;
  activePermits: number;
  criticalZones: number;
  gasAlerts: number;
  safetyScore: number;
  todaysIncidents: number;
  emergencyStatus: string;
  equipmentHealth: number;
}

export interface MaintenanceRecord {
  id: number;
  equipment_name: string;
  equipment_id: string;
  zone_id: number;
  zone_name?: string;
  maintenance_type: string;
  description?: string;
  assigned_engineer_id?: number;
  status: string;
  priority: string;
  requires_shutdown: number;
  scheduled_date?: string;
  started_at?: string;
  completed_at?: string;
  expected_completion?: string;
  notes?: string;
  created_at: string;
}

export interface CameraEvent {
  id: number;
  zone_id: number;
  zone_name?: string;
  camera_id: string;
  event_type: string;
  severity: string;
  confidence: number;
  description?: string;
  worker_id?: number;
  is_acknowledged: number;
  event_timestamp: string;
}
