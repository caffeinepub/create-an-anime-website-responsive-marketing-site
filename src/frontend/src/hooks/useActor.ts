import { createActorWithConfig } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { BackendActor } from "../types/backend-types";
import { useInternetIdentity } from "./useInternetIdentity";

/**
 * Local useActor wrapper that creates a Backend actor using the stored
 * admin token (if any) or an anonymous identity.
 */
export function useActor() {
  const { identity } = useInternetIdentity();

  const { data: actor, isFetching } = useQuery({
    queryKey: ["actor", identity?.getPrincipal().toString() ?? "anon"],
    queryFn: async (): Promise<BackendActor | null> => {
      try {
        const agentOptions = identity ? { identity } : {};

        const instance = await createActorWithConfig(createActor, {
          agentOptions: Object.keys(agentOptions).length
            ? agentOptions
            : undefined,
        });
        // Cast to BackendActor — backend.ts has @ts-nocheck so methods exist at runtime
        return instance as unknown as BackendActor;
      } catch {
        return null;
      }
    },
    staleTime: 30_000,
    retry: false,
  });

  return { actor: actor ?? null, isFetching };
}
