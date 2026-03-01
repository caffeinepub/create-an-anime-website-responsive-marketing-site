import React from 'react';
import { useForm } from 'react-hook-form';
import { Character, NewCharacter } from '../backend';
import { useCreateCharacter, useUpdateCharacter } from '../hooks/useQueries';
import { ArrowLeft, Save, Loader2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface CharacterFormData {
  name: string;
  bio: string;
  imageUrl: string;
  weapon: string;
  power: string;
  role: string;
  traits: string; // comma-separated
}

interface CharacterFormProps {
  character: Character | null;
  onClose: () => void;
}

export function CharacterForm({ character, onClose }: CharacterFormProps) {
  const isEditing = !!character;
  const createCharacter = useCreateCharacter();
  const updateCharacter = useUpdateCharacter();

  const { register, handleSubmit, formState: { errors } } = useForm<CharacterFormData>({
    defaultValues: {
      name: character?.name ?? '',
      bio: character?.bio ?? '',
      imageUrl: character?.imageUrl ?? '',
      weapon: character?.weapon ?? '',
      power: character?.power ?? '',
      role: character?.role ?? '',
      traits: character?.traits.join(', ') ?? '',
    },
  });

  const isPending = createCharacter.isPending || updateCharacter.isPending;

  const onSubmit = async (data: CharacterFormData) => {
    const traits = data.traits
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload: NewCharacter = {
      name: data.name.trim(),
      bio: data.bio.trim(),
      imageUrl: data.imageUrl.trim(),
      weapon: data.weapon.trim(),
      power: data.power.trim(),
      role: data.role.trim(),
      traits,
    };

    try {
      if (isEditing && character) {
        await updateCharacter.mutateAsync({ characterId: character.id, character: payload });
        toast.success('Character updated successfully');
      } else {
        await createCharacter.mutateAsync(payload);
        toast.success('Character created successfully');
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to save character');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="admin-btn-ghost gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div className="flex items-center gap-3">
          <div className="admin-icon-bg rounded-lg p-2">
            <Users className="w-5 h-5 admin-accent-text" />
          </div>
          <div>
            <h2 className="text-xl font-bold admin-heading">
              {isEditing ? 'Edit Character' : 'Add New Character'}
            </h2>
            <p className="text-sm admin-muted-text">
              {isEditing ? `Editing: ${character?.name}` : 'Fill in the character details below'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="admin-card rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label className="admin-label">Name</Label>
            <Input
              className="admin-input"
              placeholder="Character name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label className="admin-label">Role</Label>
            <Input
              className="admin-input"
              placeholder="e.g. Protagonist, Antagonist"
              {...register('role', { required: 'Role is required' })}
            />
            {errors.role && <p className="text-xs text-red-400">{errors.role.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="admin-label">Bio</Label>
          <Textarea
            className="admin-input min-h-[100px]"
            placeholder="Character biography"
            {...register('bio', { required: 'Bio is required' })}
          />
          {errors.bio && <p className="text-xs text-red-400">{errors.bio.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label className="admin-label">Weapon</Label>
            <Input
              className="admin-input"
              placeholder="e.g. Katana, Bow"
              {...register('weapon')}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="admin-label">Power / Ability</Label>
            <Input
              className="admin-input"
              placeholder="e.g. Wind manipulation"
              {...register('power')}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="admin-label">Image URL</Label>
          <Input
            className="admin-input"
            placeholder="https://..."
            {...register('imageUrl')}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="admin-label">Traits <span className="admin-muted-text font-normal">(comma-separated)</span></Label>
          <Input
            className="admin-input"
            placeholder="e.g. Brave, Loyal, Mysterious"
            {...register('traits')}
          />
          <p className="text-xs admin-muted-text">Enter traits separated by commas</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t admin-sidebar-border">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="admin-btn-ghost"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="admin-btn-primary gap-2"
            disabled={isPending}
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            ) : (
              <><Save className="w-4 h-4" /> {isEditing ? 'Update Character' : 'Create Character'}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
