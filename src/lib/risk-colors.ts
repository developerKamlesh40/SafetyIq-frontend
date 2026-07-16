export const RISK_COLORS = {
  low: '#00c853',
  medium: '#ff9500',
  high: '#ff6b00',
  critical: '#ff3b3b',
} as const;

export const RISK_LEVELS = ['low', 'medium', 'high', 'critical'] as const;

export function getRiskColor(score: number): string {
  if (score >= 76) return RISK_COLORS.critical;
  if (score >= 51) return RISK_COLORS.high;
  if (score >= 26) return RISK_COLORS.medium;
  return RISK_COLORS.low;
}

export function getRiskLevel(score: number): string {
  if (score >= 76) return 'critical';
  if (score >= 51) return 'high';
  if (score >= 26) return 'medium';
  return 'low';
}

export function getRiskBadgeVariant(level: string): 'critical' | 'high' | 'medium' | 'low' {
  return (level as any) || 'low';
}
