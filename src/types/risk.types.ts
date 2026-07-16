export interface RiskAssessment {
  zone_id: number;
  zone_name?: string;
  risk_score: number;
  risk_level: string;
  factors: RiskFactor[];
  explanation: string;
  recommended_actions: string[];
  timestamp: string;
}

export interface RiskFactor {
  name: string;
  value: number;
  weight: number;
  score: number;
  contribution: number;
}

export interface RiskHistory {
  id: number;
  zone_id: number;
  risk_score: number;
  risk_level: string;
  factors?: string;
  explanation?: string;
  calculation_timestamp: string;
}

export const RISK_THRESHOLDS = {
  low: { min: 0, max: 25, color: '#00c853', label: 'Low' },
  medium: { min: 26, max: 50, color: '#ff9500', label: 'Medium' },
  high: { min: 51, max: 75, color: '#ff6b00', label: 'High' },
  critical: { min: 76, max: 100, color: '#ff3b3b', label: 'Critical' },
};
