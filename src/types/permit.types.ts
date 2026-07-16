export interface Permit {
  id: number;
  permit_number: string;
  permit_type: string;
  title: string;
  description?: string;
  zone_id: number;
  zone_name?: string;
  start_time: string;
  end_time: string;
  actual_end_time?: string;
  requested_by?: number;
  approved_by?: number;
  supervisor_id?: number;
  status: string;
  risk_assessment?: string;
  safety_measures?: string;
  assigned_workers?: any[];
  created_at: string;
}
