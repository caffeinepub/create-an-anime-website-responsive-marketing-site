import React, { useState } from 'react';
import { useGetAllCharacters, useDeleteCharacter } from '../hooks/useQueries';
import { Character } from '../backend';
import { CharacterForm } from './CharacterForm';
import {
  Users, Plus, Pencil, Trash2, Loader2, AlertCircle, RefreshCw, UserX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export function AdminCharactersPanel() {
  const { data: characters, isLoading, error, refetch } = useGetAllCharacters();
  const deleteCharacter = useDeleteCharacter();

  const [showForm, setShowForm] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

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
      toast.success('Character deleted successfully');
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to delete character');
    }
  };

  if (showForm) {
    return (
      <CharacterForm
        character={editingCharacter}
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
            <Users className="w-5 h-5 admin-accent-text" />
          </div>
          <div>
            <h2 className="text-xl font-bold admin-heading">Characters</h2>
            <p className="text-sm admin-muted-text">
              {characters ? `${characters.length} character${characters.length !== 1 ? 's' : ''}` : 'Loading…'}
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
            <p className="text-sm font-medium text-red-400">Failed to load characters</p>
            <p className="text-xs admin-muted-text mt-1">{(error as Error).message}</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && (characters ?? []).length === 0 && (
        <div className="text-center py-16 admin-card rounded-xl">
          <UserX className="w-12 h-12 mx-auto mb-4 admin-muted-text opacity-40" />
          <p className="admin-heading font-semibold mb-2">No characters yet</p>
          <p className="admin-muted-text text-sm mb-6">Add your first character to get started.</p>
          <Button onClick={handleAdd} className="admin-btn-primary gap-2">
            <Plus className="w-4 h-4" /> Add Character
          </Button>
        </div>
      )}

      {/* Characters Table */}
      {!isLoading && !error && (characters ?? []).length > 0 && (
        <div className="admin-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="admin-table-header">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text hidden sm:table-cell">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text hidden md:table-cell">Weapon / Power</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text hidden lg:table-cell">Traits</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider admin-muted-text">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y admin-table-divider">
                {(characters ?? []).map((character) => (
                  <tr key={character.id} className="admin-table-row transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {character.imageUrl ? (
                          <img
                            src={character.imageUrl}
                            alt={character.name}
                            className="w-8 h-8 rounded-full object-cover admin-surface shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full admin-surface flex items-center justify-center shrink-0">
                            <Users className="w-4 h-4 admin-muted-text" />
                          </div>
                        )}
                        <p className="text-sm font-medium admin-heading truncate max-w-[120px]">{character.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge className="admin-badge-secondary text-xs">{character.role || '—'}</Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-xs admin-muted-text">{character.weapon || '—'}</p>
                      <p className="text-xs admin-muted-text">{character.power || '—'}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {character.traits.slice(0, 3).map((trait, i) => (
                          <span key={i} className="text-xs admin-badge-outline px-1.5 py-0.5 rounded">{trait}</span>
                        ))}
                        {character.traits.length > 3 && (
                          <span className="text-xs admin-muted-text">+{character.traits.length - 3}</span>
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
                              <AlertDialogTitle className="admin-heading">Delete Character</AlertDialogTitle>
                              <AlertDialogDescription className="admin-muted-text">
                                Are you sure you want to delete "{character.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="admin-btn-outline">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(character.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                {deleteCharacter.isPending ? (
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
