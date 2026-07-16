export interface Incident {
  id: number;
  incident_number: string;
  zone_id: number;
  zone_name?: string;
  title: string;
  description?: string;
  incident_type: string;
  severity: string;
  reported_by?: number;
  permit_id?: number;
  ai_risk_score?: number;
  ai_analysis?: string;
  ai_recommended_actions?: string;
  incident_timestamp: string;
  reported_at: string;
  resolved_at?: string;
  status: string;
  root_cause?: string;
  corrective_action?: string;
  preventive_action?: string;
  workers?: any[];
  created_at: string;
}

export interface IncidentStats {
  total: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  trend: { date: string; count: number }[];
}
