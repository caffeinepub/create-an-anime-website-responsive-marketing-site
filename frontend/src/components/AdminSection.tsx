import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetAllRequests, useUpdateRequestStatus, useGrantAdminRole } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { ContactRequest, Topics } from '../backend';
import {
  Shield, LogIn, LogOut, Copy, Check, Download, RefreshCw,
  UserPlus, Loader2, AlertCircle, Mail, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

export function AdminSection() {
  const { login, clear, isLoggingIn, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const principal = identity?.getPrincipal().toString() ?? '';

  const { data: isAdmin, isLoading: adminCheckLoading } = useIsCallerAdmin();
  const { data: requests, isLoading: requestsLoading, error: requestsError, refetch } = useGetAllRequests();
  const updateStatus = useUpdateRequestStatus();
  const grantAdmin = useGrantAdminRole();

  const [copiedPrincipal, setCopiedPrincipal] = useState(false);
  const [newAdminPrincipal, setNewAdminPrincipal] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'processed'>('all');

  const handleLogin = async () => {
    try {
      await login();
    } catch (err: any) {
      if (err?.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleCopyPrincipal = async () => {
    await navigator.clipboard.writeText(principal);
    setCopiedPrincipal(true);
    setTimeout(() => setCopiedPrincipal(false), 2000);
  };

  const handleToggleStatus = async (req: ContactRequest) => {
    try {
      await updateStatus.mutateAsync({ requestId: req.id, processed: !req.processed });
      toast.success(`Request marked as ${!req.processed ? 'processed' : 'pending'}`);
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to update status');
    }
  };

  const handleGrantAdmin = async () => {
    if (!newAdminPrincipal.trim()) {
      toast.error('Please enter a principal ID');
      return;
    }
    try {
      await grantAdmin.mutateAsync(newAdminPrincipal.trim());
      toast.success('Admin role granted successfully');
      setNewAdminPrincipal('');
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to grant admin role');
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

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <section id="admin" className="py-20 bg-background">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
            <Shield className="w-8 h-8 text-accent" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground mb-3">Admin Access</h2>
          <p className="text-muted-foreground mb-8">
            Sign in with your Internet Identity to access the admin dashboard.
          </p>
          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="gap-2"
            size="lg"
          >
            {isLoggingIn ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
            ) : (
              <><LogIn className="w-4 h-4" /> Sign In</>
            )}
          </Button>
        </div>
      </section>
    );
  }

  // ── Checking admin status ──────────────────────────────────────────────────
  if (adminCheckLoading) {
    return (
      <section id="admin" className="py-20 bg-background">
        <div className="max-w-lg mx-auto px-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin access…</p>
        </div>
      </section>
    );
  }

  // ── Not admin ──────────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <section id="admin" className="py-20 bg-background">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-6">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground mb-3">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            Your principal does not have admin privileges.
          </p>
          <div className="bg-muted rounded-lg p-3 mb-6 flex items-center gap-2 text-sm font-mono break-all">
            <span className="flex-1 text-left text-muted-foreground">{principal}</span>
            <button
              onClick={handleCopyPrincipal}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            >
              {copiedPrincipal ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-6">
            Share your principal ID with an existing admin to request access.
          </p>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </section>
    );
  }

  // ── Admin dashboard ────────────────────────────────────────────────────────
  return (
    <section id="admin" className="py-20 bg-background">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent/10">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">Admin Dashboard</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{principal}</span>
                <button
                  onClick={handleCopyPrincipal}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedPrincipal ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 self-start sm:self-auto">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        {/* Grant Admin Role */}
        <div className="bg-muted/40 border border-border rounded-xl p-6 mb-8">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-accent" /> Grant Admin Role
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Enter a principal ID to grant admin access to another user.
          </p>
          <div className="flex gap-3">
            <Input
              value={newAdminPrincipal}
              onChange={e => setNewAdminPrincipal(e.target.value)}
              placeholder="xxxxx-xxxxx-xxxxx-xxxxx-xxx"
              className="font-mono text-sm flex-1"
              disabled={grantAdmin.isPending}
            />
            <Button
              onClick={handleGrantAdmin}
              disabled={grantAdmin.isPending || !newAdminPrincipal.trim()}
              className="gap-2 shrink-0"
            >
              {grantAdmin.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Granting…</>
              ) : (
                <><UserPlus className="w-4 h-4" /> Grant</>
              )}
            </Button>
          </div>
        </div>

        {/* Contact Requests */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
              <Mail className="w-5 h-5 text-accent" /> Contact Requests
              {requests && (
                <Badge variant="secondary" className="ml-1">{requests.length}</Badge>
              )}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {(['all', 'pending', 'processed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                    filterStatus === f
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {f}
                </button>
              ))}
              <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
                <Download className="w-3.5 h-3.5" /> Export CSV
              </Button>
            </div>
          </div>

          {requestsLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-accent mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Loading requests…</p>
            </div>
          )}

          {requestsError && (
            <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 rounded-xl p-4">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Failed to load requests</p>
                <p className="text-xs text-muted-foreground mt-1">{(requestsError as Error).message}</p>
              </div>
            </div>
          )}

          {!requestsLoading && !requestsError && filteredRequests.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No {filterStatus !== 'all' ? filterStatus : ''} requests found.</p>
            </div>
          )}

          {!requestsLoading && !requestsError && filteredRequests.length > 0 && (
            <div className="space-y-4">
              {filteredRequests.map(req => (
                <div
                  key={req.id}
                  className="bg-card border border-border rounded-xl p-5 hover:border-accent/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-muted-foreground">#{req.id}</span>
                      <Badge variant={req.processed ? 'secondary' : 'default'} className="text-xs">
                        {req.processed ? (
                          <><CheckCircle className="w-3 h-3 mr-1" />Processed</>
                        ) : (
                          <><Clock className="w-3 h-3 mr-1" />Pending</>
                        )}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{topicLabel(req.topic)}</Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(req)}
                      disabled={updateStatus.isPending}
                      className="gap-1.5 shrink-0 text-xs"
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
                    <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground">{req.email}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{req.message}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatDate(req.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
