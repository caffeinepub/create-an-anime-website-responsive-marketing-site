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
  FileText,
  FileX,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import type { Content } from "../backend";
import { useDeleteContent, useGetAllContents } from "../hooks/useQueries";
import { ContentForm } from "./ContentForm";

export function AdminContentPanel() {
  const { data: contents, isLoading, error, refetch } = useGetAllContents();
  const deleteContent = useDeleteContent();

  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingContent(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingContent(null);
  };

  const handleDelete = async (contentId: string) => {
    try {
      await deleteContent.mutateAsync(contentId);
      toast.success("Content deleted successfully");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete content");
    }
  };

  if (showForm) {
    return <ContentForm content={editingContent} onClose={handleFormClose} />;
  }

  return (
    <div className="admin-panel-content rounded-lg p-4 -m-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="admin-icon-bg rounded-lg p-2">
            <FileText className="w-5 h-5 admin-accent-text" />
          </div>
          <div>
            <h2 className="text-xl font-bold admin-heading">Content</h2>
            <p className="text-sm admin-muted-text">
              {contents
                ? `${contents.length} entr${contents.length !== 1 ? "ies" : "y"}`
                : "Loading…"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
            size="sm"
            onClick={handleAdd}
            className="admin-btn-primary gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Content
          </Button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin admin-accent-text mx-auto mb-3" />
          <p className="admin-muted-text text-sm">Loading content…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-400">
              Failed to load content
            </p>
            <p className="text-xs admin-muted-text mt-1">
              {(error as Error).message}
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && (contents ?? []).length === 0 && (
        <div className="text-center py-16 admin-card rounded-xl">
          <FileX className="w-12 h-12 mx-auto mb-4 admin-muted-text opacity-40" />
          <p className="admin-heading font-semibold mb-2">No content yet</p>
          <p className="admin-muted-text text-sm mb-6">
            Add your first content entry to get started.
          </p>
          <Button onClick={handleAdd} className="admin-btn-primary gap-2">
            <Plus className="w-4 h-4" /> Add Content
          </Button>
        </div>
      )}

      {/* Content Table */}
      {!isLoading && !error && (contents ?? []).length > 0 && (
        <div className="admin-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="admin-table-header">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text hidden md:table-cell">
                    Body Preview
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text hidden lg:table-cell">
                    Image
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y admin-table-divider">
                {(contents ?? []).map((item) => (
                  <tr
                    key={item.id}
                    className="admin-table-row transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Badge className="admin-badge-secondary text-xs capitalize">
                        {item.contentType}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium admin-heading truncate max-w-[180px]">
                        {item.title}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-xs admin-muted-text truncate max-w-[220px]">
                        {item.body}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span
                        className={`text-xs ${item.imageUrl ? "text-green-400" : "admin-muted-text opacity-50"}`}
                      >
                        {item.imageUrl ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="admin-btn-ghost h-8 w-8 p-0"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="admin-btn-danger h-8 w-8 p-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="admin-dialog">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="admin-heading">
                                Delete Content
                              </AlertDialogTitle>
                              <AlertDialogDescription className="admin-muted-text">
                                Are you sure you want to delete "{item.title}"?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="admin-btn-outline">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                {deleteContent.isPending ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  "Delete"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
