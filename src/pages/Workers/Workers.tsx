import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workersService } from '../../services/workers.service';
import { Worker } from '../../types/worker.types';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { DataTable } from '../../components/data-display/DataTable';
import { Dialog } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import { formatDateTime } from '../../lib/date-format';
import { toast } from '../../components/ui/toast';
import { Users, Shield, HardHat, Eye, Glasses, Footprints, Search, Plus, Loader2 } from 'lucide-react';

export default function Workers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [shiftFilter, setShiftFilter] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ employee_id: '', first_name: '', last_name: '', role: 'operator', department: '', shift: 'day' });

  const { data: onSite = [] } = useQuery({
    queryKey: ['workers-onsite'],
    queryFn: () => workersService.getOnSite(),
    refetchInterval: 15000,
  });

  const { data: paginated } = useQuery({
    queryKey: ['workers', search, shiftFilter],
    queryFn: () => workersService.getAll({ search, shift: shiftFilter || undefined, page: 1, limit: 50 }),
    refetchInterval: 30000,
  });

  const createMutation = useMutation({
    mutationFn: () => workersService.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      toast({ type: 'success', title: 'Worker added' });
      setShowCreate(false);
      setForm({ employee_id: '', first_name: '', last_name: '', role: 'operator', department: '', shift: 'day' });
    },
    onError: () => toast({ type: 'error', title: 'Failed to add worker' }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => workersService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      toast({ type: 'success', title: 'Worker removed' });
      setSelectedWorker(null);
    },
    onError: () => toast({ type: 'error', title: 'Failed to remove worker' }),
  });

  const workers = paginated?.data || onSite;

  const gearConfig = [
    { key: 'helmet', Icon: HardHat, label: 'Helmet' },
    { key: 'vest', Icon: Shield, label: 'Vest' },
    { key: 'boots', Icon: Footprints, label: 'Boots' },
    { key: 'gloves', Icon: Eye, label: 'Gloves' },
    { key: 'goggles', Icon: Glasses, label: 'Goggles' },
  ];

  const renderGearStatus = (worker: Worker) => (
    <div className="flex items-center gap-1.5">
      {gearConfig.map((g) => {
        const status = (worker as any)[`${g.key}_status`];
        return (
          <div key={g.key} className={`p-1 rounded ${status === 'ok' ? 'bg-safety-green/10 text-safety-green' : 'bg-safety-red/10 text-safety-red'}`} title={`${g.label}: ${status}`}>
            <g.Icon className="w-3 h-3" />
          </div>
        );
      })}
    </div>
  );

  const statsCards = [
    { label: 'On-Site Workers', value: onSite.length, icon: Users, color: 'text-safety-cyan' },
    { label: 'Day Shift', value: workers.filter((w: Worker) => w.shift === 'day').length, icon: Users, color: 'text-safety-amber' },
    { label: 'Night Shift', value: workers.filter((w: Worker) => w.shift === 'night').length, icon: Users, color: 'text-safety-green' },
    { label: 'Gear Issues', value: workers.filter((w: Worker) => gearConfig.some(g => (w as any)[`${g.key}_status`] !== 'ok')).length, icon: Shield, color: 'text-safety-red' },
  ];

  const columns = [
    { key: 'employee_id', label: 'ID', sortable: true },
    { key: 'full_name', label: 'Name', sortable: true, render: (w: Worker) => `${w.first_name} ${w.last_name || ''}` },
    { key: 'role', label: 'Role', sortable: true, render: (w: Worker) => <Badge variant="info" size="sm">{w.role}</Badge> },
    { key: 'zone_name', label: 'Zone', render: (w: Worker) => w.zone_name || `Zone ${w.current_zone_id}` || '--' },
    { key: 'shift', label: 'Shift', sortable: true, render: (w: Worker) => <StatusBadge status={w.shift} size="sm" /> },
    { key: 'is_on_site', label: 'Status', render: (w: Worker) => <StatusBadge status={w.is_on_site ? 'on_site' : 'off_site'} pulse={!!w.is_on_site} size="sm" /> },
    { key: 'safety_gear', label: 'PPE', render: renderGearStatus },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Workers</h1>
          <p className="text-safety-muted text-sm mt-1">Worker tracking, safety gear monitoring, and shift management</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-safety-muted" />
            <input type="text" placeholder="Search workers..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-safety-card border border-safety-border rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-safety-muted focus:outline-none focus:border-safety-cyan/50 w-60" />
          </div>
          <select value={shiftFilter} onChange={(e) => setShiftFilter(e.target.value)} className="bg-safety-card border border-safety-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-safety-cyan/50">
            <option value="">All Shifts</option>
            <option value="day">Day</option>
            <option value="night">Night</option>
            <option value="general">General</option>
          </select>
          <Button onClick={() => setShowCreate(true)} variant="primary" size="sm"><Plus className="w-4 h-4" /> Add Worker</Button>
        </div>
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

      <DataTable columns={columns} data={workers} onRowClick={(w) => setSelectedWorker(w)} page={paginated?.pagination?.page || 1} total={paginated?.pagination?.total || workers.length} pageSize={20} />

      <Dialog open={showCreate} onClose={() => setShowCreate(false)} title="Add Worker">
        <div className="space-y-4">
          <Input label="Employee ID" value={form.employee_id} onChange={(e) => setForm({...form, employee_id: e.target.value})} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" value={form.first_name} onChange={(e) => setForm({...form, first_name: e.target.value})} />
            <Input label="Last Name" value={form.last_name} onChange={(e) => setForm({...form, last_name: e.target.value})} />
          </div>
          <Select label="Role" options={[
            { value: 'operator', label: 'Operator' },
            { value: 'engineer', label: 'Engineer' },
            { value: 'supervisor', label: 'Supervisor' },
            { value: 'technician', label: 'Technician' },
            { value: 'safety_officer', label: 'Safety Officer' },
            { value: 'contractor', label: 'Contractor' },
            { value: 'visitor', label: 'Visitor' },
          ]} value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} />
          <Input label="Department" value={form.department} onChange={(e) => setForm({...form, department: e.target.value})} />
          <Select label="Shift" options={[
            { value: 'day', label: 'Day' },
            { value: 'night', label: 'Night' },
            { value: 'general', label: 'General' },
          ]} value={form.shift} onChange={(e) => setForm({...form, shift: e.target.value})} />
          <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.employee_id || !form.first_name} className="w-full">
            {createMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : 'Add Worker'}
          </Button>
        </div>
      </Dialog>

      <Dialog open={!!selectedWorker} onClose={() => setSelectedWorker(null)} title={selectedWorker ? `${selectedWorker.first_name} ${selectedWorker.last_name || ''}` : ''}>
        {selectedWorker && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-safety-card">
                <p className="text-xs text-safety-muted">Employee ID</p>
                <p className="text-sm text-white">{selectedWorker.employee_id}</p>
              </div>
              <div className="p-3 rounded-lg bg-safety-card">
                <p className="text-xs text-safety-muted">Role</p>
                <p className="text-sm text-white capitalize">{selectedWorker.role}</p>
              </div>
              <div className="p-3 rounded-lg bg-safety-card">
                <p className="text-xs text-safety-muted">Shift</p>
                <p className="text-sm text-white capitalize">{selectedWorker.shift}</p>
              </div>
              <div className="p-3 rounded-lg bg-safety-card">
                <p className="text-xs text-safety-muted">Department</p>
                <p className="text-sm text-white">{selectedWorker.department || '--'}</p>
              </div>
              <div className="p-3 rounded-lg bg-safety-card">
                <p className="text-xs text-safety-muted">Current Zone</p>
                <p className="text-sm text-white">{selectedWorker.zone_name || `Zone ${selectedWorker.current_zone_id}` || '--'}</p>
              </div>
              <div className="p-3 rounded-lg bg-safety-card">
                <p className="text-xs text-safety-muted">Check-in</p>
                <p className="text-sm text-white">{selectedWorker.check_in_time ? formatDateTime(selectedWorker.check_in_time) : 'Not checked in'}</p>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium text-safety-muted uppercase mb-2">Safety Gear Status</h4>
              <div className="grid grid-cols-5 gap-2">
                {gearConfig.map((g) => {
                  const status = (selectedWorker as any)[`${g.key}_status`];
                  return (
                    <div key={g.key} className={`p-3 rounded-lg text-center ${status === 'ok' ? 'bg-safety-green/10' : 'bg-safety-red/10'}`}>
                      <g.Icon className={`w-5 h-5 mx-auto mb-1 ${status === 'ok' ? 'text-safety-green' : 'text-safety-red'}`} />
                      <p className={`text-xs capitalize ${status === 'ok' ? 'text-safety-green' : 'text-safety-red'}`}>{status}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2 pt-2 border-t border-safety-border">
              <Button onClick={() => { removeMutation.mutate(selectedWorker.id); }} variant="secondary" size="sm" className="flex-1">Remove Worker</Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
