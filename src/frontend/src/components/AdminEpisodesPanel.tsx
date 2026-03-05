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
  Film,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Tv,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import type { Episode } from "../backend";
import { useDeleteEpisode, useGetAllEpisodes } from "../hooks/useQueries";
import { EpisodeForm } from "./EpisodeForm";

export function AdminEpisodesPanel() {
  const { data: episodes, isLoading, error, refetch } = useGetAllEpisodes();
  const deleteEpisode = useDeleteEpisode();

  const [showForm, setShowForm] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);

  const handleEdit = (episode: Episode) => {
    setEditingEpisode(episode);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingEpisode(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEpisode(null);
  };

  const handleDelete = async (episodeId: string) => {
    try {
      await deleteEpisode.mutateAsync(episodeId);
      toast.success("Episode deleted successfully");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete episode");
    }
  };

  const sortedEpisodes = [...(episodes ?? [])].sort((a, b) => {
    if (Number(a.seasonNumber) !== Number(b.seasonNumber)) {
      return Number(a.seasonNumber) - Number(b.seasonNumber);
    }
    return Number(a.episodeNumber) - Number(b.episodeNumber);
  });

  if (showForm) {
    return <EpisodeForm episode={editingEpisode} onClose={handleFormClose} />;
  }

  return (
    <div className="admin-panel-episodes rounded-lg p-4 -m-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="admin-icon-bg rounded-lg p-2">
            <Film className="w-5 h-5 admin-accent-text" />
          </div>
          <div>
            <h2 className="text-xl font-bold admin-heading">Episodes</h2>
            <p className="text-sm admin-muted-text">
              {episodes
                ? `${episodes.length} episode${episodes.length !== 1 ? "s" : ""}`
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
            <Plus className="w-4 h-4" /> Add Episode
          </Button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin admin-accent-text mx-auto mb-3" />
          <p className="admin-muted-text text-sm">Loading episodes…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-400">
              Failed to load episodes
            </p>
            <p className="text-xs admin-muted-text mt-1">
              {(error as Error).message}
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && sortedEpisodes.length === 0 && (
        <div className="text-center py-16 admin-card rounded-xl">
          <Tv className="w-12 h-12 mx-auto mb-4 admin-muted-text opacity-40" />
          <p className="admin-heading font-semibold mb-2">No episodes yet</p>
          <p className="admin-muted-text text-sm mb-6">
            Add your first episode to get started.
          </p>
          <Button onClick={handleAdd} className="admin-btn-primary gap-2">
            <Plus className="w-4 h-4" /> Add Episode
          </Button>
        </div>
      )}

      {/* Episodes Table */}
      {!isLoading && !error && sortedEpisodes.length > 0 && (
        <div className="admin-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="admin-table-header">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text">
                    S/E
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text hidden md:table-cell">
                    Description
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text hidden lg:table-cell">
                    Video URL
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y admin-table-divider">
                {sortedEpisodes.map((episode) => (
                  <tr
                    key={episode.id}
                    className="admin-table-row transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Badge className="admin-badge-secondary text-xs font-mono">
                        S{String(Number(episode.seasonNumber)).padStart(2, "0")}
                        E
                        {String(Number(episode.episodeNumber)).padStart(2, "0")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium admin-heading truncate max-w-[180px]">
                        {episode.title}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-xs admin-muted-text truncate max-w-[200px]">
                        {episode.description}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-xs admin-muted-text font-mono truncate max-w-[160px]">
                        {episode.videoUrl || (
                          <span className="italic opacity-50">No URL</span>
                        )}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(episode)}
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
                                Delete Episode
                              </AlertDialogTitle>
                              <AlertDialogDescription className="admin-muted-text">
                                Are you sure you want to delete "{episode.title}
                                "? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="admin-btn-outline">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(episode.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                {deleteEpisode.isPending ? (
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
