type SandictsApiErrorCode =
  | "bad_request"
  | "validation_error"
  | "rate_limited"
  | "unauthorized"
  | "invalid_google_credential"
  | "invalid_magic_link_token"
  | "invalid_access_token"
  | "invalid_refresh_token"
  | "refresh_token_expired"
  | "refresh_token_reused"
  | "refresh_token_revoked"
  | "auth_session_inactive"
  | "forbidden"
  | "account_auth_forbidden"
  | "external_identity_conflict"
  | "resource_not_found"
  | "conflict"
  | "business_rule_violation"
  | "internal_error";

type SandictsApiValidationIssue = Readonly<{
  message?: unknown;
  path?: unknown;
}>;

type SandictsApiErrorResponse = Readonly<{
  code: SandictsApiErrorCode;
  issues?: SandictsApiValidationIssue[];
  message: string;
  path: string;
  requestId: string;
  statusCode: number;
  timestamp: string;
}>;

export type {
  SandictsApiErrorCode,
  SandictsApiErrorResponse,
  SandictsApiValidationIssue,
};
