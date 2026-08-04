import { z } from "zod";

const authenticatedAccountSummarySchema = z.object({
  displayName: z.string().nullable(),
  email: z.email(),
  id: z.string().min(1),
});

const authSessionSummarySchema = z.object({
  id: z.string().min(1),
});

const authSessionProjectionSchema = z.object({
  account: authenticatedAccountSummarySchema,
  session: authSessionSummarySchema,
});

const authSessionSnapshotSchema = authSessionProjectionSchema.extend({
  accessToken: z.string().min(1),
  accessTokenExpiresAt: z.iso.datetime(),
});

export { authSessionProjectionSchema, authSessionSnapshotSchema };
