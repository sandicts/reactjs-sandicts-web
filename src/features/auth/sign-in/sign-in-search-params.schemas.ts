import { z } from "zod";
import type { SignInReason } from "./sign-in-screen.types";

type RawSignInSearchParams = Readonly<
  Record<string, string | string[] | undefined>
>;

const signInSearchParamsSchema = z.object({
  reason: z.literal("session-expired").optional(),
  returnTo: z.string().max(2_048).optional(),
});

function parseSignInSearchParams(value: RawSignInSearchParams) {
  const result = signInSearchParamsSchema.safeParse({
    reason: readSingleValue(value.reason),
    returnTo: readSingleValue(value.returnTo),
  });

  if (!result.success) {
    return {};
  }

  return result.data satisfies Readonly<{
    reason?: SignInReason;
    returnTo?: string;
  }>;
}

function readSingleValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export { parseSignInSearchParams, signInSearchParamsSchema };
export type { RawSignInSearchParams };
