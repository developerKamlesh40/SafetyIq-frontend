import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { permitsService } from '../../services/permits.service';
import { Permit } from '../../types/permit.types';
import { Card, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { DataTable } from '../../components/data-display/DataTable';
import { Dialog } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import { formatDateTime, formatDuration, timeAgo } from '../../lib/date-format';
import { toast } from '../../components/ui/toast';
import { FileText, Clock, AlertTriangle, Plus, Flame, Wind, Zap, Drill, ArrowUp, Loader2, type LucideIcon } from 'lucide-react';

const permitTypeIcons: Record<string, LucideIcon> = {
  hot_work: Flame, confined_space: Wind, electrical_isolation: Zap, excavation: Drill, working_at_height: ArrowUp,
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

export default function Permits() {
  const queryClient = useQueryClient();
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ permit_type: 'hot_work', title: '', zone_id: '1', description: '', start_time: '', end_time: '', safety_measures: '' });

  const { data: permits = [] } = useQuery({
    queryKey: ['permits-active'],
    queryFn: () => permitsService.getActive(),
    refetchInterval: 15000,
  });

  const { data: paginated } = useQuery({
    queryKey: ['permits-all'],
    queryFn: () => permitsService.getAll({ page: 1, limit: 50 }),
    refetchInterval: 30000,
  });

  const { data: expiring = [] } = useQuery({
    queryKey: ['permits-expiring'],
    queryFn: () => permitsService.getExpiring(60),
    refetchInterval: 30000,
  });

  const createMutation = useMutation({
    mutationFn: () => permitsService.create({
      permit_type: form.permit_type,
      title: form.title,
      zone_id: Number(form.zone_id),
      description: form.description || undefined,
      start_time: form.start_time,
      end_time: form.end_time,
      safety_measures: form.safety_measures || undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permits'] });
      toast({ type: 'success', title: 'Permit created successfully' });
      setShowCreate(false);
      setForm({ permit_type: 'hot_work', title: '', zone_id: '1', description: '', start_time: '', end_time: '', safety_measures: '' });
    },
    onError: () => toast({ type: 'error', title: 'Failed to create permit' }),
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => permitsService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permits'] });
      toast({ type: 'success', title: 'Permit approved' });
    },
    onError: () => toast({ type: 'error', title: 'Failed to approve permit' }),
  });

  const completeMutation = useMutation({
    mutationFn: (id: number) => permitsService.update(id, { status: 'completed' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permits'] });
      toast({ type: 'success', title: 'Permit completed' });
    },
    onError: () => toast({ type: 'error', title: 'Failed to complete permit' }),
  });

  const allPermits = paginated?.data || permits;

  const statsCards = [
    { label: 'Active Permits', value: permits.length, icon: FileText, color: 'text-safety-green' },
    { label: 'Pending Approval', value: allPermits.filter((p: Permit) => p.status === 'pending').length, icon: Clock, color: 'text-safety-amber' },
    { label: 'Expiring Soon', value: expiring.length, icon: AlertTriangle, color: 'text-safety-red' },
    { label: 'Total Permits', value: paginated?.pagination?.total || allPermits.length, icon: FileText, color: 'text-safety-cyan' },
  ];

  const columns = [
    { key: 'permit_number', label: 'Permit #', sortable: true, render: (p: Permit) => <span className="text-safety-cyan font-medium">{p.permit_number}</span> },
    { key: 'permit_type', label: 'Type', sortable: true, render: (p: Permit) => {
      const Icon = permitTypeIcons[p.permit_type] || FileText;
      return <div className="flex items-center gap-1.5"><Icon className="w-3.5 h-3.5 text-safety-muted" /><span className="capitalize">{p.permit_type.replace(/_/g, ' ')}</span></div>;
    }},
    { key: 'title', label: 'Title', render: (p: Permit) => p.title },
    { key: 'status', label: 'Status', sortable: true, render: (p: Permit) => <StatusBadge status={p.status} pulse={p.status === 'active'} size="sm" /> },
    { key: 'zone_name', label: 'Zone', render: (p: Permit) => p.zone_name || `Zone ${p.zone_id}` },
    { key: 'end_time', label: 'Expires', render: (p: Permit) => <span className="text-xs text-safety-muted">{timeAgo(p.end_time)}</span> },
  ];

  const canApprove = selectedPermit?.status === 'pending';
  const canComplete = selectedPermit?.status === 'active';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Permits</h1>
          <p className="text-safety-muted text-sm mt-1">Permit to Work System — manage and monitor work permits</p>
        </div>
        <Button onClick={() => setShowCreate(true)} variant="primary" size="sm"><Plus className="w-4 h-4" /> New Permit</Button>
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

      {expiring.length > 0 && (
        <div className="p-3 rounded-lg bg-safety-amber/10 border border-safety-amber/20 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-safety-amber flex-shrink-0" />
          <p className="text-sm text-safety-text">{expiring.length} permit(s) expiring within the next hour</p>
        </div>
      )}

      <DataTable columns={columns} data={allPermits} onRowClick={(p) => setSelectedPermit(p)} page={paginated?.pagination?.page || 1} total={paginated?.pagination?.total || allPermits.length} pageSize={20} />

      <Dialog open={showCreate} onClose={() => setShowCreate(false)} title="New Permit">
        <div className="space-y-4">
          <Select label="Permit Type" options={[
            { value: 'hot_work', label: 'Hot Work' },
            { value: 'confined_space', label: 'Confined Space' },
            { value: 'electrical_isolation', label: 'Electrical Isolation' },
            { value: 'excavation', label: 'Excavation' },
            { value: 'working_at_height', label: 'Working at Height' },
          ]} value={form.permit_type} onChange={(e) => setForm({...form, permit_type: e.target.value})} />
          <Input label="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
          <Select label="Zone" options={zoneOptions} value={form.zone_id} onChange={(e) => setForm({...form, zone_id: e.target.value})} />
          <Input label="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Time" type="datetime-local" value={form.start_time} onChange={(e) => setForm({...form, start_time: e.target.value})} />
            <Input label="End Time" type="datetime-local" value={form.end_time} onChange={(e) => setForm({...form, end_time: e.target.value})} />
          </div>
          <Input label="Safety Measures" value={form.safety_measures} onChange={(e) => setForm({...form, safety_measures: e.target.value})} />
          <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.title || !form.start_time || !form.end_time} className="w-full">
            {createMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Permit'}
          </Button>
        </div>
      </Dialog>

      <Dialog open={!!selectedPermit} onClose={() => setSelectedPermit(null)} title={selectedPermit ? `${selectedPermit.permit_number} — ${selectedPermit.title}` : ''}>
        {selectedPermit && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {(() => { const Icon = permitTypeIcons[selectedPermit.permit_type] || FileText; return <Icon className="w-4 h-4 text-safety-cyan" />; })()}
              <span className="text-sm text-white capitalize">{selectedPermit.permit_type.replace(/_/g, ' ')}</span>
              <StatusBadge status={selectedPermit.status} size="sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-safety-card">
                <p className="text-xs text-safety-muted">Zone</p>
                <p className="text-sm text-white">{selectedPermit.zone_name || `Zone ${selectedPermit.zone_id}`}</p>
              </div>
              <div className="p-3 rounded-lg bg-safety-card">
                <p className="text-xs text-safety-muted">Duration</p>
                <p className="text-sm text-white">{formatDuration(selectedPermit.start_time, selectedPermit.end_time)}</p>
              </div>
              <div className="p-3 rounded-lg bg-safety-card">
                <p className="text-xs text-safety-muted">Start</p>
                <p className="text-sm text-white">{formatDateTime(selectedPermit.start_time)}</p>
              </div>
              <div className="p-3 rounded-lg bg-safety-card">
                <p className="text-xs text-safety-muted">End</p>
                <p className="text-sm text-white">{formatDateTime(selectedPermit.end_time)}</p>
              </div>
            </div>
            {selectedPermit.safety_measures && (
              <div>
                <h4 className="text-xs font-medium text-safety-muted uppercase mb-1">Safety Measures</h4>
                <p className="text-sm text-safety-text bg-safety-card rounded-lg p-3">{selectedPermit.safety_measures}</p>
              </div>
            )}
            {selectedPermit.assigned_workers && selectedPermit.assigned_workers.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-safety-muted uppercase mb-2">Assigned Workers</h4>
                <div className="space-y-1">
                  {selectedPermit.assigned_workers.map((w: any) => (
                    <div key={w.id} className="text-sm text-safety-text bg-safety-card/50 rounded-lg p-2">{w.first_name} {w.last_name} — {w.role}</div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-2 border-t border-safety-border">
              {canApprove && <Button onClick={() => { approveMutation.mutate(selectedPermit.id); setSelectedPermit(null); }} variant="primary" size="sm" className="flex-1">Approve</Button>}
              {canComplete && <Button onClick={() => { completeMutation.mutate(selectedPermit.id); setSelectedPermit(null); }} variant="secondary" size="sm" className="flex-1">Mark Complete</Button>}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
