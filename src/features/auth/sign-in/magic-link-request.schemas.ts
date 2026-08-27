import { z } from "zod";

function createMagicLinkRequestSchema(emailInvalid: string) {
  return z.object({
    email: z.string().trim().pipe(z.email(emailInvalid)),
  });
}

type MagicLinkRequestSchema = ReturnType<typeof createMagicLinkRequestSchema>;
type MagicLinkRequestInput = z.input<MagicLinkRequestSchema>;
type MagicLinkRequestValues = z.output<MagicLinkRequestSchema>;

export { createMagicLinkRequestSchema };
export type { MagicLinkRequestInput, MagicLinkRequestValues };
