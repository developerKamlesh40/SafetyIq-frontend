interface SafetyScoreGaugeProps {
  score: number;
}

export default function SafetyScoreGauge({ score = 0 }: SafetyScoreGaugeProps) {
  const level = score > 75 ? 'text-safety-green' : score > 50 ? 'text-safety-amber' : score > 25 ? 'text-safety-red' : 'text-red-400';
  const bg = score > 75 ? '#00c853' : score > 50 ? '#ff9500' : score > 25 ? '#ff3b3b' : '#d50000';

  return (
    <div className="glass-card p-6 gradient-border">
      <h3 className="text-sm font-medium text-safety-muted mb-4">Safety Score</h3>
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40 mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#30363d" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="40" fill="none" stroke={bg} strokeWidth="8"
              strokeDasharray={`${score * 2.51} 251`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-4xl font-bold ${level}`}>{score}</span>
          </div>
        </div>
        <div className="flex gap-3 text-xs">
          {['Low', 'Medium', 'High', 'Critical'].map((l) => (
            <span key={l} className="text-safety-muted">{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
