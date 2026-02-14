import { useState } from 'react';
import { SectionHeader } from './SectionHeader';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllRequests, useUpdateRequestStatus, useIsCallerAdmin, useGrantAdminRole } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Loader2, Download, LogIn, LogOut, Shield, CheckCircle, Circle, RefreshCw, Copy, UserPlus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Topics } from '../backend';
import { toast } from 'sonner';
import { Separator } from './ui/separator';

export function AdminSection() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const { data: requests, isLoading, error, refetch, isFetching } = useGetAllRequests(isAuthenticated);
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin(isAuthenticated);
  const updateStatusMutation = useUpdateRequestStatus();
  const grantAdminMutation = useGrantAdminRole();

  const [principalToPromote, setPrincipalToPromote] = useState('');

  const currentPrincipal = identity?.getPrincipal().toString() || '';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        toast.error('Login failed', {
          description: error.message || 'Please try again.'
        });
      }
    }
  };

  const handleCopyPrincipal = () => {
    if (currentPrincipal) {
      navigator.clipboard.writeText(currentPrincipal);
      toast.success('Principal copied to clipboard');
    }
  };

  const handleGrantAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!principalToPromote.trim()) {
      toast.error('Please enter a principal');
      return;
    }

    try {
      await grantAdminMutation.mutateAsync(principalToPromote);
      toast.success('Admin access granted successfully', {
        description: 'The user can now access admin features.'
      });
      setPrincipalToPromote('');
    } catch (error: any) {
      toast.error('Failed to grant admin access', {
        description: error.message || 'Please check the principal and try again.'
      });
    }
  };

  const handleExport = () => {
    if (!requests || requests.length === 0) {
      toast.info('No data to export');
      return;
    }

    const dataStr = JSON.stringify(requests, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contact-requests-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Export successful', {
      description: 'Contact requests downloaded as JSON file.'
    });
  };

  const handleToggleStatus = async (requestId: string, currentStatus: boolean) => {
    try {
      await updateStatusMutation.mutateAsync({
        requestId,
        processed: !currentStatus
      });
      toast.success('Status updated successfully');
    } catch (error: any) {
      toast.error('Failed to update status', {
        description: error.message || 'Please try again.'
      });
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTopic = (topic: Topics) => {
    const topicMap: Record<Topics, string> = {
      [Topics.generalInquiries]: 'General',
      [Topics.businessPartnerships]: 'Business',
      [Topics.advertisingInquiries]: 'Advertising',
      [Topics.interviewRequests]: 'Interview',
      [Topics.eventOrWorkshopProposals]: 'Event/Workshop',
      [Topics.publishingSubmissions]: 'Publishing',
      [Topics.challengesAndBounties]: 'Challenges'
    };
    return topicMap[topic] || topic;
  };

  return (
    <section id="admin" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Shield className="text-accent" size={32} />
          <SectionHeader title="Admin Dashboard" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-card border-2 border-accent/30 rounded-lg p-6 shadow-lg">
            {/* Auth Section */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium text-muted-foreground">
                  {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
                </span>
              </div>
              <Button
                onClick={handleAuth}
                disabled={isLoggingIn}
                variant={isAuthenticated ? 'outline' : 'default'}
                className="gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Logging in...
                  </>
                ) : isAuthenticated ? (
                  <>
                    <LogOut size={16} />
                    Logout
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Login with Internet Identity
                  </>
                )}
              </Button>
            </div>

            {/* Content */}
            {!isAuthenticated ? (
              <div className="text-center py-12">
                <Shield className="mx-auto mb-4 text-muted-foreground" size={48} />
                <h3 className="text-xl font-bold text-foreground mb-2">Authentication Required</h3>
                <p className="text-muted-foreground mb-6">
                  Please log in with Internet Identity to access the admin dashboard.
                </p>
              </div>
            ) : (
              <>
                {/* Principal Display Section - Always visible when authenticated */}
                <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                  <Label className="text-sm font-semibold text-foreground mb-2 block">
                    Your Internet Identity Principal
                  </Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    This is your unique identifier on the Internet Computer. Share this with an admin to receive access.
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={currentPrincipal}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      onClick={handleCopyPrincipal}
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                </div>

                {isAdminLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="mx-auto mb-4 animate-spin text-accent" size={48} />
                    <p className="text-muted-foreground">Checking permissions...</p>
                  </div>
                ) : error || !isAdmin ? (
                  <div className="text-center py-12">
                    <Shield className="mx-auto mb-4 text-destructive" size={48} />
                    <h3 className="text-xl font-bold text-foreground mb-2">Access Denied</h3>
                    <p className="text-muted-foreground mb-6">
                      You do not have permission to view contact requests.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Only authorized administrators can access this section.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Admin-only: Grant Admin Access Section */}
                    <div className="mb-6 p-4 bg-accent/5 rounded-lg border-2 border-accent/30">
                      <div className="flex items-center gap-2 mb-3">
                        <UserPlus className="text-accent" size={20} />
                        <h3 className="text-lg font-bold text-foreground">Grant Admin Access</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        <strong>Important:</strong> Admin permissions are granted by Internet Identity principal, not by email address. 
                        Ask the user to log in and share their principal (shown above when logged in).
                      </p>
                      <form onSubmit={handleGrantAdmin} className="space-y-3">
                        <div>
                          <Label htmlFor="principal-input" className="text-sm font-medium">
                            User's Internet Identity Principal
                          </Label>
                          <Input
                            id="principal-input"
                            type="text"
                            placeholder="e.g., 2vxsx-fae..."
                            value={principalToPromote}
                            onChange={(e) => setPrincipalToPromote(e.target.value)}
                            disabled={grantAdminMutation.isPending}
                            className="font-mono text-sm mt-1"
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={grantAdminMutation.isPending || !principalToPromote.trim()}
                          className="gap-2"
                        >
                          {grantAdminMutation.isPending ? (
                            <>
                              <Loader2 className="animate-spin" size={16} />
                              Granting access...
                            </>
                          ) : (
                            <>
                              <UserPlus size={16} />
                              Grant Admin Access
                            </>
                          )}
                        </Button>
                      </form>
                    </div>

                    <Separator className="my-6" />

                    {/* Contact Requests Section */}
                    {isLoading ? (
                      <div className="text-center py-12">
                        <Loader2 className="mx-auto mb-4 animate-spin text-accent" size={48} />
                        <p className="text-muted-foreground">Loading contact requests...</p>
                      </div>
                    ) : (
                      <>
                        {/* Actions Bar */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-foreground">
                              Contact Requests
                            </h3>
                            <Badge variant="secondary">
                              {requests?.length || 0} total
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => refetch()}
                              disabled={isFetching}
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <RefreshCw className={isFetching ? 'animate-spin' : ''} size={16} />
                              Refresh
                            </Button>
                            <Button
                              onClick={handleExport}
                              disabled={!requests || requests.length === 0}
                              variant="default"
                              size="sm"
                              className="gap-2"
                            >
                              <Download size={16} />
                              Export JSON
                            </Button>
                          </div>
                        </div>

                        {/* Table */}
                        {!requests || requests.length === 0 ? (
                          <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                            <p className="text-muted-foreground">No contact requests yet.</p>
                          </div>
                        ) : (
                          <div className="border-2 border-border rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[100px]">Status</TableHead>
                                    <TableHead className="w-[180px]">Date</TableHead>
                                    <TableHead className="w-[120px]">Topic</TableHead>
                                    <TableHead className="w-[200px]">Email</TableHead>
                                    <TableHead>Message</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {requests.map((request) => (
                                    <TableRow key={request.id}>
                                      <TableCell>
                                        <Button
                                          onClick={() => handleToggleStatus(request.id, request.processed)}
                                          disabled={updateStatusMutation.isPending}
                                          variant="ghost"
                                          size="sm"
                                          className="gap-2"
                                        >
                                          {request.processed ? (
                                            <>
                                              <CheckCircle className="text-green-500" size={16} />
                                              Done
                                            </>
                                          ) : (
                                            <>
                                              <Circle className="text-gray-400" size={16} />
                                              New
                                            </>
                                          )}
                                        </Button>
                                      </TableCell>
                                      <TableCell className="text-sm text-muted-foreground">
                                        {formatDate(request.timestamp)}
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant="outline" className="text-xs">
                                          {formatTopic(request.topic)}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-sm font-mono">
                                        {request.email}
                                      </TableCell>
                                      <TableCell className="text-sm max-w-md truncate">
                                        {request.message}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
