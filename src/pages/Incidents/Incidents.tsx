import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentsService } from '../../services/incidents.service';
import { Incident, IncidentStats } from '../../types/incident.types';
import { Card, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { DataTable } from '../../components/data-display/DataTable';
import { Dialog } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Timeline } from '../../components/data-display/Timeline';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import { formatDateTime, timeAgo } from '../../lib/date-format';
import { toast } from '../../components/ui/toast';
import { AlertTriangle, Clock, Shield, Flame, Plus, Search, Loader2, type LucideIcon } from 'lucide-react';

const incidentIcons: Record<string, LucideIcon> = {
  near_miss: AlertTriangle, first_aid: Shield, medical_treatment: Shield, lost_time: Clock,
  fatality: AlertTriangle, fire: Flame, explosion: Flame, chemical_spill: AlertTriangle, environmental: Shield, property_damage: AlertTriangle,
};

const zoneOptions = [
  { value: '1', label: 'Boiler House' },
  { value: '2', label: 'Chemical Storage' },
  { value: '3', label: 'Tank Farm' },
  { value: '4', label: 'Control Room' },
  { value: '5', label: 'Main Pipeline' },
  { value: '6', label: 'Chemical Processing' },
  { value: '7', label: 'Loading Bay' },
  { value: '8', label: 'Maintenance Workshop' },
];

