// Safe wrapper around localStorage. Private windows, blocked site data or a full
// quota must never crash the app (Final Exam boundary case E).

export const STORAGE_KEYS = {
  lang: 'taf_lang',
  profile: 'taf_profile_v2',
  analysis: 'taf_analysis_v2',
  feedback: 'taf_feedback',
} as const;

function getStore(): Storage | null {
  try {
    const store = window.localStorage;
    const probe = '__taf_probe__';
    store.setItem(probe, '1');
    store.removeItem(probe);
    return store;
  } catch {
    return null;
  }
}

export function isStorageAvailable(): boolean {
  return getStore() !== null;
}

export function readJson<T>(key: string, validate: (value: unknown) => value is T): T | null {
  const store = getStore();
  if (!store) return null;
  try {
    const raw = store.getItem(key);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return validate(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Returns false when the value could not be saved. */
export function writeJson(key: string, value: unknown): boolean {
  const store = getStore();
  if (!store) return false;
  try {
    store.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function readString(key: string): string | null {
  const store = getStore();
  if (!store) return null;
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

export function writeString(key: string, value: string): boolean {
  const store = getStore();
  if (!store) return false;
  try {
    store.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string): void {
  const store = getStore();
  if (!store) return;
  try {
    store.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** Deletes every value this app stores in the browser. */
export function clearAllAppData(): void {
  Object.values(STORAGE_KEYS).forEach(removeKey);
}
