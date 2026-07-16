import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface IncidentsChartProps {
  data: Array<{ timestamp: string; score: number; level: string }>;
}

export default function IncidentsChart({ data = [] }: IncidentsChartProps) {
  return (
    <div className="glass-card p-6 gradient-border">
      <h3 className="text-sm font-medium text-safety-muted mb-4">Risk Trend (24h)</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis dataKey="timestamp" tick={false} axisLine={false} />
            <YAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '8px',
                color: '#c9d1d9',
              }}
              labelFormatter={(label) => new Date(label).toLocaleString()}
              formatter={(value: number) => [`${value}`, 'Risk Score']}
            />
            <Line type="monotone" dataKey="score" stroke="#00d4ff" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-safety-muted text-sm">
          No risk data available
        </div>
      )}
    </div>
  );
}
