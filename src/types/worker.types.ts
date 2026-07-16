export interface Worker {
  id: number;
  employee_id: string;
  first_name: string;
  last_name?: string;
  full_name?: string;
  role: string;
  department?: string;
  phone?: string;
  emergency_contact?: string;
  current_zone_id?: number;
  zone_name?: string;
  shift: string;
  helmet_status: string;
  vest_status: string;
  boots_status: string;
  gloves_status: string;
  goggles_status: string;
  last_known_x?: number;
  last_known_y?: number;
  is_on_site: number;
  check_in_time?: string;
  is_active: number;
  created_at: string;
}

export interface WorkerMovement {
  worker_id: number;
  from_zone_id: number;
  to_zone_id: number;
  timestamp: string;
}
