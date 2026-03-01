import React, { useState } from 'react';
import { useGetAllRequests, useUpdateRequestStatus } from '../hooks/useQueries';
import { ContactRequest, Topics } from '../backend';
import {
  Mail, RefreshCw, Download, Loader2, AlertCircle,
  Clock, CheckCircle, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const TOPIC_LABELS: Record<string, string> = {
  businessPartnerships: 'Business Partnerships',
  advertisingInquiries: 'Advertising Inquiries',
  interviewRequests: 'Interview Requests',
  eventOrWorkshopProposals: 'Event / Workshop Proposals',
  publishingSubmissions: 'Publishing Submissions',
  challengesAndBounties: 'Challenges & Bounties',
  generalInquiries: 'General Inquiries',
};

function topicLabel(topic: Topics): string {
  return TOPIC_LABELS[topic as string] ?? String(topic);
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / 1_000_000n);
  return new Date(ms).toLocaleString();
}

export function AdminContactRequestsPanel() {
  const { data: requests, isLoading, error, refetch } = useGetAllRequests();
  const updateStatus = useUpdateRequestStatus();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'processed'>('all');

  const handleToggleStatus = async (req: ContactRequest) => {
    try {
      await updateStatus.mutateAsync({ requestId: req.id, processed: !req.processed });
      toast.success(`Request marked as ${!req.processed ? 'processed' : 'pending'}`);
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to update status');
    }
  };

  const handleExport = () => {
    if (!requests || requests.length === 0) {
      toast.error('No requests to export');
      return;
    }
    const headers = ['ID', 'Email', 'Topic', 'Message', 'Timestamp', 'Status'];
    const rows = requests.map(r => [
      r.id,
      r.email,
      topicLabel(r.topic),
      `"${r.message.replace(/"/g, '""')}"`,
      formatDate(r.timestamp),
      r.processed ? 'Processed' : 'Pending',
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact-requests-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  };

  const filteredRequests = (requests ?? []).filter(r => {
    if (filterStatus === 'pending') return !r.processed;
    if (filterStatus === 'processed') return r.processed;
    return true;
  });

  return (
    <div>
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="admin-icon-bg rounded-lg p-2">
            <Mail className="w-5 h-5 admin-accent-text" />
          </div>
          <div>
            <h2 className="text-xl font-bold admin-heading">Contact Requests</h2>
            <p className="text-sm admin-muted-text">
              {requests ? `${requests.length} total request${requests.length !== 1 ? 's' : ''}` : 'Loading…'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="admin-btn-ghost gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            className="admin-btn-ghost gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-5">
        {(['all', 'pending', 'processed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
              filterStatus === f
                ? 'admin-filter-active'
                : 'admin-filter-inactive'
            }`}
          >
            {f}
            {f === 'all' && requests && (
              <span className="ml-1.5 opacity-60">({requests.length})</span>
            )}
            {f === 'pending' && requests && (
              <span className="ml-1.5 opacity-60">({requests.filter(r => !r.processed).length})</span>
            )}
            {f === 'processed' && requests && (
              <span className="ml-1.5 opacity-60">({requests.filter(r => r.processed).length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin admin-accent-text mx-auto mb-3" />
          <p className="admin-muted-text text-sm">Loading requests…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-400">Failed to load requests</p>
            <p className="text-xs admin-muted-text mt-1">{(error as Error).message}</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && filteredRequests.length === 0 && (
        <div className="text-center py-16 admin-card rounded-xl">
          <Mail className="w-12 h-12 mx-auto mb-4 admin-muted-text opacity-40" />
          <p className="admin-heading font-semibold mb-2">No {filterStatus !== 'all' ? filterStatus : ''} requests</p>
          <p className="admin-muted-text text-sm">Contact requests will appear here.</p>
        </div>
      )}

      {/* Requests List */}
      {!isLoading && !error && filteredRequests.length > 0 && (
        <div className="space-y-3">
          {filteredRequests.map(req => (
            <div
              key={req.id}
              className={`admin-card rounded-xl p-5 border-l-4 transition-colors ${
                req.processed ? 'border-l-teal-500/40' : 'border-l-amber-500/60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono admin-muted-text">#{req.id}</span>
                  <Badge className={`text-xs ${req.processed ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                    {req.processed ? (
                      <><CheckCircle className="w-3 h-3 mr-1" />Processed</>
                    ) : (
                      <><Clock className="w-3 h-3 mr-1" />Pending</>
                    )}
                  </Badge>
                  <Badge className="admin-badge-outline text-xs">{topicLabel(req.topic)}</Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStatus(req)}
                  disabled={updateStatus.isPending}
                  className="admin-btn-outline gap-1.5 shrink-0 text-xs"
                >
                  {updateStatus.isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : req.processed ? (
                    <><XCircle className="w-3 h-3" /> Mark Pending</>
                  ) : (
                    <><CheckCircle className="w-3 h-3" /> Mark Processed</>
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-3.5 h-3.5 admin-muted-text shrink-0" />
                <span className="text-sm admin-heading">{req.email}</span>
              </div>
              <p className="text-sm admin-muted-text leading-relaxed mb-3">{req.message}</p>
              <div className="flex items-center gap-1.5 text-xs admin-muted-text">
                <Clock className="w-3 h-3" />
                {formatDate(req.timestamp)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
