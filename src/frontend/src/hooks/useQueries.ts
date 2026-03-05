import { Principal } from "@dfinity/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Character,
  ContactRequest,
  Content,
  Episode,
  NewCharacter,
  NewContent,
  NewEpisode,
  NewRequest,
  UserProfile,
  Worldbuilding,
} from "../backend";
import { UserRole } from "../backend";
import { createActorWithConfig } from "../config";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// Helper: create an authenticated actor directly
async function makeAuthenticatedActor(identity: any) {
  return createActorWithConfig({ agentOptions: { identity } });
}

// ─── Admin / Auth ─────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ["isCallerAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity) return false;
      try {
        const actor = await makeAuthenticatedActor(identity);
        return actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!identity,
    retry: false,
  });
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ─── Contact Requests ─────────────────────────────────────────────────────────

export function useSubmitRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: NewRequest) => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.submitContactRequest(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactRequests"] });
    },
  });
}

// Alias kept for backward compatibility with ContactSection
export const useSubmitContactRequest = useSubmitRequest;

export function useGetAllRequests() {
  const { identity } = useInternetIdentity();

  return useQuery<ContactRequest[]>({
    queryKey: ["contactRequests", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity) throw new Error("Not authenticated");
      const actor = await makeAuthenticatedActor(identity);
      return actor.getContactRequests();
    },
    enabled: !!identity,
    retry: false,
  });
}

export function useUpdateRequestStatus() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
    }: { requestId: string; processed: boolean }) => {
      if (!identity) throw new Error("Not authenticated");
      const actor = await makeAuthenticatedActor(identity);
      return actor.markContactRequestProcessed(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactRequests"] });
    },
  });
}

// Note: Backend does not support deleting contact requests; this is a no-op stub
export function useDeleteContactRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_requestId: string) => {
      // Backend does not expose a deleteContactRequest method.
      throw new Error(
        "Delete contact request is not supported by the backend.",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactRequests"] });
    },
  });
}

// ─── Role Management ──────────────────────────────────────────────────────────

export function useGrantAdminRole() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principalStr: string) => {
      if (!identity) throw new Error("Not authenticated");
      let principal: Principal;
      try {
        principal = Principal.fromText(principalStr.trim());
      } catch {
        throw new Error(
          "Invalid principal ID format. Please check and try again.",
        );
      }
      const actor = await makeAuthenticatedActor(identity);
      return actor.assignCallerUserRole(principal, UserRole.admin);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isCallerAdmin"] });
    },
  });
}

// ─── Episodes ─────────────────────────────────────────────────────────────────

export function useGetAllEpisodes() {
  const { actor, isFetching } = useActor();

  return useQuery<Episode[]>({
    queryKey: ["episodes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEpisodes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateEpisode() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEpisode: NewEpisode) => {
      if (!identity) throw new Error("Not authenticated");
      const actor = await makeAuthenticatedActor(identity);
      return actor.addEpisode(newEpisode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["episodes"] });
    },
  });
}

export function useUpdateEpisode() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      episodeId,
      updatedEpisode,
    }: { episodeId: string; updatedEpisode: NewEpisode }) => {
      if (!identity) throw new Error("Not authenticated");
      const actor = await makeAuthenticatedActor(identity);
      return actor.updateEpisode(episodeId, updatedEpisode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["episodes"] });
    },
  });
}

export function useDeleteEpisode() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (episodeId: string) => {
      if (!identity) throw new Error("Not authenticated");
      const actor = await makeAuthenticatedActor(identity);
      return actor.deleteEpisode(episodeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["episodes"] });
    },
  });
}

// ─── Characters ───────────────────────────────────────────────────────────────

export function useGetAllCharacters() {
  const { actor, isFetching } = useActor();

  return useQuery<Character[]>({
    queryKey: ["characters"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCharacters();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCharacter() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCharacter: NewCharacter) => {
      if (!identity) throw new Error("Not authenticated");
      const actor = await makeAuthenticatedActor(identity);
      return actor.addCharacter(newCharacter);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["characters"] });
    },
  });
}

