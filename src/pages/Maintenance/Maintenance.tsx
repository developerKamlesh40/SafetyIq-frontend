import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { maintenanceService } from '../../services/maintenance.service';
import { Card, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { DataTable } from '../../components/data-display/DataTable';
import { Dialog } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import { formatDateTime } from '../../lib/date-format';
import { toast } from '../../components/ui/toast';
import { Wrench, AlertTriangle, Clock, Power, Plus, Loader2 } from 'lucide-react';

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

export default function Maintenance() {
  const queryClient = useQueryClient();
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ equipment_name: '', equipment_id: '', zone_id: '1', maintenance_type: 'preventive', priority: 'medium', description: '', scheduled_date: '', requires_shutdown: false });

  const { data: paginated } = useQuery({
    queryKey: ['maintenance'],
    queryFn: () => maintenanceService.getAll({ page: 1, limit: 50 }),
    refetchInterval: 30000,
  });

  const { data: overdue = [] } = useQuery({
    queryKey: ['maintenance-overdue'],
    queryFn: () => maintenanceService.getOverdue(),
    refetchInterval: 30000,
  });

  const createMutation = useMutation({
    mutationFn: () => maintenanceService.create({
      equipment_name: form.equipment_name,
      equipment_id: form.equipment_id,
      zone_id: Number(form.zone_id),
      maintenance_type: form.maintenance_type,
      priority: form.priority as any,
      description: form.description || undefined,
      scheduled_date: form.scheduled_date || undefined,
      requires_shutdown: form.requires_shutdown,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast({ type: 'success', title: 'Maintenance scheduled' });
      setShowCreate(false);
      setForm({ equipment_name: '', equipment_id: '', zone_id: '1', maintenance_type: 'preventive', priority: 'medium', description: '', scheduled_date: '', requires_shutdown: false });
    },
    onError: () => toast({ type: 'error', title: 'Failed to schedule maintenance' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => maintenanceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast({ type: 'success', title: 'Maintenance updated' });
      setSelectedRecord(null);
    },
    onError: () => toast({ type: 'error', title: 'Failed to update maintenance' }),
  });

  const records = paginated?.data || [];

  const statsCards = [
    { label: 'Total Records', value: paginated?.pagination?.total || records.length, icon: Wrench, color: 'text-safety-cyan' },
    { label: 'In Progress', value: records.filter((r: any) => r.status === 'in_progress').length, icon: Clock, color: 'text-safety-amber' },
    { label: 'Overdue', value: overdue.length, icon: AlertTriangle, color: 'text-safety-red' },
    { label: 'Requires Shutdown', value: records.filter((r: any) => r.requires_shutdown).length, icon: Power, color: 'text-safety-red' },
  ];

  const columns = [
    { key: 'equipment_id', label: 'Equipment', sortable: true, render: (r: any) => <span className="text-safety-cyan font-medium">{r.equipment_id}</span> },
    { key: 'equipment_name', label: 'Name', render: (r: any) => r.equipment_name },
    { key: 'maintenance_type', label: 'Type', sortable: true, render: (r: any) => <Badge variant="info" size="sm">{r.maintenance_type}</Badge> },
    { key: 'status', label: 'Status', sortable: true, render: (r: any) => <StatusBadge status={r.status} pulse={r.status === 'in_progress'} size="sm" /> },
    { key: 'priority', label: 'Priority', sortable: true, render: (r: any) => <Badge variant={r.priority as any} size="sm">{r.priority}</Badge> },
    { key: 'zone_name', label: 'Zone', render: (r: any) => r.zone_name || `Zone ${r.zone_id}` },
    { key: 'scheduled_date', label: 'Scheduled', render: (r: any) => r.scheduled_date ? formatDateTime(r.scheduled_date) : '--' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Maintenance</h1>
          <p className="text-safety-muted text-sm mt-1">Equipment maintenance tracking and scheduling</p>
        </div>
        <Button onClick={() => setShowCreate(true)} variant="primary" size="sm"><Plus className="w-4 h-4" /> Schedule Maintenance</Button>
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

      {overdue.length > 0 && (
        <div className="p-3 rounded-lg bg-safety-red/10 border border-safety-red/20 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-safety-red flex-shrink-0" />
          <p className="text-sm text-safety-text">{overdue.length} maintenance task(s) are overdue</p>
        </div>
      )}

      <DataTable columns={columns} data={records} onRowClick={(r) => setSelectedRecord(r)} page={paginated?.pagination?.page || 1} total={paginated?.pagination?.total || records.length} pageSize={20} />

      <Dialog open={showCreate} onClose={() => setShowCreate(false)} title="Schedule Maintenance">
        <div className="space-y-4">
          <Input label="Equipment Name" value={form.equipment_name} onChange={(e) => setForm({...form, equipment_name: e.target.value})} />
          <Input label="Equipment ID" value={form.equipment_id} onChange={(e) => setForm({...form, equipment_id: e.target.value})} />
          <Select label="Zone" options={zoneOptions} value={form.zone_id} onChange={(e) => setForm({...form, zone_id: e.target.value})} />
          <Select label="Type" options={[
            { value: 'preventive', label: 'Preventive' },
            { value: 'corrective', label: 'Corrective' },
            { value: 'predictive', label: 'Predictive' },
            { value: 'emergency', label: 'Emergency' },
            { value: 'inspection', label: 'Inspection' },
          ]} value={form.maintenance_type} onChange={(e) => setForm({...form, maintenance_type: e.target.value})} />
          <Select label="Priority" options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'critical', label: 'Critical' },
          ]} value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})} />
          <Input label="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
          <Input label="Scheduled Date" type="datetime-local" value={form.scheduled_date} onChange={(e) => setForm({...form, scheduled_date: e.target.value})} />
          <label className="flex items-center gap-2 text-sm text-safety-text cursor-pointer">
            <input type="checkbox" checked={form.requires_shutdown} onChange={(e) => setForm({...form, requires_shutdown: e.target.checked})} className="rounded border-safety-border bg-safety-card" />
            Requires Shutdown
          </label>
          <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.equipment_name || !form.equipment_id} className="w-full">
            {createMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Scheduling...</> : 'Schedule Maintenance'}
          </Button>
        </div>
      </Dialog>

      <Dialog open={!!selectedRecord} onClose={() => setSelectedRecord(null)} title={selectedRecord?.equipment_name || 'Maintenance Detail'}>
        {selectedRecord && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-safety-card">
                <p className="text-xs text-safety-muted">Equipment</p>
                <p className="text-sm text-white">{selectedRecord.equipment_id}</p>
              </div>
              <div className="p-3 rounded-lg bg-safety-card">
                <p className="text-xs text-safety-muted">Type</p>
                <p className="text-sm text-white capitalize">{selectedRecord.maintenance_type}</p>
              </div>
              <div className="p-3 rounded-lg bg-safety-card">
                <p className="text-xs text-safety-muted">Priority</p>
                <Badge variant={selectedRecord.priority as any}>{selectedRecord.priority}</Badge>
              </div>
              <div className="p-3 rounded-lg bg-safety-card">
                <p className="text-xs text-safety-muted">Status</p>
                <StatusBadge status={selectedRecord.status} /></div>
              <div className="p-3 rounded-lg bg-safety-card col-span-2">
                <p className="text-xs text-safety-muted">Description</p>
                <p className="text-sm text-white mt-0.5">{selectedRecord.description || 'No description'}</p>
              </div>
              {selectedRecord.requires_shutdown && (
                <div className="col-span-2 p-3 rounded-lg bg-safety-red/10 border border-safety-red/20">
                  <p className="text-xs text-safety-red font-medium">⚠ Requires Shutdown — {selectedRecord.shutdown_area || selectedRecord.zone_name}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-2 border-t border-safety-border">
              {selectedRecord.status === 'scheduled' && (
                <Button onClick={() => updateMutation.mutate({ id: selectedRecord.id, data: { status: 'in_progress' } })} variant="primary" size="sm" className="flex-1">Start Work</Button>
              )}
              {selectedRecord.status === 'in_progress' && (
                <Button onClick={() => updateMutation.mutate({ id: selectedRecord.id, data: { status: 'completed', completed_at: new Date().toISOString() } })} variant="secondary" size="sm" className="flex-1">Mark Complete</Button>
              )}
              {(selectedRecord.status === 'scheduled' || selectedRecord.status === 'in_progress') && (
                <Button onClick={() => updateMutation.mutate({ id: selectedRecord.id, data: { status: 'cancelled' } })} variant="secondary" size="sm" className="flex-1">Cancel</Button>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
