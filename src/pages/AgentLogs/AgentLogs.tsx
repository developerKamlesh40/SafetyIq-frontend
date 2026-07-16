import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Bot, Radio, FileText, Wrench, Eye, Shield, AlertTriangle,
  FileBarChart, Activity, Play, RefreshCw, ChevronDown, ChevronUp,
  Clock, Zap, Target, Brain, CheckCircle2, XCircle,
} from 'lucide-react';

const api = axios.create({ baseURL: '/api' });
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

const AGENT_ICONS: Record<string, any> = {
  'Sensor Agent': Radio,
  'Permit Agent': FileText,
  'Maintenance Agent': Wrench,
  'Vision Agent': Eye,
  'Compliance Agent': Shield,
  'Risk Assessment Agent': Target,
  'Emergency Agent': AlertTriangle,
  'Report Agent': FileBarChart,
};

const AGENT_COLORS: Record<string, string> = {
  'Sensor Agent': '#00d4ff',
  'Permit Agent': '#a78bfa',
  'Maintenance Agent': '#f59e0b',
  'Vision Agent': '#3b82f6',
  'Compliance Agent': '#22c55e',
  'Risk Assessment Agent': '#ef4444',
  'Emergency Agent': '#f97316',
  'Report Agent': '#06b6d4',
};

interface AgentLog {
  id: string;
  agentName: string;
  zoneId: number;
  zoneName: string;
  score: number;
  level: string;
  findings: string[];
  recommendations: string[];
  confidence: number;
  executionMs: number;
  timestamp: string;
}

function getLevelColor(level: string) {
  switch (level) {
    case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
    case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    default: return 'text-green-400 bg-green-500/10 border-green-500/20';
  }
}

