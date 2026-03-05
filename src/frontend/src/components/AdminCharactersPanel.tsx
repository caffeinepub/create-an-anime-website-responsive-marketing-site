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
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  UserX,
  Users,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Character } from "../backend";
import {
  useDeleteCharacter,
  useGetAllCharacters,
  useReorderCharacters,
} from "../hooks/useQueries";
import { CharacterForm } from "./CharacterForm";

export function AdminCharactersPanel() {
  const { data: characters, isLoading, error, refetch } = useGetAllCharacters();
  const deleteCharacter = useDeleteCharacter();
  const reorderCharacters = useReorderCharacters();

  const [showForm, setShowForm] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(
    null,
  );

  // Local sorted list for optimistic drag-and-drop UI
  const [sortedCharacters, setSortedCharacters] = useState<Character[]>([]);

  // Drag state
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Sync local list when backend data changes
  useEffect(() => {
    if (characters) {
      const sorted = [...characters].sort(
        (a, b) => Number(a.displayOrder) - Number(b.displayOrder),
      );
      setSortedCharacters(sorted);
    }
  }, [characters]);

  const handleEdit = (character: Character) => {
    setEditingCharacter(character);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingCharacter(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCharacter(null);
  };

  const handleDelete = async (characterId: string) => {
    try {
      await deleteCharacter.mutateAsync(characterId);
      toast.success("Character deleted successfully");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete character");
    }
  };

  // ── Drag handlers ──────────────────────────────────────────────────────────

  const handleDragStart = (
    e: React.DragEvent<HTMLTableRowElement>,
    index: number,
  ) => {
    dragIndexRef.current = index;
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    // Use a transparent 1x1 pixel as drag image so the row itself shows the ghost
    const ghost = document.createElement("div");
    ghost.style.position = "absolute";
    ghost.style.top = "-9999px";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLTableRowElement>,
    index: number,
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragIndexRef.current === null || dragIndexRef.current === index) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLTableRowElement>,
    dropIndex: number,
  ) => {
    e.preventDefault();
    const fromIndex = dragIndexRef.current;
    if (fromIndex === null || fromIndex === dropIndex) {
      setDragOverIndex(null);
      setIsDragging(false);
      dragIndexRef.current = null;
      return;
    }

    // Reorder locally (optimistic update)
    const reordered = [...sortedCharacters];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    setSortedCharacters(reordered);

    setDragOverIndex(null);
    setIsDragging(false);
    dragIndexRef.current = null;

    // Persist to backend
    try {
      await reorderCharacters.mutateAsync(reordered.map((c) => c.id));
      toast.success("Character order saved");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save order");
      // Revert on failure
      if (characters) {
        const reverted = [...characters].sort(
          (a, b) => Number(a.displayOrder) - Number(b.displayOrder),
        );
        setSortedCharacters(reverted);
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragOverIndex(null);
    dragIndexRef.current = null;
  };

  if (showForm) {
    return (
      <CharacterForm character={editingCharacter} onClose={handleFormClose} />
    );
  }

  return (
    <div className="admin-panel-characters rounded-lg p-4 -m-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="admin-icon-bg rounded-lg p-2">
            <Users className="w-5 h-5 admin-accent-text" />
          </div>
          <div>
            <h2 className="text-xl font-bold admin-heading">Characters</h2>
            <p className="text-sm admin-muted-text">
              {sortedCharacters.length > 0
                ? `${sortedCharacters.length} character${sortedCharacters.length !== 1 ? "s" : ""} — drag rows to reorder`
                : isLoading
                  ? "Loading…"
                  : "0 characters"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {reorderCharacters.isPending && (
            <div className="flex items-center gap-1.5 text-xs admin-muted-text">
              <Loader2 className="w-3.5 h-3.5 animate-spin admin-accent-text" />
              <span className="hidden sm:inline">Saving order…</span>
            </div>
          )}
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
            <Plus className="w-4 h-4" /> Add Character
          </Button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin admin-accent-text mx-auto mb-3" />
          <p className="admin-muted-text text-sm">Loading characters…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-400">
              Failed to load characters
            </p>
            <p className="text-xs admin-muted-text mt-1">
              {(error as Error).message}
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && sortedCharacters.length === 0 && (
        <div className="text-center py-16 admin-card rounded-xl">
          <UserX className="w-12 h-12 mx-auto mb-4 admin-muted-text opacity-40" />
          <p className="admin-heading font-semibold mb-2">No characters yet</p>
          <p className="admin-muted-text text-sm mb-6">
            Add your first character to get started.
          </p>
          <Button onClick={handleAdd} className="admin-btn-primary gap-2">
            <Plus className="w-4 h-4" /> Add Character
          </Button>
        </div>
      )}

      {/* Characters Table */}
      {!isLoading && !error && sortedCharacters.length > 0 && (
        <div className="admin-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="admin-table-header">
                  {/* Drag handle column */}
                  <th className="w-8 px-2 py-3" aria-label="Drag to reorder" />
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text hidden sm:table-cell">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text hidden md:table-cell">
                    Weapon / Power
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text hidden lg:table-cell">
                    Traits
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y admin-table-divider">
                {sortedCharacters.map((character, index) => {
                  const isBeingDraggedOver = dragOverIndex === index;
                  const isThisRowDragging =
                    isDragging && dragIndexRef.current === index;

                  return (
                    <tr
                      key={character.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={[
                        "admin-table-row transition-colors select-none",
                        isThisRowDragging ? "opacity-40" : "",
                        isBeingDraggedOver
                          ? "border-t-2 border-t-[var(--admin-accent,theme(colors.teal.400))]"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {/* Drag handle */}
                      <td className="w-8 px-2 py-3">
                        <div
                          className="flex items-center justify-center cursor-grab active:cursor-grabbing admin-muted-text opacity-50 hover:opacity-100 transition-opacity"
                          title="Drag to reorder"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {character.imageUrl ? (
                            <img
                              src={character.imageUrl}
                              alt={character.name}
                              className="w-8 h-8 rounded-full object-cover admin-surface shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full admin-surface flex items-center justify-center shrink-0">
                              <Users className="w-4 h-4 admin-muted-text" />
                            </div>
                          )}
                          <p className="text-sm font-medium admin-heading truncate max-w-[120px]">
                            {character.name}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge className="admin-badge-secondary text-xs">
                          {character.role || "—"}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-xs admin-muted-text">
                          {character.weapon || "—"}
                        </p>
                        <p className="text-xs admin-muted-text">
                          {character.power || "—"}
                        </p>
                      </td>

                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {character.traits.slice(0, 3).map((trait) => (
                            <span
                              key={trait}
                              className="text-xs admin-badge-outline px-1.5 py-0.5 rounded"
                            >
                              {trait}
                            </span>
                          ))}
                          {character.traits.length > 3 && (
                            <span className="text-xs admin-muted-text">
                              +{character.traits.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(character)}
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
                                  Delete Character
                                </AlertDialogTitle>
                                <AlertDialogDescription className="admin-muted-text">
                                  Are you sure you want to delete "
                                  {character.name}"? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="admin-btn-outline">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(character.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  {deleteCharacter.isPending ? (
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
