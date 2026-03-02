import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type {
  ContactRequest,
  NewRequest,
  Episode,
  NewEpisode,
  Character,
  NewCharacter,
  Content,
  NewContent,
  UserProfile,
} from '../backend';
import { Principal } from '@dfinity/principal';
import { createActorWithConfig } from '../config';

// Helper: create an authenticated actor directly
async function makeAuthenticatedActor(identity: any) {
  return createActorWithConfig({ agentOptions: { identity } });
}

// ─── Admin / Auth ─────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin', identity?.getPrincipal().toString()],
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
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
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
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Contact Requests ─────────────────────────────────────────────────────────

export function useSubmitRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: NewRequest) => {
      if (!actor) throw new Error('Not connected to backend');
      return actor.submitRequest(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactRequests'] });
    },
  });
}

// Alias kept for backward compatibility with ContactSection
export const useSubmitContactRequest = useSubmitRequest;

export function useGetAllRequests() {
  const { identity } = useInternetIdentity();

  return useQuery<ContactRequest[]>({
    queryKey: ['contactRequests', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity) throw new Error('Not authenticated');
      const actor = await makeAuthenticatedActor(identity);
      return actor.getAllRequests();
    },
    enabled: !!identity,
    retry: false,
  });
}

export function useUpdateRequestStatus() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, processed }: { requestId: string; processed: boolean }) => {
      if (!identity) throw new Error('Not authenticated');
      const actor = await makeAuthenticatedActor(identity);
      return actor.updateRequestStatus(requestId, processed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactRequests'] });
    },
  });
}

export function useDeleteContactRequest() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      if (!identity) throw new Error('Not authenticated');
      const actor = await makeAuthenticatedActor(identity);
      return actor.deleteContactRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactRequests'] });
    },
  });
}

// ─── Role Management ──────────────────────────────────────────────────────────

export function useGrantAdminRole() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principalStr: string) => {
      if (!identity) throw new Error('Not authenticated');
      let principal: Principal;
      try {
        principal = Principal.fromText(principalStr.trim());
      } catch {
        throw new Error('Invalid principal ID format. Please check and try again.');
      }
      const actor = await makeAuthenticatedActor(identity);
      return actor.grantAdminRole(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
    },
  });
}

// ─── Episodes ─────────────────────────────────────────────────────────────────

export function useGetAllEpisodes() {
  const { actor, isFetching } = useActor();

  return useQuery<Episode[]>({
    queryKey: ['episodes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEpisodes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateEpisode() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEpisode: NewEpisode) => {
      if (!identity) throw new Error('Not authenticated');
      const actor = await makeAuthenticatedActor(identity);
      return actor.createEpisode(newEpisode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
    },
  });
}

export function useUpdateEpisode() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ episodeId, updatedEpisode }: { episodeId: string; updatedEpisode: NewEpisode }) => {
      if (!identity) throw new Error('Not authenticated');
      const actor = await makeAuthenticatedActor(identity);
      return actor.updateEpisode(episodeId, updatedEpisode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
    },
  });
}

export function useDeleteEpisode() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (episodeId: string) => {
      if (!identity) throw new Error('Not authenticated');
      const actor = await makeAuthenticatedActor(identity);
      return actor.deleteEpisode(episodeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
    },
  });
}

// ─── Characters ───────────────────────────────────────────────────────────────

export function useGetAllCharacters() {
  const { actor, isFetching } = useActor();

  return useQuery<Character[]>({
    queryKey: ['characters'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCharacters();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCharacter() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCharacter: NewCharacter) => {
      if (!identity) throw new Error('Not authenticated');
      const actor = await makeAuthenticatedActor(identity);
      return actor.createCharacter(newCharacter);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
}

export function useUpdateCharacter() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ characterId, updatedCharacter }: { characterId: string; updatedCharacter: NewCharacter }) => {
      if (!identity) throw new Error('Not authenticated');
      const actor = await makeAuthenticatedActor(identity);
      return actor.updateCharacter(characterId, updatedCharacter);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
}

export function useDeleteCharacter() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (characterId: string) => {
      if (!identity) throw new Error('Not authenticated');
      const actor = await makeAuthenticatedActor(identity);
      return actor.deleteCharacter(characterId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
}

export function useReorderCharacters() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newOrder: string[]) => {
      if (!identity) throw new Error('Not authenticated');
      const actor = await makeAuthenticatedActor(identity);
      return actor.reorderCharacters(newOrder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
}

// ─── Content ──────────────────────────────────────────────────────────────────

export function useGetAllContents() {
  const { actor, isFetching } = useActor();

  return useQuery<Content[]>({
    queryKey: ['contents'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateContent() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newContent: NewContent) => {
      if (!identity) throw new Error('Not authenticated');
      const actor = await makeAuthenticatedActor(identity);
      return actor.createContent(newContent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
  });
}

export function useUpdateContent() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contentId, updatedContent }: { contentId: string; updatedContent: NewContent }) => {
      if (!identity) throw new Error('Not authenticated');
      const actor = await makeAuthenticatedActor(identity);
      return actor.updateContent(contentId, updatedContent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
  });
}

export function useDeleteContent() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contentId: string) => {
      if (!identity) throw new Error('Not authenticated');
      const actor = await makeAuthenticatedActor(identity);
      return actor.deleteContent(contentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
  });
}
