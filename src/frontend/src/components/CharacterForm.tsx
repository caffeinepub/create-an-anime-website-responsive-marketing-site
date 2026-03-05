import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Save, UploadCloud, Users, X } from "lucide-react";
import type React from "react";
import { useCallback, useRef, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Character, NewCharacter } from "../backend";
import { useCreateCharacter, useUpdateCharacter } from "../hooks/useQueries";

const MAX_FILE_SIZE_MB = 50;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];
const DEFAULT_NEW_IMAGE = "/assets/uploads/2-1.png";

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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CharacterFormData>({
    defaultValues: {
      name: character?.name ?? "",
      bio: character?.bio ?? "",
      imageUrl: character?.imageUrl ?? (isEditing ? "" : DEFAULT_NEW_IMAGE),
      weapon: character?.weapon ?? "",
      power: character?.power ?? "",
      role: character?.role ?? "",
      traits: character?.traits.join(", ") ?? "",
    },
  });

  // Controlled imageUrl field — keeps drag-zone + text input in sync
  const { field: imageField } = useController({ name: "imageUrl", control });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isPending = createCharacter.isPending || updateCharacter.isPending;

  // ── File processing ────────────────────────────────────────────────────────
  const processFile = useCallback(
    (file: File) => {
      setUploadError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUploadError(
          "Unsupported file type. Please use PNG, JPG, GIF, or WEBP.",
        );
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setUploadError(`File exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        imageField.onChange(dataUrl);
      };
      reader.readAsDataURL(file);
    },
    [imageField],
  );

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      // reset so same file can be re-selected
      e.target.value = "";
    },
    [processFile],
  );

  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    imageField.onChange("");
    setUploadError(null);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit = async (data: CharacterFormData) => {
    const traits = data.traits
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

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
        await updateCharacter.mutateAsync({
          characterId: character.id,
          updatedCharacter: payload,
        });
        toast.success("Character updated successfully");
      } else {
        await createCharacter.mutateAsync(payload);
        toast.success("Character created successfully");
      }
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save character";
      toast.error(message);
    }
  };

  const currentImage = imageField.value;
  const hasImage = !!currentImage;

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
              {isEditing ? "Edit Character" : "Add New Character"}
            </h2>
            <p className="text-sm admin-muted-text">
              {isEditing
                ? `Editing: ${character?.name}`
                : "Fill in the character details below"}
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="admin-card rounded-xl p-6 space-y-5"
      >
        {/* Name + Role row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label className="admin-label">Name</Label>
            <Input
              className="admin-input"
              placeholder="Character name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="admin-label">Role</Label>
            <Input
              className="admin-input"
              placeholder="e.g. Protagonist, Antagonist"
              {...register("role", { required: "Role is required" })}
            />
            {errors.role && (
              <p className="text-xs text-red-400">{errors.role.message}</p>
            )}
          </div>
        </div>

        {/* ── Image upload section ── */}
        <div className="space-y-2">
          <Label className="admin-label">Character Image</Label>

          {/* Hidden native file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="sr-only"
            onChange={handleFileChange}
            data-ocid="character.upload_button"
            tabIndex={-1}
          />

          {hasImage ? (
            /* Preview state */
            <div className="relative flex items-center gap-4 rounded-lg border-2 border-[oklch(0.55_0.14_195)] bg-[oklch(0.17_0.015_240)] p-3">
              <img
                src={currentImage}
                alt="Character preview"
                className="h-20 w-20 rounded-md object-cover flex-shrink-0 border border-[oklch(0.28_0.015_240)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23222" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-size="10"%3ENo image%3C/text%3E%3C/svg%3E';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm admin-heading font-medium truncate">
                  Image set
                </p>
                <p className="text-xs admin-muted-text mt-0.5">
                  {currentImage.startsWith("data:")
                    ? "Uploaded file"
                    : currentImage}
                </p>
                <button
                  type="button"
                  onClick={handleZoneClick}
                  className="mt-2 text-xs admin-accent-text hover:underline"
                >
                  Replace image
                </button>
              </div>
              {/* Clear button */}
              <button
                type="button"
                onClick={handleClearImage}
                aria-label="Remove image"
                className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-[oklch(0.55_0.18_25/0.2)] hover:bg-[oklch(0.55_0.18_25/0.4)] text-[oklch(0.70_0.18_25)] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Drop zone */
            <button
              type="button"
              onClick={handleZoneClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              data-ocid="character.dropzone"
              className={[
                "w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 cursor-pointer select-none transition-all duration-200",
                isDragOver
                  ? "border-[oklch(0.72_0.14_195)] bg-[oklch(0.55_0.14_195/0.08)]"
                  : "border-[oklch(0.35_0.06_195)] bg-[oklch(0.17_0.015_240)] hover:border-[oklch(0.55_0.14_195)] hover:bg-[oklch(0.55_0.14_195/0.04)]",
              ].join(" ")}
            >
              <div
                className={[
                  "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                  isDragOver
                    ? "bg-[oklch(0.55_0.14_195/0.2)]"
                    : "bg-[oklch(0.55_0.14_195/0.1)]",
                ].join(" ")}
              >
                <UploadCloud
                  className={[
                    "w-5 h-5 transition-colors",
                    isDragOver
                      ? "text-[oklch(0.80_0.14_195)]"
                      : "text-[oklch(0.65_0.12_195)]",
                  ].join(" ")}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[oklch(0.85_0.01_240)]">
                  Drag &amp; drop image here, or click to browse
                </p>
                <p className="text-xs admin-muted-text mt-0.5">
                  PNG, JPG, GIF, WEBP — max {MAX_FILE_SIZE_MB}MB
                </p>
              </div>
            </button>
          )}

          {uploadError && (
            <p
              className="text-xs text-red-400"
              data-ocid="character.error_state"
            >
              {uploadError}
            </p>
          )}

          {/* Fallback URL input */}
          <div className="space-y-1">
            <Label className="text-xs admin-muted-text">
              Or paste image URL
            </Label>
            <Input
              className="admin-input text-sm"
              placeholder="https://example.com/image.png"
              value={imageField.value}
              onChange={(e) => {
                imageField.onChange(e.target.value);
                setUploadError(null);
              }}
              onBlur={imageField.onBlur}
              name={imageField.name}
              ref={imageField.ref}
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <Label className="admin-label">Bio</Label>
          <Textarea
            className="admin-input min-h-[100px]"
            placeholder="Character biography"
            {...register("bio", { required: "Bio is required" })}
          />
          {errors.bio && (
            <p className="text-xs text-red-400">{errors.bio.message}</p>
          )}
        </div>

        {/* Weapon + Power */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label className="admin-label">Weapon</Label>
            <Input
              className="admin-input"
              placeholder="e.g. Katana, Bow"
              {...register("weapon")}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="admin-label">Power / Ability</Label>
            <Input
              className="admin-input"
              placeholder="e.g. Wind manipulation"
              {...register("power")}
            />
          </div>
        </div>

        {/* Traits */}
        <div className="space-y-1.5">
          <Label className="admin-label">
            Traits{" "}
            <span className="admin-muted-text font-normal">
              (comma-separated)
            </span>
          </Label>
          <Input
            className="admin-input"
            placeholder="e.g. Brave, Loyal, Mysterious"
            {...register("traits")}
          />
          <p className="text-xs admin-muted-text">
            Enter traits separated by commas
          </p>
        </div>

        {/* Actions */}
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
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />{" "}
                {isEditing ? "Update Character" : "Create Character"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
