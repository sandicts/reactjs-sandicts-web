import type {
  SandictsApiErrorCode,
  SandictsApiErrorResponse,
  SandictsApiValidationIssue,
} from "@/lib/api/contracts/sandicts-api-error.types";

const knownSandictsApiErrorCodes = [
  "bad_request",
  "validation_error",
  "rate_limited",
  "unauthorized",
  "invalid_google_credential",
  "invalid_magic_link_token",
  "invalid_access_token",
  "invalid_refresh_token",
  "refresh_token_expired",
  "refresh_token_reused",
  "refresh_token_revoked",
  "auth_session_inactive",
  "forbidden",
  "account_auth_forbidden",
  "external_identity_conflict",
  "resource_not_found",
  "conflict",
  "business_rule_violation",
  "internal_error",
] as const satisfies readonly SandictsApiErrorCode[];

const knownSandictsApiErrorCodeSet = new Set<string>(
  knownSandictsApiErrorCodes,
);

const unauthorizedStatusCode = 401;
const forbiddenStatusCode = 403;
const notFoundStatusCode = 404;
const conflictStatusCode = 409;
const rateLimitedStatusCode = 429;
const unprocessableEntityStatusCode = 422;
const internalServerErrorStatusCode = 500;

type SandictsApiErrorOptions<TResponseBody = unknown> = Readonly<{
  cause?: unknown;
  responseBody?: TResponseBody;
}> &
  SandictsApiErrorResponse;

class SandictsApiError<TResponseBody = unknown> extends Error {
  readonly code: SandictsApiErrorCode;
  readonly issues?: SandictsApiValidationIssue[];
  readonly path: string;
  readonly requestId: string;
  readonly responseBody?: TResponseBody;
  readonly statusCode: number;
  readonly timestamp: string;

  constructor({
    cause,
    code,
    issues,
    message,
    path,
    requestId,
    responseBody,
    statusCode,
    timestamp,
  }: SandictsApiErrorOptions<TResponseBody>) {
    super(message, { cause });

    this.name = "SandictsApiError";
    this.code = code;
    this.issues = issues;
    this.path = path;
    this.requestId = requestId;
    this.responseBody = responseBody;
    this.statusCode = statusCode;
    this.timestamp = timestamp;
  }
}

async function parseSandictsApiError(response: Response) {
  const responseBody = await readResponseJson(response);

  if (isSandictsApiErrorResponse(responseBody)) {
    return new SandictsApiError({
      ...responseBody,
      responseBody,
    });
  }

  return new SandictsApiError({
    code: mapHttpStatusToErrorCode(response.status),
    message: response.statusText || "Unexpected API error",
    path: readResponseUrlPath(response),
    requestId: response.headers.get("x-request-id") ?? "",
    responseBody,
    statusCode: response.status,
    timestamp: new Date().toISOString(),
  });
}

function isSandictsApiError(value: unknown): value is SandictsApiError {
  return value instanceof SandictsApiError;
}

function isSandictsApiErrorResponse(
  value: unknown,
): value is SandictsApiErrorResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<SandictsApiErrorResponse>;

  return (
    typeof candidate.statusCode === "number" &&
    isSandictsApiErrorCode(candidate.code) &&
    typeof candidate.message === "string" &&
    typeof candidate.path === "string" &&
    typeof candidate.requestId === "string" &&
    typeof candidate.timestamp === "string"
  );
}

function isSandictsApiErrorCode(value: unknown): value is SandictsApiErrorCode {
  return typeof value === "string" && knownSandictsApiErrorCodeSet.has(value);
}

async function readResponseJson(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json") || !response.body) {
    return undefined;
  }

  try {
    return (await response.json()) as unknown;
  } catch (error) {
    return {
      parseError:
        error instanceof Error ? error.message : "Failed to parse API error",
    };
  }
}

function readResponseUrlPath(response: Response) {
  try {
    return new URL(response.url).pathname;
  } catch {
    return response.url;
  }
}

function mapHttpStatusToErrorCode(statusCode: number): SandictsApiErrorCode {
  switch (statusCode) {
    case unauthorizedStatusCode:
      return "unauthorized";
    case forbiddenStatusCode:
      return "forbidden";
    case notFoundStatusCode:
      return "resource_not_found";
    case conflictStatusCode:
      return "conflict";
    case rateLimitedStatusCode:
      return "rate_limited";
    case unprocessableEntityStatusCode:
      return "business_rule_violation";
    default:
      return statusCode >= internalServerErrorStatusCode
        ? "internal_error"
        : "bad_request";
  }
}

export {
  isSandictsApiError,
  isSandictsApiErrorCode,
  parseSandictsApiError,
  SandictsApiError,
};
