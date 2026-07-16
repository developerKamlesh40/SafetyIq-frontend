import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sensorsService } from '../../services/sensors.service';
import { Card, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select } from '../../components/ui/select';
import { getRiskColor } from '../../lib/risk-colors';
import { formatDateTime } from '../../lib/date-format';
import { Thermometer, Droplets, Gauge, Cloud, Activity, Zap, Battery, Droplet, FlaskConical, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const sensorIcons: Record<string, any> = {
  gas: FlaskConical, temperature: Thermometer, humidity: Droplets, pressure: Gauge,
  smoke: Cloud, vibration: Activity, voltage: Zap, current: Battery, flow_rate: Droplet,
};

const zoneOptions = [
  { value: '', label: 'All Zones' },
  { value: '1', label: 'Boiler House' },
  { value: '2', label: 'Chemical Storage' },
  { value: '3', label: 'Tank Farm' },
  { value: '4', label: 'Control Room' },
  { value: '5', label: 'Main Pipeline' },
  { value: '6', label: 'Chemical Processing' },
  { value: '7', label: 'Loading Bay' },
  { value: '8', label: 'Maintenance Workshop' },
];

export default function Sensors() {
  const [selectedType, setSelectedType] = useState('gas');
  const [zoneFilter, setZoneFilter] = useState('');
  const [timeRange, setTimeRange] = useState('1h');

  const { data: latest = [], isLoading } = useQuery({
    queryKey: ['sensors-latest', zoneFilter],
    queryFn: () => sensorsService.getLatest(zoneFilter ? Number(zoneFilter) : undefined),
    refetchInterval: 5000,
  });

  const { data: thresholds } = useQuery({
    queryKey: ['sensor-thresholds'],
    queryFn: () => sensorsService.getThresholds(),
    staleTime: 60000,
  });

  const { data: history } = useQuery({
    queryKey: ['sensor-history', selectedType, timeRange],
    queryFn: () => {
      const now = new Date();
      const from = new Date(now.getTime() - (timeRange === '1h' ? 3600000 : timeRange === '6h' ? 21600000 : timeRange === '24h' ? 86400000 : 604800000));
      return sensorsService.getAll({ sensor_type: selectedType, from: from.toISOString(), to: now.toISOString() });
    },
    enabled: !!selectedType,
    refetchInterval: 15000,
  });

  const latestByType = latest.reduce((acc: any, r: any) => {
    const existing = acc[r.sensor_type];
    if (!existing || new Date(r.reading_timestamp || r.timestamp) > new Date(existing.reading_timestamp || existing.timestamp)) {
      acc[r.sensor_type] = r;
    }
    return acc;
  }, {} as Record<string, any>);

  const historyData = history?.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Sensors</h1>
          <p className="text-safety-muted text-sm mt-1">Real-time IoT sensor monitoring across all zones</p>
        </div>
        <div className="flex items-center gap-3">
          <Select options={zoneOptions} value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} className="w-40" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(latestByType).map(([type, reading]: [string, any]) => {
          const Icon = sensorIcons[type] || Activity;
          return (
            <Card key={type} className={`cursor-pointer transition-all hover:border-safety-cyan/50 ${selectedType === type ? 'border-safety-cyan' : ''}`} onClick={() => setSelectedType(type)}>
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${reading.status === 'critical' ? 'bg-safety-red/20' : reading.status === 'danger' ? 'bg-orange-500/20' : reading.status === 'warning' ? 'bg-safety-amber/20' : 'bg-safety-cyan/20'}`}>
                  <Icon className={`w-4 h-4 ${reading.status === 'critical' ? 'text-safety-red' : reading.status === 'danger' ? 'text-orange-400' : reading.status === 'warning' ? 'text-safety-amber' : 'text-safety-cyan'}`} />
                </div>
                {(reading.status === 'critical' || reading.status === 'danger') && <AlertTriangle className="w-4 h-4 text-safety-red animate-pulse" />}
              </div>
              <p className="text-xl font-bold text-white">{reading.value ?? '--'}</p>
              <p className="text-xs text-safety-muted">{type.replace(/_/g, ' ')} ({reading.unit})</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={reading.status as any} size="sm">{reading.status}</Badge>
                <span className="text-[10px] text-safety-muted">{reading.sensor_id}</span>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardTitle>Sensor History — {selectedType?.replace(/_/g, ' ')}</CardTitle>
        <div className="flex items-center gap-2 mb-4">
          {['1h', '6h', '24h', '7d'].map((range) => (
            <button key={range} onClick={() => setTimeRange(range)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${timeRange === range ? 'bg-safety-cyan/20 text-safety-cyan' : 'text-safety-muted hover:text-white'}`}>
              {range}
            </button>
          ))}
        </div>
        {historyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historyData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="reading_timestamp" tick={false} axisLine={false} />
              <YAxis tick={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', color: '#c9d1d9' }} labelFormatter={(label) => formatDateTime(label)} />
              <Area type="monotone" dataKey="value" stroke="#00d4ff" fill="url(#colorValue)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-safety-muted text-sm">No history data available</div>
        )}
      </Card>

      <Card>
        <CardTitle>Alarm History</CardTitle>
        {latest.filter((r: any) => r.status === 'danger' || r.status === 'critical').length > 0 ? (
          <div className="space-y-2">
            {latest.filter((r: any) => r.status === 'danger' || r.status === 'critical').map((r: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-safety-red/5 border border-safety-red/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-safety-red" />
                  <div>
                    <p className="text-sm text-safety-text capitalize">{r.sensor_type} — {r.sensor_id}</p>
                    <p className="text-xs text-safety-muted">{r.zone_name || `Zone ${r.zone_id}`}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-safety-red">{r.value}{r.unit}</p>
                  <Badge variant={r.status as any} size="sm">{r.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-safety-muted text-center py-6">No active alarms — all sensors normal</p>
        )}
      </Card>
    </div>
  );
}
