import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { reportsService } from '../../services/reports.service';
import { Card, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { DataTable } from '../../components/data-display/DataTable';
import { Dialog } from '../../components/ui/dialog';
import { Select } from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { formatDateTime } from '../../lib/date-format';
import { exportToPDF } from '../../lib/pdf-export';
import { FileText, Download, Plus, FileDown, Loader2 } from 'lucide-react';

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [genForm, setGenForm] = useState({ report_type: 'safety', zone_id: '', date_from: '', date_to: '' });
  const [generating, setGenerating] = useState(false);

  const { data: paginated } = useQuery({
    queryKey: ['reports'],
    queryFn: () => reportsService.getAll({ page: 1, limit: 50 }),
    refetchInterval: 30000,
  });

  const reports = paginated?.data || [];

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await reportsService.generate({
        report_type: genForm.report_type,
        zone_id: genForm.zone_id ? Number(genForm.zone_id) : undefined,
        date_from: genForm.date_from || undefined,
        date_to: genForm.date_to || undefined,
      });
      setSelectedReport(result);
      setShowGenerator(false);
    } catch (err) {
      console.error('Failed to generate report', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleExportPDF = async () => {
    if (selectedReport) {
      await exportToPDF('report-content', `${selectedReport.title || 'report'}.pdf`);
    }
  };

  const columns = [
    { key: 'title', label: 'Title', sortable: true, render: (r: any) => <span className="text-safety-cyan font-medium">{r.title}</span> },
    { key: 'report_type', label: 'Type', sortable: true, render: (r: any) => <Badge variant="info" size="sm">{r.report_type.replace(/_/g, ' ')}</Badge> },
    { key: 'status', label: 'Status', sortable: true, render: (r: any) => <Badge variant={r.status === 'final' ? 'success' : 'warning'} size="sm">{r.status}</Badge> },
    { key: 'created_at', label: 'Generated', render: (r: any) => <span className="text-xs text-safety-muted">{r.created_at ? formatDateTime(r.created_at) : '--'}</span> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-safety-muted text-sm mt-1">Generate, view, and export safety reports</p>
        </div>
        <Button onClick={() => setShowGenerator(true)} variant="primary" size="sm"><Plus className="w-4 h-4" /> Generate Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <FileText className="w-5 h-5 text-safety-cyan mb-2" />
          <p className="text-2xl font-bold text-white">{reports.length}</p>
          <p className="text-xs text-safety-muted">Total Reports</p>
        </Card>
        <Card>
          <FileDown className="w-5 h-5 text-safety-green mb-2" />
          <p className="text-2xl font-bold text-white">{reports.filter((r: any) => r.status === 'final').length}</p>
          <p className="text-xs text-safety-muted">Finalized</p>
        </Card>
        <Card>
          <FileText className="w-5 h-5 text-safety-amber mb-2" />
          <p className="text-2xl font-bold text-white">{reports.filter((r: any) => r.status === 'draft').length}</p>
          <p className="text-xs text-safety-muted">Drafts</p>
        </Card>
      </div>

      <DataTable columns={columns} data={reports} onRowClick={(r) => setSelectedReport(r)} page={paginated?.pagination?.page || 1} total={paginated?.pagination?.total || reports.length} pageSize={20} />

      <Dialog open={showGenerator} onClose={() => setShowGenerator(false)} title="Generate Report">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-safety-muted mb-1.5">Report Type</label>
            <Select options={[
              { value: 'incident', label: 'Incident Report' },
              { value: 'safety', label: 'Safety Report' },
              { value: 'compliance', label: 'Compliance Report' },
              { value: 'risk_trend', label: 'Risk Trend Report' },
              { value: 'daily_summary', label: 'Daily Summary' },
            ]} value={genForm.report_type} onChange={(e) => setGenForm({...genForm, report_type: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm text-safety-muted mb-1.5">Zone (optional)</label>
            <Select options={[
              { value: '', label: 'All Zones' },
              { value: '1', label: 'Boiler House' },
              { value: '2', label: 'Chemical Storage' },
              { value: '3', label: 'Tank Farm' },
              { value: '4', label: 'Control Room' },
              { value: '5', label: 'Main Pipeline' },
              { value: '6', label: 'Chemical Processing' },
              { value: '7', label: 'Loading Bay' },
              { value: '8', label: 'Maintenance Workshop' },
            ]} value={genForm.zone_id} onChange={(e) => setGenForm({...genForm, zone_id: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="From Date" type="date" value={genForm.date_from} onChange={(e) => setGenForm({...genForm, date_from: e.target.value})} />
            <Input label="To Date" type="date" value={genForm.date_to} onChange={(e) => setGenForm({...genForm, date_to: e.target.value})} />
          </div>
          <Button onClick={handleGenerate} disabled={generating} className="w-full">
            {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : 'Generate'}
          </Button>
        </div>
      </Dialog>

      <Dialog open={!!selectedReport} onClose={() => setSelectedReport(null)} title={selectedReport?.title || 'Report'} className="max-w-3xl">
        {selectedReport && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge variant={selectedReport.report_type === 'compliance' ? 'success' : 'info'}>{selectedReport.report_type}</Badge>
                <Badge variant={selectedReport.status === 'final' ? 'success' : 'warning'}>{selectedReport.status}</Badge>
              </div>
              <Button onClick={handleExportPDF} variant="secondary" size="sm"><Download className="w-4 h-4" /> Export PDF</Button>
            </div>
            <div id="report-content" className="prose prose-invert max-w-none">
              {selectedReport.content ? (
                <div className="p-4 rounded-lg bg-safety-card text-sm text-safety-text whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: selectedReport.content }} />
              ) : (
                <div className="p-4 rounded-lg bg-safety-card text-sm text-safety-muted">Report content will appear here after generation.</div>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
