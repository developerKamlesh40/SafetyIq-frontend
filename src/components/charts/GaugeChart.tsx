interface GaugeChartProps {
  value: number;
  max?: number;
  label?: string;
  size?: number;
  segments?: { min: number; max: number; color: string }[];
}

const defaultSegments = [
  { min: 0, max: 25, color: '#00c853' },
  { min: 25, max: 50, color: '#ff9500' },
  { min: 50, max: 75, color: '#ff6b00' },
  { min: 75, max: 100, color: '#ff3b3b' },
];

export function GaugeChart({ value = 0, max = 100, label, size = 160, segments = defaultSegments }: GaugeChartProps) {
  const pct = Math.min(100, (value / max) * 100);
  const color = segments.find(s => pct >= s.min && pct < s.max)?.color || segments[segments.length - 1].color;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.6} viewBox="0 0 100 60" className="overflow-visible">
        <path d="M 10 50 A 40 40 0 1 1 90 50" fill="none" stroke="#30363d" strokeWidth="6" strokeLinecap="round" />
        <path
          d="M 10 50 A 40 40 0 1 1 90 50"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
        <text x="50" y="50" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{value}</text>
        {label && <text x="50" y="58" textAnchor="middle" fill="#8b949e" fontSize="4">{label}</text>}
      </svg>
      <div className="flex justify-between w-full mt-2 px-1">
        {segments.map((s, i) => (
          <span key={i} className="text-[10px] text-safety-muted">{s.min}</span>
        ))}
        <span className="text-[10px] text-safety-muted">{max}</span>
      </div>
    </div>
  );
}
