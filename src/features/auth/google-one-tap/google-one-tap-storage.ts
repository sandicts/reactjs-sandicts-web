type GoogleOneTapSuppressionReason =
  | "application-cancelled"
  | "automatic-prompt-attempted"
  | "credential-exchange-failed";

type AttemptRecord = Readonly<{
  attemptedAt: number;
  version: 1;
}>;

type SuppressionRecord = Readonly<{
  reasonCategory: GoogleOneTapSuppressionReason;
  suppressedUntil: number;
  version: 1;
}>;

const googleOneTapAttemptStorageKey = "sandicts.auth.google-one-tap.attempt.v1";
const googleOneTapSuppressionStorageKey =
  "sandicts.auth.google-one-tap.suppression.v1";
const googleOneTapSuppressionDurationMs = 24 * 60 * 60 * 1_000;
const suppressionReasons = new Set<GoogleOneTapSuppressionReason>([
  "application-cancelled",
  "automatic-prompt-attempted",
  "credential-exchange-failed",
]);

let inMemoryAttempted = false;

function hasGoogleOneTapAttempted() {
  const record = readStorageRecord<AttemptRecord>(
    "sessionStorage",
    googleOneTapAttemptStorageKey,
  );

  if (!record) {
    return inMemoryAttempted;
  }

  if (
    record.version !== 1 ||
    !Number.isFinite(record.attemptedAt) ||
    record.attemptedAt <= 0
  ) {
    removeStorageRecord("sessionStorage", googleOneTapAttemptStorageKey);
    return inMemoryAttempted;
  }

  return true;
}

function markGoogleOneTapAttempted(now = Date.now()) {
  inMemoryAttempted = true;
  writeStorageRecord("sessionStorage", googleOneTapAttemptStorageKey, {
    attemptedAt: now,
    version: 1,
  } satisfies AttemptRecord);
}

function hasGoogleOneTapSuppression(now = Date.now()) {
  const record = readStorageRecord<SuppressionRecord>(
    "localStorage",
    googleOneTapSuppressionStorageKey,
  );

  if (!record) {
    return false;
  }

  if (
    record.version !== 1 ||
    !suppressionReasons.has(record.reasonCategory) ||
    !Number.isFinite(record.suppressedUntil) ||
    record.suppressedUntil <= now
  ) {
    removeStorageRecord("localStorage", googleOneTapSuppressionStorageKey);
    return false;
  }

  return true;
}

function suppressGoogleOneTap(
  reasonCategory: GoogleOneTapSuppressionReason,
  now = Date.now(),
) {
  writeStorageRecord("localStorage", googleOneTapSuppressionStorageKey, {
    reasonCategory,
    suppressedUntil: now + googleOneTapSuppressionDurationMs,
    version: 1,
  } satisfies SuppressionRecord);
}

function clearGoogleOneTapState() {
  inMemoryAttempted = false;
  removeStorageRecord("sessionStorage", googleOneTapAttemptStorageKey);
  removeStorageRecord("localStorage", googleOneTapSuppressionStorageKey);
}

function resetGoogleOneTapStorageForTests() {
  clearGoogleOneTapState();
}

type BrowserStorageName = "localStorage" | "sessionStorage";

function readStorageRecord<T>(
  storageName: BrowserStorageName,
  key: string,
): T | null {
  try {
    const rawValue = readBrowserStorage(storageName)?.getItem(key);

    return rawValue ? (JSON.parse(rawValue) as T) : null;
  } catch {
    removeStorageRecord(storageName, key);
    return null;
  }
}

function writeStorageRecord(
  storageName: BrowserStorageName,
  key: string,
  value: unknown,
) {
  try {
    readBrowserStorage(storageName)?.setItem(key, JSON.stringify(value));
  } catch {
    // Browser storage is optional. The caller keeps an in-memory attempt guard.
  }
}

function removeStorageRecord(storageName: BrowserStorageName, key: string) {
  try {
    readBrowserStorage(storageName)?.removeItem(key);
  } catch {
    // A blocked storage API must not affect public browsing or auth fallback.
  }
}

function readBrowserStorage(storageName: BrowserStorageName) {
  return typeof window === "undefined" ? null : window[storageName];
}

export {
  clearGoogleOneTapState,
  googleOneTapAttemptStorageKey,
  googleOneTapSuppressionDurationMs,
  googleOneTapSuppressionStorageKey,
  hasGoogleOneTapAttempted,
  hasGoogleOneTapSuppression,
  markGoogleOneTapAttempted,
  resetGoogleOneTapStorageForTests,
  suppressGoogleOneTap,
};
export type { GoogleOneTapSuppressionReason };
