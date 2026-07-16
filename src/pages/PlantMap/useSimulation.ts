import { useState, useEffect, useRef, useCallback } from 'react';
import {
  BUILDINGS, MACHINES, INITIAL_WORKERS, INITIAL_VEHICLES,
  INITIAL_SENSORS, PRODUCTION_LINES, INITIAL_KPIS,
  WorkerData, VehicleData, SensorData, ProductionLine, PlantObject
} from './plantData';

export function useSimulation() {
  const [machines, setMachines] = useState<PlantObject[]>(() => [...MACHINES]);
  const [workers, setWorkers] = useState<WorkerData[]>(() => JSON.parse(JSON.stringify(INITIAL_WORKERS)));
  const [vehicles, setVehicles] = useState<VehicleData[]>(() => JSON.parse(JSON.stringify(INITIAL_VEHICLES)));
  const [sensors, setSensors] = useState<SensorData[]>(() => JSON.parse(JSON.stringify(INITIAL_SENSORS)));
  const [prodLines, setProdLines] = useState<ProductionLine[]>(() => JSON.parse(JSON.stringify(PRODUCTION_LINES)));
  const [kpis, setKpis] = useState(() => ({ ...INITIAL_KPIS }));
  const [alerts, setAlerts] = useState<{ id: string; msg: string; severity: string; time: number }[]>([]);
  const frameRef = useRef(0);

  // Animate workers, vehicles, production flow at 60fps
  useEffect(() => {
    let animId: number;
    const tick = () => {
      setWorkers(prev => prev.map(w => {
        const bld = BUILDINGS.find(b => b.id === w.zone);
        if (!bld) return w;
        let nx = w.x + w.dx * w.speed;
        let ny = w.y + w.dy * w.speed;
        let ndx = w.dx, ndy = w.dy;
        if (nx < bld.x + 10 || nx > bld.x + bld.w - 10) { ndx = -ndx; nx = w.x + ndx * w.speed; }
        if (ny < bld.y + 10 || ny > bld.y + bld.h - 10) { ndy = -ndy; ny = w.y + ndy * w.speed; }
        if (Math.random() < 0.001) { ndx = Math.random() > 0.5 ? 1 : -1; ndy = Math.random() > 0.5 ? 1 : -1; }
        const trail = [...w.trail, { x: w.x, y: w.y }].slice(-12);
        return { ...w, x: nx, y: ny, dx: ndx, dy: ndy, trail };
      }));

      setVehicles(prev => prev.map(v => {
        if (v.status === 'idle' || v.status === 'loading') return v;
        const target = v.route[v.routeIdx];
        if (!target) return v;
        const ddx = target.x - v.x, ddy = target.y - v.y;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dist < 2) {
          return { ...v, routeIdx: (v.routeIdx + 1) % v.route.length, x: target.x, y: target.y };
        }
        return { ...v, x: v.x + (ddx / dist) * v.speed, y: v.y + (ddy / dist) * v.speed };
      }));

      setProdLines(prev => prev.map(pl => ({ ...pl, flowOffset: (pl.flowOffset + 0.5) % 20 })));
      frameRef.current++;
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // State changes every 8 seconds
  useEffect(() => {
    const iv = setInterval(() => {
      setMachines(prev => prev.map(m => {
        if (Math.random() < 0.08) {
          const states = ['running', 'running', 'running', 'idle', 'maintenance', 'alarm'];
          return { ...m, status: states[Math.floor(Math.random() * states.length)] };
        }
        return m;
      }));

      setSensors(prev => prev.map(s => {
        const drift = (Math.random() - 0.5) * (s.max - s.min) * 0.04;
        const nv = Math.max(s.min, Math.min(s.max, s.value + drift));
        const status = nv > s.threshold ? 'alarm' : nv > s.threshold * 0.85 ? 'warning' : 'normal';
        return { ...s, value: Math.round(nv * 10) / 10, status };
      }));

      setVehicles(prev => prev.map(v => {
        if (Math.random() < 0.05) {
          const st = v.status === 'loading' ? 'moving' : (Math.random() < 0.2 ? 'loading' : v.status);
          return { ...v, status: st, battery: Math.max(10, v.battery - Math.random() * 2) };
        }
        return v;
      }));

      setKpis(prev => ({
        oee: Math.max(70, Math.min(99, prev.oee + (Math.random() - 0.5) * 2)),
        productionRate: Math.max(3500, Math.min(5000, prev.productionRate + Math.floor((Math.random() - 0.5) * 100))),
        energyConsumption: Math.max(30, Math.min(50, prev.energyConsumption + (Math.random() - 0.5) * 1.5)),
        safetyScore: Math.max(80, Math.min(100, prev.safetyScore + (Math.random() - 0.5) * 1)),
        activeAlerts: prev.activeAlerts,
        shift: prev.shift,
      }));
    }, 8000);
    return () => clearInterval(iv);
  }, []);

  // Alert generation every 15 seconds
  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() < 0.4) {
        const msgs = [
          { msg: 'Gas level spike detected in Coke Oven', severity: 'warning' },
          { msg: 'Vibration threshold exceeded on Roughing Mill', severity: 'critical' },
          { msg: 'Temperature rising in BOF Converter #1', severity: 'warning' },
          { msg: 'PPE violation detected near Blast Furnace', severity: 'info' },
          { msg: 'AGV battery low - unit agv2', severity: 'info' },
          { msg: 'Unauthorized access attempt at restricted zone', severity: 'critical' },
        ];
        const a = msgs[Math.floor(Math.random() * msgs.length)];
        setAlerts(prev => [{ id: `a_${Date.now()}`, ...a, time: Date.now() }, ...prev].slice(0, 8));
        setKpis(prev => ({ ...prev, activeAlerts: prev.activeAlerts + 1 }));
      }
    }, 15000);
    return () => clearInterval(iv);
  }, []);

  return { buildings: BUILDINGS, machines, workers, vehicles, sensors, prodLines, kpis, alerts };
}
