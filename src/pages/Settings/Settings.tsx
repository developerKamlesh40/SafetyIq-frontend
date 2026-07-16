import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../../services/settings.service';
import { Card, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tabs } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Dialog } from '../../components/ui/dialog';
import { toast } from '../../components/ui/toast';
import { Select } from '../../components/ui/select';
import { Save, Brain, Bell, AlertTriangle, Users, Sliders, Loader2 } from 'lucide-react';

export default function Settings() {
  const queryClient = useQueryClient();
  const [aiConfig, setAiConfig] = useState({ model: 'gemini-2.5-flash', temperature: '0.3', maxTokens: '4096' });
  const [thresholds, setThresholds] = useState<any>({});
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [userForm, setUserForm] = useState({ full_name: '', username: '', password: '', role: 'operator' });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getAll(),
    refetchInterval: 60000,
  });

  useEffect(() => {
    if (settings?.ai) setAiConfig({ model: settings.ai.model || 'gemini-2.5-flash', temperature: settings.ai.temperature || '0.3', maxTokens: settings.ai.maxTokens || '4096' });
    if (settings?.alerts) setThresholds(settings.alerts);
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data: { category: string; values: any }) => settingsService.update(data.category, data.values),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['settings'] }); toast({ type: 'success', title: 'Settings saved' }); },
    onError: () => toast({ type: 'error', title: 'Failed to save settings' }),
  });

  const createUserMutation = useMutation({
    mutationFn: () => settingsService.createUser(userForm),
    onSuccess: () => {
      toast({ type: 'success', title: 'User created' });
      setShowUserDialog(false);
      setUserForm({ full_name: '', username: '', password: '', role: 'operator' });
    },
    onError: () => toast({ type: 'error', title: 'Failed to create user' }),
  });

  const tabs = [
    {
      id: 'ai',
      label: 'AI Configuration',
      content: (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-safety-cyan" />
            <CardTitle>AI Model Settings</CardTitle>
          </div>
          <div className="space-y-4 max-w-md">
            <Input label="Model" value={aiConfig.model} onChange={(e) => setAiConfig({...aiConfig, model: e.target.value})} />
            <Input label="Temperature" type="number" step="0.1" min="0" max="1" value={aiConfig.temperature} onChange={(e) => setAiConfig({...aiConfig, temperature: e.target.value})} />
            <Input label="Max Tokens" type="number" value={aiConfig.maxTokens} onChange={(e) => setAiConfig({...aiConfig, maxTokens: e.target.value})} />
            <Button onClick={() => saveMutation.mutate({ category: 'ai', values: aiConfig })}><Save className="w-4 h-4" /> Save</Button>
          </div>
        </Card>
      ),
    },
    {
      id: 'alerts',
      label: 'Alert Thresholds',
      content: (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-safety-amber" />
            <CardTitle>Alert Thresholds</CardTitle>
          </div>
          <div className="space-y-4 max-w-md">
            {Object.entries(thresholds).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-safety-text capitalize">{key.replace(/_/g, ' ')}</span>
                <input type="number" value={value as any} onChange={(e) => setThresholds({...thresholds, [key]: Number(e.target.value)})} className="w-24 bg-safety-card border border-safety-border rounded-lg px-3 py-1.5 text-sm text-white text-right focus:outline-none focus:border-safety-cyan/50" />
              </div>
            ))}
            <Button onClick={() => saveMutation.mutate({ category: 'alerts', values: thresholds })}><Save className="w-4 h-4" /> Save Thresholds</Button>
          </div>
        </Card>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      content: (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-safety-cyan" />
            <CardTitle>Notification Settings</CardTitle>
          </div>
          <div className="space-y-3 max-w-md">
            {[
              { key: 'email_enabled', label: 'Email Notifications' },
              { key: 'sms_enabled', label: 'SMS Notifications' },
              { key: 'push_enabled', label: 'Push Notifications' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-safety-card">
                <span className="text-sm text-safety-text">{item.label}</span>
                <div className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${thresholds[item.key] ? 'bg-safety-cyan' : 'bg-safety-border'}`}
                  onClick={() => setThresholds({...thresholds, [item.key]: thresholds[item.key] ? 0 : 1})}>
                  <div className={`w-4 h-4 rounded-full bg-white mt-0.5 transition-transform ${thresholds[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      ),
    },
    {
      id: 'users',
      label: 'User Management',
      content: (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-safety-cyan" />
              <CardTitle>System Users</CardTitle>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setShowUserDialog(true)}>Add User</Button>
          </div>
          <div className="space-y-2">
            {[
              { username: 'admin', role: 'admin', full_name: 'Admin User' },
              { username: 'safety_officer', role: 'safety_officer', full_name: 'Safety Officer' },
              { username: 'plant_manager', role: 'plant_manager', full_name: 'Plant Manager' },
              { username: 'operator1', role: 'operator', full_name: 'Operator 1' },
            ].map((user, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-safety-card/50">
                <div>
                  <p className="text-sm text-white">{user.full_name}</p>
                  <p className="text-xs text-safety-muted">@{user.username}</p>
                </div>
                <Badge variant={user.role === 'admin' ? 'critical' : 'info'} size="sm">{user.role}</Badge>
              </div>
            ))}
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-safety-muted text-sm mt-1">Application configuration and management</p>
        </div>
      </div>
      <Tabs tabs={tabs} />

      <Dialog open={showUserDialog} onClose={() => setShowUserDialog(false)} title="Add User">
        <div className="space-y-4">
          <Input label="Full Name" value={userForm.full_name} onChange={(e) => setUserForm({...userForm, full_name: e.target.value})} />
          <Input label="Username" value={userForm.username} onChange={(e) => setUserForm({...userForm, username: e.target.value})} />
          <Input label="Password" type="password" value={userForm.password} onChange={(e) => setUserForm({...userForm, password: e.target.value})} />
          <Select label="Role" options={[
            { value: 'operator', label: 'Operator' },
            { value: 'safety_officer', label: 'Safety Officer' },
            { value: 'plant_manager', label: 'Plant Manager' },
            { value: 'engineer', label: 'Engineer' },
            { value: 'admin', label: 'Admin' },
          ]} value={userForm.role} onChange={(e) => setUserForm({...userForm, role: e.target.value})} />
          <Button onClick={() => createUserMutation.mutate()} disabled={createUserMutation.isPending || !userForm.full_name || !userForm.username || !userForm.password} className="w-full">
            {createUserMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Add User'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
