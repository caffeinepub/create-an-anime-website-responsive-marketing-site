import React from 'react';
import { useForm } from 'react-hook-form';
import { Content, NewContent } from '../backend';
import { useCreateContent, useUpdateContent } from '../hooks/useQueries';
import { ArrowLeft, Save, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const CONTENT_TYPES = [
  'announcement',
  'lore',
  'news',
  'update',
  'event',
  'other',
];

interface ContentFormData {
  contentType: string;
  title: string;
  body: string;
  imageUrl: string;
}

interface ContentFormProps {
  content: Content | null;
  onClose: () => void;
}

export function ContentForm({ content, onClose }: ContentFormProps) {
  const isEditing = !!content;
  const createContent = useCreateContent();
  const updateContent = useUpdateContent();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ContentFormData>({
    defaultValues: {
      contentType: content?.contentType ?? 'announcement',
      title: content?.title ?? '',
      body: content?.body ?? '',
      imageUrl: content?.imageUrl ?? '',
    },
  });

  const contentTypeValue = watch('contentType');
  const isPending = createContent.isPending || updateContent.isPending;

  const onSubmit = async (data: ContentFormData) => {
    const payload: NewContent = {
      contentType: data.contentType.trim(),
      title: data.title.trim(),
      body: data.body.trim(),
      imageUrl: data.imageUrl.trim() || undefined,
    };

    try {
      if (isEditing && content) {
        await updateContent.mutateAsync({ contentId: content.id, content: payload });
        toast.success('Content updated successfully');
      } else {
        await createContent.mutateAsync(payload);
        toast.success('Content created successfully');
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to save content');
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
            <FileText className="w-5 h-5 admin-accent-text" />
          </div>
          <div>
            <h2 className="text-xl font-bold admin-heading">
              {isEditing ? 'Edit Content' : 'Add New Content'}
            </h2>
            <p className="text-sm admin-muted-text">
              {isEditing ? `Editing: ${content?.title}` : 'Fill in the content details below'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="admin-card rounded-xl p-6 space-y-5">
        <div className="space-y-1.5">
          <Label className="admin-label">Content Type</Label>
          <Select
            value={contentTypeValue}
            onValueChange={(val) => setValue('contentType', val)}
          >
            <SelectTrigger className="admin-input">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="admin-select-content">
              {CONTENT_TYPES.map((type) => (
                <SelectItem key={type} value={type} className="capitalize admin-select-item">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" {...register('contentType', { required: 'Content type is required' })} />
          {errors.contentType && <p className="text-xs text-red-400">{errors.contentType.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="admin-label">Title</Label>
          <Input
            className="admin-input"
            placeholder="Content title"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="admin-label">Body</Label>
          <Textarea
            className="admin-input min-h-[160px]"
            placeholder="Content body text"
            {...register('body', { required: 'Body is required' })}
          />
          {errors.body && <p className="text-xs text-red-400">{errors.body.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="admin-label">Image URL <span className="admin-muted-text font-normal">(optional)</span></Label>
          <Input
            className="admin-input"
            placeholder="https://..."
            {...register('imageUrl')}
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
              <><Save className="w-4 h-4" /> {isEditing ? 'Update Content' : 'Create Content'}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
