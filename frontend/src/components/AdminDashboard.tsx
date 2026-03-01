import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { AdminSidebar } from './AdminSidebar';
import { AdminEpisodesPanel } from './AdminEpisodesPanel';
import { AdminCharactersPanel } from './AdminCharactersPanel';
import { AdminContentPanel } from './AdminContentPanel';
import { AdminContactRequestsPanel } from './AdminContactRequestsPanel';
import { AdminRolePanel } from './AdminRolePanel';
import {
  Shield, LogIn, LogOut, Copy, Check, Loader2, XCircle, Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export type AdminSection = 'episodes' | 'characters' | 'content' | 'contacts' | 'roles';

export function AdminDashboard() {
  const { login, clear, isLoggingIn, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const principal = identity?.getPrincipal().toString() ?? '';

  const { data: isAdmin, isLoading: adminCheckLoading } = useIsCallerAdmin();

  const [activeSection, setActiveSection] = useState<AdminSection>('episodes');
  const [copiedPrincipal, setCopiedPrincipal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="admin-dashboard min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 text-center">
          <div className="admin-card rounded-2xl p-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full admin-icon-bg mb-6">
              <Shield className="w-10 h-10 admin-accent-text" />
            </div>
            <h1 className="text-3xl font-bold admin-heading mb-3">Admin Dashboard</h1>
            <p className="admin-muted-text mb-2 text-sm">Whispers of the White Moon</p>
            <p className="admin-muted-text mb-8">
              Sign in with your Internet Identity to access the admin control panel.
            </p>
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="admin-btn-primary gap-2 w-full"
              size="lg"
            >
              {isLoggingIn ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
              ) : (
                <><LogIn className="w-4 h-4" /> Sign In with Internet Identity</>
              )}
            </Button>
            <div className="mt-6">
              <a href="/" className="text-sm admin-muted-text hover:admin-accent-text transition-colors">
                ← Back to Website
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Checking admin status ──────────────────────────────────────────────────
  if (adminCheckLoading) {
    return (
      <div className="admin-dashboard min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin admin-accent-text mx-auto mb-4" />
          <p className="admin-muted-text">Verifying admin access…</p>
        </div>
      </div>
    );
  }

  // ── Not admin ──────────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="admin-dashboard min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 text-center">
          <div className="admin-card rounded-2xl p-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold admin-heading mb-3">Access Denied</h1>
            <p className="admin-muted-text mb-4">
              Your account does not have admin privileges.
            </p>
            <div className="admin-surface rounded-lg p-3 mb-6 flex items-center gap-2 text-sm font-mono break-all">
              <span className="flex-1 text-left admin-muted-text text-xs">{principal}</span>
              <button
                onClick={handleCopyPrincipal}
                className="shrink-0 admin-muted-text hover:admin-accent-text transition-colors"
              >
                {copiedPrincipal ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs admin-muted-text mb-6">
              Share your principal ID with an existing admin to request access.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={handleLogout} className="admin-btn-outline gap-2">
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
              <a href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm admin-muted-text hover:admin-accent-text transition-colors">
                ← Back to Website
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Admin dashboard ────────────────────────────────────────────────────────
  const renderPanel = () => {
    switch (activeSection) {
      case 'episodes': return <AdminEpisodesPanel />;
      case 'characters': return <AdminCharactersPanel />;
      case 'content': return <AdminContentPanel />;
      case 'contacts': return <AdminContactRequestsPanel />;
      case 'roles': return <AdminRolePanel />;
      default: return <AdminEpisodesPanel />;
    }
  };

  return (
    <div className="admin-dashboard min-h-screen flex flex-col">
      {/* Top Header Bar */}
      <header className="admin-topbar flex items-center justify-between px-4 md:px-6 h-16 shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle */}
          <button
            className="md:hidden admin-muted-text hover:admin-accent-text transition-colors p-1"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 admin-accent-text" />
            <span className="font-bold admin-heading text-sm md:text-base">WOTWM Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 admin-surface rounded-lg px-3 py-1.5">
            <span className="text-xs font-mono admin-muted-text truncate max-w-[140px]">{principal}</span>
            <button
              onClick={handleCopyPrincipal}
              className="admin-muted-text hover:admin-accent-text transition-colors"
            >
              {copiedPrincipal ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <a href="/" className="text-xs admin-muted-text hover:admin-accent-text transition-colors hidden sm:block">
            ← Site
          </a>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="admin-btn-ghost gap-1.5 text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={(section) => {
            setActiveSection(section);
            setMobileSidebarOpen(false);
          }}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto admin-main-bg">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {renderPanel()}
          </div>
        </main>
      </div>
    </div>
  );
}
