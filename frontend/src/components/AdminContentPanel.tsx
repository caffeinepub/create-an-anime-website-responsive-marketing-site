import React, { useState } from 'react';
import { useGetAllContents, useDeleteContent } from '../hooks/useQueries';
import { Content } from '../backend';
import { ContentForm } from './ContentForm';
import {
  FileText, Plus, Pencil, Trash2, Loader2, AlertCircle, RefreshCw, FileX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

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
      toast.success('Content deleted successfully');
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to delete content');
    }
  };

  if (showForm) {
    return (
      <ContentForm
        content={editingContent}
        onClose={handleFormClose}
      />
    );
  }

  return (
    <div>
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="admin-icon-bg rounded-lg p-2">
            <FileText className="w-5 h-5 admin-accent-text" />
          </div>
          <div>
            <h2 className="text-xl font-bold admin-heading">Content</h2>
            <p className="text-sm admin-muted-text">
              {contents ? `${contents.length} entr${contents.length !== 1 ? 'ies' : 'y'}` : 'Loading…'}
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
            <p className="text-sm font-medium text-red-400">Failed to load content</p>
            <p className="text-xs admin-muted-text mt-1">{(error as Error).message}</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && (contents ?? []).length === 0 && (
        <div className="text-center py-16 admin-card rounded-xl">
          <FileX className="w-12 h-12 mx-auto mb-4 admin-muted-text opacity-40" />
          <p className="admin-heading font-semibold mb-2">No content yet</p>
          <p className="admin-muted-text text-sm mb-6">Add announcements, lore entries, and more.</p>
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
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text hidden md:table-cell">Body</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text hidden lg:table-cell">Image</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y admin-table-divider">
                {(contents ?? []).map((content) => (
                  <tr key={content.id} className="admin-table-row transition-colors">
                    <td className="px-4 py-3">
                      <Badge className="admin-badge-secondary text-xs capitalize">{content.contentType}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium admin-heading truncate max-w-[160px]">{content.title}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-xs admin-muted-text truncate max-w-[220px]">{content.body}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {content.imageUrl ? (
                        <span className="text-xs text-teal-400 font-mono truncate max-w-[120px] block">✓ Set</span>
                      ) : (
                        <span className="text-xs admin-muted-text italic">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(content)}
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
                              <AlertDialogTitle className="admin-heading">Delete Content</AlertDialogTitle>
                              <AlertDialogDescription className="admin-muted-text">
                                Are you sure you want to delete "{content.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="admin-btn-outline">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(content.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                {deleteContent.isPending ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : 'Delete'}
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
