import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Loader2,
  Mail,
  RefreshCw,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import type { ContactRequest, Topics } from "../backend";
import {
  useDeleteContactRequest,
  useGetAllRequests,
  useUpdateRequestStatus,
} from "../hooks/useQueries";

const TOPIC_LABELS: Record<string, string> = {
  businessPartnerships: "Business Partnerships",
  advertisingInquiries: "Advertising Inquiries",
  interviewRequests: "Interview Requests",
  eventOrWorkshopProposals: "Event / Workshop Proposals",
  publishingSubmissions: "Publishing Submissions",
  challengesAndBounties: "Challenges & Bounties",
  generalInquiries: "General Inquiries",
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
  const deleteRequest = useDeleteContactRequest();
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "processed"
  >("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleToggleStatus = async (req: ContactRequest) => {
    try {
      await updateStatus.mutateAsync({
        requestId: req.id,
        processed: !req.processed,
      });
      toast.success(
        `Request marked as ${!req.processed ? "processed" : "pending"}`,
      );
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update status");
    }
  };

  const handleDelete = async (requestId: string) => {
    setDeletingId(requestId);
    try {
      await deleteRequest.mutateAsync(requestId);
      toast.success("Contact request deleted successfully");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete contact request");
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = () => {
    if (!requests || requests.length === 0) {
      toast.error("No requests to export");
      return;
    }
    const headers = ["ID", "Email", "Topic", "Message", "Timestamp", "Status"];
    const rows = requests.map((r) => [
      r.id,
      r.email,
      topicLabel(r.topic),
      `"${r.message.replace(/"/g, '""')}"`,
      formatDate(r.timestamp),
      r.processed ? "Processed" : "Pending",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contact-requests-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported successfully");
  };

  const filteredRequests = (requests ?? []).filter((r) => {
    if (filterStatus === "pending") return !r.processed;
    if (filterStatus === "processed") return r.processed;
    return true;
  });

  return (
    <div className="admin-panel-contacts rounded-lg p-4 -m-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="admin-icon-bg rounded-lg p-2">
            <Mail className="w-5 h-5 admin-accent-text" />
          </div>
          <div>
            <h2 className="text-xl font-bold admin-heading">
              Contact Requests
            </h2>
            <p className="text-sm admin-muted-text">
              {requests
                ? `${requests.length} total request${requests.length !== 1 ? "s" : ""}`
                : "Loading…"}
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
        {(["all", "pending", "processed"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilterStatus(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
              filterStatus === f
                ? "admin-filter-active"
                : "admin-filter-inactive"
            }`}
          >
            {f}
            {f === "all" && requests && (
              <span className="ml-1.5 opacity-60">({requests.length})</span>
            )}
            {f === "pending" && requests && (
              <span className="ml-1.5 opacity-60">
                ({requests.filter((r) => !r.processed).length})
              </span>
            )}
            {f === "processed" && requests && (
              <span className="ml-1.5 opacity-60">
                ({requests.filter((r) => r.processed).length})
              </span>
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
            <p className="text-sm font-medium text-red-400">
              Failed to load requests
            </p>
            <p className="text-xs admin-muted-text mt-1">
              {(error as Error).message}
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && filteredRequests.length === 0 && (
        <div className="text-center py-16 admin-card rounded-xl">
          <Mail className="w-12 h-12 mx-auto mb-4 admin-muted-text opacity-40" />
          <p className="admin-heading font-semibold mb-2">
            No {filterStatus !== "all" ? filterStatus : ""} requests
          </p>
          <p className="admin-muted-text text-sm">
            Contact requests will appear here.
          </p>
        </div>
      )}

      {/* Requests List */}
      {!isLoading && !error && filteredRequests.length > 0 && (
        <div className="space-y-3">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className={`admin-card rounded-xl p-5 border-l-4 transition-colors ${
                req.processed ? "border-l-teal-500/40" : "border-l-amber-500/60"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono admin-muted-text">
                    #{req.id}
                  </span>
                  <Badge
                    className={`text-xs ${req.processed ? "admin-badge-success" : "admin-badge-warning"}`}
                  >
                    {req.processed ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Processed
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </>
                    )}
                  </Badge>
                  <Badge className="admin-badge-outline text-xs">
                    {topicLabel(req.topic)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(req)}
                    disabled={updateStatus.isPending || deletingId === req.id}
                    className="admin-btn-outline gap-1.5 text-xs"
                  >
                    {updateStatus.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : req.processed ? (
                      <Clock className="w-3 h-3" />
                    ) : (
                      <CheckCircle className="w-3 h-3" />
                    )}
                    {req.processed ? "Mark Pending" : "Mark Processed"}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          deletingId === req.id || updateStatus.isPending
                        }
                        className="admin-btn-outline gap-1.5 text-xs text-red-400 hover:text-red-300 hover:border-red-500/50"
                      >
                        {deletingId === req.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="admin-dashboard">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="admin-heading">
                          Delete Contact Request
                        </AlertDialogTitle>
                        <AlertDialogDescription className="admin-muted-text">
                          Are you sure you want to permanently delete this
                          contact request from{" "}
                          <span className="font-medium text-white">
                            {req.email}
                          </span>
                          ? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="admin-btn-ghost">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(req.id)}
                          className="bg-red-600 hover:bg-red-700 text-white border-0"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <span className="admin-muted-text text-xs uppercase tracking-wide">
                    From
                  </span>
                  <p className="admin-heading font-medium mt-0.5">
                    {req.email}
                  </p>
                </div>
                <div>
                  <span className="admin-muted-text text-xs uppercase tracking-wide">
                    Received
                  </span>
                  <p className="admin-heading font-medium mt-0.5">
                    {formatDate(req.timestamp)}
                  </p>
                </div>
              </div>

              <div>
                <span className="admin-muted-text text-xs uppercase tracking-wide">
                  Message
                </span>
                <p className="admin-heading text-sm mt-1 leading-relaxed whitespace-pre-wrap">
                  {req.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
