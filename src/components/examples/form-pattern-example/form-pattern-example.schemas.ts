import { z } from "zod";

type FormPatternExampleValidationMessages = Readonly<{
  displayNameMax: string;
  displayNameMin: string;
  emailInvalid: string;
}>;

function createFormPatternExampleSchema(
  messages: FormPatternExampleValidationMessages,
) {
  return z.object({
    displayName: z
      .string()
      .trim()
      .min(2, messages.displayNameMin)
      .max(80, messages.displayNameMax),
    email: z.string().trim().pipe(z.email(messages.emailInvalid)),
  });
}

type FormPatternExampleSchema = ReturnType<
  typeof createFormPatternExampleSchema
>;
type FormPatternExampleInput = z.input<FormPatternExampleSchema>;
type FormPatternExampleValues = z.output<FormPatternExampleSchema>;

export { createFormPatternExampleSchema };
export type {
  FormPatternExampleInput,
  FormPatternExampleValidationMessages,
  FormPatternExampleValues,
};
