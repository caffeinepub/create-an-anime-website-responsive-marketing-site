/**
 * Utility functions for parsing and managing URL/session parameters.
 */

export function getUrlParameter(paramName: string): string | null {
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has(paramName)) return searchParams.get(paramName);
  // Also try hash-based routing
  const hash = window.location.hash;
  const hashQuery = hash.includes("?") ? hash.slice(hash.indexOf("?") + 1) : "";
  return new URLSearchParams(hashQuery).get(paramName);
}

export function storeSessionParameter(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function getSessionParameter(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function getPersistedUrlParameter(
  paramName: string,
  storageKey?: string,
): string | null {
  const key = storageKey ?? paramName;
  const fromUrl = getUrlParameter(paramName);
  if (fromUrl !== null) {
    storeSessionParameter(key, fromUrl);
    return fromUrl;
  }
  return getSessionParameter(key);
}

export function clearSessionParameter(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function getSecretFromHash(paramName: string): string | null {
  const hash = window.location.hash.slice(1);
  const params = new URLSearchParams(hash);
  const value = params.get(paramName);
  if (value) {
    // Clear from URL immediately
    const newHash = window.location.hash.replace(
      new RegExp(`[&#]?${paramName}=[^&]*`),
      "",
    );
    history.replaceState(null, "", newHash || window.location.pathname);
    storeSessionParameter(paramName, value);
  }
  return value;
}

export function getSecretParameter(paramName: string): string | null {
  return getSecretFromHash(paramName) ?? getSessionParameter(paramName);
}