export default function Incidents() {
  const queryClient = useQueryClient();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ incident_type: 'near_miss', severity: 'medium', title: '', description: '', zone_id: '1', incident_timestamp: '' });

  const { data: paginated } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => incidentsService.getAll({ page: 1, limit: 50 }),
    refetchInterval: 15000,
  });

  const { data: today = [] } = useQuery({
    queryKey: ['incidents-today'],
    queryFn: () => incidentsService.getToday(),
    refetchInterval: 15000,
  });

  const { data: stats } = useQuery({
    queryKey: ['incidents-stats'],
    queryFn: () => incidentsService.getStats('30d'),
    refetchInterval: 60000,
  });

  const createMutation = useMutation({
    mutationFn: () => incidentsService.create({
      incident_type: form.incident_type,
      severity: form.severity,
      title: form.title,
      description: form.description || undefined,
      zone_id: Number(form.zone_id),
      incident_timestamp: form.incident_timestamp || new Date().toISOString(),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      toast({ type: 'success', title: 'Incident reported' });
      setShowCreate(false);
      setForm({ incident_type: 'near_miss', severity: 'medium', title: '', description: '', zone_id: '1', incident_timestamp: '' });
    },
    onError: () => toast({ type: 'error', title: 'Failed to report incident' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => incidentsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      toast({ type: 'success', title: 'Incident updated' });
      setSelectedIncident(null);
    },
    onError: () => toast({ type: 'error', title: 'Failed to update incident' }),
  });

  const incidents = paginated?.data || [];

  const statsCards = [
    { label: 'Today', value: today.length, icon: AlertTriangle, color: 'text-safety-red' },
    { label: 'Open', value: incidents.filter((i: Incident) => i.status === 'open').length, icon: Clock, color: 'text-safety-amber' },
    { label: 'This Month', value: stats?.total || 0, icon: Shield, color: 'text-safety-cyan' },
    { label: 'Critical', value: incidents.filter((i: Incident) => i.severity === 'critical').length, icon: AlertTriangle, color: 'text-safety-red' },
  ];

  const columns = [
    { key: 'incident_number', label: 'ID', sortable: true, render: (i: Incident) => <span className="text-safety-red font-medium">{i.incident_number}</span> },
    { key: 'title', label: 'Title', render: (i: Incident) => i.title },
    { key: 'incident_type', label: 'Type', sortable: true, render: (i: Incident) => <Badge variant="info" size="sm">{i.incident_type.replace(/_/g, ' ')}</Badge> },
    { key: 'severity', label: 'Severity', sortable: true, render: (i: Incident) => <Badge variant={i.severity as any} size="sm" pulse={i.severity === 'critical'}>{i.severity}</Badge> },
    { key: 'status', label: 'Status', sortable: true, render: (i: Incident) => <StatusBadge status={i.status} size="sm" /> },
    { key: 'zone_name', label: 'Zone', render: (i: Incident) => i.zone_name || `Zone ${i.zone_id}` },
    { key: 'incident_timestamp', label: 'Time', sortable: true, render: (i: Incident) => <span className="text-xs text-safety-muted">{timeAgo(i.incident_timestamp)}</span> },
  ];

  const timelineEvents = selectedIncident ? [
    { id: 'reported', time: formatDateTime(selectedIncident.incident_timestamp), title: 'Incident Reported', description: selectedIncident.description, severity: selectedIncident.severity as any, icon: <AlertTriangle className="w-3 h-3" /> },
    ...(selectedIncident.status === 'investigating' ? [{ id: 'investigating', time: formatDateTime(selectedIncident.reported_at), title: 'Investigation Started', severity: 'medium' as any, icon: <Search className="w-3 h-3" /> }] : []),
    ...(selectedIncident.resolved_at ? [{ id: 'resolved', time: formatDateTime(selectedIncident.resolved_at), title: 'Incident Resolved', severity: 'low' as any, icon: <Shield className="w-3 h-3" /> }] : []),
  ] : [];

  const actionButtons = () => {
    if (!selectedIncident) return null;
    const s = selectedIncident.status;
    return (
      <div className="flex gap-2 pt-2 border-t border-safety-border">
        {s === 'open' && (
          <Button onClick={() => updateMutation.mutate({ id: selectedIncident.id, data: { status: 'investigating' } })} variant="primary" size="sm" className="flex-1">Start Investigation</Button>
        )}
        {s === 'investigating' && (
          <Button onClick={() => updateMutation.mutate({ id: selectedIncident.id, data: { status: 'action_required' } })} variant="primary" size="sm" className="flex-1">Action Required</Button>
        )}
        {s === 'action_required' && (
          <>
            <Button onClick={() => updateMutation.mutate({ id: selectedIncident.id, data: { status: 'resolved', resolved_at: new Date().toISOString() } })} variant="secondary" size="sm" className="flex-1">Resolve</Button>
            <Button onClick={() => updateMutation.mutate({ id: selectedIncident.id, data: { status: 'closed', resolved_at: new Date().toISOString() } })} variant="secondary" size="sm" className="flex-1">Close</Button>
          </>
        )}
        {s === 'resolved' && (
          <Button onClick={() => updateMutation.mutate({ id: selectedIncident.id, data: { status: 'closed' } })} variant="secondary" size="sm" className="flex-1">Close</Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Incidents</h1>
          <p className="text-safety-muted text-sm mt-1">Safety incident tracking, investigation, and resolution</p>
        </div>
        <Button onClick={() => setShowCreate(true)} variant="primary" size="sm"><Plus className="w-4 h-4" /> Report Incident</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-safety-card"><stat.icon className={`w-4 h-4 ${stat.color}`} /></div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-safety-muted">{stat.label}</p>
          </Card>
        ))}
      </div>

      <DataTable columns={columns} data={incidents} onRowClick={(i) => setSelectedIncident(i)} page={paginated?.pagination?.page || 1} total={paginated?.pagination?.total || incidents.length} pageSize={20} />

      <Dialog open={showCreate} onClose={() => setShowCreate(false)} title="Report Incident">
        <div className="space-y-4">
          <Select label="Incident Type" options={[
            { value: 'near_miss', label: 'Near Miss' },
            { value: 'first_aid', label: 'First Aid' },
            { value: 'medical_treatment', label: 'Medical Treatment' },
            { value: 'lost_time', label: 'Lost Time' },
            { value: 'fire', label: 'Fire' },
            { value: 'explosion', label: 'Explosion' },
            { value: 'chemical_spill', label: 'Chemical Spill' },
            { value: 'environmental', label: 'Environmental' },
            { value: 'property_damage', label: 'Property Damage' },
          ]} value={form.incident_type} onChange={(e) => setForm({...form, incident_type: e.target.value})} />
          <Input label="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
          <Input label="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
          <Select label="Zone" options={zoneOptions} value={form.zone_id} onChange={(e) => setForm({...form, zone_id: e.target.value})} />
          <Select label="Severity" options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'critical', label: 'Critical' },
          ]} value={form.severity} onChange={(e) => setForm({...form, severity: e.target.value})} />
          <Input label="Incident Time" type="datetime-local" value={form.incident_timestamp} onChange={(e) => setForm({...form, incident_timestamp: e.target.value})} />
          <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.title} className="w-full">
            {createMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Reporting...</> : 'Report Incident'}
          </Button>
        </div>
      </Dialog>

      <Dialog open={!!selectedIncident} onClose={() => setSelectedIncident(null)} title={selectedIncident ? `${selectedIncident.incident_number} — ${selectedIncident.title}` : ''} className="max-w-2xl">
        {selectedIncident && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              {(() => { const Icon = incidentIcons[selectedIncident.incident_type] || AlertTriangle; return <Icon className="w-4 h-4 text-safety-red" />; })()}
              <Badge variant={selectedIncident.severity as any} pulse={selectedIncident.severity === 'critical'}>{selectedIncident.severity}</Badge>
              <StatusBadge status={selectedIncident.status} size="sm" />
              <span className="text-xs text-safety-muted">Zone: {selectedIncident.zone_name || selectedIncident.zone_id}</span>
            </div>
            <p className="text-sm text-safety-text bg-safety-card rounded-lg p-3">{selectedIncident.description || 'No description'}</p>
            {selectedIncident.ai_analysis && (
              <div>
                <h4 className="text-xs font-medium text-safety-muted uppercase mb-2">AI Analysis</h4>
                <p className="text-sm text-safety-cyan bg-safety-cyan/5 rounded-lg p-3 border border-safety-cyan/20">{selectedIncident.ai_analysis}</p>
              </div>
            )}
            {selectedIncident.root_cause && (
              <div>
                <h4 className="text-xs font-medium text-safety-muted uppercase mb-1">Root Cause</h4>
                <p className="text-sm text-safety-text bg-safety-card rounded-lg p-3">{selectedIncident.root_cause}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {selectedIncident.corrective_action && (
                <div className="p-3 rounded-lg bg-safety-green/5 border border-safety-green/20">
                  <p className="text-xs text-safety-green font-medium mb-1">Corrective Action</p>
                  <p className="text-sm text-safety-text">{selectedIncident.corrective_action}</p>
                </div>
              )}
              {selectedIncident.preventive_action && (
                <div className="p-3 rounded-lg bg-safety-cyan/5 border border-safety-cyan/20">
                  <p className="text-xs text-safety-cyan font-medium mb-1">Preventive Action</p>
                  <p className="text-sm text-safety-text">{selectedIncident.preventive_action}</p>
                </div>
              )}
            </div>
            <div>
              <h4 className="text-xs font-medium text-safety-muted uppercase mb-2">Timeline</h4>
              <Timeline events={timelineEvents} />
            </div>
            {actionButtons()}
          </div>
        )}
      </Dialog>
    </div>
  );
}
