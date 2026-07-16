import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface BarChartProps {
  data: any[];
  xKey?: string;
  bars: { key: string; color: string; name?: string }[];
  height?: number;
  horizontal?: boolean;
}

export function BarChart({ data, xKey = 'name', bars, height = 200, horizontal }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} layout={horizontal ? 'vertical' : 'horizontal'}>
        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
        <XAxis type={horizontal ? 'number' : 'category'} dataKey={horizontal ? undefined : xKey} tick={false} axisLine={false} />
        <YAxis type={horizontal ? 'category' : 'number'} dataKey={horizontal ? xKey : undefined} tick={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', color: '#c9d1d9', fontSize: '12px' }}
        />
        {bars.map((b) => (
          <Bar key={b.key} dataKey={b.key} fill={b.color} radius={[4, 4, 0, 0]} name={b.name || b.key} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