export function useUpdateCharacter() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      characterId,
      updatedCharacter,
    }: { characterId: string; updatedCharacter: NewCharacter }) => {
      if (!identity) throw new Error("Not authenticated");
      const actor = await makeAuthenticatedActor(identity);
      return actor.updateCharacter(characterId, updatedCharacter);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["characters"] });
    },
  });
}

export function useDeleteCharacter() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (characterId: string) => {
      if (!identity) throw new Error("Not authenticated");
      const actor = await makeAuthenticatedActor(identity);
      return actor.deleteCharacter(characterId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["characters"] });
    },
  });
}

export function useReorderCharacters() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newOrder: string[]) => {
      if (!identity) throw new Error("Not authenticated");
      const actor = await makeAuthenticatedActor(identity);
      return actor.saveCharacterOrder(newOrder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["characters"] });
    },
  });
}

// ─── Content ──────────────────────────────────────────────────────────────────

// Backend only exposes getContentById; we store a known list of IDs via a
// separate query that fetches all content by iterating known IDs.
// Since the backend has no getAllContents, we use a workaround: we cache
// content entries client-side after create/update and re-fetch by ID.
// For simplicity, we maintain a local registry of content IDs in the query cache.

export function useGetAllContents() {
  const { actor, isFetching } = useActor();

  // We use a special query key 'contentIds' to track known IDs
  const queryClient = useQueryClient();

  return useQuery<Content[]>({
    queryKey: ["contents"],
    queryFn: async () => {
      if (!actor) return [];
      // Retrieve known IDs from cache, or start with empty
      const knownIds: string[] = queryClient.getQueryData(["contentIds"]) ?? [];
      if (knownIds.length === 0) return [];
      const results = await Promise.all(
        knownIds.map((id) => actor.getContentById(id)),
      );
      return results.filter((c): c is Content => c !== null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateContent() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newContent: NewContent) => {
      if (!identity) throw new Error("Not authenticated");
      const actor = await makeAuthenticatedActor(identity);
      return actor.addContent(newContent);
    },
    onSuccess: (created) => {
      // Register the new ID
      const existing: string[] = queryClient.getQueryData(["contentIds"]) ?? [];
      queryClient.setQueryData(["contentIds"], [...existing, created.id]);
      queryClient.invalidateQueries({ queryKey: ["contents"] });
    },
  });
}

export function useUpdateContent() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contentId,
      updatedContent,
    }: { contentId: string; updatedContent: NewContent }) => {
      if (!identity) throw new Error("Not authenticated");
      const actor = await makeAuthenticatedActor(identity);
      return actor.updateContent(contentId, updatedContent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents"] });
    },
  });
}

export function useDeleteContent() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contentId: string) => {
      if (!identity) throw new Error("Not authenticated");
      const actor = await makeAuthenticatedActor(identity);
      return actor.deleteContent(contentId);
    },
    onSuccess: (_data, contentId) => {
      // Remove the ID from the registry
      const existing: string[] = queryClient.getQueryData(["contentIds"]) ?? [];
      queryClient.setQueryData(
        ["contentIds"],
        existing.filter((id) => id !== contentId),
      );
      queryClient.invalidateQueries({ queryKey: ["contents"] });
    },
  });
}

// ─── Worldbuilding ────────────────────────────────────────────────────────────

export function useGetWorldbuilding() {
  const { actor, isFetching } = useActor();

  return useQuery<Worldbuilding | null>({
    queryKey: ["worldbuilding"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWorldbuilding();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateWorldbuilding() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (worldbuildingData: Worldbuilding) => {
      if (!identity) throw new Error("Not authenticated");
      const actor = await makeAuthenticatedActor(identity);
      return actor.setWorldbuilding(worldbuildingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worldbuilding"] });
    },
  });
}
