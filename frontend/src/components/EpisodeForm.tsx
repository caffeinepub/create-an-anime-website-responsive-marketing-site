import React from 'react';
import { useForm } from 'react-hook-form';
import { Episode, NewEpisode } from '../backend';
import { useCreateEpisode, useUpdateEpisode } from '../hooks/useQueries';
import { ArrowLeft, Save, Loader2, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface EpisodeFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  episodeNumber: number;
  seasonNumber: number;
}

interface EpisodeFormProps {
  episode: Episode | null;
  onClose: () => void;
}

export function EpisodeForm({ episode, onClose }: EpisodeFormProps) {
  const isEditing = !!episode;
  const createEpisode = useCreateEpisode();
  const updateEpisode = useUpdateEpisode();

  const { register, handleSubmit, formState: { errors } } = useForm<EpisodeFormData>({
    defaultValues: {
      title: episode?.title ?? '',
      description: episode?.description ?? '',
      videoUrl: episode?.videoUrl ?? '',
      thumbnailUrl: episode?.thumbnailUrl ?? '',
      episodeNumber: episode ? Number(episode.episodeNumber) : 1,
      seasonNumber: episode ? Number(episode.seasonNumber) : 1,
    },
  });

  const isPending = createEpisode.isPending || updateEpisode.isPending;

  const onSubmit = async (data: EpisodeFormData) => {
    const payload: NewEpisode = {
      title: data.title.trim(),
      description: data.description.trim(),
      videoUrl: data.videoUrl.trim(),
      thumbnailUrl: data.thumbnailUrl.trim(),
      episodeNumber: BigInt(data.episodeNumber),
      seasonNumber: BigInt(data.seasonNumber),
    };

    try {
      if (isEditing && episode) {
        await updateEpisode.mutateAsync({ episodeId: episode.id, episode: payload });
        toast.success('Episode updated successfully');
      } else {
        await createEpisode.mutateAsync(payload);
        toast.success('Episode created successfully');
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to save episode');
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
            <Film className="w-5 h-5 admin-accent-text" />
          </div>
          <div>
            <h2 className="text-xl font-bold admin-heading">
              {isEditing ? 'Edit Episode' : 'Add New Episode'}
            </h2>
            <p className="text-sm admin-muted-text">
              {isEditing ? `Editing: ${episode?.title}` : 'Fill in the episode details below'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="admin-card rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label className="admin-label">Season Number</Label>
            <Input
              type="number"
              min={1}
              className="admin-input"
              {...register('seasonNumber', { required: 'Required', min: { value: 1, message: 'Min 1' }, valueAsNumber: true })}
            />
            {errors.seasonNumber && <p className="text-xs text-red-400">{errors.seasonNumber.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label className="admin-label">Episode Number</Label>
            <Input
              type="number"
              min={1}
              className="admin-input"
              {...register('episodeNumber', { required: 'Required', min: { value: 1, message: 'Min 1' }, valueAsNumber: true })}
            />
            {errors.episodeNumber && <p className="text-xs text-red-400">{errors.episodeNumber.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="admin-label">Title</Label>
          <Input
            className="admin-input"
            placeholder="Episode title"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="admin-label">Description</Label>
          <Textarea
            className="admin-input min-h-[100px]"
            placeholder="Episode description"
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="admin-label">Video URL</Label>
          <Input
            className="admin-input"
            placeholder="https://..."
            {...register('videoUrl')}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="admin-label">Thumbnail URL</Label>
          <Input
            className="admin-input"
            placeholder="https://..."
            {...register('thumbnailUrl')}
          />
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
              <><Save className="w-4 h-4" /> {isEditing ? 'Update Episode' : 'Create Episode'}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
