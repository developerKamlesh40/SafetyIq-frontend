import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AreaChartProps {
  data: any[];
  xKey?: string;
  series: { key: string; color: string; name?: string }[];
  height?: number;
  showGrid?: boolean;
  domain?: [number, number];
}

export function AreaChart({ data, xKey = 'timestamp', series, height = 200, showGrid, domain }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />}
        <XAxis dataKey={xKey} tick={false} axisLine={false} />
        <YAxis domain={domain || [0, 'auto']} tick={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', color: '#c9d1d9', fontSize: '12px' }}
          labelFormatter={(label) => new Date(label).toLocaleString()}
        />
        {series.map((s) => (
          <Area key={s.key} type="monotone" dataKey={s.key} stroke={s.color} fill={s.color} fillOpacity={0.1} strokeWidth={2} dot={false} name={s.name || s.key} />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
