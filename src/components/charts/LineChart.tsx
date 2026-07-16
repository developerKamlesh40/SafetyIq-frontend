import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface LineChartProps {
  data: any[];
  xKey?: string;
  lines: { key: string; color: string; name?: string }[];
  height?: number;
  domain?: [number, number];
}

export function LineChart({ data, xKey = 'timestamp', lines, height = 200, domain }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
        <XAxis dataKey={xKey} tick={false} axisLine={false} />
        <YAxis domain={domain || [0, 'auto']} tick={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', color: '#c9d1d9', fontSize: '12px' }}
          labelFormatter={(label) => new Date(label).toLocaleString()}
        />
        {lines.map((l) => (
          <Line key={l.key} type="monotone" dataKey={l.key} stroke={l.color} strokeWidth={2} dot={false} name={l.name || l.key} />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