export default function AgentLogs() {
  const queryClient = useQueryClient();
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(false);

  const { data: agentsData, isLoading: agentsLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: () => api.get('/agents').then(r => r.data.data),
    refetchInterval: autoRefresh ? 10000 : false,
  });

  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ['agent-logs', selectedAgent],
    queryFn: () => api.get('/agents/logs', {
      params: { limit: 100, agent: selectedAgent !== 'all' ? selectedAgent : undefined },
    }).then(r => r.data.data),
    refetchInterval: autoRefresh ? 5000 : false,
  });

  const runMutation = useMutation({
    mutationFn: () => api.post('/agents/run'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      queryClient.invalidateQueries({ queryKey: ['agent-logs'] });
    },
  });

  // Auto-refresh polling
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['agent-logs'] });
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, queryClient]);

  const agents = agentsData?.agents || [];
  const logs: AgentLog[] = logsData || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Brain className="w-7 h-7 text-safety-cyan" />
            AI Agent Monitor
          </h1>
          <p className="text-safety-muted text-sm mt-1">
            Real-time visibility into all {agents.length} agents • {logs.length} execution logs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2 border ${
              autoRefresh
                ? 'bg-safety-cyan/10 text-safety-cyan border-safety-cyan/30 shadow-[0_0_15px_rgba(0,212,255,0.15)]'
                : 'bg-[#061115] text-gray-500 border-white/5 hover:text-white hover:bg-white/5'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            Live
          </button>
          <button
            onClick={() => runMutation.mutate()}
            disabled={runMutation.isPending}
            className="px-5 py-2.5 rounded-xl bg-safety-cyan text-black text-xs font-bold uppercase tracking-wide hover:bg-[#00e0ff] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.2)] disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {runMutation.isPending ? 'Analyzing...' : 'Run All Agents'}
          </button>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-4 gap-4">
        {agents.map((agent: any) => {
          const Icon = AGENT_ICONS[agent.name] || Bot;
          const color = AGENT_COLORS[agent.name] || '#00d4ff';
          const latestLog = logs.find((l: AgentLog) => l.agentName === agent.name);

          return (
            <Card
              key={agent.name}
              className={`p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-white/10 ${
                selectedAgent === agent.name ? 'border-safety-cyan/30 bg-safety-cyan/5' : ''
              }`}
              onClick={() => setSelectedAgent(selectedAgent === agent.name ? 'all' : agent.name)}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-safety-green animate-pulse shadow-[0_0_6px_#22c55e]" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active</span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-white mb-0.5">{agent.name}</h3>
              <p className="text-[11px] text-gray-500 mb-4 line-clamp-1">{agent.description}</p>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-gray-600">Runs: {agent.totalRuns}</span>
                {latestLog && (
                  <span className={`px-2 py-0.5 rounded ${getLevelColor(latestLog.level)} border text-[9px]`}>
                    {latestLog.level} • {latestLog.score}
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#061115] border border-white/5 rounded-xl p-1">
          <button
            onClick={() => setSelectedAgent('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide uppercase transition-all ${
              selectedAgent === 'all' ? 'bg-safety-cyan text-black' : 'text-gray-500 hover:text-white'
            }`}
          >
            All Agents
          </button>
          {agents.slice(0, 4).map((a: any) => (
            <button
              key={a.name}
              onClick={() => setSelectedAgent(a.name)}
              className={`px-3 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                selectedAgent === a.name ? 'bg-safety-cyan text-black' : 'text-gray-500 hover:text-white'
              }`}
            >
              {a.name.replace(' Agent', '')}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-600 font-medium ml-auto">
          Showing {logs.length} logs {selectedAgent !== 'all' ? `for ${selectedAgent}` : ''}
        </span>
      </div>

      {/* Execution Logs Table */}
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[180px_140px_80px_80px_80px_1fr_60px] gap-4 px-6 py-3 border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <span>Agent</span>
          <span>Zone</span>
          <span>Score</span>
          <span>Level</span>
          <span>Confidence</span>
          <span>Timestamp</span>
          <span></span>
        </div>

        {logs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Bot className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-sm font-medium">No agent logs yet</p>
            <p className="text-xs mt-1">Click "Run All Agents" to trigger an analysis cycle</p>
          </div>
        )}

        <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
          {logs.map((log: AgentLog) => {
            const Icon = AGENT_ICONS[log.agentName] || Bot;
            const color = AGENT_COLORS[log.agentName] || '#00d4ff';
            const isExpanded = expandedLog === log.id;

            return (
              <div key={log.id} className="border-b border-white/[0.03] last:border-0">
                <div
                  className="grid grid-cols-[180px_140px_80px_80px_80px_1fr_60px] gap-4 px-6 py-3.5 hover:bg-white/[0.02] cursor-pointer transition-colors items-center"
                  onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                    <span className="text-sm font-semibold text-white truncate">{log.agentName}</span>
                  </div>
                  <span className="text-sm text-gray-300">{log.zoneName}</span>
                  <span className="text-sm font-bold" style={{ color: log.score > 75 ? '#ef4444' : log.score > 50 ? '#f97316' : log.score > 25 ? '#f59e0b' : '#22c55e' }}>
                    {log.score}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded w-fit ${getLevelColor(log.level)} border`}>
                    {log.level}
                  </span>
                  <span className="text-sm text-gray-400">{(log.confidence * 100).toFixed(0)}%</span>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {new Date(log.timestamp).toLocaleTimeString()}
                    <span className="text-gray-600">• {log.executionMs}ms</span>
                  </div>
                  <div className="flex justify-end">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-5 pt-1 bg-[#04080b] border-t border-white/5 animate-fade-in">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-safety-amber" /> Findings
                        </h4>
                        <div className="space-y-1.5">
                          {log.findings.map((f, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                              <XCircle className="w-3.5 h-3.5 text-safety-amber mt-0.5 flex-shrink-0" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-safety-cyan" /> Recommendations
                        </h4>
                        <div className="space-y-1.5">
                          {log.recommendations.map((r, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                              <Zap className="w-3.5 h-3.5 text-safety-cyan mt-0.5 flex-shrink-0" />
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
