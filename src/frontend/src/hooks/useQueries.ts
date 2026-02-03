import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { NewRequest, ContactRequest } from '../backend';

export function useSubmitContactRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: NewRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitRequest(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactRequests'] });
    },
  });
}

export function useGetAllRequests(enabled: boolean) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ContactRequest[]>({
    queryKey: ['contactRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllRequests();
    },
    enabled: !!actor && !actorFetching && enabled,
    retry: false,
  });
}

export function useUpdateRequestStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, processed }: { requestId: string; processed: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateRequestStatus(requestId, processed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactRequests'] });
    },
  });
}
