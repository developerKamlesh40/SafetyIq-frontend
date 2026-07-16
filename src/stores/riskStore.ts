import { create } from 'zustand';

interface RiskState {
  zoneRisks: Record<number, { score: number; level: string }>;
  updateRisk: (zoneId: number, score: number, level: string) => void;
}

export const useRiskStore = create<RiskState>((set) => ({
  zoneRisks: {},
  updateRisk: (zoneId, score, level) => set((state) => ({
    zoneRisks: { ...state.zoneRisks, [zoneId]: { score, level } },
  })),
}));
