import {
  createActorWithConfig as _createActorWithConfig,
  type CreateActorOptions,
} from "@caffeineai/core-infrastructure";
import { createActor } from "./backend";
import type { BackendActor } from "./types/backend-types";

/**
 * Creates an authenticated backend actor using the stored configuration.
 * Wraps the core-infrastructure helper with our specific createActor function.
 */
export async function createActorWithConfig(
  options: CreateActorOptions = {},
): Promise<BackendActor> {
  const instance = await _createActorWithConfig(createActor, options);
  // Cast to BackendActor — backend.ts has @ts-nocheck so methods exist at runtime
  return instance as unknown as BackendActor;
}
