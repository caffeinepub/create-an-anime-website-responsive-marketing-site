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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  BarChart2,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteReferral, useGetAllReferrals } from "../hooks/useQueries";
import type { ReferralSource } from "../types/backend-types";

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / 1_000_000n);
  return new Date(ms).toLocaleString();
}

function buildBreakdown(referrals: ReferralSource[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const r of referrals) {
    const key =
      r.source === "Other" && r.otherText ? `Other: ${r.otherText}` : r.source;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

export function AdminReferralsPanel() {
  const { data: referrals, isLoading, error, refetch } = useGetAllReferrals();
  const deleteReferral = useDeleteReferral();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteReferral.mutateAsync(id);
      toast.success("Referral deleted.");
    } catch (err: unknown) {
      toast.error((err as Error)?.message ?? "Failed to delete referral.");
    } finally {
      setDeletingId(null);
    }
  };

  const breakdown = referrals ? buildBreakdown(referrals) : {};

  return (
    <div className="admin-panel-referrals rounded-lg p-4 -m-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="admin-icon-bg rounded-lg p-2">
            <BarChart2 className="w-5 h-5 admin-accent-text" />
          </div>
          <div>
            <h2 className="text-xl font-bold admin-heading">Site Referrals</h2>
            <p className="text-sm admin-muted-text">
              {referrals != null
                ? `${referrals.length} total response${referrals.length !== 1 ? "s" : ""}`
                : "Loading…"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          className="admin-btn-ghost gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Summary breakdown */}
      {referrals && referrals.length > 0 && (
        <div className="admin-card rounded-xl p-4 mb-5">
          <h3 className="text-sm font-semibold admin-heading mb-3 uppercase tracking-wide">
            Source Breakdown
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(breakdown)
              .sort((a, b) => b[1] - a[1])
              .map(([source, count]) => (
                <div
                  key={source}
                  className="admin-surface rounded-lg px-3 py-1.5 flex items-center gap-2"
                >
                  <span className="text-xs admin-heading font-medium">
                    {source}
                  </span>
                  <span className="text-xs admin-accent-text font-bold">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin admin-accent-text mx-auto mb-3" />
          <p className="admin-muted-text text-sm">Loading referrals…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4"
          data-ocid="admin.referrals.error_state"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-400">
              Failed to load referrals
            </p>
            <p className="text-xs admin-muted-text mt-1">
              {(error as Error).message}
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && referrals?.length === 0 && (
        <div
          className="text-center py-16 admin-card rounded-xl"
          data-ocid="admin.referrals.empty_state"
        >
          <BarChart2 className="w-12 h-12 mx-auto mb-4 admin-muted-text opacity-40" />
          <p className="admin-heading font-semibold mb-2">
            No referral responses yet
          </p>
          <p className="admin-muted-text text-sm">
            Responses from the "How did you find us?" popup will appear here.
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && referrals && referrals.length > 0 && (
        <div className="admin-card rounded-xl overflow-hidden">
          <Table data-ocid="admin.referrals.table">
            <TableHeader>
              <TableRow className="admin-table-header border-b admin-table-divider hover:bg-transparent">
                <TableHead className="admin-muted-text text-xs uppercase tracking-wide font-semibold">
                  Source
                </TableHead>
                <TableHead className="admin-muted-text text-xs uppercase tracking-wide font-semibold">
                  Custom Answer
                </TableHead>
                <TableHead className="admin-muted-text text-xs uppercase tracking-wide font-semibold">
                  Date / Time
                </TableHead>
                <TableHead className="admin-muted-text text-xs uppercase tracking-wide font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((r, idx) => (
                <TableRow
                  key={r.id}
                  className="admin-table-row border-b admin-table-divider"
                  data-ocid={`admin.referrals.row.${idx + 1}`}
                >
                  <TableCell className="admin-heading font-medium text-sm py-3">
                    {r.source}
                  </TableCell>
                  <TableCell className="admin-muted-text text-sm py-3">
                    {r.otherText ?? <span className="opacity-40">—</span>}
                  </TableCell>
                  <TableCell className="admin-muted-text text-xs py-3 whitespace-nowrap">
                    {formatDate(r.timestamp)}
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === r.id}
                          className="admin-btn-danger h-8 w-8 p-0"
                          data-ocid={`admin.referrals.delete_button.${idx + 1}`}
                        >
                          {deletingId === r.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="admin-dashboard">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="admin-heading">
                            Delete Referral
                          </AlertDialogTitle>
                          <AlertDialogDescription className="admin-muted-text">
                            Are you sure you want to delete this referral entry
                            from{" "}
                            <span className="font-medium text-white">
                              {r.source}
                            </span>
                            ? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="admin-btn-ghost">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(r.id)}
                            className="bg-red-600 hover:bg-red-700 text-white border-0"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
