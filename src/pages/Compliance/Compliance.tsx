import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { complianceService } from '../../services/compliance.service';
import { Card, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs } from '../../components/ui/tabs';
import { GaugeChart } from '../../components/charts/GaugeChart';
import { Shield, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';

export default function Compliance() {
  const { data: status } = useQuery({
    queryKey: ['compliance-status'],
    queryFn: () => complianceService.getStatus(),
    refetchInterval: 60000,
  });

  const { data: regulations = [] } = useQuery({
    queryKey: ['compliance-regulations'],
    queryFn: () => complianceService.getRegulations(),
    staleTime: 300000,
  });

  const { data: checklist } = useQuery({
    queryKey: ['compliance-checklist'],
    queryFn: () => complianceService.getChecklist(),
    staleTime: 120000,
  });

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardTitle>Overall Compliance Score</CardTitle>
            <div className="flex justify-center py-4">
              <GaugeChart value={status?.overallScore || 0} label="Compliance" size={200} />
            </div>
            <p className="text-center text-sm text-safety-muted mt-2">
              {status?.overallScore >= 80 ? 'Good compliance status' : status?.overallScore >= 60 ? 'Needs improvement' : 'Critical compliance issues'}
            </p>
          </Card>
          <div className="space-y-4">
            {status?.categories?.map((cat: any, i: number) => (
              <Card key={i}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-safety-cyan" />
                    <span className="text-sm text-white">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold" style={{ color: cat.score >= 80 ? '#00c853' : cat.score >= 60 ? '#ff9500' : '#ff3b3b' }}>{cat.score}%</span>
                  </div>
                </div>
                <div className="mt-3 w-full h-1.5 bg-safety-card rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${cat.score}%`, backgroundColor: cat.score >= 80 ? '#00c853' : cat.score >= 60 ? '#ff9500' : '#ff3b3b' }} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'checklist',
      label: 'Checklist',
      content: (
        <div className="space-y-4">
          {checklist?.length > 0 ? checklist.map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-safety-card">
              <div className="flex items-center gap-3">
                {item.status === 'pass' ? <CheckCircle className="w-4 h-4 text-safety-green" /> :
                 item.status === 'fail' ? <XCircle className="w-4 h-4 text-safety-red" /> :
                 <AlertTriangle className="w-4 h-4 text-safety-amber" />}
                <div>
                  <p className="text-sm text-safety-text">{item.item}</p>
                  {item.lastChecked && <p className="text-xs text-safety-muted">Last checked: {item.lastChecked}</p>}
                </div>
              </div>
              {item.nextDue && <span className="text-xs text-safety-muted">Due: {item.nextDue}</span>}
            </div>
          )) : (
            <p className="text-sm text-safety-muted text-center py-6">No checklist items available</p>
          )}
        </div>
      ),
    },
    {
      id: 'regulations',
      label: 'Regulations',
      content: (
        <div className="space-y-3">
          {regulations.length > 0 ? regulations.map((reg: any, i: number) => (
            <Card key={i}>
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-safety-cyan mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">{reg.title}</p>
                  <p className="text-xs text-safety-muted mt-0.5">{reg.source} — {reg.doc_type}</p>
                </div>
              </div>
            </Card>
          )) : (
            <p className="text-sm text-safety-muted text-center py-6">No regulations loaded</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Compliance</h1>
          <p className="text-safety-muted text-sm mt-1">Regulatory compliance monitoring and reporting</p>
        </div>
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
}
