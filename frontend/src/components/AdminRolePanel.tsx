import React, { useState } from 'react';
import { useGrantAdminRole } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { ShieldCheck, UserPlus, Loader2, Copy, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function AdminRolePanel() {
  const { identity } = useInternetIdentity();
  const grantAdmin = useGrantAdminRole();
  const [newAdminPrincipal, setNewAdminPrincipal] = useState('');
  const [copiedPrincipal, setCopiedPrincipal] = useState(false);

  const principal = identity?.getPrincipal().toString() ?? '';

  const handleCopyPrincipal = async () => {
    await navigator.clipboard.writeText(principal);
    setCopiedPrincipal(true);
    setTimeout(() => setCopiedPrincipal(false), 2000);
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

  return (
    <div>
      {/* Panel Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="admin-icon-bg rounded-lg p-2">
          <ShieldCheck className="w-5 h-5 admin-accent-text" />
        </div>
        <div>
          <h2 className="text-xl font-bold admin-heading">Role Management</h2>
          <p className="text-sm admin-muted-text">Grant admin access to other users</p>
        </div>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Your Principal */}
        <div className="admin-card rounded-xl p-6">
          <h3 className="text-sm font-semibold admin-heading mb-1 flex items-center gap-2">
            <Info className="w-4 h-4 admin-accent-text" /> Your Principal ID
          </h3>
          <p className="text-xs admin-muted-text mb-3">
            Share this with other admins if you need to be granted additional roles.
          </p>
          <div className="admin-surface rounded-lg p-3 flex items-center gap-2">
            <span className="flex-1 text-xs font-mono admin-muted-text break-all">{principal}</span>
            <button
              onClick={handleCopyPrincipal}
              className="shrink-0 admin-muted-text hover:admin-accent-text transition-colors"
            >
              {copiedPrincipal ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Grant Admin Role */}
        <div className="admin-card rounded-xl p-6">
          <h3 className="text-sm font-semibold admin-heading mb-1 flex items-center gap-2">
            <UserPlus className="w-4 h-4 admin-accent-text" /> Grant Admin Role
          </h3>
          <p className="text-xs admin-muted-text mb-4">
            Enter a principal ID to grant admin access to another user. They will be able to manage all content.
          </p>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="admin-label">Principal ID</Label>
              <Input
                value={newAdminPrincipal}
                onChange={e => setNewAdminPrincipal(e.target.value)}
                placeholder="xxxxx-xxxxx-xxxxx-xxxxx-xxx"
                className="admin-input font-mono text-sm"
                disabled={grantAdmin.isPending}
              />
            </div>
            <Button
              onClick={handleGrantAdmin}
              disabled={grantAdmin.isPending || !newAdminPrincipal.trim()}
              className="admin-btn-primary gap-2 w-full sm:w-auto"
            >
              {grantAdmin.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Granting…</>
              ) : (
                <><UserPlus className="w-4 h-4" /> Grant Admin Role</>
              )}
            </Button>
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-400">Admin Access Warning</p>
            <p className="text-xs admin-muted-text mt-1">
              Admin users have full access to create, edit, and delete all content including episodes, characters, and site content. Only grant access to trusted individuals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
